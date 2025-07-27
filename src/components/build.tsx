export default function Build({ title, progress, color }: { title: string; progress: string; color: string }) {
  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 rounded-sm bg-${color}-500/30 opacity-50 blur transition duration-300 group-hover:opacity-75`}></div>
      <div className="relative rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/80 p-6 shadow-xl backdrop-blur-sm">
        <div className={`mb-2 text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>{progress}</div>
        <div className="font-medium text-gray-700 dark:text-gray-300">{title}</div>
        <div className={`mt-3 h-1 w-full rounded-full bg-${color}-500/20`}></div>
      </div>
    </div>
  );
}
