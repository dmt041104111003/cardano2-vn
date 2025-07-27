import { Learn, Check, Verify } from "~/components/icons";

const featureCards = [
  {
    Icon: () => <Learn color="blue" />,
    title: "Asset Minting",
    description: "Create and manage dynamic assets on Cardano.",
    color: "blue"
  },
  {
    Icon: () => <Check color="green" />,
    title: "Asset Updating", 
    description: "Create and manage dynamic assets on Cardano.",
    color: "green"
  },
  {
    Icon: () => <Verify color="purple" />,
    title: "Asset Burning",
    description: "Create and manage dynamic assets on Cardano.",
    color: "purple"
  }
];

export default function FeatureCards() {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {featureCards.map((card, cardIndex) => (
          <div key={cardIndex} className="rounded-lg border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-6">
            <div className="mb-4">
              <card.Icon />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 