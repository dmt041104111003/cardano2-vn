'use client';

import Link from "next/link";
import { Gmail } from "~/components/icons";
import Member from "~/components/member";
import MemberModal from "~/components/MemberModal";
import Title from "~/components/title";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface MemberType {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MemberPageClient() {
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: queryData, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await fetch('/api/admin/members');
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      return response.json();
    }
  });

  const members: MemberType[] = queryData?.members || [];

  const handleMemberClick = (member: MemberType) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  if (isLoading) {
    return (
      <main className="relative pt-20">
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Title
            title="Founding Team"
            description="Our diverse team combines expertise in education, blockchain development, product management, and community building. Together, we're creating the infrastructure for trust-based distributed work."
          />
          <div className="mx-auto pb-20">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-700 rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
              <div className="rounded-sm border border-white/20 bg-gray-800/50 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-bold text-white">Join Our Team</h3>
                <p className="mb-6 text-gray-300">
                  Interested in contributing to the future of distributed work? We are always looking for passionate individuals.
                </p>
                <Link
                  href="mailto:cardano2vn@gmail.com"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-blue-600 px-6 py-3 text-white transition-all duration-200 hover:bg-blue-700"
                >
                  <span>Get in Touch</span>
                  <Gmail />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative pt-20" suppressHydrationWarning>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title
          title="Founding Team"
          description="Our diverse team combines expertise in education, blockchain development, product management, and community building. Together, we're creating the infrastructure for trust-based distributed work."
        />
        <div className="mx-auto pb-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {members.map(function (member, index) {
              return (
                <Member
                  name={member.name}
                  key={member.id}
                  description={member.description}
                  role={member.role}
                  image={member.image}
                  onClick={() => handleMemberClick(member)}
                />
              );
            })}
          </div>
          <div className="mt-16 text-center">
            <div className="rounded-sm border border-white/20 bg-gray-800/50 p-8 backdrop-blur-sm">
              <h3 className="mb-4 text-2xl font-bold text-white">Join Our Team</h3>
              <p className="mb-6 text-gray-300">
                Interested in contributing to the future of distributed work? We are always looking for passionate individuals.
              </p>
              <Link
                href="mailto:cardano2vn@gmail.com"
                className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-blue-600 px-6 py-3 text-white transition-all duration-200 hover:bg-blue-700"
              >
                <span>Get in Touch</span>
                <Gmail />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
} 