import { useWindows } from '@/contexts/WindowContext';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { StartMenu } from './StartMenu';
import { QuickSettings } from './QuickSettings';
import { NotificationSidebar } from './NotificationSidebar';
import { ContextMenu } from './ContextMenu';
import { useState, useCallback, useEffect } from 'react';

export function Desktop() {
  const { state, dispatch } = useWindows();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleDesktopClick = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL_PANELS' });
    closeContextMenu();
  }, [dispatch, closeContextMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_ALL_PANELS' });
        closeContextMenu();
      }
      if (e.metaKey || e.key === 'Meta') {
        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          dispatch({ type: 'MINIMIZE_ALL' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, closeContextMenu]);

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative select-none"
      style={{
        backgroundImage: `url(${state.system.wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {/* Windows */}
      {state.windows.map(window => (
        !window.isMinimized && (
          <Window key={window.id} window={window} />
        )
      ))}

      {/* Panels */}
      {state.startMenuOpen && <StartMenu />}
      {state.quickSettingsOpen && <QuickSettings />}
      {state.notificationSidebarOpen && <NotificationSidebar />}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={closeContextMenu}
          type="desktop"
        />
      )}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
