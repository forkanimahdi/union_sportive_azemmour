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

const categoryColors = {
    'Senior': 'bg-red-600',
    'U17': 'bg-orange-600',
    'U15': 'bg-yellow-600',
    'U13': 'bg-green-600',
};

const categoryBgColors = {
    'Senior': 'bg-red-600/80',
    'U17': 'bg-orange-600/80',
    'U15': 'bg-yellow-600/80',
    'U13': 'bg-green-600/80',
};

export default function SeasonsShow({ season }) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Group matches and trainings by category
    const eventsByCategory = useMemo(() => {
        const grouped = {};
        
        // Group matches
        (season.matches || []).forEach(match => {
            const cat = match.category || 'Autre';
            if (!grouped[cat]) grouped[cat] = { matches: [], trainings: [] };
            grouped[cat].matches.push(match);
        });
        
        // Group trainings
        (season.trainings || []).forEach(training => {
            const cat = training.category || 'Autre';
            if (!grouped[cat]) grouped[cat] = { matches: [], trainings: [] };
            grouped[cat].trainings.push(training);
        });
        
        return grouped;
    }, [season.matches, season.trainings]);

    // Group standings by category
    const standingsByCategory = useMemo(() => {
        const grouped = {};
        (season.standings || []).forEach(team => {
            const cat = team.category || 'Autre';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(team);
        });
        
        // Sort each category by points, goal difference, goals for
        Object.keys(grouped).forEach(cat => {
            grouped[cat] = grouped[cat].sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
                return b.goals_for - a.goals_for;
            });
        });
        
        return grouped;
    }, [season.standings]);

    // Get categories ordered: Senior first, then others
    const orderedCategories = useMemo(() => {
        const cats = Object.keys(eventsByCategory);
        const seniorIndex = cats.indexOf('Senior');
        if (seniorIndex > -1) {
            const senior = cats.splice(seniorIndex, 1)[0];
            return [senior, ...cats.sort()];
        }
        return cats.sort();
    }, [eventsByCategory]);

    const filteredStandings = useMemo(() => {
        if (selectedCategory === 'all') return season.standings || [];
        return (season.standings || []).filter(s => s.category === selectedCategory);
    }, [selectedCategory, season.standings]);

    const filteredTopScorers = useMemo(() => {
        if (selectedCategory === 'all') return season.top_scorers || [];
        return (season.top_scorers || []).filter(s => s.category === selectedCategory);
    }, [selectedCategory, season.top_scorers]);

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
            <div className="min-h-screen">
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

                        {/* Calendar Tab - Grouped by Category */}
                        <TabsContent value="calendar" className="space-y-6">
                            {orderedCategories.length > 0 ? (
                                orderedCategories.map((category) => {
                                    const events = eventsByCategory[category];
                                    const allEvents = [
                                        ...events.matches.map(m => ({ ...m, type: 'match' })),
                                        ...events.trainings.map(t => ({ ...t, type: 'training' }))
                                    ].sort((a, b) => new Date(a.scheduled_at || a.date) - new Date(b.scheduled_at || b.date));
                                    
                                    if (allEvents.length === 0 && selectedCategory !== 'all' && selectedCategory !== category) return null;
                                    
                                    const bgColor = categoryBgColors[category] || 'bg-primary/80';
                                    const borderColor = categoryColors[category] || 'border-primary';
                                    
                                    return (
                                        <Card key={category} className={`${bgColor} border-2 ${borderColor} shadow-xl`}>
                                            <CardHeader className="bg-white/10 backdrop-blur-sm">
                                                <CardTitle className="text-white text-2xl font-black flex items-center gap-3">
                                                    <Trophy className="w-6 h-6" />
                                                    {category}
                                                    <Badge className="bg-white/30 text-white border-0 ml-auto">
                                                        {allEvents.length} événement{allEvents.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="bg-white/5 p-6">
                                                {allEvents.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {allEvents.map((event, index) => (
                                                            <div 
                                                                key={`${event.type}-${event.id}`}
                                                                className="p-5 rounded-xl border-2 border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-sm"
                                                            >
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-3 mb-3">
                                                                            {event.type === 'match' ? (
                                                                                <Trophy className="w-5 h-5 text-white" />
                                                                            ) : (
                                                                                <Target className="w-5 h-5 text-white" />
                                                                            )}
                                                                            <h4 className="font-bold text-lg text-white">
                                                                                {event.type === 'match' 
                                                                                    ? `${event.team_name} vs ${event.opponent}`
                                                                                    : `Entraînement - ${event.team_name}`
                                                                                }
                                                                            </h4>
                                                                        </div>
                                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                                                                            <span className="flex items-center gap-2">
                                                                                <Clock className="w-4 h-4" />
                                                                                {formatDate(event.scheduled_at || event.date)}
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
                                                    <p className="text-center text-white/60 py-8">
                                                        Aucun événement programmé pour cette catégorie
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            ) : (
                                <Card className="bg-primary/80 border-primary/20">
                                    <CardContent className="py-20 text-center">
                                        <p className="text-white/80 text-lg">Aucun événement programmé</p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Standings Tab - Grouped by Category */}
                        <TabsContent value="standings" className="space-y-6">
                            {Object.keys(standingsByCategory).length > 0 ? (
                                Object.keys(standingsByCategory).sort((a, b) => {
                                    if (a === 'Senior') return -1;
                                    if (b === 'Senior') return 1;
                                    return a.localeCompare(b);
                                }).map((category) => {
                                    const categoryStandings = standingsByCategory[category];
                                    const bgColor = categoryBgColors[category] || 'bg-primary/80';
                                    const borderColor = categoryColors[category] || 'border-primary';
                                    
                                    return (
                                        <Card key={category} className={`${bgColor} border-2 ${borderColor} shadow-xl`}>
                                            <CardHeader className="bg-white/10 backdrop-blur-sm">
                                                <CardTitle className="text-white text-2xl font-black flex items-center gap-3">
                                                    <TrendingUp className="w-6 h-6" />
                                                    Classement - {category}
                                                    <Badge className="bg-white/30 text-white border-0 ml-auto">
                                                        {categoryStandings.length} équipe{categoryStandings.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="bg-white/5 p-0">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-white/20 text-white border-b-2 border-white/30">
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
                                                            {categoryStandings.map((team, index) => (
                                                                <tr 
                                                                    key={team.id}
                                                                    className="border-b border-white/20 hover:bg-white/20 transition-colors text-white"
                                                                >
                                                                    <td className="p-4 font-black text-lg text-white">{index + 1}</td>
                                                                    <td className="p-4">
                                                                        <div className="font-bold text-white">{team.name}</div>
                                                                    </td>
                                                                    <td className="p-4 text-center font-semibold text-white">{team.played}</td>
                                                                    <td className="p-4 text-center font-semibold text-white">{team.wins}</td>
                                                                    <td className="p-4 text-center font-semibold text-white">{team.draws}</td>
                                                                    <td className="p-4 text-center font-semibold text-white">{team.losses}</td>
                                                                    <td className="p-4 text-center font-semibold text-white">{team.goals_for}</td>
                                                                    <td className="p-4 text-center font-semibold text-white">{team.goals_against}</td>
                                                                    <td className={`p-4 text-center font-bold text-white ${
                                                                        team.goal_difference > 0 ? 'text-green-300' : 
                                                                        team.goal_difference < 0 ? 'text-red-300' : ''
                                                                    }`}>
                                                                        {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                                                                    </td>
                                                                    <td className="p-4 text-center font-black text-lg text-white bg-white/10">{team.points}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            ) : (
                                <Card className="bg-primary/80 border-primary/20">
                                    <CardContent className="py-20 text-center">
                                        <p className="text-white/80 text-lg">Aucun classement disponible</p>
                                    </CardContent>
                                </Card>
                            )}
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
