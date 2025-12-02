import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  component: string;
}

interface SystemState {
  theme: 'light' | 'dark' | 'auto';
  wallpaper: string;
  taskbarAlignment: 'center' | 'left';
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  hotspotEnabled: boolean;
  nightLightEnabled: boolean;
  nearbySharingEnabled: boolean;
  airplaneModeEnabled: boolean;
  brightness: number;
  volume: number;
  dndEnabled: boolean;
}

interface State {
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;
  system: SystemState;
  startMenuOpen: boolean;
  searchOpen: boolean;
  quickSettingsOpen: boolean;
  notificationSidebarOpen: boolean;
}

type Action =
  | { type: 'OPEN_WINDOW'; payload: Omit<WindowState, 'zIndex'> }
  | { type: 'CLOSE_WINDOW'; payload: string }
  | { type: 'MINIMIZE_WINDOW'; payload: string }
  | { type: 'MAXIMIZE_WINDOW'; payload: string }
  | { type: 'RESTORE_WINDOW'; payload: string }
  | { type: 'FOCUS_WINDOW'; payload: string }
  | { type: 'MOVE_WINDOW'; payload: { id: string; x: number; y: number } }
  | { type: 'RESIZE_WINDOW'; payload: { id: string; width: number; height: number } }
  | { type: 'TOGGLE_START_MENU' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'TOGGLE_QUICK_SETTINGS' }
  | { type: 'TOGGLE_NOTIFICATION_SIDEBAR' }
  | { type: 'CLOSE_ALL_PANELS' }
  | { type: 'MINIMIZE_ALL' }
  | { type: 'UPDATE_SYSTEM'; payload: Partial<SystemState> }
  | { type: 'LOAD_STATE'; payload: Partial<State> };

const defaultWallpapers = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&q=80',
  'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80',
];

const initialSystemState: SystemState = {
  theme: 'dark',
  wallpaper: defaultWallpapers[0],
  taskbarAlignment: 'center',
  wifiEnabled: true,
  bluetoothEnabled: false,
  hotspotEnabled: false,
  nightLightEnabled: false,
  nearbySharingEnabled: false,
  airplaneModeEnabled: false,
  brightness: 75,
  volume: 57,
  dndEnabled: false,
};

const initialState: State = {
  windows: [],
  activeWindowId: null,
  maxZIndex: 0,
  system: initialSystemState,
  startMenuOpen: false,
  searchOpen: false,
  quickSettingsOpen: false,
  notificationSidebarOpen: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const existingWindow = state.windows.find(w => w.id === action.payload.id);
      if (existingWindow) {
        return {
          ...state,
          windows: state.windows.map(w =>
            w.id === action.payload.id ? { ...w, isMinimized: false } : w
          ),
          activeWindowId: action.payload.id,
          maxZIndex: state.maxZIndex + 1,
        };
      }
      const newZIndex = state.maxZIndex + 1;
      return {
        ...state,
        windows: [...state.windows, { ...action.payload, zIndex: newZIndex }],
        activeWindowId: action.payload.id,
        maxZIndex: newZIndex,
        startMenuOpen: false,
        searchOpen: false,
      };
    }
    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.payload),
        activeWindowId: state.activeWindowId === action.payload ? null : state.activeWindowId,
      };
    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMinimized: true } : w
        ),
        activeWindowId: state.activeWindowId === action.payload ? null : state.activeWindowId,
      };
    case 'MAXIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMaximized: true } : w
        ),
      };
    case 'RESTORE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMaximized: false, isMinimized: false } : w
        ),
        activeWindowId: action.payload,
        maxZIndex: state.maxZIndex + 1,
      };
    case 'FOCUS_WINDOW': {
      const newZIndex = state.maxZIndex + 1;
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, zIndex: newZIndex, isMinimized: false } : w
        ),
        activeWindowId: action.payload,
        maxZIndex: newZIndex,
      };
    }
    case 'MOVE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, x: action.payload.x, y: action.payload.y } : w
        ),
      };
    case 'RESIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id
            ? { ...w, width: action.payload.width, height: action.payload.height }
            : w
        ),
      };
    case 'TOGGLE_START_MENU':
      return {
        ...state,
        startMenuOpen: !state.startMenuOpen,
        searchOpen: false,
        quickSettingsOpen: false,
        notificationSidebarOpen: false,
      };
    case 'TOGGLE_SEARCH':
      return {
        ...state,
        searchOpen: !state.searchOpen,
        startMenuOpen: false,
        quickSettingsOpen: false,
        notificationSidebarOpen: false,
      };
    case 'TOGGLE_QUICK_SETTINGS':
      return {
        ...state,
        quickSettingsOpen: !state.quickSettingsOpen,
        startMenuOpen: false,
        searchOpen: false,
        notificationSidebarOpen: false,
      };
    case 'TOGGLE_NOTIFICATION_SIDEBAR':
      return {
        ...state,
        notificationSidebarOpen: !state.notificationSidebarOpen,
        startMenuOpen: false,
        searchOpen: false,
        quickSettingsOpen: false,
      };
    case 'CLOSE_ALL_PANELS':
      return {
        ...state,
        startMenuOpen: false,
        searchOpen: false,
        quickSettingsOpen: false,
        notificationSidebarOpen: false,
      };
    case 'MINIMIZE_ALL':
      return {
        ...state,
        windows: state.windows.map(w => ({ ...w, isMinimized: true })),
        activeWindowId: null,
      };
    case 'UPDATE_SYSTEM':
      return {
        ...state,
        system: { ...state.system, ...action.payload },
      };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const WindowContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  wallpapers: string[];
} | null>(null);

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted state
  useEffect(() => {
    const saved = localStorage.getItem('windows11-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: { system: { ...initialSystemState, ...parsed.system } } });
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
  }, []);

  // Persist system state
  useEffect(() => {
    localStorage.setItem('windows11-state', JSON.stringify({ system: state.system }));
  }, [state.system]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (state.system.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.system.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.system.theme]);

  return (
    <WindowContext.Provider value={{ state, dispatch, wallpapers: defaultWallpapers }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
}
