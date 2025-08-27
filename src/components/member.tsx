import { StaticImageData } from "next/image";

const createTruncatedDisplay = (htmlContent: string, maxLines: number = 3): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  const lines = plainText.split('\n').filter(line => line.trim());
  const truncatedLines = lines.slice(0, maxLines);
  const result = truncatedLines.join('\n');
  return lines.length > maxLines ? result + '...' : result;
};

export default function Member({
  name,
  image,
  role,
  description,
  onClick,
}: {
  name: string;
  image: string | StaticImageData;
  role: string;
  description: string;
  onClick?: () => void;
}) {
  const truncatedDisplay = typeof window !== 'undefined' 
    ? createTruncatedDisplay(description, 3)
    : description.replace(/<[^>]*>/g, '').split('\n').slice(0, 3).join('\n') + '...';

  return (
    <div className="group relative cursor-pointer" onClick={onClick}>
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-gray-200/20 dark:from-white/20 to-gray-100/10 dark:to-white/10 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-30"></div>
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl hover:shadow-gray-400/25 dark:hover:shadow-white/25">
        <div className="relative h-64 overflow-hidden">
          <img
            src={typeof image === 'string' ? image : image.src}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden h-full w-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Image not available</span>
          </div>
          
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-gray-400/60 dark:from-white/60 to-gray-300/30 dark:to-white/30"></div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100/80 dark:bg-white/10 text-gray-700 dark:text-white border border-gray-200 dark:border-white/20">
              {role}
            </div>
          </div>
          <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <div className="whitespace-pre-line line-clamp-3">
              {truncatedDisplay}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center transition-colors hover:bg-gray-300/50 dark:hover:bg-gray-600/50">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center transition-colors hover:bg-gray-300/50 dark:hover:bg-gray-600/50">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center transition-colors hover:bg-gray-300/50 dark:hover:bg-gray-600/50">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100/5 dark:from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      </div>
    </div>
  );
}
