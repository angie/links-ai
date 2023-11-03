import type { Metadata } from "next";
import { Auth } from "./auth";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage(): JSX.Element {
  return <Auth />;
}
