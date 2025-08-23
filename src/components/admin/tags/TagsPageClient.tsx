'use client';

import { useState } from 'react';
import { Tag, isWithin24Hours } from '~/constants/tags';
import { AdminHeader } from '~/components/admin/common/AdminHeader';
import { AdminStats } from '~/components/admin/common/AdminStats';
import { AdminFilters } from '~/components/admin/common/AdminFilters';
import { TagTable } from '~/components/admin/tags/TagTable';
import { Pagination } from '~/components/ui/pagination';
import Modal from '~/components/admin/common/Modal';
import { useToastContext } from '~/components/toast-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminTableSkeleton from '~/components/admin/common/AdminTableSkeleton';
import NotFoundInline from '~/components/ui/not-found-inline';

export function TagsPageClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'newest'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const ITEMS_PER_PAGE = 6;
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();

  const {
    data: queryData,
    isLoading: loading,
  } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tags', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch tags');
      const data = await res.json();
      return data?.data || [];
    }
  });
  const tags: Tag[] = queryData || [];

  const createTagMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error('Failed to create tag');
      return res.json();
    },
    onSuccess: (data, name) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      showSuccess('Tag created', `Tag "${name}" has been created successfully.`);
      setShowAddModal(false);
      setNewTagName('');
    },
    onError: () => {
      showError('Failed to create tag');
    }
  });

  const updateTagMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await fetch('/api/admin/tags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, name })
      });
      if (!res.ok) throw new Error('Failed to update tag');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      showSuccess('Tag updated', 'The tag has been updated.');
      setEditingTag(null);
    },
    onError: () => {
      showError('Failed to update tag');
    }
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/admin/tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error('Failed to delete tag');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      showSuccess('Tag deleted', 'The tag has been deleted.');
    },
    onError: () => {
      showError('Failed to delete tag');
    }
  });

  const handleCreateTag = async (newName: string) => {
    if (!newName) return;
    createTagMutation.mutate(newName);
  };

  const handleDelete = async (tagId: string) => {
    deleteTagMutation.mutate(tagId);
  };

  const handleSave = async (tagId: string, newName: string) => {
    if (!newName) return;
    updateTagMutation.mutate({ id: tagId, name: newName });
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
  };

  const handleCancel = () => {
    setEditingTag(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value as 'all' | 'newest');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    
    if (filterType === 'newest') {
      matchesFilter = isWithin24Hours(tag.createdAt);
    }
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTags.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTags = filteredTags.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const stats = [
    { label: 'Total Tags', value: tags.length, color: 'default' as const },
    { label: 'New Tags (24h)', value: tags.filter(tag => isWithin24Hours(tag.createdAt)).length, color: 'green' as const },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Tags' },
    { value: 'newest', label: 'Newest (24h)' },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Tags Management"
        description=""
        buttonText="Add New Tag"
        onAddClick={() => setShowAddModal(true)}
      />
      
      <AdminStats stats={stats} />

      <AdminFilters
        searchTerm={searchTerm}
        filterType={filterType}
        searchPlaceholder="Search tags..."
        filterOptions={filterOptions}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

      {loading ? (
        <AdminTableSkeleton columns={4} rows={5} />
      ) : filteredTags.length === 0 ? (
        <NotFoundInline 
          onClearFilters={() => {
            setSearchTerm('');
            setFilterType('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <TagTable
            tags={paginatedTags}
            editingTag={editingTag}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={handleCancel}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTags.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Tag"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
              Tag Name
            </label>
            <input
              id="tagName"
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateTag(newTagName);
                  setShowAddModal(false);
                  setNewTagName('');
                }
              }}
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleCreateTag(newTagName);
                setShowAddModal(false);
                setNewTagName('');
              }}
              disabled={!newTagName.trim()}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Tag
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TagsPageClient; 