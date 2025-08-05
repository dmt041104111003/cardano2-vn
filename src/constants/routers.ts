import { LayoutDashboard, FileText, LayoutTemplate, Users, Settings } from "lucide-react";

export const routers = {
  home: "/",
  about: "/about",
  login: "/login",
  docs: "/docs",
  projects: "/project",
};

export const adminRouters = [
  {
    key: "dashboard",
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    key: "blog",
    title: "Blog Management",
    href: "/admin/blog-management",
    icon: FileText,
  },
  {
    key: "user",
    title: "User Management",
    href: "/admin/user-management",
    icon: Settings,
  },
  {
    key: "ui",
    title: "UI Management",
    href: "/admin/ui-management",
    icon: LayoutTemplate,
  },
  {
    key: "team",
    title: "Team Management",
    href: "/admin/team-management",
    icon: Users,
  },
];

export type NavbarType = { id: number; title: string; href: string; target?: string };
