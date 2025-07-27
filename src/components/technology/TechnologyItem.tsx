import Skill from "~/components/skill";
import Project from "~/components/project";
import FeatureCards from "./FeatureCards";
import { Verify, Onboarding, Decentralized } from "~/components/icons";

interface Technology {
  id: string;
  title: string;
  name: string;
  description: string;
  href: string;
  image: string;
}

const defaultResults = [
  {
    Icon: () => <Verify color="blue" />,
    title: "Dynamic Asset Creation",
    description: "Users can create dynamic assets with custom metadata.",
    color: "green"
  },
  {
    Icon: () => <Onboarding color="blue" />,
    title: "Asset Management",
    description: "Manage and update dynamic assets efficiently.",
    color: "blue"
  },
  {
    Icon: () => <Decentralized color="blue" />,
    title: "Asset Management",
    description: "Manage and update dynamic assets efficiently.",
    color: "purple"
  }
];

interface TechnologyItemProps {
  technology: Technology;
}

export default function TechnologyItem({ technology }: TechnologyItemProps) {
  return (
    <div>
      <Skill title={technology.title} skills={[]} />
      <FeatureCards />
      <Project 
        title={technology.name} 
        description={technology.description} 
        href={technology.href} 
        image={technology.image} 
        results={defaultResults} 
      />
    </div>
  );
} 