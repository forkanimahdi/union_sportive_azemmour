import React, { useState, useCallback, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Calendar,
    Users,
    Target,
    ChevronRight,
    Loader2,
    ArrowLeft,
    CreditCard,
    AlertTriangle,
    Trash2,
    ArrowDownToLine,
    ArrowUpFromLine,
} from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'scheduled', label: 'Programmé' },
    { value: 'live', label: 'En direct' },
    { value: 'finished', label: 'Terminé' },
    { value: 'postponed', label: 'Reporté' },
    { value: 'cancelled', label: 'Annulé' },
];

const EVENT_TYPES = {
    goal: { label: 'But', icon: Target, color: 'text-green-600' },
    yellow_card: { label: 'Carton Jaune', icon: CreditCard, color: 'text-yellow-600' },
    red_card: { label: 'Carton Rouge', icon: CreditCard, color: 'text-red-600' },
    injury: { label: 'Blessure', icon: AlertTriangle, color: 'text-orange-600' },
    substitution: { label: 'Remplacement', icon: Users, color: 'text-blue-600' },
    penalty: { label: 'Pénalty', icon: Target, color: 'text-green-600' },
    missed_penalty: { label: 'Pénalty raté', icon: Target, color: 'text-neutral-500' },
    own_goal: { label: 'CSC', icon: Target, color: 'text-red-600' },
};

