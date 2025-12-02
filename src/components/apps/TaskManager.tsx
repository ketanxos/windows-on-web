import { useWindows } from '@/contexts/WindowContext';
import { X } from 'lucide-react';

export function TaskManager() {
  const { state, dispatch } = useWindows();

  const endTask = (windowId: string) => {
    dispatch({ type: 'CLOSE_WINDOW', payload: windowId });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary">
          Processes
        </button>
        <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          Performance
        </button>
        <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          Details
        </button>
      </div>

      {/* Process list */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-win-surface">
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">CPU</th>
              <th className="px-4 py-2 font-medium">Memory</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {state.windows.map(window => (
              <tr 
                key={window.id} 
                className="hover:bg-muted border-b border-border/50"
              >
                <td className="px-4 py-2">{window.title}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    window.isMinimized 
                      ? 'bg-muted text-muted-foreground' 
                      : 'bg-green-500/10 text-green-600'
                  }`}>
                    {window.isMinimized ? 'Suspended' : 'Running'}
                  </span>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {Math.floor(Math.random() * 5)}%
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {Math.floor(Math.random() * 100 + 20)} MB
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => endTask(window.id)}
                    className="p-1 rounded hover:bg-destructive hover:text-destructive-foreground"
                    title="End task"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {state.windows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No running applications
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <span>{state.windows.length} processes</span>
        <div className="flex gap-4">
          <span>CPU: {Math.floor(Math.random() * 30 + 5)}%</span>
          <span>Memory: {Math.floor(Math.random() * 40 + 30)}%</span>
        </div>
      </div>
    </div>
  );
}
