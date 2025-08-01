import { StaticImageData } from "next/image";

// Home Components Interfaces
export type Skill = {
  id?: number;
  Icon: React.ComponentType;
  color: string;
  title: string;
  description: string;
};

export type Result = {
  id?: number;
  Icon: React.ComponentType;
  color: string;
  title: string;
  description: string;
};

export type Project = {
  id?: number;
  title: string;
  name: string;
  description: string;
  image: string | StaticImageData;
  href: string;
  skills: Skill[];
  results?: Result[];
}; 