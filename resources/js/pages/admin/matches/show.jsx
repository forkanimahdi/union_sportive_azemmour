import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    ArrowLeft,
    Trophy,
    Home,
    Plane,
    Clock,
    Users,
    Target,
    Trash2,
    CreditCard,
    AlertTriangle,
    Edit,
    Save,
    MapPin,
    ChevronRight,
    Plus,
    RotateCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CLUB_LOGO = '/assets/images/logo.png';

function positionPillClass(position) {
    const p = (position || '').toUpperCase();
    if (p === 'GK' || p === 'G' || p.includes('GARDIEN')) return 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30';
    if (p === 'DF' || p === 'D' || p.includes('DÉFENSEUR')) return 'bg-amber-500/15 text-amber-700 border-amber-500/30';
    if (p === 'MF' || p === 'M' || p.includes('MILIEU')) return 'bg-blue-500/15 text-blue-700 border-blue-500/30';
    if (p === 'FW' || p === 'F' || p.includes('ATTAQUANT')) return 'bg-sky-500/15 text-sky-700 border-sky-500/30';
    return 'bg-neutral-500/10 text-neutral-700 border-neutral-500/20';
}

export default function MatchShow({ match, teamPlayers, existingLineup = [] }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditingScores, setIsEditingScores] = useState(false);
    const [lineupDialogOpen, setLineupDialogOpen] = useState(false);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);

    const { data: scoreData, setData: setScoreData, put: updateMatch } = useForm({
        home_score: match.home_score || null,
        away_score: match.away_score || null,
        status: match.status,
    });

    const { data: lineupData, setData: setLineupData, post: saveLineup } = useForm({
        lineup: existingLineup.length > 0 ? existingLineup : [],
    });

    const { data: eventData, setData: setEventData, post: addEvent } = useForm({
        type: 'goal',
        player_id: '',
        minute: '',
        description: '',
    });

    const handleSaveScores = () => {
        updateMatch(`/admin/matches/${match.id}`, {
            onSuccess: () => {
                setIsEditingScores(false);
            },
        });
    };

    const handleSaveLineup = () => {
        saveLineup(`/admin/matches/${match.id}/lineup`, {
            onSuccess: () => {
                setLineupDialogOpen(false);
            },
        });
    };

    const handleAddEvent = () => {
        addEvent(`/admin/matches/${match.id}/events`, {
            onSuccess: () => {
                setEventDialogOpen(false);
                setEventData({
                    type: 'goal',
                    player_id: '',
                    minute: '',
                    description: '',
                });
            },
        });
    };

    const eventTypes = {
        goal: { label: 'But', icon: Target, color: 'text-green-600' },
        yellow_card: { label: 'Carton Jaune', icon: CreditCard, color: 'text-yellow-600' },
        red_card: { label: 'Carton Rouge', icon: CreditCard, color: 'text-red-600' },
        injury: { label: 'Blessure', icon: AlertTriangle, color: 'text-orange-600' },
        substitution: { label: 'Remplacement', icon: Users, color: 'text-blue-600' },
    };

    const startingXI = lineupData.lineup.filter(p => p.position === 'titulaire' && p.starting_position).sort((a, b) => a.starting_position - b.starting_position);
    const substitutes = lineupData.lineup.filter(p => p.position === 'remplacante');
    const opponentName = match.opponent_team?.name || match.opponent || 'Adversaire';

    const availablePlayers = teamPlayers.filter(p => !lineupData.lineup.some(l => l.player_id === p.id));
    const totalSelected = lineupData.lineup.length;

    const addAsTitulaire = (player) => {
        const currentTitulaires = lineupData.lineup.filter(p => p.position === 'titulaire' && p.starting_position);
        if (currentTitulaires.length >= 11) return;
        const used = currentTitulaires.map(p => p.starting_position);
        let pos = null;
        for (let i = 1; i <= 11; i++) if (!used.includes(i)) { pos = i; break; }
        if (!pos) return;
        setLineupData('lineup', [
            ...lineupData.lineup,
            { player_id: player.id, position: 'titulaire', jersey_number: player.jersey_number, starting_position: pos },
        ]);
    };

    const addAsRemplacante = (player) => {
        if (substitutes.length >= 7) return;
        setLineupData('lineup', [
            ...lineupData.lineup,
            { player_id: player.id, position: 'remplacante', jersey_number: player.jersey_number, starting_position: null },
        ]);
    };

    const removeFromLineup = (playerId) => {
        setLineupData('lineup', lineupData.lineup.filter(l => l.player_id !== playerId));
    };

    const handleConfirmSquad = () => {
        saveLineup(`/admin/matches/${match.id}/lineup`, { onSuccess: () => {} });
    };

    return (
        <AdminLayout>
            <Head title={`Match vs ${opponentName}`} />
            <div className="space-y-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/admin/fixtures" className="hover:text-foreground">Calendrier</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-foreground">Match vs {opponentName}</span>
                </nav>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Détails du match</h1>
                        <p className="text-sm text-muted-foreground mt-1">{match.team?.name} • {match.category}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/matches">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <Link href={`/admin/matches/${match.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Workflow steps */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap gap-1 rounded-lg border border-neutral-200 bg-white p-1 flex-1">
                        {[
                            { id: 'overview', label: '1. Infos match' },
                            { id: 'lineup', label: '2. Composition' },
                            { id: 'events', label: '3. Événements' },
                        ].map((step) => (
                            <button
                                key={step.id}
                                type="button"
                                onClick={() => setActiveTab(step.id)}
                                className={`flex-1 min-w-[120px] rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                                    activeTab === step.id ? 'bg-primary text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                            >
                                {step.label}
                            </button>
                        ))}
                    </div>
                    {activeTab === 'lineup' && (
                        <Button variant="outline" size="sm" className="shrink-0">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Charger composition précédente
                        </Button>
                    )}
                </div>

                {/* Hero banner */}
                <div className="rounded-xl bg-primary px-5 py-5 text-primary-foreground sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                <Trophy className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Match vs {opponentName}</h2>
                                <p className="text-sm text-primary-foreground/90">
                                    {match.scheduled_at
                                        ? new Date(match.scheduled_at).toLocaleDateString('fr-FR', {
                                              weekday: 'long',
                                              day: 'numeric',
                                              month: 'long',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : ''}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black tracking-tight">{startingXI.length}/11 titulaires</p>
                            <p className="text-sm text-primary-foreground/90">{substitutes.length} remplaçante{substitutes.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>

                {/* Overview: match info card only */}
                {activeTab === 'overview' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-1 border border-neutral-200 bg-white shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Badge>{match.category}</Badge>
                                <Badge variant={match.status === 'finished' ? 'default' : 'outline'}>
                                    {match.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {new Date(match.scheduled_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between py-6">
                            <div className="flex-1 text-center">
                                <h3 className="font-bold text-xl mb-2">{match.team?.name}</h3>
                                <p className="text-sm text-muted-foreground">{match.team?.category}</p>
                            </div>
                            <div className="px-8">
                                {isEditingScores ? (
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            value={scoreData.home_score || ''}
                                            onChange={(e) => setScoreData('home_score', parseInt(e.target.value) || null)}
                                            className="w-16 text-center text-2xl font-black"
                                        />
                                        <span className="text-3xl font-black">-</span>
                                        <Input
                                            type="number"
                                            value={scoreData.away_score || ''}
                                            onChange={(e) => setScoreData('away_score', parseInt(e.target.value) || null)}
                                            className="w-16 text-center text-2xl font-black"
                                        />
                                        <Button onClick={handleSaveScores} size="sm">
                                            <Save className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-primary mb-2">
                                            {match.home_score !== null && match.away_score !== null
                                                ? match.type === 'domicile'
                                                    ? `${match.home_score} - ${match.away_score}`
                                                    : `${match.away_score} - ${match.home_score}`
                                                : '-'
                                            }
                                        </div>
                                        {match.status === 'finished' && (
                                            <Button variant="ghost" size="sm" onClick={() => setIsEditingScores(true)}>
                                                Modifier
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center">
                                {match.opponent_team ? (
                                    <>
                                        {match.opponent_team.logo && (
                                            <img 
                                                src={`/storage/${match.opponent_team.logo}`} 
                                                alt={match.opponent_team.name}
                                                className="w-16 h-16 mx-auto mb-2 rounded-full object-cover"
                                            />
                                        )}
                                        <h3 className="font-bold text-xl mb-2">{match.opponent_team.name}</h3>
                                    </>
                                ) : (
                                    <h3 className="font-bold text-xl mb-2">{match.opponent}</h3>
                                )}
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    {match.type === 'domicile' ? (
                                        <Home className="w-4 h-4" />
                                    ) : (
                                        <Plane className="w-4 h-4" />
                                    )}
                                    <span>{match.type === 'domicile' ? 'Domicile' : 'Extérieur'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center text-sm text-muted-foreground border-t pt-4">
                            <Trophy className="w-4 h-4 inline mr-2" />
                            {match.venue}
                        </div>
                    </CardContent>
                </Card>
                </div>
                )}

                {/* Lineup: two-column convocation layout (Available Roster | Matchday Squad) */}
                {activeTab === 'lineup' && (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                    {/* Left: Effectif disponible */}
                    <div className="xl:col-span-2 space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Effectif disponible</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Cliquez + pour ajouter à la composition</p>
                        </div>
                        <div className="rounded-lg border border-neutral-200 bg-white p-3 space-y-2 max-h-[480px] overflow-y-auto">
                            {availablePlayers.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">Toutes les joueuses sont dans la composition.</p>
                            ) : (
                                availablePlayers.map((player) => (
                                    <div key={player.id} className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                                        <Avatar className="h-9 w-9 shrink-0">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{`${(player.first_name || '').charAt(0)}${(player.last_name || '').charAt(0)}`}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm truncate">{player.first_name} {player.last_name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`inline-flex rounded border px-1.5 py-0.5 text-xs font-medium ${positionPillClass(player.position)}`}>{player.position || '–'}</span>
                                                {player.jersey_number != null && <span className="text-xs text-muted-foreground">#{player.jersey_number}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            {startingXI.length < 11 && (
                                                <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => addAsTitulaire(player)} title="Ajouter titulaire">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {substitutes.length < 7 && (
                                                <Button type="button" variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => addAsRemplacante(player)} title="Ajouter remplaçante">
                                                    Rempl.
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Composition du match (Matchday Squad) */}
                    <div className="xl:col-span-3 space-y-4">
                        <div className="rounded-xl bg-primary px-4 py-4 text-primary-foreground flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Composition du match</h3>
                                    <p className="text-sm text-primary-foreground/90">Match vs {opponentName}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black tracking-tight">{totalSelected}/18</p>
                                <p className="text-xs text-primary-foreground/90 uppercase">Sélectionnées</p>
                            </div>
                        </div>

                        <Card className="border border-neutral-200 bg-white shadow-sm">
                            <CardContent className="pt-4 space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> XI titulaire • {startingXI.length}/11
                                    </h4>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {startingXI.map((player, idx) => {
                                            const info = teamPlayers.find((p) => p.id === player.player_id);
                                            return (
                                                <div key={idx} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 group">
                                                    <Avatar className="h-10 w-10 shrink-0">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{info ? `${(info.first_name || '').charAt(0)}${(info.last_name || '').charAt(0)}` : '?'}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-sm truncate">{info ? `${info.first_name} ${info.last_name}` : '–'}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className={`inline-flex rounded border px-1.5 py-0.5 text-xs font-medium ${positionPillClass(info?.position)}`}>{info?.position || '–'}</span>
                                                            {player.jersey_number != null && <span className="text-xs text-muted-foreground">#{player.jersey_number}</span>}
                                                        </div>
                                                    </div>
                                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{player.starting_position}</span>
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeFromLineup(player.player_id)} aria-label="Retirer">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                        {startingXI.length === 0 && <p className="col-span-2 text-sm text-muted-foreground py-4">Aucun titulaire. Ajoutez depuis l&apos;effectif disponible.</p>}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Remplaçantes • {substitutes.length}/7
                                    </h4>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {substitutes.map((player, idx) => {
                                            const info = teamPlayers.find((p) => p.id === player.player_id);
                                            return (
                                                <div key={idx} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 group">
                                                    <Avatar className="h-10 w-10 shrink-0">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{info ? `${(info.first_name || '').charAt(0)}${(info.last_name || '').charAt(0)}` : '?'}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-sm truncate">{info ? `${info.first_name} ${info.last_name}` : '–'}</p>
                                                        <span className={`inline-flex rounded border px-1.5 py-0.5 text-xs font-medium ${positionPillClass(info?.position)}`}>{info?.position || '–'}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="shrink-0">Rempl.</Badge>
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeFromLineup(player.player_id)} aria-label="Retirer">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                        <button
                                            type="button"
                                            onClick={() => setLineupDialogOpen(true)}
                                            className="flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50/50 p-3 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary col-span-2 sm:col-span-1"
                                        >
                                            <span className="text-2xl font-light">+</span>
                                            <span className="text-xs font-medium">Ajouter remplaçante</span>
                                        </button>
                                    </div>
                                </div>

                                <Button onClick={handleConfirmSquad} className="w-full bg-primary hover:bg-primary/90" size="lg">
                                    <Trophy className="w-4 h-4 mr-2" />
                                    Confirmer la composition
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                )}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
                        <TabsTrigger value="lineup">Composition</TabsTrigger>
                        <TabsTrigger value="events">Événements</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Composition
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {startingXI.length} titulaire{startingXI.length > 1 ? 's' : ''} / {substitutes.length} remplaçante{substitutes.length > 1 ? 's' : ''}
                                    </p>
                                    <Button onClick={() => setLineupDialogOpen(true)} className="w-full">
                                        Gérer la composition
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Événements du match
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {match.events?.length || 0} événement{(match.events?.length || 0) > 1 ? 's' : ''}
                                    </p>
                                    <Button onClick={() => setEventDialogOpen(true)} className="w-full">
                                        Ajouter un événement
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="lineup">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Composition</CardTitle>
                                    <Button onClick={() => setLineupDialogOpen(true)}>
                                        Modifier
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3">XI Titulaire</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {startingXI.map((player, idx) => {
                                                const playerInfo = teamPlayers.find(p => p.id === player.player_id);
                                                return (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-card rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-primary w-6">{player.starting_position}</span>
                                                            <span>{playerInfo?.first_name} {playerInfo?.last_name}</span>
                                                            <Badge variant="outline">{playerInfo?.position}</Badge>
                                                        </div>
                                                        {player.jersey_number && (
                                                            <Badge>#{player.jersey_number}</Badge>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {substitutes.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">Remplaçantes</h3>
                                            <div className="grid grid-cols-1 gap-2">
                                                {substitutes.map((player, idx) => {
                                                    const playerInfo = teamPlayers.find(p => p.id === player.player_id);
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-card rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <span>{playerInfo?.first_name} {playerInfo?.last_name}</span>
                                                                <Badge variant="outline">{playerInfo?.position}</Badge>
                                                            </div>
                                                            {player.jersey_number && (
                                                                <Badge>#{player.jersey_number}</Badge>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="events">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Événements du match</CardTitle>
                                    <Button onClick={() => setEventDialogOpen(true)}>
                                        Ajouter
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {match.events?.length > 0 ? (
                                        match.events.map((event) => {
                                            const eventType = eventTypes[event.type] || { label: event.type, icon: Target, color: 'text-gray-600' };
                                            const Icon = eventType.icon;
                                            return (
                                                <div key={event.id} className="flex items-center justify-between gap-2 p-3 bg-card rounded-lg group">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <Icon className={`w-5 h-5 shrink-0 ${eventType.color}`} />
                                                        <div>
                                                            {event.type === 'substitution' && event.substituted_player ? (
                                                                <span className="font-semibold">{event.substituted_player.first_name} {event.substituted_player.last_name} → {event.player ? `${event.player.first_name} ${event.player.last_name}` : '-'}</span>
                                                            ) : (
                                                                <span className="font-semibold">{event.player?.first_name} {event.player?.last_name}</span>
                                                            )}
                                                            <span className="text-sm text-muted-foreground ml-2">({event.minute}&apos;)</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <Badge>{eventType.label}</Badge>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                            aria-label="Supprimer"
                                                            onClick={() => {
                                                                if (window.confirm('Supprimer cet événement ?')) {
                                                                    router.delete(`/admin/matches/${match.id}/events/${event.id}`);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">Aucun événement enregistré</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notes">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes du match</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Rapport de match</Label>
                                        <p className="mt-2 p-4 bg-card rounded-lg min-h-[100px]">
                                            {match.match_report || 'Aucun rapport enregistré'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label>Notes de l'entraîneur</Label>
                                        <p className="mt-2 p-4 bg-card rounded-lg min-h-[100px]">
                                            {match.coach_notes || 'Aucune note enregistrée'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Lineup Dialog */}
                <Dialog open={lineupDialogOpen} onOpenChange={setLineupDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Gérer la composition</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Titulaires</Label>
                                <div className="grid grid-cols-1 gap-2 mt-2">
                                    {teamPlayers.map((player) => {
                                        const inLineup = lineupData.lineup.find(l => l.player_id === player.id);
                                        return (
                                            <div key={player.id} className="flex items-center gap-3 p-2 border rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={!!inLineup}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setLineupData('lineup', [
                                                                ...lineupData.lineup,
                                                                {
                                                                    player_id: player.id,
                                                                    position: 'titulaire',
                                                                    jersey_number: player.jersey_number,
                                                                    starting_position: null,
                                                                }
                                                            ]);
                                                        } else {
                                                            setLineupData('lineup', lineupData.lineup.filter(l => l.player_id !== player.id));
                                                        }
                                                    }}
                                                />
                                                <span className="flex-1">{player.first_name} {player.last_name}</span>
                                                <Badge variant="outline">{player.position}</Badge>
                                                {inLineup && (
                                                    <Input
                                                        type="number"
                                                        placeholder="Position"
                                                        value={inLineup.starting_position || ''}
                                                        onChange={(e) => {
                                                            setLineupData('lineup', lineupData.lineup.map(l => 
                                                                l.player_id === player.id 
                                                                    ? { ...l, starting_position: parseInt(e.target.value) || null }
                                                                    : l
                                                            ));
                                                        }}
                                                        className="w-20"
                                                        min="1"
                                                        max="11"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSaveLineup} className="flex-1">
                                    Enregistrer
                                </Button>
                                <Button variant="outline" onClick={() => setLineupDialogOpen(false)}>
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Event Dialog */}
                <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ajouter un événement</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Type</Label>
                                <Select value={eventData.type} onValueChange={(value) => setEventData('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(eventTypes).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Joueuse</Label>
                                <Select value={eventData.player_id} onValueChange={(value) => setEventData('player_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une joueuse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teamPlayers.map((player) => (
                                            <SelectItem key={player.id} value={player.id.toString()}>
                                                {player.first_name} {player.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Minute</Label>
                                <Input
                                    type="number"
                                    value={eventData.minute}
                                    onChange={(e) => setEventData('minute', e.target.value)}
                                    min="1"
                                    max="120"
                                />
                            </div>
                            <div>
                                <Label>Description (optionnel)</Label>
                                <Input
                                    value={eventData.description}
                                    onChange={(e) => setEventData('description', e.target.value)}
                                    placeholder="Description..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleAddEvent} className="flex-1">
                                    Ajouter
                                </Button>
                                <Button variant="outline" onClick={() => setEventDialogOpen(false)}>
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}

