'use client';

import { useState, useMemo, useEffect } from 'react';
import { Post } from '~/constants/posts';
import { AdminHeader } from '~/components/admin/common/AdminHeader';
import { AdminFilters } from '~/components/admin/common/AdminFilters';
import { PostTable } from '~/components/admin/posts/PostTable';
import { PostStats } from '~/components/admin/posts/PostStats';
import { PostEditor } from '~/components/admin/posts/PostEditor';
import { Pagination } from '~/components/ui/pagination';
import { BarChart3, Edit3 } from 'lucide-react';
import { useToastContext } from '~/components/toast-provider';
import { AdminStats } from '~/components/admin/common/AdminStats';
import { useQuery } from '@tanstack/react-query';
import AdminTableSkeleton from '~/components/admin/common/AdminTableSkeleton';

export function PostsPageClient() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'management' | 'create'>('management');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedYear] = useState<number>(new Date().getFullYear());
  useEffect(() => { setIsClient(true); }, []);
  const {
    data: queryData,
    isLoading: loading,
    refetch: fetchPosts,
  } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const res = await fetch('/api/admin/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    }
  });
  const posts: Post[] = queryData?.posts || [];
  useEffect(() => {
    if (activeTab === 'management') {
      fetchPosts();
    }
  }, [activeTab, fetchPosts]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const postsOfYear = useMemo(() => posts.filter(p => new Date(p.createdAt).getFullYear() === selectedYear), [posts, selectedYear]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    switch (filterType) {
      case 'published':
        matchesFilter = post.status === 'published';
        break;
      case 'draft':
        matchesFilter = post.status === 'draft';
        break;
      case 'archived':
        matchesFilter = post.status === 'archived';
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = async (post: Post) => {
    const res = await fetch(`/api/admin/posts/${post.slug || post.id}`);
    const data = await res.json();
    setEditingPost(data.post);
    setActiveTab('create');
  };

  const { showSuccess, showError } = useToastContext();

  const handleDelete = async (postSlug: string) => {
    try {
      const res = await fetch(`/api/admin/posts/${postSlug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchPosts();
        showSuccess('Post deleted', 'The post has been deleted.');
      } else {
        showError('Failed to delete post');
      }
    } catch {
      showError('Failed to delete post');
    }
  };

  const handleStatusChange = (postId: string, newStatus: 'published' | 'draft' | 'archived') => {

    fetchPosts();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value as 'all' | 'published' | 'draft' | 'archived');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSavePost = async (newPost: Post) => {
    try {
      const backendPost = {
        ...newPost,
        media: Array.isArray(newPost.media)
          ? newPost.media.map(m => ({ ...m, type: m.type.toUpperCase() }))
          : [],
      };
      if (editingPost && editingPost.slug) {
        const res = await fetch(`/api/admin/posts/${editingPost.slug}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendPost),
        });
        if (res.ok) {
          await fetchPosts();
          showSuccess('Post updated', 'The post has been updated.');
        } else {
          showError('Failed to update post');
        }
      } else {
        const res = await fetch('/api/admin/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendPost),
        });
        if (res.ok) {
          await fetchPosts();
          showSuccess('Post created', 'The post has been created.');
        } else {
          showError('Failed to create post');
        }
      }
    } catch {
      showError('Failed to save post');
    }
    setEditingPost(null);
    setActiveTab('management');
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setActiveTab('management');
  };

  const filterOptions = [
    { value: 'all', label: 'All Posts' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Drafts' },
    { value: 'archived', label: 'Archived' },
  ];

  const statusCounts = posts.reduce((acc, post) => {
    acc[post.status] = (acc[post.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const allStatuses = Object.keys(statusCounts);
  const statusColors: Record<string, 'default' | 'blue' | 'green' | 'red'> = {
    published: 'blue',
    draft: 'green',
    archived: 'red',
  };
  const stats = [
    { label: 'Total Posts', value: posts.length, color: 'default' as const },
    ...allStatuses.map(status => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
      color: statusColors[status] || 'default',
    })),
  ];

  if (!isClient) return null;
  return (
    <div className="space-y-6" suppressHydrationWarning>
      <AdminHeader
        title="Posts Management"
        description="Manage blog posts and content"
        buttonText="Create New Post"
        onAddClick={() => setActiveTab('create')}
      />
      <AdminStats stats={stats} />

      <div className="border-b border-gray-200" suppressHydrationWarning>
        <nav className="-mb-px flex space-x-8" suppressHydrationWarning>
          <button
            onClick={() => setActiveTab('management')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'management'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Management & Statistics
            </div>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Edit3 className="h-4 w-4 mr-2" />
              Create Post
            </div>
          </button>
        </nav>
      </div>

      {activeTab === 'management' ? (
        <>
          <PostStats posts={postsOfYear} year={selectedYear} />

          <AdminFilters
            searchTerm={searchTerm}
            filterType={filterType}
            searchPlaceholder="Search posts by title, content, or author..."
            filterOptions={filterOptions}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <AdminTableSkeleton columns={6} rows={5} />
          ) : (
            <div className="bg-white rounded-lg shadow" suppressHydrationWarning>
              <PostTable
                posts={paginatedPosts || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredPosts.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <PostEditor onSave={handleSavePost} post={editingPost || undefined} onCancel={handleCancelEdit} />
      )}
    </div>
  );
}

export default PostsPageClient; 