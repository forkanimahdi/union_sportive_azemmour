import React from 'react';
import { Trophy, Target, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const positionLabels = {
    'gardien': 'Gardien',
    'defenseur': 'Défenseur',
    'milieu': 'Milieu',
    'attaquant': 'Attaquant',
};

export default function PlayerCard({ player, onClick, showTeam = true }) {
    const stats = player.stats || {
        appearances: { total: 0, season: 0 },
        goals: { total: 0, season: 0 },
        assists: { total: 0, season: 0 },
    };

    const positionLabel = player.position ? positionLabels[player.position] || player.position : '';
    
    return (
        <div 
            onClick={onClick}
            className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 h-full flex flex-col"
            style={{
                background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 50%, rgba(87, 17, 35, 0.8) 100%)`,
            }}
        >
            {/* Player Photo Container - Full Height */}
            <div className="relative flex-1 min-h-[300px] overflow-hidden">
                {player.photo ? (
                    <img 
                        src={`/storage/${player.photo}`} 
                        alt={`${player.first_name} ${player.last_name}`}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/20">
                        <div className="w-32 h-32 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-4xl">
                            {player.first_name?.[0]}{player.last_name?.[0]}
                        </div>
                    </div>
                )}
                
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-60"></div>
                
                {/* Jersey Number Overlay */}
                {player.jersey_number && (
                    <div className="absolute top-4 right-4 z-10">
                        <div className="text-6xl font-black text-white/20 leading-none">
                            {player.jersey_number}
                        </div>
                    </div>
                )}

                {/* Player Name and Position - Overlaid on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <div className="text-white">
                        <h3 className="font-black text-xl uppercase tracking-wide mb-1 drop-shadow-lg">
                            {player.first_name} {player.last_name.toUpperCase()}
                        </h3>
                        {positionLabel && (
                            <p className="text-sm font-semibold drop-shadow-md mb-2">
                                {positionLabel}
                            </p>
                        )}
                        {showTeam && player.team && (
                            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
                                {player.team.name}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Hover Stats Overlay - Slides Up */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        {/* Stats Grid */}
                        <div className="space-y-4">
                            {/* Appearances */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4" />
                                    <span className="text-sm font-medium uppercase tracking-wide">Apparitions</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black">{stats.appearances.total}</div>
                                    <div className="text-xs opacity-80">Saison: {stats.appearances.season}</div>
                                </div>
                            </div>

                            {/* Goals */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    <span className="text-sm font-medium uppercase tracking-wide">Buts</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black">{stats.goals.total}</div>
                                    <div className="text-xs opacity-80">Saison: {stats.goals.season}</div>
                                </div>
                            </div>

                            {/* Assists */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-sm font-medium uppercase tracking-wide">Passes D.</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black">{stats.assists.total}</div>
                                    <div className="text-xs opacity-80">Saison: {stats.assists.season}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            </div>
        </div>
    );
}
