import { Resume as ResumeType } from "@models/domain/Resume";
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
    const sections: ResumeType[] = await Resume.find({
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
    const newResume: ResumeType = await request.json();
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

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const deleteReq: BaseDeleteById = await request.json();
    const resume: ResumeType | null = await Resume.findById(deleteReq.id);
    if (!resume) {
      return new NextResponse(
        JSON.stringify({
          message: "Could not find the resume by provided id",
        }),
        {
          status: 400,
        }
      );
    }
    if (resume.userId !== session?.user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "Deleting resumes of other users is not allowed",
        }),
        {
          status: 403,
        }
      );
    }

    const result = await Resume.findByIdAndDelete(deleteReq.id);
    console.log({ result });
    if (result) {
      return new NextResponse(JSON.stringify(result), {
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
    const updatedResume: ResumeType = await request.json();
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
