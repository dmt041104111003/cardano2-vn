"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Strike } from '@tiptap/extension-strike';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Highlight } from '@tiptap/extension-highlight';
import { createLowlight, common } from 'lowlight';
import { useEffect, useState, useRef } from 'react';
import { tiptapPreviewStyles } from './tiptap/styles';

const lowlight = createLowlight(common);

interface TipTapPreviewProps {
  content: string;
  className?: string;
}

export function TipTapPreview({ content, className = "" }: TipTapPreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const proseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (!proseRef.current) return;
    const prose = proseRef.current;
    prose.querySelectorAll('.code-copy-btn').forEach(btn => btn.remove());
    prose.querySelectorAll('pre > code').forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre) return;
      const btn = document.createElement('button');
      btn.innerHTML = `
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" stroke-width="2" stroke="currentColor" fill="none"/><rect x="3" y="3" width="13" height="13" rx="2" stroke-width="2" stroke="currentColor" fill="none"/></svg>
          <span class="font-medium">Copy</span>
        </span>
      `;
      btn.className = 'code-copy-btn absolute top-2 right-2 px-2 py-1 text-xs bg-transparent text-gray-500 rounded shadow hover:bg-blue-500/20 hover:text-blue-600 transition-all duration-150 z-10 flex items-center gap-1';
      btn.style.position = 'absolute';
      btn.style.top = '8px';
      btn.style.right = '8px';
      btn.onclick = async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(codeBlock.textContent || '');
          btn.innerHTML = 'Copied!';
          setTimeout(() => {
            btn.innerHTML = `
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" stroke-width="2" stroke="currentColor" fill="none"/><rect x="3" y="3" width="13" height="13" rx="2" stroke-width="2" stroke="currentColor" fill="none"/></svg>
                <span class="font-medium">Copy</span>
              </span>
            `;
          }, 1200);
        } catch {}
      };
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }, [content, isClient]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer mx-auto',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md mx-auto',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse w-full mx-auto rounded-lg overflow-hidden',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'font-bold border p-2 mx-auto text-center',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border p-2 mx-auto',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Strike,
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200 px-1 rounded border border-yellow-400',
        },
      }),
    ],
    content,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!isClient) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div
      ref={proseRef}
      className={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto max-w-none ${className}`}
    >
      <EditorContent 
        editor={editor} 
        className="focus:outline-none"
      />
      <style jsx global>{tiptapPreviewStyles}</style>
      <style jsx global>{`
        .prose a {
          color: inherit;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
          position: relative;
        }
        .prose a:hover, .prose a:focus {
          text-decoration: none;
          color: #2563eb;
        }
      `}</style>
    </div>
  );
} 