import { Paper, Team, Tech } from "~/components/icons";
import { routers } from "./routers";

export const abouts = [
  {
    id: 1,
    title: "Cardano2vn Whitepaper",
    description:
      "Dive into our whitepaper to explore the foundations of Andamio's trust protocol and distributed work platform trust protocol and distributed work platform.",
    icon: Paper,
    href: "",
    color: "blue",
    action: "Read More",
  },
  {
    id: 2,
    title: "Out Team",
    description:
      "Dive into our whitepaper to explore the foundations of Andamio's trust protocol and distributed work platform trust protocol and distributed work platform.",
    icon: Team,
    href: routers.member,
    color: "green",
    action: "Meet The Team",
  },
  {
    id: 3,
    title: "Out Technology",
    description:
      "Dive into our whitepaper to explore the foundations of Andamio's trust protocol and distributed work platform trust protocol and distributed work platform.",
    icon: Tech,
    href: routers.technology,
    color: "purple",
    action: "Learn More",
  },
];
