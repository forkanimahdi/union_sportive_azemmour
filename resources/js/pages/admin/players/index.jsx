import React, { useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, LayoutGrid, List, Users, Info } from 'lucide-react';
import InputError from '@/components/input-error';

const POSITION_SHORT = {
    gardien: 'GK',
    defenseur: 'DEF',
    milieu: 'MID',
    attaquant: 'FWD',
};

export default function PlayersIndex({
    players,
    teams = [],
    seasons = [],
    categories = [],
    filters = {},
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [seasonId, setSeasonId] = useState(filters.season_id || '');
    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');
    const [viewMode, setViewMode] = useState('grid');
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const createForm = useForm({
        team_id: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        position: '',
        preferred_foot: '',
        jersey_number: '',
        email: '',
        phone: '',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_email: '',
        guardian_relationship: '',
        photo: null,
        is_active: true,
    });

    const handleCreatePlayer = (e) => {
        e.preventDefault();
        createForm.post('/admin/players', {
            forceFormData: true,
            onSuccess: () => {
                setCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const teamList = players?.data || [];

    const filteredBySearch = useMemo(() => {
        return teamList;
    }, [teamList]);

    const { activeRoster, alumni } = useMemo(() => {
        const active = [];
        const alumniList = [];
        filteredBySearch.forEach((p) => {
            if (p.is_active) active.push(p);
            else alumniList.push(p);
        });
        return { activeRoster: active, alumni: alumniList };
    }, [filteredBySearch]);

    const applyFilters = () => {
        router.get('/admin/players', {
            search: search || undefined,
            season_id: seasonId || undefined,
            category: category || undefined,
            status: status || undefined,
        }, { preserveState: false });
    };

    const totalCount = players?.total ?? teamList.length;

    return (
        <AdminLayout>
            <Head title="Répertoire des joueuses" />
            <div className="min-h-screen bg-muted/30">
                <div className="space-y-6 p-6">
                    {/* Header - dark primary */}
                    <div className="rounded-xl border border-primary/20 bg-primary p-6 text-primary-foreground">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                    Répertoire des joueuses
                                </h1>
                                <p className="mt-1 text-sm text-primary-foreground/80">
                                    Gérez et consultez l'effectif du club.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* <div className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-alpha shadow-sm">
                                    {totalCount} joueuse{totalCount !== 1 ? 's' : ''} au total
                                </div> */}
                                <Button
                                    // size="sm"
                                    variant="secondary"
                                    className="bg-white text-primary  px-4 py-2.5  hover:bg-white/90"
                                    onClick={() => setCreateModalOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nouvelle joueuse
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Filter bar - white card */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher par nom..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={seasonId || 'all'} onValueChange={(v) => setSeasonId(v === 'all' ? '' : v)}>
                                    <SelectTrigger className="w-full lg:w-[180px]">
                                        <SelectValue placeholder="Saison" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les saisons</SelectItem>
                                        {seasons.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={category || 'all'} onValueChange={(v) => setCategory(v === 'all' ? '' : v)}>
                                    <SelectTrigger className="w-full lg:w-[180px]">
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les catégories</SelectItem>
                                        {categories.map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
                                    <SelectTrigger className="w-full lg:w-[160px]">
                                        <SelectValue placeholder="Statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="active">Actives</SelectItem>
                                        <SelectItem value="alumni">Anciennes</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={applyFilters} className="bg-primary hover:bg-primary/90">
                                    Appliquer les filtres
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Roster */}
                    {activeRoster.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
                                    <h2 className="text-lg font-semibold text-foreground">Effectif actif</h2>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                        size="icon"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                        size="icon"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                        : 'flex flex-col gap-3'
                                }
                            >
                                {activeRoster.map((player) => (
                                    <PlayerDirectoryCard
                                        key={player.id}
                                        player={player}
                                        isActive
                                        viewMode={viewMode}
                                        onClick={() => router.visit(`/admin/players/${player.id}`)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Alumni / Left Club */}
                    {alumni.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-muted-foreground/60" aria-hidden />
                                <h2 className="text-lg font-semibold text-foreground">Anciennes / Parties</h2>
                            </div>
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                        : 'flex flex-col gap-3'
                                }
                            >
                                {alumni.map((player) => (
                                    <PlayerDirectoryCard
                                        key={player.id}
                                        player={player}
                                        isActive={false}
                                        viewMode={viewMode}
                                        onClick={() => router.visit(`/admin/players/${player.id}`)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty state */}
                    {filteredBySearch.length === 0 && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <Users className="h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-muted-foreground">
                                    {search ? 'Aucune joueuse ne correspond à votre recherche.' : 'Aucune joueuse pour cette sélection.'}
                                </p>
                                <Button variant="outline" className="mt-4" onClick={() => router.get('/admin/players')}>
                                    Réinitialiser les filtres
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {players?.last_page > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <p className="text-sm text-muted-foreground">
                                Page {players.current_page} sur {players.last_page}
                            </p>
                            <div className="flex gap-2">
                                {players.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(players.prev_page_url)}
                                    >
                                        Précédent
                                    </Button>
                                )}
                                {players.current_page < players.last_page && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(players.next_page_url)}
                                    >
                                        Suivant
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Player Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Nouvelle joueuse</DialogTitle>
                        <DialogDescription>Ajouter une nouvelle joueuse à l'effectif</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreatePlayer} className="space-y-4">
                        {/* Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Prénom *</Label>
                                <Input
                                    value={createForm.data.first_name}
                                    onChange={(e) => createForm.setData('first_name', e.target.value)}
                                    required
                                />
                                <InputError message={createForm.errors.first_name} />
                            </div>
                            <div className="space-y-2">
                                <Label>Nom *</Label>
                                <Input
                                    value={createForm.data.last_name}
                                    onChange={(e) => createForm.setData('last_name', e.target.value)}
                                    required
                                />
                                <InputError message={createForm.errors.last_name} />
                            </div>
                        </div>

                        {/* DOB, Position, Jersey */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Date de naissance *</Label>
                                <Input
                                    type="date"
                                    value={createForm.data.date_of_birth}
                                    onChange={(e) => createForm.setData('date_of_birth', e.target.value)}
                                    required
                                />
                                <InputError message={createForm.errors.date_of_birth} />
                            </div>
                            <div className="space-y-2">
                                <Label>Poste</Label>
                                <Select
                                    value={createForm.data.position || 'none'}
                                    onValueChange={(v) => createForm.setData('position', v === 'none' ? '' : v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Aucun</SelectItem>
                                        <SelectItem value="gardien">Gardien</SelectItem>
                                        <SelectItem value="defenseur">Défenseur</SelectItem>
                                        <SelectItem value="milieu">Milieu</SelectItem>
                                        <SelectItem value="attaquant">Attaquant</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.position} />
                            </div>
                            <div className="space-y-2">
                                <Label>Numéro</Label>
                                <Input
                                    value={createForm.data.jersey_number}
                                    onChange={(e) => createForm.setData('jersey_number', e.target.value)}
                                />
                                <InputError message={createForm.errors.jersey_number} />
                            </div>
                        </div>

                        {/* Team */}
                        <div className="space-y-2">
                            <Label>Équipe</Label>
                            <Select
                                value={createForm.data.team_id || 'none'}
                                onValueChange={(v) => createForm.setData('team_id', v === 'none' ? '' : v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une équipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucune équipe</SelectItem>
                                    {teams.map((t) => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                            {t.name} {t.category ? `(${t.category})` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.team_id} />
                        </div>

                        {/* Contact */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                />
                                <InputError message={createForm.errors.email} />
                            </div>
                            <div className="space-y-2">
                                <Label>Téléphone</Label>
                                <Input
                                    value={createForm.data.phone}
                                    onChange={(e) => createForm.setData('phone', e.target.value)}
                                />
                                <InputError message={createForm.errors.phone} />
                            </div>
                        </div>

                        {/* Photo */}
                        <div className="space-y-2">
                            <Label>Photo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => createForm.setData('photo', e.target.files?.[0] || null)}
                            />
                            <InputError message={createForm.errors.photo} />
                        </div>

                        {/* Guardian (collapsible section) */}
                        <details className="rounded-md border p-3">
                            <summary className="cursor-pointer text-sm font-medium">
                                Tuteur légal (pour mineures)
                            </summary>
                            <div className="mt-3 grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nom du tuteur</Label>
                                    <Input
                                        value={createForm.data.guardian_name}
                                        onChange={(e) => createForm.setData('guardian_name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Relation</Label>
                                    <Input
                                        value={createForm.data.guardian_relationship}
                                        onChange={(e) => createForm.setData('guardian_relationship', e.target.value)}
                                        placeholder="Parent, tuteur…"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Téléphone tuteur</Label>
                                    <Input
                                        value={createForm.data.guardian_phone}
                                        onChange={(e) => createForm.setData('guardian_phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email tuteur</Label>
                                    <Input
                                        type="email"
                                        value={createForm.data.guardian_email}
                                        onChange={(e) => createForm.setData('guardian_email', e.target.value)}
                                    />
                                </div>
                            </div>
                        </details>

                        {/* Active */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="create_is_active"
                                checked={createForm.data.is_active}
                                onCheckedChange={(c) => createForm.setData('is_active', !!c)}
                            />
                            <Label htmlFor="create_is_active" className="cursor-pointer">
                                Joueuse active
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Création…' : 'Créer la joueuse'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

function PlayerDirectoryCard({ player, isActive, viewMode, onClick }) {
    const photoUrl = player.photo ? `/storage/${player.photo}` : null;
    const positionShort = player.position ? (POSITION_SHORT[player.position] || player.position) : null;
    const stats = player.stats || {};
    const mp = stats.appearances?.total ?? 0;
    const g = stats.goals?.total ?? 0;
    const a = stats.assists?.total ?? 0;
    const cs = stats.clean_sheets ?? 0;
    const s = stats.saves ?? 0;
    const isGK = player.position === 'gardien';
    const statusLabel = player.status_label || (isActive ? (player.can_play ? 'FIT' : 'INJURED') : 'LEFT');

    const cardContent = (
        <>
            <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-t-lg bg-muted ${!isActive ? 'grayscale' : ''}`}>
                {photoUrl ? (
                    <img src={photoUrl} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-2xl font-bold text-muted-foreground">
                            {player.first_name?.[0]}
                            {player.last_name?.[0]}
                        </span>
                    </div>
                )}
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                    <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                            statusLabel === 'FIT'
                                ? 'bg-green-500 text-white'
                                : statusLabel === 'INJURED'
                                ? 'bg-red-500 text-white'
                                : 'bg-primary text-primary-foreground'
                        }`}
                    >
                        {statusLabel}
                    </span>
                    {positionShort && (
                        <span className="rounded bg-primary/90 px-2 py-0.5 text-xs font-medium text-primary-foreground">
                            {positionShort}
                        </span>
                    )}
                </div>
            </div>
            <CardContent className="p-4">
                <p className={`text-xs font-medium ${!isActive ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {player.team?.name ?? 'Sans équipe'}
                </p>
                <div className="mt-1 flex items-center gap-1">
                    <h3 className={`font-semibold ${!isActive ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {player.first_name} {player.last_name}
                    </h3>
                    <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                </div>
                {isActive && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>MP {mp}</span>
                        {!isGK && (
                            <>
                                <span>B {g}</span>
                                <span>PD {a}</span>
                            </>
                        )}
                        {isGK && (
                            <>
                                <span>CS {cs}</span>
                                <span>Arrêts {s}</span>
                            </>
                        )}
                    </div>
                )}
                {!isActive && player.team?.season?.name && (
                    <p className="mt-1 text-xs text-muted-foreground">Saison {player.team.season.name}</p>
                )}
            </CardContent>
        </>
    );

    if (viewMode === 'list') {
        return (
            <Card
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${!isActive ? 'opacity-90' : ''}`}
                onClick={onClick}
            >
                <div className="flex flex-row">
                    <div className={`relative h-24 w-28 shrink-0 overflow-hidden rounded-l-lg bg-muted ${!isActive ? 'grayscale' : ''}`}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="" className="h-full w-full object-cover object-top" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <span className="text-sm font-bold text-muted-foreground">
                                    {player.first_name?.[0]}
                                    {player.last_name?.[0]}
                                </span>
                            </div>
                        )}
                        <span
                            className={`absolute left-1 top-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                statusLabel === 'FIT' ? 'bg-green-500 text-white' : statusLabel === 'INJURED' ? 'bg-red-500 text-white' : 'bg-primary text-primary-foreground'
                            }`}
                        >
                            {statusLabel}
                        </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-4">
                        <p className="text-xs text-muted-foreground">{player.team?.name ?? 'Sans équipe'}</p>
                        <p className={`font-semibold ${!isActive ? 'text-muted-foreground' : ''}`}>
                            {player.first_name} {player.last_name}
                        </p>
                        {isActive && (
                            <p className="text-xs text-muted-foreground">
                                MP {mp} · B {g} · PD {a}
                                {isGK && ` · CS ${cs} · Arrêts ${s}`}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            className={`cursor-pointer overflow-hidden transition-shadow hover:shadow-md ${!isActive ? 'opacity-90' : ''}`}
            onClick={onClick}
        >
            {cardContent}
        </Card>
    );
}
