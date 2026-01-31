import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, LayoutGrid, List, Edit, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';
import InputError from '@/components/input-error';

export default function TeamsIndex({
    teams,
    seasons = [],
    activeSeason,
    categories = [],
    filters = {},
}) {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamToDelete, setTeamToDelete] = useState(null);

    const currentSeasonId = filters?.season_id || '';

    const createForm = useForm({
        season_id: activeSeason?.id?.toString() || '',
        category: '',
        name: '',
        description: '',
        is_active: true,
    });

    const editForm = useForm({
        season_id: '',
        category: '',
        name: '',
        description: '',
        is_active: true,
    });

    const teamList = teams?.data || [];

    const filteredTeams = useMemo(() => {
        if (!search.trim()) return teamList;
        const q = search.toLowerCase();
        return teamList.filter(
            (t) =>
                t.name?.toLowerCase().includes(q) ||
                t.category?.toLowerCase().includes(q) ||
                t.division?.toLowerCase().includes(q) ||
                t.coach_name?.toLowerCase().includes(q)
        );
    }, [teamList, search]);

    const { activeTeams, archivedTeams } = useMemo(() => {
        const active = [];
        const archived = [];
        filteredTeams.forEach((t) => {
            if (t.season?.is_active) active.push(t);
            else archived.push(t);
        });
        return { activeTeams: active, archivedTeams: archived };
    }, [filteredTeams]);

    const handleSeasonFilter = (value) => {
        const params = value ? { season_id: value } : {};
        router.get('/admin/teams', params, { preserveState: false });
    };

    const handleDelete = (id) => {
        setTeamToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (teamToDelete) {
            router.delete(`/admin/teams/${teamToDelete}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setTeamToDelete(null);
                },
            });
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/teams', {
            onSuccess: () => {
                setCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEdit = (team) => {
        setSelectedTeam(team);
        editForm.setData({
            season_id: team.season?.id?.toString() || '',
            category: team.category || '',
            name: team.name || '',
            description: team.description || '',
            is_active: team.is_active ?? true,
        });
        setEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!selectedTeam) return;
        editForm.put(`/admin/teams/${selectedTeam.id}`, {
            onSuccess: () => {
                setEditModalOpen(false);
                setSelectedTeam(null);
            },
        });
    };

    const teamImageUrl = (team) => {
        if (team.image) return `/storage/${team.image}`;
        return null;
    };

    const pagination = teams?.links || [];
    const total = teams?.total ?? 0;
    const from = teams?.from ?? 0;
    const to = teams?.to ?? 0;

    return (
        <AdminLayout>
            <Head title="Répertoire des équipes" />
            <div className="min-h-screen bg-muted/30">
                <div className="space-y-6 p-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Répertoire des équipes
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Gérez et consultez les effectifs, le staff et les archives par saison.
                            </p>
                        </div>
                        <Button
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle équipe
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="season-filter" className="text-muted-foreground whitespace-nowrap text-sm">
                                    Saison
                                </Label>
                                <Select
                                    value={currentSeasonId || 'all'}
                                    onValueChange={(v) => handleSeasonFilter(v === 'all' ? '' : v)}
                                >
                                    <SelectTrigger id="season-filter" className="w-[220px]">
                                        <SelectValue placeholder="Toutes les saisons" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les saisons</SelectItem>
                                        {seasons.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name}
                                                {s.is_active ? ' (En cours)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher par nom, catégorie ou entraîneur..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
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

                    {/* Active Season Section */}
                    {activeTeams.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Saison active
                                    {activeSeason?.name && (
                                        <span className="ml-2 font-normal text-muted-foreground">
                                            ({activeSeason.name})
                                        </span>
                                    )}
                                </h2>
                                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                                    {activeTeams.length} ÉQUIPE{activeTeams.length !== 1 ? 'S' : ''}
                                </span>
                            </div>
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                        : 'flex flex-col gap-3'
                                }
                            >
                                {activeTeams.map((team) => (
                                    <TeamCard
                                        key={team.id}
                                        team={team}
                                        isActive
                                        viewMode={viewMode}
                                        imageUrl={teamImageUrl(team)}
                                        onVisit={() => router.visit(`/admin/teams/${team.id}`)}
                                        onEdit={() => handleEdit(team)}
                                        onDelete={() => handleDelete(team.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Archived Seasons Section */}
                    {archivedTeams.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-foreground">Saisons archivées</h2>
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                        : 'flex flex-col gap-3'
                                }
                            >
                                {archivedTeams.map((team) => (
                                    <TeamCard
                                        key={team.id}
                                        team={team}
                                        isActive={false}
                                        viewMode={viewMode}
                                        imageUrl={teamImageUrl(team)}
                                        onVisit={() => router.visit(`/admin/teams/${team.id}`)}
                                        onEdit={() => handleEdit(team)}
                                        onDelete={() => handleDelete(team.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty state */}
                    {filteredTeams.length === 0 && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <Users className="h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-muted-foreground">
                                    {search
                                        ? 'Aucune équipe ne correspond à votre recherche.'
                                        : 'Aucune équipe pour cette sélection.'}
                                </p>
                                {search && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => setSearch('')}
                                    >
                                        Réinitialiser la recherche
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {teams?.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Affichage de {from} à {to} sur {total} équipes
                            </p>
                            <div className="flex items-center gap-2">
                                {pagination.map((link, i) => (
                                    <span key={i}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm ${
                                                    link.active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'border border-input bg-background hover:bg-accent'
                                                }`}
                                            >
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </Link>
                                        ) : (
                                            <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Nouvelle équipe</DialogTitle>
                        <DialogDescription>Créer une nouvelle équipe pour une saison.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Saison *</Label>
                            <Select
                                value={createForm.data.season_id}
                                onValueChange={(v) => createForm.setData('season_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une saison" />
                                </SelectTrigger>
                                <SelectContent>
                                    {seasons.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.season_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Catégorie *</Label>
                                <Select
                                    value={createForm.data.category}
                                    onValueChange={(v) => createForm.setData('category', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['U13', 'U15', 'U17', 'Senior'].map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.category} />
                            </div>
                            <div className="space-y-2">
                                <Label>Nom de l'équipe *</Label>
                                <Input
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="ex. U17 A"
                                />
                                <InputError message={createForm.errors.name} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <textarea
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Optionnel"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="create_is_active"
                                checked={createForm.data.is_active}
                                onCheckedChange={(c) => createForm.setData('is_active', !!c)}
                            />
                            <Label htmlFor="create_is_active">Équipe active</Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Création…' : 'Créer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Modifier l'équipe</DialogTitle>
                        <DialogDescription>{selectedTeam?.name}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Saison *</Label>
                            <Select
                                value={editForm.data.season_id}
                                onValueChange={(v) => editForm.setData('season_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une saison" />
                                </SelectTrigger>
                                <SelectContent>
                                    {seasons.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.season_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Catégorie *</Label>
                                <Select
                                    value={editForm.data.category}
                                    onValueChange={(v) => editForm.setData('category', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['U13', 'U15', 'U17', 'Senior'].map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.category} />
                            </div>
                            <div className="space-y-2">
                                <Label>Nom de l'équipe *</Label>
                                <Input
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                />
                                <InputError message={editForm.errors.name} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <textarea
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="edit_is_active"
                                checked={editForm.data.is_active}
                                onCheckedChange={(c) => editForm.setData('is_active', !!c)}
                            />
                            <Label htmlFor="edit_is_active">Équipe active</Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Enregistrement…' : 'Enregistrer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                title="Supprimer l'équipe"
                description="Cette action est irréversible. Confirmer la suppression ?"
            />
        </AdminLayout>
    );
}

function TeamCard({ team, isActive, viewMode, imageUrl, onVisit, onEdit, onDelete }) {
    const content = (
        <>
            <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-muted ${!isActive ? 'grayscale' : ''}`}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Users className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                )}
                {isActive && (
                    <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        EN COURS
                    </span>
                )}
            </div>
            <CardContent className="p-4">
                {!isActive && team.season?.name && (
                    <p className="text-xs text-muted-foreground">{team.season.name}</p>
                )}
                <h3 className={`font-semibold ${!isActive ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {team.name}
                </h3>
                {(team.division || team.category) && (
                    <p className={`mt-0.5 text-sm ${!isActive ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>
                        {team.division || team.category}
                    </p>
                )}
                {team.coach_name && (
                    <p className={`mt-1 flex items-center gap-1.5 text-sm ${!isActive ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        {team.coach_name}
                    </p>
                )}
                {isActive && team.category && (
                    <span className="mt-2 inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {team.category}
                    </span>
                )}
                <div className="mt-3 flex items-center justify-between gap-2">
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                            e.stopPropagation();
                            onVisit();
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), onVisit())}
                        className="text-sm font-medium text-primary hover:underline cursor-pointer"
                    >
                        Voir l'équipe
                    </span>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                            <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </>
    );

    if (viewMode === 'list') {
        return (
            <Card className={`overflow-hidden transition-colors hover:bg-muted/50 ${!isActive ? 'opacity-90' : ''}`}>
                <div className="flex flex-row">
                    <div className={`relative h-24 w-32 shrink-0 overflow-hidden bg-muted ${!isActive ? 'grayscale' : ''}`}>
                        {imageUrl ? (
                            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <Users className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        )}
                        {isActive && (
                            <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                                EN COURS
                            </span>
                        )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                {!isActive && team.season?.name && (
                                    <p className="text-xs text-muted-foreground">{team.season.name}</p>
                                )}
                                <h3 className={`font-semibold ${!isActive ? 'text-muted-foreground' : ''}`}>{team.name}</h3>
                                <p className="text-sm text-muted-foreground">{team.division || team.category}</p>
                                {team.coach_name && (
                                    <p className="mt-0.5 text-sm text-muted-foreground">{team.coach_name}</p>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={onVisit}>Voir</Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                                    <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            className={`cursor-pointer overflow-hidden transition-shadow hover:shadow-md ${!isActive ? 'opacity-90' : ''}`}
            onClick={onVisit}
        >
            {content}
        </Card>
    );
}
