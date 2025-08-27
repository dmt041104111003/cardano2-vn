"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';

interface SimpleRichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function SimpleRichEditor({ content, onChange, placeholder = "Start writing..." }: SimpleRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (editorRef.current && isClient) {
      editorRef.current.innerHTML = content;
    }
  }, [content, isClient]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (html !== content) {
        onChange(html);
      }
    }
  };

  const handleKeyUp = () => {
    updateContent();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  };

  if (!isClient) {
    return (
      <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
        <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2 bg-gray-50">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-2 rounded bg-gray-100 animate-pulse">
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
        <div className="p-4 min-h-[200px] bg-gray-50 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2 bg-gray-50">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Other Formatting */}
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<pre>')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => execCommand('undo')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('redo')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[200px] focus:outline-none prose prose-sm max-w-none"
        onKeyUp={handleKeyUp}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onBlur={updateContent}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        style={{
          backgroundImage: content ? 'none' : `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 8 0 L 0 0 0 8' fill='none' stroke='%23f0f0f0' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23smallGrid)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export function SimpleRichPreview({ content }: { content: string }) {
  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
