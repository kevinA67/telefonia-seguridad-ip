import type { Call } from '../types';

const now = new Date();
const h = (hoursAgo: number) => {
  const d = new Date(now.getTime() - hoursAgo * 3600000);
  return d.toISOString();
};
const m = (minsAgo: number) => {
  const d = new Date(now.getTime() - minsAgo * 60000);
  return d.toISOString();
};

export const calls: Call[] = [
  { id_llamada: 1, origen_extension: '1001', destino_extension: '2001', duracion_segundos: 342, historial_conexiones: '192.168.1.10->192.168.2.10', fecha_inicio: h(2), fecha_fin: h(2), id_usuario: 1, estado: 'finalizada' },
  { id_llamada: 2, origen_extension: '2003', destino_extension: '3001', duracion_segundos: 0, historial_conexiones: '192.168.6.10->192.168.3.10', fecha_inicio: m(5), fecha_fin: null, id_usuario: 10, estado: 'activa' },
  { id_llamada: 3, origen_extension: '3002', destino_extension: '5001', duracion_segundos: 128, historial_conexiones: '192.168.4.10->192.168.8.10', fecha_inicio: h(4), fecha_fin: h(4), id_usuario: 9, estado: 'finalizada' },
  { id_llamada: 4, origen_extension: '4001', destino_extension: '2006', duracion_segundos: 0, historial_conexiones: '192.168.3.10->192.168.2.10', fecha_inicio: m(12), fecha_fin: null, id_usuario: 4, estado: 'activa' },
  { id_llamada: 5, origen_extension: '2002', destino_extension: '1001', duracion_segundos: 56, historial_conexiones: '192.168.2.10->192.168.1.10', fecha_inicio: h(6), fecha_fin: h(6), id_usuario: 7, estado: 'perdida' },
  { id_llamada: 6, origen_extension: '5002', destino_extension: '3003', duracion_segundos: 892, historial_conexiones: '192.168.8.11->192.168.4.10', fecha_inicio: h(1), fecha_fin: h(1), id_usuario: 13, estado: 'finalizada' },
  { id_llamada: 7, origen_extension: '6001', destino_extension: '2004', duracion_segundos: 0, historial_conexiones: '192.168.1.10->192.168.2.10', fecha_inicio: m(2), fecha_fin: null, id_usuario: 6, estado: 'activa' },
  { id_llamada: 8, origen_extension: '4003', destino_extension: '4005', duracion_segundos: 45, historial_conexiones: '192.168.3.10->192.168.3.10', fecha_inicio: h(8), fecha_fin: h(8), id_usuario: 11, estado: 'perdida' },
  { id_llamada: 9, origen_extension: '2005', destino_extension: '1001', duracion_segundos: 1247, historial_conexiones: '192.168.2.10->192.168.1.10', fecha_inicio: h(3), fecha_fin: h(3), id_usuario: 16, estado: 'finalizada' },
  { id_llamada: 10, origen_extension: '3004', destino_extension: '5002', duracion_segundos: 0, historial_conexiones: '192.168.3.10->192.168.8.11', fecha_inicio: m(8), fecha_fin: null, id_usuario: 18, estado: 'activa' },
  { id_llamada: 11, origen_extension: '4006', destino_extension: '2003', duracion_segundos: 178, historial_conexiones: '192.168.4.10->192.168.6.10', fecha_inicio: h(5), fecha_fin: h(5), id_usuario: 20, estado: 'finalizada' },
  { id_llamada: 12, origen_extension: '1001', destino_extension: '6001', duracion_segundos: 234, historial_conexiones: '192.168.1.10->192.168.1.10', fecha_inicio: h(7), fecha_fin: h(7), id_usuario: 1, estado: 'finalizada' },
  { id_llamada: 13, origen_extension: '2001', destino_extension: '4002', duracion_segundos: 0, historial_conexiones: '192.168.2.10->192.168.6.10', fecha_inicio: m(15), fecha_fin: null, id_usuario: 2, estado: 'activa' },
  { id_llamada: 14, origen_extension: '3003', destino_extension: '2005', duracion_segundos: 67, historial_conexiones: '192.168.4.10->192.168.2.10', fecha_inicio: h(9), fecha_fin: h(9), id_usuario: 15, estado: 'perdida' },
  { id_llamada: 15, origen_extension: '5001', destino_extension: '4001', duracion_segundos: 456, historial_conexiones: '192.168.8.10->192.168.3.10', fecha_inicio: h(1.5), fecha_fin: h(1.5), id_usuario: 5, estado: 'finalizada' },
  { id_llamada: 16, origen_extension: '4004', destino_extension: '3002', duracion_segundos: 0, historial_conexiones: '192.168.6.10->192.168.4.10', fecha_inicio: m(1), fecha_fin: null, id_usuario: 14, estado: 'activa' },
  { id_llamada: 17, origen_extension: '2006', destino_extension: '5001', duracion_segundos: 312, historial_conexiones: '192.168.2.10->192.168.8.10', fecha_inicio: h(10), fecha_fin: h(10), id_usuario: 19, estado: 'finalizada' },
  { id_llamada: 18, origen_extension: '1001', destino_extension: '3004', duracion_segundos: 89, historial_conexiones: '192.168.1.10->192.168.3.10', fecha_inicio: h(11), fecha_fin: h(11), id_usuario: 1, estado: 'perdida' },
  { id_llamada: 19, origen_extension: '2004', destino_extension: '4006', duracion_segundos: 567, historial_conexiones: '192.168.2.10->192.168.4.10', fecha_inicio: h(0.5), fecha_fin: h(0.5), id_usuario: 12, estado: 'finalizada' },
  { id_llamada: 20, origen_extension: '6001', destino_extension: '1001', duracion_segundos: 0, historial_conexiones: '192.168.1.10->192.168.1.10', fecha_inicio: m(3), fecha_fin: null, id_usuario: 6, estado: 'activa' },
];
