import { useWindows } from '@/contexts/WindowContext';
import { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Settings, 
  Calculator,
  Search,
  Wifi,
  Volume2,
  Battery,
  ChevronUp
} from 'lucide-react';
import { ContextMenu } from './ContextMenu';

const pinnedApps = [
  { id: 'explorer', title: 'File Explorer', icon: Folder, component: 'FileExplorer' },
  { id: 'notepad', title: 'Notepad', icon: FileText, component: 'Notepad' },
  { id: 'settings', title: 'Settings', icon: Settings, component: 'Settings' },
  { id: 'calculator', title: 'Calculator', icon: Calculator, component: 'Calculator' },
];

export function Taskbar() {
  const { state, dispatch } = useWindows();
  const [time, setTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  const formatFullDate = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const rest = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    return `${day}, ${rest}\n${timeStr} (Local time)`;
  };

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

  const handleTaskbarContext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const isAppActive = (appId: string) => {
    return state.windows.some(w => w.icon === appId && !w.isMinimized);
  };

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 h-12 bg-win-taskbar/95 backdrop-blur-xl flex items-center px-2"
      onContextMenu={handleTaskbarContext}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Centered content */}
      <div className={`flex items-center gap-1 ${state.system.taskbarAlignment === 'center' ? 'mx-auto' : ''}`}>
        {/* Windows Button */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_START_MENU' })}
          className={`win-taskbar-item ${state.startMenuOpen ? 'active' : ''}`}
          aria-label="Start menu"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-win-taskbar-foreground" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
        </button>

        {/* Search */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SEARCH' })}
          className="win-taskbar-item"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-win-taskbar-foreground" />
        </button>

        {/* Pinned Apps */}
        {pinnedApps.map(app => {
          const Icon = app.icon;
          const active = isAppActive(app.id);
          return (
            <button
              key={app.id}
              onClick={() => openApp(app)}
              className={`win-taskbar-item relative ${active ? 'active' : ''}`}
              title={app.title}
            >
              <Icon className="w-5 h-5 text-win-taskbar-foreground" />
              {active && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* System Tray - Right side */}
      <div className="absolute right-2 flex items-center gap-1">
        {/* Hidden icons indicator */}
        <button className="win-taskbar-item w-6">
          <ChevronUp className="w-4 h-4 text-win-taskbar-foreground" />
        </button>

        {/* System icons group */}
        <div 
          className="flex items-center rounded-md hover:bg-white/10 cursor-pointer px-2 py-1"
          onClick={() => dispatch({ type: 'TOGGLE_QUICK_SETTINGS' })}
        >
          <div className="flex items-center gap-2" title={`127.0.0.1\nInternet Access`}>
            <Wifi className="w-4 h-4 text-win-taskbar-foreground" />
          </div>
          <div className="flex items-center gap-2 ml-2" title={`Speaker: ${state.system.volume}%`}>
            <Volume2 className="w-4 h-4 text-win-taskbar-foreground" />
          </div>
          <div className="flex items-center gap-2 ml-2" title="Battery status: 83% remaining">
            <Battery className="w-4 h-4 text-win-taskbar-foreground" />
          </div>
        </div>

        {/* Time & Date - sibling to system icons */}
        <button
          className="flex flex-col items-end px-2 py-1 rounded-md hover:bg-white/10 text-win-taskbar-foreground text-xs"
          onClick={() => dispatch({ type: 'TOGGLE_NOTIFICATION_SIDEBAR' })}
          title={formatFullDate(time)}
        >
          <span>{formatTime(time)}</span>
          <span>{formatDate(time)}</span>
        </button>

        {/* Show Desktop */}
        <div 
          className="w-1 h-10 hover:bg-primary/50 cursor-pointer rounded-sm"
          onClick={() => dispatch({ type: 'MINIMIZE_ALL' })}
          title="Show desktop"
        />
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)}
          type="taskbar"
        />
      )}
    </div>
  );
}
