import { useState } from 'react';

export function Notepad() {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled');

  const handleNew = () => {
    setContent('');
    setFileName('Untitled');
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setContent(e.target?.result as string);
          setFileName(file.name);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Menu bar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-border text-sm">
        <div className="relative group">
          <button className="px-2 py-1 rounded hover:bg-muted">File</button>
          <div className="absolute left-0 top-full hidden group-hover:block win-panel py-1 min-w-[150px] z-10">
            <button 
              onClick={handleNew}
              className="w-full px-3 py-1.5 text-left hover:bg-muted flex items-center justify-between"
            >
              New <span className="text-xs text-muted-foreground">Ctrl+N</span>
            </button>
            <button 
              onClick={handleOpen}
              className="w-full px-3 py-1.5 text-left hover:bg-muted flex items-center justify-between"
            >
              Open... <span className="text-xs text-muted-foreground">Ctrl+O</span>
            </button>
            <button 
              onClick={handleSave}
              className="w-full px-3 py-1.5 text-left hover:bg-muted flex items-center justify-between"
            >
              Save <span className="text-xs text-muted-foreground">Ctrl+S</span>
            </button>
            <button 
              onClick={handleSave}
              className="w-full px-3 py-1.5 text-left hover:bg-muted"
            >
              Save As...
            </button>
          </div>
        </div>
        <div className="relative group">
          <button className="px-2 py-1 rounded hover:bg-muted">Edit</button>
          <div className="absolute left-0 top-full hidden group-hover:block win-panel py-1 min-w-[150px] z-10">
            <button className="w-full px-3 py-1.5 text-left hover:bg-muted flex items-center justify-between">
              Undo <span className="text-xs text-muted-foreground">Ctrl+Z</span>
            </button>
            <button className="w-full px-3 py-1.5 text-left hover:bg-muted flex items-center justify-between">
              Cut <span className="text-xs text-muted-foreground">Ctrl+X</span>
            </button>
            <button className="w-full px-3 py-1.5 text-left hover:bg-muted flex items-center justify-between">
              Copy <span className="text-xs text-muted-foreground">Ctrl+C</span>
            </button>
            <button className="w-full px-3 py-1.5 text-left hover:bg-muted flex items-center justify-between">
              Paste <span className="text-xs text-muted-foreground">Ctrl+V</span>
            </button>
          </div>
        </div>
        <button className="px-2 py-1 rounded hover:bg-muted">View</button>
      </div>

      {/* Text area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full p-3 resize-none outline-none bg-transparent font-mono text-sm leading-relaxed"
        placeholder="Start typing..."
        spellCheck={false}
      />

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-border text-xs text-muted-foreground">
        <span>
          Ln {content.split('\n').length}, Col {content.split('\n').pop()?.length || 0}
        </span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
