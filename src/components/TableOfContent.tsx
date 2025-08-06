// "use client";

// import { useEffect, useState } from "react";

// interface TOCItem {
//   id: string;
//   title: string;
//   level: number;
// }

// interface TableOfContentsProps {
//   items: TOCItem[];
// }

// export default function TableOfContents({ items }: TableOfContentsProps) {
//   const [activeId, setActiveId] = useState<string>("");

//   useEffect(() => {
//     if (items.length === 0) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setActiveId(entry.target.id);
//           }
//         });
//       },
//       { rootMargin: "-20px 0px -80% 0px" },
//     );

//     items.forEach((item) => {
//       const heading = document.getElementById(item.id);
//       if (heading) {
//         observer.observe(heading);
//       }
//     });

//     return () => observer.disconnect();
//   }, [items]);

//   if (items.length === 0) return null;

//   return (
//     <div className="w-64 h-[calc(100vh-5rem)] fixed top-24 right-0 overflow-y-auto transparent-scrollbar">
//       <div className="p-4">
//         <h4 className="text-sm font-semibold text-white dark:text-gray-100 mb-4">On this page</h4>
//         <nav className="space-y-1">
//           {items.map((item) => (
//             <a
//               key={item.id}
//               href={`#${item.id}`}
//               className={`block py-1 text-sm hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
//                 activeId === item.id ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-300"
//               }`}
//               style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
//             >
//               {item.title}
//             </a>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// }
