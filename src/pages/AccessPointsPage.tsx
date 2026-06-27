import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Wifi, Server, RefreshCw } from 'lucide-react';
import type { AccessPoint, Location } from '../types';

export function AccessPointsPage() {
  const [aps, setAps] = useState<AccessPoint[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { on, off } = useSocket();

  const load = useCallback(async () => {
    const [a, l] = await Promise.all([api.getAccessPoints(), api.getLocations()]);
    setAps(a); setLocations(l);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const handler = () => load();
    on('ap-status', handler);
    return () => off('ap-status', handler);
  }, [on, off, load]);

  const getLocationName = (id: number) => locations.find(l => l.id_ubicacion === id)?.nombre_ubicacion ?? 'N/A';

  const statusConfig = {
    online: { label: 'Online', variant: 'success' as const, dot: 'bg-emerald-500 animate-pulse' },
    mantenimiento: { label: 'Mantenimiento', variant: 'warning' as const, dot: 'bg-amber-500' },
    offline: { label: 'Offline', variant: 'danger' as const, dot: 'bg-red-500' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Wifi className="w-6 h-6" /> Access Points</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{aps.length} APs registrados</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {aps.map(ap => {
          const s = statusConfig[ap.estado];
          return (
            <Card key={ap.id_ap} className={`border-l-4 ${ap.estado === 'online' ? 'border-l-emerald-500' : ap.estado === 'mantenimiento' ? 'border-l-amber-500' : 'border-l-red-500'}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ap.estado === 'online' ? 'bg-emerald-100 dark:bg-emerald-900/30' : ap.estado === 'mantenimiento' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <Server className={`w-5 h-5 ${ap.estado === 'online' ? 'text-emerald-600 dark:text-emerald-400' : ap.estado === 'mantenimiento' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{ap.nombre_ap}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{ap.ip}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{getLocationName(ap.id_ubicacion)}</p>
                <div className="flex items-center justify-between">
                  <Badge variant={s.variant} dot>{s.label}</Badge>
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
