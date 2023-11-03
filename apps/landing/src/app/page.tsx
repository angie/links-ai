import { getEnvVar } from "get-env";
import { redirect } from "next/navigation";
import { Landing } from "../components/landing";
import { auth } from "./auth-helper";

export default async function Page(): Promise<JSX.Element> {
  const session = await auth();

  if (session) {
    redirect(getEnvVar("NEXT_PUBLIC_AUTHENTICATED_APP_URL"));
  }

  return <Landing />;
}
