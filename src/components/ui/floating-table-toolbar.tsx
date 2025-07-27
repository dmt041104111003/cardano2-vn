"use client";

import { useEffect, useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { Editor } from '@tiptap/core';

interface FloatingTableToolbarProps {
  editor: Editor | null;
  isClient: boolean;
}

export const FloatingTableToolbar = ({ editor, isClient }: FloatingTableToolbarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentTable, setCurrentTable] = useState<HTMLElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor || !isClient) return;

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const table = target.closest('table');
      
      if (table && editor.isActive('table')) {
        setPosition({
          x: event.clientX + 10, 
          y: event.clientY - 10
        });
        
        setCurrentTable(table);
        setIsVisible(true);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setIsVisible(false);
        setCurrentTable(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [editor, isClient]);

  const addColumnAfter = () => {
    if (!editor) return;
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    if (!editor) return;
    editor.chain().focus().deleteColumn().run();
  };

  const addRowAfter = () => {
    if (!editor) return;
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    if (!editor) return;
    editor.chain().focus().deleteRow().run();
  };

  const deleteTable = () => {
    if (!editor) return;
    editor.chain().focus().deleteTable().run();
  };

  if (!isVisible || !currentTable) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-3 flex flex-col gap-3"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '200px',
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            Column
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={addColumnAfter}
              className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded flex items-center justify-center transition-colors font-bold text-sm"
              title="Add column"
            >
              +
            </button>
            <button
              onClick={deleteColumn}
              className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded flex items-center justify-center transition-colors font-bold text-sm"
              title="Delete column"
            >
              −
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            Row
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={addRowAfter}
              className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded flex items-center justify-center transition-colors font-bold text-sm"
              title="Add row"
            >
              +
            </button>
            <button
              onClick={deleteRow}
              className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded flex items-center justify-center transition-colors font-bold text-sm"
              title="Delete row"
            >
              −
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <span className="text-sm font-medium text-gray-300">
          Table
        </span>
        <button
          onClick={deleteTable}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded flex items-center gap-2 transition-colors font-medium text-sm"
          title="Delete table"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  );
}; 