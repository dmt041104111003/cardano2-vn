export const tiptapStyles = `
  .ProseMirror {
    outline: none;
    min-height: 200px;
    color: inherit !important;
    background-color: transparent !important;
  }
  
  .ProseMirror p.is-editor-empty:first-child::before {
    color: #6b7280 !important;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  
  /* Table Styles - Responsive Dark/Light Theme */
  .ProseMirror table {
    border-collapse: collapse !important;
    margin: 0 !important;
    overflow: hidden !important;
    table-layout: fixed !important;
    width: 100% !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  
  /* Dark Mode Table */
  .dark .ProseMirror table {
    background-color: #1e3a8a !important;
    border: 2px solid #1e40af !important;
    color: #ffffff !important;
  }
  
  /* Light Mode Table */
  .ProseMirror table {
    background-color: #ffffff !important;
    border: 2px solid #e5e7eb !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror table td,
  .ProseMirror table th {
    border: 1px solid #e5e7eb !important;
    box-sizing: border-box !important;
    min-width: 1em !important;
    padding: 12px 16px !important;
    position: relative !important;
    vertical-align: top !important;
  }
  
  /* Dark Mode Table Cells */
  .dark .ProseMirror table td,
  .dark .ProseMirror table th {
    border: 1px solid #3b82f6 !important;
    color: #ffffff !important;
    background-color: #1e3a8a !important;
  }
  
  /* Light Mode Table Cells */
  .ProseMirror table td {
    background-color: #ffffff !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror table th {
    background-color: #f9fafb !important;
    font-weight: bold !important;
    text-align: center !important;
    color: #1f2937 !important;
  }
  
  /* Dark Mode Table Headers */
  .dark .ProseMirror table th {
    background-color: #1e40af !important;
    color: #ffffff !important;
  }
  
  .ProseMirror table .selectedCell:after {
    background: rgba(59, 130, 246, 0.4) !important;
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }
  
  .ProseMirror table .column-resize-handle {
    background-color: #3b82f6 !important;
    bottom: -2px;
    position: absolute;
    right: -2px;
    pointer-events: none;
    top: 0;
    width: 4px;
  }
  
  .ProseMirror table p {
    margin: 0;
  }
  
  /* Dark Mode Table Text */
  .dark .ProseMirror table p {
    color: #ffffff !important;
  }
  
  /* Light Mode Table Text */
  .ProseMirror table p {
    color: #1f2937 !important;
  }
  
  /* Table Selection */
  .ProseMirror table .selectedCell {
    background-color: rgba(59, 130, 246, 0.1) !important;
  }
  
  .ProseMirror table .grip-column {
    background-color: #3b82f6 !important;
    opacity: 0.5;
  }
  
  .ProseMirror table .grip-row {
    background-color: #3b82f6 !important;
    opacity: 0.5;
  }
  
  .ProseMirror table .grip-table {
    background-color: #3b82f6 !important;
    opacity: 0.5;
  }
  
  /* Force table colors - Responsive */
  .ProseMirror table * {
    color: inherit !important;
  }
  
  /* Dark Mode Force Table Colors */
  .dark .ProseMirror table * {
    color: #ffffff !important;
  }
  
  .dark .ProseMirror table td *,
  .dark .ProseMirror table th * {
    color: #ffffff !important;
  }
  
  /* Light Mode Force Table Colors */
  .ProseMirror table td *,
  .ProseMirror table th * {
    color: #1f2937 !important;
  }
  
  /* Blockquote - Responsive */
  .ProseMirror blockquote {
    border-left: 4px solid #3b82f6 !important;
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin: 1rem 0;
    border-radius: 0.25rem;
  }
  
  /* Dark Mode Blockquote */
  .dark .ProseMirror blockquote {
    background-color: #1e293b !important;
    color: #e5e7eb !important;
  }
  
  /* Light Mode Blockquote */
  .ProseMirror blockquote {
    background-color: #f8fafc !important;
    color: #374151 !important;
  }
  
  /* Code Blocks - Responsive */
  .ProseMirror pre {
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  /* Dark Mode Code Blocks */
  .dark .ProseMirror pre {
    background-color: #111827 !important;
    color: #f3f4f6 !important;
    border: 1px solid #374151 !important;
  }
  
  /* Light Mode Code Blocks */
  .ProseMirror pre {
    background-color: #f8fafc !important;
    color: #1f2937 !important;
    border: 1px solid #e5e7eb !important;
  }
  
  .ProseMirror code {
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
  }
  
  /* Dark Mode Inline Code */
  .dark .ProseMirror code {
    background-color: #374151 !important;
    color: #f3f4f6 !important;
  }
  
  /* Light Mode Inline Code */
  .ProseMirror code {
    background-color: #f3f4f6 !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror pre code {
    background-color: transparent !important;
    padding: 0;
    color: inherit !important;
  }
  
  /* Headings - Responsive */
  .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.25;
  }
  
  /* Dark Mode Headings */
  .dark .ProseMirror h1, .dark .ProseMirror h2, .dark .ProseMirror h3, .dark .ProseMirror h4, .dark .ProseMirror h5, .dark .ProseMirror h6 {
    color: #ffffff !important;
  }
  
  /* Light Mode Headings */
  .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
    color: #1f2937 !important;
  }
  
  .ProseMirror h1 { font-size: 2rem; }
  .ProseMirror h2 { font-size: 1.5rem; }
  .ProseMirror h3 { font-size: 1.25rem; }
  .ProseMirror h4 { font-size: 1.125rem; }
  .ProseMirror h5 { font-size: 1rem; }
  .ProseMirror h6 { font-size: 0.875rem; }
  
  /* Paragraphs - Responsive */
  .ProseMirror p {
    margin-bottom: 1rem;
    line-height: 1.75;
  }
  
  /* Dark Mode Paragraphs */
  .dark .ProseMirror p {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Paragraphs */
  .ProseMirror p {
    color: #374151 !important;
  }
  
  /* Lists - Responsive */
  .ProseMirror ul, .ProseMirror ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  .ProseMirror ul {
    list-style-type: disc;
  }
  
  .ProseMirror ol {
    list-style-type: decimal;
  }
  
  .ProseMirror li {
    margin-bottom: 0.25rem;
    display: list-item;
  }
  
  /* Dark Mode Lists */
  .dark .ProseMirror ul, .dark .ProseMirror ol, .dark .ProseMirror li {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Lists */
  .ProseMirror ul, .ProseMirror ol, .ProseMirror li {
    color: #374151 !important;
  }
  
  /* Images */
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  /* Links - Responsive */
  .ProseMirror a {
    text-decoration: underline;
  }
  
  /* Dark Mode Links */
  .dark .ProseMirror a {
    color: #60a5fa !important;
  }
  
  .dark .ProseMirror a:hover {
    color: #93c5fd !important;
  }
  
  /* Light Mode Links */
  .ProseMirror a {
    color: #2563eb !important;
  }
  
  .ProseMirror a:hover {
    color: #1d4ed8 !important;
  }
  
  /* Highlight/Mark - Responsive */
  .ProseMirror mark {
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }
  
  /* Dark Mode Highlight */
  .dark .ProseMirror mark {
    background-color: #fef3c7 !important;
    color: #92400e !important;
    border: 1px solid #f59e0b !important;
  }
  
  /* Light Mode Highlight */
  .ProseMirror mark {
    background-color: #fef3c7 !important;
    color: #92400e !important;
    border: 1px solid #f59e0b !important;
  }
  
  /* Text Formatting - Responsive */
  .ProseMirror strong {
    font-weight: 600;
  }
  
  .ProseMirror em {
    font-style: italic;
  }
  
  .ProseMirror s {
    text-decoration: line-through;
  }
  
  .ProseMirror u {
    text-decoration: underline;
  }
  
  /* Dark Mode Text Formatting */
  .dark .ProseMirror strong {
    color: #ffffff !important;
  }
  
  .dark .ProseMirror em {
    color: #e5e7eb !important;
  }
  
  .dark .ProseMirror s {
    color: #9ca3af !important;
  }
  
  .dark .ProseMirror u {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Text Formatting */
  .ProseMirror strong {
    color: #1f2937 !important;
  }
  
  .ProseMirror em {
    color: #374151 !important;
  }
  
  .ProseMirror s {
    color: #6b7280 !important;
  }
  
  .ProseMirror u {
    color: #374151 !important;
  }
  
  /* Subscript and Superscript - Responsive */
  .ProseMirror sub {
    vertical-align: sub;
    font-size: 0.75em;
  }
  
  .ProseMirror sup {
    vertical-align: super;
    font-size: 0.75em;
  }
  
  /* Dark Mode Sub/Superscript */
  .dark .ProseMirror sub, .dark .ProseMirror sup {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Sub/Superscript */
  .ProseMirror sub, .ProseMirror sup {
    color: #374151 !important;
  }
  
  /* Text Alignment */
  .ProseMirror .text-left {
    text-align: left;
  }
  
  .ProseMirror .text-center {
    text-align: center;
  }
  
  .ProseMirror .text-right {
    text-align: right;
  }
  
  .ProseMirror .text-justify {
    text-align: justify;
  }
  
  /* Horizontal Rule - Responsive */
  .ProseMirror hr {
    border: none;
    margin: 2rem 0;
  }
  
  /* Dark Mode HR */
  .dark .ProseMirror hr {
    border-top: 2px solid #4b5563 !important;
  }
  
  /* Light Mode HR */
  .ProseMirror hr {
    border-top: 2px solid #e5e7eb !important;
  }
  
  /* YouTube Embed */
  .ProseMirror iframe {
    border-radius: 0.5rem;
    max-width: 100%;
  }
  
  /* Selection */
  .ProseMirror ::selection {
    background-color: rgba(59, 130, 246, 0.3) !important;
  }
  
  /* Focus */
  .ProseMirror:focus {
    outline: none;
  }
  
  /* Placeholder */
  .ProseMirror .is-editor-empty:first-child::before {
    color: #6b7280 !important;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  
  /* Force all text to be visible - Responsive */
  .ProseMirror * {
    color: inherit !important;
  }
  
  /* Dark Mode Universal Text */
  .dark .ProseMirror span,
  .dark .ProseMirror div,
  .dark .ProseMirror section,
  .dark .ProseMirror article {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Universal Text */
  .ProseMirror span,
  .ProseMirror div,
  .ProseMirror section,
  .ProseMirror article {
    color: #374151 !important;
  }
  
  /* Override any inherited colors - Responsive */
  .dark .ProseMirror .text-gray-900,
  .dark .ProseMirror .text-gray-800,
  .dark .ProseMirror .text-gray-700,
  .dark .ProseMirror .text-gray-600,
  .dark .ProseMirror .text-gray-500,
  .dark .ProseMirror .text-gray-400,
  .dark .ProseMirror .text-gray-300,
  .dark .ProseMirror .text-gray-200,
  .dark .ProseMirror .text-gray-100 {
    color: #e5e7eb !important;
  }
  
  .ProseMirror .text-gray-900,
  .ProseMirror .text-gray-800,
  .ProseMirror .text-gray-700,
  .ProseMirror .text-gray-600,
  .ProseMirror .text-gray-500,
  .ProseMirror .text-gray-400,
  .ProseMirror .text-gray-300,
  .ProseMirror .text-gray-200,
  .ProseMirror .text-gray-100 {
    color: #374151 !important;
  }
`;

