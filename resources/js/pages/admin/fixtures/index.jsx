import React, { useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, MapPin, Pencil, FileText } from 'lucide-react';
import MatchCreateModal from '@/components/admin/MatchCreateModal';
import MatchEditModal from '@/components/admin/MatchEditModal';
import MatchDetailsModal from '@/components/admin/MatchDetailsModal';

const CLUB_LOGO = '/assets/images/logo.png';

const CATEGORIES = [
    { value: 'Senior', label: 'Équipe Senior' },
    { value: 'U17', label: 'U17' },
    { value: 'U15', label: 'U15' },
    { value: 'U13', label: 'U13' },
];

export default function FixturesIndex({
    matches = [],
    seasons = [],
    activeSeasonId,
    teams = [],
    modalTeams = [],
    opponentTeams = [],
    activeSeason,
}) {
    const [categoryTab, setCategoryTab] = useState('Senior');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalMatch, setEditModalMatch] = useState(null);
    const [detailsModalMatch, setDetailsModalMatch] = useState(null);

    const filteredMatches = useMemo(() => {
        let list = Array.isArray(matches) ? [...matches] : [];
        list = list.filter((m) => (m.category || 'Senior') === categoryTab);
        list.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
        return list;
    }, [matches, categoryTab]);

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const formatTime = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'finished':
                return { label: 'TERMINÉ', className: 'bg-primary/10 text-primary font-semibold' };
            case 'live':
                return {
                    label: 'EN DIRECT',
                    className: 'bg-red-500/10 text-red-600 font-semibold',
                    live: true,
                };
            case 'postponed':
                return { label: 'REPORTÉ', className: 'bg-amber-500/10 text-amber-700 font-semibold' };
            case 'cancelled':
                return { label: 'ANNULÉ', className: 'bg-neutral-200 text-neutral-600 font-semibold' };
            default:
                return { label: 'À VENIR', className: 'bg-primary/10 text-primary font-semibold' };
        }
    };

    const getLocationLabel = (venue, type) => {
        if (venue === 'domicile' || type === 'domicile') return 'Terrain à domicile';
        return 'Extérieur';
    };

    const handleSeasonChange = (value) => {
        router.get('/admin/fixtures', value ? { season_id: value } : {});
    };

    return (
        <AdminLayout>
            <Head title="Calendrier & Matchs" />
            <div className="min-h-screen bg-neutral-50">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-primary">
                                Calendrier & Matchs
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <Select
                                    value={activeSeasonId?.toString() || seasons[0]?.id?.toString() || ''}
                                    onValueChange={handleSeasonChange}
                                >
                                    <SelectTrigger className="w-[220px] border-neutral-200 bg-white">
                                        <SelectValue placeholder="Saison" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {seasons.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name}
                                                {s.is_active ? ' (En cours)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter un match
                        </Button>
                    </div>
                    <MatchCreateModal
                        open={createModalOpen}
                        onOpenChange={setCreateModalOpen}
                        teams={modalTeams.length ? modalTeams : teams}
                        opponentTeams={opponentTeams}
                        activeSeason={activeSeason}
                        onSuccess={() => router.reload()}
                    />
                    <MatchEditModal
                        key={editModalMatch?.id}
                        open={!!editModalMatch}
                        onOpenChange={(open) => !open && setEditModalMatch(null)}
                        match={editModalMatch}
                        teams={modalTeams.length ? modalTeams : teams}
                        opponentTeams={opponentTeams}
                        onSuccess={() => router.reload()}
                    />
                    <MatchDetailsModal
                        key={detailsModalMatch?.id}
                        open={!!detailsModalMatch}
                        onOpenChange={(open) => !open && setDetailsModalMatch(null)}
                        match={detailsModalMatch}
                        onSuccess={() => {
                            setDetailsModalMatch(null);
                            router.reload();
                        }}
                    />

                    {/* Category tabs */}
                    <div className="mb-6 flex gap-1 rounded-lg border border-neutral-200 bg-white p-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => setCategoryTab(cat.value)}
                                className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                                    categoryTab === cat.value
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Fixture cards */}
                    <div className="space-y-4">
                        {filteredMatches.length === 0 ? (
                            <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center text-neutral-500">
                                Aucun match pour cette catégorie.
                                <br />
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(true)}
                                    className="mt-2 inline-block text-primary hover:underline"
                                >
                                    Ajouter un match
                                </button>
                            </div>
                        ) : (
                            filteredMatches.map((match) => {
                                const isHome = match.type === 'domicile';
                                const ourTeam = match.team
                                    ? { name: match.team.name, logo: null }
                                    : { name: 'Notre équipe', logo: null };
                                const opponent = match.opponent_team
                                    ? {
                                          name: match.opponent_team.name,
                                          logo: match.opponent_team.logo,
                                      }
                                    : { name: match.opponent || 'Adversaire', logo: null };
                                const leftTeam = isHome ? ourTeam : opponent;
                                const rightTeam = isHome ? opponent : ourTeam;
                                const leftScore = isHome ? match.home_score : match.away_score;
                                const rightScore = isHome ? match.away_score : match.home_score;
                                const isFinished = match.status === 'finished';
                                const isLive = match.status === 'live';
                                const statusConfig = getStatusConfig(match.status);

                                return (
                                    <div
                                        key={match.id}
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
                                                <span
                                                    className={`inline-flex items-center rounded px-2.5 py-1 text-xs ${statusConfig.className}`}
                                                >
                                                    {statusConfig.label}
                                                </span>
                                                {!isLive && (
                                                    <span className="text-sm text-neutral-500">
                                                        {formatDate(match.scheduled_at)}
                                                    </span>
                                                )}
                                                {isLive && (
                                                    <span className="text-sm font-medium text-neutral-700">
                                                        Aujourd&apos;hui
                                                    </span>
                                                )}
                                                {!isLive && (
                                                    <span className="text-sm font-medium text-neutral-700">
                                                        {formatTime(match.scheduled_at)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-6">
                                                {/* Left team */}
                                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
                                                        {isHome ? (
                                                            <img src={CLUB_LOGO} alt="" className="h-12 w-12 object-cover" />
                                                        ) : leftTeam.logo ? (
                                                            <img src={`/storage/${leftTeam.logo}`} alt="" className="h-12 w-12 object-cover" />
                                                        ) : (
                                                            <span className="text-sm font-bold text-neutral-600">
                                                                {(leftTeam.name || '').slice(0, 2).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="truncate font-semibold text-neutral-900">
                                                        {leftTeam.name}
                                                    </span>
                                                </div>

                                                {/* Score or VS */}
                                                <div className="flex shrink-0 flex-col items-center">
                                                    {isFinished &&
                                                    leftScore != null &&
                                                    rightScore != null ? (
                                                        <>
                                                            <span className="text-2xl font-bold text-neutral-900">
                                                                {leftScore} - {rightScore}
                                                            </span>
                                                            <span className="text-xs font-medium text-neutral-500">
                                                                SCORE FINAL
                                                            </span>
                                                        </>
                                                    ) : isLive ? (
                                                        <>
                                                            <span className="text-2xl font-bold text-neutral-900">
                                                                {leftScore ?? 0} - {rightScore ?? 0}
                                                            </span>
                                                            <span className="text-xs font-medium text-red-600">
                                                                EN COURS
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xl font-bold text-neutral-300">
                                                            VS
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Right team */}
                                                <div className="flex min-w-0 flex-1 items-center gap-3 justify-end">
                                                    <span className="truncate text-right font-semibold text-neutral-900">
                                                        {rightTeam.name}
                                                    </span>
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
                                                        {!isHome ? (
                                                            <img src={CLUB_LOGO} alt="" className="h-12 w-12 object-cover" />
                                                        ) : rightTeam.logo ? (
                                                            <img src={`/storage/${rightTeam.logo}`} alt="" className="h-12 w-12 object-cover" />
                                                        ) : (
                                                            <span className="text-sm font-bold text-neutral-600">
                                                                {(rightTeam.name || '').slice(0, 2).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-4">
                                                <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                                                    <MapPin className="h-4 w-4" />
                                                    {getLocationLabel(match.venue, match.type)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-primary text-primary hover:bg-primary/10"
                                                        onClick={() => setDetailsModalMatch(match)}
                                                    >
                                                        <FileText className="mr-1.5 h-4 w-4" />
                                                        Détails
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-neutral-600 hover:text-primary"
                                                        aria-label="Modifier"
                                                        onClick={() => setEditModalMatch(match)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* View past fixtures */}
                    {filteredMatches.length > 0 && (
                        <div className="mt-10 flex justify-center">
                            <Button
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/10"
                                onClick={() => router.visit('/admin/matches')}
                            >
                                Voir tous les matchs
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
