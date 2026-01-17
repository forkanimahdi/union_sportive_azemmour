import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Trophy, Search, Award, Medal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function OpponentTeamsIndex({ teams = [], activeSeason }) {
    const [search, setSearch] = useState('');

    // Group teams by category
    const teamsByCategory = useMemo(() => {
        const grouped = {};
        
        teams.forEach(team => {
            const category = team.category || 'Autre';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(team);
        });

        // Sort each category
        Object.keys(grouped).forEach(category => {
            grouped[category] = grouped[category].sort((a, b) => {
                if ((b.points || 0) !== (a.points || 0)) {
                    return (b.points || 0) - (a.points || 0);
                }
                const diffA = (a.goal_difference || 0);
                const diffB = (b.goal_difference || 0);
                if (diffB !== diffA) {
                    return diffB - diffA;
                }
                if ((b.goals_for || 0) !== (a.goals_for || 0)) {
                    return (b.goals_for || 0) - (a.goals_for || 0);
                }
                return (a.goals_against || 0) - (b.goals_against || 0);
            }).map((team, index) => ({
                ...team,
                rank: index + 1
            }));

            // Filter by search if applicable
            if (search) {
                const searchLower = search.toLowerCase();
                grouped[category] = grouped[category].filter(team => 
                    team.name.toLowerCase().includes(searchLower)
                );
            }
        });

        return grouped;
    }, [teams, search]);

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe adverse ?')) {
            router.delete(`/admin/opponent-teams/${id}`);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
        return null;
    };

    return (
        <AdminLayout>
            <Head title="Équipes Adverses & Classement" />
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5">
                <div className="space-y-8 p-6">
                    {/* Hero Header */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent rounded-2xl opacity-10 blur-3xl"></div>
                        <div className="relative bg-primary rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center justify-between flex-wrap gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <Award className="w-8 h-8 text-white" />
                                        </div>
                                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tight">
                                            Classement Botola Pro
                                        </h1>
                                    </div>
                                    <p className="text-white/90 text-lg ml-14">
                                        {activeSeason?.name || 'Saison active'} • {teams.length} équipe{teams.length > 1 ? 's' : ''}
                                    </p>
                                </div>
                                <Link href="/admin/opponent-teams/create">
                                    <Button size="lg" className="bg-white text-primary hover:bg-white/95 shadow-xl h-12 px-6 text-base font-semibold">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Nouvelle Équipe
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une équipe..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 h-12 bg-white border-2 border-primary/10 focus:border-primary rounded-xl text-base"
                            />
                        </div>
                    </div>

                    {/* Leaderboard by Category */}
                    {Object.keys(teamsByCategory).length > 0 ? (
                        <div className="space-y-6">
                            {Object.keys(teamsByCategory).sort((a, b) => {
                                if (a === 'Senior') return -1;
                                if (b === 'Senior') return 1;
                                return a.localeCompare(b);
                            }).map((category, catIndex) => {
                                const categoryTeams = teamsByCategory[category];
                                if (categoryTeams.length === 0) return null;

                                return (
                                    <Card key={category} className="border-0 shadow-xl overflow-hidden bg-white">
                                        <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
                                            <div className="flex items-center gap-3">
                                                <Trophy className="w-6 h-6 text-white" />
                                                <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                                                    Classement - {category}
                                                </h2>
                                                <Badge className="bg-white/30 text-white border-0 ml-auto">
                                                    {categoryTeams.length} équipe{categoryTeams.length > 1 ? 's' : ''}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-primary/5 border-b-2 border-primary/20">
                                                            <th className="px-6 py-4 text-left font-black text-sm uppercase tracking-wide text-primary">RANG</th>
                                                            <th className="px-6 py-4 text-left font-black text-sm uppercase tracking-wide text-primary">ÉQUIPE</th>
                                                            <th className="px-6 py-4 text-center font-black text-sm uppercase tracking-wide text-primary">J</th>
                                                            <th className="px-6 py-4 text-center font-black text-sm uppercase tracking-wide text-green-600">G</th>
                                                            <th className="px-6 py-4 text-center font-black text-sm uppercase tracking-wide text-yellow-600">N</th>
                                                            <th className="px-6 py-4 text-center font-black text-sm uppercase tracking-wide text-red-600">P</th>
                                                            <th className="px-6 py-4 text-center font-black text-sm uppercase tracking-wide text-primary">BP</th>
                                                            <th className="px-6 py-4 text-center font-black text-sm uppercase tracking-wide text-primary">BC</th>
                                                            <th className="px-6 py-4 text-center font-black text-sm uppercase tracking-wide text-primary">DIFF</th>
                                                            <th className="px-6 py-4 text-center font-black text-sm uppercase tracking-wide text-primary">PTS</th>
                                                            <th className="px-6 py-4 text-center font-black text-sm uppercase tracking-wide text-primary">ACTIONS</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {categoryTeams.map((team) => {
                                                            const rank = team.rank;
                                                            const isTopThree = rank <= 3;
                                                            const isOurTeam = !team.is_opponent;
                                                            
                                                            return (
                                                                <tr 
                                                                    key={team.id}
                                                                    className={`border-b border-primary/10 hover:bg-primary/5 transition-colors ${
                                                                        isTopThree ? 'bg-primary/5' : ''
                                                                    } ${isOurTeam ? 'bg-primary/10 font-semibold ring-2 ring-primary/20' : ''}`}
                                                                >
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`font-black text-lg ${
                                                                                rank === 1 ? 'text-yellow-600' : 
                                                                                rank === 2 ? 'text-gray-400' : 
                                                                                rank === 3 ? 'text-orange-600' : 
                                                                                'text-gray-600'
                                                                            }`}>
                                                                                {rank}
                                                                            </span>
                                                                            {getRankIcon(rank)}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            {team.logo ? (
                                                                                <img 
                                                                                    src={`/storage/${team.logo}`} 
                                                                                    alt={team.name}
                                                                                    className="w-12 h-12 object-cover rounded-full border-2 border-primary/20"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-black text-lg">
                                                                                    {team.name[0]}
                                                                                </div>
                                                                            )}
                                                                            <div>
                                                                                <div className="font-bold text-foreground flex items-center gap-2">
                                                                                    {team.name}
                                                                                    {isOurTeam && (
                                                                                        <Badge className="bg-primary text-white border-0 text-xs">
                                                                                            Notre équipe
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                {isOurTeam && team.category && (
                                                                                    <Badge variant="outline" className="mt-1 text-xs bg-primary/10 text-primary border-primary/20">
                                                                                        {team.category}
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center font-bold text-foreground">
                                                                        {team.matches_played || 0}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        <span className="inline-block px-3 py-1 rounded-lg bg-green-500/10 text-green-700 font-bold text-sm border border-green-500/20">
                                                                            {team.wins || 0}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        <span className="inline-block px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-700 font-bold text-sm border border-yellow-500/20">
                                                                            {team.draws || 0}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        <span className="inline-block px-3 py-1 rounded-lg bg-red-500/10 text-red-700 font-bold text-sm border border-red-500/20">
                                                                            {team.losses || 0}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center font-bold text-foreground">
                                                                        {team.goals_for || 0}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center font-bold text-foreground">
                                                                        {team.goals_against || 0}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        <span className={`font-black text-base ${
                                                                            (team.goal_difference || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                            {(team.goal_difference || 0) >= 0 ? '+' : ''}{team.goal_difference || 0}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        <span className="font-black text-xl text-primary">
                                                                            {team.points || 0}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            {team.is_opponent ? (
                                                                                <>
                                                                                    <Link href={`/admin/opponent-teams/${team.id}/edit`}>
                                                                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-primary/10">
                                                                                            <Edit className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </Link>
                                                                                    <Button 
                                                                                        variant="ghost" 
                                                                                        size="sm" 
                                                                                        className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                                                                                        onClick={() => handleDelete(team.id)}
                                                                                    >
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                    </Button>
                                                                                </>
                                                                            ) : (
                                                                                <Link href={`/admin/teams/${team.id}`}>
                                                                                    <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10">
                                                                                        Voir
                                                                                    </Button>
                                                                                </Link>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-xl overflow-hidden bg-white">
                            <CardContent className="p-0">
                                <div className="text-center py-20">
                                    <div className="max-w-md mx-auto space-y-4">
                                        <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                                            <Trophy className="w-10 h-10 text-primary/50" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">Aucune équipe enregistrée</h3>
                                        <p className="text-muted-foreground">
                                            {search 
                                                ? 'Aucune équipe ne correspond à votre recherche'
                                                : 'Commencez par ajouter votre première équipe adverse'
                                            }
                                        </p>
                                        {!search && (
                                            <Link href="/admin/opponent-teams/create">
                                                <Button size="lg" className="mt-4 bg-primary hover:bg-primary/90 text-white">
                                                    <Plus className="w-5 h-5 mr-2" />
                                                    Ajouter une équipe
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
