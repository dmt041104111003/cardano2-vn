export const tiptapStyles = `
  .ProseMirror {
    outline: none;
    min-height: 200px;
  }
  
  .ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  
  .ProseMirror table {
    border-collapse: collapse !important;
    margin: 0 !important;
    overflow: hidden !important;
    table-layout: fixed !important;
    width: 100% !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  
  .ProseMirror table td,
  .ProseMirror table th {
    border: 2px solid #374151 !important;
    box-sizing: border-box !important;
    min-width: 1em !important;
    padding: 3px 5px !important;
    position: relative !important;
    vertical-align: top !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror table td {
    background-color: #ffffff !important;
  }
  
  .ProseMirror table th {
    background-color: #f3e8ff !important;
    font-weight: bold !important;
    text-align: center !important;
  }
  
  .ProseMirror table .selectedCell:after {
    background: rgba(200, 200, 255, 0.4);
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
    background-color: #adf;
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
  
  .ProseMirror blockquote {
    border-left: 4px solid #3b82f6;
    background-color: #eff6ff;
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin: 1rem 0;
    color: #374151;
    border-radius: 0.25rem;
  }
  
  .ProseMirror pre {
    background-color: #111827;
    color: #f3f4f6;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    border: 1px solid #374151;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .ProseMirror code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
  }
  
  .ProseMirror pre code {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }
  
  .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.25;
  }
  
  .ProseMirror h1 { font-size: 2rem; }
  .ProseMirror h2 { font-size: 1.5rem; }
  .ProseMirror h3 { font-size: 1.25rem; }
  .ProseMirror h4 { font-size: 1.125rem; }
  .ProseMirror h5 { font-size: 1rem; }
  .ProseMirror h6 { font-size: 0.875rem; }
  
  .ProseMirror p {
    margin-bottom: 1rem;
    line-height: 1.75;
  }
  
  .ProseMirror ul, .ProseMirror ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    list-style-position: outside;
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
  
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .ProseMirror a {
    color: #3b82f6;
    text-decoration: underline;
  }
  
  .ProseMirror a:hover {
    color: #2563eb;
  }
  
  .ProseMirror mark {
    background-color: #fef3c7;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    border: 1px solid #f59e0b;
  }
`;

export const tiptapPreviewStyles = `
  .ProseMirror {
    outline: none;
    max-width: 100%;
    color: #ffffff;
  }
  
  .ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  
  .ProseMirror table {
    border-collapse: collapse !important;
    margin: 0 !important;
    overflow: hidden !important;
    table-layout: fixed !important;
    width: 100% !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  
  .ProseMirror table td,
  .ProseMirror table th {
    border: 2px solid #374151 !important;
    box-sizing: border-box !important;
    min-width: 1em !important;
    padding: 3px 5px !important;
    position: relative !important;
    vertical-align: top !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror table td {
    background-color: #ffffff !important;
  }
  
  .ProseMirror table th {
    background-color: #f3e8ff !important;
    font-weight: bold !important;
    text-align: center !important;
  }
  
  .ProseMirror table .selectedCell:after {
    background: rgba(200, 200, 255, 0.4);
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
    background-color: #adf;
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
  
  .ProseMirror blockquote {
    border-left: 4px solid #3b82f6;
    background-color: #eff6ff;
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin: 1rem 0;
    color: #374151;
    border-radius: 0.25rem;
  }
  
  .ProseMirror pre {
    background-color: #111827;
    color: #f3f4f6;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    border: 1px solid #374151;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .ProseMirror code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
  }
  
  .ProseMirror pre code {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }
  
  .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.25;
    color: #ffffff;
  }
  
  .ProseMirror h1 { font-size: 2rem; }
  .ProseMirror h2 { font-size: 1.5rem; }
  .ProseMirror h3 { font-size: 1.25rem; }
  .ProseMirror h4 { font-size: 1.125rem; }
  .ProseMirror h5 { font-size: 1rem; }
  .ProseMirror h6 { font-size: 0.875rem; }
  
  .ProseMirror p {
    margin-bottom: 1rem;
    line-height: 1.75;
    color: #ffffff;
  }
  
  .ProseMirror ul, .ProseMirror ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    color: #ffffff;
  }
  
  .ProseMirror li {
    margin-bottom: 0.25rem;
    color: #ffffff;
  }
  
  .ProseMirror table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin: 1rem 0 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  
  .ProseMirror th, .ProseMirror td {
    border: 1px solid #374151 !important;
    padding: 0.5rem !important;
    text-align: left !important;
    color: #1f2937 !important;
  }
  
  .ProseMirror td {
    background-color: #ffffff !important;
  }
  
  .ProseMirror th {
    background-color: #f3e8ff !important;
    font-weight: 600 !important;
    text-align: center !important;
  }
  
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .ProseMirror a {
    color: #3b82f6;
    text-decoration: underline;
  }
  
  .ProseMirror a:hover {
    color: #2563eb;
  }
  
  .ProseMirror mark {
    background-color: #fef3c7;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    border: 1px solid #f59e0b;
  }
`; 