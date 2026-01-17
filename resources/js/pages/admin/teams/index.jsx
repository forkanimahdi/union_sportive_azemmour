import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Search, Users, Trophy, Baby, UserCircle2, TrendingUp, X, UserCog, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DeleteModal from '@/components/DeleteModal';
import InputError from '@/components/input-error';
import PlayerCard from '../../../components/admin/PlayerCard';

const categoryIcons = {
    'U13': Baby,
    'U15': UserCircle2,
    'U17': TrendingUp,
    'Senior': Trophy,
};

export default function TeamsIndex({ teams, players, seasons, categories = [], standingsByCategory = {} }) {
    // Players state
    const [playerSearch, setPlayerSearch] = useState('');
    const [playerTeamId, setPlayerTeamId] = useState('');
    const [playerPosition, setPlayerPosition] = useState('');
    const [playerCategory, setPlayerCategory] = useState('');

    // Teams state
    const [teamSearch, setTeamSearch] = useState('');
    const [teamCategory, setTeamCategory] = useState('');
    const [seasonId, setSeasonId] = useState('');
    
    // Modals state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [createPlayerModalOpen, setCreatePlayerModalOpen] = useState(false);
    
    // Expanded tables state
    const [expandedCategories, setExpandedCategories] = useState({});

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

    const createPlayerForm = useForm({
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

    // Filter players
    const filteredPlayers = useMemo(() => {
        let allPlayers = players?.data || [];
        
        if (playerSearch) {
            const searchLower = playerSearch.toLowerCase();
            allPlayers = allPlayers.filter(player => 
                `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchLower) ||
                player.first_name?.toLowerCase().includes(searchLower) ||
                player.last_name?.toLowerCase().includes(searchLower)
            );
        }
        
        if (playerTeamId) {
            allPlayers = allPlayers.filter(player => 
                player.team?.id?.toString() === playerTeamId.toString()
            );
        }
        
        if (playerPosition) {
            allPlayers = allPlayers.filter(player => 
                player.position === playerPosition
            );
        }

        if (playerCategory) {
            allPlayers = allPlayers.filter(player => 
                player.team?.category === playerCategory
            );
        }
        
        return allPlayers;
    }, [players?.data, playerSearch, playerTeamId, playerPosition, playerCategory]);

    // Filter teams
    const filteredTeams = useMemo(() => {
        let filtered = teams?.data || [];
        
        if (teamSearch) {
            const searchLower = teamSearch.toLowerCase();
            filtered = filtered.filter(team => 
                team.name.toLowerCase().includes(searchLower) ||
                team.description?.toLowerCase().includes(searchLower)
            );
        }
        
        if (teamCategory) {
            filtered = filtered.filter(team => team.category === teamCategory);
        }
        
        if (seasonId) {
            filtered = filtered.filter(team => team.season?.id?.toString() === seasonId);
        }
        
        return filtered;
    }, [teams?.data, teamSearch, teamCategory, seasonId]);

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

    const handleCreatePlayer = (e) => {
        e.preventDefault();
        createPlayerForm.post('/admin/players', {
            forceFormData: true,
            onSuccess: () => {
                setCreatePlayerModalOpen(false);
                createPlayerForm.reset();
            }
        });
    };

    const CategoryIcon = categoryIcons['Senior'];

    // Group players by category
    const playersByCategory = useMemo(() => {
        const grouped = {};
        filteredPlayers.forEach(player => {
            const cat = player.team?.category || 'Sans équipe';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(player);
        });
        return grouped;
    }, [filteredPlayers]);

    return (
        <AdminLayout>
            <Head title="Équipes" />
            <div className="min-h-screen">
                <div className="space-y-6 p-6">
                    {/* Hero Header */}
                    <div className="bg-primary rounded-xl p-8 text-white shadow-xl">
                        <div className="flex items-center justify-between flex-wrap gap-6">
                            <div>
                                <h1 className="text-4xl font-black uppercase italic mb-2">
                                    Équipes & Joueuses
                                </h1>
                                <p className="text-white/80 text-lg">
                                    Gestion complète de vos équipes et joueuses
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

                    {/* Tabs */}
                    <Tabs defaultValue="players" className="space-y-6">
                        <TabsList className="bg-primary/80 border-primary/20 p-1 h-auto">
                            <TabsTrigger 
                                value="players" 
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                                <UserCog className="w-4 h-4" />
                                Joueuses ({players?.data?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="teams" 
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                                <Users className="w-4 h-4" />
                                Équipes ({teams?.data?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="club" 
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                                <Building2 className="w-4 h-4" />
                                Club
                            </TabsTrigger>
                        </TabsList>

                        {/* Players Tab - Priority */}
                        <TabsContent value="players" className="space-y-4">
                            {/* Header with Create Button */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-white">Joueuses</h2>
                                <Button 
                                    size="lg" 
                                    className="bg-white text-primary hover:bg-white/95 shadow-xl h-12 px-6"
                                    onClick={() => setCreatePlayerModalOpen(true)}
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Nouvelle Joueuse
                                </Button>
                            </div>

                            {/* Filters */}
                            <Card className="bg-primary/80 border-primary/20">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                                            <Input
                                                placeholder="Rechercher une joueuse..."
                                                value={playerSearch}
                                                onChange={(e) => setPlayerSearch(e.target.value)}
                                                className="pl-10 bg-white border-2 border-primary/20"
                                            />
                                        </div>
                                        <Select value={playerCategory || 'all'} onValueChange={(value) => setPlayerCategory(value === 'all' ? '' : value)}>
                                            <SelectTrigger className="bg-white border-2 border-primary/20">
                                                <SelectValue placeholder="Catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={playerTeamId || 'all'} onValueChange={(value) => setPlayerTeamId(value === 'all' ? '' : value)}>
                                            <SelectTrigger className="bg-white border-2 border-primary/20">
                                                <SelectValue placeholder="Équipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Toutes les équipes</SelectItem>
                                                {teams?.data?.map((team) => (
                                                    <SelectItem key={team.id} value={team.id.toString()}>
                                                        {team.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={playerPosition || 'all'} onValueChange={(value) => setPlayerPosition(value === 'all' ? '' : value)}>
                                            <SelectTrigger className="bg-white border-2 border-primary/20">
                                                <SelectValue placeholder="Poste" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tous les postes</SelectItem>
                                                <SelectItem value="gardien">Gardien</SelectItem>
                                                <SelectItem value="defenseur">Défenseur</SelectItem>
                                                <SelectItem value="milieu">Milieu</SelectItem>
                                                <SelectItem value="attaquant">Attaquant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Players Stats */}
                            {filteredPlayers.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="border-0 shadow-lg bg-primary/10 text-alpha border-alpha ">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-alpha text-sm mb-2">Total Joueuses</p>
                                                    <p className="text-3xl font-black">{players?.data?.length || 0}</p>
                                                </div>
                                                <UserCog className="w-8 h-8 opacity-50" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-lg bg-primary/10 text-alpha border-alpha ">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-alpha text-sm mb-2">Avec Équipe</p>
                                                    <p className="text-3xl font-black">
                                                        {filteredPlayers.filter(p => p.team).length}
                                                    </p>
                                                </div>
                                                <Users className="w-8 h-8 opacity-50" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-lg bg-primary/10 text-alpha border-alpha ">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-alpha text-sm mb-2">Sans Équipe</p>
                                                    <p className="text-3xl font-black">
                                                        {filteredPlayers.filter(p => !p.team).length}
                                                    </p>
                                                </div>
                                                <UserCog className="w-8 h-8 opacity-50" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Players by Category */}
                            {Object.keys(playersByCategory).length > 0 ? (
                                <div className="space-y-6">
                                    {Object.entries(playersByCategory).map(([category, categoryPlayers]) => {
                                        const Icon = categoryIcons[category] || CategoryIcon;
                                        return (
                                            <div key={category}>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 rounded-lg bg-alpha/90">
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <h2 className="text-2xl font-black text-white">{category}</h2>
                                                    <Badge className="bg-white/20 text-white">{categoryPlayers.length}</Badge>
                                                </div>
                                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                    {categoryPlayers.map((player) => (
                                                        <PlayerCard
                                                            key={player.id}
                                                            player={player}
                                                            onClick={() => router.visit(`/admin/players/${player.id}`)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Card className="bg-primary/80 border-primary/20">
                                    <CardContent className="py-20 text-center">
                                        <UserCog className="w-16 h-16 text-white/30 mx-auto mb-4" />
                                        <p className="text-white/80 text-lg">Aucune joueuse trouvée</p>
                                        {(playerSearch || playerTeamId || playerPosition || playerCategory) && (
                                            <Button 
                                                variant="outline"
                                                onClick={() => {
                                                    setPlayerSearch('');
                                                    setPlayerTeamId('');
                                                    setPlayerPosition('');
                                                    setPlayerCategory('');
                                                }}
                                                className="mt-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Réinitialiser les filtres
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Teams Tab */}
                        <TabsContent value="teams" className="space-y-4">
                            {/* Filters */}
                            <Card className="bg-primary/80 border-primary/20">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="relative flex-1 min-w-[280px]">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                            <Input
                                                placeholder="Rechercher une équipe..."
                                                value={teamSearch}
                                                onChange={(e) => setTeamSearch(e.target.value)}
                                                className="pl-12 h-12 bg-white border-2 border-primary/20 focus:border-primary rounded-xl"
                                            />
                                        </div>
                                        <Select value={teamCategory || 'all'} onValueChange={(value) => setTeamCategory(value === 'all' ? '' : value)}>
                                            <SelectTrigger className="h-12 w-[200px] bg-white border-2 border-primary/20 rounded-xl">
                                                <SelectValue placeholder="Catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
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
                                        {(teamSearch || teamCategory || seasonId) && (
                                            <Button 
                                                variant="outline" 
                                                onClick={() => { setTeamSearch(''); setTeamCategory(''); setSeasonId(''); }} 
                                                className="h-12 px-4 bg-white border-2 border-primary/20 rounded-xl"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Réinitialiser
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Teams Stats */}
                            {filteredTeams.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <Card className="border-0 shadow-lg bg-alpha text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white/80 text-sm mb-2">Total</p>
                                                    <p className="text-3xl font-black">{teams?.data?.length || 0}</p>
                                                </div>
                                                <Users className="w-8 h-8 opacity-50" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-lg bg-alpha text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white/80 text-sm mb-2">Actives</p>
                                                    <p className="text-3xl font-black">
                                                        {teams?.data?.filter(t => t.is_active).length || 0}
                                                    </p>
                                                </div>
                                                <Trophy className="w-8 h-8 opacity-50" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-lg bg-alpha text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white/80 text-sm mb-2">Joueuses</p>
                                                    <p className="text-3xl font-black">
                                                        {teams?.data?.reduce((sum, t) => sum + (t.players_count || 0), 0) || 0}
                                                    </p>
                                                </div>
                                                <Users className="w-8 h-8 opacity-50" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-lg bg-alpha text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white/80 text-sm mb-2">Catégories</p>
                                                    <p className="text-3xl font-black">
                                                        {new Set(teams?.data?.map(t => t.category) || []).size}
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
                                                className="group relative overflow-hidden border-0 shadow-lg bg-alpha/90 hover:bg-alpha transition-all duration-300 cursor-pointer"
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
                                <Card className="bg-primary/80 border-primary/20">
                                    <CardContent className="py-20 text-center">
                                        <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                                        <p className="text-white/80 text-lg">Aucune équipe trouvée</p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Club Tab */}
                        <TabsContent value="club" className="space-y-6">
                            {/* Club Info */}
                            <Card className="bg-primary/80 border-primary/20">
                                <CardHeader className="bg-primary text-white">
                                    <CardTitle className="text-white text-2xl font-black flex items-center gap-3">
                                        <Building2 className="w-6 h-6" />
                                        Informations du Club
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white/5 p-6">
                                    <p className="text-white/80">Gestion des informations du club (logo, nom, etc.) - À venir</p>
                                </CardContent>
                            </Card>

                            {/* Standings by Category */}
                            {Object.keys(standingsByCategory).length > 0 && (
                                <div className="space-y-6">
                                    {Object.entries(standingsByCategory)
                                        .sort(([a], [b]) => {
                                            if (a === 'Senior') return -1;
                                            if (b === 'Senior') return 1;
                                            return a.localeCompare(b);
                                        })
                                        .map(([category, categoryTeams]) => {
                                            const Icon = categoryIcons[category] || CategoryIcon;
                                            const isExpanded = expandedCategories[category] || false;
                                            
                                            const toggleExpand = () => {
                                                setExpandedCategories(prev => ({
                                                    ...prev,
                                                    [category]: !prev[category]
                                                }));
                                            };
                                            
                                            return (
                                                <Card key={category} className="bg-alpha border-2 border-alpha shadow-xl">
                                                    <CardHeader className="bg-white/10 backdrop-blur-sm">
                                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                                            <CardTitle className="text-white text-xl sm:text-2xl font-black flex items-center gap-2 sm:gap-3 flex-wrap">
                                                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                                <span>Classement - {category}</span>
                                                                <Badge className="bg-white/30 text-white border-0 text-xs">
                                                                    {categoryTeams.length} équipe{categoryTeams.length !== 1 ? 's' : ''}
                                                                </Badge>
                                                            </CardTitle>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={toggleExpand}
                                                                className="text-white hover:bg-white/20 flex-shrink-0"
                                                            >
                                                                {isExpanded ? (
                                                                    <>
                                                                        <ChevronUp className="w-4 h-4 sm:mr-2" />
                                                                        <span className="hidden sm:inline">Réduire</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ChevronDown className="w-4 h-4 sm:mr-2" />
                                                                        <span className="hidden sm:inline">Voir tout</span>
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="bg-white/5 p-0">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead>
                                                                    <tr className="bg-white/20 text-white border-b-2 border-white/30">
                                                                        <th className="text-left p-4 text-sm font-black text-white uppercase">Pos</th>
                                                                        <th className="text-left p-4 text-sm font-black text-white uppercase">Équipe</th>
                                                                        {isExpanded && (
                                                                            <>
                                                                                <th className="text-center p-4 text-sm font-black text-white uppercase">J</th>
                                                                                <th className="text-center p-4 text-sm font-black text-white uppercase">V</th>
                                                                                <th className="text-center p-4 text-sm font-black text-white uppercase">N</th>
                                                                                <th className="text-center p-4 text-sm font-black text-white uppercase">P</th>
                                                                                <th className="text-center p-4 text-sm font-black text-white uppercase">BP</th>
                                                                                <th className="text-center p-4 text-sm font-black text-white uppercase">BC</th>
                                                                                <th className="text-center p-4 text-sm font-black text-white uppercase">DB</th>
                                                                            </>
                                                                        )}
                                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">Pts</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {categoryTeams.map((team, index) => (
                                                                        <tr 
                                                                            key={team.id}
                                                                            className={`border-b border-white/20 hover:bg-white/20 transition-colors text-white ${!team.is_opponent ? 'bg-white/5' : ''}`}
                                                                        >
                                                                            <td className="p-4 font-black text-lg text-white">{index + 1}</td>
                                                                            <td className="p-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="font-bold text-white">{team.name}</div>
                                                                                    {!team.is_opponent && (
                                                                                        <Badge className="bg-white/30 text-white border-0 text-xs">
                                                                                            Notre équipe
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            {isExpanded && (
                                                                                <>
                                                                                    <td className="p-4 text-center font-semibold text-white">{team.matches_played}</td>
                                                                                    <td className="p-4 text-center font-semibold text-white">{team.wins}</td>
                                                                                    <td className="p-4 text-center font-semibold text-white">{team.draws}</td>
                                                                                    <td className="p-4 text-center font-semibold text-white">{team.losses}</td>
                                                                                    <td className="p-4 text-center font-semibold text-white">{team.goals_for}</td>
                                                                                    <td className="p-4 text-center font-semibold text-white">{team.goals_against}</td>
                                                                                    <td className="p-4 text-center font-bold text-white">
                                                                                        {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                                                                                    </td>
                                                                                </>
                                                                            )}
                                                                            <td className="p-4 text-center font-black text-lg text-white bg-white/10">{team.points}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

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
                                            {seasons?.map((season) => (
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
                                            {seasons?.map((season) => (
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

                    {/* Create Player Modal */}
                    <Dialog open={createPlayerModalOpen} onOpenChange={setCreatePlayerModalOpen}>
                        <DialogContent className="bg-primary border-primary/20 text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-white text-2xl font-black">Nouvelle Joueuse</DialogTitle>
                                <DialogDescription className="text-white/80">
                                    Ajouter une nouvelle joueuse
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreatePlayer} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="player_first_name" className="text-white">Prénom *</Label>
                                        <Input
                                            id="player_first_name"
                                            value={createPlayerForm.data.first_name}
                                            onChange={(e) => createPlayerForm.setData('first_name', e.target.value)}
                                            required
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        />
                                        <InputError message={createPlayerForm.errors.first_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="player_last_name" className="text-white">Nom *</Label>
                                        <Input
                                            id="player_last_name"
                                            value={createPlayerForm.data.last_name}
                                            onChange={(e) => createPlayerForm.setData('last_name', e.target.value)}
                                            required
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        />
                                        <InputError message={createPlayerForm.errors.last_name} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="player_date_of_birth" className="text-white">Date de naissance *</Label>
                                        <Input
                                            id="player_date_of_birth"
                                            type="date"
                                            value={createPlayerForm.data.date_of_birth}
                                            onChange={(e) => createPlayerForm.setData('date_of_birth', e.target.value)}
                                            required
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                        <InputError message={createPlayerForm.errors.date_of_birth} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="player_position" className="text-white">Poste</Label>
                                        <Select value={createPlayerForm.data.position || 'none'} onValueChange={(value) => createPlayerForm.setData('position', value === 'none' ? '' : value)}>
                                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                                        <InputError message={createPlayerForm.errors.position} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="player_jersey_number" className="text-white">Numéro de maillot</Label>
                                        <Input
                                            id="player_jersey_number"
                                            value={createPlayerForm.data.jersey_number}
                                            onChange={(e) => createPlayerForm.setData('jersey_number', e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        />
                                        <InputError message={createPlayerForm.errors.jersey_number} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="player_team_id" className="text-white">Équipe</Label>
                                    <Select value={createPlayerForm.data.team_id || 'none'} onValueChange={(value) => createPlayerForm.setData('team_id', value === 'none' ? '' : value)}>
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                            <SelectValue placeholder="Sélectionner une équipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucune équipe</SelectItem>
                                            {teams?.data?.map((team) => (
                                                <SelectItem key={team.id} value={team.id.toString()}>
                                                    {team.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={createPlayerForm.errors.team_id} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="player_email" className="text-white">Email</Label>
                                        <Input
                                            id="player_email"
                                            type="email"
                                            value={createPlayerForm.data.email}
                                            onChange={(e) => createPlayerForm.setData('email', e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        />
                                        <InputError message={createPlayerForm.errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="player_phone" className="text-white">Téléphone</Label>
                                        <Input
                                            id="player_phone"
                                            value={createPlayerForm.data.phone}
                                            onChange={(e) => createPlayerForm.setData('phone', e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        />
                                        <InputError message={createPlayerForm.errors.phone} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="player_address" className="text-white">Adresse</Label>
                                    <Input
                                        id="player_address"
                                        value={createPlayerForm.data.address}
                                        onChange={(e) => createPlayerForm.setData('address', e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                    />
                                    <InputError message={createPlayerForm.errors.address} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="player_photo" className="text-white">Photo</Label>
                                    <Input
                                        id="player_photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => createPlayerForm.setData('photo', e.target.files[0])}
                                        className="bg-white/10 border-white/20 text-white"
                                    />
                                    <InputError message={createPlayerForm.errors.photo} />
                                </div>

                                <div className="border-t border-white/20 pt-4">
                                    <h3 className="font-semibold mb-4 text-white">Informations tuteur légal (pour mineures)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="player_guardian_name" className="text-white">Nom du tuteur</Label>
                                            <Input
                                                id="player_guardian_name"
                                                value={createPlayerForm.data.guardian_name}
                                                onChange={(e) => createPlayerForm.setData('guardian_name', e.target.value)}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                            />
                                            <InputError message={createPlayerForm.errors.guardian_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="player_guardian_relationship" className="text-white">Relation</Label>
                                            <Input
                                                id="player_guardian_relationship"
                                                value={createPlayerForm.data.guardian_relationship}
                                                onChange={(e) => createPlayerForm.setData('guardian_relationship', e.target.value)}
                                                placeholder="Parent, tuteur, etc."
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                            />
                                            <InputError message={createPlayerForm.errors.guardian_relationship} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="player_guardian_phone" className="text-white">Téléphone tuteur</Label>
                                            <Input
                                                id="player_guardian_phone"
                                                value={createPlayerForm.data.guardian_phone}
                                                onChange={(e) => createPlayerForm.setData('guardian_phone', e.target.value)}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                            />
                                            <InputError message={createPlayerForm.errors.guardian_phone} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="player_guardian_email" className="text-white">Email tuteur</Label>
                                            <Input
                                                id="player_guardian_email"
                                                type="email"
                                                value={createPlayerForm.data.guardian_email}
                                                onChange={(e) => createPlayerForm.setData('guardian_email', e.target.value)}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                            />
                                            <InputError message={createPlayerForm.errors.guardian_email} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="player_is_active"
                                        checked={createPlayerForm.data.is_active}
                                        onCheckedChange={(checked) => createPlayerForm.setData('is_active', checked)}
                                    />
                                    <Label htmlFor="player_is_active" className="cursor-pointer text-white">
                                        Joueuse active
                                    </Label>
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCreatePlayerModalOpen(false)}
                                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                    >
                                        Annuler
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={createPlayerForm.processing}
                                        className="bg-white text-primary hover:bg-white/90"
                                    >
                                        {createPlayerForm.processing ? 'Création...' : 'Créer la joueuse'}
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
