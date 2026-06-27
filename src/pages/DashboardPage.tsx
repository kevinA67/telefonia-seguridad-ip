import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Users, Phone, Wifi, AlertTriangle,
  Clock, ArrowUpRight, ArrowDownRight,
  Radio, Zap, Server
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import type { DashboardStats, ActivityFeedItem, Call, Event, AccessPoint, User } from '../types';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

function MetricCard({ title, value, icon: Icon, trend, trendUp, color, subtitle }: {
  title: string; value: string | number; icon: typeof Users;
  trend?: string; trendUp?: boolean; color: string; subtitle?: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trend}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${color.replace('bg-', 'bg-gradient-to-r from-')} to-transparent opacity-50`} />
    </Card>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.map((v, i) => ({ v, i }))}>
          <defs>
            <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} fill={`url(#spark-${color})`} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [, setEvents] = useState<Event[]>([]);
  const [aps, setAps] = useState<AccessPoint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [feed, setFeed] = useState<ActivityFeedItem[]>([]);
  const [callsByHour, setCallsByHour] = useState<{hora: string; llamadas: number}[]>([]);
  const { on, off } = useSocket();

  const loadData = useCallback(async () => {
    const [s, c, e, a, u] = await Promise.all([
      api.getStats(), api.getCalls(), api.getEvents(), api.getAccessPoints(), api.getUsers()
    ]);
    setStats(s); setCalls(c); setEvents(e); setAps(a); setUsers(u);
    // Generate calls by hour
    const hours = Array.from({length: 24}, (_, i) => ({
      hora: `${String(i).padStart(2,'0')}:00`,
      llamadas: Math.floor(Math.random() * 15) + 1
    }));
    setCallsByHour(hours);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const onNewCall = () => loadData();
    const onCallEnded = () => loadData();
    const onNewEvent = () => loadData();
    const onApStatus = () => loadData();
    const onUserStatus = () => loadData();
    const onStatsUpdate = () => loadData();
    const onFeed = (data: unknown) => {
      const item = data as ActivityFeedItem;
      setFeed(prev => [item, ...prev].slice(0, 20));
    };

    on('new-call', onNewCall);
    on('call-ended', onCallEnded);
    on('new-event', onNewEvent);
    on('ap-status', onApStatus);
    on('user-status', onUserStatus);
    on('statistics-update', onStatsUpdate);
    on('activity-feed', onFeed);

    return () => {
      off('new-call', onNewCall);
      off('call-ended', onCallEnded);
      off('new-event', onNewEvent);
      off('ap-status', onApStatus);
      off('user-status', onUserStatus);
      off('statistics-update', onStatsUpdate);
      off('activity-feed', onFeed);
    };
  }, [on, off, loadData]);

  // Chart data
  const callsByBuilding = [
    { nombre: 'Rectoría', llamadas: 45 }, { nombre: 'Ingenierías', llamadas: 72 },
    { nombre: 'Sociales', llamadas: 38 }, { nombre: 'Biblioteca', llamadas: 56 },
    { nombre: 'Laboratorios', llamadas: 64 }, { nombre: 'Salud', llamadas: 41 },
  ];

  const usersByCareer = [
    { carrera: 'Ing. Sistemas', usuarios: 180 }, { carrera: 'Ing. Software', usuarios: 145 },
    { carrera: 'Derecho', usuarios: 120 }, { carrera: 'Medicina', usuarios: 95 },
    { carrera: 'Administración', usuarios: 110 }, { carrera: 'Arquitectura', usuarios: 85 },
  ];

  const apStatusData = [
    { name: 'Online', value: aps.filter(a => a.estado === 'online').length },
    { name: 'Mantenimiento', value: aps.filter(a => a.estado === 'mantenimiento').length },
    { name: 'Offline', value: aps.filter(a => a.estado === 'offline').length },
  ];

  const completedVsLost = [
    { name: 'Completadas', value: calls.filter(c => c.estado === 'finalizada').length },
    { name: 'Perdidas', value: calls.filter(c => c.estado === 'perdida').length },
    { name: 'Activas', value: calls.filter(c => c.estado === 'activa').length },
  ];

  const weeklyActivity = Array.from({length: 7}, (_, i) => ({
    day: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][i],
    llamadas: Math.floor(Math.random() * 80) + 20,
    eventos: Math.floor(Math.random() * 30) + 5,
  }));

  // Top 10
  const topUsers = [...users].sort(() => Math.random() - 0.5).slice(0, 5);
  const topAPs = [...aps].sort(() => Math.random() - 0.5).slice(0, 5);

  if (!stats) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Centro de Operaciones</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitoreo en tiempo real del sistema de telefonía</p>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-blue-500 animate-pulse" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Actualizando...</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <MetricCard title="Usuarios" value={stats.usuariosRegistrados} icon={Users} color="bg-blue-600" trend="+3 hoy" trendUp subtitle={`${stats.usuariosConectados} conectados`} />
        <MetricCard title="Conectados" value={stats.usuariosConectados} icon={Zap} color="bg-emerald-600" trend="+5%" trendUp subtitle="En línea ahora" />
        <MetricCard title="Llamadas Hoy" value={stats.llamadasHoy} icon={Phone} color="bg-purple-600" trend="+12%" trendUp subtitle={`${stats.llamadasActivas} activas`} />
        <MetricCard title="Duración Prom." value={`${Math.floor(stats.duracionPromedio/60)}m`} icon={Clock} color="bg-amber-600" trend="-8%" trendUp={false} subtitle={`${stats.duracionPromedio}s promedio`} />
        <MetricCard title="APs Activos" value={`${stats.apsActivos}/${aps.length}`} icon={Wifi} color="bg-cyan-600" subtitle={`${stats.apsOffline} fuera de línea`} />
        <MetricCard title="Eventos Críticos" value={stats.eventosCriticos} icon={AlertTriangle} color="bg-red-600" trend="-2" trendUp subtitle={`${stats.eventosHoy} eventos hoy`} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Llamadas por Hora</h3></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={callsByHour}>
                  <defs>
                    <linearGradient id="colorLlamadas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="hora" tick={{ fontSize: 10 }} stroke="#6B7280" interval={2} />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Area type="monotone" dataKey="llamadas" stroke="#3B82F6" fill="url(#colorLlamadas)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Estado de APs</h3></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={apStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {apStatusData.map((_, i) => <Cell key={i} fill={['#10B981', '#F59E0B', '#EF4444'][i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Llamadas por Edificio</h3></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callsByBuilding} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10 }} stroke="#6B7280" width={80} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Bar dataKey="llamadas" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Actividad Semanal</h3></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Bar dataKey="llamadas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="eventos" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Estado de Llamadas</h3></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={completedVsLost} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {completedVsLost.map((_, i) => <Cell key={i} fill={['#10B981', '#EF4444', '#3B82F6'][i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed + Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Actividad en Tiempo Real</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {feed.length === 0 && (
                <div className="p-4 text-center text-gray-400 text-sm">Esperando actividad...</div>
              )}
              {feed.map(item => (
                <div key={item.id} className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      item.tipo === 'llamada' ? 'bg-blue-500' :
                      item.tipo === 'usuario' ? 'bg-emerald-500' :
                      item.tipo === 'ap' ? 'bg-amber-500' :
                      item.tipo === 'sistema' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item.mensaje}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(item.fecha).toLocaleTimeString('es-MX')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Usuarios</h3></CardHeader>
          <CardContent className="p-0">
            {topUsers.map((u, i) => (
              <div key={u.id_usuario} className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {u.nombre[0]}{u.apellido[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{u.nombre} {u.apellido}</p>
                  <p className="text-xs text-gray-400">Ext. {u.extension}</p>
                </div>
                <MiniSparkline data={Array.from({length:7}, () => Math.floor(Math.random()*20))} color="#3B82F6" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Access Points</h3></CardHeader>
          <CardContent className="p-0">
            {topAPs.map((ap, i) => (
              <div key={ap.id_ap} className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                <Server className="w-5 h-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{ap.nombre_ap}</p>
                  <p className="text-xs text-gray-400">{ap.ip}</p>
                </div>
                <Badge variant={ap.estado === 'online' ? 'success' : ap.estado === 'mantenimiento' ? 'warning' : 'danger'} dot>
                  {ap.estado}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Users by career chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Usuarios por Carrera</h3></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersByCareer}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="carrera" tick={{ fontSize: 9 }} stroke="#6B7280" angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Bar dataKey="usuarios" radius={[4, 4, 0, 0]}>
                    {usersByCareer.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Actividad Reciente (Línea)</h3></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Line type="monotone" dataKey="llamadas" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                  <Line type="monotone" dataKey="eventos" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campus Map */}
      <Card>
        <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Mapa del Campus - Estado de Access Points</h3></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['Edificio A - Rectoría', 'Edificio B - Ingenierías', 'Edificio C - Ciencias Sociales', 'Edificio D - Biblioteca', 'Edificio E - Laboratorios', 'Edificio F - Ciencias de la Salud', 'Edificio G - Deportes', 'Edificio H - Centro de Cómputo', 'Auditorio Principal', 'Cafetería Central'].map((name, i) => {
              const apForLoc = aps.filter(a => a.id_ubicacion === i + 1);
              const hasOffline = apForLoc.some(a => a.estado === 'offline');
              const hasMaintenance = apForLoc.some(a => a.estado === 'mantenimiento');
              const status = hasOffline ? 'offline' : hasMaintenance ? 'mantenimiento' : 'online';
              return (
                <div key={name} className={`p-3 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer ${
                  status === 'online' ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10' :
                  status === 'mantenimiento' ? 'border-amber-500/30 bg-amber-50 dark:bg-amber-900/10' :
                  'border-red-500/30 bg-red-50 dark:bg-red-900/10'
                }`}>
                  <div className={`w-3 h-3 rounded-full mb-2 ${
                    status === 'online' ? 'bg-emerald-500 animate-pulse' :
                    status === 'mantenimiento' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{name}</p>
                  <p className="text-xs text-gray-400 mt-1">{apForLoc.length} AP{apForLoc.length !== 1 ? 's' : ''}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
