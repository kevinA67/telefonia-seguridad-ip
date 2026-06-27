import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import { DataTable } from '../components/ui/DataTable';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Phone, PhoneCall, PhoneMissed, PhoneOff, Download } from 'lucide-react';
import type { Call } from '../types';

export function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const { on, off } = useSocket();
  const perPage = 10;

  const load = useCallback(async () => {
    setCalls(await api.getCalls());
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const handler = () => load();
    on('new-call', handler);
    on('call-ended', handler);
    return () => { off('new-call', handler); off('call-ended', handler); };
  }, [on, off, load]);

  const filtered = calls.filter(c => {
    const matchSearch = `${c.origen_extension} ${c.destino_extension} ${c.estado}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'todos' || c.estado === filterStatus;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const formatDuration = (s: number) => {
    if (s === 0) return '--:--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const statusConfig = {
    activa: { label: 'Activa', variant: 'success' as const, icon: PhoneCall },
    finalizada: { label: 'Finalizada', variant: 'info' as const, icon: PhoneOff },
    perdida: { label: 'Perdida', variant: 'danger' as const, icon: PhoneMissed },
  };

  const exportToCSV = () => {
    const headers = ['Origen', 'Destino', 'Duración (s)', 'Estado', 'Fecha Inicio', 'Fecha Fin'];
    const rows = filtered.map(c => [c.origen_extension, c.destino_extension, c.duracion_segundos, c.estado, c.fecha_inicio, c.fecha_fin ?? '']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'llamadas.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Phone className="w-6 h-6" /> Historial de Llamadas</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{calls.length} llamadas registradas</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {(['todos', 'activa', 'finalizada', 'perdida'] as const).map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            {s === 'todos' ? 'Todas' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <Card>
        <CardContent>
          <DataTable
            data={paged as unknown as Record<string, unknown>[]}
            searchValue={search}
            onSearchChange={(v: string) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Buscar por extensión..."
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            columns={[
              { key: 'origen_extension', label: 'Origen', render: (item: Record<string, unknown>) => <span className="font-mono font-medium">{(item as unknown as Call).origen_extension}</span> },
              { key: 'destino_extension', label: 'Destino', render: (item: Record<string, unknown>) => <span className="font-mono font-medium">{(item as unknown as Call).destino_extension}</span> },
              { key: 'duracion_segundos', label: 'Duración', render: (item: Record<string, unknown>) => <span className="font-mono">{formatDuration((item as unknown as Call).duracion_segundos)}</span> },
              { key: 'fecha_inicio', label: 'Fecha', render: (item: Record<string, unknown>) => <span className="text-xs">{new Date((item as unknown as Call).fecha_inicio).toLocaleString('es-MX')}</span> },
              { key: 'estado', label: 'Estado', render: (item: Record<string, unknown>) => {
                const c = item as unknown as Call;
                const s = statusConfig[c.estado];
                const Icon = s.icon;
                return <Badge variant={s.variant} dot><Icon className="w-3 h-3" /> {s.label}</Badge>;
              }},
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
