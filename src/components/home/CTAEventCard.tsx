/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { XIcon, UploadCloud } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Event {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  order: number;
}

interface EventCardProps {
  event: Event;
  index: number;
  editMode: boolean;
  onDelete?: (index: number) => void;
  onUpload?: (file: File, index: number) => void;
  className?: string;
}

export default function EventCard({ event, index, editMode, onDelete, onUpload, className }: EventCardProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0] && onUpload) {
        onUpload(acceptedFiles[0], index);
      }
    },
    [index, onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: !editMode || !!event.imageUrl,
  });

  const rootProps = editMode && !event.imageUrl ? getRootProps() : {};
  const { onAnimationStart: _, ...safeRootProps } = rootProps as any;

  return (
    <motion.div
      whileHover={{ scale: editMode ? 1 : 1.02 }}
      whileTap={{ scale: editMode ? 1 : 0.98 }}
      className={`relative rounded-xl overflow-hidden shadow-lg group cursor-pointer ${className}`}
      {...safeRootProps}
    >
      {editMode && !event.imageUrl && <input {...getInputProps()} />}
      <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
        {event.imageUrl ? (
          <>
            <Image
              src={event.imageUrl}
              alt={event.title}
              className={`object-cover w-full h-full transition-all ${editMode ? "opacity-80" : ""}`}
              fill
              quality={90}
              sizes="100vw"
            />
            {editMode && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(index);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full cursor-pointer"
              >
                <XIcon className="h-8 w-8 text-red-700" />
              </div>
            )}

            {!editMode && (
              <div className="absolute bottom-4 left-4 text-white z-10">
                <h4 className="text-lg font-semibold">{event.title}</h4>
                <p className="text-sm opacity-80">{event.location}</p>
              </div>
            )}
          </>
        ) : editMode ? (
          <div
            className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg transition ${
              isDragActive ? "border-blue-400 bg-blue-50" : "border-blue-300 bg-white"
            }`}
          >
            <UploadCloud className="h-12 w-12 text-blue-500 mb-2" />
            <p className="text-sm font-medium text-blue-500">{isDragActive ? "Drop the file here" : "Drag & drop or click to upload"}</p>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
