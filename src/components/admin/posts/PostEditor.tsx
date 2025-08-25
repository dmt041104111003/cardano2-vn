import dynamic from 'next/dynamic';
import type { Post } from '~/constants/posts';

interface PostEditorProps {
  onSave: (post: Post) => void;
  post?: Post;
  onCancel: () => void;
  postState: {
    title: string;
    selectedTags: string[];
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    content: string;
    media: Array<{ type: 'image' | 'youtube' | 'video'; url: string; id: string }>;
    githubRepo: string;
  };
  setPostState: React.Dispatch<React.SetStateAction<{
    title: string;
    selectedTags: string[];
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    content: string;
    media: Array<{ type: 'image' | 'youtube' | 'video'; url: string; id: string }>;
    githubRepo: string;
  }>>;
}

const PostEditorClient = dynamic(() => import('./PostEditorClient').then(mod => ({ default: mod.PostEditorClient })), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-96 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-end">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  ),
});



export function PostEditor({ onSave, post, onCancel, postState, setPostState }: PostEditorProps) {
  return <PostEditorClient onSave={onSave} post={post} onCancel={onCancel} postState={postState} setPostState={setPostState} />;
}