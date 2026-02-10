import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    ArrowLeft,
    Download,
    Plus,
    Users,
    UserPlus,
    Search,
    AlertTriangle,
    Filter as FilterIcon,
    User,
    History,
    UserCheck,
    X,
    CalendarDays,
    MapPin,
    FileText,
} from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';

const CLUB_LOGO = '/assets/images/logo.png';

function getStatusConfig(status) {
    switch (status) {
        case 'finished':
            return { label: 'TERMINÉ', className: 'bg-primary/10 text-primary font-semibold' };
        case 'live':
            return { label: 'EN DIRECT', className: 'bg-red-500/10 text-red-600 font-semibold' };
        case 'postponed':
            return { label: 'REPORTÉ', className: 'bg-amber-500/10 text-amber-700 font-semibold' };
        case 'cancelled':
            return { label: 'ANNULÉ', className: 'bg-neutral-200 text-neutral-600 font-semibold' };
        default:
            return { label: 'À VENIR', className: 'bg-primary/10 text-primary font-semibold' };
    }
}

function getLocationLabel(venue, type) {
    if (venue === 'domicile' || type === 'domicile') return 'Terrain à domicile';
    return 'Extérieur';
}

function playerPhotoUrl(photo) {
    if (!photo) return null;
    return photo.startsWith('http') ? photo : `/storage/${photo}`;
}

function playerStatus(player) {
    if (player.can_play) return { label: 'Prête', variant: 'ready' };
    if (player.block_reason) return { label: 'Bloquée', variant: 'blocked' };
    return { label: 'En attente', variant: 'pending' };
}

