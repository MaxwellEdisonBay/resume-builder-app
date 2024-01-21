import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { IResume } from "@models/domain/IResume";
import { BaseErrorResponse } from "@models/dto/error";
import ResumeModel from "@models/dto/resume";
import { S3_BUCKET_NAME, s3 } from "@utils/s3Bucket";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Gets a specific template by its ID available for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  const session = await getServerSession(authOptions);
  const resumeId = params.resumeId;
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    const errorResponse: BaseErrorResponse = {
      message: `${resumeId} is not a valid templateId!`,
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 400,
    });
  }
  try {
    const oldResumeResponse: IResume | null =
      await ResumeModel.findByIdAndUpdate(resumeId, {
        $unset: { downloads: 1 },
      });
    if (!oldResumeResponse) {
      const errorResponse: BaseErrorResponse = {
        message: `Could not find ${resumeId}!`,
      };
      return new NextResponse(JSON.stringify(errorResponse), {
        status: 400,
      });
    }

    if (oldResumeResponse.downloads?.pdf) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: oldResumeResponse.downloads?.pdf,
        })
      );
    }

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
