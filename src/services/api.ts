import { users as mockUsers } from '../mock-server/users';
import { calls as mockCalls } from '../mock-server/calls';
import { events as mockEvents } from '../mock-server/events';
import { accessPoints as mockAPs } from '../mock-server/accessPoints';
import { locations as mockLocations } from '../mock-server/locations';
import { roles as mockRoles } from '../mock-server/roles';
import type { User, Call, Event, AccessPoint, Location, Role, DashboardStats } from '../types';

let users = [...mockUsers];
let calls = [...mockCalls];
let events = [...mockEvents];
let accessPoints = [...mockAPs];
let locations = [...mockLocations];
let roles = [...mockRoles];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth
  async login(correo: string, password: string): Promise<User | null> {
    await delay(800);
    const user = users.find(u => u.correo === correo && u.password_hash === password);
    if (user) {
      const idx = users.findIndex(u => u.id_usuario === user.id_usuario);
      users[idx] = { ...users[idx], estado: 'conectado' };
      return { ...users[idx] };
    }
    return null;
  },

  async logout(userId: number): Promise<void> {
    await delay(300);
    const idx = users.findIndex(u => u.id_usuario === userId);
    if (idx !== -1) users[idx] = { ...users[idx], estado: 'desconectado' };
  },

  // Users
  async getUsers(): Promise<User[]> {
    await delay(400);
    return [...users];
  },
  async getUser(id: number): Promise<User | undefined> {
    await delay(300);
    return users.find(u => u.id_usuario === id);
  },
  async createUser(user: Omit<User, 'id_usuario'>): Promise<User> {
    await delay(500);
    const newUser = { ...user, id_usuario: Math.max(...users.map(u => u.id_usuario)) + 1 };
    users.push(newUser);
    return newUser;
  },
  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    await delay(500);
    const idx = users.findIndex(u => u.id_usuario === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    return users[idx];
  },
  async deleteUser(id: number): Promise<boolean> {
    await delay(400);
    const idx = users.findIndex(u => u.id_usuario === id);
    if (idx === -1) return false;
    users.splice(idx, 1);
    return true;
  },

  // Calls
  async getCalls(): Promise<Call[]> {
    await delay(400);
    return [...calls];
  },
  async createCall(call: Omit<Call, 'id_llamada'>): Promise<Call> {
    await delay(300);
    const newCall = { ...call, id_llamada: Math.max(...calls.map(c => c.id_llamada)) + 1 };
    calls.unshift(newCall);
    return newCall;
  },
  async endCall(id: number): Promise<Call | null> {
    await delay(300);
    const idx = calls.findIndex(c => c.id_llamada === id);
    if (idx === -1) return null;
    calls[idx] = { ...calls[idx], estado: 'finalizada', fecha_fin: new Date().toISOString(), duracion_segundos: Math.floor(Math.random() * 600) + 30 };
    return calls[idx];
  },

  // Events
  async getEvents(): Promise<Event[]> {
    await delay(400);
    return [...events];
  },
  async createEvent(event: Omit<Event, 'id_evento'>): Promise<Event> {
    await delay(300);
    const newEvent = { ...event, id_evento: Math.max(...events.map(e => e.id_evento)) + 1 };
    events.unshift(newEvent);
    return newEvent;
  },

  // Access Points
  async getAccessPoints(): Promise<AccessPoint[]> {
    await delay(400);
    return [...accessPoints];
  },
  async updateAccessPoint(id: number, data: Partial<AccessPoint>): Promise<AccessPoint | null> {
    await delay(400);
    const idx = accessPoints.findIndex(a => a.id_ap === id);
    if (idx === -1) return null;
    accessPoints[idx] = { ...accessPoints[idx], ...data };
    return accessPoints[idx];
  },

  // Locations
  async getLocations(): Promise<Location[]> {
    await delay(400);
    return [...locations];
  },
  async createLocation(loc: Omit<Location, 'id_ubicacion'>): Promise<Location> {
    await delay(400);
    const newLoc = { ...loc, id_ubicacion: Math.max(...locations.map(l => l.id_ubicacion)) + 1 };
    locations.push(newLoc);
    return newLoc;
  },
  async updateLocation(id: number, data: Partial<Location>): Promise<Location | null> {
    await delay(400);
    const idx = locations.findIndex(l => l.id_ubicacion === id);
    if (idx === -1) return null;
    locations[idx] = { ...locations[idx], ...data };
    return locations[idx];
  },
  async deleteLocation(id: number): Promise<boolean> {
    await delay(400);
    const idx = locations.findIndex(l => l.id_ubicacion === id);
    if (idx === -1) return false;
    locations.splice(idx, 1);
    return true;
  },

  // Roles
  async getRoles(): Promise<Role[]> {
    await delay(400);
    return [...roles];
  },
  async createRole(role: Omit<Role, 'id_rol'>): Promise<Role> {
    await delay(400);
    const newRole = { ...role, id_rol: Math.max(...roles.map(r => r.id_rol)) + 1 };
    roles.push(newRole);
    return newRole;
  },
  async updateRole(id: number, data: Partial<Role>): Promise<Role | null> {
    await delay(400);
    const idx = roles.findIndex(r => r.id_rol === id);
    if (idx === -1) return null;
    roles[idx] = { ...roles[idx], ...data };
    return roles[idx];
  },
  async deleteRole(id: number): Promise<boolean> {
    await delay(400);
    const idx = roles.findIndex(r => r.id_rol === id);
    if (idx === -1) return false;
    roles.splice(idx, 1);
    return true;
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    await delay(300);
    const connectedUsers = users.filter(u => u.estado === 'conectado').length;
    const disconnectedUsers = users.filter(u => u.estado === 'desconectado').length;
    const activeCalls = calls.filter(c => c.estado === 'activa').length;
    const todayCalls = calls.length;
    const avgDuration = calls.filter(c => c.estado === 'finalizada').reduce((acc, c) => acc + c.duracion_segundos, 0) / Math.max(calls.filter(c => c.estado === 'finalizada').length, 1);
    const apsOnline = accessPoints.filter(a => a.estado === 'online').length;
    const apsOffline = accessPoints.filter(a => a.estado === 'offline').length;
    const criticalEvents = events.filter(e => e.tipo === 'critico').length;
    return {
      usuariosRegistrados: users.length,
      usuariosConectados: connectedUsers,
      usuariosDesconectados: disconnectedUsers,
      llamadasHoy: todayCalls,
      llamadasActivas: activeCalls,
      duracionPromedio: Math.round(avgDuration),
      apsActivos: apsOnline,
      apsOffline,
      eventosCriticos: criticalEvents,
      eventosHoy: events.length,
      ubicacionesRegistradas: locations.length,
    };
  },

  // Users (raw access for socket simulation)
  getUsersRaw() { return users; },
  getCallsRaw() { return calls; },
  getEventsRaw() { return events; },
  getAPsRaw() { return accessPoints; },
};
