"use client";

import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import { Button } from "@ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { useSession } from "next-auth/react";

export function DesktopUserMenu(): JSX.Element {
  const { data: session } = useSession();

  if (!session) {
    // eslint-disable-next-line react/jsx-no-useless-fragment -- TODO: fix
    return <></>;
  }

  const user = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarImage
              alt={user?.name || "User avatar"}
              src={user?.image ?? undefined}
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileUserMenuButton({ open }: { open: boolean }): JSX.Element {
  return (
    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md focus:outline-none focus:bg-accent focus:ring-2 focus:ring-offset-2">
      <span className="absolute -inset-0.5" />
      <span className="sr-only">Open main menu</span>
      {open ? (
        <XMarkIcon aria-hidden="true" className="block h-6 w-6" />
      ) : (
        <Bars3Icon aria-hidden="true" className="block h-6 w-6" />
      )}
    </Disclosure.Button>
  );
}

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export function MobileUserMenu(): JSX.Element {
  const { data: session } = useSession();

  if (!session) {
    // eslint-disable-next-line react/jsx-no-useless-fragment -- TODO: fix
    return <></>;
  }

  const user = session.user;
  return (
    <Disclosure.Panel className="sm:hidden">
      <div className="border-t pb-3 pt-4">
        <div className="flex items-center px-4">
          <div className="flex-shrink-0">
            <img
              alt=""
              className="h-10 w-10 rounded-full"
              src={user?.image || undefined}
            />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium">{user?.name}</div>
            <div className="text-sm font-medium text-muted-foreground">
              {user?.email}
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          {userNavigation.map((item) => (
            <Disclosure.Button
              as="a"
              className="block px-4 py-2 text-base font-medium"
              href={item.href}
              key={item.name}
            >
              {item.name}
            </Disclosure.Button>
          ))}
        </div>
      </div>
    </Disclosure.Panel>
  );
}
