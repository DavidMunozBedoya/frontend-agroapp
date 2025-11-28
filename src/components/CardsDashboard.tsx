import type { LucideIcon } from 'lucide-react';

interface CardsDashboardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
}

const CardsDashboard = ({ title, value, icon: Icon }: CardsDashboardProps) => {
    return ( 
        <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default CardsDashboard;