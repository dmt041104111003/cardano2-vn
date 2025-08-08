// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";

// interface ActionProps {
//   title: string;
//   href: string;
// }

// export default function Action({ title, href }: ActionProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="relative mt-12 text-center"
//     >
//       <Link
//         href={href}
//         className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
//       >
//         <span>{title}</span>
//         <motion.svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="transition-transform duration-300 group-hover:translate-x-1"
//           initial={{ x: 0 }}
//           whileHover={{ x: 4 }}
//         >
//           <path d="M5 12h14" />
//           <path d="m12 5 7 7-7 7" />
//         </motion.svg>
//       </Link>
//     </motion.div>
//   );
// }
