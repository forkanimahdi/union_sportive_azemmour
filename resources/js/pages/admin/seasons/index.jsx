import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar, Users, User, ArrowRight, RotateCcw, Search, X, Edit, Trash2, MoreVertical } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';
import InputError from '@/components/input-error';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DEFAULT_SEASON_IMAGE = '/assets/images/hero/usa_hero.jpg';

export default function SeasonsIndex({ seasons }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [seasonToDelete, setSeasonToDelete] = useState(null);

    const createForm = useForm({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        is_active: false,
    });

    const editForm = useForm({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        is_active: false,
    });

    const filteredSeasons = useMemo(() => {
        let filtered = seasons.data || [];
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(season =>
                season.name.toLowerCase().includes(searchLower) ||
                season.description?.toLowerCase().includes(searchLower)
            );
        }
        if (statusFilter) {
            filtered = filtered.filter(season =>
                statusFilter === 'active' ? season.is_active : !season.is_active
            );
        }
        return filtered;
    }, [seasons.data, search, statusFilter]);

    const handleDelete = (id) => {
        setSeasonToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (seasonToDelete) {
            router.delete(`/admin/seasons/${seasonToDelete}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setSeasonToDelete(null);
                }
            });
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/seasons', {
            onSuccess: () => {
                setCreateModalOpen(false);
                createForm.reset();
            }
        });
    };

    const handleEdit = (season) => {
        setSelectedSeason(season);
        editForm.setData({
            name: season.name,
            start_date: season.start_date,
            end_date: season.end_date,
            description: season.description || '',
            is_active: season.is_active,
        });
        setEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(`/admin/seasons/${selectedSeason.id}`, {
            onSuccess: () => {
                setEditModalOpen(false);
                setSelectedSeason(null);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Saisons" />
            <div className="min-h-screen bg-background">
                <div className="space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
                    {/* Header: title, subtitle, New Season button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                                Sélection de saison
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-base mt-1">
                                Choisissez une saison pour gérer les équipes, effectifs et calendriers.
                            </p>
                        </div>
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 w-full sm:w-auto"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nouvelle saison
                        </Button>
                    </div>

                    {/* Optional filters - compact on mobile */}
                    {(seasons.data?.length > 3 || search || statusFilter) && (
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <div className="relative flex-1 min-w-[200px] max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-9 sm:h-10 bg-card border rounded-lg"
                                />
                            </div>
                            <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
                                <SelectTrigger className="h-9 sm:h-10 w-[160px] sm:w-[200px] bg-card rounded-lg">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="active">Actives</SelectItem>
                                    <SelectItem value="inactive">Archivées</SelectItem>
                                </SelectContent>
                            </Select>
                            {(search || statusFilter) && (
                                <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter(''); }} className="h-9">
                                    <X className="w-4 h-4 mr-1" /> Réinitialiser
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Season cards */}
                    {filteredSeasons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {filteredSeasons.map((season) => (
                                <Card
                                    key={season.id}
                                    className="overflow-hidden border rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow flex flex-col"
                                >
                                    {/* Card image - default usa_hero.jpg, grayscale when archived */}
                                    <div className="relative h-36 sm:h-44 overflow-hidden bg-muted">
                                        <img
                                            src={DEFAULT_SEASON_IMAGE}
                                            alt=""
                                            className={`w-full h-full object-cover ${season.is_active ? '' : 'grayscale opacity-80'}`}
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium uppercase ${
                                                    season.is_active
                                                        ? 'bg-emerald-500/90 text-white'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {season.is_active ? 'Active' : 'Archivée'}
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white" onClick={(e) => e.stopPropagation()}>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(season); }}>
                                                        <Edit className="w-4 h-4 mr-2" /> Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(season.id); }}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                                        <h3 className={`text-lg sm:text-xl font-bold mb-3 ${season.is_active ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {season.name}
                                        </h3>
                                        <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                                            <li className="flex items-center gap-2">
                                                <Users className="w-4 h-4 shrink-0 text-primary/70" />
                                                <span>{season.teams_count ?? 0} équipe{(season.teams_count ?? 0) !== 1 ? 's' : ''}</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <User className="w-4 h-4 shrink-0 text-primary/70" />
                                                <span>{season.players_count ?? 0} joueur{(season.players_count ?? 0) !== 1 ? 's' : ''} actifs</span>
                                            </li>
                                        </ul>
                                        <Button
                                            className="w-full mt-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                                            variant={season.is_active ? 'default' : 'secondary'}
                                            onClick={() => router.visit(`/admin/seasons/${season.id}`)}
                                        >
                                            {season.is_active ? (
                                                <>Gérer la saison <ArrowRight className="w-4 h-4 ml-2" /></>
                                            ) : (
                                                <>Voir les archives <RotateCcw className="w-4 h-4 ml-2" /></>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-2 border-dashed border-border bg-card">
                            <CardContent className="py-12 sm:py-20 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="p-4 bg-primary/10 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
                                        <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                                        {search || statusFilter ? 'Aucune saison trouvée' : 'Aucune saison'}
                                    </h3>
                                    <p className="text-muted-foreground text-sm sm:text-base">
                                        {search || statusFilter
                                            ? 'Modifiez les critères de recherche.'
                                            : 'Créez votre première saison pour commencer.'}
                                    </p>
                                    {!search && !statusFilter && (
                                        <Button size="lg" className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setCreateModalOpen(true)}>
                                            <Plus className="w-5 h-5 mr-2" />
                                            Nouvelle saison
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Need to start a new cycle? */}
                    <Card className="rounded-xl border bg-card shadow-sm">
                        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-primary text-lg">Démarrer un nouveau cycle ?</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Créer une nouvelle saison permet d&apos;importer les effectifs des années précédentes, de configurer les catégories et d&apos;initialiser le calendrier des matchs.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/10 shrink-0 w-full sm:w-auto"
                                onClick={() => setCreateModalOpen(true)}
                            >
                                Importer des données
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Create Modal - New Season */}
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogContent className="bg-card border border-border text-foreground sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-primary text-xl sm:text-2xl font-bold">Nouvelle saison</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Créer une nouvelle saison sportive
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 sm:space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="create_name">Nom de la saison *</Label>
                                    <Input
                                        id="create_name"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Ex: 2024 - 2025"
                                        required
                                        className="bg-background border-border"
                                    />
                                    <InputError message={createForm.errors.name} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create_start_date">Date de début *</Label>
                                        <Input
                                            id="create_start_date"
                                            type="date"
                                            value={createForm.data.start_date}
                                            onChange={(e) => createForm.setData('start_date', e.target.value)}
                                            required
                                            className="bg-background border-border"
                                        />
                                        <InputError message={createForm.errors.start_date} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create_end_date">Date de fin *</Label>
                                        <Input
                                            id="create_end_date"
                                            type="date"
                                            value={createForm.data.end_date}
                                            onChange={(e) => createForm.setData('end_date', e.target.value)}
                                            required
                                            className="bg-background border-border"
                                        />
                                        <InputError message={createForm.errors.end_date} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create_description">Description</Label>
                                    <textarea
                                        id="create_description"
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        className="w-full min-h-[80px] px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Description optionnelle..."
                                    />
                                    <InputError message={createForm.errors.description} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="create_is_active"
                                        checked={createForm.data.is_active}
                                        onCheckedChange={(checked) => createForm.setData('is_active', checked)}
                                    />
                                    <Label htmlFor="create_is_active" className="cursor-pointer text-sm">
                                        Définir comme saison active
                                    </Label>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={createForm.processing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        {createForm.processing ? 'Création...' : 'Créer la saison'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Modal */}
                    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                        <DialogContent className="bg-card border border-border text-foreground sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-primary text-xl sm:text-2xl font-bold">Modifier la saison</DialogTitle>
                                <DialogDescription className="text-muted-foreground">{selectedSeason?.name}</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitEdit} className="space-y-4 sm:space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_name">Nom de la saison *</Label>
                                    <Input
                                        id="edit_name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        required
                                        className="bg-background border-border"
                                    />
                                    <InputError message={editForm.errors.name} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_start_date">Date de début *</Label>
                                        <Input
                                            id="edit_start_date"
                                            type="date"
                                            value={editForm.data.start_date}
                                            onChange={(e) => editForm.setData('start_date', e.target.value)}
                                            required
                                            className="bg-background border-border"
                                        />
                                        <InputError message={editForm.errors.start_date} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_end_date">Date de fin *</Label>
                                        <Input
                                            id="edit_end_date"
                                            type="date"
                                            value={editForm.data.end_date}
                                            onChange={(e) => editForm.setData('end_date', e.target.value)}
                                            required
                                            className="bg-background border-border"
                                        />
                                        <InputError message={editForm.errors.end_date} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_description">Description</Label>
                                    <textarea
                                        id="edit_description"
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        className="w-full min-h-[80px] px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <InputError message={editForm.errors.description} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit_is_active"
                                        checked={editForm.data.is_active}
                                        onCheckedChange={(checked) => editForm.setData('is_active', checked)}
                                    />
                                    <Label htmlFor="edit_is_active" className="cursor-pointer text-sm">
                                        Définir comme saison active
                                    </Label>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={editForm.processing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        {editForm.processing ? 'Mise à jour...' : 'Mettre à jour'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <DeleteModal
                        open={deleteModalOpen}
                        onOpenChange={setDeleteModalOpen}
                        onConfirm={confirmDelete}
                        title="Supprimer la saison"
                        description="Cette action est irréversible. Confirmer la suppression ?"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
