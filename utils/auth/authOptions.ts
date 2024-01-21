import User from "@models/dto/user";
import { connectToDB } from "@utils/database";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
          const nameList = profile?.name?.split(" ");
          const firstName = nameList?.at(0);
          const lastName = nameList?.at(1);
          await User.create({
            email: profile?.email,
            username: profile?.name?.replace(" ", "").toLowerCase(),
            // @ts-ignore
            // TODO: Double-check with docs, it works this way though.
            image: profile?.picture,
            firstName,
            lastName,
            displayEmail: profile?.email,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};
