import { useWindows } from '@/contexts/WindowContext';
import { useState, useEffect } from 'react';
import { BellOff, Bell, ChevronDown, ChevronUp, X, Mail, Calendar, Store } from 'lucide-react';

const mockNotifications = [
  { id: 1, app: 'Mail', icon: Mail, title: 'New email from John', message: 'Hey, can you review the document?', time: '10:30 AM' },
  { id: 2, app: 'Calendar', icon: Calendar, title: 'Meeting in 30 minutes', message: 'Team standup - Conference Room A', time: '9:45 AM' },
  { id: 3, app: 'Store', icon: Store, title: 'App update available', message: 'Visual Studio Code has an update', time: 'Yesterday' },
];

export function NotificationSidebar() {
  const { state, dispatch } = useWindows();
  const [time, setTime] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDateLine = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const d = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    return `${day}, ${d} ${month}`;
  };

  const toggleDnd = () => {
    dispatch({ type: 'UPDATE_SYSTEM', payload: { dndEnabled: !state.system.dndEnabled } });
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(time);
  const today = time.getDate();

  return (
    <div 
      className="absolute top-0 right-0 bottom-12 w-[380px] bg-win-panel border-l border-win-panel-border animate-slide-right overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <span className="font-semibold">Notifications</span>
        <button
          onClick={toggleDnd}
          className="p-2 rounded-md hover:bg-muted"
          title={state.system.dndEnabled ? 'Do Not Disturb On' : 'Do Not Disturb Off'}
        >
          {state.system.dndEnabled ? (
            <BellOff className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Time Box */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-light">{formatTime(time)}</div>
            <div className="text-sm text-muted-foreground">{formatDateLine(time)}</div>
          </div>
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="p-2 rounded-md hover:bg-muted"
          >
            {calendarOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Calendar */}
        {calendarOpen && (
          <div className="mt-4 animate-fade-in">
            <div className="text-sm font-medium mb-2">
              {time.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="p-1 text-muted-foreground">{d}</div>
              ))}
              {days.map((day, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded-full cursor-pointer hover:bg-muted ${
                    day === today ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="flex-1 overflow-auto p-4">
        {notifications.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Today</span>
              <button
                onClick={clearAll}
                className="text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-2">
              {notifications.map(notification => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className="p-3 bg-secondary rounded-lg group relative"
                  >
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{notification.app}</span>
                          <span className="text-xs text-muted-foreground">• {notification.time}</span>
                        </div>
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{notification.message}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Bell className="w-12 h-12 mb-2 opacity-50" />
            <span>No new notifications</span>
          </div>
        )}
      </div>
    </div>
  );
}
