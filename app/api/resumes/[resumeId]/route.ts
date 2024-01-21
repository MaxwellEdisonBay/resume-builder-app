import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { BaseErrorResponse } from "@models/dto/error";
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
        const url = request.nextUrl
        console.log(url)
      return new NextResponse(JSON.stringify({}), {
        status: 200
      })
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