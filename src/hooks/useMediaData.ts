import { useState } from 'react';
import { useToastContext } from '~/components/toast-provider';
import { useQuery } from '@tanstack/react-query';
import { Media } from '~/constants/media';

export function useMediaData() {
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const { showSuccess, showError } = useToastContext();

  const {
    data: queryData,
    isLoading: loading,
    refetch: fetchMedia,
  } = useQuery({
    queryKey: ['media-list'],
    queryFn: async () => {
      const response = await fetch('/api/admin/media');
      if (!response.ok) throw new Error('Failed to fetch media');
      return response.json();
    }
  });

  const media = queryData?.data?.media || [];
  const stats = queryData?.data?.stats || {
    total: 0,
    images: 0,
    documents: 0,
    videos: 0,
    unused: 0,
  };

  const filterAndSortMedia = () => {
    let filtered = [...media];
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(item => {
        const mimeType = item.mimeType.toLowerCase();
        switch (filterType) {
          case 'images':
            return mimeType.startsWith('image/');
          case 'youtube':
            return mimeType.includes('youtube');
          case 'used':
            return item.usedInPosts && item.usedInPosts.length > 0;
          case 'unused':
            return !item.usedInPosts || item.usedInPosts.length === 0;
          default:
            return true;
        }
      });
    }
    // Sort
    filtered.sort((a, b) => {
      let aValue: unknown, bValue: unknown;
      switch (sortBy) {
        case 'name':
          aValue = a.originalName.toLowerCase();
          bValue = b.originalName.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }
      if (sortOrder === 'asc') {
        return (aValue as number) > (bValue as number) ? 1 : -1;
      } else {
        return (aValue as number) < (bValue as number) ? 1 : -1;
      }
    });
    setFilteredMedia(filtered);
  };

  const deleteMedia = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMedia(); 
        filterAndSortMedia();
        showSuccess('Media deleted', 'The media file has been deleted successfully.');
      } else {
        const errorData = await response.json();
        showError('Failed to delete media', errorData.message || 'Failed to delete media file');
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      showError('Error deleting media', 'An error occurred while deleting the media file.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    media,
    filteredMedia,
    stats,
    loading,
    searchTerm,
    filterType,
    sortBy,
    sortOrder,
    currentPage,
    setSearchTerm,
    setFilterType,
    setSortBy,
    setSortOrder,
    fetchMedia,
    filterAndSortMedia,
    deleteMedia,
    handlePageChange,
    resetPage,
  };
}
