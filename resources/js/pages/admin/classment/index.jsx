import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Trophy,
    Download,
    Clock,
    Info,
    History,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const PAGE_SIZE = 12;

export default function ClassmentIndex({
    activeSeason,
    standingsByCategory = {},
    categories = [],
    upcomingMatch = null,
    dataVerifiedAt = null,
    lastUpdatedLabel = null,
}) {
    const [selectedCategory, setSelectedCategory] = useState(
        categories?.length ? (categories.includes('Senior') ? 'Senior' : categories[0]) : 'Senior'
    );

    const currentStandings = useMemo(() => {
        if (!selectedCategory) return [];
        return standingsByCategory[selectedCategory] || [];
    }, [selectedCategory, standingsByCategory]);

    const [page, setPage] = useState(0);
    const totalTeams = currentStandings.length;
    const totalPages = Math.max(1, Math.ceil(totalTeams / PAGE_SIZE));
    const paginatedRows = currentStandings.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    const summaryTeam = currentStandings[0] || currentStandings[1];
    const currentRank = summaryTeam?.rank ?? 1;
    const rankChange = 0; // optional: could come from backend
    const form = summaryTeam?.form || [];
    const pointsPace =
        summaryTeam && summaryTeam.played > 0
            ? (summaryTeam.points / summaryTeam.played).toFixed(2)
            : '0.00';

    const formatNextMatchShort = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { weekday: 'long' }) + ', ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const competitionOptions = categories?.length ? categories : ['Senior', 'U17', 'U15', 'U13'];

    if (!activeSeason) {
        return (
            <AdminLayout>
                <Head title="Classement" />
                <div className="min-h-screen bg-[#f5f2ef] flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <Trophy className="h-16 w-16 text-[#571123]/50" />
                    <h1 className="text-2xl font-bold text-[#571123]">Classement</h1>
                    <p className="text-neutral-600 max-w-md">
                        Aucune saison disponible. Créez une saison et des équipes pour afficher le classement.
                    </p>
                    <Link href="/admin/seasons">
                        <Button className="bg-[#571123] text-white hover:bg-[#571123]/90">
                            Gérer les saisons
                        </Button>
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head title="Classement" />
            <div className="min-h-screen bg-[#f5f2ef]">
                <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
                    {/* Title row: left = title + subtitle, right = competition + export */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#571123] sm:text-3xl">
                                Classement
                            </h1>
                            <p className="mt-1 text-sm text-neutral-600">
                                Classement et statistiques en temps réel pour la saison {activeSeason?.name ?? '—'}.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    Compétition
                                </p>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[200px] rounded-lg border-neutral-200 bg-white text-neutral-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {competitionOptions.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="rounded-lg bg-[#571123] text-white hover:bg-[#571123]/90 shrink-0">
                                <Download className="mr-2 h-4 w-4" />
                                Exporter
                            </Button>
                        </div>
                    </div>

                    {/* Four stat cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="p-4 sm:p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    Rang actuel
                                </p>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-[#571123]">
                                        {currentRank}{currentRank === 1 ? 'er' : 'e'}
                                    </span>
                                    {rankChange !== 0 && (
                                        <span className={rankChange > 0 ? 'text-sm font-medium text-green-600' : 'text-sm font-medium text-red-600'}>
                                            {rankChange > 0 ? '↑' : '↓'} {Math.abs(rankChange)}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="p-4 sm:p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    Forme (5 derniers)
                                </p>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {(form.length ? form : ['—', '—', '—', '—', '—']).slice(0, 5).map((r, i) => (
                                        <span
                                            key={i}
                                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
                                                r === 'W' ? 'bg-green-600' : r === 'D' ? 'bg-[#571123]' : r === 'L' ? 'bg-red-600' : 'bg-neutral-300'
                                            }`}
                                        >
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="p-4 sm:p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    Moyenne de points
                                </p>
                                <p className="mt-2 text-2xl font-bold text-[#571123]">{pointsPace}</p>
                                <p className="text-xs text-neutral-500">pts / match</p>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="p-4 sm:p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    Prochain match
                                </p>
                                <p className="mt-2 font-bold text-[#571123]">
                                    {upcomingMatch ? `vs. ${upcomingMatch.opponent}` : '—'}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    {upcomingMatch ? formatNextMatchShort(upcomingMatch.scheduled_at) : '—'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Standings table */}
                    <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-sm">
                                <thead>
                                    <tr className="bg-[#f5f2ef] text-left">
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            Rang
                                        </th>
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            Équipe
                                        </th>
                                        <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            J
                                        </th>
                                        <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            G
                                        </th>
                                        <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            N
                                        </th>
                                        <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            P
                                        </th>
                                        <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            BP
                                        </th>
                                        <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            BC
                                        </th>
                                        <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            Diff
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
                                            Pts
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRows.map((row, idx) => {
                                        const isHighlighted = row.rank === 2 || (paginatedRows.length <= 1 && row.rank === 1);
                                        const isTopThree = row.rank <= 3;
                                        return (
                                            <tr
                                                key={row.id}
                                                className={`border-t border-neutral-100 ${
                                                    isHighlighted ? 'bg-[#571123]/10' : 'bg-white'
                                                }`}
                                            >
                                                <td className="px-4 py-3 font-medium text-neutral-700">
                                                    {row.rank}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                                isHighlighted ? 'bg-[#571123] text-white' : 'bg-neutral-200 text-neutral-700'
                                                            }`}
                                                        >
                                                            {row.short_code || row.name?.slice(0, 2)?.toUpperCase() || '—'}
                                                        </span>
                                                        <span className="font-medium text-neutral-900">{row.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-center text-neutral-700">{row.played}</td>
                                                <td className="px-3 py-3 text-center text-neutral-700">{row.wins}</td>
                                                <td className="px-3 py-3 text-center text-neutral-700">{row.draws}</td>
                                                <td className="px-3 py-3 text-center text-neutral-700">{row.losses}</td>
                                                <td className="px-3 py-3 text-center text-neutral-700">{row.goals_for}</td>
                                                <td className="px-3 py-3 text-center text-neutral-700">{row.goals_against}</td>
                                                <td
                                                    className={`px-3 py-3 text-center font-medium ${
                                                        row.goal_difference > 0
                                                            ? 'text-green-600'
                                                            : row.goal_difference < 0
                                                              ? 'text-red-600'
                                                              : 'text-neutral-500'
                                                    }`}
                                                >
                                                    {row.goal_difference > 0 ? '+' : ''}
                                                    {row.goal_difference}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 text-center font-bold ${
                                                        isTopThree || isHighlighted ? 'text-[#571123]' : 'text-neutral-800'
                                                    }`}
                                                >
                                                    {row.points}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {currentStandings.length === 0 && (
                            <div className="py-12 text-center text-neutral-500">
                                Aucune équipe dans cette catégorie.
                            </div>
                        )}
                        {currentStandings.length > 0 && (
                            <div className="flex flex-col gap-3 border-t border-neutral-100 bg-[#faf9f8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="flex items-center gap-1.5 text-sm text-neutral-500">
                                    <Clock className="h-4 w-4" />
                                    Dernière mise à jour : {lastUpdatedLabel || dataVerifiedAt || '—'}
                                </p>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-neutral-500">
                                        Affichage {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalTeams)} sur {totalTeams} équipes
                                    </p>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg"
                                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg"
                                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                            disabled={page >= totalPages - 1}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Two info cards */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="flex gap-4 p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#571123] text-white">
                                    <Info className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#571123]">Règles de promotion et relégation</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                                        Les 2 premières équipes du classement se qualifient pour les barrages nationaux.
                                        Les 2 dernières sont reléguées en division inférieure.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="flex gap-4 p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#571123] text-white">
                                    <History className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#571123]">Archives des saisons</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                                        Consultez les classements passés, les parcours en coupe et les bilans par saison.
                                    </p>
                                    <Link
                                        href={activeSeason?.id ? `/admin/seasons/${activeSeason.id}` : '/admin/seasons'}
                                        className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#571123] hover:underline"
                                    >
                                        Voir les archives →
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
