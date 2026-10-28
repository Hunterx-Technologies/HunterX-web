import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/section";

/** Heading block for simple inner pages (support, delete account, ...). */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate pt-16 pb-10 sm:pt-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
        {title}
      </h1>
      {children && (
        <div className="mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">
          {children}
        </div>
      )}
    </header>
  );
}
