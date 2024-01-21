import { BaseDeleteById, Section as SectionType } from "@models/domain/Section";
import { TemplateServer } from "@models/domain/Template";
import { BaseErrorResponse } from "@models/dto/error";
import Section from "@models/dto/section";
import Template from "@models/dto/template";
import { authOptions } from "@utils/auth/authOptions";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
// import { Section as SectionType } from "@components/sections/TestComponent";

// export const dynamic = 'force-dynamic'

// Gets a specific template by its ID available for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  const session = await getServerSession(authOptions);
  const templateId = params.templateId;
  if (!mongoose.Types.ObjectId.isValid(templateId)) {
    const errorResponse: BaseErrorResponse = {
      message: `${templateId} is not a valid templateId!`,
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 400,
    });
  }
  try {
    const template: TemplateServer | null = await Template.findById(templateId);
    if (template) {
      return new NextResponse(JSON.stringify(template), {
        status: 200,
      });
    } else {
      const errorResponse: BaseErrorResponse = {
        message: `Template with id ${templateId} does not exist!`,
      };
      return new NextResponse(JSON.stringify(errorResponse), {
        status: 404,
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

// Creates a new section
export async function PUT(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  const templateId = params.templateId;
  if (!mongoose.Types.ObjectId.isValid(templateId)) {
    const errorResponse: BaseErrorResponse = {
      message: `${templateId} is not a valid templateId!`,
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 400,
    });
  }
  try {
    const newTemplate: TemplateServer = await request.json();
    // console.log(session?.user);
    console.log({ newTemplate: newTemplate });
    const result = await Template.create(newTemplate);
    console.log({ result });
    if (result) {
      return new NextResponse(JSON.stringify(result), {
        status: 201,
      });
    } else {
      const errorResponse: BaseErrorResponse = {
        message: "Could not create a new database template entry.",
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
