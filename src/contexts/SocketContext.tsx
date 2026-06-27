import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { fakeSocket } from '../sockets/fakeSocket';
import type { ActivityFeedItem } from '../types';

interface SocketContextType {
  connected: boolean;
  activityFeed: ActivityFeedItem[];
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback?: (...args: unknown[]) => void) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const feedRef = useRef(activityFeed);
  feedRef.current = activityFeed;

  useEffect(() => {
    fakeSocket.startSimulation();
    setConnected(true);

    const onConnect = () => setConnected(true);
    const onFeed = (data: unknown) => {
      const item = data as ActivityFeedItem;
      setActivityFeed(prev => [item, ...prev].slice(0, 50));
    };

    fakeSocket.on('connection-status', onConnect);
    fakeSocket.on('activity-feed', onFeed);

    return () => {
      fakeSocket.off('connection-status', onConnect);
      fakeSocket.off('activity-feed', onFeed);
      fakeSocket.disconnect();
    };
  }, []);

  const on = useCallback((event: string, callback: (...args: unknown[]) => void) => {
    fakeSocket.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    fakeSocket.off(event, callback);
  }, []);

  return (
    <SocketContext.Provider value={{ connected, activityFeed, on, off }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
}
