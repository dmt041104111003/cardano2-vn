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
  githubRepo?: string;
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
      
      {technology.githubRepo && (
        <div className="my-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Support the project on GitHub</div>
                         <div className="text-gray-600 dark:text-gray-400 mb-6">
               If you find <strong>{technology.githubRepo.includes('http') ? technology.githubRepo.split('/').pop() : technology.githubRepo.split('/')[1]}</strong> useful, please click the ⭐ button to support!
             </div>
                         <a
               href={technology.githubRepo.startsWith('http') ? technology.githubRepo : `https://github.com/${technology.githubRepo}`}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
             >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 