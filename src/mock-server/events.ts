import type { Event } from '../types';

const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000).toISOString();
const m = (minsAgo: number) => new Date(now.getTime() - minsAgo * 60000).toISOString();

export const events: Event[] = [
  { id_evento: 1, id_usuario: 1, tipo: 'informacion', descripcion: 'Sistema de telefonía iniciado correctamente', fecha: h(24) },
  { id_evento: 2, id_usuario: 5, tipo: 'informacion', descripcion: 'AP Biblioteca-2 reconectado después de mantenimiento', fecha: h(20) },
  { id_evento: 3, id_usuario: 13, tipo: 'advertencia', descripcion: 'Alto uso de CPU en servidor PBX detectado', fecha: h(18) },
  { id_evento: 4, id_usuario: 1, tipo: 'informacion', descripcion: 'Backup de configuración completado', fecha: h(15) },
  { id_evento: 5, id_usuario: 5, tipo: 'error', descripcion: 'AP Cafeteria-1 perdió conexión - señal débil', fecha: h(12) },
  { id_evento: 6, id_usuario: 13, tipo: 'informacion', descripcion: 'Actualización de firmware en APs del Edificio E completada', fecha: h(10) },
  { id_evento: 7, id_usuario: 1, tipo: 'advertencia', descripcion: 'Extensión 4002 excedió límite de llamadas diarias', fecha: h(8) },
  { id_evento: 8, id_usuario: 5, tipo: 'critico', descripcion: 'Servidor PBX principal - latencia elevada detectada', fecha: h(6) },
  { id_evento: 9, id_usuario: 1, tipo: 'informacion', descripcion: 'Nuevo usuario registrado: Patricia Aguilar', fecha: h(5) },
  { id_evento: 10, id_usuario: 13, tipo: 'error', descripcion: 'AP Deportes-1 en modo mantenimiento programado', fecha: h(4) },
  { id_evento: 11, id_usuario: 1, tipo: 'informacion', descripcion: 'Reporte de uso diario generado', fecha: h(3) },
  { id_evento: 12, id_usuario: 5, tipo: 'advertencia', descripcion: 'Ancho de banda al 85% en Edificio B', fecha: h(2) },
  { id_evento: 13, id_usuario: 1, tipo: 'informacion', descripcion: 'Extensión 3005 asignada a nuevo empleado', fecha: h(1.5) },
  { id_evento: 14, id_usuario: 13, tipo: 'error', descripcion: 'Timeout en conexión SIP - extensión 2004', fecha: h(1) },
  { id_evento: 15, id_usuario: 1, tipo: 'informacion', descripcion: 'Sistema sincronizado con base de datos', fecha: m(30) },
  { id_evento: 16, id_usuario: 5, tipo: 'critico', descripcion: 'Interrupción momentánea en red del Edificio A', fecha: m(15) },
  { id_evento: 17, id_usuario: 1, tipo: 'informacion', descripcion: 'Llamada de conferencia programada para mañana', fecha: m(10) },
  { id_evento: 18, id_usuario: 13, tipo: 'advertencia', descripcion: 'Certificado SSL vence en 15 días', fecha: m(5) },
  { id_evento: 19, id_usuario: 1, tipo: 'informacion', descripcion: 'Dashboard de monitoreo actualizado', fecha: m(2) },
  { id_evento: 20, id_usuario: 5, tipo: 'informacion', descripcion: 'Todos los sistemas operativos - estado normal', fecha: m(1) },
];
