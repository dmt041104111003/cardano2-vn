"use client";

import { motion } from "framer-motion";
import Timeline from "~/components/timeline";
// import Action from "~/components/action";

export default function TrustSection() {
  return (
    <section id="trust" className="relative flex min-h-screen items-center overflow-hidden border-t border-gray-200 dark:border-white/10 py-20">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <div className="relative">
          <motion.header 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">Three Pillars of Trust</h2>
            </div>
            <p className="max-w-3xl text-lg text-gray-700 dark:text-gray-300">
              Trust is the foundation of any distributed ecosystem. By enabling purpose-driven, collaborative work, Andamio creates ways for trust
              networks to thrive.
            </p>
          </motion.header>

          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 transform bg-gradient-to-b from-blue-500 via-green-500 to-purple-500"
            ></motion.div>
            <div className="space-y-8 lg:space-y-12">
              <Timeline />
              <motion.div 
                initial={{ opacity: 0, x: 100, rotateY: -15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 80
                }}
                whileHover={{ 
                  rotateY: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="relative"
              >
                <div className="flex flex-col items-center justify-between lg:flex-row">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hidden w-5/12 pr-8 lg:block"
                  >
                    <div className="text-left opacity-40">
                      <div className="text-6xl font-bold text-green-500/30">02</div>
                      <div className="mt-2 text-green-300/50">Connection</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.4,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="relative z-10 hidden lg:block"
                  >
                    <div className="h-8 w-8 rounded-full border-4 border-white dark:border-gray-950 bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <div className="absolute -inset-2 animate-pulse rounded-full bg-green-500/20"></div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full pl-0 lg:w-5/12 lg:pl-8"
                  >
                    <div className="group relative">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green-500/30 to-green-600/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75"
                      ></motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 30, rotateX: -10 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ 
                          duration: 0.7, 
                          delay: 0.4,
                          ease: "easeOut"
                        }}
                        whileHover={{ 
                          y: -8,
                          rotateX: 2,
                          transition: { duration: 0.3 }
                        }}
                        className="relative rounded-2xl border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/60 p-6 shadow-2xl backdrop-blur-sm"
                      >
                        <div className="mb-4 flex items-center gap-4">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ 
                              duration: 0.5, 
                              delay: 0.5,
                              type: "spring",
                              stiffness: 150
                            }}
                            whileHover={{ 
                              rotate: 360,
                              transition: { duration: 0.6 }
                            }}
                            className="flex h-16 w-16 items-center justify-center rounded-sm bg-gradient-to-br from-green-500 to-green-600 text-2xl font-bold text-white shadow-xl shadow-green-500/25"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-users h-8 w-8"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          </motion.div>
                          <div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Participation</h3>
                            <div className="h-0.5 w-16 bg-green-500"></div>
                          </div>
                        </div>
                        <p className="mb-3 text-base font-semibold text-green-600 dark:text-green-400">Do we trust the people we are working with?</p>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                          Credentials and rewards systems that enable contributor onboarding,
                          <strong className="text-gray-900 dark:text-white"> role-based access control</strong>, and recognition of valuable contributions.
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -100, rotateY: 15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 80
                }}
                whileHover={{ 
                  rotateY: -5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="relative"
              >
                <div className="flex flex-col items-center justify-between lg:flex-row">
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full pr-0 lg:w-5/12 lg:pr-8"
                  >
                    <div className="group relative">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/30 to-purple-600/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75"
                      ></motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 30, rotateX: -10 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ 
                          duration: 0.7, 
                          delay: 0.4,
                          ease: "easeOut"
                        }}
                        whileHover={{ 
                          y: -8,
                          rotateX: 2,
                          transition: { duration: 0.3 }
                        }}
                        className="relative rounded-2xl border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/60 p-6 shadow-2xl backdrop-blur-sm"
                      >
                        <div className="mb-4 flex items-center gap-4">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ 
                              duration: 0.5, 
                              delay: 0.5,
                              type: "spring",
                              stiffness: 150
                            }}
                            whileHover={{ 
                              rotate: 360,
                              transition: { duration: 0.6 }
                            }}
                            className="flex h-16 w-16 items-center justify-center rounded-sm bg-gradient-to-br from-purple-500 to-purple-600 text-2xl font-bold text-white shadow-xl shadow-purple-500/25"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-check-circle h-8 w-8"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <path d="m9 11 3 3L22 4"></path>
                            </svg>
                          </motion.div>
                          <div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Proof</h3>
                            <div className="h-0.5 w-16 bg-purple-500"></div>
                          </div>
                        </div>
                        <p className="mb-3 text-base font-semibold text-purple-600 dark:text-purple-400">Do we trust that others can do what they say they can do?</p>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                          Discovery and connection tools that make credentials portable and verifiable, enabling
                          <strong className="text-gray-900 dark:text-white"> global opportunities through local participation</strong>.
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.4,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="relative z-10 hidden lg:block"
                  >
                    <div className="h-8 w-8 rounded-full border-4 border-white dark:border-gray-950 bg-purple-500 shadow-lg shadow-purple-500/50"></div>
                    <div className="absolute -inset-2 animate-pulse rounded-full bg-purple-500/20"></div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hidden w-5/12 pl-8 lg:block"
                  >
                    <div className="text-right opacity-40">
                      <div className="text-6xl font-bold text-purple-500/30">03</div>
                      <div className="mt-2 text-purple-300/50">Verification</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      {/* <Action title="Scroll" href="#protocol" /> */}
    </section>
  );
} 