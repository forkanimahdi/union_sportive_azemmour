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
import { Plus, Edit, Trash2, Eye, Search, Users, Trophy, Baby, UserCircle2, TrendingUp, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DeleteModal from '@/components/DeleteModal';
import InputError from '@/components/input-error';

const categoryIcons = {
    'U13': Baby,
    'U15': UserCircle2,
    'U17': TrendingUp,
    'Senior': Trophy,
};

export default function TeamsIndex({ teams, seasons }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [seasonId, setSeasonId] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamToDelete, setTeamToDelete] = useState(null);

    const createForm = useForm({
        season_id: '',
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

    const filteredTeams = useMemo(() => {
        let filtered = teams.data || [];
        
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(team => 
                team.name.toLowerCase().includes(searchLower) ||
                team.description?.toLowerCase().includes(searchLower)
            );
        }
        
        if (category) {
            filtered = filtered.filter(team => team.category === category);
        }
        
        if (seasonId) {
            filtered = filtered.filter(team => team.season?.id?.toString() === seasonId);
        }
        
        return filtered;
    }, [teams.data, search, category, seasonId]);

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
                }
            });
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/teams', {
            onSuccess: () => {
                setCreateModalOpen(false);
                createForm.reset();
            }
        });
    };

    const handleEdit = (team) => {
        setSelectedTeam(team);
        editForm.setData({
            season_id: team.season?.id?.toString() || '',
            category: team.category,
            name: team.name,
            description: team.description || '',
            is_active: team.is_active,
        });
        setEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(`/admin/teams/${selectedTeam.id}`, {
            onSuccess: () => {
                setEditModalOpen(false);
                setSelectedTeam(null);
            }
        });
    };

    const CategoryIcon = categoryIcons['Senior'];

    return (
        <AdminLayout>
            <Head title="Équipes" />
            <div className="min-h-screen bg-primary/80">
                <div className="space-y-6 p-6">
                    {/* Hero Header */}
                    <div className="bg-primary rounded-xl p-8 text-white shadow-xl">
                        <div className="flex items-center justify-between flex-wrap gap-6">
                            <div>
                                <h1 className="text-4xl font-black uppercase italic mb-2">
                                    Nos Équipes
                                </h1>
                                <p className="text-white/80 text-lg">
                                    Gestion complète de vos équipes
                                </p>
                            </div>
                            <Button 
                                size="lg" 
                                className="bg-white text-primary hover:bg-white/95 shadow-xl h-12 px-6"
                                onClick={() => setCreateModalOpen(true)}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nouvelle Équipe
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="bg-primary/80 border-primary/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="relative flex-1 min-w-[280px]">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                    <Input
                                        placeholder="Rechercher une équipe..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-12 h-12 bg-white border-2 border-primary/20 focus:border-primary rounded-xl"
                                    />
                                </div>
                                <Select value={category || 'all'} onValueChange={(value) => setCategory(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="h-12 w-[200px] bg-white border-2 border-primary/20 rounded-xl">
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les catégories</SelectItem>
                                        <SelectItem value="U13">U13</SelectItem>
                                        <SelectItem value="U15">U15</SelectItem>
                                        <SelectItem value="U17">U17</SelectItem>
                                        <SelectItem value="Senior">Senior</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={seasonId || 'all'} onValueChange={(value) => setSeasonId(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="h-12 w-[200px] bg-white border-2 border-primary/20 rounded-xl">
                                        <SelectValue placeholder="Saison" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les saisons</SelectItem>
                                        {seasons?.map((season) => (
                                            <SelectItem key={season.id} value={season.id.toString()}>
                                                {season.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(search || category || seasonId) && (
                                    <Button 
                                        variant="outline" 
                                        onClick={() => { setSearch(''); setCategory(''); setSeasonId(''); }} 
                                        className="h-12 px-4 bg-white border-2 border-primary/20 rounded-xl"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Réinitialiser
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    {filteredTeams.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="border-0 shadow-lg bg-primary text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm mb-2">Total</p>
                                            <p className="text-3xl font-black">{teams.data?.length || 0}</p>
                                        </div>
                                        <Users className="w-8 h-8 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-[#662682] text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm mb-2">Actives</p>
                                            <p className="text-3xl font-black">
                                                {teams.data?.filter(t => t.is_active).length || 0}
                                            </p>
                                        </div>
                                        <Trophy className="w-8 h-8 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-[#662682]/80 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm mb-2">Joueuses</p>
                                            <p className="text-3xl font-black">
                                                {teams.data?.reduce((sum, t) => sum + (t.players_count || 0), 0) || 0}
                                            </p>
                                        </div>
                                        <Users className="w-8 h-8 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-[#662682]/60 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm mb-2">Catégories</p>
                                            <p className="text-3xl font-black">
                                                {new Set(teams.data?.map(t => t.category) || []).size}
                                            </p>
                                        </div>
                                        <Trophy className="w-8 h-8 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Teams Grid */}
                    {filteredTeams.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTeams.map((team) => {
                                const Icon = categoryIcons[team.category] || CategoryIcon;
                                
                                return (
                                    <Card
                                        key={team.id}
                                        className="group relative overflow-hidden border-0 shadow-lg bg-[#662682]/80 hover:bg-[#662682] transition-all duration-300 cursor-pointer"
                                        onClick={() => router.visit(`/admin/teams/${team.id}`)}
                                    >
                                        <div className={`h-1.5 ${team.is_active ? 'bg-white' : 'bg-white/60'}`}></div>
                                        
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-black text-white truncate group-hover:text-white/90 transition-colors">
                                                            {team.name}
                                                        </h3>
                                                        <Badge className="mt-1 bg-white/20 text-white border-0 text-xs">
                                                            {team.category}
                                                        </Badge>
                                                        {team.is_active && (
                                                            <Badge className="mt-1 ml-2 bg-white/30 text-white border-0 text-xs">
                                                                Active
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {team.season && (
                                                <div className="mb-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    <p className="text-xs text-white/90 font-semibold truncate">
                                                        {team.season.name}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-3 border-t border-white/20">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-white/80" />
                                                    <span className="text-sm font-bold text-white">
                                                        {team.players_count || 0} joueuse{team.players_count !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            handleEdit(team); 
                                                        }}
                                                        className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            handleDelete(team.id); 
                                                        }}
                                                        className="h-8 w-8 p-0 hover:bg-white/20 text-white/80"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="border-2 border-dashed border-primary/20 bg-white">
                            <CardContent className="py-20 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="p-4 bg-primary/80 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">Aucune équipe trouvée</h3>
                                    <p className="text-muted-foreground">
                                        {search || category || seasonId
                                            ? 'Essayez de modifier vos critères de recherche'
                                            : 'Commencez par créer votre première équipe'
                                        }
                                    </p>
                                    {!search && !category && !seasonId && (
                                        <Button 
                                            size="lg" 
                                            className="mt-4 bg-primary hover:bg-primary/90 text-white"
                                            onClick={() => setCreateModalOpen(true)}
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                            Créer une équipe
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
                                <DialogTitle className="text-white text-2xl font-black">Nouvelle Équipe</DialogTitle>
                                <DialogDescription className="text-white/80">
                                    Créer une nouvelle équipe
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="create_season_id" className="text-white">Saison *</Label>
                                    <Select value={createForm.data.season_id} onValueChange={(value) => createForm.setData('season_id', value)}>
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                            <SelectValue placeholder="Sélectionner une saison" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {seasons.map((season) => (
                                                <SelectItem key={season.id} value={season.id.toString()}>
                                                    {season.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={createForm.errors.season_id} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create_category" className="text-white">Catégorie *</Label>
                                        <Select value={createForm.data.category} onValueChange={(value) => createForm.setData('category', value)}>
                                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="U13">U13</SelectItem>
                                                <SelectItem value="U15">U15</SelectItem>
                                                <SelectItem value="U17">U17</SelectItem>
                                                <SelectItem value="Senior">Senior</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={createForm.errors.category} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="create_name" className="text-white">Nom de l'équipe *</Label>
                                        <Input
                                            id="create_name"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            placeholder="Ex: U17 A, Senior Elite"
                                            required
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        />
                                        <InputError message={createForm.errors.name} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create_description" className="text-white">Description</Label>
                                    <textarea
                                        id="create_description"
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        className="w-full min-h-[100px] px-3 py-2 bg-white/10 border-white/20 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                                        placeholder="Description de l'équipe..."
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
                                        Équipe active
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
                                        {createForm.processing ? 'Création...' : 'Créer l\'équipe'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Modal */}
                    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                        <DialogContent className="bg-primary border-primary/20 text-white sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-white text-2xl font-black">Modifier l'Équipe</DialogTitle>
                                <DialogDescription className="text-white/80">
                                    {selectedTeam?.name}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitEdit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_season_id" className="text-white">Saison *</Label>
                                    <Select value={editForm.data.season_id} onValueChange={(value) => editForm.setData('season_id', value)}>
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                            <SelectValue placeholder="Sélectionner une saison" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {seasons.map((season) => (
                                                <SelectItem key={season.id} value={season.id.toString()}>
                                                    {season.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={editForm.errors.season_id} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_category" className="text-white">Catégorie *</Label>
                                        <Select value={editForm.data.category} onValueChange={(value) => editForm.setData('category', value)}>
                                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="U13">U13</SelectItem>
                                                <SelectItem value="U15">U15</SelectItem>
                                                <SelectItem value="U17">U17</SelectItem>
                                                <SelectItem value="Senior">Senior</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={editForm.errors.category} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit_name" className="text-white">Nom de l'équipe *</Label>
                                        <Input
                                            id="edit_name"
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            required
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        />
                                        <InputError message={editForm.errors.name} />
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
                                        Équipe active
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
                        title="Supprimer l'équipe"
                        description="Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible."
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
