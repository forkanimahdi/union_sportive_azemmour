import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Home, Plane, Trophy, Clock, Search, X, Calendar, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function MatchesIndex({ matches, seasons = [] }) {
    const [search, setSearch] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

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
        
        // Sort newest to oldest
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
    }, [matches.data, search, seasonFilter, categoryFilter]);

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

    const hasActiveFilters = search || seasonFilter || categoryFilter;

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
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative flex-1 min-w-[280px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un match..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 h-12 bg-white border-2 border-primary/10 focus:border-primary rounded-xl text-base"
                            />
                        </div>
                        <Select value={seasonFilter || 'all'} onValueChange={(value) => setSeasonFilter(value === 'all' ? '' : value)}>
                            <SelectTrigger className="h-12 w-[200px] bg-white border-2 border-primary/10 rounded-xl">
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
                            <SelectTrigger className="h-12 w-[200px] bg-white border-2 border-primary/10 rounded-xl">
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
                        {hasActiveFilters && (
                            <Button 
                                variant="outline" 
                                onClick={() => { setSearch(''); setSeasonFilter(''); setCategoryFilter(''); }} 
                                className="h-12 px-4 bg-white border-2 border-primary/10 rounded-xl"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Réinitialiser
                            </Button>
                        )}
                    </div>

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
                                        
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {categoryMatches.map((match) => {
                                                const status = statusConfig[match.status] || statusConfig.scheduled;
                                                const StatusIcon = status.icon;
                                                
                                                return (
                                                    <Card
                                                        key={match.id}
                                                        className="group relative overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl bg-white cursor-pointer"
                                                        onClick={() => router.visit(`/admin/matches/${match.id}`)}
                                                    >
                                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}></div>
                                                        
                                                        <CardContent className="p-5 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <Badge className={`${status.color} border`}>
                                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                                    {status.label}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {category}
                                                                </Badge>
                                                            </div>

                                                            <div className="text-center space-y-2">
                                                                <p className="font-bold text-sm text-primary">{match.team?.name || 'Équipe'}</p>
                                                                <div className="text-3xl font-black text-primary my-2">VS</div>
                                                                {match.opponent_team ? (
                                                                    <>
                                                                        {match.opponent_team.logo && (
                                                                            <img 
                                                                                src={`/storage/${match.opponent_team.logo}`} 
                                                                                alt={match.opponent_team.name}
                                                                                className="w-16 h-16 mx-auto mb-2 rounded-full object-cover border-2 border-primary/20"
                                                                            />
                                                                        )}
                                                                        <p className="font-bold text-sm">{match.opponent_team.name}</p>
                                                                    </>
                                                                ) : (
                                                                    <p className="font-bold text-sm">{match.opponent}</p>
                                                                )}
                                                            </div>

                                                            {(match.home_score !== null && match.away_score !== null) && (
                                                                <div className="text-center py-2 bg-primary/5 rounded-lg border border-primary/10">
                                                                    <div className="text-2xl font-black text-primary">
                                                                        {match.type === 'domicile' 
                                                                            ? `${match.home_score} - ${match.away_score}`
                                                                            : `${match.away_score} - ${match.home_score}`
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="space-y-2 pt-3 border-t border-primary/10">
                                                                <div className="flex items-center justify-between text-xs">
                                                                    <span className="flex items-center gap-1 text-muted-foreground">
                                                                        {match.type === 'domicile' ? (
                                                                            <Home className="w-3 h-3" />
                                                                        ) : (
                                                                            <Plane className="w-3 h-3" />
                                                                        )}
                                                                        {match.type === 'domicile' ? 'Domicile' : 'Extérieur'}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-muted-foreground">
                                                                        <Clock className="w-3 h-3" />
                                                                        {new Date(match.scheduled_at).toLocaleDateString('fr-FR', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                                {match.venue && (
                                                                    <p className="text-xs text-muted-foreground text-center truncate">
                                                                        {match.venue}
                                                                    </p>
                                                                )}
                                                            </div>
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
