import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';
import InputError from '@/components/input-error';

const CATEGORY_LABELS = {
    Senior: 'SENIOR',
    U17: 'U17',
    U15: 'U15',
    U13: 'U13',
};

export default function OpponentTeamsIndex({
    teams = [],
    activeSeason,
    seasons = [],
    categories = [],
}) {
    const [search, setSearch] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const createForm = useForm({
        name: '',
        category: '',
        logo: null,
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post('/admin/opponent-teams', {
            forceFormData: true,
            onSuccess: () => {
                setCreateModalOpen(false);
                createForm.reset();
                setLogoPreview(null);
            },
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            createForm.setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            createForm.setData('logo', null);
            setLogoPreview(null);
        }
    };

    const openCreateModal = () => {
        createForm.reset();
        setLogoPreview(null);
        setCreateModalOpen(true);
    };

    // Filter and group teams by category (no calendar, no standings)
    const teamsByCategory = useMemo(() => {
        let filtered = [...teams];
        const searchLower = search.trim().toLowerCase();
        if (searchLower) {
            filtered = filtered.filter(
                (t) =>
                    (t.name && t.name.toLowerCase().includes(searchLower)) ||
                    (t.short_code && t.short_code.toLowerCase().includes(searchLower))
            );
        }
        if (categoryFilter && categoryFilter !== 'all') {
            filtered = filtered.filter((t) => (t.category || '') === categoryFilter);
        }
        const grouped = {};
        filtered.forEach((team) => {
            const cat = team.category || 'Autre';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(team);
        });
        Object.keys(grouped).forEach((cat) => {
            grouped[cat].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        });
        return grouped;
    }, [teams, search, categoryFilter]);

    const orderedCategoryKeys = useMemo(() => {
        const keys = Object.keys(teamsByCategory);
        const order = ['Senior', 'U17', 'U15', 'U13', 'Autre'];
        return order.filter((k) => keys.includes(k)).concat(keys.filter((k) => !order.includes(k)));
    }, [teamsByCategory]);

    const handleDeleteClick = (team) => {
        setTeamToDelete(team);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (teamToDelete) {
            router.delete(`/admin/opponent-teams/${teamToDelete.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setTeamToDelete(null);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Gérer les équipes adverses" />
            <div className="min-h-screen bg-muted/30">
                <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
                    {/* Page title + Add button */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Gérer les équipes adverses
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Configurez les équipes externes et les abréviations pour les tableaux de compétition.
                            </p>
                        </div>
                        <Button
                            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={openCreateModal}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une équipe externe
                        </Button>
                    </div>

                    {/* Search and filters */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher équipes ou abréviations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-background"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                                <SelectTrigger className="w-full min-w-[140px] sm:w-[160px] bg-background">
                                    <SelectValue placeholder="Saison" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les saisons</SelectItem>
                                    {seasons.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full min-w-[140px] sm:w-[180px] bg-background">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les catégories</SelectItem>
                                    {(categories.length ? categories : ['Senior', 'U17', 'U15', 'U13']).map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Teams by category - cards only, no calendar */}
                    {orderedCategoryKeys.length > 0 ? (
                        <div className="space-y-8">
                            {orderedCategoryKeys.map((category) => {
                                const list = teamsByCategory[category];
                                if (!list || list.length === 0) return null;
                                const heading = CATEGORY_LABELS[category] || category.toUpperCase();
                                return (
                                    <section key={category}>
                                        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                                            {heading}
                                        </h2>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {list.map((team) => (
                                                <div
                                                    key={team.id}
                                                    className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                                                >
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/90 text-base font-bold text-primary-foreground">
                                                        {team.short_code || (team.name || '').slice(0, 2).toUpperCase() || '—'}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-foreground truncate">
                                                            {team.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Saison {activeSeason?.name || '—'}
                                                        </p>
                                                    </div>
                                                    <div className="flex shrink-0 items-center gap-1">
                                                        <Link href={`/admin/opponent-teams/${team.id}/edit`}>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 text-primary hover:bg-primary/10"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteClick(team)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed bg-card py-16 text-center">
                            <p className="text-muted-foreground">
                                {search || categoryFilter !== 'all'
                                    ? 'Aucune équipe ne correspond aux critères.'
                                    : 'Aucune équipe adverse. Ajoutez une équipe externe pour commencer.'}
                            </p>
                            {!search && categoryFilter === 'all' && (
                                <Button
                                    className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={openCreateModal}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ajouter une équipe externe
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Create Opponent Modal */}
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Nouvelle équipe adverse</DialogTitle>
                                <DialogDescription>
                                    Ajoutez un club externe. Le nom et la catégorie permettent de l&apos;identifier dans les tableaux.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="create-name">Nom du club *</Label>
                                    <Input
                                        id="create-name"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Nom de l'équipe adverse"
                                        required
                                    />
                                    <InputError message={createForm.errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-category">Catégorie</Label>
                                    <Select
                                        value={createForm.data.category || 'none'}
                                        onValueChange={(v) => createForm.setData('category', v === 'none' ? '' : v)}
                                    >
                                        <SelectTrigger id="create-category">
                                            <SelectValue placeholder="Sélectionner une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucune</SelectItem>
                                            <SelectItem value="U13">U13</SelectItem>
                                            <SelectItem value="U15">U15</SelectItem>
                                            <SelectItem value="U17">U17</SelectItem>
                                            <SelectItem value="Senior">Senior</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={createForm.errors.category} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-logo">Logo</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="create-logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="flex-1"
                                        />
                                        {logoPreview && (
                                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 border-primary/20">
                                                <img src={logoPreview} alt="Aperçu" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={createForm.errors.logo} />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={createForm.processing} className="bg-primary hover:bg-primary/90">
                                        {createForm.processing ? 'Création…' : 'Ajouter'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <DeleteModal
                        open={deleteModalOpen}
                        onOpenChange={(open) => {
                            setDeleteModalOpen(open);
                            if (!open) setTeamToDelete(null);
                        }}
                        onConfirm={confirmDelete}
                        title="Supprimer l'équipe adverse"
                        description={
                            teamToDelete
                                ? `Êtes-vous sûr de vouloir supprimer « ${teamToDelete.name} » ? Cette action est irréversible.`
                                : "Cette action est irréversible."
                        }
                        loading={false}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
