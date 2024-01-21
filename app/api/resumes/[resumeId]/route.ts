import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { IResume } from "@models/domain/IResume";
import { BaseErrorResponse } from "@models/dto/error";
import Resume from "@models/dto/resume";
import Section from "@models/dto/section";
import { authOptions } from "@utils/auth/authOptions";
import { S3_BUCKET_NAME, s3 } from "@utils/s3Bucket";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Gets a specific template by its ID available for a user
export async function GET(
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
    const url = request.nextUrl;
    console.log(url);
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

export async function DELETE(
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
    const deletedResume: IResume | null = await Resume.findByIdAndDelete(
      resumeId
    );
    const sectionsDeleteResult = await Section.deleteMany({ resumeId });
    if (deletedResume?.downloads?.pdf) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: deletedResume.downloads?.pdf,
        })
      );
    }
    console.log({ deletedResume });
    if (deletedResume && sectionsDeleteResult) {
      return new NextResponse(JSON.stringify(deletedResume), {
        status: 200,
      });
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Failed to delete resume in the database" }),
        {
          status: 500,
        }
      );
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

// Updates resume data
export async function POST(request: NextRequest) {
  try {
    const updatedResume: IResume = await request.json();
    // console.log(session?.user);
    console.log({ updatedResume });
    const result = await Resume.findByIdAndUpdate(
      updatedResume._id,
      updatedResume
    );
    console.log({ result });
    // const result = await Section.create(newSection);
    // console.log({ result });
    if (result) {
      return new NextResponse(JSON.stringify(result), {
        status: 201,
      });
    } else {
      const errorResponse: BaseErrorResponse = {
        message: "Could not create a new database resume entry.",
      };
      return new NextResponse(JSON.stringify(errorResponse), {
        status: 500,
      });
    }
  } catch (e: unknown) {
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
