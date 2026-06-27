import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Activity, Info, AlertTriangle, XCircle, AlertOctagon } from 'lucide-react';
import type { Event } from '../types';

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const { on, off } = useSocket();

  const load = useCallback(async () => {
    setEvents(await api.getEvents());
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const handler = () => load();
    on('new-event', handler);
    return () => off('new-event', handler);
  }, [on, off, load]);

  const tipoConfig = {
    informacion: { label: 'Información', variant: 'info' as const, icon: Info, color: 'bg-blue-500', line: 'border-blue-500' },
    advertencia: { label: 'Advertencia', variant: 'warning' as const, icon: AlertTriangle, color: 'bg-amber-500', line: 'border-amber-500' },
    error: { label: 'Error', variant: 'danger' as const, icon: XCircle, color: 'bg-red-500', line: 'border-red-500' },
    critico: { label: 'Crítico', variant: 'danger' as const, icon: AlertOctagon, color: 'bg-red-600', line: 'border-red-600' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Activity className="w-6 h-6" /> Timeline de Eventos</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{events.length} eventos registrados</p>
      </div>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-6">
          {events.map(event => {
            const config = tipoConfig[event.tipo];
            const Icon = config.icon;
            return (
              <div key={event.id_evento} className="relative flex gap-4 pl-2">
                <div className={`relative z-10 w-8 h-8 rounded-full ${config.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={config.variant}>{config.label}</Badge>
                          <span className="text-xs text-gray-400">#{event.id_evento}</span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white">{event.descripcion}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{new Date(event.fecha).toLocaleString('es-MX')}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
