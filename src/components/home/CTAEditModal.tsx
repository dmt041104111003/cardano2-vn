"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useToastContext } from "~/components/toast-provider";
import MediaInput from "~/components/ui/media-input";
import { MediaInputMedia } from "~/constants/media";

interface Event {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  order: number;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  index: number;
  onSave: (index: number, updatedEvent: Partial<Event>) => void;
}

export default function EditModal({ isOpen, onClose, event, index, onSave }: EditModalProps) {
  const { data: session } = useSession();
  const { showSuccess, showError } = useToastContext();
  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location);
  const [selectedMedia, setSelectedMedia] = useState<MediaInputMedia | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(event.title);
    setLocation(event.location);
    setSelectedMedia(null);
  }, [event]);

  const handleMediaAdd = (media: MediaInputMedia) => {
    setSelectedMedia(media);
  };

  const handleSave = async () => {
    if (!session?.user) {
      showError("Please log in to save changes");
      return;
    }

    if (!event?.id) {
      showError("Missing event ID");
      return;
    }

    setIsSaving(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    
    if (selectedMedia) {
      formData.append("imageUrl", selectedMedia.url);
    }

    try {
      const res = await fetch(`/api/admin/event-images/${event.id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const updatedEvent: Partial<Event> = {
          title,
          location,
          imageUrl: selectedMedia?.url || event.imageUrl,
        };
        onSave(index, updatedEvent);
        onClose();
        showSuccess("Event updated successfully!");
      } else {
        const errorData = await res.json();
        showError(errorData.error || "Failed to update event");
      }
    } catch {
      showError("Failed to update event");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => !isSaving && onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-semibold dark:text-white text-gray-900">
                  Edit Event
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="event-title" className="block text-sm font-medium dark:text-white text-gray-700">Title</label>
                    <input
                      id="event-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 w-full text-black dark:text-white dark:bg-gray-700  rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isSaving}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label htmlFor="event-location" className="block text-sm font-medium  dark:text-white text-gray-700">Location</label>
                    <input
                      id="event-location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1 w-full text-black dark:bg-gray-700 dark:text-white rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isSaving}
                      placeholder="Enter event location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Image</label>
                    <MediaInput 
                      onMediaAdd={handleMediaAdd}
                      mediaType="image"
                    />
                    {selectedMedia && (
                      <div className="mt-2">
                        <img 
                          src={selectedMedia.url} 
                          alt="Selected media" 
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={onClose}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
