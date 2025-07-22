import { LayoutDashboard, FileText, LayoutTemplate, Users, Settings } from "lucide-react";

export const routers = {
  home: "/",
  about: "/about",
  member: "/about/member",
  technology: "/about/technology",
  login: "/login",
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
