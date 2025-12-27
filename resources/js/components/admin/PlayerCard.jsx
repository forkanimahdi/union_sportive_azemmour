import React from 'react';
import { User, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function PlayerCard({ player, onClick, showTeam = true }) {
    const isMinor = player.date_of_birth ? new Date().getFullYear() - new Date(player.date_of_birth).getFullYear() < 18 : false;
    
    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer group"
        >
            <div className="flex items-start gap-4">
                {/* Photo */}
                <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 group-hover:border-alpha transition-colors">
                        {player.photo ? (
                            <img src={player.photo} alt={player.first_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-alpha/10 text-alpha font-bold text-lg">
                                {player.first_name?.[0]}{player.last_name?.[0]}
                            </div>
                        )}
                    </div>
                    {player.jersey_number && (
                        <div className="absolute -bottom-1 -right-1 bg-alpha text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {player.jersey_number}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                            <h3 className="font-bold text-lg text-dark group-hover:text-alpha transition-colors">
                                {player.first_name} {player.last_name}
                            </h3>
                            {showTeam && player.team && (
                                <p className="text-sm text-gray-500">{player.team.name}</p>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            {isMinor && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Mineure</span>
                            )}
                            {player.can_play !== undefined && (
                                <StatusBadge 
                                    status={player.can_play ? 'active' : 'unavailable'} 
                                    type="player" 
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                        {player.position && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Poste:</span>
                                <span className="capitalize">{player.position}</span>
                            </div>
                        )}
                        {player.date_of_birth && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-alpha" />
                                <span>{new Date(player.date_of_birth).toLocaleDateString('fr-FR')}</span>
                            </div>
                        )}
                        {player.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-alpha" />
                                <span>{player.phone}</span>
                            </div>
                        )}
                        {player.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-alpha" />
                                <span className="truncate">{player.email}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

