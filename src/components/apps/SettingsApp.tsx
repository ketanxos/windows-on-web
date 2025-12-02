import { useState } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { 
  Palette, 
  Monitor, 
  Bell, 
  Shield, 
  Wifi, 
  User,
  ChevronRight,
  Search,
  Home,
  Check
} from 'lucide-react';

const categories = [
  { id: 'system', label: 'System', icon: Monitor },
  { id: 'personalization', label: 'Personalization', icon: Palette },
  { id: 'network', label: 'Network & internet', icon: Wifi },
  { id: 'accounts', label: 'Accounts', icon: User },
  { id: 'privacy', label: 'Privacy & security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function SettingsApp() {
  const { state, dispatch, wallpapers } = useWindows();
  const [activeCategory, setActiveCategory] = useState('personalization');

  const updateTheme = (theme: 'light' | 'dark' | 'auto') => {
    dispatch({ type: 'UPDATE_SYSTEM', payload: { theme } });
  };

  const updateWallpaper = (wallpaper: string) => {
    dispatch({ type: 'UPDATE_SYSTEM', payload: { wallpaper } });
  };

  const updateTaskbarAlignment = (alignment: 'center' | 'left') => {
    dispatch({ type: 'UPDATE_SYSTEM', payload: { taskbarAlignment: alignment } });
  };

  const resetToDefaults = () => {
    localStorage.removeItem('windows11-state');
    window.location.reload();
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4 overflow-auto">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Find a setting"
            className="bg-transparent text-sm outline-none flex-1"
          />
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveCategory('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
              activeCategory === 'home' ? 'bg-muted' : 'hover:bg-muted'
            }`}
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  activeCategory === cat.id ? 'bg-muted' : 'hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        {activeCategory === 'personalization' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold mb-6">Personalization</h1>

            {/* Theme */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Select a theme mode</h2>
              <div className="flex gap-4">
                {(['light', 'dark', 'auto'] as const).map(theme => (
                  <button
                    key={theme}
                    onClick={() => updateTheme(theme)}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                      state.system.theme === theme 
                        ? 'border-primary bg-primary/5' 
                        : 'border-transparent bg-secondary hover:bg-muted'
                    }`}
                  >
                    <div className={`w-16 h-12 rounded mb-2 ${
                      theme === 'light' ? 'bg-white border' : 
                      theme === 'dark' ? 'bg-gray-800' : 
                      'bg-gradient-to-r from-white to-gray-800'
                    }`} />
                    <span className="text-sm capitalize">{theme}</span>
                    {state.system.theme === theme && (
                      <Check className="w-4 h-4 text-primary mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Background</h2>
              <div className="grid grid-cols-4 gap-3">
                {wallpapers.map((wp, i) => (
                  <button
                    key={i}
                    onClick={() => updateWallpaper(wp)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                      state.system.wallpaper === wp ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={wp} alt={`Wallpaper ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Taskbar alignment */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Taskbar alignment</h2>
              <div className="flex gap-4">
                {(['center', 'left'] as const).map(alignment => (
                  <button
                    key={alignment}
                    onClick={() => updateTaskbarAlignment(alignment)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                      state.system.taskbarAlignment === alignment 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <span className="capitalize">{alignment}</span>
                    {state.system.taskbarAlignment === alignment && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div className="pt-6 border-t border-border">
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
              >
                Reset to defaults
              </button>
            </div>
          </div>
        )}

        {activeCategory !== 'personalization' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold mb-6">
              {categories.find(c => c.id === activeCategory)?.label || 'Settings'}
            </h1>
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-muted"
                >
                  <div>
                    <div className="font-medium">Setting option {i}</div>
                    <div className="text-sm text-muted-foreground">Description for this setting</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
