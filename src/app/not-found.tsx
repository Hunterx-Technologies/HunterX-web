import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
      <Container className="max-w-2xl py-24 text-center sm:py-32">
        <Eyebrow className="justify-center">Error 404</Eyebrow>
        <p
          aria-hidden="true"
          className="mt-6 text-gradient text-[clamp(5rem,20vw,9rem)] leading-none font-black tracking-tighter"
        >
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          This quest doesn&rsquo;t exist
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you are looking for has moved or never existed.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            Back to home
          </Link>
          <Link
            href="/support"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Get support
          </Link>
        </div>
      </Container>
    </section>
  );
}
