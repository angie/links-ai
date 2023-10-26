import { Landing } from "../components/landing";

export default function Page(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Landing />
    </main>
  );
}
