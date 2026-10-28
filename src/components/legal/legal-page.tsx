import Link from "next/link";
import { ArrowLeft, ArrowUp, ChevronDown } from "lucide-react";
import type { LegalDocument } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { BackToTop } from "./back-to-top";
import { LegalMarkdown } from "./legal-markdown";
import { TocLinks } from "./toc";
import { ZenButton, ZenController } from "./zen";

const TOP_ID = "legal-top";

/**
 * Shared layout for Markdown legal documents (/privacy, /terms).
 * [data-zen-hide] parts disappear in Zen Mode; [data-print-hide] parts and
 * the site chrome disappear when printing (see globals.css).
 */
export function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <div
      id={TOP_ID}
      className="legal-page mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8"
    >
      {/* Top bar */}
      <div
        data-zen-hide
        data-print-hide
        className="flex flex-wrap items-center justify-between gap-3 border-b py-5"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-primary-text"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Return to home page
        </Link>
        <ZenButton
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        />
      </div>

      {/* Title block */}
      <header className="legal-header pt-14 pb-8 text-center sm:pt-20">
        <h1 className="text-3xl font-extrabold tracking-tight uppercase sm:text-5xl">
          {doc.title}
        </h1>
        {doc.updated && (
          <p className="mt-5 text-sm text-muted-foreground">
            Last updated:{" "}
            <time
              dateTime={doc.updatedIso}
              className="font-medium text-foreground"
            >
              {doc.updated}
            </time>
          </p>
        )}
      </header>

      {/* Summary callout */}
      {doc.summary && (
        <p className="legal-callout mx-auto max-w-[72ch] rounded-xl border-l-4 border-primary bg-primary/10 px-5 py-4 text-base leading-relaxed">
          {doc.summary}
        </p>
      )}

      {/* Contents: collapsible card on mobile and tablet */}
      <details
        data-zen-hide
        data-print-hide
        className="group mx-auto mt-8 max-w-[72ch] rounded-xl glass lg:hidden"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
          Contents
          <ChevronDown
            aria-hidden="true"
            className="size-5 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <nav aria-label="Table of contents" className="border-t px-3 py-3">
          <TocLinks items={doc.toc} />
        </nav>
      </details>

      <div className="legal-grid mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
        <article className="legal-body prose-legal mx-auto w-full max-w-[72ch] lg:mx-0">
          <LegalMarkdown body={doc.body} />
        </article>

        {/* Contents: sticky sidebar on desktop */}
        <aside data-zen-hide data-print-hide className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4">
            <nav aria-label="Table of contents">
              <h2 className="mb-3 pl-3 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Contents
              </h2>
              <TocLinks items={doc.toc} />
            </nav>
            <a
              href={`#${TOP_ID}`}
              className="mt-5 ml-3 inline-flex items-center gap-1.5 rounded text-sm font-medium text-muted-foreground transition-colors hover:text-primary-text"
            >
              <ArrowUp aria-hidden="true" className="size-4" />
              Back to the top
            </a>
          </div>
        </aside>
      </div>

      <BackToTop targetId={TOP_ID} />
      <ZenController />
    </div>
  );
}
