import { useNavigate, useLocation } from 'react-router-dom';
import { X,LayoutDashboard, Package, DollarSign, Activity, Bell } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Suplementos - Categorías', icon: Package, path: '/supplies' },
        { name: 'Gastos', icon: DollarSign, path: '/expenses' },
        { name: 'Producción', icon: Activity, path: '/production' },
        { name: 'Novedades', icon: Bell, path: '/novelties' }
    ];

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                onClick={() => setIsOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30
                w-64 bg-white border-r border-gray-200
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">Agroapp</h1>
                    <button 
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                    <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Menu Items */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => {
                            navigate(item.path);
                            if (window.innerWidth < 1024) setIsOpen(false);
                        }}
                        className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        text-sm font-medium transition-colors
                        ${location.pathname === item.path 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                        `}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </button>
                    ))}
                </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

