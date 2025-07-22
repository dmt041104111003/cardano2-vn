import Image from "next/image";
import Link from "next/link";
import { routers } from "~/constants/routers";
import { images } from "~/public/images";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex h-full  flex-col w-full items-center justify-center bg-[#13161b]">
      <div>
        <Image className="animate-pulse" width={260} src={images.logo} alt="not-found" />
      </div>
      <div className="text-2xl font-bold">404 - Page not found</div>
      <div className="text-base text-[#8e97a8]">The page you are looking for does not exist</div>
      <Link
        href={routers.home}
        className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-gray-800/50 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:border-white/50 hover:bg-gray-700/50"
      >
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
