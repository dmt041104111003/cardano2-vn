"use client";

import { Fragment, useCallback, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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
  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(event.title);
    setLocation(event.location);
    setImageFile(null);
  }, [event]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setImageFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSave = async () => {
    if (!session?.user) {
      toast.error("Please log in to save changes");
      return;
    }

    if (!event?.id) {
      toast.error("Missing event ID");
      return;
    }

    setIsSaving(true);

    const formData = new FormData();
    if (imageFile) {
      formData.append("file", imageFile);
    }
    formData.append("title", title);
    formData.append("location", location);

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
          imageUrl: data.image?.imageUrl || event.imageUrl,
        };
        onSave(index, updatedEvent);
        onClose();
        toast.success("Event updated successfully!");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to update event");
      }
    } catch {
      toast.error("Failed to update event");
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
                    <label className="block text-sm font-medium dark:text-white text-gray-700">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 w-full text-black dark:text-white dark:bg-gray-700  rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium  dark:text-white text-gray-700">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1 w-full text-black dark:bg-gray-700 dark:text-white rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <div
                      {...getRootProps()}
                      className={`mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition ${
                        isDragActive ? "border-blue-400 bg-blue-50" : "border-blue-300 bg-white dark:bg-gray-700"
                      } ${isSaving ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <input {...getInputProps()} disabled={isSaving} />
                      <UploadCloud className="h-12 w-12 text-blue-500 mb-2 dark:text-blue-400" />
                      <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
                        {isDragActive
                          ? "Drop the file here"
                          : imageFile
                            ? imageFile.name
                            : event.imageUrl
                              ? "Image uploaded, upload new to replace"
                              : "Drag & drop or click to upload"}
                      </p>
                    </div>
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
