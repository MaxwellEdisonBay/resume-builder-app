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
import { mkdtemp, stat } from "fs/promises";
import { ReadableOptions } from "stream";
import { rimraf } from "rimraf"

const exec = promisify(execCallback);
const writeFile = promisify(writeFileCallback);
const mkdir = promisify(mkdirCallback);

function streamFile(
  path: string,
  tmpDir?: string,
  options?: ReadableOptions,
): ReadableStream<Uint8Array> {
  const downloadStream = createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk))
      );
      downloadStream.on("end", async () => {
        if (tmpDir) {
            await rimraf(tmpDir)
            console.log("Removed " + tmpDir)
        }
        controller.close()
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

    // mkdir()
    const tempDirPath = await mkdtemp(join(tempDir, `resume-${session?.user.id}-`));
    // console.log(test)

    // const errorResponse: BaseErrorResponse = {
    //   message: "Failed to compile a LaTex file.",
    // };
    // return new NextResponse(JSON.stringify(errorResponse), {
    //   status: 500,

    // });


    // console.log(test);
    const texFilePath = join(tempDirPath, texFileName);
    const pdfFilePath = join(tempDirPath, pdfFileName);
    const bib = await writeFile(texFilePath, defaultSample, "utf8");

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
      const data: ReadableStream<Uint8Array> = streamFile(pdfFilePath, tempDirPath); //Stream the file with a 1kb chunk
      return new NextResponse(data, {
        headers: {
          "Content-Length": pdfFileStat.size.toString(),
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${pdfFileName}`,
        },
        status: 200,
      });
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
