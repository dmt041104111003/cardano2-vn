import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Result } from "~/types";

export default function Project({
  title,
  description,
  href,
  image,
  results,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
  results?: Result[];
}) {
  const Component = function ({ Icon, title, description }: { Icon: React.ComponentType; title: string; description: string }) {
    return (
      <li className="flex items-start gap-4">
        <Icon />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </li>
    );
  };
  return (
    <section className="mb-16 flex flex-col items-center gap-12 rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-8 backdrop-blur-sm lg:flex-row">
      <div className="lg:w-1/2">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">{description}</p>
        <ul className="space-y-4">
          {results?.map((result, index) => (
            <Component key={index} Icon={result.Icon} title={result.title} description={result.description} />
          ))}
        </ul>
      </div>
      <Link href={href} className="flex justify-center lg:w-1/2">
        <img
          alt={title}
          loading="lazy"
          className="w-full max-w-lg cursor-pointer transition-transform duration-300 hover:scale-105 sm:max-w-xl md:max-w-2xl"
          src={image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden w-full max-w-lg h-48 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 sm:max-w-xl md:max-w-2xl">
          <span className="text-gray-400">Image not available</span>
        </div>
      </Link>
    </section>
  );
}
