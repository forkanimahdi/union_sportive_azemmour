import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, Calendar, Users, Trophy, TrendingUp, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SeasonsIndex({ seasons }) {
    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette saison ?')) {
            router.delete(`/admin/seasons/${id}`);
        }
    };

    const truncateDescription = (text, maxLength = 100) => {
        if (!text) return null;
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short',
        });
    };

    return (
        <AdminLayout>
            <Head title="Saisons" />
            <div className="space-y-6">
                {/* Header with gradient background */}
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                    <div className="relative flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                                    <Trophy className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-black uppercase italic text-dark">Saisons</h1>
                            </div>
                            <p className="text-muted-foreground">Gestion des saisons sportives de votre club</p>
                        </div>
                        <Link href="/admin/seasons/create">
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvelle Saison
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                {seasons.data.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Saisons</p>
                                        <p className="text-3xl font-black text-dark">{seasons.data.length}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <Calendar className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Saison Active</p>
                                        <p className="text-3xl font-black text-dark">
                                            {seasons.data.filter(s => s.is_active).length}
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
                                        <p className="text-sm text-muted-foreground mb-1">Total Équipes</p>
                                        <p className="text-3xl font-black text-dark">
                                            {seasons.data.reduce((sum, s) => sum + (s.teams_count || 0), 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-500/10">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Seasons Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {seasons.data.map((season) => (
                        <Card 
                            key={season.id}
                            className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                        >
                            {/* Active Badge Glow Effect */}
                            {season.is_active && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            )}
                            
                            {/* Gradient Accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                                season.is_active 
                                    ? 'from-green-500 via-green-400 to-transparent' 
                                    : 'from-primary/50 via-primary/30 to-transparent'
                            }`}></div>

                            <CardHeader className="pb-3 relative">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                                {season.name}
                                            </CardTitle>
                                        </div>
                                        <CardDescription className="flex items-center gap-2 text-xs font-medium">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                                            <span className="truncate">
                                                {formatDate(season.start_date)} - {formatDate(season.end_date)}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    {season.is_active && (
                                        <Badge 
                                            variant="default" 
                                            className="bg-green-500/90 text-white shrink-0 shadow-lg shadow-green-500/30 animate-pulse"
                                        >
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            Active
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            
                            <CardContent className="pt-0 space-y-4 relative">
                                {season.description && (
                                    <div className="relative">
                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                            {truncateDescription(season.description)}
                                        </p>
                                    </div>
                                )}
                                
                                {/* Quick Stats */}
                                <div className="flex items-center gap-4 py-2 px-3 rounded-lg bg-muted/30 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-primary/70" />
                                        <span className="font-semibold text-foreground">{season.teams_count}</span>
                                        <span className="text-muted-foreground text-xs">équipe(s)</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2 border-t border-border/50">
                                    <Link href={`/admin/seasons/${season.id}`} className="flex-1">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30 text-primary hover:text-primary font-medium transition-all"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Voir
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/seasons/${season.id}/edit`} className="flex-1">
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
                                        onClick={() => handleDelete(season.id)}
                                        className="shrink-0 hover:shadow-lg hover:shadow-destructive/20 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {seasons.data.length === 0 && (
                    <Card className="bg-card/60 backdrop-blur-sm border-dashed border-2 border-border/50">
                        <CardContent className="py-16 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-full bg-muted/30">
                                    <Trophy className="w-12 h-12 text-muted-foreground/50" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">Aucune saison créée</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Commencez par créer votre première saison sportive
                                    </p>
                                    <Link href="/admin/seasons/create">
                                        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Créer la première saison
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}

