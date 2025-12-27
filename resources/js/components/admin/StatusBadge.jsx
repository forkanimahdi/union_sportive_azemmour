import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, type = 'default' }) {
    const configs = {
        player: {
            active: { label: 'Actif', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
            injured: { label: 'Blessée', color: 'bg-red-100 text-red-800', icon: AlertCircle },
            suspended: { label: 'Suspendue', color: 'bg-orange-100 text-orange-800', icon: XCircle },
            unavailable: { label: 'Indisponible', color: 'bg-gray-100 text-gray-800', icon: Clock },
        },
        training: {
            scheduled: { label: 'Programmé', color: 'bg-blue-100 text-blue-800', icon: Clock },
            completed: { label: 'Terminé', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
            cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: XCircle },
        },
        match: {
            scheduled: { label: 'Programmé', color: 'bg-blue-100 text-blue-800', icon: Clock },
            live: { label: 'En Direct', color: 'bg-red-100 text-red-800', icon: AlertCircle },
            finished: { label: 'Terminé', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
            postponed: { label: 'Reporté', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            cancelled: { label: 'Annulé', color: 'bg-gray-100 text-gray-800', icon: XCircle },
        },
        injury: {
            en_soins: { label: 'En Soins', color: 'bg-red-100 text-red-800', icon: AlertCircle },
            reprise_progressive: { label: 'Reprise Progressive', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            apte: { label: 'Apte', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
        },
        default: {
            active: { label: 'Actif', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
            inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-800', icon: XCircle },
        }
    };

    const config = configs[type] || configs.default;
    const statusConfig = config[status] || config.active;
    const Icon = statusConfig.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
            <Icon className="w-3 h-3" />
            {statusConfig.label}
        </span>
    );
}

