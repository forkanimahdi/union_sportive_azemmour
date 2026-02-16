import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trophy, Download, Clock, Info, History, ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react';

const PAGE_SIZE = 12;
const CATEGORIES = ['Senior', 'U17', 'U15'];

export default function ClassmentIndex({
    seasons = [],
    activeSeasonId,
    selectedSeasonId,
    selectedCategory,
    standingsByCategory = {},
    categories = [],
    upcomingMatchByCategory = {},
    dataVerifiedAt = null,
    lastUpdatedLabel = null,
    opponentTeamsForCategory = [],
}) {
    const [seasonId, setSeasonId] = useState(selectedSeasonId || activeSeasonId || (seasons[0]?.id));
    const [category, setCategory] = useState(selectedCategory || 'Senior');

    useEffect(() => {
        if (selectedSeasonId) setSeasonId(selectedSeasonId);
    }, [selectedSeasonId]);
    useEffect(() => {
        if (selectedCategory) setCategory(selectedCategory);
    }, [selectedCategory]);
    const [addingOpponent, setAddingOpponent] = useState(false);
    const [selectedOpponentId, setSelectedOpponentId] = useState('');
    const [savingId, setSavingId] = useState(null);
    const [editRow, setEditRow] = useState({}); // id -> { matches_played, wins, draws, losses, goals_for, goals_against }

    const currentStandings = useMemo(() => {
        return standingsByCategory[category] || [];
    }, [category, standingsByCategory]);

    const applyFilters = () => {
        router.get('/admin/classment', { season_id: seasonId, category }, { preserveState: false });
    };

    const handleSeasonChange = (val) => {
        setSeasonId(val);
        router.get('/admin/classment', { season_id: val, category }, { preserveState: false });
    };

    const handleCategoryChange = (val) => {
        setCategory(val);
        router.get('/admin/classment', { season_id: seasonId, category: val }, { preserveState: false });
    };

    const getRowEdit = (row) => {
        if (editRow[row.id]) return editRow[row.id];
        return {
            matches_played: row.played ?? row.matches_played ?? 0,
            wins: row.wins ?? 0,
            draws: row.draws ?? 0,
            losses: row.losses ?? 0,
            goals_for: row.goals_for ?? 0,
            goals_against: row.goals_against ?? 0,
        };
    };

    const setRowEdit = (row, field, value) => {
        const current = getRowEdit(row);
        setEditRow((prev) => ({ ...prev, [row.id]: { ...current, [field]: parseInt(value, 10) || 0 } }));
    };

    const points = (r) => (r.wins ?? 0) * 3 + (r.draws ?? 0);
    const goalDiff = (r) => (r.goals_for ?? 0) - (r.goals_against ?? 0);

    const saveStanding = (row) => {
        const data = getRowEdit(row);
        setSavingId(row.id);
        router.patch(`/admin/classment/standings/${row.id}`, data, {
            preserveScroll: true,
            onFinish: () => setSavingId(null),
            onSuccess: () => setEditRow((prev) => ({ ...prev, [row.id]: undefined })),
        });
    };

    const addOpponent = () => {
        if (!selectedOpponentId) return;
        router.post('/admin/classment/standings', {
            season_id: seasonId,
            category,
            opponent_team_id: selectedOpponentId,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAddingOpponent(false);
                setSelectedOpponentId('');
                router.get('/admin/classment', { season_id: seasonId, category }, { preserveState: false });
            },
        });
    };

    const seedFromMatches = () => {
        router.post('/admin/classment/seed-from-matches', { season_id: seasonId, category }, {
            preserveScroll: true,
            onSuccess: () => router.get('/admin/classment', { season_id: seasonId, category }, { preserveState: false }),
        });
    };

    const [page, setPage] = useState(0);
    const totalTeams = currentStandings.length;
    const totalPages = Math.max(1, Math.ceil(totalTeams / PAGE_SIZE));
    const paginatedRows = currentStandings.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    const summaryTeam = currentStandings.find((r) => r.is_usa) || currentStandings[0];
    const currentRank = summaryTeam?.rank ?? 1;
    const form = summaryTeam?.form || [];
    const pointsPace = summaryTeam && summaryTeam.played > 0 ? (summaryTeam.points / summaryTeam.played).toFixed(2) : '0.00';
    const upcomingMatch = upcomingMatchByCategory?.[category] ?? null;

    const formatNextMatchShort = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { weekday: 'long' }) + ', ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const activeSeason = seasons.find((s) => s.id === activeSeasonId);

    if (seasons.length === 0) {
        return (
            <AdminLayout>
                <Head title="Classement" />
                <div className="min-h-screen bg-[#f5f2ef] flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <Trophy className="h-16 w-16 text-[#571123]/50" />
                    <h1 className="text-2xl font-bold text-[#571123]">Classement</h1>
                    <p className="text-neutral-600 max-w-md">Aucune saison disponible. Créez une saison pour gérer le classement.</p>
                    <Link href="/admin/seasons">
                        <Button className="bg-[#571123] text-white hover:bg-[#571123]/90">Gérer les saisons</Button>
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
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#571123] sm:text-3xl">Classement</h1>
                            <p className="mt-1 text-sm text-neutral-600">
                                Gestion du classement par saison et catégorie. Modifiez les stats (J, G, N, P, BP, BC) ; les points et le rang sont calculés automatiquement.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-end gap-3">
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Saison</p>
                                <Select value={seasonId || ''} onValueChange={handleSeasonChange}>
                                    <SelectTrigger className="w-[200px] rounded-lg border-neutral-200 bg-white text-neutral-700">
                                        <SelectValue placeholder="Saison" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {seasons.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name} {s.is_active ? '(active)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Catégorie</p>
                                <Select value={category} onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="w-[140px] rounded-lg border-neutral-200 bg-white text-neutral-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="outline" size="sm" onClick={seedFromMatches} className="shrink-0">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Syncer depuis les matchs
                            </Button>
                            <Button className="rounded-lg bg-[#571123] text-white hover:bg-[#571123]/90 shrink-0">
                                <Download className="mr-2 h-4 w-4" />
                                Exporter
                            </Button>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="p-4 sm:p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Rang (USA)</p>
                                <p className="mt-2 text-2xl font-bold text-[#571123]">
                                    {summaryTeam ? `${summaryTeam.rank}${summaryTeam.rank === 1 ? 'er' : 'e'}` : '–'}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="p-4 sm:p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Forme (5 derniers)</p>
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
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Moyenne de points</p>
                                <p className="mt-2 text-2xl font-bold text-[#571123]">{pointsPace}</p>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="p-4 sm:p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Prochain match</p>
                                <p className="mt-2 font-bold text-[#571123]">{upcomingMatch ? `vs. ${upcomingMatch.opponent}` : '—'}</p>
                                <p className="text-sm text-neutral-500">{upcomingMatch ? formatNextMatchShort(upcomingMatch.scheduled_at) : '—'}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Add opponent + table */}
                    <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-neutral-600">
                                Classement {category} – {seasons.find((s) => s.id === seasonId)?.name ?? ''}
                            </span>
                            {!addingOpponent ? (
                                <Button variant="outline" size="sm" onClick={() => setAddingOpponent(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ajouter un adversaire
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Select value={selectedOpponentId} onValueChange={setSelectedOpponentId}>
                                        <SelectTrigger className="w-[220px]">
                                            <SelectValue placeholder="Choisir un adversaire" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {opponentTeamsForCategory.map((o) => (
                                                <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button size="sm" onClick={addOpponent} disabled={!selectedOpponentId}>
                                        Ajouter
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => { setAddingOpponent(false); setSelectedOpponentId(''); }}>
                                        Annuler
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px] text-sm">
                                    <thead>
                                        <tr className="bg-[#f5f2ef] text-left">
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600">Rang</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600">Équipe</th>
                                            <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">J</th>
                                            <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">G</th>
                                            <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">N</th>
                                            <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">P</th>
                                            <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">BP</th>
                                            <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">BC</th>
                                            <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">Diff</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">Pts</th>
                                            <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-600">Sauvegarder</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRows.map((row) => {
                                            const e = getRowEdit(row);
                                            const pts = e.wins * 3 + e.draws;
                                            const diff = e.goals_for - e.goals_against;
                                            const isUsa = row.is_usa;
                                            return (
                                                <tr
                                                    key={row.id}
                                                    className={`border-t border-neutral-100 ${isUsa ? 'bg-[#571123]/10' : 'bg-white'}`}
                                                >
                                                    <td className="px-4 py-2 font-medium text-neutral-700">{row.rank}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isUsa ? 'bg-[#571123] text-white' : 'bg-neutral-200 text-neutral-700'}`}>
                                                                {row.short_code || '–'}
                                                            </span>
                                                            <span className="font-medium text-neutral-900">{row.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1 text-center">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            className="h-8 w-14 text-center text-sm"
                                                            value={e.matches_played}
                                                            onChange={(ev) => setRowEdit(row, 'matches_played', ev.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1 text-center">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            className="h-8 w-12 text-center text-sm"
                                                            value={e.wins}
                                                            onChange={(ev) => setRowEdit(row, 'wins', ev.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1 text-center">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            className="h-8 w-12 text-center text-sm"
                                                            value={e.draws}
                                                            onChange={(ev) => setRowEdit(row, 'draws', ev.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1 text-center">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            className="h-8 w-12 text-center text-sm"
                                                            value={e.losses}
                                                            onChange={(ev) => setRowEdit(row, 'losses', ev.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1 text-center">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            className="h-8 w-12 text-center text-sm"
                                                            value={e.goals_for}
                                                            onChange={(ev) => setRowEdit(row, 'goals_for', ev.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1 text-center">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            className="h-8 w-12 text-center text-sm"
                                                            value={e.goals_against}
                                                            onChange={(ev) => setRowEdit(row, 'goals_against', ev.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2 text-center font-medium">
                                                        {diff > 0 ? '+' : ''}{diff}
                                                    </td>
                                                    <td className="px-2 py-2 text-center font-bold text-[#571123]">{pts}</td>
                                                    <td className="px-2 py-1 text-center">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-xs"
                                                            disabled={savingId === row.id}
                                                            onClick={() => saveStanding(row)}
                                                        >
                                                            {savingId === row.id ? '…' : 'Enregistrer'}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {currentStandings.length === 0 && (
                                <div className="py-12 text-center text-neutral-500">
                                    Aucune équipe. Utilisez « Syncer depuis les matchs » ou « Ajouter un adversaire ».
                                </div>
                            )}
                            {currentStandings.length > 0 && (
                                <div className="flex flex-col gap-3 border-t border-neutral-100 bg-[#faf9f8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="flex items-center gap-1.5 text-sm text-neutral-500">
                                        <Clock className="h-4 w-4" />
                                        Dernière mise à jour : {lastUpdatedLabel || dataVerifiedAt || '–'}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm text-neutral-500">
                                            {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalTeams)} / {totalTeams}
                                        </p>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                            <CardContent className="flex gap-4 p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#571123] text-white">
                                    <Info className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#571123]">Règles</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                                        Les points et le rang sont calculés automatiquement (victoire = 3 pts, nul = 1 pt). Vous pouvez modifier J, G, N, P, BP, BC puis enregistrer par ligne.
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
                                    <h3 className="font-bold text-[#571123]">Saisons archivées</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                                        Utilisez le filtre Saison pour consulter et modifier le classement des saisons passées.
                                    </p>
                                    <Link href="/admin/seasons" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#571123] hover:underline">
                                        Gérer les saisons →
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
