import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { DataTable } from '../components/ui/DataTable';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import type { Location } from '../types';

export function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState({ nombre_ubicacion: '', id_usuario: 1 });
  const { addToast } = useToast();
  const perPage = 10;

  const load = useCallback(async () => {
    setLocations(await api.getLocations());
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = locations.filter(l => l.nombre_ubicacion.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const openCreate = () => { setEditing(null); setForm({ nombre_ubicacion: '', id_usuario: 1 }); setModalOpen(true); };
  const openEdit = (l: Location) => { setEditing(l); setForm({ nombre_ubicacion: l.nombre_ubicacion, id_usuario: l.id_usuario }); setModalOpen(true); };

  const handleSave = async () => {
    if (editing) {
      await api.updateLocation(editing.id_ubicacion, form);
      addToast({ tipo: 'success', mensaje: 'Ubicación actualizada' });
    } else {
      await api.createLocation(form);
      addToast({ tipo: 'success', mensaje: 'Ubicación creada' });
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    await api.deleteLocation(id);
    addToast({ tipo: 'info', mensaje: 'Ubicación eliminada' });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><MapPin className="w-6 h-6" /> Ubicaciones</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{locations.length} ubicaciones registradas</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Nueva Ubicación</Button>
      </div>
      <Card>
        <CardContent>
          <DataTable
            data={paged as unknown as Record<string, unknown>[]}
            searchValue={search}
            onSearchChange={(v: string) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Buscar ubicación..."
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            columns={[
              { key: 'id_ubicacion', label: 'ID', render: (item: Record<string, unknown>) => <span className="font-mono text-xs">#{(item as unknown as Location).id_ubicacion}</span> },
              { key: 'nombre_ubicacion', label: 'Nombre', render: (item: Record<string, unknown>) => <span className="font-medium">{(item as unknown as Location).nombre_ubicacion}</span> },
            ]}
            actions={(item: Record<string, unknown>) => {
              const l = item as unknown as Location;
              return (
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(l.id_ubicacion)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              );
            }}
          />
        </CardContent>
      </Card>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Ubicación' : 'Nueva Ubicación'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de Ubicación</label><input value={form.nombre_ubicacion} onChange={e => setForm({...form, nombre_ubicacion: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white" placeholder="Ej: Edificio A - Sala 101" /></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
