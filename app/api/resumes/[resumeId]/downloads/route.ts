import { authOptions } from "@app/api/auth/[...nextauth]/route";
import {
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import {
  getSignedUrl
} from "@aws-sdk/s3-request-presigner";
import { Resume } from "@models/domain/Resume";
import { Section } from "@models/domain/Section";
import { BaseErrorResponse } from "@models/dto/error";
import ResumeModel from "@models/dto/resume";
import SectionModel from "@models/dto/section";
import { createTexFromSections } from "@utils/latex/samples/compile";
import { S3_BUCKET_NAME, s3 } from "@utils/s3Bucket";
import { exec as execCallback } from "child_process";
import {
  createReadStream,
  mkdir as mkdirCallback,
  writeFile as writeFileCallback,
} from "fs";
import { mkdtemp, readFile } from "fs/promises";
import mime from "mime";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import { join } from "path";
import { rimraf } from "rimraf";
import { ReadableOptions } from "stream";
import { promisify } from "util";

const exec = promisify(execCallback);
const writeFile = promisify(writeFileCallback);
const mkdir = promisify(mkdirCallback);

// Create an S3 client
//
// You must copy the endpoint from your B2 bucket details
// and set the region to match.

function streamFile(
  path: string,
  tmpDir?: string,
  options?: ReadableOptions
): ReadableStream<Uint8Array> {
  const downloadStream = createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk))
      );
      downloadStream.on("end", async () => {
        if (tmpDir) {
          await rimraf(tmpDir);
          console.log("Removed " + tmpDir);
        }
        controller.close();
      });
      downloadStream.on("error", (error: NodeJS.ErrnoException) =>
        controller.error(error)
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

// Gets all sections related to a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  //   const test=  request.nextUrl
  //   console.log(params.resumeId)
  //   const url = 'https://resume-builder.s3.us-east-005.backblazeb2.com/resume-655ac1919441f3ab830819ed-659f53d5c836cebe761873b0.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0053776667ac9a00000000001%2F20240111%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Date=20240111T023501Z&X-Amz-Expires=3600&X-Amz-Signature=61759dbfbc1045a6f92c42db0c849f267acbcda425430a1f9bab844972ba817f&X-Amz-SignedHeaders=host&x-id=GetObject'
  // const url = 'https://resume-builder.s3.us-east-005.backblazeb2.com/resume-655ac1919441f3ab830819ed-659f66e55ce4fc9339973686.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0053776667ac9a00000000001%2F20240111%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Date=20240111T035621Z&X-Amz-Expires=3600&X-Amz-Signature=390ab59511bfc1a87193e20ba8dd6a692f62598697099114c601cb3e1ab27e5d&X-Amz-SignedHeaders=host&x-id=GetObject'
  // redirect(url)
  if (!mongoose.Types.ObjectId.isValid(params.resumeId)) {
    const errorResponse: BaseErrorResponse = {
      message: `${params.resumeId} is not a valid fileId!`,
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 400,
    });
  }
  const session = await getServerSession(authOptions);
  let outputUrl = "";

  try {
    // const sections: SectionType[] = await Section.find({
    //   userId: session?.user.id,
    // });
    // const test = await exec("dir");

    // const fileName = new mongoose.Types.UUID().toString();

    const resume: Resume | null = await ResumeModel.findById(params.resumeId);
    if (!resume) {
      const errorResponse: BaseErrorResponse = {
        message: `Resume with ID ${params.resumeId} does not exist.`,
      };
      return new NextResponse(JSON.stringify(errorResponse), {
        status: 404,
      });
    }
    let bucketFileName = "";
    if (resume.downloads?.pdf) {
      bucketFileName = resume.downloads.pdf;
    } else {
      const sections: Section[] = await SectionModel.find({
        resumeId: params.resumeId,
      });
      const resumeTexMarkup = createTexFromSections(sections);
      console.log({ resumeTexMarkup });
      const fileName = "Resume";
      const texFileName = `${fileName}.tex`;
      const pdfFileName = `${fileName}.pdf`;
      const tempDir = tmpdir();

      const tempDirPath = await mkdtemp(
        join(tempDir, `resume-${session?.user.id}-`)
      );
      const texFilePath = join(tempDirPath, texFileName);
      const pdfFilePath = join(tempDirPath, pdfFileName);
      await writeFile(texFilePath, resumeTexMarkup, "utf8");

      const command = `pdflatex --output-directory=${tempDirPath} ${texFilePath}`;
      console.log(command);

      const pdfResult = await exec(command);
      console.log({ pdfResult });
      if (pdfResult.stderr) {
        const errorResponse: BaseErrorResponse = {
          message: "Failed to compile a LaTex file.",
        };
        return new NextResponse(JSON.stringify(errorResponse), {
          status: 500,
        });
      }
      // const pdfFile = createReadStream(pdfPath)
      // const pdfFileStat = await stat(pdfFilePath);

      const fileReadRes = await readFile(pdfFilePath);
      const mimeType = mime.getType(pdfFilePath) || "";
      bucketFileName = `resume-${
        session?.user.id
      }-${new mongoose.Types.ObjectId().toString()}.pdf`;
      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: bucketFileName,
          Body: fileReadRes,
          ContentType: mimeType,
        })
      );
      await rimraf(tempDirPath);
      console.log("Removed " + tempDirPath);

      await ResumeModel.findByIdAndUpdate(params.resumeId, {
        downloads: {
          pdf: bucketFileName,
        },
      });
    }

    const getCommand = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: bucketFileName,
    });

    outputUrl = await getSignedUrl(s3, getCommand, { expiresIn: 600 });
    console.log({ outputUrl });

    // const data: ReadableStream<Uint8Array> = streamFile(
    //   pdfFilePath,
    //   tempDirPath
    // ); //Stream the file with a 1kb chunk
    // return new NextResponse(data, {
    //   headers: {
    //     "Content-Length": pdfFileStat.size.toString(),
    //     "Content-Type": "application/pdf",
    //     "Content-Disposition": `attachment; filename=${pdfFileName}`,
    //   },
    //   status: 200,
    // });
  } catch (e) {
    let errorMessage = "Unknown error occurred.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    const errorResponse: BaseErrorResponse = {
      message: errorMessage,
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
    });
  } finally {
    if (outputUrl) {
      redirect(outputUrl);
    } else {
      const errorResponse: BaseErrorResponse = {
        message: "Could not create file url.",
      };
      return new NextResponse(JSON.stringify(errorResponse), {
        status: 500,
      });
    }
  }
}
