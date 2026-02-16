import React from 'react';
import { Trophy, Users, Calendar, Target } from 'lucide-react';

export default function LeagueTable({ seniorStandings = [], activeSeason = null }) {
    const tableData = Array.isArray(seniorStandings) ? seniorStandings : [];

    const achievements = [
        { icon: Trophy, label: 'Championnats', value: '12', description: 'Titres remportés' },
        { icon: Users, label: 'Joueurs', value: '45+', description: 'Effectif actuel' },
        { icon: Calendar, label: 'Saison', value: activeSeason?.name ?? '–', description: 'En cours' },
        { icon: Target, label: 'Objectif', value: 'Top 3', description: 'Cette saison' },
    ];

    return (
        <div className="py-16 sm:py-20 lg:py-24 bg-white">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                    {/* Achievements Column */}
                    <div className="lg:col-span-1">
                        <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Club Stats</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic mb-6 sm:mb-8">Nos Réalisations</h2>
                        <div className="space-y-4 sm:space-y-6">
                            {achievements.map((achievement, index) => {
                                const Icon = achievement.icon;
                                return (
                                    <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-alpha hover:shadow-lg transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-alpha/10 p-3 rounded-lg group-hover:bg-alpha transition-colors">
                                                <Icon className="w-6 h-6 text-alpha group-hover:text-white transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-3xl font-black text-alpha mb-1">{achievement.value}</div>
                                                <div className="text-sm font-bold uppercase text-dark mb-1">{achievement.label}</div>
                                                <div className="text-xs text-gray-500">{achievement.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Table Column – Senior classment, active season only */}
                    <div className="lg:col-span-2">
                        <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Classement</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic mb-6 sm:mb-8">
                            Senior {activeSeason?.name ? `– ${activeSeason.name}` : ''}
                        </h2>
                        {tableData.length > 0 ? (
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                    <table className="w-full text-xs sm:text-sm text-left">
                                        <thead className="bg-alpha text-white uppercase font-bold">
                                            <tr>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">Rang</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">Équipe</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">J</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">G</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">N</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">P</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">PTS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row) => (
                                                <tr
                                                    key={`${row.rank}-${row.name}`}
                                                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${row.is_usa ? 'bg-alpha/5 font-bold' : ''}`}
                                                >
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold text-alpha">
                                                        {row.rank}
                                                    </td>
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold flex items-center gap-2 sm:gap-3">
                                                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${row.is_usa ? 'bg-alpha text-white' : 'bg-gray-200 text-dark'}`}>
                                                            {row.short_code || row.name?.slice(0, 2)?.toUpperCase() || '–'}
                                                        </div>
                                                        <span className="truncate">{row.name}</span>
                                                    </td>
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">{row.played ?? 0}</td>
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">{row.wins ?? 0}</td>
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">{row.draws ?? 0}</td>
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">{row.losses ?? 0}</td>
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold text-dark">{row.points ?? 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-8 text-center">
                                <p className="text-gray-500">
                                    Aucun classement Senior pour la saison en cours. Le classement est géré dans l’espace admin.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
