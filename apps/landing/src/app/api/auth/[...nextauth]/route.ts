import { getEnvVar } from "get-env";
import type { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnvVar("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
    }),
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- NextAuth returns any
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
