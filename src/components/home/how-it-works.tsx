import type { CSSProperties } from "react";
import { STEPS } from "@/data/home";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { pad2 } from "@/lib/utils";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      number={1}
      eyebrow="How it works"
      title="Three steps to a stronger you"
      description="HunterX turns the things you already want to do into a game you will want to keep playing."
    >
      <ol className="grid gap-5 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <Card
            as="li"
            key={step.title}
            interactive
            data-reveal
            style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
            className="flex flex-col"
          >
            <span className="font-mono text-5xl font-bold text-primary-text/90">
              {pad2(i + 1)}
            </span>
            <h3 className="mt-8 text-xl font-semibold tracking-tight">
              {step.title}
            </h3>
            <p className="mt-3 text-muted-foreground">{step.body}</p>
          </Card>
        ))}
      </ol>
    </Section>
  );
}
