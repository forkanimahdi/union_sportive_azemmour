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
        if (confirm('Voulez-vous retirer cette joueuse de l\'équipe ?')) {
            router.delete(`/admin/teams/${team.id}/players/${playerId}`);
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
            <div className="space-y-6">
                {/* Header with Alpha Background */}
                <div className="relative overflow-hidden rounded-xl bg-primary text-white p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary"></div>
                    <div className="relative">
                        <Link href="/admin/teams">
                            <Button variant="ghost" size="sm" className="mb-4 text-white hover:bg-white/20">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 rounded-lg bg-white/20">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black uppercase italic text-white">{team.name}</h1>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge className="bg-white/20 text-white border-white/30">
                                                {team.category}
                                            </Badge>
                                            {team.is_active && (
                                                <Badge className="bg-green-500 text-white">
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {team.season && (
                                    <p className="text-white/90 flex items-center gap-2 mt-2">
                                        <Calendar className="w-4 h-4" />
                                        {team.season.name}
                                    </p>
                                )}
                            </div>
                            <Link href={`/admin/teams/${team.id}/edit`}>
                                <Button className="bg-white text-primary hover:bg-white/90">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Modifier
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Description with Alpha Background */}
                {team.description && (
                    <Card className="bg-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-white">Description</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white">
                            <p className="text-muted-foreground leading-relaxed">{team.description}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs */}
                <Tabs defaultValue="players" className="space-y-4">
                    <TabsList className="bg-primary/10 border-primary/20">
                        <TabsTrigger value="players" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                            <Users className="w-4 h-4" />
                            Joueuses ({team.players?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="info" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                            <Trophy className="w-4 h-4" />
                            Informations
                        </TabsTrigger>
                    </TabsList>

                    {/* Players Tab */}
                    <TabsContent value="players" className="space-y-4">
                        <Card className="bg-primary/10 border-primary/20">
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
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Assigner une joueuse</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 mt-4">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Rechercher une joueuse..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-10"
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
                                                                            ? 'border-primary bg-primary/5'
                                                                            : 'border-border hover:bg-muted/50'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {player.first_name} {player.last_name}
                                                                            </p>
                                                                            {player.position && (
                                                                                <p className="text-sm text-muted-foreground capitalize">
                                                                                    {player.position}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        {selectedPlayerId === player.id && (
                                                                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-center text-muted-foreground py-4">
                                                            Aucune joueuse disponible
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex justify-end gap-2 pt-4 border-t">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setAssignDialogOpen(false)}
                                                    >
                                                        Annuler
                                                    </Button>
                                                    <Button
                                                        onClick={handleAssignPlayer}
                                                        disabled={!selectedPlayerId || processing}
                                                        className="bg-primary hover:bg-primary/90 text-white"
                                                    >
                                                        {processing ? 'Assignation...' : 'Assigner'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent className="bg-white">
                                {team.players && team.players.length > 0 ? (
                                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                        {team.players.map((player) => (
                                            <div
                                                key={player.id}
                                                className="p-4 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-foreground">
                                                                {player.first_name} {player.last_name}
                                                            </h4>
                                                        </div>
                                                        {player.position && (
                                                            <Badge variant="outline" className="text-xs bg-white">
                                                                {player.position}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemovePlayer(player.id)}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-primary/20">
                                                    <Link href={`/admin/players/${player.id}`}>
                                                        <Button variant="outline" size="sm" className="w-full">
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
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="bg-primary/10 border-primary/20">
                                <CardHeader className="bg-primary text-white">
                                    <CardTitle className="text-white">Informations Générales</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white space-y-3 pt-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Catégorie</p>
                                        <Badge className="mt-1 bg-primary/20 text-primary border-primary/30">
                                            <IconComponent className="w-3 h-3 mr-1" />
                                            {team.category}
                                        </Badge>
                                    </div>
                                    {team.season && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Saison</p>
                                            <p className="font-medium">{team.season.name}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-muted-foreground">Statut</p>
                                        <Badge className={team.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                                            {team.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nombre de joueuses</p>
                                        <p className="text-2xl font-bold text-primary">
                                            {team.players?.length || 0}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {team.staff && team.staff.length > 0 && (
                                <Card className="bg-primary/10 border-primary/20">
                                    <CardHeader className="bg-primary text-white">
                                        <CardTitle className="text-white">Staff</CardTitle>
                                    </CardHeader>
                                    <CardContent className="bg-white">
                                        <div className="space-y-2">
                                            {team.staff.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="p-3 rounded-lg border border-primary/20 bg-primary/5"
                                                >
                                                    <p className="font-medium">
                                                        {member.first_name} {member.last_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground capitalize">
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
            </div>
        </AdminLayout>
    );
}