export default function TeamsShow({ team, availablePlayers = [] }) {
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [playerToRemove, setPlayerToRemove] = useState(null);
    const [positionFilter, setPositionFilter] = useState('all');
    const [squadSort, setSquadSort] = useState('number');

    const stats = team.stats || {
        total_players: team.players?.length || 0,
        match_ready: 0,
        action_required: 0,
        avg_age: null,
    };

    const { data, setData, post, processing } = useForm({
        player_id: '',
    });

    const handleAssignPlayer = () => {
        if (!selectedPlayerId) return;
        setData('player_id', selectedPlayerId);
        post(`/admin/teams/${team.id}/assign-player`, {
            onSuccess: () => {
                setAssignDialogOpen(false);
                setSelectedPlayerId('');
                setData('player_id', '');
            },
        });
    };

    const handleRemovePlayer = (playerId) => {
        setPlayerToRemove(playerId);
        setDeleteModalOpen(true);
    };

    const confirmRemovePlayer = () => {
        if (playerToRemove) {
            router.delete(`/admin/teams/${team.id}/players/${playerToRemove}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setPlayerToRemove(null);
                },
            });
        }
    };

    const filteredAvailablePlayers = availablePlayers.filter(
        (p) =>
            !team.players?.some((tp) => tp.id === p.id) &&
            (searchTerm === '' ||
                `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const activeSquad = team.players || [];
    const filteredSquad =
        positionFilter === 'all'
            ? activeSquad
            : activeSquad.filter((p) => (p.position || '').toLowerCase() === positionFilter.toLowerCase());
    const sortedSquad = [...filteredSquad].sort((a, b) => {
        if (squadSort === 'number') {
            const na = a.jersey_number != null ? Number(a.jersey_number) : 999;
            const nb = b.jersey_number != null ? Number(b.jersey_number) : 999;
            return na - nb;
        }
        return (a.last_name || '').localeCompare(b.last_name || '');
    });

    const formerPlayers = team.former_players || [];
    const trialists = team.trialists || [];
    const teamMatches = team.matches || [];
    const actionRequiredCount = stats.action_required || 0;

    const breadcrumbs = [
        { label: 'Accueil', href: '/admin' },
        { label: 'Équipes', href: '/admin/teams' },
        { label: team.name, href: null },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={team.name} />
            <div className="space-y-6 p-4 sm:p-6">
                {/* Back + Title */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href="/admin/teams">
                            <Button variant="ghost" size="sm" className="mb-2 -ml-2">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <h1 className="text-2xl font-bold text-foreground">{team.name}</h1>
                            {(team.division || team.category) && (
                                <Badge variant="secondary" className="font-normal">
                                    {team.division || team.category}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                            Vue d&apos;ensemble de l&apos;effectif. Suivi des certificats médicaux et du statut
                            d&apos;inscription.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href={`/admin/teams/${team.id}/export`}>
                                <Download className="w-4 h-4 mr-2" />
                                Exporter l&apos;effectif
                            </a>
                        </Button>
                        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter une joueuse
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Ajouter une joueuse</DialogTitle>
                                    <DialogDescription>
                                        Choisir une joueuse à assigner à cette équipe.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                        {filteredAvailablePlayers.length > 0 ? (
                                            filteredAvailablePlayers.map((player) => (
                                                <div
                                                    key={player.id}
                                                    onClick={() => setSelectedPlayerId(player.id)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                                        selectedPlayerId === player.id
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:bg-muted/50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">
                                                                {player.first_name} {player.last_name}
                                                            </p>
                                                            {player.position && (
                                                                <p className="text-sm text-muted-foreground capitalize">
                                                                    {player.position}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {selectedPlayerId === player.id && (
                                                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-muted-foreground py-4">
                                                Aucune joueuse disponible
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2 border-t">
                                        <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                                            Annuler
                                        </Button>
                                        <Button
                                            onClick={handleAssignPlayer}
                                            disabled={!selectedPlayerId || processing}
                                        >
                                            {processing ? 'Assignation...' : 'Assigner'}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border bg-card">
                        <CardContent className="p-4">
                            <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                                Total joueuses
                            </p>
                            <p className="text-2xl font-bold text-foreground mt-1">{stats.total_players}</p>
                        </CardContent>
                    </Card>
                    <Card className="border bg-card">
                        <CardContent className="p-4">
                            <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                                Prêtes à jouer
                            </p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{stats.match_ready}</p>
                        </CardContent>
                    </Card>
                    <Card
                        className={`border bg-card ${actionRequiredCount > 0 ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}
                    >
                        <CardContent className="p-4">
                            <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                                Action requise
                            </p>
                            <p className="text-2xl font-bold text-destructive mt-1">{stats.action_required}</p>
                        </CardContent>
                    </Card>
                    <Card className="border bg-card">
                        <CardContent className="p-4">
                            <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                                Âge moyen
                            </p>
                            <p className="text-2xl font-bold text-foreground mt-1">
                                {stats.avg_age != null ? stats.avg_age : '–'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs: Matches / Active Squad / Former Players / Trialists */}
                <Tabs defaultValue="matches" className="space-y-4">
                    <TabsList className="bg-muted/50 p-1 h-auto flex flex-wrap">
                        <TabsTrigger value="matches" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <CalendarDays className="w-4 h-4" />
                            Matchs ({teamMatches.length})
                        </TabsTrigger>
                        <TabsTrigger value="active" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Users className="w-4 h-4" />
                            Effectif ({activeSquad.length})
                        </TabsTrigger>
                        <TabsTrigger value="former" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <History className="w-4 h-4" />
                            Anciennes joueuses
                        </TabsTrigger>
                        <TabsTrigger value="trialists" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <UserCheck className="w-4 h-4" />
                            Essai
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="matches" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <CalendarDays className="w-5 h-5" />
                                Matchs de l&apos;équipe
                            </h2>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/fixtures">Voir le calendrier</Link>
                            </Button>
                        </div>
                        {teamMatches.length > 0 ? (
                            <div className="space-y-4">
                                {teamMatches.map((m) => {
                                    const isHome = m.type === 'domicile';
                                    const ourTeam = { name: team.name, logo: null };
                                    const opponent = m.opponent_team
                                        ? { name: m.opponent_team.name, logo: m.opponent_team.logo }
                                        : { name: m.opponent || 'Adversaire', logo: null };
                                    const leftTeam = isHome ? ourTeam : opponent;
                                    const rightTeam = isHome ? opponent : ourTeam;
                                    const leftScore = isHome ? m.home_score : m.away_score;
                                    const rightScore = isHome ? m.away_score : m.home_score;
                                    const isFinished = m.status === 'finished';
                                    const isLive = m.status === 'live';
                                    const statusConfig = getStatusConfig(m.status);
                                    const formatDate = (dateString) => {
                                        const d = new Date(dateString);
                                        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                                    };
                                    const formatTime = (dateString) => {
                                        const d = new Date(dateString);
                                        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                                    };
                                    return (
                                        <div
                                            key={m.id}
                                            className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            {isLive && (
                                                <div className="absolute right-4 top-4 flex h-6 items-center gap-1 rounded-full bg-red-500 px-2.5 text-xs font-bold text-white">
                                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                                                    LIVE
                                                </div>
                                            )}
                                            <div className="p-5 sm:p-6">
                                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                                    <span className={`inline-flex items-center rounded px-2.5 py-1 text-xs ${statusConfig.className}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                    {!isLive && <span className="text-sm text-neutral-500">{formatDate(m.scheduled_at)}</span>}
                                                    {isLive && <span className="text-sm font-medium text-neutral-700">Aujourd&apos;hui</span>}
                                                    {!isLive && <span className="text-sm font-medium text-neutral-700">{formatTime(m.scheduled_at)}</span>}
                                                </div>
                                                <div className="flex flex-wrap items-center justify-between gap-6">
                                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
                                                            {isHome ? (
                                                                <img src={CLUB_LOGO} alt="" className="h-12 w-12 object-cover" />
                                                            ) : leftTeam.logo ? (
                                                                <img src={`/storage/${leftTeam.logo}`} alt="" className="h-12 w-12 object-cover" />
                                                            ) : (
                                                                <span className="text-sm font-bold text-neutral-600">{(leftTeam.name || '').slice(0, 2).toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                        <span className="truncate font-semibold text-neutral-900">{leftTeam.name}</span>
                                                    </div>
                                                    <div className="flex shrink-0 flex-col items-center">
                                                        {isFinished && leftScore != null && rightScore != null ? (
                                                            <>
                                                                <span className="text-2xl font-bold text-neutral-900">{leftScore} - {rightScore}</span>
                                                                <span className="text-xs font-medium text-neutral-500">SCORE FINAL</span>
                                                            </>
                                                        ) : isLive ? (
                                                            <>
                                                                <span className="text-2xl font-bold text-neutral-900">{leftScore ?? 0} - {rightScore ?? 0}</span>
                                                                <span className="text-xs font-medium text-red-600">EN COURS</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xl font-bold text-neutral-300">VS</span>
                                                        )}
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 items-center gap-3 justify-end">
                                                        <span className="truncate text-right font-semibold text-neutral-900">{rightTeam.name}</span>
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
                                                            {!isHome ? (
                                                                <img src={CLUB_LOGO} alt="" className="h-12 w-12 object-cover" />
                                                            ) : rightTeam.logo ? (
                                                                <img src={`/storage/${rightTeam.logo}`} alt="" className="h-12 w-12 object-cover" />
                                                            ) : (
                                                                <span className="text-sm font-bold text-neutral-600">{(rightTeam.name || '').slice(0, 2).toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-4">
                                                    <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                                                        <MapPin className="h-4 w-4" />
                                                        {getLocationLabel(m.venue, m.type)}
                                                    </div>
                                                    <Link href={`/admin/matches/${m.id}`}>
                                                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                                                            <FileText className="mr-1.5 h-4 w-4" />
                                                            Détails
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center text-neutral-500">
                                Aucun match pour cette équipe.
                                <br />
                                <Button variant="link" className="mt-2" asChild>
                                    <Link href="/admin/fixtures">Voir le calendrier</Link>
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="active" className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-lg font-semibold text-foreground">Effectif actif</h2>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <FilterIcon className="w-3.5 h-3.5" />
                                    {positionFilter === 'all' ? 'Toutes positions' : positionFilter}
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <FilterIcon className="w-3.5 h-3.5" />
                                    {squadSort === 'number' ? 'Numéro' : 'Nom'}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {sortedSquad.map((player) => {
                                const status = playerStatus(player);
                                const isBlocked = status.variant === 'blocked';
                                const photoUrl = playerPhotoUrl(player.photo);
                                return (
                                    <Card
                                        key={player.id}
                                        className={`overflow-hidden border bg-card flex flex-col ${isBlocked ? 'border-destructive/50' : ''}`}
                                    >
                                        <CardContent className="p-0 flex flex-col flex-1">
                                            <div className="relative p-4 pb-2">
                                                {isBlocked && (
                                                    <div className="absolute top-2 right-2">
                                                        <AlertTriangle className="w-5 h-5 text-destructive" />
                                                    </div>
                                                )}
                                                <div className="flex gap-3">
                                                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                                                        {photoUrl ? (
                                                            <img
                                                                src={photoUrl}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center">
                                                                <User className="w-8 h-8 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        {player.jersey_number != null && (
                                                            <span className="absolute top-0 right-0 bg-background/90 text-xs font-bold px-1.5 py-0.5 rounded-bl">
                                                                {String(player.jersey_number).padStart(2, '0')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-foreground truncate">
                                                            {player.first_name} {player.last_name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground capitalize">
                                                            {player.position || '–'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {isBlocked && player.block_reason && (
                                                    <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                                                        {player.has_valid_medical === false && 'Certificat médical manquant ou expiré'}
                                                        {player.has_valid_medical !== false && player.block_reason}
                                                    </p>
                                                )}
                                                <div className="mt-3 flex items-center justify-between gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                                                            status.variant === 'ready'
                                                                ? 'text-green-600'
                                                                : status.variant === 'blocked'
                                                                  ? 'text-destructive'
                                                                  : 'text-amber-600'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                status.variant === 'ready'
                                                                    ? 'bg-green-500'
                                                                    : status.variant === 'blocked'
                                                                      ? 'bg-destructive'
                                                                      : 'bg-amber-500'
                                                            }`}
                                                        />
                                                        {status.label}
                                                    </span>
                                                    {isBlocked && (
                                                        <Link href={`/admin/players/${player.id}`}>
                                                            <Button size="sm" variant="destructive" className="h-7 text-xs">
                                                                Corriger
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/players/${player.id}`}
                                                        className="text-xs text-primary hover:underline"
                                                    >
                                                        Voir le profil
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                                        onClick={() => handleRemovePlayer(player.id)}
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            {/* Add player card */}
                            <Card
                                className="border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors flex flex-col min-h-[140px]"
                                onClick={() => setAssignDialogOpen(true)}
                            >
                                <CardContent className="p-4 flex flex-col flex-1 items-center justify-center">
                                    <Plus className="w-10 h-10 text-muted-foreground mb-2" />
                                    <span className="text-sm font-medium text-muted-foreground">Ajouter une joueuse</span>
                                </CardContent>
                            </Card>
                        </div>

                        {actionRequiredCount > 0 && (
                            <Card className="border-destructive bg-destructive/5">
                                <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                                        <p className="font-medium text-foreground">
                                            <strong>Attention conformité</strong> — {actionRequiredCount} joueuse
                                            {actionRequiredCount > 1 ? 's' : ''} actuellement inéligible
                                            {actionRequiredCount > 1 ? 's' : ''}.
                                        </p>
                                    </div>
                                    <Link href={`/admin/teams/${team.id}`}>
                                        <Button variant="destructive" size="sm">
                                            Vérifier
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="former" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <History className="w-5 h-5" />
                                Anciennes joueuses
                            </h2>
                            <a href="#" className="text-sm text-muted-foreground hover:underline">
                                Paramètres d&apos;archivage
                            </a>
                        </div>
                        {formerPlayers.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {formerPlayers.map((p) => (
                                    <Card key={p.id} className="border bg-card opacity-80">
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                                <User className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{p.first_name} {p.last_name}</p>
                                                <p className="text-xs text-muted-foreground">{p.status_label || 'Ancienne'}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="border bg-card">
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    Aucune ancienne joueuse enregistrée.
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="trialists" className="space-y-4">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            En essai
                        </h2>
                        {trialists.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {trialists.map((p) => (
                                    <Card key={p.id} className="border bg-card">
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                                <User className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{p.first_name} {p.last_name}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{p.position}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="border bg-card">
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    Aucune joueuse en essai.
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>

                <DeleteModal
                    open={deleteModalOpen}
                    onOpenChange={setDeleteModalOpen}
                    onConfirm={confirmRemovePlayer}
                    title="Retirer la joueuse"
                    description="Êtes-vous sûr de vouloir retirer cette joueuse de l'équipe ?"
                />
            </div>
        </AdminLayout>
    );
}
