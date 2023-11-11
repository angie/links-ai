"use client";

import { Disclosure } from "@headlessui/react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@ui/components/dark-light-mode-toggle";
import Link from "next/link";
import {
  DesktopUserMenu,
  MobileUserMenu,
  MobileUserMenuButton,
} from "./user-menu";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="border-b">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link className="flex items-center" href="/">
                      <ExternalLinkIcon className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all mr-2" />{" "}
                      <span className="hidden sm:block">savelink.ai</span>
                    </Link>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
                  <ModeToggle />
                  {/* Profile dropdown */}
                  <DesktopUserMenu />
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <MobileUserMenuButton open={open} />
                </div>
              </div>
            </div>

            <MobileUserMenu />
          </>
        )}
      </Disclosure>

      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
