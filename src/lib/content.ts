import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type LegalSlug = "privacy" | "terms";

export type TocItem = { id: string; text: string };

export type LegalDocument = {
  slug: LegalSlug;
  title: string;
  summary?: string;
  /** Date exactly as written in the frontmatter, e.g. "27 October 2026". */
  updated?: string;
  /** Machine-readable version (YYYY-MM-DD) for <time> and the sitemap. */
  updatedIso?: string;
  body: string;
  /** One entry per `##` heading, in order. */
  toc: TocItem[];
};

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/** Accepts "27 October 2026", "2026-10-27" or a YAML date. */
function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(text);
  if (!match) return undefined;
  const month = MONTHS.indexOf(match[2].toLowerCase());
  if (month === -1) return undefined;
  return `${match[3]}-${String(month + 1).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

function toDisplayDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(value);
  }
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** Strips common inline Markdown so TOC labels read as plain text. */
function plainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

/**
 * Builds the table of contents from `##` headings by parsing the Markdown on
 * the server. Every heading is slugged in order with github-slugger (the
 * algorithm rehype-slug uses), so the ids match the rendered headings even
 * when titles repeat.
 */
function buildToc(body: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = plainText(match[2]);
    const id = slugger.slug(text);
    if (match[1].length === 2) toc.push({ id, text });
  }
  return toc;
}

export async function getLegalDocument(
  slug: LegalSlug,
): Promise<LegalDocument> {
  const file = await fs.readFile(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(file);

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    summary: typeof data.summary === "string" ? data.summary : undefined,
    updated: toDisplayDate(data.updated),
    updatedIso: toIsoDate(data.updated),
    body: content,
    toc: buildToc(content),
  };
}
