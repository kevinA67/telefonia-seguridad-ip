import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import type { Role } from '../types';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const { addToast } = useToast();

  const load = useCallback(async () => {
    setRoles(await api.getRoles());
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ nombre: '', descripcion: '' }); setModalOpen(true); };
  const openEdit = (r: Role) => { setEditing(r); setForm({ nombre: r.nombre, descripcion: r.descripcion }); setModalOpen(true); };

  const handleSave = async () => {
    if (editing) {
      await api.updateRole(editing.id_rol, form);
      addToast({ tipo: 'success', mensaje: 'Rol actualizado' });
    } else {
      await api.createRole(form);
      addToast({ tipo: 'success', mensaje: 'Rol creado' });
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    await api.deleteRole(id);
    addToast({ tipo: 'info', mensaje: 'Rol eliminado' });
    load();
  };

  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-cyan-500', 'bg-red-500'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Shield className="w-6 h-6" /> Gestión de Roles</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{roles.length} roles configurados</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Nuevo Rol</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r, i) => (
          <Card key={r.id_rol} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${colors[i % colors.length]} flex items-center justify-center`}>
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{r.nombre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{r.descripcion}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Edit2 className="w-3.5 h-3.5" /> Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id_rol)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-3.5 h-3.5" /> Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Rol' : 'Nuevo Rol'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label><input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label><textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white" /></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
