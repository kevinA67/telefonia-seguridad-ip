import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Phone, MapPin, Wifi, Shield, Calendar,
  Activity, Settings, ChevronLeft, ChevronRight, Radio
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/usuarios', icon: Users, label: 'Usuarios' },
  { to: '/llamadas', icon: Phone, label: 'Llamadas' },
  { to: '/eventos', icon: Activity, label: 'Eventos' },
  { to: '/access-points', icon: Wifi, label: 'Access Points' },
  { to: '/ubicaciones', icon: MapPin, label: 'Ubicaciones' },
  { to: '/roles', icon: Shield, label: 'Roles' },
  { to: '/calendario', icon: Calendar, label: 'Calendario' },
  { to: '/configuracion', icon: Settings, label: 'Configuración' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={`fixed left-0 top-0 h-full z-40 bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-[68px]' : 'w-64'}`}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Radio className="w-5 h-5" />
        </div>
        {!collapsed && <span className="font-bold text-sm whitespace-nowrap">Telefonía IP</span>}
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-gray-800 hover:bg-gray-800 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
