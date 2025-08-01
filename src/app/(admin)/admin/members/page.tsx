import { Metadata } from "next";
import MembersWithTabsPageClient from "~/components/admin/members/MembersWithTabsPageClient";

export const metadata: Metadata = {
  title: "About & Member Management - Admin",
  description: "Manage about content and team members for the about page",
};

export default function MembersPage() {
  return <MembersWithTabsPageClient />;
} 