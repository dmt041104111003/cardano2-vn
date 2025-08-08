"use client";

import { useState, useEffect } from "react";
import { PenSquare } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import EventCard from "~/components/home/CTAEventCard";
import { images } from "~/public/images";

interface Event {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  order: number;
}

export default function CTASection() {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      if (!session?.user) return null;

      const sessionUser = session.user as {
        address?: string;
        email?: string;
      };
      const url = new URL("/api/auth/me", window.location.origin);
      if (sessionUser.address) url.searchParams.set("address", sessionUser.address);
      if (sessionUser.email) url.searchParams.set("email", sessionUser.email);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch user role");
      return response.json();
    },
    enabled: !!session?.user,
  });

  useEffect(() => {
    setIsAdmin(userData?.user?.role === "ADMIN");
  }, [userData]);

  const initialEvents: Event[] = [
    { id: 1, title: "Event 1", location: "Location 1", imageUrl: images.landing01.src, order: 1 },
    { id: 2, title: "Event 2", location: "Location 2", imageUrl: images.landing01.src, order: 2 },
    { id: 3, title: "Event 3", location: "Location 3", imageUrl: images.landing01.src, order: 3 },
    { id: 4, title: "Event 4", location: "Location 4", imageUrl: images.landing01.src, order: 4 },
    { id: 5, title: "Event 5", location: "Location 5", imageUrl: images.landing04.src, order: 5 },
    { id: 6, title: "Event 6", location: "Location 6", imageUrl: images.landing02.src, order: 6 },
  ];

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editMode, setEditMode] = useState(false);

  const handleDeleteImage = (index: number) => {
    const updated = [...events];
    updated[index].imageUrl = "";
    setEvents(updated);
  };

  const handleImageUpload = (file: File, index: number) => {
    const fakeUrl = URL.createObjectURL(file);
    const updated = [...events];
    updated[index].imageUrl = fakeUrl;
    setEvents(updated);
    toast.success("Image updated!");
  };

  const handleSave = () => {
    setEditMode(false);
    toast.success("Changes saved!");
  };

  const handleToggleEdit = () => {
    if (editMode) {
      setEvents(initialEvents);
      toast.info("Changes discarded");
    }
    setEditMode(!editMode);
  };

  const sortedEvents = [...events].sort((a, b) => a.order - b.order);

  return (
    <section id="CTA" className="w-full border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto w-5/6 max-w-screen-2xl px-4 py-12 lg:px-8 lg:py-20">
        {/* HEADER */}
        <div className="mb-8 lg:mb-16 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="mb-4 lg:mb-6 flex items-center gap-2 lg:gap-4">
              <div className="h-1 w-8 lg:w-12 bg-gradient-to-r from-blue-500 to-transparent" />
              <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">Events</h2>
            </div>
            <p className="max-w-3xl text-base lg:text-xl text-gray-700 dark:text-gray-300">
              Discover the highlights of our recent events and community activities.
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleEdit}
                className={`flex items-center gap-1 pb-1 transition border-b-2 ${
                  editMode ? "text-blue-500 border-blue-500" : "text-gray-400 border-transparent hover:text-blue-500 hover:border-blue-500"
                }`}
              >
                {editMode ? (
                  "Exit Edit Mode"
                ) : (
                  <>
                    <PenSquare className="mr-1" size={16} /> Edit
                  </>
                )}
              </button>
              {editMode && (
                <button onClick={handleSave} className="px-4 py-1 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition shadow-md">
                  Save
                </button>
              )}
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <EventCard
              {...{
                event: sortedEvents[0],
                index: 0,
                editMode,
                onDelete: handleDeleteImage,
                onUpload: handleImageUpload,
                className: "lg:w-[70%] h-80",
              }}
            />
            <EventCard
              {...{
                event: sortedEvents[1],
                index: 1,
                editMode,
                onDelete: handleDeleteImage,
                onUpload: handleImageUpload,
                className: "lg:w-[30%] h-80",
              }}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col sm:flex-row gap-6 lg:w-[70%]">
              <EventCard
                {...{
                  event: sortedEvents[2],
                  index: 2,
                  editMode,
                  onDelete: handleDeleteImage,
                  onUpload: handleImageUpload,
                  className: "sm:w-1/2 h-80",
                }}
              />
              <EventCard
                {...{
                  event: sortedEvents[3],
                  index: 3,
                  editMode,
                  onDelete: handleDeleteImage,
                  onUpload: handleImageUpload,
                  className: "sm:w-1/2 h-80",
                }}
              />
            </div>
            <div className="flex flex-col gap-6 lg:w-[30%]">
              <EventCard
                {...{ event: sortedEvents[4], index: 4, editMode, onDelete: handleDeleteImage, onUpload: handleImageUpload, className: "h-37" }}
              />
              <EventCard
                {...{ event: sortedEvents[5], index: 5, editMode, onDelete: handleDeleteImage, onUpload: handleImageUpload, className: "h-37" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
