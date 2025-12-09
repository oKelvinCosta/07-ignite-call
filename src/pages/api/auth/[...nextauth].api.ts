import { PrismaAdapter } from "@/lib/auth/prisma-adapter";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";

export function buildNextAuthOptions(req: NextApiRequest | NextPageContext['req'], res: NextApiResponse | NextPageContext['res']): NextAuthOptions  {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        authorization: {
          params: {
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
          },
        },
        // Map the profile returned by the provider to the user object, because the image field is called picture
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: '',
            email: profile.email,
            avatar_url: profile.picture,
          }
        }
      }),
    ],
    callbacks: {
      // To know if the user enable the edit calendar permission, if not, redirect to the connect calendar page
      async signIn({ user, account }) {
        if(!account?.scope?.includes('https://www.googleapis.com/auth/calendar')) {
          return '/register/connect-calendar/?error=permissions' // Redirect
        }

        return true; 
      },

      // Send to frontend more user data
      async session({ session, user }) {
        return {
          ...session,
          user,
        };
      },
    }
  }
};

// export default NextAuth(authOptions);

// To access cookies, we need to use the advanced version of NextAuth
export default async function auth(req: NextApiRequest, res:NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res));
}