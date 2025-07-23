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
import { Placeholder } from '@tiptap/extension-placeholder';
import { createLowlight, common } from 'lowlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Highlighter,
  Strikethrough,
  Underline as UnderlineIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Type
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { tiptapStyles } from './tiptap/styles';
import { FloatingTableToolbar } from './floating-table-toolbar';
import { Editor } from '@tiptap/core';
import { Node, Mark } from 'prosemirror-model';

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export { TipTapPreview } from './tiptap-preview';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      // setForceUpdate(prev => prev + 1); // This line was removed
    };

    editor.on('selectionUpdate', updateToolbar);
    editor.on('transaction', updateToolbar);

    return () => {
      editor.off('selectionUpdate', updateToolbar);
      editor.off('transaction', updateToolbar);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setTextAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    editor.chain().focus().setTextAlign(align).run();
  };

  const toggleCase = () => {
    const selection = editor.state.selection;
    if (selection.empty) return;
    
    const { from, to } = selection;
    const doc = editor.state.doc;
    
    const textNodes: Array<{ node: Node; pos: number; marks: Mark[] }> = [];
    doc.nodesBetween(from, to, (node: Node, pos: number) => {
      if (node.type.name === 'text') {
        textNodes.push({ node, pos, marks: [...node.marks] });
      }
      return true;
    });
    
    if (textNodes.length === 0) return;
    
    const tr = editor.state.tr;
    let offset = 0;
    
    textNodes.forEach(({ node, pos, marks }) => {
      const text = node.text;
      if (!text) return;
      const newText = text === text.toUpperCase() ? text.toLowerCase() : text.toUpperCase();
      
      if (text !== newText) {
        const start = pos + offset;
        const end = start + text.length;
        
        const newTextNode = editor.state.schema.text(newText, marks);
        tr.replaceWith(start, end, newTextNode);
        
        offset += newText.length - text.length;
      }
    });
    
    editor.view.dispatch(tr);
  };

  return (
    <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2 bg-gray-50">
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('underline') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('strike') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('highlight') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </button>
        <button
          onClick={toggleCase}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          title="Toggle Case (UPPERCASE/lowercase)"
        >
          <Type className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('subscript') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Subscript"
        >
          <SubscriptIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('superscript') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Superscript"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title="Insert Horizontal Rule"
        >
          <span className="block w-6 border-t-2 border-gray-400" style={{ margin: 0 }} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('heading', { level: 4 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Heading 4"
        >
          <Heading4 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('heading', { level: 5 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Heading 5"
        >
          <Heading5 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('heading', { level: 6 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Heading 6"
        >
          <Heading6 className="h-4 w-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('blockquote') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('codeBlock') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          onClick={addTable}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          title="Insert Table"
        >
          <TableIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setTextAlign('left')}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTextAlign('center')}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTextAlign('right')}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTextAlign('justify')}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
          }`}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-1">
        <button
          onClick={addLink}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-6 mx-auto',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-6 mx-auto',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-1 mx-auto',
          },
        },
      }),
      HorizontalRule,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-lg mx-auto',
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
          class: 'border-collapse border border-gray-300 w-full mx-auto',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-bold border border-gray-300 p-2 mx-auto',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2 mx-auto',
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
          class: 'bg-yellow-200 px-1 rounded',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!isClient) {
    return (
      <div className="border border-gray-300 rounded-md overflow-hidden bg-white" suppressHydrationWarning>
        <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2 bg-gray-50">
          <div className="p-2 rounded bg-gray-100 animate-pulse">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
          </div>
          <div className="p-2 rounded bg-gray-100 animate-pulse">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
          </div>
          <div className="p-2 rounded bg-gray-100 animate-pulse">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="p-4 min-h-[400px] bg-gray-50 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white" suppressHydrationWarning>
      <MenuBar editor={editor} />
      <FloatingTableToolbar editor={editor} isClient={isClient} />
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[400px] focus:outline-none prose prose-sm max-w-none"
        placeholder={placeholder}
      />
      <style jsx global>{tiptapStyles}</style>
    </div>
  );
} 