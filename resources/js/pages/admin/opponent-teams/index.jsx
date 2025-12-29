import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Trophy, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function OpponentTeamsIndex({ teams = [] }) {
    const [search, setSearch] = useState('');

    // Sort teams by rank, then points, then goal difference
    const sortedTeams = useMemo(() => {
        let sorted = [...teams].sort((a, b) => {
            // First by rank if available
            if (a.rank && b.rank && a.rank !== b.rank) {
                return a.rank - b.rank;
            }
            // Then by points
            if ((b.points || 0) !== (a.points || 0)) {
                return (b.points || 0) - (a.points || 0);
            }
            // Then by goal difference
            const diffA = (a.goal_difference || 0);
            const diffB = (b.goal_difference || 0);
            if (diffB !== diffA) {
                return diffB - diffA;
            }
            // Finally by goals for
            return (b.goals_for || 0) - (a.goals_for || 0);
        });

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            sorted = sorted.filter(team => 
                team.name.toLowerCase().includes(searchLower)
            );
        }

        return sorted;
    }, [teams, search]);

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe adverse ?')) {
            router.delete(`/admin/opponent-teams/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Équipes Adverses & Classement" />
            <div className="space-y-6">
                {/* Header */}
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                    <div className="relative flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                                    <Trophy className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-black uppercase italic text-dark">Équipes Adverses & Classement</h1>
                            </div>
                            <p className="text-muted-foreground">Gestion des équipes adverses et classement complet</p>
                        </div>
                        <Link href="/admin/opponent-teams/create">
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvelle Équipe
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une équipe..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-white/50 backdrop-blur-sm"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Leaderboard Table - Botola Pro Style */}
                <Card className="bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden">
                    <CardHeader className="bg-primary text-white">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            CLASSEMENT / BOTOLA PRO POINT TABLE
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {sortedTeams.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-primary text-white">
                                            <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wide">RANG</th>
                                            <th className="px-4 py-3 text-left font-bold text-sm uppercase tracking-wide">ÉQUIPE</th>
                                            <th className="px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">J</th>
                                            <th className="px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">G</th>
                                            <th className="px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">N</th>
                                            <th className="px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">P</th>
                                            <th className="px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">BP</th>
                                            <th className="px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">BC</th>
                                            <th className="px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">DIFF</th>
                                            <th className="px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">PTS</th>
                                            <th className="px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedTeams.map((team, index) => {
                                            const rank = team.rank || index + 1;
                                            const isTopThree = rank <= 3;
                                            return (
                                                <tr 
                                                    key={team.id}
                                                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                                        isTopThree ? 'bg-primary/5' : ''
                                                    }`}
                                                >
                                                    <td className="px-4 py-4">
                                                        <div className={`font-black text-lg ${
                                                            rank === 1 ? 'text-yellow-600' : 
                                                            rank === 2 ? 'text-gray-400' : 
                                                            rank === 3 ? 'text-orange-600' : 
                                                            'text-gray-600'
                                                        }`}>
                                                            {rank}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {team.logo ? (
                                                                <img 
                                                                    src={`/storage/${team.logo}`} 
                                                                    alt={team.name}
                                                                    className="w-10 h-10 object-cover rounded-full border-2 border-gray-200"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                                                                    {team.name[0]}
                                                                </div>
                                                            )}
                                                            <span className="font-semibold text-dark">{team.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center font-semibold text-gray-700">
                                                        {team.matches_played || 0}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 font-semibold text-sm">
                                                            {team.wins || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold text-sm">
                                                            {team.draws || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 font-semibold text-sm">
                                                            {team.losses || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center font-semibold text-gray-700">
                                                        {team.goals_for || 0}
                                                    </td>
                                                    <td className="px-4 py-4 text-center font-semibold text-gray-700">
                                                        {team.goals_against || 0}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={`font-bold ${
                                                            (team.goal_difference || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                            {(team.goal_difference || 0) >= 0 ? '+' : ''}{team.goal_difference || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className="font-black text-lg text-primary">
                                                            {team.points || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link href={`/admin/opponent-teams/${team.id}/edit`}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                onClick={() => handleDelete(team.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-16">
                                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-semibold mb-2">Aucune équipe adverse enregistrée</p>
                                <p className="text-sm mb-4">Commencez par ajouter votre première équipe adverse</p>
                                <Link href="/admin/opponent-teams/create">
                                    <Button className="bg-primary hover:bg-primary/90">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Ajouter une équipe
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
