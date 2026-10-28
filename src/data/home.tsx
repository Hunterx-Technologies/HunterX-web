import Link from "next/link";
import type { ReactNode } from "react";
import { COMPANY, RANKS, TOTAL_LEVELS } from "@/config";

/** Home page copy. Edit text here; layout lives in components/home. */

export const STEPS = [
  {
    title: "Complete daily quests",
    body: "Every day you get a fresh set of fitness and habit quests. Small, doable wins that add up to real change.",
  },
  {
    title: "Earn XP and keep your streak",
    body: "Each quest you finish earns XP. Show up day after day to grow your streak and level up faster.",
  },
  {
    title: "Rank up and win rewards",
    body: `Climb ${TOTAL_LEVELS} levels across ${RANKS.length} ranks, see where you stand on the leaderboards and unlock rewards from ${COMPANY.rewardsPartner}.`,
  },
];

const linkClass =
  "font-medium text-primary-text underline underline-offset-4 hover:no-underline";

export const FAQS: { question: string; answer: ReactNode }[] = [
  {
    question: "Is HunterX free?",
    answer: (
      <p>
        Yes. HunterX is free to download. If we ever add paid extras, we will
        make that clear in the app before you pay for anything.
      </p>
    ),
  },
  {
    question: "What are the ranks?",
    answer: (
      <>
        <p>
          There are {RANKS.length} ranks across {TOTAL_LEVELS} levels. You start
          as {RANKS[0].name} and reach a new rank every{" "}
          {Math.round(TOTAL_LEVELS / RANKS.length)} levels:
        </p>
        <ol className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {RANKS.map((rank) => (
            <li key={rank.name}>
              <span className="font-mono text-primary-text">
                {String(rank.number).padStart(2, "0")}
              </span>{" "}
              <span className="font-medium text-foreground">{rank.name}</span>{" "}
              <span>(Lv {rank.levels})</span>
            </li>
          ))}
        </ol>
        <p className="mt-3">
          See the{" "}
          <Link href="/#ranks" className={linkClass}>
            ranks ladder
          </Link>{" "}
          above.
        </p>
      </>
    ),
  },
  {
    question: "Is my health data safe?",
    answer: (
      <p>
        HunterX only reads the health data you choose to share through Apple
        Health or Health Connect, and you can turn that access off at any time
        in your phone&rsquo;s settings. Our{" "}
        <Link href="/privacy" className={linkClass}>
          Privacy Policy
        </Link>{" "}
        explains exactly what we collect, why, and how we protect it.
      </p>
    ),
  },
  {
    question: "Who can use HunterX?",
    answer: (
      <p>
        HunterX is for adults aged 18 and over. See our{" "}
        <Link href="/terms" className={linkClass}>
          Terms of Service
        </Link>{" "}
        for the full eligibility rules.
      </p>
    ),
  },
  {
    question: "How do I delete my account?",
    answer: (
      <p>
        In the app, go to Settings &gt; Account &gt; Delete Account. You can
        also email us. Both options are explained on our{" "}
        <Link href="/delete-account" className={linkClass}>
          account deletion page
        </Link>
        .
      </p>
    ),
  },
  {
    question: "How do rewards work?",
    answer: (
      <p>
        As you complete quests, keep streaks and rank up, you can unlock rewards
        provided by our partner {COMPANY.rewardsPartner}. Eligibility and
        conditions are set out in our{" "}
        <Link href="/terms" className={linkClass}>
          Terms of Service
        </Link>
        .
      </p>
    ),
  },
];
