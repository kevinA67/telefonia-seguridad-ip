type EventCallback = (...args: unknown[]) => void;

class FakeSocket {
  private listeners: Map<string, EventCallback[]> = new Map();
  private connected = true;
  private intervals: ReturnType<typeof setTimeout>[] = [];

  get isConnected() { return this.connected; }

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(callback);
    return this;
  }

  off(event: string, callback?: EventCallback) {
    if (!callback) { this.listeners.delete(event); return this; }
    const cbs = this.listeners.get(event);
    if (cbs) this.listeners.set(event, cbs.filter(cb => cb !== callback));
    return this;
  }

  emit(event: string, ...args: unknown[]) {
    const cbs = this.listeners.get(event);
    if (cbs) cbs.forEach(cb => cb(...args));
  }

  private trigger(event: string, data: unknown) {
    this.emit(event, data);
  }

  startSimulation() {
    this.connected = true;
    this.trigger('connection-status', { connected: true });

    // Simulate new call every 8-15s
    const callInterval = setInterval(() => {
      if (!this.connected) return;
      const ext1 = String(1000 + Math.floor(Math.random() * 6000));
      const ext2 = String(1000 + Math.floor(Math.random() * 6000));
      this.trigger('new-call', {
        id_llamada: Date.now(),
        origen_extension: ext1,
        destino_extension: ext2,
        duracion_segundos: 0,
        historial_conexiones: `192.168.${Math.floor(Math.random()*10)}.${10+Math.floor(Math.random()*5)}->192.168.${Math.floor(Math.random()*10)}.${10+Math.floor(Math.random()*5)}`,
        fecha_inicio: new Date().toISOString(),
        fecha_fin: null,
        id_usuario: Math.floor(Math.random() * 20) + 1,
        estado: 'activa',
      });
    }, 8000 + Math.random() * 7000);

    // End a random active call every 10-18s
    const endCallInterval = setInterval(() => {
      if (!this.connected) return;
      this.trigger('call-ended', {
        id_llamada: Date.now(),
        duracion_segundos: Math.floor(Math.random() * 600) + 30,
      });
    }, 10000 + Math.random() * 8000);

    // AP status change every 15-25s
    const apInterval = setInterval(() => {
      if (!this.connected) return;
      const statuses: Array<'online' | 'offline' | 'mantenimiento'> = ['online', 'offline', 'mantenimiento'];
      this.trigger('ap-status', {
        id_ap: Math.floor(Math.random() * 15) + 1,
        nombre_ap: `AP-${['Rectoria','Ingenierias','Sociales','Biblioteca','Lab','Salud','Deportes','CentroComp','Auditorio','Cafeteria'][Math.floor(Math.random()*10)]}-${Math.floor(Math.random()*3)+1}`,
        estado: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }, 15000 + Math.random() * 10000);

    // User status change every 12-20s
    const userInterval = setInterval(() => {
      if (!this.connected) return;
      const statuses: Array<'conectado' | 'desconectado' | 'en_llamada'> = ['conectado', 'desconectado', 'en_llamada'];
      this.trigger('user-status', {
        id_usuario: Math.floor(Math.random() * 20) + 1,
        estado: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }, 12000 + Math.random() * 8000);

    // New event every 10-20s
    const eventInterval = setInterval(() => {
      if (!this.connected) return;
      const tipos: Array<'informacion' | 'advertencia' | 'error' | 'critico'> = ['informacion', 'advertencia', 'error', 'critico'];
      const msgs = [
        'Nuevo usuario registrado en el sistema',
        'AP reconectado exitosamente',
        'Configuración de extensiones actualizada',
        'Reporte de incidencia generado',
        'Llamada de conferencia programada',
        'Actualización de firmware completada',
        'Certificado de seguridad renovado',
        'Backup automático ejecutado',
        'Extensión reasignada a nuevo departamento',
        'Alerta de ancho de banda superado',
      ];
      this.trigger('new-event', {
        id_evento: Date.now(),
        id_usuario: Math.floor(Math.random() * 20) + 1,
        tipo: tipos[Math.floor(Math.random() * tipos.length)],
        descripcion: msgs[Math.floor(Math.random() * msgs.length)],
        fecha: new Date().toISOString(),
      });
    }, 10000 + Math.random() * 10000);

    // Stats update every 5s
    const statsInterval = setInterval(() => {
      if (!this.connected) return;
      this.trigger('statistics-update', { timestamp: Date.now() });
    }, 5000);

    // Activity feed every 3-6s
    const feedInterval = setInterval(() => {
      if (!this.connected) return;
      const feedMsgs = [
        { mensaje: 'Juan López inició sesión', tipo: 'usuario' as const },
        { mensaje: 'Nueva llamada iniciada ext. 2001→3001', tipo: 'llamada' as const },
        { mensaje: 'AP Biblioteca perdió conexión', tipo: 'ap' as const },
        { mensaje: 'Llamada finalizada - duración: 3m 42s', tipo: 'llamada' as const },
        { mensaje: 'Nuevo usuario registrado en el sistema', tipo: 'usuario' as const },
        { mensaje: 'Servidor sincronizado correctamente', tipo: 'sistema' as const },
        { mensaje: 'Nueva extensión 5003 asignada', tipo: 'sistema' as const },
        { mensaje: 'AP Centro de Cómputo en mantenimiento', tipo: 'ap' as const },
        { mensaje: 'Llamada perdida desde ext. 4002', tipo: 'llamada' as const },
        { mensaje: 'Alerta: CPU al 92%', tipo: 'sistema' as const },
      ];
      const msg = feedMsgs[Math.floor(Math.random() * feedMsgs.length)];
      this.trigger('activity-feed', { ...msg, id: String(Date.now()), fecha: new Date() });
    }, 3000 + Math.random() * 3000);

    this.intervals.push(callInterval, endCallInterval, apInterval, userInterval, eventInterval, statsInterval, feedInterval);
  }

  stopSimulation() {
    this.connected = false;
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    this.trigger('connection-status', { connected: false });
  }

  disconnect() {
    this.stopSimulation();
  }
}

export const fakeSocket = new FakeSocket();
