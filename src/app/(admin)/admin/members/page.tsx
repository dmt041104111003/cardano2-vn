import { Metadata } from "next";
import MembersPageClient from "~/components/admin/members/MembersPageClient";

export const metadata: Metadata = {
  title: "Members Management - Admin",
  description: "Manage team members for the about page",
};

export default function MembersPage() {
  return <MembersPageClient />;
} 