export default function MatchDetailsModal({ open, onOpenChange, match, onSuccess }) {
    const [scoreEditing, setScoreEditing] = useState(false);
    const [manageView, setManageView] = useState(false);
    const [fullData, setFullData] = useState(null);
    const [loadingFull, setLoadingFull] = useState(false);
    const [lineupDialogOpen, setLineupDialogOpen] = useState(false);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);

    const statusForm = useForm({ status: match?.status || 'scheduled' });
    const scoreForm = useForm({
        home_score: match?.home_score ?? '',
        away_score: match?.away_score ?? '',
    });

    const refetchMatchData = useCallback(() => {
        if (!match?.id) return;
        fetch(`/admin/matches/${match.id}/data`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => setFullData(data))
            .catch(() => setFullData(null));
    }, [match?.id]);

    const handleOpenManage = () => {
        setLoadingFull(true);
        fetch(`/admin/matches/${match.id}/data`, { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => {
                setFullData(data);
                setManageView(true);
            })
            .catch(() => setFullData(null))
            .finally(() => setLoadingFull(false));
    };

    const handleStatusSubmit = (e) => {
        e.preventDefault();
        statusForm.post(`/admin/matches/${match.id}/update-status`, {
            preserveScroll: true,
            onSuccess: () => onSuccess?.(),
        });
    };

    const handleScoreSubmit = (e) => {
        e.preventDefault();
        const home = parseInt(scoreForm.data.home_score, 10);
        const away = parseInt(scoreForm.data.away_score, 10);
        if (isNaN(home) || isNaN(away) || home < 0 || away < 0) return;
        router.post(
            `/admin/matches/${match.id}/update-score`,
            { home_score: home, away_score: away },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setScoreEditing(false);
                    onSuccess?.();
                },
            }
        );
    };

    if (!match) return null;

    const ourName = match.team?.name || 'Notre équipe';
    const opponentName = match.opponent_team?.name || match.opponent || 'Adversaire';
    const isHome = match.type === 'domicile';
    const leftName = isHome ? ourName : opponentName;
    const rightName = isHome ? opponentName : ourName;
    const leftScore = isHome ? match.home_score : match.away_score;
    const rightScore = isHome ? match.away_score : match.home_score;

    const displayMatch = fullData?.match ?? match;
    const teamPlayers = fullData?.teamPlayers ?? [];
    const existingLineup = fullData?.existingLineup ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {manageView ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="-ml-2"
                                onClick={() => {
                                    setManageView(false);
                                    setFullData(null);
                                }}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Détails du match
                            </Button>
                        ) : (
                            'Détails du match'
                        )}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {!manageView ? (
                        <>
                            <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                                <div className="min-w-0 flex-1 text-center">
                                    <p className="truncate font-semibold text-neutral-900">{leftName}</p>
                                    {leftScore != null && rightScore != null && (
                                        <p className="mt-1 text-2xl font-bold text-primary">
                                            {leftScore} - {rightScore}
                                        </p>
                                    )}
                                </div>
                                <span className="text-neutral-400">VS</span>
                                <div className="min-w-0 flex-1 text-center">
                                    <p className="truncate font-semibold text-neutral-900">{rightName}</p>
                                    {leftScore != null && rightScore != null && (
                                        <p className="mt-1 text-2xl font-bold text-primary">
                                            {rightScore} - {leftScore}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {match.scheduled_at
                                        ? new Date(match.scheduled_at).toLocaleDateString('fr-FR', {
                                              weekday: 'short',
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : '-'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {match.venue || (match.type === 'domicile' ? 'Domicile' : 'Extérieur')}
                                </span>
                            </div>
                            <form onSubmit={handleStatusSubmit} className="space-y-2 rounded-lg border border-neutral-200 p-4">
                                <Label>Statut du match</Label>
                                <div className="flex gap-2">
                                    <Select value={statusForm.data.status} onValueChange={(v) => statusForm.setData('status', v)}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button type="submit" size="sm" disabled={statusForm.processing}>
                                        Enregistrer
                                    </Button>
                                </div>
                            </form>
                            <form onSubmit={handleScoreSubmit} className="space-y-2 rounded-lg border border-neutral-200 p-4">
                                <Label>Score</Label>
                                {scoreEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            value={scoreForm.data.home_score}
                                            onChange={(e) => scoreForm.setData('home_score', e.target.value)}
                                            className="w-20 text-center"
                                        />
                                        <span className="font-medium">-</span>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={scoreForm.data.away_score}
                                            onChange={(e) => scoreForm.setData('away_score', e.target.value)}
                                            className="w-20 text-center"
                                        />
                                        <Button type="submit" size="sm" disabled={scoreForm.processing}>
                                            Enregistrer
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setScoreEditing(false)}>
                                            Annuler
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-semibold">
                                            {match.home_score ?? 0} - {match.away_score ?? 0}
                                        </span>
                                        <Button type="button" variant="outline" size="sm" onClick={() => setScoreEditing(true)}>
                                            Modifier le score
                                        </Button>
                                    </div>
                                )}
                            </form>
                            <Button
                                variant="outline"
                                className="w-full border-primary text-primary hover:bg-primary/10"
                                onClick={handleOpenManage}
                                disabled={loadingFull}
                            >
                                {loadingFull ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <ChevronRight className="mr-2 h-4 w-4" />
                                )}
                                Gérer composition, buts, cartons et remplacements
                            </Button>
                        </>
                    ) : (
                        <ManageView
                            matchId={match.id}
                            displayMatch={displayMatch}
                            teamPlayers={teamPlayers}
                            existingLineup={existingLineup}
                            refetchMatchData={refetchMatchData}
                            lineupDialogOpen={lineupDialogOpen}
                            setLineupDialogOpen={setLineupDialogOpen}
                            eventDialogOpen={eventDialogOpen}
                            setEventDialogOpen={setEventDialogOpen}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ManageView({
    matchId,
    displayMatch,
    teamPlayers,
    existingLineup,
    refetchMatchData,
    lineupDialogOpen,
    setLineupDialogOpen,
    eventDialogOpen,
    setEventDialogOpen,
}) {
    const [manageTab, setManageTab] = useState('lineup');

    const lineupForm = useForm({
        lineup: existingLineup.length > 0 ? existingLineup : [],
    });

    useEffect(() => {
        lineupForm.setData('lineup', Array.isArray(existingLineup) && existingLineup.length > 0 ? [...existingLineup] : []);
    }, [existingLineup]);

    const eventForm = useForm({
        type: 'goal',
        player_id: '',
        minute: '',
        description: '',
        substituted_player_id: '',
    });

    const handleSaveLineup = (e) => {
        e.preventDefault();
        const lineup = lineupForm.data.lineup.map((l) => ({
            ...l,
            position: l.starting_position >= 1 && l.starting_position <= 11 ? 'titulaire' : 'remplacante',
        }));
        router.post(`/admin/matches/${matchId}/lineup`, { lineup }, {
            preserveScroll: true,
            onSuccess: () => {
                refetchMatchData();
                setLineupDialogOpen(false);
            },
        });
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        const payload = {
            type: eventForm.data.type,
            player_id: eventForm.data.player_id || null,
            minute: eventForm.data.minute,
            description: eventForm.data.description || null,
            substituted_player_id: eventForm.data.substituted_player_id || null,
        };
        router.post(`/admin/matches/${matchId}/events`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                refetchMatchData();
                setEventDialogOpen(false);
                eventForm.setData({
                    type: 'goal',
                    player_id: '',
                    minute: '',
                    description: '',
                    substituted_player_id: '',
                });
            },
        });
    };

    const startingXI = lineupForm.data.lineup
        .filter((p) => p.position === 'titulaire' && p.starting_position)
        .sort((a, b) => (a.starting_position || 0) - (b.starting_position || 0));
    const substitutes = lineupForm.data.lineup.filter((p) => p.position === 'remplacante');

    return (
        <>
            <Tabs value={manageTab} onValueChange={setManageTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="lineup">Composition</TabsTrigger>
                    <TabsTrigger value="events">Événements</TabsTrigger>
                </TabsList>
                <TabsContent value="lineup" className="space-y-3 pt-3">
                    <p className="text-sm text-neutral-500">
                        {startingXI.length} titulaire{startingXI.length !== 1 ? 's' : ''} / {substitutes.length} remplaçante
                        {substitutes.length !== 1 ? 's' : ''}
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {startingXI.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-neutral-500 mb-1">Titulaires</h4>
                                {startingXI.map((player, idx) => {
                                    const info = teamPlayers.find((p) => p.id === player.player_id);
                                    return (
                                        <div key={idx} className="flex items-center justify-between py-1.5 text-sm">
                                            <span className="font-bold text-primary w-5">{player.starting_position}</span>
                                            <span>{info ? `${info.first_name} ${info.last_name}` : '-'}</span>
                                            {player.jersey_number && <Badge variant="outline">#{player.jersey_number}</Badge>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {substitutes.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-neutral-500 mb-1">Remplaçantes</h4>
                                {substitutes.map((player, idx) => {
                                    const info = teamPlayers.find((p) => p.id === player.player_id);
                                    return (
                                        <div key={idx} className="flex items-center justify-between py-1.5 text-sm">
                                            <span>{info ? `${info.first_name} ${info.last_name}` : '-'}</span>
                                            {player.jersey_number && <Badge variant="outline">#{player.jersey_number}</Badge>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {lineupForm.data.lineup.length === 0 && (
                            <p className="text-sm text-neutral-500 py-2">Aucune composition enregistrée.</p>
                        )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setLineupDialogOpen(true)}>
                        {lineupForm.data.lineup.length > 0 ? 'Modifier la composition' : 'Définir la composition'}
                    </Button>
                </TabsContent>
                <TabsContent value="events" className="space-y-3 pt-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {(displayMatch.events || []).length > 0 ? (
                            (displayMatch.events || []).map((event) => {
                                const cfg = EVENT_TYPES[event.type] || { label: event.type, icon: Target, color: 'text-neutral-600' };
                                const Icon = cfg.icon;
                                return (
                                    <div key={event.id} className="flex items-center justify-between gap-2 py-2 border-b border-neutral-100 text-sm group">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <Icon className={`h-4 w-4 shrink-0 ${cfg.color}`} />
                                            <span className="truncate">
                                                {event.type === 'substitution' && event.substituted_player
                                                    ? `${event.substituted_player.first_name} ${event.substituted_player.last_name} → ${event.player ? `${event.player.first_name} ${event.player.last_name}` : '-'}`
                                                    : event.player
                                                      ? `${event.player.first_name} ${event.player.last_name}`
                                                      : '-'}{' '}
                                                ({event.minute}&apos;)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Badge variant="outline">{cfg.label}</Badge>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Supprimer"
                                                onClick={() => {
                                                    if (window.confirm('Supprimer cet événement ?')) {
                                                        router.delete(`/admin/matches/${matchId}/events/${event.id}`, {
                                                            preserveScroll: true,
                                                            onSuccess: () => refetchMatchData(),
                                                        });
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-neutral-500 py-2">Aucun événement enregistré.</p>
                        )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setEventDialogOpen(true)}>
                        Ajouter un événement
                    </Button>
                </TabsContent>
            </Tabs>

            {/* Lineup dialog */}
            <Dialog open={lineupDialogOpen} onOpenChange={setLineupDialogOpen}>
                <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Gérer la composition</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveLineup} className="space-y-4">
                        <div>
                            <Label>Titulaires (cochez et numérotez 1-11)</Label>
                            <div className="grid gap-2 mt-2 max-h-64 overflow-y-auto">
                                {teamPlayers.map((player) => {
                                    const inLineup = lineupForm.data.lineup.find((l) => l.player_id === player.id);
                                    return (
                                        <div key={player.id} className="flex items-center gap-3 p-2 border rounded">
                                            <input
                                                type="checkbox"
                                                checked={!!inLineup}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        lineupForm.setData('lineup', [
                                                            ...lineupForm.data.lineup,
                                                            {
                                                                player_id: player.id,
                                                                position: 'titulaire',
                                                                jersey_number: player.jersey_number,
                                                                starting_position: null,
                                                            },
                                                        ]);
                                                    } else {
                                                        lineupForm.setData(
                                                            'lineup',
                                                            lineupForm.data.lineup.filter((l) => l.player_id !== player.id)
                                                        );
                                                    }
                                                }}
                                            />
                                            <span className="flex-1 truncate">{player.first_name} {player.last_name}</span>
                                            <Badge variant="outline">{player.position}</Badge>
                                            {inLineup && (
                                                <Input
                                                    type="number"
                                                    placeholder="#"
                                                    value={inLineup.starting_position ?? ''}
                                                    onChange={(e) => {
                                                        const v = parseInt(e.target.value, 10);
                                                        lineupForm.setData(
                                                            'lineup',
                                                            lineupForm.data.lineup.map((l) =>
                                                                l.player_id === player.id
                                                                    ? { ...l, starting_position: (v >= 1 && v <= 11) ? v : null }
                                                                    : l
                                                            )
                                                        );
                                                    }}
                                                    className="w-14"
                                                    min={1}
                                                    max={11}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={lineupForm.processing} className="flex-1">
                                Enregistrer
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setLineupDialogOpen(false)}>
                                Annuler
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Event dialog */}
            <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ajouter un événement</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddEvent} className="space-y-4">
                        <div>
                            <Label>Type</Label>
                            <Select value={eventForm.data.type} onValueChange={(v) => eventForm.setData('type', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(EVENT_TYPES).map(([key, val]) => (
                                        <SelectItem key={key} value={key}>
                                            {val.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {eventForm.data.type === 'substitution' ? (
                            <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    Remplacement
                                </p>
                                <div className="grid gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <ArrowDownToLine className="h-4 w-4" />
                                            Sortante
                                        </Label>
                                        <Select
                                            value={eventForm.data.substituted_player_id}
                                            onValueChange={(v) => eventForm.setData('substituted_player_id', v)}
                                        >
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Joueuse qui sort" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teamPlayers.map((p) => (
                                                    <SelectItem key={p.id} value={p.id.toString()}>
                                                        {p.first_name} {p.last_name}
                                                        {p.jersey_number != null ? ` #${p.jersey_number}` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="rounded-full bg-primary/10 p-1.5">
                                            <ArrowDownToLine className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <ArrowUpFromLine className="h-4 w-4" />
                                            Entrante
                                        </Label>
                                        <Select
                                            value={eventForm.data.player_id}
                                            onValueChange={(v) => eventForm.setData('player_id', v)}
                                        >
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Joueuse qui entre" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teamPlayers.map((p) => (
                                                    <SelectItem key={p.id} value={p.id.toString()}>
                                                        {p.first_name} {p.last_name}
                                                        {p.jersey_number != null ? ` #${p.jersey_number}` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Label>Joueuse</Label>
                                <Select value={eventForm.data.player_id} onValueChange={(v) => eventForm.setData('player_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teamPlayers.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.first_name} {p.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div>
                            <Label>Minute</Label>
                            <Input
                                type="number"
                                min={1}
                                max={120}
                                value={eventForm.data.minute}
                                onChange={(e) => eventForm.setData('minute', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Description (optionnel)</Label>
                            <Input
                                value={eventForm.data.description}
                                onChange={(e) => eventForm.setData('description', e.target.value)}
                                placeholder="Description..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={eventForm.processing} className="flex-1">
                                Ajouter
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setEventDialogOpen(false)}>
                                Annuler
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
