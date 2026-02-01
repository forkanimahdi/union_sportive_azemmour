import React, { useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/ui/chart';
import {
    Bar,
    BarChart,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import {
    ArrowLeft,
    Edit,
    Trophy,
    Users,
    Target,
    Zap,
    Clock,
    Home,
    Plane,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Activity,
    Info,
    Shield,
} from 'lucide-react';

const POSITION_LABELS = {
    gardien: 'Gardien',
    defenseur: 'Défenseur',
    milieu: 'Milieu',
    attaquant: 'Attaquant',
};

const POSITION_SHORT = {
    gardien: 'GK',
    defenseur: 'DEF',
    milieu: 'MID',
    attaquant: 'FWD',
};

const FOOT_LABELS = {
    gauche: 'Gauche',
    droit: 'Droit',
    ambidextre: 'Ambidextre',
};

const statsChartConfig = {
    value: { label: 'Valeur', color: 'var(--color-primary)' },
};

export default function PlayersShow({ player }) {
    const [teammateIndex, setTeammateIndex] = useState(0);
    const teammatesPerView = 5;

    const positionLabel = player.position ? POSITION_LABELS[player.position] || player.position : '';
    const positionShort = player.position ? POSITION_SHORT[player.position] : null;
    const footLabel = player.preferred_foot ? FOOT_LABELS[player.preferred_foot] : null;
    const statusLabel = player.status_label || (player.can_play ? 'FIT' : player.is_injured ? 'INJURED' : 'LEFT');

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
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

    const chartData = useMemo(() => {
        const stats = player.stats || {};
        const isGK = player.position === 'gardien';
        const base = [
            { label: 'MP', value: stats.appearances ?? 0, fill: 'var(--color-primary)' },
            { label: 'B', value: stats.goals ?? 0, fill: 'var(--color-chart-1)' },
            { label: 'PD', value: stats.assists ?? 0, fill: 'var(--color-chart-2)' },
        ];
        if (isGK) {
            base.push(
                { label: 'CS', value: stats.clean_sheets ?? 0, fill: 'var(--color-chart-3)' },
                { label: 'Arrêts', value: stats.saves ?? 0, fill: 'var(--color-chart-4)' }
            );
        }
        return player.stats_chart_data ?? base;
    }, [player.stats, player.position, player.stats_chart_data]);

    const visibleTeammates = player.teammates?.slice(teammateIndex, teammateIndex + teammatesPerView) || [];
    const photoUrl = player.photo ? `/storage/${player.photo}` : null;

    return (
        <AdminLayout>
            <Head title={`${player.first_name} ${player.last_name}`} />
            <div className="min-h-screen bg-muted/30">
                {/* Header - dark primary */}
                <div className="rounded-none border-b border-primary/20 bg-primary text-primary-foreground">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                                <Link
                                    href="/admin/players"
                                    className="inline-flex w-fit items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Retour
                                </Link>
                                <div className="flex items-end gap-4">
                                    <div
                                        className={`relative h-32 w-28 shrink-0 overflow-hidden rounded-lg border-2 border-white/30 bg-white/10 shadow-lg ${!player.is_active ? 'grayscale' : ''}`}
                                    >
                                        {photoUrl ? (
                                            <img
                                                src={photoUrl}
                                                alt=""
                                                className="h-full w-full object-cover object-top"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/80">
                                                {player.first_name?.[0]}
                                                {player.last_name?.[0]}
                                            </div>
                                        )}
                                        {player.jersey_number && (
                                            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-black text-primary shadow">
                                                {player.jersey_number}
                                            </div>
                                        )}
                                    </div>
                                    <div className="pb-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    statusLabel === 'FIT'
                                                        ? 'bg-green-500 text-white'
                                                        : statusLabel === 'INJURED'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-white/20 text-white'
                                                }
                                            >
                                                {statusLabel}
                                            </Badge>
                                            {positionShort && (
                                                <Badge className="bg-white/20 text-white">
                                                    {positionShort}
                                                </Badge>
                                            )}
                                        </div>
                                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                            {player.first_name} {player.last_name}
                                        </h1>
                                        <p className="mt-1 text-sm text-primary-foreground/80">
                                            {player.team?.name ?? 'Sans équipe'}
                                            {player.team?.category && ` • ${player.team.category}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex shrink-0 gap-2">
                                <Link href={`/admin/players/${player.id}/edit`}>
                                    <Button
                                        size="sm"
                                        className="bg-white text-primary hover:bg-white/90"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Modifier
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
                    {/* Stats cards + chart */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Matchs joués</p>
                                            <p className="text-3xl font-bold text-foreground">
                                                {player.stats?.appearances ?? 0}
                                            </p>
                                        </div>
                                        <Trophy className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Buts</p>
                                            <p className="text-3xl font-bold text-foreground">
                                                {player.stats?.goals ?? 0}
                                            </p>
                                        </div>
                                        <Target className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Passes décisives</p>
                                            <p className="text-3xl font-bold text-foreground">
                                                {player.stats?.assists ?? 0}
                                            </p>
                                        </div>
                                        <Zap className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                </CardContent>
                            </Card>
                            {player.position === 'gardien' && (
                                <>
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Clean sheets</p>
                                                    <p className="text-3xl font-bold text-foreground">
                                                        {player.stats?.clean_sheets ?? 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Arrêts</p>
                                                    <p className="text-3xl font-bold text-foreground">
                                                        {player.stats?.saves ?? 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Activity className="h-4 w-4" />
                                        Statistiques en un coup d'œil
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={statsChartConfig} className="min-h-[220px] w-full">
                                        <ResponsiveContainer width="100%" height={220}>
                                            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                                <XAxis
                                                    dataKey="label"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickClassName="fill-muted-foreground text-xs"
                                                />
                                                <YAxis
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickClassName="fill-muted-foreground text-xs"
                                                    allowDecimals={false}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--border)',
                                                        boxShadow: 'var(--shadow-lg)',
                                                    }}
                                                    formatter={(value) => [value, '']}
                                                    labelFormatter={(label) => label}
                                                />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={index} fill={entry.fill ?? 'var(--color-primary)'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-muted/50">
                            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                            <TabsTrigger value="matches">Matchs</TabsTrigger>
                            <TabsTrigger value="stats">Statistiques</TabsTrigger>
                            <TabsTrigger value="career">Carrière</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            {player.upcoming_match && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-primary" />
                                            Prochain match
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <p className="font-semibold">{player.team?.name}</p>
                                                    <Badge variant="outline" className="mt-1">
                                                        {player.upcoming_match.venue === 'domicile' ? (
                                                            <Home className="mr-1 h-3 w-3" />
                                                        ) : (
                                                            <Plane className="mr-1 h-3 w-3" />
                                                        )}
                                                        {player.upcoming_match.venue === 'domicile' ? 'Domicile' : 'Extérieur'}
                                                    </Badge>
                                                </div>
                                                <span className="text-lg font-semibold text-muted-foreground">vs</span>
                                                <div className="text-center">
                                                    <p className="font-semibold">{player.upcoming_match.opponent}</p>
                                                </div>
                                            </div>
                                            {formatDateTime(player.upcoming_match.scheduled_at) && (
                                                <div className="text-right text-sm text-muted-foreground">
                                                    <p>{formatDateTime(player.upcoming_match.scheduled_at).time}</p>
                                                    <p>{formatDateTime(player.upcoming_match.scheduled_at).date}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {player.recent_matches && player.recent_matches.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-primary" />
                                                Forme récente
                                            </CardTitle>
                                            {player.team && (
                                                <Badge variant="outline">{player.team.name}</Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {player.recent_matches.map((match, index) => (
                                                <div
                                                    key={match.id}
                                                    className={`flex flex-1 min-w-[80px] flex-col rounded-lg border p-3 text-center ${
                                                        match.won
                                                            ? 'border-green-500/50 bg-green-500/10'
                                                            : 'border-red-500/50 bg-red-500/10'
                                                    }`}
                                                >
                                                    <p className="text-xs text-muted-foreground">
                                                        {match.opponent?.substring(0, 6)}…
                                                    </p>
                                                    <p className="text-sm font-bold">
                                                        {match.venue === 'domicile'
                                                            ? `${match.home_score} - ${match.away_score}`
                                                            : `${match.away_score} - ${match.home_score}`}
                                                    </p>
                                                    {match.won ? (
                                                        <CheckCircle2 className="mx-auto mt-1 h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <XCircle className="mx-auto mt-1 h-4 w-4 text-red-600" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {player.teammates && player.teammates.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            Coéquipiers
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative flex gap-4 overflow-hidden">
                                            {visibleTeammates.map((teammate) => (
                                                <Link
                                                    key={teammate.id}
                                                    href={`/admin/players/${teammate.id}`}
                                                    className="flex w-24 shrink-0 flex-col items-center text-center transition-opacity hover:opacity-80"
                                                >
                                                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-border">
                                                        {teammate.photo ? (
                                                            <img
                                                                src={`/storage/${teammate.photo}`}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-bold text-muted-foreground">
                                                                {teammate.first_name?.[0]}
                                                                {teammate.last_name?.[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="mt-2 truncate text-xs font-medium">
                                                        {teammate.first_name} {teammate.last_name}
                                                    </p>
                                                    {teammate.jersey_number && (
                                                        <Badge variant="outline" className="mt-1 text-xs">
                                                            {teammate.jersey_number}
                                                        </Badge>
                                                    )}
                                                </Link>
                                            ))}
                                            {player.teammates.length > teammatesPerView && (
                                                <>
                                                    {teammateIndex > 0 && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2"
                                                            onClick={() => setTeammateIndex((i) => i - 1)}
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {teammateIndex + teammatesPerView < player.teammates.length && (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2"
                                                            onClick={() => setTeammateIndex((i) => i + 1)}
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="matches" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Historique des matchs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {player.recent_matches?.length > 0 ? (
                                        <div className="space-y-3">
                                            {player.recent_matches.map((match) => (
                                                <div
                                                    key={match.id}
                                                    className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/30"
                                                >
                                                    <div>
                                                        <p className="font-semibold">
                                                            {player.team?.name} vs {match.opponent}
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {match.venue === 'domicile' ? (
                                                                    <Home className="mr-1 h-3 w-3" />
                                                                ) : (
                                                                    <Plane className="mr-1 h-3 w-3" />
                                                                )}
                                                                {match.venue === 'domicile' ? 'Domicile' : 'Extérieur'}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDateTime(match.scheduled_at)?.date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold">
                                                            {match.venue === 'domicile'
                                                                ? `${match.home_score} - ${match.away_score}`
                                                                : `${match.away_score} - ${match.home_score}`}
                                                        </p>
                                                        {match.won ? (
                                                            <Badge className="mt-1 bg-green-500">
                                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                Victoire
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="destructive" className="mt-1">
                                                                <XCircle className="mr-1 h-3 w-3" />
                                                                Défaite
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-8 text-center text-muted-foreground">
                                            Aucun match récent
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="stats" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistiques détaillées</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Apparitions, buts et passes décisives
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={statsChartConfig} className="min-h-[280px] w-full">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={chartData} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                                <XAxis
                                                    dataKey="label"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickClassName="fill-muted-foreground"
                                                />
                                                <YAxis
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickClassName="fill-muted-foreground"
                                                    allowDecimals={false}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--border)',
                                                        boxShadow: 'var(--shadow-lg)',
                                                    }}
                                                    formatter={(value) => [value, '']}
                                                    labelFormatter={(label) => label}
                                                />
                                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={index} fill={entry.fill ?? 'var(--color-primary)'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="career" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        Informations personnelles
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    {player.date_of_birth && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date de naissance</p>
                                            <p className="font-medium">{formatDate(player.date_of_birth)}</p>
                                        </div>
                                    )}
                                    {player.position && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Poste</p>
                                            <p className="font-medium">{positionLabel}</p>
                                        </div>
                                    )}
                                    {footLabel && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Pied préféré</p>
                                            <p className="font-medium">{footLabel}</p>
                                        </div>
                                    )}
                                    {player.jersey_number && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Numéro</p>
                                            <p className="font-medium">{player.jersey_number}</p>
                                        </div>
                                    )}
                                    {player.email && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium">{player.email}</p>
                                        </div>
                                    )}
                                    {player.phone && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Téléphone</p>
                                            <p className="font-medium">{player.phone}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            {player.injuries?.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            Blessures
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {player.injuries.map((i) => (
                                                <li
                                                    key={i.id}
                                                    className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                                                >
                                                    <span>{i.type ?? 'Blessure'}</span>
                                                    <Badge variant={i.fit_to_play ? 'default' : 'destructive'}>
                                                        {i.status}
                                                    </Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AdminLayout>
    );
}
