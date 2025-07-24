import { useState, useEffect } from 'react';
import { useToastContext } from '~/components/toast-provider';

interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
  updatedAt: string;
  usedInPosts?: string[];
}

interface MediaStats {
  total: number;
  images: number;
  documents: number;
  videos: number;
  unused: number;
}

export function useMediaData() {
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [stats, setStats] = useState<MediaStats>({
    total: 0,
    images: 0,
    documents: 0,
    videos: 0,
    unused: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const { showSuccess, showError } = useToastContext();

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        setMedia(data.media);
        setStats(data.stats);
      } else {
        showError('Failed to fetch media', 'Could not load media files.');
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      showError('Error fetching media', 'An error occurred while loading media files.');
    } finally {
      setLoading(false);
    }
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
      let aValue: any, bValue: any;
      
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
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
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
        setMedia(prev => prev.filter(item => item.id !== id));
        fetchMedia();
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