import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import PlayerCard from '../../../components/admin/PlayerCard';
import { Badge } from '@/components/ui/badge';

export default function PlayersIndex({ players, teams, filters }) {
    const { data, setData, get } = useForm({
        search: filters?.search || '',
        team_id: filters?.team_id || '',
        position: filters?.position || '',
    });

    const handleFilter = () => {
        get('/admin/players', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette joueuse ?')) {
            router.delete(`/admin/players/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Joueuses" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Joueuses</h1>
                        <p className="text-gray-600 mt-1">Gestion des joueuses</p>
                    </div>
                    <Link href="/admin/players/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Joueuse
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Recherche</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Nom, prénom..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Équipe</Label>
                                <Select value={data.team_id} onValueChange={(value) => setData('team_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Toutes les équipes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Toutes les équipes</SelectItem>
                                        {teams.map((team) => (
                                            <SelectItem key={team.id} value={team.id.toString()}>
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Poste</Label>
                                <Select value={data.position} onValueChange={(value) => setData('position', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tous les postes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Tous les postes</SelectItem>
                                        <SelectItem value="gardien">Gardien</SelectItem>
                                        <SelectItem value="defenseur">Défenseur</SelectItem>
                                        <SelectItem value="milieu">Milieu</SelectItem>
                                        <SelectItem value="attaquant">Attaquant</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button onClick={handleFilter} className="w-full">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtrer
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Players Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {players.data.map((player) => (
                        <div key={player.id} className="relative">
                            <PlayerCard 
                                player={player}
                                onClick={() => router.visit(`/admin/players/${player.id}`)}
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                {!player.can_play && (
                                    <Badge variant="destructive" className="text-xs">
                                        Indisponible
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {players.data.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-gray-500">Aucune joueuse trouvée</p>
                            <Link href="/admin/players/create" className="mt-4 inline-block">
                                <Button>Ajouter une joueuse</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}

