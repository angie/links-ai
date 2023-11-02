"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@ui/components/button";
import { Landing } from "../components/landing";

export default function Page(): JSX.Element {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <main>
        <Button onClick={() => signOut()}>Sign out</Button>
      </main>
    );
  }

  return <Landing />;
}
