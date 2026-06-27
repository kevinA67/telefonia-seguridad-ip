import type { Role } from '../types';

export const roles: Role[] = [
  { id_rol: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema de telefonía' },
  { id_rol: 2, nombre: 'Docente', descripcion: 'Profesor con acceso a extensiones académicas' },
  { id_rol: 3, nombre: 'Administrativo', descripcion: 'Personal administrativo de la universidad' },
  { id_rol: 4, nombre: 'Estudiante', descripcion: 'Alumno con acceso limitado a extensiones' },
  { id_rol: 5, nombre: 'Técnico', descripcion: 'Soporte técnico del sistema de telefonía' },
  { id_rol: 6, nombre: 'Director', descripcion: 'Director de departamento con acceso elevado' },
];
