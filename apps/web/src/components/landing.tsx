import { Button } from "ui";

export function Landing(): JSX.Element {
  return (
    <div>
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Never lose a link again.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8">
            The smart way to save, organize, and share links with anyone.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button>Get started</Button>
            <a
              className="text-sm font-semibold leading-6"
              href="https://www.tailwind-kit.com"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
