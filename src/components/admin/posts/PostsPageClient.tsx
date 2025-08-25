'use client';

import { useState, useMemo, useEffect } from 'react';
import { Post } from '~/constants/posts';
import { AdminHeader } from '~/components/admin/common/AdminHeader';
import { AdminFilters } from '~/components/admin/common/AdminFilters';
import { PostTable } from '~/components/admin/posts/PostTable';
import { PostStats } from '~/components/admin/posts/PostStats';
import { PostEditor } from '~/components/admin/posts/PostEditor';
import TagsPageClient from '~/components/admin/tags/TagsPageClient';
import MediaPageClient from '~/components/admin/media/MediaPageClient';
import { BarChart3, Edit3, Tag as TagIcon, Image } from 'lucide-react';
import { useToastContext } from '~/components/toast-provider';
import { AdminStats } from '~/components/admin/common/AdminStats';
import { Pagination } from '~/components/ui/pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminTableSkeleton from '~/components/admin/common/AdminTableSkeleton';
import NotFoundInline from '~/components/ui/not-found-inline';
import { useNotifications } from "~/hooks/useNotifications";

export function PostsPageClient() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'tags' | 'media'>('posts');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedYear] = useState<number>(new Date().getFullYear());
  const [editingTag, setEditingTag] = useState<any>(null);
  const [showTagEditor, setShowTagEditor] = useState(false);
  
  const [postState, setPostState] = useState({
    title: '',
    selectedTags: [] as string[],
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    content: '',
    media: [] as Array<{ type: 'image' | 'youtube' | 'video'; url: string; id: string }>,
    githubRepo: '',
  });
  
  const queryClient = useQueryClient();
  
  useNotifications();
  
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
  const posts: Post[] = queryData?.data || [];

  const {
    data: tagsData,
    isLoading: tagsLoading,
  } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tags', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch tags');
      const data = await res.json();
      return data?.data || [];
    }
  });
  const tags = tagsData || [];

  const {
    data: mediaData,
    isLoading: mediaLoading,
  } = useQuery({
    queryKey: ['media-list'],
    queryFn: async () => {
      const res = await fetch('/api/admin/media', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch media');
      const data = await res.json();
      console.log('Media API response:', data);
      return data;
    }
  });
  const mediaStats = mediaData?.data?.stats || {
    total: 0,
    images: 0,
    documents: 0,
    videos: 0,
    unused: 0,
  };
  
  useEffect(() => {
    console.log('Posts data:', posts);
    if (Array.isArray(posts)) {
      console.log('Posts statuses:', posts.map(p => ({ id: p.id, status: p.status, title: p.title })));
    }
  }, [posts]);
  
  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [activeTab, fetchPosts]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const postsOfYear = useMemo(() => Array.isArray(posts) ? posts.filter(p => new Date(p.createdAt).getFullYear() === selectedYear) : [], [posts, selectedYear]);

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const matchesSearch = (post.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (post.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (post.author?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    switch (filterType) {
      case 'published':
        matchesFilter = (post.status?.toLowerCase() || '') === 'published';
        break;
      case 'draft':
        matchesFilter = (post.status?.toLowerCase() || '') === 'draft';
        break;
      case 'archived':
        matchesFilter = (post.status?.toLowerCase() || '') === 'archived';
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  }) : [];

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = async (post: Post) => {
    const res = await fetch(`/api/admin/posts/${post.slug || post.id}`);
    const data = await res.json();
    setEditingPost(data.data);
    const postData = data.data;
    setPostState({
      title: typeof postData.title === 'string' ? postData.title : '',
      selectedTags: Array.isArray(postData.tags)
        ? postData.tags.map((t: any) => typeof t === 'string' ? t : t.name)
        : [],
      status: (postData.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
      content: typeof postData.content === 'string' ? postData.content : '',
      media: Array.isArray(postData.media) ? postData.media : [],
      githubRepo: typeof postData.githubRepo === 'string' ? postData.githubRepo : '',
    });
    
    setActiveTab('posts');
    setActiveSubTab('create');
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
        slug: newPost.slug || newPost.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
        media: Array.isArray(newPost.media)
          ? newPost.media.map(m => ({ ...m, type: m.type })) // Don't convert to uppercase here, let the API handle it
          : [],
      };
      if (editingPost && editingPost.slug) {
        const res = await fetch(`/api/admin/posts/${editingPost.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendPost),
        });
        if (res.ok) {
          await fetchPosts();
          showSuccess('Post updated', 'The post has been updated.');
        } else {
          const errorData = await res.json();
          showError('Failed to update post', errorData.error || 'Unknown error');
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
          const errorData = await res.json();
          showError('Failed to create post', errorData.error || 'Unknown error');
        }
      }
      setEditingPost(null);
      setActiveSubTab('management');
    } catch (error) {
      console.error('Error saving post:', error);
      showError('Failed to save post', 'An unexpected error occurred.');
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setPostState({
      title: '',
      selectedTags: [],
      status: 'DRAFT',
      content: '',
      media: [],
      githubRepo: '',
    });
    setActiveTab('posts');
    setActiveSubTab('management');
  };



 

  const filterOptions = [
    { value: 'all', label: 'All Posts' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Drafts' },
    { value: 'archived', label: 'Archived' },
  ];

  const statusCounts = Array.isArray(posts) ? posts.reduce((acc, post) => {
    acc[post.status] = (acc[post.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) : {};
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

  const [activeSubTab, setActiveSubTab] = useState<'management' | 'create'>('management');

  const getActiveTabContent = () => {
    if (activeTab === 'posts') {
      return (
        <>
          <AdminHeader
            title="Posts Management"
            description="Manage blog posts and content"
            buttonText="Create New Post"
            onAddClick={() => {
              setActiveTab('posts');
              setActiveSubTab('create');
            }}
          />
          <AdminStats stats={stats} />

          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveSubTab('management')}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSubTab === 'management'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Management ({posts.length})</span>
              </button>
              <button
                onClick={() => setActiveSubTab('create')}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSubTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Edit3 className="h-4 w-4" />
                <span>Create Post</span>
              </button>
            </nav>
          </div>

          {activeSubTab === 'management' ? (
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
              ) : filteredPosts.length === 0 ? (
                <NotFoundInline 
                  onClearFilters={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }}
                />
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
            <PostEditor 
              onSave={handleSavePost} 
              post={editingPost || undefined} 
              onCancel={handleCancelEdit}
              postState={postState}
              setPostState={setPostState}
            />
          )}
        </>
      );
    } else if (activeTab === 'tags') {
      return <TagsPageClient />;
    } else if (activeTab === 'media') {
      return <MediaPageClient />;
    }
  };

  if (!isClient) return null;
  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div className="border-b border-gray-200" suppressHydrationWarning>
        <nav className="-mb-px flex space-x-8" suppressHydrationWarning>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Posts ({Array.isArray(posts) ? posts.length : 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'tags'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TagIcon className="h-4 w-4" />
            <span>Tags ({Array.isArray(tags) ? tags.length : 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'media'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Image className="h-4 w-4" />
            <span>Media ({mediaStats.total})</span>
          </button>
        </nav>
      </div>

      {getActiveTabContent()}
    </div>
  );
}

export default PostsPageClient; 