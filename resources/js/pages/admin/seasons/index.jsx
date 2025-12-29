import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Calendar, Trophy, Search, X, ArrowRight, Users, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SeasonsIndex({ seasons }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredSeasons = useMemo(() => {
        let filtered = seasons.data || [];
        
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(season => 
                season.name.toLowerCase().includes(searchLower) ||
                season.description?.toLowerCase().includes(searchLower)
            );
        }
        
        if (statusFilter) {
            filtered = filtered.filter(season => 
                statusFilter === 'active' ? season.is_active : !season.is_active
            );
        }
        
        return filtered;
    }, [seasons.data, search, statusFilter]);

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette saison ?')) {
            router.delete(`/admin/seasons/${id}`);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
        });
    };

    const getDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        return months > 0 ? `${months} mois` : `${diffDays} jours`;
    };

    return (
        <AdminLayout>
            <Head title="Saisons" />
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
                                            Saisons Sportives
                                        </h1>
                                    </div>
                                    <p className="text-white/90 text-lg ml-14">
                                        Gérez toutes vos saisons en un seul endroit
                                    </p>
                                </div>
                                <Link href="/admin/seasons/create">
                                    <Button size="lg" className="bg-white text-primary hover:bg-white/95 shadow-xl h-12 px-6 text-base font-semibold">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Nouvelle Saison
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Filters - Minimal Design */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative flex-1 min-w-[280px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une saison..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 h-12 bg-white border-2 border-primary/10 focus:border-primary rounded-xl text-base"
                            />
                        </div>
                        <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
                            <SelectTrigger className="h-12 w-[200px] bg-white border-2 border-primary/10 rounded-xl">
                                <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="active">Active uniquement</SelectItem>
                                <SelectItem value="inactive">Inactive uniquement</SelectItem>
                            </SelectContent>
                        </Select>
                        {(search || statusFilter) && (
                            <Button 
                                variant="outline" 
                                onClick={() => { setSearch(''); setStatusFilter(''); }} 
                                className="h-12 px-4 bg-white border-2 border-primary/10 rounded-xl"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Réinitialiser
                            </Button>
                        )}
                    </div>

                    {/* Stats Cards */}
                    {filteredSeasons.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm font-medium mb-2">Total Saisons</p>
                                            <p className="text-4xl font-black">{seasons.data?.length || 0}</p>
                                        </div>
                                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm font-medium mb-2">Saisons Actives</p>
                                            <p className="text-4xl font-black">
                                                {filteredSeasons.filter(s => s.is_active).length}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm font-medium mb-2">Total Équipes</p>
                                            <p className="text-4xl font-black">
                                                {filteredSeasons.reduce((sum, s) => sum + (s.teams_count || 0), 0)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                            <Users className="w-8 h-8" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Seasons Grid - Modern Cards */}
                    {filteredSeasons.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredSeasons.map((season) => (
                                <Card
                                    key={season.id}
                                    className="group relative overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl bg-white cursor-pointer"
                                    onClick={() => router.visit(`/admin/seasons/${season.id}`)}
                                >
                                    {season.is_active && (
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                                    )}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent"></div>
                                    
                                    <CardContent className="p-6 space-y-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`p-2 rounded-lg ${season.is_active ? 'bg-green-500/10' : 'bg-primary/10'}`}>
                                                        <Trophy className={`w-5 h-5 ${season.is_active ? 'text-green-600' : 'text-primary'}`} />
                                                    </div>
                                                    <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">
                                                        {season.name}
                                                    </h3>
                                                </div>
                                                {season.is_active && (
                                                    <Badge className="bg-green-500 text-white border-0 mb-3">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground font-medium">
                                                    {formatDate(season.start_date)}
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground font-medium">
                                                    {formatDate(season.end_date)}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground font-medium">
                                                Durée: {getDuration(season.start_date, season.end_date)}
                                            </div>
                                        </div>

                                        {season.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                {season.description}
                                            </p>
                                        )}

                                        <div className="pt-4 border-t border-primary/10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {season.teams_count || 0} équipe{season.teams_count !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link 
                                                        href={`/admin/seasons/${season.id}/edit`} 
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-primary/10"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            handleDelete(season.id); 
                                                        }}
                                                        className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-2 border-dashed border-primary/20 bg-white/50">
                            <CardContent className="py-20 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                                        <Trophy className="w-10 h-10 text-primary/50" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        {search || statusFilter ? 'Aucune saison trouvée' : 'Aucune saison créée'}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {search || statusFilter 
                                            ? 'Essayez de modifier vos critères de recherche'
                                            : 'Commencez par créer votre première saison sportive'
                                        }
                                    </p>
                                    {!search && !statusFilter && (
                                        <Link href="/admin/seasons/create">
                                            <Button size="lg" className="mt-4 bg-primary hover:bg-primary/90 text-white">
                                                <Plus className="w-5 h-5 mr-2" />
                                                Créer la première saison
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
