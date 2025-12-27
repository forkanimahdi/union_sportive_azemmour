import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Shield, Calendar } from 'lucide-react';
import PlayerCard from '../../../components/admin/PlayerCard';
import StatusBadge from '../../../components/admin/StatusBadge';

export default function PlayersShow({ player }) {
    const isMinor = player.is_minor;

    return (
        <AdminLayout>
            <Head title={`${player.first_name} ${player.last_name}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/players">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black uppercase italic text-dark">
                                {player.first_name} {player.last_name}
                            </h1>
                            {isMinor && (
                                <Badge variant="outline" className="bg-yellow-100">Mineure</Badge>
                            )}
                            {player.can_play ? (
                                <StatusBadge status="active" type="player" />
                            ) : (
                                <StatusBadge status="unavailable" type="player" />
                            )}
                        </div>
                        {player.team && (
                            <p className="text-gray-600 mt-1">{player.team.name}</p>
                        )}
                    </div>
                    <Link href={`/admin/players/${player.id}/edit`}>
                        <Button>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Date de naissance</p>
                                <p className="font-medium">{player.date_of_birth}</p>
                            </div>
                            {player.position && (
                                <div>
                                    <p className="text-sm text-gray-500">Poste</p>
                                    <p className="font-medium capitalize">{player.position}</p>
                                </div>
                            )}
                            {player.jersey_number && (
                                <div>
                                    <p className="text-sm text-gray-500">Numéro de maillot</p>
                                    <p className="font-medium">{player.jersey_number}</p>
                                </div>
                            )}
                            {player.email && (
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{player.email}</p>
                                </div>
                            )}
                            {player.phone && (
                                <div>
                                    <p className="text-sm text-gray-500">Téléphone</p>
                                    <p className="font-medium">{player.phone}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {player.injuries && player.injuries.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Blessures
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {player.injuries.map((injury) => (
                                        <div key={injury.id} className="p-2 border rounded">
                                            <p className="font-medium">{injury.type}</p>
                                            <StatusBadge status={injury.status} type="injury" />
                                            {!injury.fit_to_play && (
                                                <Badge variant="destructive" className="ml-2">Inapte</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {player.suspensions && player.suspensions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Suspensions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {player.suspensions.map((suspension) => (
                                        <div key={suspension.id} className="p-2 border rounded">
                                            <p className="font-medium">Suspendue jusqu'au {suspension.suspension_end_date}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}


