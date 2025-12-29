import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    ArrowLeft, Edit, Users, Trophy, Calendar as CalendarIcon, 
    TrendingUp, BarChart3, Copy, Download, MessageSquare,
    Clock, MapPin, Home, Plane, Award, Target, ArrowRight
} from 'lucide-react';

export default function SeasonsShow({ season }) {
    const [selectedCategory, setSelectedCategory] = useState('all');

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
        window.open(`/admin/seasons/${season.id}/export`, '_blank');
    };

    const handleBulkMessage = () => {
        router.visit(`/admin/seasons/${season.id}/bulk-message`);
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
            <div className="min-h-screen ">
                <div className="space-y-6 p-6">
                    {/* Hero Header - FPL Style */}
                    <div className="bg-primary rounded-xl p-8 text-white shadow-xl">
                        <Link href="/admin/seasons">
                            <Button variant="ghost" size="sm" className="mb-6 text-white hover:bg-white/20">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div className="flex items-start justify-between flex-wrap gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <h1 className="text-4xl font-black uppercase italic">
                                        {season.name}
                                    </h1>
                            {season.is_active && (
                                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                                            Saison Active
                                </Badge>
                            )}
                        </div>
                                <div className="flex items-center gap-4 text-white/90">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5" />
                                        <span>{season.start_date} - {season.end_date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        <span>{season.teams?.length || 0} équipe{season.teams?.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                                {season.description && (
                                    <p className="mt-4 text-white/80 leading-relaxed max-w-2xl">
                                        {season.description}
                                    </p>
                                )}
                    </div>
                            <div className="flex gap-3 flex-wrap">
                                <Button 
                                    variant="outline" 
                                    onClick={handleDuplicate}
                                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                >
                            <Copy className="w-4 h-4 mr-2" />
                            Dupliquer
                        </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={handleExport}
                                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                >
                            <Download className="w-4 h-4 mr-2" />
                            Exporter
                        </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={handleBulkMessage}
                                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                        </Button>
                        <Link href={`/admin/seasons/${season.id}/edit`}>
                                    <Button className="bg-white text-primary hover:bg-white/95">
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                            </div>
                    </div>
                </div>

                    {/* Category Filter - Alpha Background */}
                    <Card className="bg-primary/90 border-primary/20">
                        <CardContent className="p-6">
                        <div className="flex items-center gap-4 flex-wrap">
                                <label className="text-sm font-semibold text-white">Filtrer par catégorie:</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[200px] bg-white border-primary/20 text-foreground">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les catégories</SelectItem>
                                    {season.categories?.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs - FPL Style */}
                    <Tabs defaultValue="calendar" className="space-y-6">
                        <TabsList className="bg-primary/80 border-primary/20 p-1 h-auto">
                            <TabsTrigger 
                                value="calendar" 
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                            <CalendarIcon className="w-4 h-4" />
                            Calendrier
                        </TabsTrigger>
                            <TabsTrigger 
                                value="standings" 
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                            <TrendingUp className="w-4 h-4" />
                            Classement
                        </TabsTrigger>
                            <TabsTrigger 
                                value="statistics" 
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                            <BarChart3 className="w-4 h-4" />
                            Statistiques
                        </TabsTrigger>
                    </TabsList>

                    {/* Calendar Tab */}
                    <TabsContent value="calendar" className="space-y-4">
                            <Card className="bg-primary border-primary/20">
                                <CardHeader className="bg-primary text-white">
                                    <CardTitle className="text-white flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5" />
                                    Calendrier des Matchs et Entraînements
                                </CardTitle>
                            </CardHeader>
                                <CardContent className="bg-white p-6">
                                {calendarEvents.length > 0 ? (
                                        <div className="space-y-4">
                                        {calendarEvents.map((event, index) => (
                                            <div 
                                                key={`${event.type}-${event.id}`}
                                                    className="p-5 rounded-xl border-2 border-primary/20 bg-primary/80 hover:bg-primary transition-all text-white"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                            {event.type === 'match' ? (
                                                                    <Trophy className="w-5 h-5 text-white" />
                                                            ) : (
                                                                    <Target className="w-5 h-5 text-white" />
                                                            )}
                                                                <h4 className="font-bold text-lg text-white">{event.title}</h4>
                                                                <Badge className="bg-white/20 text-white border-white/30">
                                                                {event.category}
                                                            </Badge>
                                                        </div>
                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                                                                <span className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4" />
                                                                {formatDate(event.date)}
                                                            </span>
                                                                {event.type === 'match' && (
                                                                <>
                                                                        {event.venue && (
                                                                            <span className="flex items-center gap-2">
                                                                                <MapPin className="w-4 h-4" />
                                                                        {event.venue}
                                                                    </span>
                                                                        )}
                                                                        <span className="flex items-center gap-2">
                                                                        {event.type === 'domicile' ? (
                                                                                <Home className="w-4 h-4" />
                                                                        ) : (
                                                                                <Plane className="w-4 h-4" />
                                                                        )}
                                                                        {event.type === 'domicile' ? 'Domicile' : 'Extérieur'}
                                                                    </span>
                                                                    {event.home_score !== null && event.away_score !== null && (
                                                                            <span className="font-black text-white text-lg">
                                                                            {event.type === 'domicile' 
                                                                                ? `${event.home_score} - ${event.away_score}`
                                                                                : `${event.away_score} - ${event.home_score}`}
                                                                        </span>
                                                                    )}
                                                                </>
                                                                )}
                                                                {event.type === 'training' && event.location && (
                                                                    <span className="flex items-center gap-2">
                                                                        <MapPin className="w-4 h-4" />
                                                                    {event.location}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                        <p className="text-center text-muted-foreground py-12">
                                        Aucun événement programmé
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Standings Tab */}
                    <TabsContent value="standings" className="space-y-4">
                            <Card className="bg-primary border-primary/20">
                                <CardHeader className="bg-primary text-white">
                                    <CardTitle className="text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Classement des Équipes
                                </CardTitle>
                            </CardHeader>
                                <CardContent className="bg-white p-0">
                                {filteredStandings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                    <tr className="bg-primary text-white border-b-2 border-primary/20">
                                                        <th className="text-left p-4 text-sm font-black text-white uppercase">Pos</th>
                                                        <th className="text-left p-4 text-sm font-black text-white uppercase">Équipe</th>
                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">J</th>
                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">V</th>
                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">N</th>
                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">D</th>
                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">BP</th>
                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">BC</th>
                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">DB</th>
                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">Pts</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredStandings.map((team, index) => (
                                                    <tr 
                                                        key={team.id}
                                                            className="border-b border-primary/20 hover:bg-primary/80 hover:text-white transition-colors"
                                                    >
                                                            <td className="p-4 font-black text-lg text-foreground">{index + 1}</td>
                                                            <td className="p-4">
                                                                <div className="font-bold text-foreground">{team.name}</div>
                                                                <Badge className="mt-1 bg-primary/80 text-white border-primary/20 text-xs">
                                                                    {team.category}
                                                                </Badge>
                                                        </td>
                                                            <td className="p-4 text-center font-semibold text-foreground">{team.played}</td>
                                                            <td className="p-4 text-center font-semibold text-foreground">{team.wins}</td>
                                                            <td className="p-4 text-center font-semibold text-foreground">{team.draws}</td>
                                                            <td className="p-4 text-center font-semibold text-foreground">{team.losses}</td>
                                                            <td className="p-4 text-center font-semibold text-foreground">{team.goals_for}</td>
                                                            <td className="p-4 text-center font-semibold text-foreground">{team.goals_against}</td>
                                                            <td className={`p-4 text-center font-bold text-foreground ${
                                                                team.goal_difference > 0 ? 'text-primary' : 
                                                                team.goal_difference < 0 ? 'text-muted-foreground' : ''
                                                        }`}>
                                                            {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                                                        </td>
                                                            <td className="p-4 text-center font-black text-lg text-primary">{team.points}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                        <div className="text-center py-12">
                                            <p className="text-muted-foreground">Aucun classement disponible</p>
                                        </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                        {/* Statistics Tab */}
                        <TabsContent value="statistics" className="space-y-4">
                            <Card className="bg-primary border-primary/20">
                                <CardHeader className="bg-primary text-white">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Award className="w-5 h-5" />
                                        Meilleurs Buteurs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white p-6">
                                {filteredTopScorers.length > 0 ? (
                                    <div className="space-y-3">
                                        {filteredTopScorers.map((player, index) => (
                                            <div 
                                                key={player.id}
                                                    className="flex items-center justify-between p-4 bg-primary/80 rounded-xl hover:bg-primary transition-colors text-white"
                                            >
                                                <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                                                            index === 0 ? 'bg-white text-primary' :
                                                            'bg-white/20 text-white'
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                            <div className="font-bold text-lg text-white">{player.name}</div>
                                                            <div className="text-sm text-white/90 flex items-center gap-2">
                                                            <span>{player.team}</span>
                                                                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                                                                {player.category}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                        <span className="text-3xl font-black text-white">{player.goals}</span>
                                                        <span className="text-sm text-white/90">buts</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                        <p className="text-center text-muted-foreground py-12">
                                        Aucune statistique disponible
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                </div>
            </div>
        </AdminLayout>
    );
}
