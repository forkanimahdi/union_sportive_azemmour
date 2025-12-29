import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, Search, Users, Trophy, Baby, UserCircle2, TrendingUp, X, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const categoryIcons = {
    'U13': Baby,
    'U15': UserCircle2,
    'U17': TrendingUp,
    'Senior': Trophy,
};

const categoryColors = {
    'U13': 'from-blue-500 to-blue-600',
    'U15': 'from-purple-500 to-purple-600',
    'U17': 'from-green-500 to-green-600',
    'Senior': 'from-primary to-primary/80',
};

export default function TeamsIndex({ teams, seasons }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [seasonId, setSeasonId] = useState('');

    const filteredTeams = useMemo(() => {
        let filtered = teams.data || [];
        
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(team => 
                team.name.toLowerCase().includes(searchLower) ||
                team.description?.toLowerCase().includes(searchLower)
            );
        }
        
        if (category) {
            filtered = filtered.filter(team => team.category === category);
        }
        
        if (seasonId) {
            filtered = filtered.filter(team => team.season?.id?.toString() === seasonId);
        }
        
        return filtered;
    }, [teams.data, search, category, seasonId]);

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
            router.delete(`/admin/teams/${id}`);
        }
    };

    const CategoryIcon = categoryIcons['Senior'];

    return (
        <AdminLayout>
            <Head title="Équipes" />
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
                                            <Users className="w-8 h-8 text-white" />
                                        </div>
                                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tight">
                                            Nos Équipes
                                        </h1>
                                    </div>
                                    <p className="text-white/90 text-lg ml-14">
                                        Gestion complète de vos équipes
                                    </p>
                                </div>
                                <Link href="/admin/teams/create">
                                    <Button size="lg" className="bg-white text-primary hover:bg-white/95 shadow-xl h-12 px-6 text-base font-semibold">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Nouvelle Équipe
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
                                placeholder="Rechercher une équipe..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 h-12 bg-white border-2 border-primary/10 focus:border-primary rounded-xl text-base"
                            />
                        </div>
                        <Select value={category || 'all'} onValueChange={(value) => setCategory(value === 'all' ? '' : value)}>
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
                        <Select value={seasonId || 'all'} onValueChange={(value) => setSeasonId(value === 'all' ? '' : value)}>
                            <SelectTrigger className="h-12 w-[200px] bg-white border-2 border-primary/10 rounded-xl">
                                <SelectValue placeholder="Saison" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les saisons</SelectItem>
                                {seasons?.map((season) => (
                                    <SelectItem key={season.id} value={season.id.toString()}>
                                        {season.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(search || category || seasonId) && (
                            <Button 
                                variant="outline" 
                                onClick={() => { setSearch(''); setCategory(''); setSeasonId(''); }} 
                                className="h-12 px-4 bg-white border-2 border-primary/10 rounded-xl"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Réinitialiser
                            </Button>
                        )}
                    </div>

                    {/* Stats */}
                    {filteredTeams.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-primary/80 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm mb-2">Total</p>
                                            <p className="text-3xl font-black">{teams.data?.length || 0}</p>
                                        </div>
                                        <Users className="w-8 h-8 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm mb-2">Actives</p>
                                            <p className="text-3xl font-black">
                                                {teams.data?.filter(t => t.is_active).length || 0}
                                            </p>
                                        </div>
                                        <Trophy className="w-8 h-8 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm mb-2">Joueuses</p>
                                            <p className="text-3xl font-black">
                                                {teams.data?.reduce((sum, t) => sum + (t.players_count || 0), 0) || 0}
                                            </p>
                                        </div>
                                        <Users className="w-8 h-8 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm mb-2">Catégories</p>
                                            <p className="text-3xl font-black">
                                                {new Set(teams.data?.map(t => t.category) || []).size}
                                            </p>
                                        </div>
                                        <Trophy className="w-8 h-8 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Teams Grid */}
                    {filteredTeams.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTeams.map((team) => {
                                const Icon = categoryIcons[team.category] || CategoryIcon;
                                const gradient = categoryColors[team.category] || categoryColors['Senior'];
                                
                                return (
                                    <Card
                                        key={team.id}
                                        className="group relative overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl bg-white cursor-pointer"
                                        onClick={() => router.visit(`/admin/teams/${team.id}`)}
                                    >
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}></div>
                                        
                                        <CardContent className="p-6 space-y-5">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">
                                                            {team.name}
                                                        </h3>
                                                        <Badge className={`mt-2 bg-gradient-to-r ${gradient} text-white border-0`}>
                                                            {team.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {team.is_active && (
                                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                                )}
                                            </div>

                                            {team.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {team.description}
                                                </p>
                                            )}

                                            <div className="space-y-2 pt-3 border-t border-primary/10">
                                                {team.season && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-muted-foreground">Saison:</span>
                                                        <span className="font-semibold text-foreground">{team.season.name}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">{team.players_count || 0} joueuse{team.players_count !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-3 border-t border-primary/10">
                                                <Link href={`/admin/teams/${team.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="outline" size="sm" className="w-full border-primary/20 hover:bg-primary/10">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Voir
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/teams/${team.id}/edit`} onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-primary/10">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        handleDelete(team.id); 
                                                    }}
                                                    className="h-9 w-9 p-0 hover:bg-destructive/10 text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="border-2 border-dashed border-primary/20 bg-white/50">
                            <CardContent className="py-20 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                                        <Users className="w-10 h-10 text-primary/50" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">Aucune équipe trouvée</h3>
                                    <p className="text-muted-foreground">
                                        {search || category || seasonId
                                            ? 'Essayez de modifier vos critères de recherche'
                                            : 'Commencez par créer votre première équipe'
                                        }
                                    </p>
                                    {!search && !category && !seasonId && (
                                        <Link href="/admin/teams/create">
                                            <Button size="lg" className="mt-4 bg-primary hover:bg-primary/90 text-white">
                                                <Plus className="w-5 h-5 mr-2" />
                                                Créer une équipe
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
