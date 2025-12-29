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
import { Plus, Edit, Trash2, Calendar, Trophy, Search, X, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DeleteModal from '@/components/DeleteModal';
import InputError from '@/components/input-error';

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AdminLayout>
            <Head title="Saisons" />
            <div className="min-h-screen ">
                <div className="space-y-6 p-6">
                    {/* Header */}
                    <div className="bg-primary rounded-xl p-8 text-white shadow-xl">
                        <div className="flex items-center justify-between flex-wrap gap-6">
                    <div>
                                <h1 className="text-4xl font-black uppercase italic mb-2">
                                    Saisons Sportives
                                </h1>
                                <p className="text-white/80 text-lg">
                                    Gérez toutes vos saisons en un seul endroit
                                </p>
                            </div>
                            <Button 
                                size="lg" 
                                className="bg-white text-primary hover:bg-white/95 shadow-xl h-12 px-6"
                                onClick={() => setCreateModalOpen(true)}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                            Nouvelle Saison
                        </Button>
                    </div>
                </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative flex-1 min-w-[280px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une saison..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 h-12 bg-white border-2 border-primary/20 focus:border-primary rounded-xl"
                            />
                        </div>
                        <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
                            <SelectTrigger className="h-12 w-[200px] bg-white border-2 border-primary/20 rounded-xl">
                                        <SelectValue placeholder="Tous les statuts" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="active">Active uniquement</SelectItem>
                                <SelectItem value="inactive">Inactive uniquement</SelectItem>
                                    </SelectContent>
                                </Select>
                        {(search || statusFilter) && (
                            <Button 
                                variant="outline" 
                                onClick={() => { setSearch(''); setStatusFilter(''); }} 
                                className="h-12 px-4 bg-white border-2 border-primary/20 rounded-xl"
                            >
                                        <X className="w-4 h-4 mr-2" />
                                        Réinitialiser
                                    </Button>
                                )}
                            </div>

                    {/* Stats */}
                    {filteredSeasons.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-0 shadow-lg bg-primary text-white">
                                <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                            <p className="text-white/80 text-sm mb-2">Total Saisons</p>
                                            <p className="text-4xl font-black">{seasons.data?.length || 0}</p>
                                    </div>
                                        <Calendar className="w-10 h-10 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                            <Card className="border-0 shadow-lg bg-primary text-white">
                                <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                            <p className="text-white/80 text-sm mb-2">Saisons Actives</p>
                                            <p className="text-4xl font-black">
                                                {filteredSeasons.filter(s => s.is_active).length}
                                        </p>
                                    </div>
                                        <Trophy className="w-10 h-10 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                            <Card className="border-0 shadow-lg bg-primary text-white">
                                <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                            <p className="text-white/80 text-sm mb-2">Total Équipes</p>
                                            <p className="text-4xl font-black">
                                                {filteredSeasons.reduce((sum, s) => sum + (s.teams_count || 0), 0)}
                                        </p>
                                    </div>
                                        <Users className="w-10 h-10 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                    {/* Seasons Cards - Improved UI */}
                    {filteredSeasons.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                            {filteredSeasons.map((season) => (
                        <Card 
                            key={season.id}
                                    className="group relative overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                    onClick={() => router.visit(`/admin/seasons/${season.id}`)}
                                >
                                    {/* Top accent bar */}
                                    <div className={`h-3 ${season.is_active ? 'bg-primary' : 'bg-primary/80'}`}></div>
                                    
                                    <CardContent className="p-8">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={`p-4 rounded-2xl ${season.is_active ? 'bg-primary/80' : 'bg-primary/80'}`}>
                                                    <Trophy className={`w-8 h-8 ${season.is_active ? 'text-white' : 'text-white'}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors mb-2">
                                                        {season.name}
                                                    </h3>
                            {season.is_active && (
                                                        <Badge className="bg-primary text-white border-0">
                                                            Saison Active
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="mb-6 p-5 bg-primary/80 rounded-xl text-white">
                                            <div className="flex items-center gap-4">
                                                <Calendar className="w-6 h-6 text-white" />
                                                <div className="flex items-center gap-3 flex-1">
                                                    <span className="text-sm font-bold">
                                                        {formatDate(season.start_date)}
                                                    </span>
                                                    <ArrowRight className="w-4 h-4" />
                                                    <span className="text-sm font-bold">
                                                        {formatDate(season.end_date)}
                                            </span>
                                                </div>
                                    </div>
                                </div>
                            
                                        {/* Description */}
                                    {season.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                                                {season.description}
                                        </p>
                                )}
                                
                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-6 border-t border-primary/20">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/80 rounded-lg">
                                                    <Users className="w-5 h-5 text-white" />
                                    </div>
                                                <span className="text-base font-black text-foreground">
                                                    {season.teams_count || 0} équipe{season.teams_count !== 1 ? 's' : ''}
                                                </span>
                                </div>
                                            <div className="flex items-center gap-2">
                                        <Button 
                                                    variant="ghost" 
                                            size="sm" 
                                                    onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        handleEdit(season); 
                                                    }}
                                                    className="h-10 w-10 p-0 hover:bg-primary/80 hover:text-white"
                                        >
                                                    <Edit className="w-4 h-4" />
                                            </Button>
                                        <Button 
                                                    variant="ghost" 
                                            size="sm" 
                                                    onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        handleDelete(season.id); 
                                                    }}
                                                    className="h-10 w-10 p-0 hover:bg-destructive/80 hover:text-white text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                            </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                    ) : (
                        <Card className="border-2 border-dashed border-primary/20 bg-white">
                            <CardContent className="py-20 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="p-4 bg-primary/80 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                                        <Trophy className="w-10 h-10 text-white" />
                                </div>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        {search || statusFilter ? 'Aucune saison trouvée' : 'Aucune saison créée'}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {search || statusFilter 
                                            ? 'Essayez de modifier vos critères de recherche'
                                            : 'Commencez par créer votre première saison sportive'
                                        }
                                    </p>
                                    {!search && !statusFilter && (
                                        <Button 
                                            size="lg" 
                                            className="mt-4 bg-primary hover:bg-primary/90 text-white"
                                            onClick={() => setCreateModalOpen(true)}
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                                Créer la première saison
                                        </Button>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                    {/* Create Modal */}
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogContent className="bg-primary border-primary/20 text-white sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-white text-2xl font-black">Nouvelle Saison</DialogTitle>
                                <DialogDescription className="text-white/80">
                                    Créer une nouvelle saison sportive
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="create_name" className="text-white">Nom de la saison *</Label>
                                    <Input
                                        id="create_name"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Ex: Saison 2024-2025"
                                        required
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                    />
                                    <InputError message={createForm.errors.name} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create_start_date" className="text-white">Date de début *</Label>
                                        <Input
                                            id="create_start_date"
                                            type="date"
                                            value={createForm.data.start_date}
                                            onChange={(e) => createForm.setData('start_date', e.target.value)}
                                            required
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                        <InputError message={createForm.errors.start_date} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="create_end_date" className="text-white">Date de fin *</Label>
                                        <Input
                                            id="create_end_date"
                                            type="date"
                                            value={createForm.data.end_date}
                                            onChange={(e) => createForm.setData('end_date', e.target.value)}
                                            required
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                        <InputError message={createForm.errors.end_date} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create_description" className="text-white">Description</Label>
                                    <textarea
                                        id="create_description"
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        className="w-full min-h-[100px] px-3 py-2 bg-white/10 border-white/20 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                                        placeholder="Description de la saison..."
                                    />
                                    <InputError message={createForm.errors.description} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="create_is_active"
                                        checked={createForm.data.is_active}
                                        onCheckedChange={(checked) => createForm.setData('is_active', checked)}
                                    />
                                    <Label htmlFor="create_is_active" className="cursor-pointer text-white">
                                        Définir comme saison active
                                    </Label>
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCreateModalOpen(false)}
                                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                    >
                                        Annuler
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={createForm.processing}
                                        className="bg-white text-primary hover:bg-white/90"
                                    >
                                        {createForm.processing ? 'Création...' : 'Créer la saison'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Modal */}
                    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                        <DialogContent className="bg-primary border-primary/20 text-white sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-white text-2xl font-black">Modifier la Saison</DialogTitle>
                                <DialogDescription className="text-white/80">
                                    {selectedSeason?.name}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitEdit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_name" className="text-white">Nom de la saison *</Label>
                                    <Input
                                        id="edit_name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        required
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                    />
                                    <InputError message={editForm.errors.name} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_start_date" className="text-white">Date de début *</Label>
                                        <Input
                                            id="edit_start_date"
                                            type="date"
                                            value={editForm.data.start_date}
                                            onChange={(e) => editForm.setData('start_date', e.target.value)}
                                            required
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                        <InputError message={editForm.errors.start_date} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit_end_date" className="text-white">Date de fin *</Label>
                                        <Input
                                            id="edit_end_date"
                                            type="date"
                                            value={editForm.data.end_date}
                                            onChange={(e) => editForm.setData('end_date', e.target.value)}
                                            required
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                        <InputError message={editForm.errors.end_date} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit_description" className="text-white">Description</Label>
                                    <textarea
                                        id="edit_description"
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        className="w-full min-h-[100px] px-3 py-2 bg-white/10 border-white/20 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                    <InputError message={editForm.errors.description} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit_is_active"
                                        checked={editForm.data.is_active}
                                        onCheckedChange={(checked) => editForm.setData('is_active', checked)}
                                    />
                                    <Label htmlFor="edit_is_active" className="cursor-pointer text-white">
                                        Définir comme saison active
                                    </Label>
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditModalOpen(false)}
                                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                    >
                                        Annuler
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={editForm.processing}
                                        className="bg-white text-primary hover:bg-white/90"
                                    >
                                        {editForm.processing ? 'Mise à jour...' : 'Mettre à jour'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Modal */}
                    <DeleteModal
                        open={deleteModalOpen}
                        onOpenChange={setDeleteModalOpen}
                        onConfirm={confirmDelete}
                        title="Supprimer la saison"
                        description="Êtes-vous sûr de vouloir supprimer cette saison ? Cette action est irréversible."
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
