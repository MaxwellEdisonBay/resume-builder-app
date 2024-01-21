import { IResume } from "@models/domain/IResume";
import { BaseDeleteById } from "@models/domain/Section";
import { BaseErrorResponse } from "@models/dto/error";
import Resume from "@models/dto/resume";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// Gets all resumes related to a specific user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const sections: IResume[] = await Resume.find({
      userId: session?.user.id,
    });
    console.log(sections);
    return new NextResponse(JSON.stringify(sections), {
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

// Creates a new resume
export async function PUT(request: NextRequest) {
  try {
    const newResume: IResume = await request.json();
    // console.log(session?.user);
    console.log({ newResume });
    const result = await Resume.create(newResume);
    console.log({ result });
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
