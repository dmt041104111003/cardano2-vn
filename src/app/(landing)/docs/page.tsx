import TableOfContents from "~/components/TableOfContent";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export default function Page() {
  const tocItems: TOCItem[] = [
    { id: "introduction", title: "Introduction", level: 1 },
    { id: "key-features", title: "Key Features", level: 2 },
    { id: "getting-started", title: "Getting Started", level: 2 },
  ];

  return (
    <>
      <main className="prose prose-blue dark:prose-invert">
        <h1 id="introduction">Introduction</h1>
        <p>Cardano is a third-generation blockchain platform...</p>
        <h2 id="key-features">Key Features</h2>
        <p>Some key features of Cardano include...</p>
        <h2 id="getting-started">Getting Started</h2>
        <p>Learn how to get started with Cardano...</p>
      </main>
      <aside className="hidden xl:block w-64">
        <TableOfContents items={tocItems} />
      </aside>
    </>
  );
}
