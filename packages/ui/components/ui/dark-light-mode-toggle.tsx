"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/components/button";
import { useTheme } from "next-themes";

export function ModeToggle(): JSX.Element {
  const { setTheme, theme } = useTheme();
  const themeNotSelected = theme === "light" ? "dark" : "light";

  return (
    <Button
      onClick={() => {
        setTheme(themeNotSelected);
      }}
      size="icon"
      variant="outline"
    >
      {theme === undefined || theme === "light" ? (
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
    </Button>
  );
}
