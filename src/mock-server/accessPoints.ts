import type { AccessPoint } from '../types';

export const accessPoints: AccessPoint[] = [
  { id_ap: 1, nombre_ap: 'AP-Rectoria-P1', id_ubicacion: 1, ip: '192.168.1.10', estado: 'online' },
  { id_ap: 2, nombre_ap: 'AP-Rectoria-P2', id_ubicacion: 1, ip: '192.168.1.11', estado: 'online' },
  { id_ap: 3, nombre_ap: 'AP-Ingenierias-1', id_ubicacion: 2, ip: '192.168.2.10', estado: 'online' },
  { id_ap: 4, nombre_ap: 'AP-Ingenierias-2', id_ubicacion: 2, ip: '192.168.2.11', estado: 'mantenimiento' },
  { id_ap: 5, nombre_ap: 'AP-Sociales-1', id_ubicacion: 3, ip: '192.168.3.10', estado: 'online' },
  { id_ap: 6, nombre_ap: 'AP-Biblioteca-1', id_ubicacion: 4, ip: '192.168.4.10', estado: 'online' },
  { id_ap: 7, nombre_ap: 'AP-Biblioteca-2', id_ubicacion: 4, ip: '192.168.4.11', estado: 'offline' },
  { id_ap: 8, nombre_ap: 'AP-Lab-1', id_ubicacion: 5, ip: '192.168.5.10', estado: 'online' },
  { id_ap: 9, nombre_ap: 'AP-Lab-2', id_ubicacion: 5, ip: '192.168.5.11', estado: 'online' },
  { id_ap: 10, nombre_ap: 'AP-Salud-1', id_ubicacion: 6, ip: '192.168.6.10', estado: 'online' },
  { id_ap: 11, nombre_ap: 'AP-Deportes-1', id_ubicacion: 7, ip: '192.168.7.10', estado: 'mantenimiento' },
  { id_ap: 12, nombre_ap: 'AP-CentroComp-1', id_ubicacion: 8, ip: '192.168.8.10', estado: 'online' },
  { id_ap: 13, nombre_ap: 'AP-CentroComp-2', id_ubicacion: 8, ip: '192.168.8.11', estado: 'online' },
  { id_ap: 14, nombre_ap: 'AP-Auditorio-1', id_ubicacion: 9, ip: '192.168.9.10', estado: 'online' },
  { id_ap: 15, nombre_ap: 'AP-Cafeteria-1', id_ubicacion: 10, ip: '192.168.10.10', estado: 'offline' },
];
