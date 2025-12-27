import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Users } from 'lucide-react';

export default function TeamsShow({ team }) {
    return (
        <AdminLayout>
            <Head title={team.name} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/teams">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black uppercase italic text-dark">{team.name}</h1>
                            {team.is_active && (
                                <Badge variant="default" className="bg-green-500">Active</Badge>
                            )}
                        </div>
                        <p className="text-gray-600 mt-1">
                            {team.category} - {team.season?.name || 'Sans saison'}
                        </p>
                    </div>
                    <Link href={`/admin/teams/${team.id}/edit`}>
                        <Button>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>

                {team.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{team.description}</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Joueuses ({team.players.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {team.players.length > 0 ? (
                            <div className="space-y-2">
                                {team.players.map((player) => (
                                    <div key={player.id} className="flex items-center justify-between p-2 border rounded">
                                        <div>
                                            <p className="font-medium">{player.first_name} {player.last_name}</p>
                                            {player.position && (
                                                <p className="text-sm text-gray-500 capitalize">{player.position}</p>
                                            )}
                                        </div>
                                        <Link href={`/admin/players/${player.id}`}>
                                            <Button variant="ghost" size="sm">Voir</Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Aucune joueuse</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}


