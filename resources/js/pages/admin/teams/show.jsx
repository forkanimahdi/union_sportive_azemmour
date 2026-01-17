import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
    ArrowLeft, Edit, Users, Trophy, Calendar, 
    Baby, UserCircle2, TrendingUp, Search, Plus, X, UserPlus
} from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';

const categoryIcons = {
    'U13': Baby,
    'U15': UserCircle2,
    'U17': TrendingUp,
    'Senior': Trophy,
};

export default function TeamsShow({ team, availablePlayers = [] }) {
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [playerToRemove, setPlayerToRemove] = useState(null);

    const { data, setData, post, processing } = useForm({
        player_id: '',
    });

    const handleAssignPlayer = () => {
        if (!selectedPlayerId) return;
        
        setData('player_id', selectedPlayerId);
        post(`/admin/teams/${team.id}/assign-player`, {
            onSuccess: () => {
                setAssignDialogOpen(false);
                setSelectedPlayerId('');
                setData('player_id', '');
            },
        });
    };

    const handleRemovePlayer = (playerId) => {
        setPlayerToRemove(playerId);
        setDeleteModalOpen(true);
    };

    const confirmRemovePlayer = () => {
        if (playerToRemove) {
            router.delete(`/admin/teams/${team.id}/players/${playerToRemove}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setPlayerToRemove(null);
                }
            });
        }
    };

    const filteredAvailablePlayers = availablePlayers.filter(p => 
        !team.players?.some(tp => tp.id === p.id) &&
        (searchTerm === '' || 
         `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const IconComponent = categoryIcons[team.category] || categoryIcons['Senior'];

    return (
        <AdminLayout>
            <Head title={team.name} />
            <div className="min-h-screen bg-primary/80">
                <div className="space-y-6 p-6">
                    {/* Hero Header - FPL Style */}
                    <div className="bg-primary rounded-xl p-8 text-white shadow-xl">
                        <Link href="/admin/teams">
                            <Button variant="ghost" size="sm" className="mb-6 text-white hover:bg-white/20">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div className="flex items-start justify-between flex-wrap gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                                        <IconComponent className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-black uppercase italic text-white">
                                            {team.name}
                                        </h1>
                                        <div className="flex items-center gap-3 mt-3">
                                            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                                                {team.category}
                                            </Badge>
                                            {team.is_active && (
                                                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {team.season && (
                                    <div className="flex items-center gap-2 text-white/90">
                                        <Calendar className="w-5 h-5" />
                                        <span>{team.season.name}</span>
                                    </div>
                                )}
                                {team.description && (
                                    <p className="mt-4 text-white/80 leading-relaxed max-w-2xl">
                                        {team.description}
                                    </p>
                                )}
                            </div>
                            <Link href={`/admin/teams/${team.id}/edit`}>
                                <Button className="bg-white text-primary hover:bg-white/95">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Modifier
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Tabs - FPL Style */}
                    <Tabs defaultValue="players" className="space-y-6">
                        <TabsList className="bg-primary/80 border-primary/20 p-1 h-auto">
                            <TabsTrigger 
                                value="players" 
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                                <Users className="w-4 h-4" />
                                Joueuses ({team.players?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger 
                                value="info" 
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                                <Trophy className="w-4 h-4" />
                                Informations
                            </TabsTrigger>
                        </TabsList>

                        {/* Players Tab */}
                        <TabsContent value="players" className="space-y-4">
                            <Card className="bg-primary/80 border-primary/20">
                                <CardHeader className="bg-primary text-white">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Joueuses de l'équipe
                                        </CardTitle>
                                        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="bg-white text-primary hover:bg-white/90">
                                                    <UserPlus className="w-4 h-4 mr-2" />
                                                    Assigner une joueuse
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md bg-primary border-primary/20 text-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-white">Assigner une joueuse</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 mt-4">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                                                        <Input
                                                            placeholder="Rechercher une joueuse..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                                        />
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto">
                                                        {filteredAvailablePlayers.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {filteredAvailablePlayers.map((player) => (
                                                                    <div
                                                                        key={player.id}
                                                                        onClick={() => setSelectedPlayerId(player.id)}
                                                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                                            selectedPlayerId === player.id
                                                                                ? 'border-white bg-white/20'
                                                                                : 'border-white/20 hover:bg-white/10'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <p className="font-medium text-white">
                                                                                    {player.first_name} {player.last_name}
                                                                                </p>
                                                                                {player.position && (
                                                                                    <p className="text-sm text-white/70 capitalize">
                                                                                        {player.position}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            {selectedPlayerId === player.id && (
                                                                                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                                                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-center text-white/70 py-4">
                                                                Aucune joueuse disponible
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-end gap-2 pt-4 border-t border-white/20">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setAssignDialogOpen(false)}
                                                            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                                        >
                                                            Annuler
                                                        </Button>
                                                        <Button
                                                            onClick={handleAssignPlayer}
                                                            disabled={!selectedPlayerId || processing}
                                                            className="bg-white text-primary hover:bg-white/90"
                                                        >
                                                            {processing ? 'Assignation...' : 'Assigner'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardHeader>
                                <CardContent className="bg-white p-6">
                                    {team.players && team.players.length > 0 ? (
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {team.players.map((player) => (
                                                <div
                                                    key={player.id}
                                                    className="p-4 rounded-xl border-2 border-[#662682]/20 bg-[#662682]/80 hover:bg-[#662682] transition-all text-white"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-bold text-white">
                                                                    {player.first_name} {player.last_name}
                                                                </h4>
                                                            </div>
                                                            {player.position && (
                                                                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                                                                    {player.position}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemovePlayer(player.id)}
                                                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t border-white/20">
                                                        <Link href={`/admin/players/${player.id}`}>
                                                            <Button variant="outline" size="sm" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                                                                Voir le profil
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                            <p className="text-muted-foreground mb-4">Aucune joueuse assignée</p>
                                            <Button
                                                onClick={() => setAssignDialogOpen(true)}
                                                className="bg-primary hover:bg-primary/90 text-white"
                                            >
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Assigner une joueuse
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Info Tab */}
                        <TabsContent value="info" className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="bg-primary/80 border-primary/20">
                                    <CardHeader className="bg-primary text-white">
                                        <CardTitle className="text-white">Informations Générales</CardTitle>
                                    </CardHeader>
                                    <CardContent className="bg-white space-y-4 pt-6">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">Catégorie</p>
                                            <Badge className="bg-primary/80 text-white border-primary/20">
                                                <IconComponent className="w-3 h-3 mr-1" />
                                                {team.category}
                                            </Badge>
                                        </div>
                                        {team.season && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Saison</p>
                                                <p className="font-semibold">{team.season.name}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">Statut</p>
                                            <Badge className={team.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                                                {team.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">Nombre de joueuses</p>
                                            <p className="text-3xl font-black text-primary">
                                                {team.players?.length || 0}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {team.staff && team.staff.length > 0 && (
                                    <Card className="bg-primary/80 border-primary/20">
                                        <CardHeader className="bg-primary text-white">
                                            <CardTitle className="text-white">Staff</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white p-6">
                                            <div className="space-y-3">
                                                {team.staff.map((member) => (
                                                    <div
                                                        key={member.id}
                                                        className="p-4 rounded-xl border-2 border-[#662682]/20 bg-[#662682]/80 text-white"
                                                    >
                                                        <p className="font-semibold">
                                                            {member.first_name} {member.last_name}
                                                        </p>
                                                        <p className="text-sm text-white/80 capitalize">
                                                            {member.role}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Delete Modal for Player Removal */}
                    <DeleteModal
                        open={deleteModalOpen}
                        onOpenChange={setDeleteModalOpen}
                        onConfirm={confirmRemovePlayer}
                        title="Retirer la joueuse"
                        description="Êtes-vous sûr de vouloir retirer cette joueuse de l'équipe ?"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}








