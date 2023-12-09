import Section from "@models/dto/section";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { BaseDeleteById, BaseSection } from "@models/domain/Section";
import { BaseErrorResponse } from "@models/dto/error";

// Gets all sections related to a specific user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const sections: BaseSection[] = await Section.find({
      userId: session?.user.id,
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
    const newSection: BaseSection = await request.json();
    // console.log(session?.user);
    console.log({ newSection });
    const result = await Section.create(newSection);
    console.log({ result });
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

  // console.log({test})
  // console.log({query})

  // if (!query) {
  //   return new NextResponse(
  //     JSON.stringify({ name: "Please provide something to search for" }),
  //     { status: 400 }
  //   );
  // }

  // console.log(result)
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const deleteReq: BaseDeleteById = await request.json();
    const section: BaseSection | null = await Section.findById(deleteReq.id);
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
