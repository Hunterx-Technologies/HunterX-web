import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { inviteDeepLink, isValidInviteCode } from "@/lib/invite";
import { pageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";
import { CopyCodeButton } from "@/components/site/copy-code-button";
import { StoreButtons } from "@/components/site/store-buttons";

export async function generateMetadata({
  params,
}: PageProps<"/invite/[code]">): Promise<Metadata> {
  const { code } = await params;
  const title = isValidInviteCode(code)
    ? "You've been invited to HunterX"
    : "Invite not found";

  return pageMetadata({
    title,
    description:
      "Join HunterX, the gamified fitness and habit app. Complete quests, earn XP and level up.",
    path: `/invite/${encodeURIComponent(code)}`,
    noIndex: true,
    absoluteTitle: true,
  });
}

function Backdrop() {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/2 -z-10 h-80 w-[min(700px,120vw)] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(closest-side, var(--glow), transparent)",
        }}
      />
    </>
  );
}

export default async function InvitePage({
  params,
}: PageProps<"/invite/[code]">) {
  const { code } = await params;

  if (!isValidInviteCode(code)) {
    return (
      <section className="relative isolate">
        <Backdrop />
        <Container className="max-w-2xl py-24 text-center sm:py-32">
          <Eyebrow className="justify-center">Invite</Eyebrow>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            This invite link doesn&rsquo;t look right
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            The invite code may have been copied incorrectly. Ask your friend to
            send it again, or download HunterX and get started anyway.
          </p>
          <StoreButtons align="center" className="mt-10" />
        </Container>
      </section>
    );
  }

  return (
    <section className="relative isolate">
      <Backdrop />
      <Container className="max-w-2xl py-24 text-center sm:py-32">
        <Eyebrow className="justify-center">Invite</Eyebrow>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          You&rsquo;ve been invited to{" "}
          <span className="text-gradient">HunterX</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Open the app and enter this code when you sign up.
        </p>

        <div className="mx-auto mt-10 inline-flex max-w-full flex-col items-center rounded-2xl border-primary/40 glass px-8 py-6 shadow-[0_20px_60px_-30px_var(--glow)] sm:px-12">
          <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Your invite code
          </span>
          <code className="mt-2 font-mono text-4xl font-bold tracking-[0.15em] break-all text-foreground select-all sm:text-5xl">
            {code}
          </code>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CopyCodeButton code={code} />
          <a
            href={inviteDeepLink(code)}
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Open in app
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </div>

        <h2 className="mt-16 text-xl font-semibold tracking-tight">
          Don&rsquo;t have HunterX yet?
        </h2>
        <StoreButtons align="center" className="mt-6" />
      </Container>
    </section>
  );
}
