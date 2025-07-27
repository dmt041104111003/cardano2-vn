import Image, { StaticImageData } from "next/image";

export default function Protocol({
  color,
  title,
  description,
  image,
}: {
  image: string | StaticImageData;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-sm bg-gradient-to-r from-${color}-500 to-${color}-600 opacity-30 blur transition duration-500 group-hover:opacity-50`}
      ></div>
      <div
        className={`relative aspect-square overflow-hidden rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-900 shadow-2xl transition-all duration-500 hover:shadow-${color}-500/10`}
      >
        <Image
          alt="Protocol Image"
          src={image}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-${color}-900/90 via-${color}-800/50 to-transparent`}></div>
        <div className={`absolute inset-0 bg-gradient-to-r from-${color}-900/40 to-transparent`}></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <div className={`h-0.5 w-16 bg-${color}-400`}></div>
            <p className={`text-sm leading-relaxed text-${color}-100`}>{description}</p>
          </div>
        </div>
        <div className={`absolute inset-0 bg-${color}-900/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}></div>
      </div>
    </div>
  );
}
