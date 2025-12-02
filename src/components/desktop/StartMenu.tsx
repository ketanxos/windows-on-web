import { useWindows } from '@/contexts/WindowContext';
import { 
  Folder, 
  FileText, 
  Settings, 
  Calculator, 
  Globe, 
  Music,
  Image,
  Mail,
  Calendar,
  Store,
  Power,
  User
} from 'lucide-react';

const pinnedApps = [
  { id: 'explorer', title: 'File Explorer', icon: Folder, component: 'FileExplorer' },
  { id: 'notepad', title: 'Notepad', icon: FileText, component: 'Notepad' },
  { id: 'settings', title: 'Settings', icon: Settings, component: 'Settings' },
  { id: 'calculator', title: 'Calculator', icon: Calculator, component: 'Calculator' },
  { id: 'browser', title: 'Edge', icon: Globe, component: 'FileExplorer' },
  { id: 'music', title: 'Music', icon: Music, component: 'FileExplorer' },
  { id: 'photos', title: 'Photos', icon: Image, component: 'FileExplorer' },
  { id: 'mail', title: 'Mail', icon: Mail, component: 'FileExplorer' },
  { id: 'calendar', title: 'Calendar', icon: Calendar, component: 'FileExplorer' },
  { id: 'store', title: 'Store', icon: Store, component: 'FileExplorer' },
];

const recommendedItems = [
  { title: 'Document.docx', subtitle: 'Yesterday' },
  { title: 'Project Files', subtitle: '2 days ago' },
  { title: 'presentation.pptx', subtitle: 'Last week' },
  { title: 'notes.txt', subtitle: 'Last week' },
];

export function StartMenu() {
  const { dispatch } = useWindows();

  const openApp = (app: typeof pinnedApps[0]) => {
    dispatch({
      type: 'OPEN_WINDOW',
      payload: {
        id: app.id + '-' + Date.now(),
        title: app.title,
        icon: app.id,
        x: 100 + Math.random() * 200,
        y: 50 + Math.random() * 100,
        width: app.id === 'calculator' ? 320 : 800,
        height: app.id === 'calculator' ? 500 : 600,
        isMinimized: false,
        isMaximized: false,
        component: app.component,
      },
    });
  };

  return (
    <div 
      className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[640px] win-panel-lg animate-scale-in overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-secondary rounded-full">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search for apps, settings, and documents"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Pinned */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold">Pinned</span>
          <button className="text-xs px-3 py-1 rounded bg-secondary hover:bg-muted">
            All apps &rarr;
          </button>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {pinnedApps.map(app => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => openApp(app)}
                className="flex flex-col items-center gap-1 p-3 rounded-md hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-center truncate w-full">{app.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold">Recommended</span>
          <button className="text-xs px-3 py-1 rounded bg-secondary hover:bg-muted">
            More &rarr;
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {recommendedItems.map((item, i) => (
            <button
              key={i}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors text-left"
            >
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/50">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
          <User className="w-5 h-5" />
          <span className="text-sm">User</span>
        </button>
        <button className="p-2 rounded-md hover:bg-muted">
          <Power className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
