'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Tag, User, X } from 'lucide-react';
import { TipTapEditor, TipTapPreview } from '~/components/ui/tiptap-editor';
import MediaInput from '~/components/ui/media-input';
import { useToastContext } from '~/components/toast-provider';

import type { Post, PostEditorClientProps } from '~/constants/posts';

interface Tag {
  id: string;
  name: string;
}

export function PostEditorClient({ onSave, post, onCancel }: PostEditorClientProps) {
  const [postState, setPostState] = useState({
    title: '',
    selectedTags: [] as string[],
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    content: '',
    media: [] as Array<{ type: 'image' | 'youtube' | 'video'; url: string; id: string }>,
    githubRepo: '',
  });

  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'youtube'>('image');
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const { showError } = useToastContext();

  useEffect(() => {
    if (post) {
      setPostState({
        title: typeof post.title === 'string' ? post.title : '',
        selectedTags: Array.isArray(post.tags)
          ? post.tags.map((t: Tag | string) => typeof t === 'string' ? t : t.name)
          : [],
        status: (post.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
        content: typeof post.content === 'string' ? post.content : '',
        media: Array.isArray(post.media) ? post.media : [],
        githubRepo: typeof post.githubRepo === 'string' ? post.githubRepo : '',
      });
    }
  }, [post]);

  useEffect(() => {
    const fetchTags = async () => {
      setLoadingTags(true);
      try {
        const res = await fetch('/api/admin/tags', { credentials: 'include' });
        const data = await res.json();
        if (Array.isArray(data?.tags)) setTags(data.tags);
      } catch {}
      setLoadingTags(false);
    };
    fetchTags();
  }, []);

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

  useEffect(() => {
    fetch('/api/admin/media')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched media:', data.media);
        // setAllMedia(data.media || []); // This line was removed as per the edit hint
      });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setPostState(prev => ({ ...prev, [field]: value }));
  };

  const handleRemoveTag = (tagName: string) => {
    setPostState(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(tag => tag !== tagName)
    }));
  };

  function getYoutubeIdFromUrl(url: string): string {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/);
    return match ? match[1] : '';
  }

  const handleMediaAdd = (media: { type: 'image' | 'youtube' | 'video'; url: string; id: string }) => {
    console.log('handleMediaAdd called with:', media);
    let newMedia = media;
    if (media.type === 'youtube') {
      const ytId = getYoutubeIdFromUrl(media.url);
      newMedia = { ...media, id: ytId };
    }
    console.log('Setting new media:', newMedia);
    setPostState(prev => {
      const newState = {
      ...prev,
      media: [newMedia]
      };
      console.log('New postState:', newState);
      return newState;
    });
  };

  const handleRemoveMedia = () => {
    setPostState(prev => ({
      ...prev,
      media: []
    }));
  };

  const handleTagToggle = (tagName: string) => {
    setPostState(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagName)
        ? prev.selectedTags.filter(tag => tag !== tagName)
        : [...prev.selectedTags, tagName]
    }));
  };

  const handleSave = async () => {

    console.log('handleSave called, postState:', postState);

    if (!postState.title || !postState.title.trim()) {
      showError('Title is required!');
      return;
    }
    if (!postState.content || !postState.content.trim()) {
      showError('Content is required!');
      return;
    }
    if (!postState.status) {
      showError('Status is required!');
      return;
    }
    if (!postState.selectedTags || postState.selectedTags.length === 0) {
      showError('At least one tag is required!');
      return;
    }
    if (!postState.media || postState.media.length === 0) {
      console.log('Media validation failed:', postState.media);
      showError('Image or YouTube media is required!');
      return;
    }
    console.log('Media validation passed:', postState.media);
    const normalizedMedia =
      Array.isArray(postState.media)
        ? postState.media.map(m => ({
            ...m,
            type: m.type.toUpperCase(),
            id: m.type === 'youtube' ? getYoutubeIdFromUrl(m.url) : m.id,
          }))
        : [];
    console.log('Normalized media:', normalizedMedia);
    const postData: Post = {
      id: post && typeof post.id === 'string' ? post.id : '',
      title: postState.title && postState.title.trim() ? postState.title : 'New Post',
      content: postState.content,
      status: postState.status.toUpperCase() as 'draft' | 'published' | 'archived',
      tags: postState.selectedTags,
      media: normalizedMedia.map(m => ({
        ...m,
        type: m.type.toLowerCase() as 'image' | 'youtube' | 'video', 
      })),
      githubRepo: postState.githubRepo,
      author: post && typeof post.author === 'string' ? post.author : '',
      createdAt: post && typeof post.createdAt === 'string' ? post.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: post && typeof post.views === 'number' ? post.views : 0,
      comments: post && typeof post.comments === 'number' ? post.comments : 0,
      shares: post && typeof post.shares === 'number' ? post.shares : 0,
      LIKE: post && typeof post.LIKE === 'number' ? post.LIKE : 0,
      HEART: post && typeof post.HEART === 'number' ? post.HEART : 0,
      HAHA: post && typeof post.HAHA === 'number' ? post.HAHA : 0,
      SAD: post && typeof post.SAD === 'number' ? post.SAD : 0,
      ANGRY: post && typeof post.ANGRY === 'number' ? post.ANGRY : 0,
    };
    if (onSave) onSave(postData);
  };

 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{post && post.id ? 'Edit Post' : 'Create New Post'}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={postState.title}
                onChange={e => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter post title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                >
                  {postState.selectedTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {postState.selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTag(tag);
                            }}
                            className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                            title={`Remove ${tag} tag`}
                            style={{ display: 'inline-flex', alignItems: 'center' }}
                          >
                            <X className="h-3 w-3" />
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">Select tags...</span>
                  )}
                </button>

                {showTagDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2">
                      {loadingTags ? (
                        <div className="text-gray-400 text-sm">Loading tags...</div>
                      ) : tags.length === 0 ? (
                        <div className="text-gray-400 text-sm">No tags found</div>
                      ) : tags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.name)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                            postState.selectedTags.includes(tag.name) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository (Optional)
              </label>
              <input
                type="text"
                value={postState.githubRepo}
                onChange={e => handleInputChange('githubRepo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter GitHub repository (e.g., dmt041104111003/cardano2-vn)"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will add a GitHub star widget to your post
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media (Images/YouTube)
              </label>
              {isClient && (
                <>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-t-md border-b-2 text-sm font-medium focus:outline-none transition-all duration-150 ${mediaType === 'image' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => {
                        setMediaType('image');
                        handleRemoveMedia();
                      }}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-t-md border-b-2 text-sm font-medium focus:outline-none transition-all duration-150 ${mediaType === 'youtube' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => {
                        setMediaType('youtube');
                        handleRemoveMedia();
                      }}
                    >
                      YouTube video
                    </button>
                  </div>
                  {mediaType === 'image' && (
                    <MediaInput
                      onMediaAdd={handleMediaAdd}
                      mediaType="image"
                    />
                  )}
                  {mediaType === 'youtube' && (
                    <MediaInput
                      onMediaAdd={handleMediaAdd}
                      mediaType="youtube"
                    />
                  )}
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={postState.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
                title="Select post status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <TipTapEditor
                content={postState.content}
                onChange={(content: string) => handleInputChange('content', content)}
                placeholder="Start writing your post... You can paste HTML content from any website and it will be automatically converted to proper format!"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              {post && post.id ? (
                <>
                  <button
                    type="button"
                    onClick={onCancel ? onCancel : undefined}
                    className="flex items-center px-4 py-2 border border-gray-200 bg-gray-50/80 text-gray-600 rounded-xl backdrop-blur-sm hover:bg-gray-100/90 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                  >
                    <X className="h-4 w-4 mr-2 text-gray-400" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 border border-yellow-200 bg-yellow-100/80 text-yellow-700 rounded-xl backdrop-blur-sm hover:bg-yellow-200/90 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2"
                  >
                    <Save className="h-4 w-4 mr-2 text-yellow-500" />
                    Update Post
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 border border-blue-200 bg-blue-100/80 text-blue-700 rounded-xl backdrop-blur-sm hover:bg-blue-200/90 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                >
                  <Save className="h-4 w-4 mr-2 text-blue-500" />
                  Create Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Preview</h3>
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-1" />
            Admin User
          </div>
        </div>

        <div className="prose max-w-none">
          {Array.isArray(postState.media) && postState.media.length > 0 && (
            <div className="mb-6">
              <div className="space-y-4">
                {postState.media.map((media, index) => {
                  const type = media.type?.toLowerCase?.() || '';
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      {type === 'youtube' ? (
                        <div className="youtube-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${media.id && media.id.length === 11 ? media.id : getYoutubeIdFromUrl(media.url)}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-64"
                          />
                        </div>
                      ) : type === 'video' ? (
                        <div className="flex justify-center">
                          <video
                            src={media.url}
                            controls
                            className="max-w-full max-h-64 rounded-lg shadow-md"
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <img
                            src={media.url}
                            alt={`Media ${index + 1}`}
                            className="max-w-full max-h-64 rounded-lg shadow-md object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden max-w-full max-h-64 rounded-lg shadow-md bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">Image not available</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {postState.content ? (
            <TipTapPreview content={postState.content} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Start writing to see the preview...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 