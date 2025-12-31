import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    ArrowLeft, Edit, Calendar, Trophy, Users, Target, Zap, 
    Clock, Home, Plane, ChevronLeft, ChevronRight, CheckCircle2,
    XCircle, Activity
} from 'lucide-react';

const positionLabels = {
    'gardien': 'Gardien',
    'defenseur': 'Défenseur',
    'milieu': 'Milieu',
    'attaquant': 'Attaquant',
};

const footLabels = {
    'gauche': 'Gauche',
    'droit': 'Droit',
    'ambidextre': 'Ambidextre',
};

export default function PlayersShow({ player }) {
    const [teammateIndex, setTeammateIndex] = useState(0);
    const teammatesPerView = 5;

    const positionLabel = player.position ? positionLabels[player.position] || player.position : '';
    const footLabel = player.preferred_foot ? footLabels[player.preferred_foot] : null;

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
            time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    const nextTeammates = () => {
        if (teammateIndex + teammatesPerView < player.teammates.length) {
            setTeammateIndex(teammateIndex + 1);
        }
    };

    const prevTeammates = () => {
        if (teammateIndex > 0) {
            setTeammateIndex(teammateIndex - 1);
        }
    };

    const visibleTeammates = player.teammates?.slice(teammateIndex, teammateIndex + teammatesPerView) || [];

    return (
        <AdminLayout>
            <Head title={`${player.first_name} ${player.last_name}`} />
            <div className="space-y-0">
                {/* Full Width Banner */}
                <div 
                    className="relative w-full h-96 overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, var(--color-primary) 0%, rgba(87, 17, 35, 0.9) 50%, rgba(87, 17, 35, 0.7) 100%)`,
                    }}
                >
                    {/* Player Photo Overlay */}
                    {player.photo && (
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30">
                            <img 
                                src={`/storage/${player.photo}`}
                                alt={`${player.first_name} ${player.last_name}`}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="relative z-10 p-6">
                        <Link href="/admin/players">
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                    </div>

                    {/* Player Info Overlay */}
                    <div className="absolute inset-0 flex items-end">
                        <div className="relative z-10 w-full px-6 pb-8">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-end gap-6">
                                    {/* Large Player Photo */}
                                    <div className="relative">
                                        <div className="w-48 h-64 rounded-lg overflow-hidden border-4 border-white shadow-2xl">
                                            {player.photo ? (
                                                <img 
                                                    src={`/storage/${player.photo}`}
                                                    alt={`${player.first_name} ${player.last_name}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-6xl font-black">
                                                    {player.first_name?.[0]}{player.last_name?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        {player.jersey_number && (
                                            <div className="absolute -bottom-4 -right-4 bg-white text-primary w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black shadow-xl">
                                                {player.jersey_number}
                                            </div>
                                        )}
                                    </div>

                                    {/* Player Name and Info */}
                                    <div className="flex-1 text-white pb-4">
                                        <h1 className="text-5xl font-black uppercase mb-2">
                                            {player.first_name} {player.last_name}
                                        </h1>
                                        <div className="flex items-center gap-4 text-lg">
                                            {player.team && (
                                                <span className="font-semibold">{player.team.name}</span>
                                            )}
                                            {player.jersey_number && (
                                                <span className="font-bold">{player.jersey_number}</span>
                                            )}
                                            {positionLabel && (
                                                <span className="font-medium">{positionLabel}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pb-4">
                                        <Link href={`/admin/players/${player.id}/edit`}>
                                            <Button className="bg-white text-primary hover:bg-white/90 shadow-lg">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Modifier
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left Column - Player Card & Stats */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Player Stats Card */}
                            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {player.date_of_birth && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Date de naissance</p>
                                                <p className="font-semibold">{formatDate(player.date_of_birth)}</p>
                                            </div>
                                        )}
                                        {footLabel && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Pied préféré</p>
                                                <p className="font-semibold">{footLabel}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Apparitions</p>
                                            <p className="text-3xl font-black text-primary">{player.stats?.appearances || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Buts</p>
                                            <p className="text-3xl font-black text-primary">{player.stats?.goals || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Passes décisives</p>
                                            <p className="text-3xl font-black text-primary">{player.stats?.assists || 0}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Tabs & Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Tabs */}
                            <Tabs defaultValue="overview" className="space-y-6">
                                <TabsList className="bg-muted/50 backdrop-blur-sm">
                                    <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                                    <TabsTrigger value="matches">Matchs</TabsTrigger>
                                    <TabsTrigger value="stats">Statistiques</TabsTrigger>
                                    <TabsTrigger value="career">Historique</TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="space-y-6">
                                    {/* Next Match */}
                                    {player.upcoming_match && (
                                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-primary" />
                                                    Prochain Match
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-center">
                                                            <p className="font-bold text-lg">{player.team?.name}</p>
                                                            <Badge variant="outline" className="mt-1">
                                                                {player.upcoming_match.type === 'domicile' ? (
                                                                    <Home className="w-3 h-3 mr-1" />
                                                                ) : (
                                                                    <Plane className="w-3 h-3 mr-1" />
                                                                )}
                                                                {player.upcoming_match.type === 'domicile' ? 'Domicile' : 'Extérieur'}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-2xl font-bold">vs</div>
                                                        <div className="text-center">
                                                            <p className="font-bold text-lg">{player.upcoming_match.opponent}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        {formatDateTime(player.upcoming_match.scheduled_at) && (
                                                            <>
                                                                <p className="text-sm text-muted-foreground">{formatDateTime(player.upcoming_match.scheduled_at).time}</p>
                                                                <p className="text-xs text-muted-foreground">{formatDateTime(player.upcoming_match.scheduled_at).date}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Team Form */}
                                    {player.recent_matches && player.recent_matches.length > 0 && (
                                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="flex items-center gap-2">
                                                        <Activity className="w-5 h-5 text-primary" />
                                                        Forme de l'équipe
                                                    </CardTitle>
                                                    {player.team && (
                                                        <Badge variant="outline">{player.team.name}</Badge>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex gap-2">
                                                    {player.recent_matches.map((match, index) => (
                                                        <div 
                                                            key={match.id}
                                                            className={`flex-1 p-3 rounded-lg text-center ${
                                                                match.won 
                                                                    ? 'bg-green-500/20 border-2 border-green-500' 
                                                                    : 'bg-red-500/20 border-2 border-red-500'
                                                            }`}
                                                        >
                                                            <p className="text-xs text-muted-foreground mb-1">MW{player.recent_matches.length - index}</p>
                                                            <p className="text-xs font-medium mb-1">
                                                                {match.opponent.substring(0, 3).toUpperCase()}
                                                            </p>
                                                            <p className="text-xs font-bold">
                                                                {match.venue === 'domicile' ? '(H)' : '(A)'}
                                                            </p>
                                                            <p className="text-sm font-black mt-1">
                                                                {match.type === 'domicile' 
                                                                    ? `${match.home_score} - ${match.away_score}`
                                                                    : `${match.away_score} - ${match.home_score}`}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Teammates */}
                                    {player.teammates && player.teammates.length > 0 && (
                                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Users className="w-5 h-5 text-primary" />
                                                    Coéquipiers
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="relative">
                                                    <div className="flex gap-4 overflow-hidden">
                                                        {visibleTeammates.map((teammate) => (
                                                            <Link
                                                                key={teammate.id}
                                                                href={`/admin/players/${teammate.id}`}
                                                                className="flex-shrink-0 w-24 text-center group cursor-pointer"
                                                            >
                                                                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors mb-2">
                                                                    {teammate.photo ? (
                                                                        <img 
                                                                            src={`/storage/${teammate.photo}`}
                                                                            alt={`${teammate.first_name} ${teammate.last_name}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                                            {teammate.first_name?.[0]}{teammate.last_name?.[0]}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs font-medium truncate">{teammate.first_name}</p>
                                                                <p className="text-xs font-bold truncate">{teammate.last_name}</p>
                                                                {teammate.jersey_number && (
                                                                    <Badge variant="outline" className="text-xs mt-1">
                                                                        {teammate.jersey_number}
                                                                    </Badge>
                                                                )}
                                                                {teammate.position && (
                                                                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                                                                        {teammate.position}
                                                                    </p>
                                                                )}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    {player.teammates.length > teammatesPerView && (
                                                        <>
                                                            {teammateIndex > 0 && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                                                                    onClick={prevTeammates}
                                                                >
                                                                    <ChevronLeft className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            {teammateIndex + teammatesPerView < player.teammates.length && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                                                                    onClick={nextTeammates}
                                                                >
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                {/* Matches Tab */}
                                <TabsContent value="matches" className="space-y-4">
                                    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                        <CardHeader>
                                            <CardTitle>Historique des Matchs</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {player.recent_matches && player.recent_matches.length > 0 ? (
                                                <div className="space-y-3">
                                                    {player.recent_matches.map((match) => (
                                                        <div 
                                                            key={match.id}
                                                            className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-semibold">
                                                                        {player.team?.name} vs {match.opponent}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {match.venue === 'domicile' ? (
                                                                                <Home className="w-3 h-3 mr-1" />
                                                                            ) : (
                                                                                <Plane className="w-3 h-3 mr-1" />
                                                                            )}
                                                                            {match.venue === 'domicile' ? 'Domicile' : 'Extérieur'}
                                                                        </Badge>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {formatDateTime(match.scheduled_at)?.date}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-2xl font-black">
                                                                        {match.type === 'domicile' 
                                                                            ? `${match.home_score} - ${match.away_score}`
                                                                            : `${match.away_score} - ${match.home_score}`}
                                                                    </p>
                                                                    {match.won ? (
                                                                        <Badge className="bg-green-500 mt-1">
                                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                                            Victoire
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant="destructive" className="mt-1">
                                                                            <XCircle className="w-3 h-3 mr-1" />
                                                                            Défaite
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-muted-foreground py-8">
                                                    Aucun match récent
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Stats Tab */}
                                <TabsContent value="stats" className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                                                    <p className="text-4xl font-black text-primary">{player.stats?.appearances || 0}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">Apparitions</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                                                    <p className="text-4xl font-black text-primary">{player.stats?.goals || 0}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">Buts</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                                                    <p className="text-4xl font-black text-primary">{player.stats?.assists || 0}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">Passes Décisives</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* Career Tab */}
                                <TabsContent value="career" className="space-y-4">
                                    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                        <CardHeader>
                                            <CardTitle>Informations Personnelles</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {player.date_of_birth && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Date de naissance</p>
                                                    <p className="font-semibold">{formatDate(player.date_of_birth)}</p>
                                                </div>
                                            )}
                                            {player.position && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Poste</p>
                                                    <p className="font-semibold capitalize">{player.position}</p>
                                                </div>
                                            )}
                                            {footLabel && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Pied préféré</p>
                                                    <p className="font-semibold">{footLabel}</p>
                                                </div>
                                            )}
                                            {player.jersey_number && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Numéro de maillot</p>
                                                    <p className="font-semibold">{player.jersey_number}</p>
                                                </div>
                                            )}
                                            {player.email && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Email</p>
                                                    <p className="font-semibold">{player.email}</p>
                                                </div>
                                            )}
                                            {player.phone && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Téléphone</p>
                                                    <p className="font-semibold">{player.phone}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

