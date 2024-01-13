import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Section as SectionType } from "@models/domain/Section";
import Section from "@models/dto/section";
import { BaseErrorResponse } from "@models/dto/error";
import { exec as execCallback } from "child_process";
import { promisify } from "util";
import {
  createReadStream,
  mkdir as mkdirCallback,
  writeFile as writeFileCallback,
} from "fs";
import { tmpdir } from "os";
import { defaultSample } from "@utils/latex/samples/default";
import mongoose from "mongoose";
import { join } from "path";
import { mkdtemp, readFile, stat } from "fs/promises";
import { ReadableOptions } from "stream";
import { rimraf } from "rimraf";
import mime from "mime";
import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
  getSignedUrl,
  S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";
import { redirect } from "next/navigation";

const exec = promisify(execCallback);
const writeFile = promisify(writeFileCallback);
const mkdir = promisify(mkdirCallback);

// Create an S3 client
//
// You must copy the endpoint from your B2 bucket details
// and set the region to match.
const s3 = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  region: process.env.BACKBLAZE_REGION,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_BUCKET_KEYID || "",
    secretAccessKey: process.env.BACKBLAZE_BUCKET_APPKEY || "",
  },
});

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
export async function GET(request: NextRequest) {
  const test=  request.nextUrl
  console.log(test)
  const url = 'https://resume-builder.s3.us-east-005.backblazeb2.com/resume-655ac1919441f3ab830819ed-659f53d5c836cebe761873b0.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0053776667ac9a00000000001%2F20240111%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Date=20240111T023501Z&X-Amz-Expires=3600&X-Amz-Signature=61759dbfbc1045a6f92c42db0c849f267acbcda425430a1f9bab844972ba817f&X-Amz-SignedHeaders=host&x-id=GetObject'
  redirect(url)

  const session = await getServerSession(authOptions);
  try {
    // const sections: SectionType[] = await Section.find({
    //   userId: session?.user.id,
    // });
    // const test = await exec("dir");

    // const fileName = new mongoose.Types.UUID().toString();

    const fileName = "Resume";
    const texFileName = `${fileName}.tex`;
    const pdfFileName = `${fileName}.pdf`;
    const tempDir = tmpdir();

    const tempDirPath = await mkdtemp(
      join(tempDir, `resume-${session?.user.id}-`)
    );
    const texFilePath = join(tempDirPath, texFileName);
    const pdfFilePath = join(tempDirPath, pdfFileName);
    await writeFile(texFilePath, defaultSample, "utf8");

    const command = `pdflatex --output-directory=${tempDirPath} ${texFilePath}`;
    console.log(command);

    const pdfResult = await exec(command);
    if (pdfResult.stderr) {
      const errorResponse: BaseErrorResponse = {
        message: "Failed to compile a LaTex file.",
      };
      return new NextResponse(JSON.stringify(errorResponse), {
        status: 500,
      });
    } else {
      // const pdfFile = createReadStream(pdfPath)
      const pdfFileStat = await stat(pdfFilePath);

      const fileReadRes = await readFile(pdfFilePath);
      const mimeType = mime.getType(pdfFilePath) || "";
      const bucketFileName = `resume-${session?.user.id}-${new mongoose.Types.ObjectId().toString()}.pdf`;
      const bucketName = process.env.BACKBLAZE_BUCKET_NAME;
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: bucketFileName,
          Body: fileReadRes,
          ContentType: mimeType,
        })
      );

      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: bucketFileName,
      });
      const outputUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
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
    }
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
  }
}