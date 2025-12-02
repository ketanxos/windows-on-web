import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  RefreshCw,
  Search,
  Folder,
  FileText,
  Image,
  Music,
  Video,
  Download,
  Star,
  Home,
  HardDrive,
  MoreHorizontal
} from 'lucide-react';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  icon: typeof Folder;
  modified: string;
  size?: string;
}

const quickAccess = [
  { name: 'Home', icon: Home },
  { name: 'Desktop', icon: Folder },
  { name: 'Documents', icon: Folder },
  { name: 'Downloads', icon: Download },
  { name: 'Pictures', icon: Image },
  { name: 'Music', icon: Music },
  { name: 'Videos', icon: Video },
];

const mockFiles: FileItem[] = [
  { name: 'Documents', type: 'folder', icon: Folder, modified: '11/28/2024' },
  { name: 'Downloads', type: 'folder', icon: Download, modified: '11/27/2024' },
  { name: 'Pictures', type: 'folder', icon: Image, modified: '11/25/2024' },
  { name: 'Music', type: 'folder', icon: Music, modified: '11/20/2024' },
  { name: 'Videos', type: 'folder', icon: Video, modified: '11/15/2024' },
  { name: 'notes.txt', type: 'file', icon: FileText, modified: '11/28/2024', size: '4 KB' },
  { name: 'presentation.pptx', type: 'file', icon: FileText, modified: '11/26/2024', size: '2.5 MB' },
  { name: 'report.docx', type: 'file', icon: FileText, modified: '11/24/2024', size: '156 KB' },
];

export function FileExplorer() {
  const [currentPath, setCurrentPath] = useState(['This PC', 'Local Disk (C:)', 'Users', 'User']);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <button className="p-1.5 rounded hover:bg-muted disabled:opacity-50">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded hover:bg-muted disabled:opacity-50">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded hover:bg-muted">
          <ChevronUp className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded hover:bg-muted">
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <div className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-secondary rounded text-sm">
          {currentPath.map((segment, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && <ChevronRight className="w-3 h-3 mx-1 text-muted-foreground" />}
              <button className="hover:text-primary">{segment}</button>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search User"
            className="bg-transparent text-sm outline-none w-32"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-border p-2 overflow-auto">
          <div className="mb-4">
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
              <Star className="w-4 h-4" />
              Quick access
            </div>
            {quickAccess.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted text-left"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {item.name}
                </button>
              );
            })}
          </div>

          <div>
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
              <HardDrive className="w-4 h-4" />
              This PC
            </div>
            <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted text-left">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              Local Disk (C:)
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-win-surface border-b border-border">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Date modified</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Size</th>
              </tr>
            </thead>
            <tbody>
              {mockFiles.map(file => {
                const Icon = file.icon;
                return (
                  <tr
                    key={file.name}
                    className={`cursor-pointer hover:bg-muted ${
                      selectedFile === file.name ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedFile(file.name)}
                    onDoubleClick={() => {
                      if (file.type === 'folder') {
                        setCurrentPath([...currentPath, file.name]);
                      }
                    }}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        {file.name}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{file.modified}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {file.type === 'folder' ? 'File folder' : 'File'}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{file.size || ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-border text-xs text-muted-foreground">
        <span>{mockFiles.length} items</span>
        <button className="p-1 hover:bg-muted rounded">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
