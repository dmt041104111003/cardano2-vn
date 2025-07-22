import Sidebar from "~/components/sidebar";
import { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:block w-80">
        <Sidebar />
      </aside>

      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto lg:ml-20 xl:mr-64 prose prose-blue dark:prose-invert">{children}</main>
    </div>
  );
}
