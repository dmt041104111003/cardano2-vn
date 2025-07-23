"use client";

import Image from "next/image";
import Link from "next/link";
import { routers } from "~/constants/routers";
import { images } from "~/public/images";
import { motion } from "framer-motion";
import Action from "~/components/action";
import Timeline from "~/components/timeline";
import { protocols } from "~/constants/protocols";
import Protocol from "~/components/protocol";
import { builds } from "~/constants/builds";
import Build from "~/components/build";
import Loading from '~/components/ui/Loading';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, []);
  if (loading) return <Loading />;
  return (
    <main>
      {/* Landing */}
      <section id="Landing" className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 transform opacity-5">
          <Image loading="lazy" className="h-[50vh] w-auto" style={{ color: "transparent" }} decoding="async" src={images.logo} alt="cardano2vn" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div
            className="relative"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <section className="relative">
                <h1 className="mb-10 text-5xl font-bold  lg:text-8xl">
                  <span className="block tracking-tight">Verified</span>
                  <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text tracking-tight text-transparent drop-shadow-lg">
                    Trusted
                  </span>
                  <span className="mt-4 block text-2xl font-normal text-gray-300 lg:text-4xl">for Distributed Work</span>
                </h1>
                <div className="relative mb-12 border-l-2 border-white/20 pl-6">
                  <p className="mb-6 text-xl leading-relaxed text-gray-300">
                    Infrastructure for <strong className="text-white">decentralized access control</strong>, credential issuance, contributor
                    onboarding, and treasury management.
                  </p>
                  <p className="text-lg text-gray-400">Local participation that opens global opportunity.</p>
                </div>
                <div className="flex flex-col gap-6 sm:flex-row">
                  <Link
                    href={routers.home}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success text-xl bg-white px-8 py-4 font-semibold text-blue-900 shadow-xl hover:bg-gray-100"
                  >
                    Start With Cardano2vn
                  </Link>
                  <Link
                    href={routers.home}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary border-white/50 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-white/10 hover:text-white"
                  >
                    View Documents
                  </Link>
                </div>
              </section>
              <section className="relative hidden lg:block">
                <div className="relative">
                  <div className="relative h-[55vh] w-full">
                    <div className="absolute left-12 top-0 z-10 h-48 w-56 -rotate-2 transform overflow-hidden border-8 border-white shadow-2xl">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url("/images/landings/01.png")' }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent"></div>
                      <div className="relative flex h-full flex-col justify-end p-4">
                        <div className="mb-3 h-8 w-full bg-gradient-to-r from-blue-500/20 to-transparent"></div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-2/3 bg-white/20"></div>
                          <div className="h-1.5 w-1/2 bg-white/10"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute right-8 top-8 z-20 h-64 w-64 rotate-1 transform overflow-hidden border-8 border-white shadow-2xl">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url("/images/landings/02.png")' }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 via-cyan-800/40 to-transparent"></div>
                      <div className="relative flex h-full flex-col justify-end p-4">
                        <div className="mb-3 h-12 w-full bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
                        <div className="space-y-2">
                          <div className="h-1.5 w-2/3 bg-white/20"></div>
                          <div className="h-1.5 w-3/4 bg-white/10"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-24 left-4 z-30 h-60 w-72 -rotate-1 transform overflow-hidden border-8 border-white shadow-2xl">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url("/images/landings/03.png")' }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-800/40 to-transparent"></div>
                      <div className="relative flex h-full flex-col justify-end p-4">
                        <div className="mb-3 h-12 w-full bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                        <div className="space-y-2">
                          <div className="h-1.5 w-1/2 bg-white/20"></div>
                          <div className="h-1.5 w-2/3 bg-white/10"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-12 right-12 z-40 h-52 w-52 rotate-3 transform overflow-hidden border-8 border-white shadow-2xl">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url("/images/landings/04.png")' }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/40 to-transparent"></div>
                      <div className="relative flex h-full flex-col justify-end p-4">
                        <div className="mb-3 h-10 w-full bg-gradient-to-r from-green-500/20 to-transparent"></div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-3/5 bg-white/20"></div>
                          <div className="h-1.5 w-4/5 bg-white/10"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
        <Action title="Next" href="#trust" />
      </section>
      {/* Trust */}
      <section id="trust" className="relative flex min-h-screen items-center overflow-hidden border-t border-white/10 py-20">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
          <div className="relative">
            <header className="mb-8">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                <h2 className="text-3xl font-bold text-white lg:text-4xl">Three Pillars of Trust</h2>
              </div>
              <p className="max-w-3xl text-lg text-gray-300">
                Trust is the foundation of any distributed ecosystem. By enabling purpose-driven, collaborative work, Andamio creates ways for trust
                networks to thrive.
              </p>
            </header>

            <div className="relative">
              <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 transform bg-gradient-to-b from-blue-500 via-green-500 to-purple-500"></div>
              <div className="space-y-8 lg:space-y-12">
                <Timeline />
                <div className="relative animate-[slideInRight_1s_ease-out_0.4s_both]">
                  <div className="flex flex-col items-center justify-between lg:flex-row">
                    <div className="hidden w-5/12 pr-8 lg:block">
                      <div className="text-left opacity-40">
                        <div className="text-6xl font-bold text-green-500/30">02</div>
                        <div className="mt-2 text-green-300/50">Connection</div>
                      </div>
                    </div>
                    <div className="relative z-10 hidden lg:block">
                      <div className="h-8 w-8 rounded-full border-4 border-gray-950 bg-green-500 shadow-lg shadow-green-500/50"></div>
                      <div className="absolute -inset-2 animate-pulse rounded-full bg-green-500/20"></div>
                    </div>
                    <div className="w-full pl-0 lg:w-5/12 lg:pl-8">
                      <div className="group relative">
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green-500/30 to-green-600/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75"></div>
                        <div className="relative rounded-2xl border border-white/20 bg-gray-800/60 p-6 shadow-2xl backdrop-blur-sm">
                          <div className="mb-4 flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gradient-to-br from-green-500 to-green-600 text-2xl font-bold text-white shadow-xl shadow-green-500/25">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-users h-8 w-8"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="mb-2 text-2xl font-bold text-white">Participation</h3>
                              <div className="h-0.5 w-16 bg-green-500"></div>
                            </div>
                          </div>
                          <p className="mb-3 text-base font-semibold text-green-400">Do we trust the people we are working with?</p>
                          <p className="text-base leading-relaxed text-gray-300">
                            Credentials and rewards systems that enable contributor onboarding,
                            <strong className="text-white"> role-based access control</strong>, and recognition of valuable contributions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative animate-[slideInLeft_1s_ease-out_0.6s_both]">
                  <div className="flex flex-col items-center justify-between lg:flex-row">
                    <div className="w-full pr-0 lg:w-5/12 lg:pr-8">
                      <div className="group relative">
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/30 to-purple-600/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75"></div>
                        <div className="relative rounded-2xl border border-white/20 bg-gray-800/60 p-6 shadow-2xl backdrop-blur-sm">
                          <div className="mb-4 flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gradient-to-br from-purple-500 to-purple-600 text-2xl font-bold text-white shadow-xl shadow-purple-500/25">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-check-circle h-8 w-8"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <path d="m9 11 3 3L22 4"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="mb-2 text-2xl font-bold text-white">Proof</h3>
                              <div className="h-0.5 w-16 bg-purple-500"></div>
                            </div>
                          </div>
                          <p className="mb-3 text-base font-semibold text-purple-400">Do we trust that others can do what they say they can do?</p>
                          <p className="text-base leading-relaxed text-gray-300">
                            Discovery and connection tools that make credentials portable and verifiable, enabling
                            <strong className="text-white"> global opportunities through local participation</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 hidden lg:block">
                      <div className="h-8 w-8 rounded-full border-4 border-gray-950 bg-purple-500 shadow-lg shadow-purple-500/50"></div>
                      <div className="absolute -inset-2 animate-pulse rounded-full bg-purple-500/20"></div>
                    </div>
                    <div className="hidden w-5/12 pl-8 lg:block">
                      <div className="text-right opacity-40">
                        <div className="text-6xl font-bold text-purple-500/30">03</div>
                        <div className="mt-2 text-purple-300/50">Verification</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Action title="Scroll" href="#protocol" />
      </section>
      {/* Protocol */}
      <section id="protocol" className="relative flex min-h-screen items-center border-t border-white/10">
        <section className="mx-auto w-5/6 max-w-screen-2xl px-6 py-20 lg:px-8">
          <div className="relative">
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
                <h2 className="text-4xl font-bold text-white lg:text-5xl">The Cardano2vn Protocol</h2>
              </div>
              <p className="max-w-3xl text-xl text-gray-300">Three core components enabling trust for distributed work.</p>
            </div>
            <div className="grid max-w-none gap-16 lg:grid-cols-3">
              {protocols.map((protocol, index) => {
                return (
                  <Protocol color={protocol.color} title={protocol.title} image={protocol.image} key={index} description={protocol.description} />
                );
              })}
            </div>
          </div>
        </section>
        <Action title="Next" href="#cardano" />
      </section>
      {/* Cardano */}
      <section id="cardano" className="relative flex min-h-screen items-center border-t border-white/10">
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid items-center gap-20 lg:grid-cols-2">
            <div className="relative">
              <div className="mb-8 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-transparent"></div>
                <h2 className="text-4xl font-bold text-white lg:text-5xl">Built on Cardano</h2>
              </div>
              <p className="mb-10 text-xl text-gray-300">Leveraging the security and sustainability of the Cardano blockchain.</p>
              <div className="relative rounded-sm border border-white/20 bg-gray-100 p-8 text-gray-900 backdrop-blur-sm">
                <Image
                  alt="Cardano"
                  loading="lazy"
                  width="500"
                  height="500"
                  decoding="async"
                  data-nimg="1"
                  className="mb-8 h-12 brightness-125 filter text-transparent"
                  src={images.cardano}
                />
                <p className="text-lg leading-relaxed text-gray-800">
                  Andamio harnesses Cardanos proof-of-stake blockchain to provide secure, energy-efficient, and transparent credentialing. Every
                  certificate and achievement is <strong className="text-black">immutably recorded</strong>, ensuring your credentials are always
                  verifiable and portable.
                </p>
              </div>
            </div>
            <div className="mx-auto grid w-[180px] grid-cols-1 gap-6">
              {builds.map(function (build, index) {
                return <Build key={index} color={build.color} progress={build.progress} title={build.title} />;
              })}
            </div>
          </div>
        </section>
        <Action title="FINAL" href="#cta" />
      </section>

      <section
        id="cta"
        className="relative flex min-h-screen items-center overflow-hidden border-t border-white/10 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-white to-transparent"></div>
                <h2 className="text-4xl font-bold text-white lg:text-5xl">Ready to enable trust for distributed work?</h2>
              </div>
              <p className="mb-10 text-xl leading-relaxed text-blue-100">
                Join projects and contributors building the future of decentralized collaboration.
              </p>
              <div className="mb-10 flex flex-col gap-6 sm:flex-row">
                <Link href="https://app.andamio.io/course/86affc4de251b0fb7636c376383bcebf6ca7ca426528f9b7a5adc298">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success text-xl bg-white px-8 py-4 font-semibold text-blue-900 shadow-xl hover:bg-gray-100">
                    Start with Cardano2VN
                  </button>
                </Link>
                <Link href="https://docs.andamio.io/docs/">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-xl border-white/70 px-8 py-4 font-semibold text-white shadow-lg hover:bg-white/20 hover:text-white">
                    View Documentation
                  </button>
                </Link>
              </div>
              <div className="grid gap-6 text-blue-200 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-sm border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <span className="text-3xl">👤</span>
                  <div>
                    <div className="text-lg font-semibold text-white">Curious Users</div>
                    <div className="text-sm">Start with Andamio 101</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <span className="text-3xl">👩‍💻</span>
                  <div>
                    <div className="text-lg font-semibold text-white">Developers</div>
                    <div className="text-sm">Explore Documentation</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
              <div className="relative p-8">
                <div className="grid h-80 grid-cols-3 gap-4">
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-sm ">
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                  </div>
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-sm mt-8">
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                  </div>
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-sm -mt-4">
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                  </div>
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-sm ">
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                  </div>
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-sm mt-8">
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                  </div>
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-sm -mt-4">
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                  </div>
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-sm ">
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                  </div>
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-sm mt-8">
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                  </div>
                  <div className="rounded-sm border border-white/20 bg-white/10 backdrop-blur-sm -mt-4">
                    <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
