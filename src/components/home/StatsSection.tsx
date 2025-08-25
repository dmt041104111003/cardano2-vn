// "use client";

// import React, { useEffect, useRef, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { StatsData } from '~/constants/stats';
// import CountUp from 'react-countup';

// export default function StatsSection() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   const { data: stats, isLoading, error } = useQuery<StatsData>({
//     queryKey: ['community-stats'],
//     queryFn: async () => {
//       const [membersRes, projectsRes, technologiesRes] = await Promise.all([
//         fetch('/api/members'),
//         fetch('/api/projects'),
//         fetch('/api/technologies')
//       ]);

//       const membersData = await membersRes.json();
//       const projectsData = await projectsRes.json();
//       const technologiesData = await technologiesRes.json();

//       return {
//         members: membersData.data?.length || 0,
//         technology: projectsData.data?.length || 0,
//         catalyst: technologiesData.data?.length || 0,
//         total: (membersData.data?.length || 0) + (projectsData.data?.length || 0) + (technologiesData.data?.length || 0)
//       };
//     },
//     staleTime: 5 * 60 * 1000,
//     refetchInterval: 30 * 1000,
//   });

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         } else {
//           setIsVisible(false);
//         }
//       },
//       { threshold: 0.3 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);



//   const currentStats = stats || { members: 0, technology: 0, catalyst: 0 };

//   const trustStats = [
//     {
//       label: 'Members',
//       value: currentStats.members.toString()
//     },
//     {
//       label: 'Projects',
//       value: currentStats.technology.toString()
//     },
//     {
//       label: 'Catalyst',
//       value: currentStats.catalyst.toString()
//     }
//   ];

//   return (
//     <section ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900">
//       <div className="mx-auto w-5/6 max-w-screen-2xl px-6 py-12 lg:px-8">
//         <div className="text-center mb-12">
//           <div className="mb-4 lg:mb-6 flex items-center justify-center gap-2 lg:gap-4">
//             <div className="h-1 w-8 lg:w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
//             <div className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">
//               Community Statistics
//             </div>
//           </div>
//           <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
//             Discover the power of Cardano2VN community with impressive numbers
//           </p>
//           {isLoading && (
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//               Loading real-time data...
//             </p>
//           )}
//         </div>
        
//         <div className="grid md:grid-cols-3 gap-8">
//           {trustStats.map((stat, index) => (
//             <div key={index} className="text-center">
              
//             <div className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
//                 {isVisible ? (
//                   <CountUp
//                     end={parseInt(stat.value.replace(/[^0-9]/g, ''))}
//                     duration={2.5}
//                     delay={index * 0.2}
//                     suffix={stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}
//                   />
//                 ) : (
//                   '0'
//                 )}
//               </div>
//               <div className="text-lg text-gray-700 dark:text-gray-300">
//                 {stat.label}
//               </div>
//             </div>
//           ))}
//         </div>
        

//       </div>
//     </section>
//   );
// }
