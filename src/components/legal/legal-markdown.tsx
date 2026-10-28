import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { cn } from "@/lib/utils";

/** Minimal shape of the hast nodes react-markdown passes to components. */
type HastLike = {
  type?: string;
  value?: string;
  tagName?: string;
  children?: HastLike[];
};

function textOf(node?: HastLike): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

function hasEmptyHead(table?: HastLike) {
  const thead = table?.children?.find((child) => child.tagName === "thead");
  return thead !== undefined && textOf(thead).trim() === "";
}

function reactText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(reactText).join("");
  return "";
}

const components: Components = {
  // The page title is the only h1, so Markdown h1s render as h2.
  h1: ({ node: _node, ...props }) => <h2 {...props} />,

  // Wide tables scroll inside their own box. Tables whose header row is empty
  // (e.g. "Who We Are") drop that row and style the first column as labels.
  table: ({ node, className, ...props }) => (
    <div className="table-wrap">
      <table
        {...props}
        className={cn(
          className,
          hasEmptyHead(node as unknown as HastLike) && "kv-table",
        )}
      />
    </div>
  ),
  thead: ({ node, ...props }) =>
    textOf(node as unknown as HastLike).trim() === "" ? null : (
      <thead {...props} />
    ),

  // In print, show the URL after a link only when the link text is not
  // already the URL (in-text links such as https://hunterx.co.in/privacy are).
  a: ({ node: _node, href = "", children, ...props }) => {
    const text = reactText(children).trim();
    const shown = href.startsWith("mailto:") ? href.slice(7) : href;
    const printUrl =
      href && !href.startsWith("#") && text !== shown ? href : undefined;
    return (
      <a href={href} data-print-url={printUrl} {...props}>
        {children}
      </a>
    );
  },
};

export function LegalMarkdown({ body }: { body: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              className: ["heading-anchor"],
              ariaHidden: "true",
              tabIndex: -1,
            },
            content: { type: "text", value: "#" },
          },
        ],
      ]}
      components={components}
    >
      {body}
    </ReactMarkdown>
  );
}
