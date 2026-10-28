import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Container, Eyebrow } from "@/components/ui/section";
import { StoreButtons } from "@/components/site/store-buttons";

export function Download() {
  return (
    <section
      id="download"
      aria-labelledby="download-heading"
      className="py-20 sm:py-28"
    >
      <Container>
        <Card
          data-reveal
          className="isolate overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
          <div
            aria-hidden="true"
            className="absolute -bottom-40 left-1/2 -z-10 h-80 w-[min(700px,140%)] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, var(--glow), transparent)",
            }}
          />
          <Eyebrow number={3} className="justify-center">
            Download
          </Eyebrow>
          <h2
            id="download-heading"
            className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl"
          >
            Your first quest is{" "}
            <span className="text-primary-text">waiting</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Download HunterX and turn every rep, step and habit into progress
            you can see.
          </p>
          <StoreButtons align="center" className="mt-10" />
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Chip>Free to download</Chip>
            <Chip>Adults 18+</Chip>
            <Chip>iOS &amp; Android</Chip>
          </div>
        </Card>
      </Container>
    </section>
  );
}
