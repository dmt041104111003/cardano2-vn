// "use client";

// import Image from "next/image";
// import { builds } from "~/constants/builds";
// import Build from "~/components/build";
// import { images } from "~/public/images";
// import Action from "~/components/action";

// export default function CardanoSection() {
//   return (
//     <section id="cardano" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
//       <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
//         <div className="grid items-center gap-20 lg:grid-cols-2">
//           <div className="relative">
//             <div className="mb-8 flex items-center gap-4">
//               <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-transparent"></div>
//               <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">Built on Cardano</h2>
//             </div>
//             <p className="mb-10 text-xl text-gray-700 dark:text-gray-300">Leveraging the security and sustainability of the Cardano blockchain.</p>
//             <div className="relative rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-gray-800 p-8 text-gray-900 dark:text-gray-100 backdrop-blur-sm">
//               <Image
//                 alt="Cardano"
//                 loading="lazy"
//                 width="500"
//                 height="500"
//                 decoding="async"
//                 data-nimg="1"
//                 className="mb-8 h-12 brightness-125 filter text-transparent"
//                 src={images.cardano}
//               />
//               <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
//                 Cardano2vn harnesses Cardanos proof-of-stake blockchain to provide secure, energy-efficient, and transparent credentialing. Every
//                 certificate and achievement is <strong className="text-black dark:text-white">immutably recorded</strong>, ensuring your credentials are always
//                 verifiable and portable.
//               </p>
//             </div>
//           </div>
//           <div className="mx-auto grid w-[180px] grid-cols-1 gap-6">
//             {builds.map(function (build, index) {
//               return <Build key={index} color={build.color} progress={build.progress} title={build.title} />;
//             })}
//           </div>
//         </div>
//       </section>
//       <Action title="FINAL" href="#cta" />
//     </section>
//   );
// } 