import type { BlogBodyBlock } from "@/lib/blogPosts";

type Props = {
  body: BlogBodyBlock[];
};

/** Renders a blog post's typed body blocks with the same prose styling as the legal pages. */
export function BlogPostBody({ body }: Props) {
  return (
    <div className="max-w-2xl">
      {body.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2
              key={i}
              className="mb-4 mt-12 font-display text-2xl text-loch-900 first:mt-0"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={i}
              className="mb-6 list-disc space-y-2 pl-5 text-lg leading-relaxed text-loch-800/80"
            >
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="mb-6 text-lg leading-relaxed text-loch-800/80">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
