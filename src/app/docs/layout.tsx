import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "~/app/layout.config";
import { source } from "~/app/lib/source";

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  // Disable sidebar toggle/collapse functionality
  sidebar: {
    enabled: true,
    collapsible: false,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <DocsLayout {...docsOptions}>{children}</DocsLayout>
    </div>
  );
}
