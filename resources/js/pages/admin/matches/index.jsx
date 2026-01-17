import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Home, Plane, Trophy, Clock, Search, X, Calendar, Radio, Users, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function MatchesIndex({ matches, seasons = [], teams = [] }) {
    const [search, setSearch] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [teamFilter, setTeamFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [dayFilter, setDayFilter] = useState('');

    const groupedMatches = useMemo(() => {
        let allMatches = matches.data || [];
        
        if (search) {
            const searchLower = search.toLowerCase();
            allMatches = allMatches.filter(match => 
                match.team?.name?.toLowerCase().includes(searchLower) ||
                match.opponent?.toLowerCase().includes(searchLower) ||
                match.opponent_team?.name?.toLowerCase().includes(searchLower)
            );
        }
        
        if (seasonFilter) {
            allMatches = allMatches.filter(match => 
                match.team?.season_id?.toString() === seasonFilter
            );
        }
        
        if (categoryFilter) {
            allMatches = allMatches.filter(match => match.category === categoryFilter);
        }
        
        if (teamFilter) {
            allMatches = allMatches.filter(match => 
                match.team?.id?.toString() === teamFilter
            );
        }
        
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            allMatches = allMatches.filter(match => {
                const matchDate = new Date(match.scheduled_at);
                return matchDate.toDateString() === filterDate.toDateString();
            });
        }
        
        if (dayFilter) {
            allMatches = allMatches.filter(match => {
                const matchDate = new Date(match.scheduled_at);
                const dayOfWeek = matchDate.getDay();
                const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                return dayNames[dayOfWeek].toLowerCase() === dayFilter.toLowerCase();
            });
        }
        
        // Sort by date (newest first)
        allMatches.sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));
        
        // Group by category
        const grouped = {};
        allMatches.forEach(match => {
            const category = match.category || 'Autre';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(match);
        });
        
        return grouped;
    }, [matches.data, search, seasonFilter, categoryFilter, teamFilter, dateFilter, dayFilter]);

    const formatMatchDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long'
        }).toUpperCase();
    };

    const formatMatchTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const statusConfig = {
        scheduled: { label: 'Programmé', color: 'bg-blue-500/10 text-blue-700 border-blue-500/20', icon: Calendar },
        live: { label: 'En direct', color: 'bg-red-500/10 text-red-700 border-red-500/20', icon: Radio },
        finished: { label: 'Terminé', color: 'bg-green-500/10 text-green-700 border-green-500/20', icon: Trophy },
        postponed: { label: 'Reporté', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20', icon: Calendar },
        cancelled: { label: 'Annulé', color: 'bg-gray-500/10 text-gray-700 border-gray-500/20', icon: X },
    };

    const categoryColors = {
        'U13': 'from-blue-500 to-blue-600',
        'U15': 'from-purple-500 to-purple-600',
        'U17': 'from-green-500 to-green-600',
        'Senior': 'from-primary to-primary/80',
    };

    const hasActiveFilters = search || seasonFilter || categoryFilter || teamFilter || dateFilter || dayFilter;

    return (
        <AdminLayout>
            <Head title="Matchs" />
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
                                            <Trophy className="w-8 h-8 text-white" />
                                        </div>
                                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tight">
                                            Calendrier des Matchs
                                        </h1>
                                    </div>
                                    <p className="text-white/90 text-lg ml-14">
                                        Suivez tous vos matchs en temps réel
                                    </p>
                                </div>
                                <Link href="/admin/matches/create">
                                    <Button size="lg" className="bg-white text-primary hover:bg-white/95 shadow-xl h-12 px-6 text-base font-semibold">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Programmer un Match
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="bg-white border-2 border-gray-200">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <span className="font-semibold text-gray-700">Filtres:</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Rechercher..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 h-11 bg-white border-2 border-gray-200 focus:border-alpha rounded-lg"
                                    />
                                </div>
                                <Select value={seasonFilter || 'all'} onValueChange={(value) => setSeasonFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 rounded-lg">
                                        <SelectValue placeholder="Saison" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les saisons</SelectItem>
                                        {seasons.map((season) => (
                                            <SelectItem key={season.id} value={season.id.toString()}>
                                                {season.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={categoryFilter || 'all'} onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 rounded-lg">
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les catégories</SelectItem>
                                        <SelectItem value="U13">U13</SelectItem>
                                        <SelectItem value="U15">U15</SelectItem>
                                        <SelectItem value="U17">U17</SelectItem>
                                        <SelectItem value="Senior">Senior</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={teamFilter || 'all'} onValueChange={(value) => setTeamFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 rounded-lg">
                                        <SelectValue placeholder="Équipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les équipes</SelectItem>
                                        {teams.map((team) => (
                                            <SelectItem key={team.id} value={team.id.toString()}>
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="h-11 bg-white border-2 border-gray-200 focus:border-alpha rounded-lg"
                                    placeholder="Date"
                                />
                                <Select value={dayFilter || 'all'} onValueChange={(value) => setDayFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 rounded-lg">
                                        <SelectValue placeholder="Jour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les jours</SelectItem>
                                        <SelectItem value="lundi">Lundi</SelectItem>
                                        <SelectItem value="mardi">Mardi</SelectItem>
                                        <SelectItem value="mercredi">Mercredi</SelectItem>
                                        <SelectItem value="jeudi">Jeudi</SelectItem>
                                        <SelectItem value="vendredi">Vendredi</SelectItem>
                                        <SelectItem value="samedi">Samedi</SelectItem>
                                        <SelectItem value="dimanche">Dimanche</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {hasActiveFilters && (
                                <div className="mt-4">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => { 
                                            setSearch(''); 
                                            setSeasonFilter(''); 
                                            setCategoryFilter(''); 
                                            setTeamFilter(''); 
                                            setDateFilter(''); 
                                            setDayFilter(''); 
                                        }} 
                                        className="h-10 px-4 border-2 border-gray-200 rounded-lg"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Réinitialiser
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Matches by Category */}
                    {Object.keys(groupedMatches).length > 0 ? (
                        <div className="space-y-8">
                            {Object.entries(groupedMatches).map(([category, categoryMatches]) => {
                                const gradient = categoryColors[category] || 'from-primary to-primary/80';
                                
                                return (
                                    <div key={category} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-1 w-12 bg-gradient-to-r ${gradient} rounded-full`}></div>
                                            <h2 className="text-2xl font-black text-foreground">{category}</h2>
                                            <Badge className={`bg-gradient-to-r ${gradient} text-white border-0`}>
                                                {categoryMatches.length} match{categoryMatches.length > 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {categoryMatches.map((match) => {
                                                const isHome = match.type === 'domicile';
                                                const played = match.status === 'finished' && match.home_score !== null && match.away_score !== null;
                                                
                                                // Determine left and right teams based on home/away
                                                const leftTeam = isHome ? {
                                                    name: match.team?.name || 'Notre équipe',
                                                    logo: null
                                                } : {
                                                    name: match.opponent_team?.name || match.opponent,
                                                    logo: match.opponent_team?.logo
                                                };
                                                
                                                const rightTeam = isHome ? {
                                                    name: match.opponent_team?.name || match.opponent,
                                                    logo: match.opponent_team?.logo
                                                } : {
                                                    name: match.team?.name || 'Notre équipe',
                                                    logo: null
                                                };
                                                
                                                // Determine scores
                                                const leftScore = isHome ? match.home_score : match.away_score;
                                                const rightScore = isHome ? match.away_score : match.home_score;
                                                
                                                return (
                                                    <Card
                                                        key={match.id}
                                                        className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                                        onClick={() => router.visit(`/admin/matches/${match.id}`)}
                                                    >
                                                        <CardContent className="p-6">
                                                            {/* Teams and Score */}
                                                            <div className="flex items-center justify-between mb-4">
                                                                {/* Left Team */}
                                                                <div className="flex-1 text-center">
                                                                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                                                                        {leftTeam.logo ? (
                                                                            <img 
                                                                                src={`/storage/${leftTeam.logo}`} 
                                                                                alt={leftTeam.name}
                                                                                className="w-12 h-12 rounded-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <Users className="w-6 h-6 text-gray-400" />
                                                                        )}
                                                                    </div>
                                                                    <div className="font-bold text-sm text-gray-900">{leftTeam.name}</div>
                                                                </div>

                                                                {/* Score Box */}
                                                                <div className={`px-4 py-2 rounded-lg ${played ? 'bg-alpha/10' : 'bg-gray-100'}`}>
                                                                    <div className={`text-2xl font-black ${played ? 'text-alpha' : 'text-gray-500'}`}>
                                                                        {played 
                                                                            ? `${leftScore !== null ? leftScore : '-'} - ${rightScore !== null ? rightScore : '-'}`
                                                                            : '0 - 0'
                                                                        }
                                                                    </div>
                                                                </div>

                                                                {/* Right Team */}
                                                                <div className="flex-1 text-center">
                                                                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                                                                        {rightTeam.logo ? (
                                                                            <img 
                                                                                src={`/storage/${rightTeam.logo}`} 
                                                                                alt={rightTeam.name}
                                                                                className="w-12 h-12 rounded-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <Users className="w-6 h-6 text-gray-400" />
                                                                        )}
                                                                    </div>
                                                                    <div className="font-bold text-sm text-gray-900">{rightTeam.name}</div>
                                                                </div>
                                                            </div>

                                                            {/* Match Details */}
                                                            <div className="space-y-2 mb-4">
                                                                <div className="text-xs text-gray-500 font-medium">
                                                                    {formatMatchDate(match.scheduled_at)} • {match.venue?.toUpperCase()}
                                                                </div>
                                                                <div className={`text-lg font-bold ${played ? 'text-alpha' : 'text-gray-700'}`}>
                                                                    {formatMatchTime(match.scheduled_at)}
                                                                </div>
                                                            </div>

                                                            {/* Status Badge */}
                                                            <div className="flex items-center justify-between mb-4">
                                                                {match.status === 'finished' && (
                                                                    <Badge className="bg-alpha/10 text-alpha border-alpha">
                                                                        Terminé
                                                                    </Badge>
                                                                )}
                                                                {match.status === 'scheduled' && (
                                                                    <Badge className="bg-beta/10 text-beta border-beta">
                                                                        À venir
                                                                    </Badge>
                                                                )}
                                                                {match.status === 'live' && (
                                                                    <Badge className="bg-red-100 text-red-600 border-red-300 animate-pulse">
                                                                        En direct
                                                                    </Badge>
                                                                )}
                                                                {match.status === 'postponed' && (
                                                                    <Badge className="bg-yellow-100 text-yellow-600 border-yellow-300">
                                                                        Reporté
                                                                    </Badge>
                                                                )}
                                                                {match.status === 'cancelled' && (
                                                                    <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                                                                        Annulé
                                                                    </Badge>
                                                                )}
                                                                
                                                                <div className={`text-xs font-semibold ${isHome ? 'text-alpha' : 'text-beta'}`}>
                                                                    {isHome ? '🏠 Domicile' : '✈️ Extérieur'}
                                                                </div>
                                                            </div>

                                                            {/* Competition if available */}
                                                            {match.competition && (
                                                                <div className="text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                                                                    {match.competition}
                                                                </div>
                                                            )}

                                                            {/* Action Button */}
                                                            <Button
                                                                variant="outline"
                                                                className="w-full bg-alpha text-white hover:bg-alpha/90 border-alpha"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.visit(`/admin/matches/${match.id}`);
                                                                }}
                                                            >
                                                                {played ? 'Voir les détails' : 'Gérer le match'}
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="border-2 border-dashed border-primary/20 bg-white/50">
                            <CardContent className="py-20 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                                        <Trophy className="w-10 h-10 text-primary/50" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        {hasActiveFilters ? 'Aucun match trouvé' : 'Aucun match programmé'}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {hasActiveFilters 
                                            ? 'Essayez de modifier vos critères de recherche'
                                            : 'Programmez votre premier match pour commencer'
                                        }
                                    </p>
                                    {!hasActiveFilters && (
                                        <Link href="/admin/matches/create">
                                            <Button size="lg" className="mt-4 bg-primary hover:bg-primary/90 text-white">
                                                <Plus className="w-5 h-5 mr-2" />
                                                Programmer un match
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}








