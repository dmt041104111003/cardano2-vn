/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";

interface NavDocsProps {
  previous?: { title: string; href: string };
  current: { title: string; href: string };
  next?: { title: string; href: string };
}

export default function NavDocs({ previous, current, next }: NavDocsProps) {
  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto">
        <nav className="flex justify-between items-stretch flex-col md:flex-row gap-4">
          {previous && (
            <Link href={previous.href} className="flex-1 px-4 py-3 border text-sm rounded-md transition flex items-center gap-4">
              <div className="text-xl">←</div>
              <div className="text-left">
                <div className="font-medium  ">Previous</div>
                <div className="text-blue-600 font-medium  dark:text-blue-400">{previous.title}</div>
              </div>
            </Link>
          )}
          {next && (
            <Link href={next.href} className="flex-1 px-4 py-3 border text-sm rounded-md transition flex items-center justify-end gap-4 text-right">
              <div className="text-right">
                <div className="font-medium ">Next</div>
                <div className="text-blue-600 font-medium  dark:text-blue-400">{next.title}</div>
              </div>
              <div className="text-xl">→</div>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
