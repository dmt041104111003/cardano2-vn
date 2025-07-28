"use client";

import { protocols } from "~/constants/protocols";
import Protocol from "~/components/protocol";
import Action from "~/components/action";

export default function ProtocolSection() {
  return (
    <section id="protocol" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
      <section className="mx-auto w-5/6 max-w-screen-2xl px-6 py-20 lg:px-8">
        <div className="relative">
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">The Cardano2vn Protocol</h2>
            </div>
            <p className="max-w-3xl text-xl text-gray-700 dark:text-gray-300">Three core components enabling trust for distributed work.</p>
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
  );
} 