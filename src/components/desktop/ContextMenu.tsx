import { useWindows } from '@/contexts/WindowContext';
import { RefreshCw, Monitor, FolderPlus, FileText, Settings } from 'lucide-react';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
  type: 'desktop' | 'taskbar' | 'file';
}

export function ContextMenu({ x, y, onClose, type }: Props) {
  const { dispatch } = useWindows();

  const openTaskManager = () => {
    dispatch({
      type: 'OPEN_WINDOW',
      payload: {
        id: 'taskmanager-' + Date.now(),
        title: 'Task Manager',
        icon: 'taskmanager',
        x: 200,
        y: 100,
        width: 600,
        height: 400,
        isMinimized: false,
        isMaximized: false,
        component: 'TaskManager',
      },
    });
    onClose();
  };

  const openSettings = (tab?: string) => {
    dispatch({
      type: 'OPEN_WINDOW',
      payload: {
        id: 'settings-' + Date.now(),
        title: 'Settings',
        icon: 'settings',
        x: 200,
        y: 100,
        width: 900,
        height: 600,
        isMinimized: false,
        isMaximized: false,
        component: 'Settings',
      },
    });
    onClose();
  };

  const desktopItems = [
    { label: 'View', icon: Monitor, submenu: true },
    { label: 'Sort by', submenu: true },
    { divider: true },
    { label: 'Refresh', icon: RefreshCw, onClick: () => { onClose(); } },
    { divider: true },
    { label: 'New', icon: FolderPlus, submenu: true },
    { divider: true },
    { label: 'Display settings', icon: Monitor, onClick: () => openSettings() },
    { label: 'Personalize', onClick: () => openSettings() },
  ];

  const taskbarItems = [
    { label: 'Task Manager', onClick: openTaskManager },
    { label: 'Taskbar settings', onClick: () => openSettings() },
  ];

  const items = type === 'taskbar' ? taskbarItems : desktopItems;

  // Adjust position to keep menu in viewport
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  return (
    <>
      <div 
        className="fixed inset-0 z-50" 
        onClick={onClose}
      />
      <div
        className="fixed z-50 min-w-[200px] win-panel py-1 animate-scale-in"
        style={{ left: adjustedX, top: adjustedY }}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item, i) => {
          if ('divider' in item && item.divider) {
            return <div key={i} className="my-1 border-t border-border" />;
          }
          return (
            <button
              key={i}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted text-left"
            >
              {'icon' in item && item.icon && <item.icon className="w-4 h-4 text-muted-foreground" />}
              <span className="flex-1">{item.label}</span>
              {'submenu' in item && item.submenu && (
                <span className="text-muted-foreground">›</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
