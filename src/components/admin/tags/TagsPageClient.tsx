'use client';

import { useEffect, useState } from 'react';
import { Tag, ITEMS_PER_PAGE, isWithin24Hours } from '~/constants/tags';
import { AdminHeader } from '~/components/admin/common/AdminHeader';
import { AdminStats } from '~/components/admin/common/AdminStats';
import { AdminFilters } from '~/components/admin/common/AdminFilters';
import { TagTable } from '~/components/admin/tags/TagTable';
import { Pagination } from '~/components/ui/pagination';
import Modal from '~/components/admin/common/Modal';
import { useToastContext } from '~/components/toast-provider';

export function TagsPageClient() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'newest'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [editTagName, setEditTagName] = useState('');
  const { showSuccess, showError } = useToastContext();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/admin/tags', { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data.tags)) {
        setTags(data.tags.map((t: Tag) => ({
          id: t.id,
          name: t.name,
          createdAt: t.createdAt,
          postCount: t._count?.posts ?? t.postCount ?? 0,
        })));
      }
    } catch {
      setTags([]);
    } finally {

    }
  };

  const handleCreateTag = async (newName: string) => {
    if (!newName) return;
    try {
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        await fetchTags();
        showSuccess('Tag created', `Tag "${newName}" has been created successfully.`);
      } else {
        showError('Failed to create tag');
      }
    } finally {

    }
  };

  const handleDelete = async (tagId: string) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) return;
    try {
      const res = await fetch('/api/admin/tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: tagId })
      });
      if (res.ok) {
        await fetchTags();
        showSuccess('Tag deleted', 'The tag has been deleted.');
      } else {
        showError('Failed to delete tag');
      }
    } finally {

    }
  };

  const handleSave = async (tagId: string, newName: string) => {
    if (!newName) return;
    try {
      const res = await fetch('/api/admin/tags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: tagId, name: newName })
      });
      if (res.ok) {
        await fetchTags();
        showSuccess('Tag updated', 'The tag has been updated.');
      } else {
        showError('Failed to update tag');
      }
    } finally {
      setEditingTag(null);

    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name || '');
  };

  const handleSaveEdit = async () => {
    if (editingTag && editTagName.trim()) {
      await handleSave(editingTag.id, editTagName.trim());
      setEditingTag(null);
      setEditTagName('');
    }
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
    const matchesFilter = filterType === 'all' || 
      (filterType === 'newest' && isWithin24Hours(tag.createdAt));
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTags.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTags = filteredTags.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const stats = [
    { label: 'Total Tags', value: tags.length, color: 'default' as const },
    { label: 'Active Tags', value: filteredTags.length, color: 'default' as const },
    { label: 'Total Posts', value: tags.reduce((sum, tag) => sum + tag.postCount, 0), color: 'blue' as const },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Tags' },
    { value: 'newest', label: 'Newest (24h)' },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Tags Management"
        description="Manage blog tags and categories"
        buttonText="Add New Tag"
        onAddClick={() => setShowAddModal(true)}
      />
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setNewTagName(''); }} title="Add New Tag">
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Tag name"
          value={newTagName}
          onChange={e => setNewTagName(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setShowAddModal(false); setNewTagName(''); }}>Cancel</button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={async () => {
              if (newTagName.trim()) {
                await handleCreateTag(newTagName.trim());
                setShowAddModal(false);
                setNewTagName('');
              }
            }}
          >Add</button>
        </div>
      </Modal>

      <AdminStats stats={stats} />

      <AdminFilters
        searchTerm={searchTerm}
        filterType={filterType}
        searchPlaceholder="Search tags by name..."
        filterOptions={filterOptions}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

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
      <Modal isOpen={!!editingTag} onClose={handleCancel} title="Edit Tag Name">
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Tag name"
          value={editTagName}
          onChange={e => setEditTagName(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={handleCancel}>Cancel</button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSaveEdit}
            disabled={!editTagName.trim()}
          >Save</button>
        </div>
      </Modal>
    </div>
  );
}

export default TagsPageClient; 