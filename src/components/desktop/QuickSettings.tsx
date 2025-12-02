import { useWindows } from '@/contexts/WindowContext';
import { 
  Wifi, 
  Bluetooth, 
  Smartphone, 
  Moon, 
  Share2, 
  Plane,
  Settings,
  Sun,
  Volume2,
  Battery
} from 'lucide-react';

const toggles = [
  { id: 'wifiEnabled', label: '127.0.0.1', icon: Wifi },
  { id: 'bluetoothEnabled', label: 'Bluetooth', icon: Bluetooth },
  { id: 'hotspotEnabled', label: 'Mobile hotspot', icon: Smartphone },
  { id: 'nightLightEnabled', label: 'Night light', icon: Moon },
  { id: 'nearbySharingEnabled', label: 'Nearby sharing', icon: Share2 },
  { id: 'airplaneModeEnabled', label: 'Airplane mode', icon: Plane },
] as const;

export function QuickSettings() {
  const { state, dispatch } = useWindows();

  const toggleSetting = (key: typeof toggles[number]['id']) => {
    dispatch({
      type: 'UPDATE_SYSTEM',
      payload: { [key]: !state.system[key] },
    });
  };

  const openSettings = () => {
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
  };

  return (
    <div 
      className="absolute bottom-14 right-2 w-[360px] win-panel-lg animate-scale-in p-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Toggle Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {toggles.map(toggle => {
          const Icon = toggle.icon;
          const isActive = state.system[toggle.id];
          return (
            <button
              key={toggle.id}
              onClick={() => toggleSetting(toggle.id)}
              className={`win-toggle ${isActive ? 'active' : 'bg-secondary'}`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs truncate w-full text-center">{toggle.label}</span>
            </button>
          );
        })}
      </div>

      {/* Brightness */}
      <div className="flex items-center gap-3 mb-3 p-2">
        <Sun className="w-5 h-5 text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="100"
          value={state.system.brightness}
          onChange={(e) => dispatch({ type: 'UPDATE_SYSTEM', payload: { brightness: Number(e.target.value) } })}
          className="flex-1 accent-primary h-1"
          title={`Brightness: ${state.system.brightness}%`}
        />
        <span className="text-xs text-muted-foreground w-8">{state.system.brightness}%</span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 mb-4 p-2">
        <Volume2 className="w-5 h-5 text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="100"
          value={state.system.volume}
          onChange={(e) => dispatch({ type: 'UPDATE_SYSTEM', payload: { volume: Number(e.target.value) } })}
          className="flex-1 accent-primary h-1"
          title={`Volume: ${state.system.volume}%`}
        />
        <span className="text-xs text-muted-foreground w-8">{state.system.volume}%</span>
      </div>

      {/* Battery & Settings */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-sm">
          <Battery className="w-5 h-5" />
          <span>83%</span>
        </div>
        <button
          onClick={openSettings}
          className="p-2 rounded-md hover:bg-muted"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
