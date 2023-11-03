import NextAuth from "next-auth";
import { config } from "../../../auth-helper";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- NextAuth returns any
const handler = NextAuth(config);

export { handler as GET, handler as POST };
