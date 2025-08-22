"use client";

import Member from "~/components/member";
import MemberModal from "~/components/MemberModal";
import Title from "~/components/title";
import AboutSection from "~/components/technology/AboutSection";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToastContext } from "~/components/toast-provider";
import { ContactFormData, FormErrors } from "~/constants/contact";
import { useNotifications } from "~/hooks/useNotifications";
// import { Pagination } from "~/components/ui/pagination";
import Pagination from "../pagination";

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
  tab?: TabType;
}

interface TabType {
  id: string;
  name: string;
  description?: string;
  color?: string;
  order: number;
}

function AboutContactForm({
  formData,
  errors,
  isSubmitting,
  onInputChange,
  onSubmit,
}: {
  formData: ContactFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
            <input
              type="text"
              name="your-name"
              placeholder="Enter your full name"
              value={formData["your-name"]}
              onChange={onInputChange}
              onKeyPress={(e) => {
                const allowedChars = /[a-zA-ZÀ-ỹ\s'-]/;
                if (!allowedChars.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`w-full px-3 py-2 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                errors["your-name"] ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors["your-name"] && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors["your-name"]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              name="your-number"
              placeholder="+84 123 456 789"
              value={formData["your-number"]}
              onChange={onInputChange}
              onKeyPress={(e) => {
                const allowedChars = /[0-9+\-()\s]/;
                if (!allowedChars.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              name="your-email"
              placeholder="your.email@example.com"
              value={formData["your-email"]}
              onChange={onInputChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <input type="hidden" name="event-location" value={formData["event-location"]} />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wallet Address</label>
            <input
              type="text"
              name="address-wallet"
              placeholder="addr1qy..."
              value={formData["address-wallet"]}
              onChange={onInputChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {errors.contact && (
          <div>
            <p className="text-red-500 text-xs flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.contact}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Tell us about your inquiry..."
            value={formData.message}
            onChange={onInputChange}
            rows={3}
            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success text-lg bg-blue-600 dark:bg-white px-6 py-3 font-semibold text-white dark:text-blue-900 shadow-lg hover:bg-blue-700 dark:hover:bg-gray-100 w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-blue-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </div>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}

export default function MemberPageClient() {
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  
  useNotifications();
  const { data: session } = useSession();
  const { showSuccess, showError } = useToastContext();

  const [formData, setFormData] = useState<ContactFormData>({
    "your-name": "",
    "your-number": "",
    "your-email": "",
    "address-wallet": "",
    "email-intro": "",
    "event-location": "",
    "your-course": "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await fetch("/api/admin/members");
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      return response.json();
    },
  });

  const { data: tabsData } = useQuery({
    queryKey: ["tabs"],
    queryFn: async () => {
      const response = await fetch("/api/admin/tabs");
      if (!response.ok) {
        throw new Error("Failed to fetch tabs");
      }
      return response.json();
    },
  });

  const members: MemberType[] = queryData?.members || [];
  const tabs: TabType[] = tabsData?.tabs || [];

  // const membersByTab = members.reduce((acc, member) => {
  //   const tabId = member.tab?.id || 'no-tab';
  //   if (!acc[tabId]) {
  //     acc[tabId] = {
  //       tab: member.tab,
  //       members: []
  //     };
  //   }
  //   acc[tabId].members.push(member);
  //   return acc;
  // }, {} as Record<string, { tab?: TabType; members: MemberType[] }>);

  const sortedTabs = tabs.sort((a, b) => a.order - b.order);
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredMembers = members.filter((member) => {
    if (activeTab === null) return true;
    if (activeTab === "no-tab") return !member.tab;
    return member.tab?.id === activeTab;
  });

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMemberClick = (member: MemberType) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionUser = session?.user as { address?: string; email?: string };
        const address = sessionUser?.address;
        const email = sessionUser?.email;

        if (!address && !email) {
          return;
        }

        const url = new URL("/api/user", window.location.origin);
        if (address) url.searchParams.set("address", address);
        if (email) url.searchParams.set("email", email);

        const response = await fetch(url.toString());

        if (response.ok) {
          const userData = await response.json();

          if (userData && userData.user && (userData.user.email || userData.user.address)) {
            setFormData((prev) => ({
              ...prev,
              "your-email": userData.user.email || "",
              "address-wallet": userData.user.address || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [session]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData["your-name"].trim()) {
      newErrors["your-name"] = "Name is required";
    }

    const hasPhone = formData["your-number"].trim() !== "";
    const hasEmail = formData["your-email"].trim() !== "";
    const hasWallet = formData["address-wallet"].trim() !== "";

    if (!hasPhone && !hasEmail && !hasWallet) {
      newErrors.contact = "Please provide at least one contact method (phone, email, or wallet address)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (errors.contact && (name === "your-number" || name === "your-email" || name === "address-wallet")) {
      setErrors((prev) => ({
        ...prev,
        contact: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const scriptURL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL_2 || "";

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch(scriptURL, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setFormData({
          "your-name": "",
          "your-number": "",
          "your-email": "",
          "address-wallet": "",
          "email-intro": "",
          "event-location": "",
          "your-course": "",
          message: "",
        });
        setErrors({});
        showSuccess("Thank you! Your message has been sent successfully.");
        
        setTimeout(() => {
          showSuccess("Please check your email for confirmation. If you don't see it within a few minutes, please check your spam folder or resend the form. For any issues, please contact cardano2vn@gmail.com");
        }, 1000);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Send error:", error);
      showError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            style={{ objectPosition: "left center" }}
          />
        </div>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Title title="Founding Team" description="" />
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
          style={{ objectPosition: "left center" }}
        />
      </div>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title title="Founding Team" description="" />
        <AboutSection />

        <div className="mx-auto mb-16">
          <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-8 backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Our Cardano Team</h3>
            <p className="mb-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              We are a passionate team of Cardano enthusiasts, developers, and community builders dedicated to advancing the Cardano ecosystem in
              Vietnam. Our mission is to bridge the gap between traditional technology and blockchain innovation, making Cardano accessible to
              everyone.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              With expertise spanning from smart contract development and DeFi protocols to community education and governance participation, we work
              together to create sustainable solutions that benefit the entire Cardano community. Our diverse backgrounds in education, blockchain
              development, product management, and community building enable us to approach challenges from multiple perspectives.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              Join us in building the future of decentralized finance and governance on Cardano. Together, we're creating the infrastructure for
              trust-based distributed work and fostering a vibrant, inclusive Cardano ecosystem in Vietnam.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        {sortedTabs.length > 0 && (
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex flex-wrap gap-1 sm:gap-2 md:gap-8 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab(null)}
                className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === null
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="hidden sm:inline">All Members</span>
                  <span className="sm:hidden">All</span>
                </div>
              </button>
              {sortedTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.length > 8 ? tab.name.substring(0, 8) + "..." : tab.name}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Members Grid */}
        <div className="mx-auto pb-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedMembers.map(function (member, index) {
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
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        )}
      </section>

      <section id="contact" className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">Join Our Team</h2>
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-blue-500"></div>
            </div>
            <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300">
              Ready to contribute to the Cardano ecosystem? We're always looking for passionate individuals who want to make a difference in the
              blockchain space.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              <AboutContactForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedMember && <MemberModal member={selectedMember} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </main>
  );
}
