import React, { useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Users, X, Sparkles, TrendingUp, Activity } from 'lucide-react';
import PlayerCard from '../../../components/admin/PlayerCard';
import { Badge } from '@/components/ui/badge';

export default function PlayersIndex({ players, teams }) {
    const [search, setSearch] = useState('');
    const [teamId, setTeamId] = useState('');
    const [position, setPosition] = useState('');

    // Frontend filtering with useMemo
    const filteredPlayers = useMemo(() => {
        let allPlayers = players.data || [];
        
        if (search) {
            const searchLower = search.toLowerCase();
            allPlayers = allPlayers.filter(player => 
                `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchLower) ||
                player.first_name?.toLowerCase().includes(searchLower) ||
                player.last_name?.toLowerCase().includes(searchLower)
            );
        }
        
        if (teamId) {
            allPlayers = allPlayers.filter(player => 
                player.team?.id?.toString() === teamId.toString()
            );
        }
        
        if (position) {
            allPlayers = allPlayers.filter(player => 
                player.position === position
            );
        }
        
        return allPlayers;
    }, [players.data, search, teamId, position]);

    const handleReset = () => {
        setSearch('');
        setTeamId('');
        setPosition('');
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette joueuse ?')) {
            router.delete(`/admin/players/${id}`);
        }
    };

    const hasActiveFilters = search || teamId || position;

    return (
        <AdminLayout>
            <Head title="Joueuses" />
            <div className="space-y-6">
                {/* Header with gradient */}
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                    <div className="relative flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-black uppercase italic text-dark">Joueuses</h1>
                            </div>
                            <p className="text-muted-foreground">Gestion des joueuses de votre club</p>
                        </div>
                        <Link href="/admin/players/create">
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvelle Joueuse
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                {(players.data?.length > 0 || filteredPlayers.length > 0) && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Joueuses</p>
                                        <p className="text-3xl font-black text-dark">{players.data?.length || 0}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Disponibles</p>
                                        <p className="text-3xl font-black text-green-600">
                                            {(players.data || []).filter(p => p.can_play).length}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                                        <Users className="w-6 h-6 text-green-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Équipes</p>
                                        <p className="text-3xl font-black text-dark">
                                            {new Set((players.data || []).filter(p => p.team).map(p => p.team?.id)).size}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-primary" />
                                Recherche et Filtres
                            </CardTitle>
                            {hasActiveFilters && (
                                <div className="flex items-center gap-2">
                                    {/* Active Filters Badges */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {search && (
                                            <Badge variant="secondary" className="gap-1">
                                                <Search className="w-3 h-3" />
                                                {search}
                                                <X 
                                                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                                    onClick={() => setSearch('')}
                                                />
                                            </Badge>
                                        )}
                                        {teamId && (
                                            <Badge variant="secondary" className="gap-1">
                                                <Users className="w-3 h-3" />
                                                {teams.find(t => t.id.toString() === teamId)?.name}
                                                <X 
                                                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                                    onClick={() => setTeamId('')}
                                                />
                                            </Badge>
                                        )}
                                        {position && (
                                            <Badge variant="secondary" className="gap-1">
                                                {position}
                                                <X 
                                                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                                    onClick={() => setPosition('')}
                                                />
                                            </Badge>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={handleReset}>
                                        <X className="w-4 h-4 mr-2" />
                                        Réinitialiser
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Search className="w-4 h-4 text-primary" />
                                    Recherche
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Nom, prénom..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 bg-white/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Équipe</Label>
                                <Select value={teamId || 'all'} onValueChange={(value) => setTeamId(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                        <SelectValue placeholder="Toutes les équipes" />
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
                            </div>
                            <div className="space-y-2">
                                <Label>Poste</Label>
                                <Select value={position || 'all'} onValueChange={(value) => setPosition(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                        <SelectValue placeholder="Tous les postes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les postes</SelectItem>
                                        <SelectItem value="gardien">Gardien</SelectItem>
                                        <SelectItem value="defenseur">Défenseur</SelectItem>
                                        <SelectItem value="milieu">Milieu</SelectItem>
                                        <SelectItem value="attaquant">Attaquant</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                {hasActiveFilters && (
                                    <Button onClick={handleReset} variant="outline" className="w-full">
                                        <X className="w-4 h-4 mr-2" />
                                        Réinitialiser
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                {filteredPlayers.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>
                            <span className="font-semibold text-foreground">{filteredPlayers.length}</span> joueuse{filteredPlayers.length > 1 ? 's' : ''} trouvée{filteredPlayers.length > 1 ? 's' : ''}
                            {hasActiveFilters && players.data?.length > filteredPlayers.length && (
                                <span className="text-muted-foreground/70"> sur {players.data?.length || 0}</span>
                            )}
                        </p>
                        {hasActiveFilters && (
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                <span>Filtres actifs</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Players Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                    {filteredPlayers.map((player, index) => (
                        <div 
                            key={player.id} 
                            className="relative animate-in fade-in slide-in-from-bottom-4 h-full"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <PlayerCard 
                                player={player}
                                onClick={() => router.visit(`/admin/players/${player.id}`)}
                            />
                            {!player.can_play && (
                                <div className="absolute top-3 right-3 z-10">
                                    <Badge variant="destructive" className="text-xs animate-pulse shadow-lg">
                                        Indisponible
                                    </Badge>
                                </div>
                            )}
                            {player.can_play && (
                                <div className="absolute top-3 right-3 z-10">
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 shadow-lg">
                                        <Activity className="w-3 h-3 mr-1" />
                                        Disponible
                                    </Badge>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredPlayers.length === 0 && (
                    <Card className="bg-card/60 backdrop-blur-sm border-dashed border-2 border-border/50">
                        <CardContent className="py-16 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-full bg-muted/30">
                                    <Users className="w-12 h-12 text-muted-foreground/50" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                        {hasActiveFilters ? 'Aucune joueuse trouvée' : 'Aucune joueuse enregistrée'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        {hasActiveFilters 
                                            ? 'Aucun résultat ne correspond à vos critères de recherche'
                                            : 'Commencez par ajouter votre première joueuse'}
                                    </p>
                                    {!hasActiveFilters && (
                                        <Link href="/admin/players/create" className="inline-block">
                                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Ajouter une joueuse
                                            </Button>
                                        </Link>
                                    )}
                                    {hasActiveFilters && (
                                        <Button onClick={handleReset} variant="outline">
                                            <X className="w-4 h-4 mr-2" />
                                            Réinitialiser les filtres
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
