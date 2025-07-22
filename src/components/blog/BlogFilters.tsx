import { useRef, useState, useEffect } from 'react';
import { Tag, X } from 'lucide-react';

interface TagType {
  id: string;
  name: string;
}

export default function BlogFilters({
  search, setSearch,
  selectedTags, setSelectedTags,
  allTags
}: {
  search: string;
  setSearch: (v: string) => void;
  selectedTags: string[];
  setSelectedTags: (v: string[]) => void;
  allTags: TagType[];
}) {
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
  };
  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full px-4 py-2 border border-white/30 bg-transparent text-white placeholder:text-white/60 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="relative w-full" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowTagDropdown(!showTagDropdown)}
            className="w-full px-4 py-2 border border-white/30 bg-transparent text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-left"
          >
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedTags.map(tagId => {
                  const tag = allTags.find(t => t.id === tagId);
                  return tag ? (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30"
                    >
                      {tag.name}
                      <span
                        onClick={e => {
                          e.stopPropagation();
                          handleRemoveTag(tag.id);
                        }}
                        className="ml-1 text-blue-400 hover:text-blue-200 cursor-pointer"
                        title={`Remove ${tag.name} tag`}
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </span>
                  ) : null;
                })}
              </div>
            ) : (
              <span className="text-white/60">Select tags...</span>
            )}
          </button>
          {showTagDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-gray-900/80 border border-white/30 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="p-2">
                {allTags.length === 0 ? (
                  <div className="text-gray-400 text-sm">No tags found</div>
                ) : allTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-900/30 ${selectedTags.includes(tag.id) ? 'bg-blue-900/40 text-blue-300' : 'text-white/80'}`}
                    title={`Select ${tag.name} tag`}
                  >
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      {tag.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 