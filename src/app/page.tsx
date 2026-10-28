import type { Metadata } from "next";
import { SITE_DESCRIPTION } from "@/config";
import { pageMetadata } from "@/lib/seo";
import { Intro } from "@/components/home/intro";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Ranks } from "@/components/home/ranks";
import { Download } from "@/components/home/download";
import { Faq } from "@/components/home/faq";

export const metadata: Metadata = pageMetadata({
  title: "HunterX: Level up your real life",
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      {/* Home page only: never rendered on other routes. */}
      <Intro />
      <Hero />
      <HowItWorks />
      <Ranks />
      <Download />
      <Faq />
    </>
  );
}
