import About from "~/components/about";
import Title from "~/components/title";
import { abouts } from "~/constants/abouts";

export default function AboutPage() {
  return (
    <main className="relative pt-20">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title
          title="About Cardano2vn"
          description=" Learn about Andamio's vision, team, and technology, and explore how we're transforming the future of collaboration and learning."
        />
        <div className="pb-20">
          <div className="relative mb-16">
            <p className="mb-12 text-lg leading-relaxed text-gray-300">
              Andamio is a <strong className="text-white">Trust Protocol for Distributed Work</strong> that provides infrastructure for decentralized
              access control, credential issuance, contributor onboarding, and treasury management. We believe in enabling local participation that
              opens global opportunity.
            </p>
            <div className="mb-16 rounded-sm border border-white/20 bg-gray-800/50 p-8 backdrop-blur-sm">
              <h2 className="mb-4 text-2xl font-bold text-white">Our Mission</h2>
              <p className="text-lg text-gray-300">
                To create trust networks that enable purpose-driven, collaborative work by providing the tools and infrastructure needed for
                distributed organizations to thrive.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {abouts.map(function (about, index) {
              return (
                <About
                  title={about.title}
                  description={about.description}
                  color={about.color}
                  href={about.href}
                  key={index}
                  action={about.action}
                  Icon={() => <about.icon color={about.color} />}
                />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
