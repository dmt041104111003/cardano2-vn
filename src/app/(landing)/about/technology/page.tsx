import Link from "next/link";
import Project from "~/components/project";
import Skill from "~/components/skill";
import Title from "~/components/title";
import { projects } from "~/constants/projects";
import { skills } from "~/constants/skills";

export default function TechnologyPage() {
  return (
    <main className="relative pt-20">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title title="Our Technology" description="Discover how Andamio's innovative tools are shaping the future of decentralized work." />
        <div className="pb-20">
          {/* About */}
          <section className="mb-16 text-left">
            <aside className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2">
              <div className="flex w-full gap-7 max-sm:flex-col">
                <div className='m relative aspect-video w-[60%] rounded-3xl before:absolute before:left-8 before:top-8 before:h-full before:w-full before:rounded-3xl before:bg-slate-900 before:shadow-xl before:content-[""] max-sm:w-full'>
                  <iframe
                    className="absolute inset-0 z-10 block h-full w-full rounded-xl"
                    src="https://www.youtube.com/embed/_GrbIRoT3mU"
                    title="Open source dynamic assets (Token/NFT) generator (CIP68)"
                    frameBorder={"none"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                </div>
                <div className="z-10 flex w-[40%] flex-col items-start gap-[15px] max-md:gap-3 max-sm:w-full">
                  <h2 className="text-left text-[25px]  font-bold max-md:text-xl">About Cardano2vn</h2>
                  <p className="mb-1 text-[20px] font-normal max-md:text-lg">Open source dynamic assets (Token/NFT) generator (CIP68)</p>
                  <span className={"text-left leading-[1.8] max-md:text-base"}>
                    Open source dynamic assets (Token/NFT) generator (CIP68) CIP68 Generator is a tool designed to simplify the creation, management,
                    and burning of CIP68-compliant native assets on the Cardano platform. It provides an easy-to-use interface for non-technical users
                    to interact with these assets while also offering open-source code for developers to integrate and deploy applications faster and
                    more efficiently.
                  </span>
                  <Link href="https://cips.cardano.org/cip/CIP-68" target="_blank">
                    <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success p-1 text-md rounded-sm bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700">
                      Learn More Cardano2vn
                    </button>
                  </Link>
                </div>
              </div>
            </aside>
          </section>
          {projects.map(function (project, index) {
            return (
              <div key={index}>
                <Skill title={project.title} skills={project.skills} />
                <Project title={project.name} description={project.description} href={project.href} image={project.image} results={project.results} />
              </div>
            );
          })}
          <Skill title="The Cardano2vn Interface" skills={skills} />
          <section className="mt-16 rounded-sm border border-white/20 bg-gray-800/50 p-8 text-center backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold text-white">Start Your Cardano2vn Journey Today</h2>
            <Link href="https://lms.andamio.io">
              <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success p-1 text-md rounded-sm bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700">
                Open Cardano2vn App
              </button>
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
