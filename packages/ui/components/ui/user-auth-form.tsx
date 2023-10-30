"use client";

import { cn } from "lib/utils";
import { Button } from "./button";
import { Icons } from "./icons";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({
  className,
  ...props
}: UserAuthFormProps): JSX.Element {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Continue with</h1>
      </div>
      <div className={`${cn("grid gap-6", className)} text-center`} {...props}>
        <Button type="button" variant="outline">
          {/* eslint-disable-next-line react/jsx-pascal-case -- shadcn generated */}
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </>
  );
}
