import Image from "next/image";
import { images } from "~/public/images";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex items-center p-4 border-b">
        <Image src={images.logo} alt="Cardano2vn" height={40} />
        <span className="ml-4 font-bold text-xl">Cardano2VN Docs</span>
      </header>
      <main className="max-w-3xl mx-auto p-4">{children}</main>
    </div>
  );
}
