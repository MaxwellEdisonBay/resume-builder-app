import { IUser } from "@models/domain/IUser";
import { Profile as IProfile } from "@models/domain/Profile";
import { BaseErrorResponse } from "@models/dto/error";
import Profile from "@models/dto/profile";
import User from "@models/dto/user";
import { authOptions } from "@utils/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Gets a user profile for specific user ID.
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!userId) {
    const errorResponse: BaseErrorResponse = {
      message: `You are not authenticated.`,
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 401,
    });
  }
  try {
    const userData: IUser | null = await User.findById(userId);
    if (userData) {
      return new NextResponse(JSON.stringify(userData), {
        status: 200,
      });
    } else {
      const errorResponse: BaseErrorResponse = {
        message: `Profile with id ${userId} does not exist!`,
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

// Created a new user profile database entry.
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!userId) {
    const errorResponse: BaseErrorResponse = {
      message: `You are not authenticated!`,
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 401,
    });
  }
  try {
    const newProfileData: IProfile = await request.json();
    newProfileData.userId = userId;
    const createdProfile = await Profile.create(newProfileData);
    if (createdProfile) {
      return new NextResponse(JSON.stringify(createdProfile), {
        status: 200,
      });
    } else {
      const errorResponse: BaseErrorResponse = {
        message: `Failed to create a profile.`,
      };
      return new NextResponse(JSON.stringify(errorResponse), {
        status: 500,
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

// Update a user profile with new values.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // const userId = session?.user.id;
  // if (!userId) {
  //   const errorResponse: BaseErrorResponse = {
  //     message: `You are not authenticated!`,
  //   };
  //   return new NextResponse(JSON.stringify(errorResponse), {
  //     status: 401,
  //   });
  // }
  try {
    const updatedProfileData: Partial<IUser> = await request.json();
    const updatedProfile = await User.findByIdAndUpdate(
      session?.user.id,
      updatedProfileData,
      {new: true}
    );
    if (updatedProfile) {
      return new NextResponse(JSON.stringify(updatedProfile), {
        status: 200,
      });
    } else {
      const errorResponse: BaseErrorResponse = {
        message: `Failed to update a profile.`,
      };
      return new NextResponse(JSON.stringify(errorResponse), {
        status: 500,
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

// Delete user profile data
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!userId) {
    const errorResponse: BaseErrorResponse = {
      message: `You are not authenticated!`,
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 401,
    });
  }

  try {
    const profileData = await Profile.deleteOne({
      userId: userId,
    });
    if (profileData.deletedCount !== 0) {
      return new NextResponse(JSON.stringify(profileData), {
        status: 200,
      });
    } else {
      const errorResponse: BaseErrorResponse = {
        message: `Profile with id ${userId} does not exist!`,
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
