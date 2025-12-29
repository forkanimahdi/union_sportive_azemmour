import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
    ArrowLeft, Edit, Users, Trophy, Calendar, 
    Baby, UserCircle2, TrendingUp, Search, Plus, X, UserPlus
} from 'lucide-react';

// Category icons mapping
const categoryIcons = {
    'U13': Baby,
    'U15': UserCircle2,
    'U17': TrendingUp,
    'Senior': Trophy,
};

const categoryColors = {
    'U13': 'bg-blue-100 text-blue-600 border-blue-200',
    'U15': 'bg-purple-100 text-purple-600 border-purple-200',
    'U17': 'bg-green-100 text-green-600 border-green-200',
    'Senior': 'bg-primary/10 text-primary border-primary/20',
};

export default function TeamsShow({ team, availablePlayers = [] }) {
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { post, processing } = useForm({
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
    const categoryColor = categoryColors[team.category] || categoryColors['Senior'];

    return (
        <AdminLayout>
            <Head title={team.name} />
            <div className="space-y-6">
                {/* Header */}
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                    <div className="relative">
                        <Link href="/admin/teams">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${categoryColor}`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black uppercase italic text-dark">{team.name}</h1>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className={categoryColor}>
                                                {team.category}
                                            </Badge>
                                            {team.is_active && (
                                                <Badge variant="default" className="bg-green-500/90 text-white">
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {team.season && (
                                    <p className="text-muted-foreground flex items-center gap-2 mt-2">
                                        <Calendar className="w-4 h-4" />
                                        {team.season.name}
                                    </p>
                                )}
                            </div>
                            <Link href={`/admin/teams/${team.id}/edit`}>
                                <Button>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Modifier
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {team.description && (
                    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">{team.description}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs */}
                <Tabs defaultValue="players" className="space-y-4">
                    <TabsList className="bg-muted/50 backdrop-blur-sm">
                        <TabsTrigger value="players" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Joueuses ({team.players?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="info" className="flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Informations
                        </TabsTrigger>
                    </TabsList>

                    {/* Players Tab */}
                    <TabsContent value="players" className="space-y-4">
                        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Joueuses de l'équipe
                                    </CardTitle>
                                    <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-primary hover:bg-primary/90">
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Assigner une joueuse
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Assigner une joueuse</DialogTitle>
                                                <DialogDescription>
                                                    Sélectionnez une joueuse à ajouter à cette équipe
                                                </DialogDescription>
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
                                                        className="bg-primary hover:bg-primary/90"
                                                    >
                                                        {processing ? 'Assignation...' : 'Assigner'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {team.players && team.players.length > 0 ? (
                                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                        {team.players.map((player) => (
                                            <div
                                                key={player.id}
                                                className="p-4 rounded-lg border border-border/50 bg-white/50 backdrop-blur-sm hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-foreground">
                                                                {player.first_name} {player.last_name}
                                                            </h4>
                                                        </div>
                                                        {player.position && (
                                                            <Badge variant="outline" className="text-xs">
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
                                                <div className="mt-3 pt-3 border-t border-border/30">
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
                                            className="bg-primary hover:bg-primary/90"
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
                            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                <CardHeader>
                                    <CardTitle>Informations Générales</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Catégorie</p>
                                        <Badge variant="outline" className={categoryColor}>
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
                                        <Badge variant={team.is_active ? 'default' : 'secondary'}>
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
                                <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                                    <CardHeader>
                                        <CardTitle>Staff</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {team.staff.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="p-2 rounded-lg border border-border/30"
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
