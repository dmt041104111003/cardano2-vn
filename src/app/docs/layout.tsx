import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "~/app/layout.config";
import { source } from "~/app/lib/source";
import 'fumadocs-ui/css/ocean.css';
import 'fumadocs-ui/css/preset.css';

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout {...docsOptions}>{children}</DocsLayout>;
}
