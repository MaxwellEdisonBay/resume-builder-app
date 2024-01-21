import { authOptions } from "@app/api/auth/[...nextauth]/route";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { IResume } from "@models/domain/IResume";
import { BaseErrorResponse } from "@models/dto/error";
import ResumeModel from "@models/dto/resume";
import { S3_BUCKET_NAME, s3 } from "@utils/s3Bucket";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Invalidates ALL resumes
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const resumes: IResume[] = await ResumeModel.find({
      userId: session?.user.id,
    });
    const fileKeys = resumes.map((r) => r.downloads?.pdf).filter((r) => r);
    console.log({ fileKeys });
    // TODO: Add proper error handling
    if (fileKeys.length !== 0) {
      const command = new DeleteObjectsCommand({
        Bucket: S3_BUCKET_NAME,
        Delete: {
          Objects: fileKeys.map((k) => {
            return { Key: k };
          }),
        },
      });

      try {
        const { Deleted } = await s3.send(command);
        console.log(
          `Successfully deleted ${Deleted?.length} objects from S3 bucket. Deleted objects:`
        );
        console.log(Deleted?.map((d) => ` • ${d.Key}`).join("\n"));
      } catch (err) {
        console.error(err);
      }
      const invalidateResult = await ResumeModel.updateMany(
        { userId: session?.user.id },
        {
          $unset: { downloads: 1 },
        }
      );
    }

    // if (invalidateResult.) {
    //   const errorResponse: BaseErrorResponse = {
    //     message: `Failed to invalidate resumes!`,
    //   };
    //   return new NextResponse(JSON.stringify(errorResponse), {
    //     status: 400,
    //   });
    // }

    // if (oldResumeResponse.downloads?.pdf) {
    //   await s3.send(
    //     new DeleteObjectCommand({
    //       Bucket: S3_BUCKET_NAME,
    //       Key: oldResumeResponse.downloads?.pdf,
    //     })
    //   );
    // }

    // console.log("Invalidated cached files!\n" + invalidateResult);
    return new NextResponse(JSON.stringify({}), {
      status: 200,
    });
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
