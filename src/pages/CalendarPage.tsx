import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Event } from '../types';

export function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const load = useCallback(async () => {
    setEvents(await api.getEvents());
  }, []);

  useEffect(() => { load(); }, [load]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const eventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.fecha.startsWith(dateStr));
  };

  const selectedEvents = selectedDate ? eventsForDay(selectedDate.getDate()) : [];

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><CalendarIcon className="w-6 h-6" /> Calendario de Eventos</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vista mensual de eventos del sistema</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft className="w-5 h-5" /></button>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{monthNames[month]} {year}</h3>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2">{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {days.map(day => {
                const evts = eventsForDay(day);
                const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month;
                const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`relative p-2 rounded-lg text-sm transition-all ${
                      isSelected ? 'bg-blue-600 text-white' :
                      isToday ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold' :
                      'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {day}
                    {evts.length > 0 && (
                      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5`}>
                        {evts.slice(0, 3).map((e, i) => (
                          <div key={i} className={`w-1 h-1 rounded-full ${e.tipo === 'critico' ? 'bg-red-500' : e.tipo === 'error' ? 'bg-orange-500' : e.tipo === 'advertencia' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {selectedDate ? `Eventos - ${selectedDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}` : 'Selecciona un día'}
            </h3>
            <div className="space-y-3">
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-gray-400">No hay eventos este día</p>
              ) : selectedEvents.map(e => (
                <div key={e.id_evento} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                  <Badge variant={e.tipo === 'critico' || e.tipo === 'error' ? 'danger' : e.tipo === 'advertencia' ? 'warning' : 'info'} className="mb-2">
                    {e.tipo}
                  </Badge>
                  <p className="text-sm text-gray-900 dark:text-white">{e.descripcion}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(e.fecha).toLocaleTimeString('es-MX')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
