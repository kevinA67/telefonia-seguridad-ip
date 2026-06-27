import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Settings, Sun, Moon, Bell, Shield, Database, Globe } from 'lucide-react';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Settings className="w-6 h-6" /> Configuración</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preferencias del sistema</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Apariencia</h3></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-gray-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Tema</p>
                  <p className="text-xs text-gray-500">{theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}</p>
                </div>
              </div>
              <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notificaciones</h3></CardHeader>
          <CardContent className="space-y-3">
            {['Llamadas activas', 'Eventos críticos', 'Cambios de estado AP', 'Nuevos usuarios'].map((item, i) => (
              <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{item}</span>
                </div>
                <button className={`relative w-10 h-5 rounded-full transition-colors ${i < 3 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${i < 3 ? 'left-5.5' : 'left-0.5'}`} style={{left: i < 3 ? '22px' : '2px'}} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Sistema</h3></CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Database, label: 'Base de datos', value: 'Simulada (Mock)' },
              { icon: Globe, label: 'API Endpoint', value: 'localhost:3001' },
              { icon: Shield, label: 'Versión', value: '1.0.0-beta' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{item.label}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-gray-900 dark:text-white">Información del Sistema</h3></CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Telefonía IP Universitaria</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sistema de Monitoreo y Administración</p>
              <p className="text-xs text-gray-400 mt-2">Versión 1.0.0-beta</p>
              <p className="text-xs text-gray-400">React + TypeScript + Tailwind CSS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
