import { useWindows, WindowState } from '@/contexts/WindowContext';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { FileExplorer } from '../apps/FileExplorer';
import { Notepad } from '../apps/Notepad';
import { SettingsApp } from '../apps/SettingsApp';
import { Calculator } from '../apps/Calculator';
import { TaskManager } from '../apps/TaskManager';

const appComponents: Record<string, React.ComponentType> = {
  FileExplorer,
  Notepad,
  Settings: SettingsApp,
  Calculator,
  TaskManager,
};

interface Props {
  window: WindowState;
}

export function Window({ window }: Props) {
  const { dispatch } = useWindows();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.win-control')) return;
    dispatch({ type: 'FOCUS_WINDOW', payload: window.id });
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.x,
      y: e.clientY - window.y,
    });
  }, [dispatch, window.id, window.x, window.y]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !window.isMaximized) {
      dispatch({
        type: 'MOVE_WINDOW',
        payload: {
          id: window.id,
          x: Math.max(0, e.clientX - dragOffset.x),
          y: Math.max(0, e.clientY - dragOffset.y),
        },
      });
    }
  }, [isDragging, window.isMaximized, window.id, dragOffset, dispatch]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const AppComponent = appComponents[window.component];

  const style = window.isMaximized
    ? { top: 0, left: 0, right: 0, bottom: 48, width: '100%', height: 'calc(100% - 48px)' }
    : { top: window.y, left: window.x, width: window.width, height: window.height };

  return (
    <div
      ref={windowRef}
      className="win-window animate-scale-in"
      style={{
        ...style,
        zIndex: window.zIndex,
      }}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: 'FOCUS_WINDOW', payload: window.id });
      }}
    >
      {/* Title Bar */}
      <div 
        className="win-titlebar border-b border-border"
        onMouseDown={handleMouseDown}
        onDoubleClick={() => {
          if (window.isMaximized) {
            dispatch({ type: 'RESTORE_WINDOW', payload: window.id });
          } else {
            dispatch({ type: 'MAXIMIZE_WINDOW', payload: window.id });
          }
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-win-surface-foreground">{window.title}</span>
        </div>
        <div className="flex">
          <button
            className="win-control"
            onClick={() => dispatch({ type: 'MINIMIZE_WINDOW', payload: window.id })}
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            className="win-control"
            onClick={() => {
              if (window.isMaximized) {
                dispatch({ type: 'RESTORE_WINDOW', payload: window.id });
              } else {
                dispatch({ type: 'MAXIMIZE_WINDOW', payload: window.id });
              }
            }}
            aria-label={window.isMaximized ? 'Restore' : 'Maximize'}
          >
            {window.isMaximized ? (
              <Maximize2 className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Square className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
          <button
            className="win-control close"
            onClick={() => dispatch({ type: 'CLOSE_WINDOW', payload: window.id })}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-win-surface text-win-surface-foreground" style={{ height: 'calc(100% - 32px)' }}>
        {AppComponent && <AppComponent />}
      </div>

      {/* Resize Handle */}
      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
          }}
        />
      )}
    </div>
  );
}
