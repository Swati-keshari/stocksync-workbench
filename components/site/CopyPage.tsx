import { Article } from "@/components/site/Article";

export function CopyPage({
  title,
  lead,
  paragraphs,
}: {
  title: string;
  lead: string;
  paragraphs: string[];
}) {
  return (
    <Article title={title} lead={lead}>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
    </Article>
  );
}
