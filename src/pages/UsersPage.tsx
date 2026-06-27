import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { DataTable } from '../components/ui/DataTable';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import type { User, Role } from '../types';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', carrera: '', extension: '', id_rol: 2, estado: 'desconectado' as User['estado'] });
  const { addToast } = useToast();
  const perPage = 8;

  const load = useCallback(async () => {
    const [u, r] = await Promise.all([api.getUsers(), api.getRoles()]);
    setUsers(u); setRoles(r);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u =>
    `${u.nombre} ${u.apellido} ${u.correo} ${u.carrera} ${u.extension}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const getRoleName = (id: number) => roles.find(r => r.id_rol === id)?.nombre ?? 'N/A';

  const openCreate = () => {
    setEditingUser(null);
    setForm({ nombre: '', apellido: '', correo: '', carrera: '', extension: '', id_rol: 2, estado: 'desconectado' });
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setForm({ nombre: u.nombre, apellido: u.apellido, correo: u.correo, carrera: u.carrera, extension: u.extension, id_rol: u.id_rol, estado: u.estado });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (editingUser) {
      await api.updateUser(editingUser.id_usuario, form);
      addToast({ tipo: 'success', mensaje: 'Usuario actualizado correctamente' });
    } else {
      await api.createUser({ ...form, password_hash: 'temp123', fecha_creacion: new Date().toISOString().split('T')[0] });
      addToast({ tipo: 'success', mensaje: 'Usuario creado correctamente' });
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    await api.deleteUser(id);
    addToast({ tipo: 'info', mensaje: 'Usuario eliminado' });
    load();
  };

  const toggleStatus = async (u: User) => {
    const newStatus = u.estado === 'conectado' ? 'desconectado' : 'conectado';
    await api.updateUser(u.id_usuario, { estado: newStatus });
    addToast({ tipo: 'success', mensaje: `Estado cambiado a ${newStatus}` });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Users className="w-6 h-6" /> Gestión de Usuarios</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{users.length} usuarios registrados</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Nuevo Usuario</Button>
      </div>
      <Card>
        <CardContent>
          <DataTable
            data={paged as unknown as Record<string, unknown>[]}
            searchValue={search}
            onSearchChange={(v: string) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Buscar por nombre, correo, carrera..."
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            columns={[
              { key: 'nombre', label: 'Nombre', render: (item: Record<string, unknown>) => {
                const u = item as unknown as User;
                return <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{u.nombre[0]}{u.apellido[0]}</div><span className="font-medium">{u.nombre} {u.apellido}</span></div>;
              }},
              { key: 'correo', label: 'Correo' },
              { key: 'carrera', label: 'Carrera' },
              { key: 'extension', label: 'Extensión', render: (item: Record<string, unknown>) => <Badge variant="info">{(item as unknown as User).extension}</Badge> },
              { key: 'id_rol', label: 'Rol', render: (item: Record<string, unknown>) => <Badge variant="neutral">{getRoleName((item as unknown as User).id_rol)}</Badge> },
              { key: 'estado', label: 'Estado', render: (item: Record<string, unknown>) => {
                const u = item as unknown as User;
                return <Badge variant={u.estado === 'conectado' ? 'success' : u.estado === 'en_llamada' ? 'warning' : 'danger'} dot>{u.estado}</Badge>;
              }},
            ]}
            actions={(item: Record<string, unknown>) => {
              const u = item as unknown as User;
              return (
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleStatus(u)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Cambiar estado"><div className={`w-2 h-2 rounded-full ${u.estado === 'conectado' ? 'bg-emerald-500' : 'bg-gray-400'}`} /></button>
                  <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Editar"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(u.id_usuario)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Eliminar"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              );
            }}
          />
        </CardContent>
      </Card>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label><input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label><input value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label><input type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carrera</label><input value={form.carrera} onChange={e => setForm({...form, carrera: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extensión</label><input value={form.extension} onChange={e => setForm({...form, extension: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label><select value={form.id_rol} onChange={e => setForm({...form, id_rol: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white">{roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>)}</select></div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingUser ? 'Guardar' : 'Crear'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
