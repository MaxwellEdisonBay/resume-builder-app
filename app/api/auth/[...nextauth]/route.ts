import NextAuth, { AuthOptions, SessionOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/dto/user";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID + "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET + "",
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      const sessionUser = await User.findOne({
        email: session.user?.email,
      });
      session.user.id = sessionUser._id.toString();
      

      return session;
    },
    async signIn({ user, profile }) {
      try {
        await connectToDB();

        // check if user exists
        const userExists = await User.findOne({
          email: profile?.email,
        });
        if (!userExists) {
          //if not, create a new user
        //   console.log({profile})
        //   console.log({user})
          await User.create({
            email: profile?.email,
            username: profile?.name?.replace(" ", "").toLowerCase(),
            image: profile?.picture,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
