'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '~/components/admin/common/AdminHeader';
import { AdminStats } from '~/components/admin/common/AdminStats';
import { AdminFilters } from '~/components/admin/common/AdminFilters';
import { Pagination } from '~/components/ui/pagination';
import { MediaUpload } from './MediaUpload';
import { MediaTable } from './MediaTable';
import { useMediaData } from '~/hooks/useMediaData';
import AdminTableSkeleton from '~/components/admin/common/AdminTableSkeleton';
import NotFoundInline from '~/components/ui/not-found-inline';

export default function MediaPageClient() {
  const {
    media,
    filteredMedia,
    stats,
    loading,
    searchTerm,
    filterType,
    currentPage,
    setSearchTerm,
    setFilterType,
    fetchMedia,
    filterAndSortMedia,
    deleteMedia,
    handlePageChange,
    resetPage,
  } = useMediaData();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setSearchTerm('');
    setFilterType('all');
    fetchMedia();
  }, []);

  useEffect(() => {
    filterAndSortMedia();
    resetPage();
  }, [media, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMedia = filteredMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeader
          title="Media Management"
          description="Manage all media files and track their usage in posts"
          buttonText="Upload Media"
          onAddClick={() => setShowUploadModal(true)}
        />

        <AdminStats
          stats={[
            { label: 'Total Files', value: stats.total },
            { label: 'Images', value: stats.images },
            { label: 'YouTube', value: stats.documents },
            { label: 'Used', value: stats.total - stats.unused },
            { label: 'Unused', value: stats.unused },
          ]}
        />

        <AdminFilters
          searchTerm={searchTerm}
          filterType={filterType}
          searchPlaceholder="Search media files..."
          filterOptions={[
            { value: 'all', label: 'All Files' },
            { value: 'images', label: 'Images' },
            { value: 'youtube', label: 'YouTube' },
            { value: 'used', label: 'Used in Posts' },
            { value: 'unused', label: 'Not Used' },
          ]}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterType}
        />

        {loading ? (
          <AdminTableSkeleton columns={5} rows={5} />
        ) : filteredMedia.length === 0 ? (
          <NotFoundInline 
            onClearFilters={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
          />
        ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Media Files ({filteredMedia.length})
            </h3>
          </div>

          <MediaTable
            media={paginatedMedia}
            onDelete={deleteMedia}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredMedia.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        )}

      <MediaUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={() => {
          setShowUploadModal(false);
          fetchMedia();
        }}
      />
      </div>
    </div>
  );
} 