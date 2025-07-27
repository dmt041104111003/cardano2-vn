'use client';

import { useState } from 'react';
import { Image as ImageIcon, Trash2, Download, Eye } from 'lucide-react';
import { useToastContext } from '~/components/toast-provider';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import Modal from '~/components/admin/common/Modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
  usageTitles?: string[];
  // usedInPosts?: string[]; 
}

interface MediaTableProps {
  media: Media[];
  onDelete: (id: string) => void;
}

export function MediaTable({ media, onDelete }: MediaTableProps) {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; mediaId: string; mediaName: string }>({
    isOpen: false,
    mediaId: '',
    mediaName: '',
  });
  const { showSuccess, showError } = useToastContext();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewYoutube, setPreviewYoutube] = useState<string | null>(null);
  const [showUsageModal, setShowUsageModal] = useState<{ open: boolean; titles: string[] }>({ open: false, titles: [] });
  const [loadingPostIdx, setLoadingPostIdx] = useState<number | null>(null);

  const router = useRouter();

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.includes('youtube')) return '📺';
    return '📁';
  };

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.includes('youtube') || mimeType === 'application/youtube') return 'YouTube';
    return 'File';
  };

  const truncateText = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDownload = (item: Media) => {
    if (item.mimeType.includes('youtube') || item.mimeType === 'application/youtube') {
      let videoId = '';
      if (item.path.includes('v=')) {
        videoId = item.path.split('v=')[1]?.split('&')[0] || '';
      } else if (item.path.includes('youtu.be/')) {
        videoId = item.path.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (item.path.includes('youtube.com/embed/')) {
        videoId = item.path.split('youtube.com/embed/')[1]?.split('?')[0] || '';
      } else if (item.path.includes('youtube.com/watch/')) {
        videoId = item.path.split('youtube.com/watch/')[1]?.split('?')[0] || '';
      }
      
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const link = document.createElement('a');
        link.href = thumbnailUrl;
        link.download = `${item.originalName}_thumbnail.jpg`;
        link.click();
        showSuccess('Thumbnail download started', `YouTube thumbnail for ${item.originalName} download has started.`);
      } else {
        showError('Invalid YouTube URL', 'Could not extract video ID from YouTube URL.');
      }
    } else {
      const link = document.createElement('a');
      link.href = item.path;
      link.download = item.originalName;
      link.click();
      showSuccess('Download started', `${item.originalName} download has started.`);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showSuccess('Copied!', 'Media link copied to clipboard.');
  };

  const handleNavigateToBlog = async (title: string, idx: number) => {
    setLoadingPostIdx(idx);
    try {
      const res = await fetch(`/api/admin/posts?title=${encodeURIComponent(title)}&public=1`);
      const data = await res.json();
      const post = data.posts?.[0];
      if (post && post.id) {
        router.push(`/blog/${post.id}`);
      } else {
        showError('Not found', 'Not found!');
      }
    } catch {
      showError('Error', 'Error!');
    } finally {
      setLoadingPostIdx(null);
    }
  };

  if (media.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No media files found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No media files have been uploaded yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {media.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {item.mimeType.startsWith('image/') ? (
                      item.path.startsWith('data:image') ? (
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={item.path}
                          alt={item.originalName}
                        />
                      ) : (
                        <Image
                          className="h-10 w-10 rounded-lg object-cover"
                          src={item.path}
                          alt={item.originalName}
                          width={40}
                          height={40}
                        />
                      )
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-lg">{getFileIcon(item.mimeType)}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div
                      className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:underline"
                      title="Click to copy link"
                      onClick={() => handleCopyLink(item.path)}
                    >
                      {truncateText(item.originalName, 15)}
                    </div>
                    <div
                      className="text-sm text-gray-500 truncate cursor-pointer hover:underline"
                      title="Click to copy link"
                      onClick={() => handleCopyLink(item.path)}
                    >
                      {truncateText(item.filename, 12)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {getFileType(item.mimeType)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.usageCount && item.usageCount > 0 ? (
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">{item.usageCount}</span> post{item.usageCount > 1 ? 's' : ''}
                    {item.usageTitles && item.usageTitles.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1 truncate" title={item.usageTitles.join(', ')}>
                        {(() => {
                          const preview = item.usageTitles.slice(0, 2).join(', ');
                          const maxLen = 10;
                          const showPreview = preview.length > maxLen ? preview.slice(0, maxLen) + '...' : preview;
                          const needReadMore = preview.length > maxLen || item.usageTitles.length > 2;
                          return (
                            <>
                              {showPreview}
                              {needReadMore && (
                                <button
                                  className="text-emerald-600 underline ml-1"
                                  onClick={() => setShowUsageModal({ open: true, titles: item.usageTitles! })}
                                >
                                  Read more
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    Not used
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
                <br />
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => {
                      if (item.mimeType.startsWith('image/')) {
                        setPreviewImage(item.path);
                      } else if (item.mimeType.includes('youtube') || item.mimeType === 'application/youtube') {
                        // Extract YouTube video ID
                        let videoId = '';
                        if (item.path.includes('v=')) {
                          videoId = item.path.split('v=')[1]?.split('&')[0] || '';
                        } else if (item.path.includes('youtu.be/')) {
                          videoId = item.path.split('youtu.be/')[1]?.split('?')[0] || '';
                        } else if (item.path.includes('youtube.com/embed/')) {
                          videoId = item.path.split('youtube.com/embed/')[1]?.split('?')[0] || '';
                        } else if (item.path.includes('youtube.com/watch/')) {
                          videoId = item.path.split('youtube.com/watch/')[1]?.split('?')[0] || '';
                        }
                        if (videoId) setPreviewYoutube(videoId);
                      }
                    }}
                    className="text-green-600 hover:text-green-900"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    className="text-blue-600 hover:text-blue-900"
                    title={item.mimeType.includes('youtube') || item.mimeType === 'application/youtube' ? 'Download Thumbnail' : 'Download'}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (!!item.usageCount) {
                        showError('Cannot delete', 'This media is being used in posts and cannot be deleted.');
                        return;
                      }
                      setDeleteModal({
                        isOpen: true,
                        mediaId: item.id,
                        mediaName: item.originalName,
                      });
                    }}
                    className={`${
                      !!item.usageCount
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600 hover:text-red-900'
                    }`}
                    title={
                      !!item.usageCount
                        ? 'Cannot delete - Media is being used in posts'
                        : 'Delete'
                    }
                    disabled={!!item.usageCount}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mediaId: '', mediaName: '' })}
        onConfirm={() => onDelete(deleteModal.mediaId)}
        mediaName={deleteModal.mediaName}
      />
      {previewImage && (
        previewImage.startsWith('data:image') ? (
          <Modal isOpen={!!previewImage} onClose={() => setPreviewImage(null)} title="Image Preview" maxWidth="max-w-2xl">
            <div className="flex flex-col items-center gap-4">
              <img src={previewImage} alt="Preview" className="max-h-[70vh] rounded shadow-lg" />
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-xs text-gray-700 cursor-pointer hover:underline"
                  title={previewImage}
                  onClick={() => {
                    navigator.clipboard.writeText(previewImage);
                    showSuccess('Copied!', previewImage);
                  }}
                  style={{maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block'}}
                >
                  {previewImage.split('/').pop()}
                </span>
                <button
                  className="p-1 text-xs rounded border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => {
                    navigator.clipboard.writeText(previewImage);
                    showSuccess('Copied!', previewImage);
                  }}
                  title="Copy image link"
                >
                  Copy
                </button>
              </div>
            </div>
          </Modal>
        ) : (
          <Modal isOpen={!!previewImage} onClose={() => setPreviewImage(null)} title="Image Preview" maxWidth="max-w-2xl">
            <div className="flex flex-col items-center gap-4">
              <Image src={previewImage} alt="Preview" width={600} height={400} className="max-h-[70vh] rounded shadow-lg" />
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-xs text-gray-700 cursor-pointer hover:underline"
                  title={previewImage}
                  onClick={() => {
                    navigator.clipboard.writeText(previewImage);
                    showSuccess('Copied!', previewImage);
                  }}
                  style={{maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block'}}
                >
                  {previewImage.split('/').pop()}
                </span>
                <button
                  className="p-1 text-xs rounded border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => {
                    navigator.clipboard.writeText(previewImage);
                    showSuccess('Copied!', previewImage);
                  }}
                  title="Copy image link"
                >
                  Copy
                </button>
              </div>
            </div>
          </Modal>
        )
      )}
      {previewYoutube && (
        <Modal isOpen={!!previewYoutube} onClose={() => setPreviewYoutube(null)} title="YouTube Preview" maxWidth="max-w-2xl">
          <div className="flex flex-col items-center gap-4">
            <iframe
              src={`https://www.youtube.com/embed/${previewYoutube}`}
              title="YouTube video preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full max-w-2xl aspect-video rounded shadow-lg"
            />
            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-xs text-gray-700 cursor-pointer hover:underline"
                title={`https://www.youtube.com/watch?v=${previewYoutube}`}
                onClick={() => {
                  navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${previewYoutube}`);
                  showSuccess('Copied!', `https://www.youtube.com/watch?v=${previewYoutube}`);
                }}
                style={{maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block'}}
              >
                {previewYoutube}
              </span>
              <button
                className="p-1 text-xs rounded border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                onClick={() => {
                  navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${previewYoutube}`);
                  showSuccess('Copied!', `https://www.youtube.com/watch?v=${previewYoutube}`);
                }}
                title="Copy YouTube link"
              >
                Copy
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showUsageModal.open && (
        <Modal isOpen={showUsageModal.open} onClose={() => setShowUsageModal({ open: false, titles: [] })} title="Posts using this media" maxWidth="max-w-lg">
          <div className="p-6">
            <ul className="list-disc pl-8 space-y-3">
              {showUsageModal.titles.map((title, idx) => (
                <li key={idx} className="text-base">
                  <button
                    className="text-emerald-700 hover:underline font-medium disabled:opacity-60"
                    title={title}
                    onClick={() => handleNavigateToBlog(title, idx)}
                    disabled={loadingPostIdx === idx}
                  >
                    {title}
                    {loadingPostIdx === idx && <span className="ml-2 animate-spin">Loading...</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
} 