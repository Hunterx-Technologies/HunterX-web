import type { ReactNode } from "react";
import { cn, pad2 } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/** Small uppercase label with a two-digit number, e.g. "01 · How it works". */
export function Eyebrow({
  number,
  children,
  className,
}: {
  number?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase",
        className,
      )}
    >
      {number !== undefined && (
        <span className="font-mono text-primary-text">{pad2(number)}</span>
      )}
      <span aria-hidden="true" className="h-px w-8 bg-primary-text/60" />
      <span>{children}</span>
    </p>
  );
}

type SectionProps = {
  id: string;
  number?: number;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Home page section with numbered eyebrow, big heading and intro text. */
export function Section({
  id,
  number,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-20 sm:py-28", className)}
    >
      <Container>
        <header className="mb-12 max-w-2xl sm:mb-16" data-reveal>
          <Eyebrow number={number}>{eyebrow}</Eyebrow>
          <h2
            id={headingId}
            className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-5 text-lg text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </header>
        {children}
      </Container>
    </section>
  );
}
