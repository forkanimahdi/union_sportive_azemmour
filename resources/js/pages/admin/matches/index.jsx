import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Home, Plane, Trophy, Clock, Search, X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function MatchesIndex({ matches, seasons = [] }) {
    const [search, setSearch] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredMatches = useMemo(() => {
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
        
        if (statusFilter) {
            allMatches = allMatches.filter(match => match.status === statusFilter);
        }
        
        return allMatches;
    }, [matches.data, search, seasonFilter, categoryFilter, statusFilter]);

    const statusColors = {
        scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
        live: 'bg-red-100 text-red-700 border-red-200',
        finished: 'bg-green-100 text-green-700 border-green-200',
        postponed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const statusLabels = {
        scheduled: 'Programmé',
        live: 'En direct',
        finished: 'Terminé',
        postponed: 'Reporté',
        cancelled: 'Annulé',
    };

    const hasActiveFilters = search || seasonFilter || categoryFilter || statusFilter;

    const handleReset = () => {
        setSearch('');
        setSeasonFilter('');
        setCategoryFilter('');
        setStatusFilter('');
    };

    return (
        <AdminLayout>
            <Head title="Matchs" />
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
                                <h1 className="text-3xl font-black uppercase italic text-dark">Matchs</h1>
                            </div>
                            <p className="text-muted-foreground">Programmation et gestion des matchs</p>
                        </div>
                        <Link href="/admin/matches/create">
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Programmer un Match
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-primary" />
                                Recherche et Filtres
                            </CardTitle>
                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={handleReset}>
                                    <X className="w-4 h-4 mr-2" />
                                    Réinitialiser
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Select value={seasonFilter || 'all'} onValueChange={(value) => setSeasonFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                        <SelectValue placeholder="Toutes les saisons" />
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
                            </div>
                            <div className="space-y-2">
                                <Select value={categoryFilter || 'all'} onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                        <SelectValue placeholder="Toutes les catégories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les catégories</SelectItem>
                                        <SelectItem value="U13">U13</SelectItem>
                                        <SelectItem value="U15">U15</SelectItem>
                                        <SelectItem value="U17">U17</SelectItem>
                                        <SelectItem value="Senior">Senior</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                        <SelectValue placeholder="Tous les statuts" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="scheduled">Programmé</SelectItem>
                                        <SelectItem value="live">En direct</SelectItem>
                                        <SelectItem value="finished">Terminé</SelectItem>
                                        <SelectItem value="postponed">Reporté</SelectItem>
                                        <SelectItem value="cancelled">Annulé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Matches Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMatches.map((match) => (
                        <Card 
                            key={match.id}
                            className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => router.visit(`/admin/matches/${match.id}`)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <Badge className={statusColors[match.status] || ''}>
                                        {statusLabels[match.status] || match.status}
                                    </Badge>
                                    <Badge variant="outline">
                                        {match.category}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-bold text-lg">{match.team?.name || 'Équipe'}</p>
                                        <p className="text-sm text-muted-foreground">{match.team?.category}</p>
                                    </div>
                                    <div className="text-2xl font-black text-primary">VS</div>
                                    <div className="flex-1 text-right">
                                        {match.opponent_team ? (
                                            <>
                                                {match.opponent_team.logo && (
                                                    <img 
                                                        src={`/storage/${match.opponent_team.logo}`} 
                                                        alt={match.opponent_team.name}
                                                        className="w-10 h-10 mx-auto mb-2 rounded-full object-cover"
                                                    />
                                                )}
                                                <p className="font-bold text-lg">{match.opponent_team.name}</p>
                                            </>
                                        ) : (
                                            <p className="font-bold text-lg">{match.opponent}</p>
                                        )}
                                    </div>
                                </div>

                                {(match.home_score !== null && match.away_score !== null) && (
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-primary">
                                            {match.type === 'domicile' 
                                                ? `${match.home_score} - ${match.away_score}`
                                                : `${match.away_score} - ${match.home_score}`
                                            }
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                                    <div className="flex items-center gap-2">
                                        {match.type === 'domicile' ? (
                                            <Home className="w-4 h-4" />
                                        ) : (
                                            <Plane className="w-4 h-4" />
                                        )}
                                        <span>{match.type === 'domicile' ? 'Domicile' : 'Extérieur'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(match.scheduled_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                </div>

                                <div className="text-xs text-muted-foreground text-center">
                                    {match.venue}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredMatches.length === 0 && (
                    <Card className="bg-card/60 backdrop-blur-sm border-dashed border-2 border-border/50">
                        <CardContent className="py-16 text-center">
                            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">
                                {hasActiveFilters ? 'Aucun match trouvé' : 'Aucun match programmé'}
                            </h3>
                            {!hasActiveFilters && (
                                <Link href="/admin/matches/create">
                                    <Button className="mt-4">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Programmer le premier match
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
