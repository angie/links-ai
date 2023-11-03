"use client";

import { Button } from "@ui/components/button";
import { Icons } from "@ui/components/icons";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function Auth(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mx-auto flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Continue with
          </h1>
        </div>
        <div className="grid gap-6 text-center">
          <Button
            onClick={() => void signIn("google", { callbackUrl: "/" })}
            type="button"
            variant="outline"
          >
            {/* eslint-disable-next-line react/jsx-pascal-case -- shadcn generated */}
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By logging in, you agree to our{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/terms"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
