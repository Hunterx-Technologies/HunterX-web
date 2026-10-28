"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
      <Container className="max-w-2xl py-24 text-center sm:py-32">
        <Eyebrow className="justify-center">Error</Eyebrow>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          An unexpected error occurred. Please try again in a moment.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => retry()}>
            Try again
          </Button>
          <Link
            href="/"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}
