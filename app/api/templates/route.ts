import Section from "@models/dto/section";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { BaseDeleteById, Section as SectionType } from "@models/domain/Section";
import { BaseErrorResponse } from "@models/dto/error";
import Template from "@models/dto/template";
import { TemplateServer } from "@models/domain/Template";

// Gets all templates available for a user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const templates: TemplateServer[] = await Template.find();
    return new NextResponse(JSON.stringify(templates), {
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
