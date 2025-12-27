import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TeamsIndex({ teams }) {
    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
            router.delete(`/admin/teams/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Équipes" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Équipes</h1>
                        <p className="text-gray-600 mt-1">Gestion des équipes</p>
                    </div>
                    <Link href="/admin/teams/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Équipe
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {teams.data.map((team) => (
                        <Card key={team.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{team.name}</CardTitle>
                                        <CardDescription>
                                            {team.category} - {team.season?.name || 'Sans saison'}
                                        </CardDescription>
                                    </div>
                                    {team.is_active && (
                                        <Badge variant="default" className="bg-green-500">Active</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-sm text-gray-500">
                                        {team.players_count} joueuse(s)
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/teams/${team.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Voir
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/teams/${team.id}/edit`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Modifier
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleDelete(team.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {teams.data.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-gray-500">Aucune équipe créée</p>
                            <Link href="/admin/teams/create" className="mt-4 inline-block">
                                <Button>Créer la première équipe</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}


