import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
}

export default function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${active
                ? 'bg-purple-50 text-purple-700 font-medium border-l-4 border-purple-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-gray-400'}`} />
            <span>{label}</span>
        </div>
    );
}
