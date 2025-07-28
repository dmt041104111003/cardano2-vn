"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import Image from "next/image";
import { Toaster, toast } from "sonner";

interface VideoItem {
  id: string;
  videoId: string;
  channelName: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
  isFeatured: boolean;
  isSlideshow: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function VideoSectionAdmin() {
  const [videos, setVideos] = React.useState<VideoItem[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [newVideoUrl, setNewVideoUrl] = React.useState("");
  const [modifiedVideos, setModifiedVideos] = React.useState<{ [id: string]: Partial<VideoItem> }>({});
  const [isValidUrl, setIsValidUrl] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      const res = await fetch("/api/video-section");
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      setVideos(data);
      setModifiedVideos({});
    } catch (err) {
      toast.error("Error fetching videos.");
    }
  }

  async function handleDeleteVideo(videoId: string) {
    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/video-section/${videoId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete video");
      toast.success("Video deleted successfully!");
      fetchVideos();
    } catch (err) {
      toast.error(err.message || "Error deleting video.");
    }
  }

  async function handleAddVideo() {
    const match = newVideoUrl.match(/(?:v=|\/embed\/|youtu.be\/)([\w-]+)/);
    const videoId = match?.[1];
    if (!videoId) {
      toast.error("Invalid YouTube URL.");
      setIsValidUrl(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/video-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: newVideoUrl }),
      });

      if (res.ok) {
        toast.success("Video added!");
        setNewVideoUrl("");
        setIsValidUrl(null);
        fetchVideos();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to add video.");
        setIsValidUrl(false);
      }
    } catch (err) {
      toast.error("Error fetching video data.");
      setIsValidUrl(false);
    }
  }

  async function handleSaveChanges() {
    const newFeaturedVideo = Object.entries(modifiedVideos).find(([_, updates]) => updates.isFeatured === true);
    if (newFeaturedVideo) {
      const existingFeatured = videos.find((v) => v.isFeatured && v.id !== newFeaturedVideo[0]);
      if (existingFeatured) {
        const confirmOverride = window.confirm(`Setting this video as featured will unfeature "${existingFeatured.title}". Continue?`);
        if (!confirmOverride) return;
      }
    }

    try {
      const updates = Object.entries(modifiedVideos).map(([id, updates]) =>
        fetch(`/api/admin/video-section/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }),
      );
      const responses = await Promise.all(updates);
      const allSuccessful = responses.every((res) => res.ok);

      if (allSuccessful) {
        toast.success("Changes saved successfully!");
        setModifiedVideos({});
        fetchVideos();
      } else {
        const errors = await Promise.all(responses.filter((res) => !res.ok).map((res) => res.json().then((data) => data.error || "Unknown error")));
        toast.error(`Failed to save some changes: ${errors.join(", ")}`);
      }
    } catch (err) {
      toast.error("Error saving changes.");
    }
  }

  const handleCheckboxChange = (videoId: string, field: "isFeatured" | "isSlideshow", value: boolean) => {
    setModifiedVideos((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], [field]: value },
    }));
  };

  const columns: ColumnDef<VideoItem>[] = [
    {
      accessorKey: "thumbnailUrl",
      header: () => "Thumbnail",
      cell: ({ row }) => <Image src={row.original.thumbnailUrl} alt={row.original.title} width={80} height={45} className="rounded object-cover" />,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const title = row.original.title;
        const maxLength = 60;
        const displayTitle = title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
        return <span title={title}>{displayTitle}</span>;
      },
    },
    {
      accessorKey: "channelName",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Channel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("channelName")}</div>,
    },
    {
      accessorKey: "isFeatured",
      header: () => "Featured",
      cell: ({ row }) => (
        <Checkbox
          checked={modifiedVideos[row.original.id]?.isFeatured ?? row.original.isFeatured}
          onCheckedChange={(value) => handleCheckboxChange(row.original.id, "isFeatured", !!value)}
        />
      ),
    },
    {
      accessorKey: "isSlideshow",
      header: () => "Slideshow",
      cell: ({ row }) => (
        <Checkbox
          checked={modifiedVideos[row.original.id]?.isSlideshow ?? row.original.isSlideshow}
          onCheckedChange={(value) => handleCheckboxChange(row.original.id, "isSlideshow", !!value)}
        />
      ),
    },
    {
      id: "actions",
      header: () => "Actions",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(video.videoId)}>Copy YouTube Video ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteVideo(video.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: videos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-4">
        <Toaster position="top-right" />

        <h2 className="text-2xl font-bold">Video Section Management</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 flex-wrap">
          <Input
            placeholder="Filter by title or channel..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
            className="w-full sm:max-w-sm"
          />

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Paste YouTube video URL..."
              value={newVideoUrl}
              onChange={(e) => {
                setNewVideoUrl(e.target.value);
                const match = e.target.value.match(/(?:v=|\/embed\/|youtu.be\/)([\w-]+)/);
                setIsValidUrl(match ? true : e.target.value ? false : null);
              }}
              className={`w-full sm:w-64 ${
                isValidUrl === false ? "border-red-500 focus:ring-red-500" : isValidUrl ? "border-green-500 focus:ring-green-500" : ""
              }`}
            />
            <Button onClick={handleAddVideo} className="w-full sm:w-auto" disabled={!newVideoUrl || isValidUrl === false}>
              <Plus className="w-4 h-4 mr-1" />
              Add Video
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto disabled">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {Object.keys(modifiedVideos).length > 0 && (
              <Button onClick={handleSaveChanges} className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No videos found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">{table.getFilteredRowModel().rows.length} video(s) displayed.</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
