import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Trophy,
    Users,
    Calendar,
    Plus,
    CheckCircle2,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';

export default function ClassmentIndex({
    activeSeason,
    seasons = [],
    standingsByCategory = {},
    categories = [],
    upcomingMatch = null,
    dataVerifiedAt = null,
}) {
    const [selectedCategory, setSelectedCategory] = useState(
        categories.length ? (categories.includes('Senior') ? 'Senior' : categories[0]) : 'Senior'
    );

    const currentStandings = useMemo(() => {
        if (!selectedCategory) return [];
        return standingsByCategory[selectedCategory] || [];
    }, [selectedCategory, standingsByCategory]);

    const totalTeamsInCategory = currentStandings.length;
    const displayCount = Math.min(currentStandings.length, 12);

    const formatMatchDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSeasonChange = (seasonId) => {
        router.get('/admin/classment', { season_id: seasonId || undefined }, { preserveState: false });
    };

    if (!activeSeason && seasons.length === 0) {
        return (
            <AdminLayout>
                <Head title="Classement" />
                <div className="min-h-screen bg-muted/30">
                    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                        <Trophy className="h-16 w-16 text-muted-foreground" />
                        <h1 className="text-2xl font-bold text-foreground">Classement</h1>
                        <p className="text-muted-foreground max-w-md">
                            Aucune saison n&apos;est disponible. Créez une saison et des équipes pour afficher le classement.
                        </p>
                        <Link href="/admin/seasons">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Gérer les saisons
                            </Button>
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head title="Classement" />
            <div className="min-h-screen bg-muted/30">
                <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                    {/* Page title + Active season */}
                    <div className="rounded-xl border border-primary/20 bg-primary p-4 sm:p-6 text-primary-foreground">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                    Classement
                                </h1>
                                <p className="mt-1 text-sm text-primary-foreground/80">
                                    SAISON ACTIVE : <strong>{activeSeason?.name ?? '—'}</strong>
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Select
                                    value={activeSeason?.id?.toString() ?? ''}
                                    onValueChange={handleSeasonChange}
                                >
                                    <SelectTrigger className="w-full sm:w-[220px] bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
                                        <SelectValue placeholder="Choisir une saison" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {seasons.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.name} {s.is_active ? '(active)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Link href="/admin/opponent-teams">
                                    <Button
                                        variant="secondary"
                                        className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        Gérer les adversaires
                                    </Button>
                                </Link>
                                <Link href="/admin/matches">
                                    <Button className="bg-white text-primary hover:bg-white/90">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Saisir un résultat
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Category tabs */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Tabs
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    className="w-full"
                                >
                                    <TabsList className="h-12 w-full justify-start rounded-none border-b bg-muted/30 p-0 gap-0 overflow-x-auto flex-nowrap sm:flex-wrap sm:rounded-t-lg">
                                        {(categories.length ? categories : ['Senior', 'U17', 'U15', 'U13']).map(
                                            (cat) => (
                                                <TabsTrigger
                                                    key={cat}
                                                    value={cat}
                                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none px-4 py-3 uppercase text-xs font-semibold shrink-0 sm:rounded-t-lg sm:border-b-0 sm:data-[state=active]:rounded-b-none"
                                                >
                                                    {cat}
                                                </TabsTrigger>
                                            )
                                        )}
                                    </TabsList>
                                    {(categories.length ? categories : ['Senior', 'U17', 'U15', 'U13']).map((cat) => (
                                        <TabsContent key={cat} value={cat} className="m-0 p-4 sm:p-6">
                                            {/* Standings table */}
                                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                                <table className="w-full min-w-[640px] text-sm">
                                                    <thead>
                                                        <tr className="border-b text-left text-muted-foreground uppercase tracking-wider">
                                                            <th className="pb-3 pr-2 font-medium w-12">Rang</th>
                                                            <th className="pb-3 pr-4 font-medium">Équipe</th>
                                                            <th className="pb-3 pr-3 font-medium text-center w-10">J</th>
                                                            <th className="pb-3 pr-3 font-medium text-center w-10">G</th>
                                                            <th className="pb-3 pr-3 font-medium text-center w-10">N</th>
                                                            <th className="pb-3 pr-3 font-medium text-center w-10">P</th>
                                                            <th className="pb-3 pr-3 font-medium text-center w-10">BP</th>
                                                            <th className="pb-3 pr-3 font-medium text-center w-10">BC</th>
                                                            <th className="pb-3 pr-3 font-medium text-center w-12">Diff</th>
                                                            <th className="pb-3 text-center w-12 font-bold">Pts</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(standingsByCategory[cat] || []).map((row, idx) => (
                                                            <tr
                                                                key={row.id}
                                                                className={`border-b last:border-0 ${
                                                                    idx === 1 ? 'bg-primary/5' : ''
                                                                }`}
                                                            >
                                                                <td className="py-3 pr-2 font-medium text-muted-foreground">
                                                                    {row.rank}
                                                                </td>
                                                                <td className="py-3 pr-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                                            {row.short_code || row.name?.slice(0, 2)?.toUpperCase() || '—'}
                                                                        </span>
                                                                        <span className="font-medium">{row.name}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 pr-3 text-center">{row.played}</td>
                                                                <td className="py-3 pr-3 text-center">{row.wins}</td>
                                                                <td className="py-3 pr-3 text-center">{row.draws}</td>
                                                                <td className="py-3 pr-3 text-center">{row.losses}</td>
                                                                <td className="py-3 pr-3 text-center">{row.goals_for}</td>
                                                                <td className="py-3 pr-3 text-center">{row.goals_against}</td>
                                                                <td
                                                                    className={`py-3 pr-3 text-center font-medium ${
                                                                        row.goal_difference > 0
                                                                            ? 'text-green-600'
                                                                            : row.goal_difference < 0
                                                                            ? 'text-red-600'
                                                                            : 'text-muted-foreground'
                                                                    }`}
                                                                >
                                                                    {row.goal_difference > 0 ? '+' : ''}
                                                                    {row.goal_difference}
                                                                </td>
                                                                <td className="py-3 text-center font-bold">{row.points}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {(!standingsByCategory[cat] || standingsByCategory[cat].length === 0) && (
                                                <p className="py-8 text-center text-muted-foreground">
                                                    Aucune équipe dans cette catégorie.
                                                </p>
                                            )}
                                            {/* Table footer */}
                                            {standingsByCategory[cat]?.length > 0 && (
                                                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
                                                    <p className="text-sm text-muted-foreground">
                                                        Affichage de {Math.min(displayCount, totalTeamsInCategory)} sur{' '}
                                                        {totalTeamsInCategory} équipe
                                                        {totalTeamsInCategory !== 1 ? 's' : ''} en {cat}.
                                                    </p>
                                                    <Link
                                                        href={activeSeason?.id ? `/admin/seasons/${activeSeason.id}` : '/admin/seasons'}
                                                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                                                    >
                                                        Voir toute la saison
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            )}
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Add Opponent */}
                    <Card className="border-2 border-dashed border-primary/30 bg-card">
                        <CardContent className="p-4 sm:p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-1">
                                Ajout rapide d&apos;adversaire
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Ajoutez facilement un club externe pour cette saison et catégorie.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="default"
                                    className="bg-primary hover:bg-primary/90"
                                    onClick={() => router.visit('/admin/opponent-teams/create')}
                                >
                                    Ajouter au championnat
                                </Button>
                                <Link href="/admin/opponent-teams">
                                    <Button variant="outline">Importer CSV</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Card className="border shadow-sm">
                            <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Intégrité des données
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        Classement vérifié à {dataVerifiedAt || '—'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-sm">
                            <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Prochain match
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-foreground truncate">
                                        {upcomingMatch
                                            ? `vs. ${upcomingMatch.opponent} (${upcomingMatch.venue === 'domicile' ? 'D' : 'E'}) • ${formatMatchDate(upcomingMatch.scheduled_at)}`
                                            : '—'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-sm">
                            <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Zone de promotion
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        Les 2 premières équipes se qualifient pour la phase nationale.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
