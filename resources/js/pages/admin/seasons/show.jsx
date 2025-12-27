import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    ArrowLeft, Edit, Users, Trophy, Calendar as CalendarIcon, 
    TrendingUp, DollarSign, BarChart3, Copy, Download, MessageSquare,
    Clock, MapPin, Home, Plane, CheckCircle2, XCircle, MoreHorizontal,
    Target, Award, Zap
} from 'lucide-react';

export default function SeasonsShow({ season }) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter data by category
    const filteredMatches = useMemo(() => {
        if (selectedCategory === 'all') return season.matches || [];
        return (season.matches || []).filter(m => m.category === selectedCategory);
    }, [selectedCategory, season.matches]);

    const filteredTrainings = useMemo(() => {
        if (selectedCategory === 'all') return season.trainings || [];
        return (season.trainings || []).filter(t => t.category === selectedCategory);
    }, [selectedCategory, season.trainings]);

    const filteredStandings = useMemo(() => {
        if (selectedCategory === 'all') return season.standings || [];
        return (season.standings || []).filter(s => s.category === selectedCategory);
    }, [selectedCategory, season.standings]);

    const filteredTopScorers = useMemo(() => {
        if (selectedCategory === 'all') return season.top_scorers || [];
        return (season.top_scorers || []).filter(s => s.category === selectedCategory);
    }, [selectedCategory, season.top_scorers]);

    // Combine matches and trainings for calendar
    const calendarEvents = useMemo(() => {
        const matches = filteredMatches.map(m => ({
            ...m,
            type: 'match',
            title: `${m.team_name} vs ${m.opponent}`,
            date: m.scheduled_at,
        }));
        const trainings = filteredTrainings.map(t => ({
            ...t,
            type: 'training',
            title: `Entraînement - ${t.team_name}`,
            date: t.scheduled_at,
        }));
        return [...matches, ...trainings].sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [filteredMatches, filteredTrainings]);

    const handleDuplicate = () => {
        if (confirm('Voulez-vous dupliquer cette saison avec les mêmes paramètres ?')) {
            router.post(`/admin/seasons/${season.id}/duplicate`, {}, {
                onSuccess: () => {
                    // Will be handled by backend
                }
            });
        }
    };

    const handleExport = () => {
        // Export functionality - would typically call an API endpoint
        window.open(`/admin/seasons/${season.id}/export`, '_blank');
    };

    const handleBulkMessage = () => {
        // Bulk messaging functionality
        router.visit(`/admin/seasons/${season.id}/bulk-message`);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            scheduled: { label: 'Programmé', variant: 'outline', icon: Clock },
            live: { label: 'En direct', variant: 'default', className: 'bg-red-500' },
            finished: { label: 'Terminé', variant: 'default', className: 'bg-green-500' },
            postponed: { label: 'Reporté', variant: 'secondary' },
            cancelled: { label: 'Annulé', variant: 'destructive' },
            completed: { label: 'Terminé', variant: 'default', className: 'bg-green-500' },
            cancelled_training: { label: 'Annulé', variant: 'destructive' },
        };
        const config = statusConfig[status] || { label: status, variant: 'outline' };
        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <Head title={season.name} />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <Link href="/admin/seasons">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 flex-wrap">
                            <h1 className="text-3xl font-black uppercase italic text-dark">{season.name}</h1>
                            {season.is_active && (
                                <Badge variant="default" className="bg-green-500/90 text-white">
                                    Active
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            {season.start_date} - {season.end_date}
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" onClick={handleDuplicate}>
                            <Copy className="w-4 h-4 mr-2" />
                            Dupliquer
                        </Button>
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Exporter
                        </Button>
                        <Button variant="outline" onClick={handleBulkMessage}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                        </Button>
                        <Link href={`/admin/seasons/${season.id}/edit`}>
                            <Button>
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Category Filter */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            <label className="text-sm font-medium text-muted-foreground">Filtrer par catégorie:</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les catégories</SelectItem>
                                    {season.categories?.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{season.teams?.length || 0} équipe(s)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                {season.description && (
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">{season.description}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs */}
                <Tabs defaultValue="calendar" className="space-y-4">
                    <TabsList className="bg-muted/50 backdrop-blur-sm">
                        <TabsTrigger value="calendar" className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            Calendrier
                        </TabsTrigger>
                        <TabsTrigger value="standings" className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Classement
                        </TabsTrigger>
                        <TabsTrigger value="financial" className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Finances
                        </TabsTrigger>
                        <TabsTrigger value="statistics" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Statistiques
                        </TabsTrigger>
                    </TabsList>

                    {/* Calendar Tab */}
                    <TabsContent value="calendar" className="space-y-4">
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5" />
                                    Calendrier des Matchs et Entraînements
                                </CardTitle>
                                <CardDescription>
                                    Tous les événements programmés pour cette saison
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {calendarEvents.length > 0 ? (
                                    <div className="space-y-3">
                                        {calendarEvents.map((event, index) => (
                                            <div 
                                                key={`${event.type}-${event.id}`}
                                                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                                                    event.type === 'match' 
                                                        ? 'bg-primary/5 border-primary/20' 
                                                        : 'bg-secondary/30 border-secondary/20'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {event.type === 'match' ? (
                                                                <Trophy className="w-4 h-4 text-primary" />
                                                            ) : (
                                                                <Target className="w-4 h-4 text-secondary-foreground" />
                                                            )}
                                                            <h4 className="font-semibold">{event.title}</h4>
                                                            <Badge variant="outline" className="text-xs">
                                                                {event.category}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {formatDate(event.date)}
                                                            </span>
                                                            {event.type === 'match' ? (
                                                                <>
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="w-3.5 h-3.5" />
                                                                        {event.venue}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        {event.type === 'domicile' ? (
                                                                            <Home className="w-3.5 h-3.5" />
                                                                        ) : (
                                                                            <Plane className="w-3.5 h-3.5" />
                                                                        )}
                                                                        {event.type === 'domicile' ? 'Domicile' : 'Extérieur'}
                                                                    </span>
                                                                    {event.home_score !== null && event.away_score !== null && (
                                                                        <span className="font-bold text-foreground">
                                                                            {event.type === 'domicile' 
                                                                                ? `${event.home_score} - ${event.away_score}`
                                                                                : `${event.away_score} - ${event.home_score}`}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                    {event.location}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(event.status)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">
                                        Aucun événement programmé
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Standings Tab */}
                    <TabsContent value="standings" className="space-y-4">
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Classement des Équipes
                                </CardTitle>
                                <CardDescription>
                                    Classement en temps réel basé sur les matchs joués
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {filteredStandings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border/50">
                                                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Pos</th>
                                                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Équipe</th>
                                                    <th className="text-center p-3 text-sm font-semibold text-muted-foreground">J</th>
                                                    <th className="text-center p-3 text-sm font-semibold text-muted-foreground">V</th>
                                                    <th className="text-center p-3 text-sm font-semibold text-muted-foreground">N</th>
                                                    <th className="text-center p-3 text-sm font-semibold text-muted-foreground">D</th>
                                                    <th className="text-center p-3 text-sm font-semibold text-muted-foreground">BP</th>
                                                    <th className="text-center p-3 text-sm font-semibold text-muted-foreground">BC</th>
                                                    <th className="text-center p-3 text-sm font-semibold text-muted-foreground">DB</th>
                                                    <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Pts</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredStandings.map((team, index) => (
                                                    <tr 
                                                        key={team.id}
                                                        className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                                                    >
                                                        <td className="p-3 font-bold">{index + 1}</td>
                                                        <td className="p-3">
                                                            <div>
                                                                <div className="font-medium">{team.name}</div>
                                                                <Badge variant="outline" className="text-xs mt-1">
                                                                    {team.category}
                                                                </Badge>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-center">{team.played}</td>
                                                        <td className="p-3 text-center text-green-600">{team.wins}</td>
                                                        <td className="p-3 text-center">{team.draws}</td>
                                                        <td className="p-3 text-center text-red-600">{team.losses}</td>
                                                        <td className="p-3 text-center">{team.goals_for}</td>
                                                        <td className="p-3 text-center">{team.goals_against}</td>
                                                        <td className={`p-3 text-center font-medium ${
                                                            team.goal_difference > 0 ? 'text-green-600' : 
                                                            team.goal_difference < 0 ? 'text-red-600' : ''
                                                        }`}>
                                                            {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                                                        </td>
                                                        <td className="p-3 text-center font-bold text-primary">{team.points}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">
                                        Aucun classement disponible
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Financial Tab */}
                    <TabsContent value="financial" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Inscrits
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{season.financial_summary?.total_registered || 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Joueurs inscrits</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Collecté
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {season.financial_summary?.fees_collected?.toLocaleString('fr-FR') || 0} MAD
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Frais collectés</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-orange-500" />
                                        En attente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {season.financial_summary?.fees_pending?.toLocaleString('fr-FR') || 0} MAD
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Paiements en attente</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Total attendu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {season.financial_summary?.total_expected?.toLocaleString('fr-FR') || 0} MAD
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Revenus attendus</p>
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                            <CardHeader>
                                <CardTitle>Résumé Financier</CardTitle>
                                <CardDescription>
                                    Vue d'ensemble des frais d'inscription et paiements
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                        <span className="text-sm font-medium">Taux de collecte</span>
                                        <span className="text-lg font-bold">
                                            {season.financial_summary?.total_expected 
                                                ? Math.round((season.financial_summary.fees_collected / season.financial_summary.total_expected) * 100)
                                                : 0}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Note: Les données financières sont en phase de développement. 
                                        Cette fonctionnalité sera bientôt disponible.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Statistics Tab */}
                    <TabsContent value="statistics" className="space-y-4">
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    Meilleurs Buteurs
                                </CardTitle>
                                <CardDescription>
                                    Top 10 des meilleurs buteurs de la saison
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {filteredTopScorers.length > 0 ? (
                                    <div className="space-y-3">
                                        {filteredTopScorers.map((player, index) => (
                                            <div 
                                                key={player.id}
                                                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                        index === 0 ? 'bg-yellow-500 text-white' :
                                                        index === 1 ? 'bg-gray-400 text-white' :
                                                        index === 2 ? 'bg-amber-600 text-white' :
                                                        'bg-muted text-muted-foreground'
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{player.name}</div>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <span>{player.team}</span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {player.category}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-primary">{player.goals}</span>
                                                    <span className="text-sm text-muted-foreground">buts</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">
                                        Aucune statistique disponible
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
