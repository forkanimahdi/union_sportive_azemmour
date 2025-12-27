import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Users, Trophy } from 'lucide-react';

export default function SeasonsShow({ season }) {
    return (
        <AdminLayout>
            <Head title={season.name} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/seasons">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black uppercase italic text-dark">{season.name}</h1>
                            {season.is_active && (
                                <Badge variant="default" className="bg-green-500">Active</Badge>
                            )}
                        </div>
                        <p className="text-gray-600 mt-1">
                            {season.start_date} - {season.end_date}
                        </p>
                    </div>
                    <Link href={`/admin/seasons/${season.id}/edit`}>
                        <Button>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>

                {season.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{season.description}</p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Équipes ({season.teams.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {season.teams.length > 0 ? (
                                <div className="space-y-2">
                                    {season.teams.map((team) => (
                                        <div key={team.id} className="flex items-center justify-between p-2 border rounded">
                                            <div>
                                                <p className="font-medium">{team.name}</p>
                                                <p className="text-sm text-gray-500">{team.category}</p>
                                            </div>
                                            <Link href={`/admin/teams/${team.id}`}>
                                                <Button variant="ghost" size="sm">Voir</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Aucune équipe</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5" />
                                Compétitions ({season.competitions.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {season.competitions.length > 0 ? (
                                <div className="space-y-2">
                                    {season.competitions.map((comp) => (
                                        <div key={comp.id} className="p-2 border rounded">
                                            <p className="font-medium">{comp.name}</p>
                                            <p className="text-sm text-gray-500 capitalize">{comp.type}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Aucune compétition</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

