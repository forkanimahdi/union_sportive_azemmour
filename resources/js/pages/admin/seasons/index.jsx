import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SeasonsIndex({ seasons }) {
    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette saison ?')) {
            router.delete(`/admin/seasons/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Saisons" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Saisons</h1>
                        <p className="text-gray-600 mt-1">Gestion des saisons sportives</p>
                    </div>
                    <Link href="/admin/seasons/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Saison
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {seasons.data.map((season) => (
                        <Card key={season.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{season.name}</CardTitle>
                                        <CardDescription>
                                            {season.start_date} - {season.end_date}
                                        </CardDescription>
                                    </div>
                                    {season.is_active && (
                                        <Badge variant="default" className="bg-green-500">Active</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {season.description && (
                                        <p className="text-sm text-gray-600">{season.description}</p>
                                    )}
                                    <div className="text-sm text-gray-500">
                                        {season.teams_count} équipe(s)
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/seasons/${season.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Voir
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/seasons/${season.id}/edit`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Modifier
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleDelete(season.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {seasons.data.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-gray-500">Aucune saison créée</p>
                            <Link href="/admin/seasons/create" className="mt-4 inline-block">
                                <Button>Créer la première saison</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}

