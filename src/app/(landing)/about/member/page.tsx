"use client";

import Link from "next/link";
import { Gmail } from "~/components/icons";
import Member from "~/components/member";
import MemberModal from "~/components/MemberModal";
import Title from "~/components/title";
import { members } from "~/constants/members";
import { useState } from "react";

export const metadata = {
  title: 'Members | Cardano2vn',
  description: 'Meet the Cardano2vn team members',
};

type MemberType = typeof members[0];

export default function MemberPage() {
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMemberClick = (member: MemberType) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <main className="relative pt-20">
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
                  key={index}
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
