// import { authOptions } from "@app/api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

export {default} from "next-auth/middleware"

// import { withAuth } from "next-auth/middleware"

// export default withAuth({
//   // Matches the pages config in `[...nextauth]`
//   pages: {
//     signIn: '/login',
//     error: '/error',
//   }
// })

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/profile/:path*", "/resumes/:path*"],
};
