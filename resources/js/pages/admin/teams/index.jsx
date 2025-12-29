import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Plus, Edit, Trash2, Eye, Search, Filter, Users, Trophy, 
    Baby, UserCircle2, TrendingUp, Sparkles, Calendar, X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Category icons mapping
const categoryIcons = {
    'U13': Baby,
    'U15': UserCircle2,
    'U17': TrendingUp,
    'Senior': Trophy,
};

const categoryColors = {
    'U13': 'bg-blue-100 text-blue-600 border-blue-200',
    'U15': 'bg-purple-100 text-purple-600 border-purple-200',
    'U17': 'bg-green-100 text-green-600 border-green-200',
    'Senior': 'bg-primary/10 text-primary border-primary/20',
};

export default function TeamsIndex({ teams, seasons, filters }) {
    const { data, setData, get } = useForm({
        search: filters?.search || '',
        category: filters?.category || '',
        season_id: filters?.season_id || '',
        is_active: filters?.is_active ?? '',
    });

    const timeoutRef = useRef(null);

    // Real-time filtering with debounce
    useEffect(() => {
        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for search (debounced)
        if (data.search !== (filters?.search || '')) {
            timeoutRef.current = setTimeout(() => {
                get('/admin/teams', {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['teams', 'filters'],
                });
            }, 300);
        } else {
            // For non-search filters, apply immediately
            if (data.category !== (filters?.category || '') || 
                data.season_id !== (filters?.season_id || '') || 
                data.is_active !== (filters?.is_active ?? '')) {
                get('/admin/teams', {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['teams', 'filters'],
                });
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data.search, data.category, data.season_id, data.is_active]);

    const handleReset = () => {
        setData({
            search: '',
            category: '',
            season_id: '',
            is_active: '',
        });
        get('/admin/teams', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
            router.delete(`/admin/teams/${id}`);
        }
    };

    const CategoryIcon = categoryIcons['Senior']; // Default
    const hasActiveFilters = data.search || data.category || data.season_id || data.is_active !== '';

    return (
        <AdminLayout>
            <Head title="Équipes" />
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
                        <h1 className="text-3xl font-black uppercase italic text-dark">Équipes</h1>
                            </div>
                            <p className="text-muted-foreground">Gestion des équipes de votre club</p>
                    </div>
                    <Link href="/admin/teams/create">
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Équipe
                        </Button>
                    </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                {teams.data.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Équipes</p>
                                        <p className="text-3xl font-black text-dark">{teams.data.length}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Équipes Actives</p>
                                        <p className="text-3xl font-black text-green-600">
                                            {teams.data.filter(t => t.is_active).length}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-green-500/10">
                                        <Sparkles className="w-6 h-6 text-green-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Joueuses</p>
                                        <p className="text-3xl font-black text-dark">
                                            {teams.data.reduce((sum, t) => sum + (t.players_count || 0), 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-500/10">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Catégories</p>
                                        <p className="text-3xl font-black text-dark">
                                            {new Set(teams.data.map(t => t.category)).size}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-purple-500/10">
                                        <Trophy className="w-6 h-6 text-purple-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Search and Filters */}
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
                                        {data.search && (
                                            <Badge variant="secondary" className="gap-1">
                                                <Search className="w-3 h-3" />
                                                {data.search}
                                                <X 
                                                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                                    onClick={() => {
                                                        setData('search', '');
                                                    }}
                                                />
                                            </Badge>
                                        )}
                                        {data.category && (
                                            <Badge variant="secondary" className="gap-1">
                                                {data.category}
                                                <X 
                                                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                                    onClick={() => {
                                                        setData('category', '');
                                                    }}
                                                />
                                            </Badge>
                                        )}
                                        {data.season_id && (
                                            <Badge variant="secondary" className="gap-1">
                                                {seasons.find(s => s.id.toString() === data.season_id)?.name}
                                                <X 
                                                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                                    onClick={() => {
                                                        setData('season_id', '');
                                                    }}
                                                />
                                            </Badge>
                                        )}
                                        {data.is_active !== '' && (
                                            <Badge variant="secondary" className="gap-1">
                                                {data.is_active === '1' ? 'Actif' : 'Inactif'}
                                                <X 
                                                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                                    onClick={() => {
                                                        setData('is_active', '');
                                                    }}
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
                                <label className="text-sm font-medium text-muted-foreground">Recherche</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Nom de l'équipe..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-10 bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
                                <Select value={data.category || 'all'} onValueChange={(value) => setData('category', value === 'all' ? '' : value)}>
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
                                <label className="text-sm font-medium text-muted-foreground">Saison</label>
                                <Select value={data.season_id || 'all'} onValueChange={(value) => setData('season_id', value === 'all' ? '' : value)}>
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
                                <label className="text-sm font-medium text-muted-foreground">Statut</label>
                                <Select value={data.is_active === '' ? 'all' : data.is_active} onValueChange={(value) => setData('is_active', value === 'all' ? '' : value)}>
                                    <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                        <SelectValue placeholder="Tous les statuts" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="1">Actif</SelectItem>
                                        <SelectItem value="0">Inactif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                {teams.data.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>
                            <span className="font-semibold text-foreground">{teams.data.length}</span> équipe{teams.data.length > 1 ? 's' : ''} trouvée{teams.data.length > 1 ? 's' : ''}
                        </p>
                        {hasActiveFilters && (
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <span>Filtres actifs</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Teams Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {teams.data.map((team, index) => {
                        const IconComponent = categoryIcons[team.category] || categoryIcons['Senior'];
                        const categoryColor = categoryColors[team.category] || categoryColors['Senior'];
                        
                        return (
                            <Card 
                                key={team.id}
                                className="group relative overflow-hidden bg-white border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Top accent bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                                    team.is_active 
                                        ? 'from-green-500 via-green-400 to-transparent' 
                                        : 'from-gray-300 via-gray-200 to-transparent'
                                }`}></div>

                                <CardHeader className="pb-3 relative">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            {/* Category Badge */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`${categoryColor} border shrink-0 flex items-center gap-1`}
                                                >
                                                    <IconComponent className="w-3 h-3" />
                                                    {team.category}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors mb-1">
                                                {team.name}
                                            </CardTitle>
                                            {team.season && (
                                                <CardDescription className="flex items-center gap-1 text-xs">
                                                    <Calendar className="w-3 h-3" />
                                                    {team.season.name}
                                                </CardDescription>
                                            )}
                                        </div>
                                        {team.is_active && (
                                            <Badge 
                                                variant="default" 
                                                className="bg-green-500/90 text-white shrink-0 shadow-lg shadow-green-500/30"
                                            >
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                Active
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="pt-0 space-y-4">
                                    {/* Quick Stats */}
                                    <div className="flex items-center gap-4 py-2 px-3 rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-primary/70" />
                                            <span className="font-semibold text-foreground">{team.players_count}</span>
                                            <span className="text-muted-foreground text-xs">joueuse(s)</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2 border-t border-border/50">
                                        <Link href={`/admin/teams/${team.id}`} className="flex-1">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30 text-primary hover:text-primary font-medium transition-all"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Voir
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/teams/${team.id}/edit`} className="flex-1">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full hover:bg-muted/50"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Modifier
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleDelete(team.id)}
                                            className="shrink-0 hover:shadow-lg hover:shadow-destructive/20 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                </div>
                            </CardContent>
                        </Card>
                        );
                    })}
                </div>

                {/* Empty State */}
                {teams.data.length === 0 && (
                    <Card className="bg-card/60 backdrop-blur-sm border-dashed border-2 border-border/50">
                        <CardContent className="py-16 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-full bg-muted/30">
                                    <Users className="w-12 h-12 text-muted-foreground/50" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">Aucune équipe trouvée</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        {hasActiveFilters 
                                            ? 'Aucun résultat ne correspond à vos critères de recherche'
                                            : 'Commencez par créer votre première équipe'}
                                    </p>
                                    {!hasActiveFilters && (
                                        <Link href="/admin/teams/create">
                                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Créer la première équipe
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
