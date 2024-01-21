import Section from "@models/dto/section";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { BaseDeleteById, Section as SectionType } from "@models/domain/Section";
import { BaseErrorResponse } from "@models/dto/error";
import IResume from "@models/dto/resume";
// import { Section as SectionType } from "@components/sections/TestComponent";

// export const dynamic = 'force-dynamic'

// Gets all sections related to a specific user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // console.log(request.nextUrl)
  const resumeId = request.nextUrl.searchParams.get("resumeId");
  // console.log({resumeId})
  if (!resumeId) {
    const errorResponse: BaseErrorResponse = {
      message: "resumeId query param is missing!",
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 400,
    });
  }
  try {
    const sections: SectionType[] = await Section.find({
      userId: session?.user.id,
      resumeId: resumeId,
    });
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

// Creates a new section
export async function PUT(request: NextRequest) {
  try {
    const newSection: SectionType = await request.json();
    // console.log(session?.user);
    console.log({ newSection });
    const result = await Section.create(newSection);
    console.log({ result });
    if (!result) {
      const errorResponse: BaseErrorResponse = {
        message: "Could not create a new database section entry.",
      };
      return new NextResponse(JSON.stringify(errorResponse), {
        status: 500,
      });
    }

    return new NextResponse(JSON.stringify(result), {
      status: 201,
    });
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
    const section: SectionType | null = await Section.findById(deleteReq.id);
    if (!section) {
      return new NextResponse(
        JSON.stringify({
          message: "Could not find the section by provided id",
        }),
        {
          status: 400,
        }
      );
    }
    if (section.userId !== session?.user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "Deleting sections of other users is not allowed",
        }),
        {
          status: 403,
        }
      );
    }

    const result = await Section.findByIdAndDelete(deleteReq.id);
    console.log({ result });
    if (result) {
      return new NextResponse(JSON.stringify(result), {
        status: 200,
      });
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Failed to delete section in the database" }),
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

// Updates section data
export async function POST(request: NextRequest) {
  try {
    const updatedSection: SectionType = await request.json();
    // console.log(session?.user);
    console.log({ updatedSection });
    const result = await Section.findByIdAndUpdate(updatedSection._id, {
      title: updatedSection.title,
      content: updatedSection.content,
    });
    console.log({ result });
    // const result = await Section.create(newSection);
    // console.log({ result });
    if (result) {
      return new NextResponse(JSON.stringify(result), {
        status: 201,
      });
    } else {
      const errorResponse: BaseErrorResponse = {
        message: "Could not create a new database section entry.",
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
