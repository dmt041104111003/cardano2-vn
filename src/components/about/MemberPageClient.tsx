'use client';

import Link from "next/link";
import { Gmail } from "~/components/icons";
import Member from "~/components/member";
import MemberModal from "~/components/MemberModal";
import Title from "~/components/title";
import AboutSection from "~/components/technology/AboutSection";
import ContactForm from "~/components/contact/ContactForm";
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
      <main className="relative pt-20 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
        {/* Background Logo */}
        <div className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 opacity-3 pointer-events-none select-none block">
          <img
            src="/images/common/loading.png"
            alt="Cardano2VN Logo"
            className="w-[1200px] h-[1200px] object-contain"
            draggable={false}
            style={{ objectPosition: 'left center' }}
          />
        </div>
        
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Title
            title="Founding Team"
            description="Our diverse team combines expertise in education, blockchain development, product management, and community building. Together, we're creating the infrastructure for trust-based distributed work."
          />
          <div className="mx-auto pb-20">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>
            <div className="mt-16">
              <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <h3 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">Contact</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Have questions about our projects or want to collaborate? We'd love to hear from you.
                  </p>
                </div>
                <div className="w-full max-w-2xl mx-auto">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="flex justify-center">
                      <div className="h-12 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative pt-20 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900" suppressHydrationWarning>
      {/* Background Logo */}
      <div className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 opacity-3 pointer-events-none select-none block">
        <img
          src="/images/common/loading.png"
          alt="Cardano2VN Logo"
          className="w-[1200px] h-[1200px] object-contain"
          draggable={false}
          style={{ objectPosition: 'left center' }}
        />
      </div>
      
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title
          title="Founding Team"
          description="Our diverse team combines expertise in education, blockchain development, product management, and community building. Together, we're creating the infrastructure for trust-based distributed work."
        />
        <AboutSection />
        
        <div className="mx-auto mb-16">
          <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-8 backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Our Cardano Team</h3>
            <p className="mb-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              We are a passionate team of Cardano enthusiasts, developers, and community builders dedicated to advancing the Cardano ecosystem in Vietnam. Our mission is to bridge the gap between traditional technology and blockchain innovation, making Cardano accessible to everyone.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              With expertise spanning from smart contract development and DeFi protocols to community education and governance participation, we work together to create sustainable solutions that benefit the entire Cardano community. Our diverse backgrounds in education, blockchain development, product management, and community building enable us to approach challenges from multiple perspectives.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              Join us in building the future of decentralized finance and governance on Cardano. Together, we're creating the infrastructure for trust-based distributed work and fostering a vibrant, inclusive Cardano ecosystem in Vietnam.
            </p>
          </div>
        </div>
        
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
          <div className="mt-16">
            <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">Contact</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Have questions about our projects or want to collaborate? We'd love to hear from you.
                </p>
              </div>
              <ContactForm />
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