"use client";
import Link from "next/link";
import Navigation from "~/components/navigation";
import Title from "~/components/title";
import { useState } from "react";
import { proposals } from "~/constants/proposals";

export default function ProjectPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const years = Array.from(new Set(proposals.map((p) => p.year))).sort();
  return (
    <main className="relative pt-20">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title
          title="Projects Cardano2vn Roadmap"
          description="Our journey of building the Andamio platform and ecosystem, from founding to the present day and beyond."
        />
        <Navigation />
        <div className="relative">
          <div className="relative z-10">
            <div className="mb-8 mt-2">
              <div dir="ltr" data-orientation="vertical" className="flex flex-col md:flex-row">
                <div className="w-full md:w-80 md:shrink-0 md:pr-8">
                  <div
                    role="tablist"
                    aria-orientation="vertical"
                    className="items-center justify-center rounded-sm text-accent-foreground mb-2 flex w-full flex-row gap-2 overflow-x-auto bg-transparent p-0 md:flex-col md:overflow-visible"
                    data-orientation="vertical"
                  >
                    {years.map((index, key) => (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={year === index}
                        aria-controls={`content-${index}`}
                        id={`trigger-${index}`}
                        onClick={() => setYear(index)}
                        className={`inline-flex items-center whitespace-nowrap w-full justify-start rounded-sm border px-4 py-3 text-left text-sm font-medium backdrop-blur-sm transition-all ${
                          year === index ? "bg-blue-600 text-white border-white/20" : "bg-gray-800/50 text-white border-white/20 hover:bg-gray-700/50"
                        }`}
                      >
                        {index}
                      </button>
                    ))}
                  </div>
                  <Link href="https://andamio.notion.site/1fb44d820e1d804ebec4f0142d3f267a?pvs=105">
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:text-success p-1 px-3 w-full rounded-sm bg-blue-600 text-white hover:bg-blue-700">
                      Give Feedback
                    </button>
                  </Link>
                </div>
                <div className="mt-6 flex-1 md:-mt-12">
                  <div
                    data-state="active"
                    data-orientation="vertical"
                    role="tabpanel"
                    aria-labelledby="radix-:ri:-trigger-2023"
                    id="radix-:ri:-content-2023"
                    className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                  >
                    <div className="mb-8 text-right">
                      <h2 className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-6xl font-bold tracking-tight text-transparent">
                        {year}
                      </h2>
                    </div>
                    <div className="mb-16 grid grid-cols-1 gap-6">
                      {proposals
                        .filter((proposal) => proposal.year === year)
                        .map((proposal) => (
                          <div className="w-full">
                            <div className="group w-full rounded-sm border border-white/20 bg-gray-800/50 shadow-xl backdrop-blur-sm transition-all hover:border-white/40 hover:shadow-2xl">
                              <div className="flex w-full">
                                <div className="flex-grow border-l-4 bg-gray-900/60 border-green-500 rounded-l-lg">
                                  <div className="p-5">
                                    <div className="mb-3">
                                      <h3 className="text-xl font-bold tracking-tight text-white">{proposal.title}</h3>
                                    </div>
                                    <p className="max-w-2xl text-sm text-gray-300">{proposal.description}</p>
                                    <div className="mt-4 text-xs">
                                      <Link
                                        href={proposal.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 transition-colors duration-200 hover:text-blue-300 hover:underline"
                                      >
                                        View Proposal
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex w-32 flex-col justify-center bg-green-900/30 rounded-r-lg p-4">
                                  <div className="flex flex-col items-end">
                                    <div className="text-xl font-bold text-green-300">{proposal.year}</div>
                                    <div className="text-xl font-bold text-green-300">{proposal.quarterly}</div>
                                    <div className="mt-6 text-xs font-medium text-green-300">{proposal.status}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                      <p className="text-sm text-gray-400">End of 2023</p>
                    </div>
                  </div>
                  <div
                    data-state="inactive"
                    data-orientation="vertical"
                    role="tabpanel"
                    aria-labelledby="radix-:ri:-trigger-2024"
                    id="radix-:ri:-content-2024"
                    className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                  ></div>
                  <div
                    data-state="inactive"
                    data-orientation="vertical"
                    role="tabpanel"
                    aria-labelledby="radix-:ri:-trigger-2025"
                    id="radix-:ri:-content-2025"
                    className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                  ></div>
                  <div
                    data-state="inactive"
                    data-orientation="vertical"
                    role="tabpanel"
                    aria-labelledby="radix-:ri:-trigger-2026"
                    id="radix-:ri:-content-2026"
                    className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                  ></div>
                  <div
                    data-state="inactive"
                    data-orientation="vertical"
                    role="tabpanel"
                    aria-labelledby="radix-:ri:-trigger-2027"
                    id="radix-:ri:-content-2027"
                    className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