export const tiptapPreviewStyles = `
  .ProseMirror {
    outline: none;
    max-width: 100%;
    color: inherit !important;
    background-color: transparent !important;
  }
  
  .ProseMirror p.is-editor-empty:first-child::before {
    color: #6b7280 !important;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  
  /* Table Styles - Responsive Dark/Light Theme */
  .ProseMirror table {
    border-collapse: collapse !important;
    margin: 0 !important;
    overflow: hidden !important;
    table-layout: fixed !important;
    width: 100% !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  
  /* Dark Mode Table */
  .dark .ProseMirror table {
    background-color: #1e3a8a !important;
    border: 2px solid #1e40af !important;
    color: #ffffff !important;
  }
  
  /* Light Mode Table */
  .ProseMirror table {
    background-color: #ffffff !important;
    border: 2px solid #e5e7eb !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror table td,
  .ProseMirror table th {
    border: 1px solid #e5e7eb !important;
    box-sizing: border-box !important;
    min-width: 1em !important;
    padding: 12px 16px !important;
    position: relative !important;
    vertical-align: top !important;
  }
  
  /* Dark Mode Table Cells */
  .dark .ProseMirror table td,
  .dark .ProseMirror table th {
    border: 1px solid #3b82f6 !important;
    color: #ffffff !important;
    background-color: #1e3a8a !important;
  }
  
  /* Light Mode Table Cells */
  .ProseMirror table td {
    background-color: #ffffff !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror table th {
    background-color: #f9fafb !important;
    font-weight: bold !important;
    text-align: center !important;
    color: #1f2937 !important;
  }
  
  /* Dark Mode Table Headers */
  .dark .ProseMirror table th {
    background-color: #1e40af !important;
    color: #ffffff !important;
  }
  
  .ProseMirror table .selectedCell:after {
    background: rgba(59, 130, 246, 0.4) !important;
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }
  
  .ProseMirror table .column-resize-handle {
    background-color: #3b82f6 !important;
    bottom: -2px;
    position: absolute;
    right: -2px;
    pointer-events: none;
    top: 0;
    width: 4px;
  }
  
  .ProseMirror table p {
    margin: 0;
  }
  
  /* Dark Mode Table Text */
  .dark .ProseMirror table p {
    color: #ffffff !important;
  }
  
  /* Light Mode Table Text */
  .ProseMirror table p {
    color: #1f2937 !important;
  }
  
  /* Table Selection */
  .ProseMirror table .selectedCell {
    background-color: rgba(59, 130, 246, 0.1) !important;
  }
  
  .ProseMirror table .grip-column {
    background-color: #3b82f6 !important;
    opacity: 0.5;
  }
  
  .ProseMirror table .grip-row {
    background-color: #3b82f6 !important;
    opacity: 0.5;
  }
  
  .ProseMirror table .grip-table {
    background-color: #3b82f6 !important;
    opacity: 0.5;
  }
  
  /* Force table colors - Responsive */
  .ProseMirror table * {
    color: inherit !important;
  }
  
  /* Dark Mode Force Table Colors */
  .dark .ProseMirror table * {
    color: #ffffff !important;
  }
  
  .dark .ProseMirror table td *,
  .dark .ProseMirror table th * {
    color: #ffffff !important;
  }
  
  /* Light Mode Force Table Colors */
  .ProseMirror table td *,
  .ProseMirror table th * {
    color: #1f2937 !important;
  }
  
  /* Blockquote - Responsive */
  .ProseMirror blockquote {
    border-left: 4px solid #3b82f6 !important;
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin: 1rem 0;
    border-radius: 0.25rem;
  }
  
  /* Dark Mode Blockquote */
  .dark .ProseMirror blockquote {
    background-color: #1e293b !important;
    color: #e5e7eb !important;
  }
  
  /* Light Mode Blockquote */
  .ProseMirror blockquote {
    background-color: #f8fafc !important;
    color: #374151 !important;
  }
  
  /* Code Blocks - Responsive */
  .ProseMirror pre {
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  /* Dark Mode Code Blocks */
  .dark .ProseMirror pre {
    background-color: #111827 !important;
    color: #f3f4f6 !important;
    border: 1px solid #374151 !important;
  }
  
  /* Light Mode Code Blocks */
  .ProseMirror pre {
    background-color: #f8fafc !important;
    color: #1f2937 !important;
    border: 1px solid #e5e7eb !important;
  }
  
  .ProseMirror code {
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
  }
  
  /* Dark Mode Inline Code */
  .dark .ProseMirror code {
    background-color: #374151 !important;
    color: #f3f4f6 !important;
  }
  
  /* Light Mode Inline Code */
  .ProseMirror code {
    background-color: #f3f4f6 !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror pre code {
    background-color: transparent !important;
    padding: 0;
    color: inherit !important;
  }
  
  /* Headings - Responsive */
  .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.25;
  }
  
  /* Dark Mode Headings */
  .dark .ProseMirror h1, .dark .ProseMirror h2, .dark .ProseMirror h3, .dark .ProseMirror h4, .dark .ProseMirror h5, .dark .ProseMirror h6 {
    color: #ffffff !important;
  }
  
  /* Light Mode Headings */
  .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
    color: #1f2937 !important;
  }
  
  .ProseMirror h1 { font-size: 2rem; }
  .ProseMirror h2 { font-size: 1.5rem; }
  .ProseMirror h3 { font-size: 1.25rem; }
  .ProseMirror h4 { font-size: 1.125rem; }
  .ProseMirror h5 { font-size: 1rem; }
  .ProseMirror h6 { font-size: 0.875rem; }
  
  /* Paragraphs - Responsive */
  .ProseMirror p {
    margin-bottom: 1rem;
    line-height: 1.75;
  }
  
  /* Dark Mode Paragraphs */
  .dark .ProseMirror p {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Paragraphs */
  .ProseMirror p {
    color: #374151 !important;
  }
  
  /* Lists - Responsive */
  .ProseMirror ul, .ProseMirror ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  .ProseMirror li {
    margin-bottom: 0.25rem;
  }
  
  /* Dark Mode Lists */
  .dark .ProseMirror ul, .dark .ProseMirror ol, .dark .ProseMirror li {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Lists */
  .ProseMirror ul, .ProseMirror ol, .ProseMirror li {
    color: #374151 !important;
  }
  
  /* Table */
  .ProseMirror table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin: 1rem 0 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  
  .ProseMirror th, .ProseMirror td {
    border: 1px solid #e5e7eb !important;
    padding: 12px 16px !important;
    text-align: left !important;
  }
  
  /* Dark Mode Table */
  .dark .ProseMirror th, .dark .ProseMirror td {
    border: 1px solid #3b82f6 !important;
    color: #ffffff !important;
  }
  
  /* Light Mode Table */
  .ProseMirror td {
    background-color: #ffffff !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror th {
    background-color: #f9fafb !important;
    font-weight: 600 !important;
    text-align: center !important;
    color: #1f2937 !important;
  }
  
  /* Dark Mode Table Headers */
  .dark .ProseMirror th {
    background-color: #1e40af !important;
    color: #ffffff !important;
  }
  
  /* Dark Mode Table Cells */
  .dark .ProseMirror td {
    background-color: #1e3a8a !important;
    color: #ffffff !important;
  }
  
  /* Images */
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  /* Links - Responsive */
  .ProseMirror a {
    text-decoration: underline;
  }
  
  /* Dark Mode Links */
  .dark .ProseMirror a {
    color: #60a5fa !important;
  }
  
  .dark .ProseMirror a:hover {
    color: #93c5fd !important;
  }
  
  /* Light Mode Links */
  .ProseMirror a {
    color: #2563eb !important;
  }
  
  .ProseMirror a:hover {
    color: #1d4ed8 !important;
  }
  
  /* Highlight/Mark - Responsive */
  .ProseMirror mark {
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }
  
  /* Dark Mode Highlight */
  .dark .ProseMirror mark {
    background-color: #fef3c7 !important;
    color: #92400e !important;
    border: 1px solid #f59e0b !important;
  }
  
  /* Light Mode Highlight */
  .ProseMirror mark {
    background-color: #fef3c7 !important;
    color: #92400e !important;
    border: 1px solid #f59e0b !important;
  }
  
  /* Text Formatting - Responsive */
  .ProseMirror strong {
    font-weight: 600;
  }
  
  .ProseMirror em {
    font-style: italic;
  }
  
  .ProseMirror s {
    text-decoration: line-through;
  }
  
  .ProseMirror u {
    text-decoration: underline;
  }
  
  /* Dark Mode Text Formatting */
  .dark .ProseMirror strong {
    color: #ffffff !important;
  }
  
  .dark .ProseMirror em {
    color: #e5e7eb !important;
  }
  
  .dark .ProseMirror s {
    color: #9ca3af !important;
  }
  
  .dark .ProseMirror u {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Text Formatting */
  .ProseMirror strong {
    color: #1f2937 !important;
  }
  
  .ProseMirror em {
    color: #374151 !important;
  }
  
  .ProseMirror s {
    color: #6b7280 !important;
  }
  
  .ProseMirror u {
    color: #374151 !important;
  }
  
  /* Subscript and Superscript - Responsive */
  .ProseMirror sub {
    vertical-align: sub;
    font-size: 0.75em;
  }
  
  .ProseMirror sup {
    vertical-align: super;
    font-size: 0.75em;
  }
  
  /* Dark Mode Sub/Superscript */
  .dark .ProseMirror sub, .dark .ProseMirror sup {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Sub/Superscript */
  .ProseMirror sub, .ProseMirror sup {
    color: #374151 !important;
  }
  
  /* Text Alignment */
  .ProseMirror .text-left {
    text-align: left;
  }
  
  .ProseMirror .text-center {
    text-align: center;
  }
  
  .ProseMirror .text-right {
    text-align: right;
  }
  
  .ProseMirror .text-justify {
    text-align: justify;
  }
  
  /* Horizontal Rule - Responsive */
  .ProseMirror hr {
    border: none;
    margin: 2rem 0;
  }
  
  /* Dark Mode HR */
  .dark .ProseMirror hr {
    border-top: 2px solid #4b5563 !important;
  }
  
  /* Light Mode HR */
  .ProseMirror hr {
    border-top: 2px solid #e5e7eb !important;
  }
  
  /* YouTube Embed */
  .ProseMirror iframe {
    border-radius: 0.5rem;
    max-width: 100%;
  }
  
  /* Selection */
  .ProseMirror ::selection {
    background-color: rgba(59, 130, 246, 0.3) !important;
  }
  
  /* Focus */
  .ProseMirror:focus {
    outline: none;
  }
  
  /* Placeholder */
  .ProseMirror .is-editor-empty:first-child::before {
    color: #6b7280 !important;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  
  /* Force all text to be visible - Responsive */
  .ProseMirror * {
    color: inherit !important;
  }
  
  /* Dark Mode Universal Text */
  .dark .ProseMirror span,
  .dark .ProseMirror div,
  .dark .ProseMirror section,
  .dark .ProseMirror article {
    color: #e5e7eb !important;
  }
  
  /* Light Mode Universal Text */
  .ProseMirror span,
  .ProseMirror div,
  .ProseMirror section,
  .ProseMirror article {
    color: #374151 !important;
  }
  
  /* Override any inherited colors - Responsive */
  .dark .ProseMirror .text-gray-900,
  .dark .ProseMirror .text-gray-800,
  .dark .ProseMirror .text-gray-700,
  .dark .ProseMirror .text-gray-600,
  .dark .ProseMirror .text-gray-500,
  .dark .ProseMirror .text-gray-400,
  .dark .ProseMirror .text-gray-300,
  .dark .ProseMirror .text-gray-200,
  .dark .ProseMirror .text-gray-100 {
    color: #e5e7eb !important;
  }
  
  .ProseMirror .text-gray-900,
  .ProseMirror .text-gray-800,
  .ProseMirror .text-gray-700,
  .ProseMirror .text-gray-600,
  .ProseMirror .text-gray-500,
  .ProseMirror .text-gray-400,
  .ProseMirror .text-gray-300,
  .ProseMirror .text-gray-200,
  .ProseMirror .text-gray-100 {
    color: #374151 !important;
  }
`; 