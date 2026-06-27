export interface Role {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

export interface User {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  password_hash: string;
  carrera: string;
  id_rol: number;
  extension: string;
  estado: 'conectado' | 'desconectado' | 'en_llamada';
  fecha_creacion: string;
}

export interface Event {
  id_evento: number;
  id_usuario: number;
  tipo: 'informacion' | 'advertencia' | 'error' | 'critico';
  descripcion: string;
  fecha: string;
}

export interface Location {
  id_ubicacion: number;
  id_usuario: number;
  nombre_ubicacion: string;
}

export interface Call {
  id_llamada: number;
  origen_extension: string;
  destino_extension: string;
  duracion_segundos: number;
  historial_conexiones: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  id_usuario: number;
  estado: 'activa' | 'finalizada' | 'perdida';
}

export interface AccessPoint {
  id_ap: number;
  nombre_ap: string;
  id_ubicacion: number;
  ip: string;
  estado: 'online' | 'mantenimiento' | 'offline';
}

export interface DashboardStats {
  usuariosRegistrados: number;
  usuariosConectados: number;
  usuariosDesconectados: number;
  llamadasHoy: number;
  llamadasActivas: number;
  duracionPromedio: number;
  apsActivos: number;
  apsOffline: number;
  eventosCriticos: number;
  eventosHoy: number;
  ubicacionesRegistradas: number;
}

export interface ActivityFeedItem {
  id: string;
  mensaje: string;
  tipo: 'llamada' | 'usuario' | 'ap' | 'evento' | 'sistema';
  fecha: Date;
}

export interface Toast {
  id: string;
  mensaje: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  duracion?: number;
}

export type ThemeMode = 'light' | 'dark';
