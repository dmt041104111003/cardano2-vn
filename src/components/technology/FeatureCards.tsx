"use client";

import { useQuery } from "@tanstack/react-query";
import { Learn, Check, Verify } from "~/components/icons";
import { FeatureCard } from '~/constants/feature-cards';

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Learn":
      return <Learn color="blue" />;
    case "Check":
      return <Check color="blue" />;
    case "Verify":
      return <Verify color="blue" />;
    default:
      return <Learn color="blue" />;
  }
};

interface FeatureCardsProps {
  featureCardIds?: string[];
}

export default function FeatureCards({ featureCardIds }: FeatureCardsProps) {
  const {
    data: featureCardsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['feature-cards', featureCardIds],
    queryFn: async () => {
      const url = featureCardIds && featureCardIds.length > 0 
        ? `/api/feature-cards?ids=${featureCardIds.join(',')}`
        : '/api/feature-cards';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch feature cards');
      return res.json();
    },
    enabled: true,
  });

  const featureCards: FeatureCard[] = featureCardsData?.data || [];
  if (!featureCardIds || featureCardIds.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[...Array(Math.min(featureCardIds.length, 3))].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-6 animate-pulse">
              <div className="mb-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || featureCards.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {featureCards.map((card, cardIndex) => (
          <div key={card.id || cardIndex} className="rounded-lg border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-6">
            <div className="mb-4">
              {getIconComponent(card.iconName)}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 