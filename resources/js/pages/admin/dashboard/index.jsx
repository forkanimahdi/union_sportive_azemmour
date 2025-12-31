import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { 
    Users, 
    Calendar, 
    Trophy, 
    AlertTriangle,
    TrendingUp,
    Activity,
    Baby,
    UserCircle2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '../../../components/admin/StatusBadge';
import PlayerCard from '../../../components/admin/PlayerCard';
import MatchCard from '../../../components/admin/MatchCard';

const categoryIcons = {
    'U13': Baby,
    'U15': UserCircle2,
    'U17': TrendingUp,
    'Senior': Trophy,
};

export default function Dashboard({ 
    stats,
    upcomingMatchesByCategory = {},
    recentTrainingsByCategory = {},
    unavailablePlayersByCategory = {},
    alerts,
    categories = []
}) {
    const defaultCategory = categories.includes('Senior') ? 'Senior' : (categories[0] || 'Tous');
    
    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase italic text-dark mb-2">
                        Tableau de Bord
                    </h1>
                    <p className="text-gray-600">Vue d'ensemble de votre club</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-alpha/10 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-alpha" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-dark mb-1">{stats?.total_players || 0}</div>
                        <div className="text-sm text-gray-600">Joueuses Actives</div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-alpha/10 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-alpha" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-dark mb-1">{stats?.upcoming_trainings || 0}</div>
                        <div className="text-sm text-gray-600">Entraînements à Venir</div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-alpha/10 rounded-lg flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-alpha" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-dark mb-1">{stats?.upcoming_matches || 0}</div>
                        <div className="text-sm text-gray-600">Matchs à Venir</div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-alpha/10 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-alpha" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-dark mb-1">{stats?.unavailable_players || 0}</div>
                        <div className="text-sm text-gray-600">Joueuses Indisponibles</div>
                    </div>
                </div>

                {/* Alerts */}
                {alerts && alerts.length > 0 && (
                    <div className="bg-alpha/10 border border-alpha/20 rounded-lg p-4 sm:p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-alpha">
                            <AlertTriangle className="w-5 h-5" />
                            Alertes
                        </h3>
                        <ul className="space-y-2">
                            {alerts.map((alert, index) => (
                                <li key={index} className="text-sm text-dark">
                                    • {alert}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Category Tabs */}
                {categories.length > 0 ? (
                    <Tabs defaultValue={defaultCategory} className="w-full">
                        <TabsList className="bg-alpha/10 border border-alpha/20">
                            {categories.map((category) => {
                                const Icon = categoryIcons[category] || Trophy;
                                return (
                                    <TabsTrigger 
                                        key={category} 
                                        value={category}
                                        className="data-[state=active]:bg-alpha data-[state=active]:text-white"
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {category}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {categories.map((category) => (
                            <TabsContent key={category} value={category} className="space-y-6">
                                {/* Upcoming Matches */}
                                {upcomingMatchesByCategory[category] && upcomingMatchesByCategory[category].length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                                            <h2 className="text-2xl font-black uppercase italic text-dark">Prochains Matchs - {category}</h2>
                                            <Link href="/admin/matches" className="text-alpha font-bold text-sm hover:underline">
                                                Voir tout →
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                            {upcomingMatchesByCategory[category].map((match) => (
                                                <MatchCard key={match.id} match={match} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Unavailable Players */}
                                {unavailablePlayersByCategory[category] && unavailablePlayersByCategory[category].length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                                            <h2 className="text-2xl font-black uppercase italic text-dark">Joueuses Indisponibles - {category}</h2>
                                            <Link href="/admin/players?filter=unavailable" className="text-alpha font-bold text-sm hover:underline">
                                                Voir tout →
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                            {unavailablePlayersByCategory[category].map((player) => (
                                                <PlayerCard key={player.id} player={player} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent Trainings */}
                                {recentTrainingsByCategory[category] && recentTrainingsByCategory[category].length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                                            <h2 className="text-2xl font-black uppercase italic text-dark">Entraînements Récents - {category}</h2>
                                            <Link href="/admin/trainings" className="text-alpha font-bold text-sm hover:underline">
                                                Voir tout →
                                            </Link>
                                        </div>
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-alpha text-white">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left font-bold uppercase text-xs">Date</th>
                                                            <th className="px-4 py-3 text-left font-bold uppercase text-xs">Équipe</th>
                                                            <th className="px-4 py-3 text-left font-bold uppercase text-xs">Lieu</th>
                                                            <th className="px-4 py-3 text-left font-bold uppercase text-xs">Statut</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {recentTrainingsByCategory[category].map((training) => (
                                                            <tr key={training.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                <td className="px-4 py-3">
                                                                    {new Date(training.scheduled_at).toLocaleDateString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </td>
                                                                <td className="px-4 py-3">{training.team?.name}</td>
                                                                <td className="px-4 py-3">{training.location}</td>
                                                                <td className="px-4 py-3">
                                                                    <StatusBadge status={training.status} type="training" />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Empty state */}
                                {(!upcomingMatchesByCategory[category] || upcomingMatchesByCategory[category].length === 0) &&
                                 (!unavailablePlayersByCategory[category] || unavailablePlayersByCategory[category].length === 0) &&
                                 (!recentTrainingsByCategory[category] || recentTrainingsByCategory[category].length === 0) && (
                                    <div className="text-center py-12 text-gray-500">
                                        Aucune donnée disponible pour la catégorie {category}
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Aucune catégorie disponible
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
