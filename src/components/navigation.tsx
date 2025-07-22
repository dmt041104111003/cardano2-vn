import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Clock, Layers } from "lucide-react";
export default function Navigation() {
  return (
    <div className="mb-8 w-full md:w-80">
      <Tabs defaultValue="time" className="rounded-none">
        <TabsList
          aria-label="Navigation tabs"
          className="items-center justify-center p-2 text-accent-foreground grid w-full grid-cols-2 rounded-sm outline-none border border-white/20 bg-gray-800/50 backdrop-blur-sm"
        >
          <TabsTrigger
            value="time"
            className="whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow flex items-center justify-center space-x-2 rounded-sm text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4" />
            <span>Timeline</span>
          </TabsTrigger>
          <TabsTrigger
            value="category"
            className="whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow flex items-center justify-center space-x-2 rounded-sm text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Layers className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
