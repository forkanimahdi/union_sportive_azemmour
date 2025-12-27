import React from 'react';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function MatchCard({ match, onClick, showTeam = true }) {
    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    {showTeam && match.team && (
                        <p className="text-sm text-gray-500 mb-1">{match.team.name}</p>
                    )}
                    <h3 className="font-bold text-lg text-dark group-hover:text-alpha transition-colors">
                        vs {match.opponent}
                    </h3>
                </div>
                <StatusBadge status={match.status} type="match" />
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-alpha" />
                    <span>{new Date(match.scheduled_at).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-alpha" />
                    <span>{match.venue}</span>
                </div>
                {match.competition && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Trophy className="w-4 h-4 text-alpha" />
                        <span>{match.competition.name}</span>
                    </div>
                )}
                {match.home_score !== null && match.away_score !== null && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-2xl font-black text-alpha">
                            {match.type === 'domicile' 
                                ? `${match.home_score} - ${match.away_score}`
                                : `${match.away_score} - ${match.home_score}`
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

