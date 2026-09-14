import Link from "next/link";

export function Article({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <p className="mb-3 text-sm text-text-secondary">
        <Link href="/" className="hover:text-text-primary">
          Home
        </Link>
      </p>
      <h1 className="font-display text-4xl leading-tight">{title}</h1>
      <p className="mt-3 text-lg text-text-secondary">{lead}</p>
      <div className="mt-8 space-y-4 text-[15px] leading-7 text-text-primary">{children}</div>
    </article>
  );
}
