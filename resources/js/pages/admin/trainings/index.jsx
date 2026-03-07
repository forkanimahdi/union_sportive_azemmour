import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Users, Dumbbell, Tent, ChevronRight } from 'lucide-react';

export default function TrainingsIndex({
    trainings = { data: [] },
    concentrations = { data: [] },
    teams = [],
    seasons = [],
    sessionTypes = {},
}) {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '–';
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '–';

    const sessions = trainings?.data ?? [];
    const concList = concentrations?.data ?? [];

    return (
        <AdminLayout>
            <Head title="Entraînements" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Entraînements</h1>
                        <p className="text-muted-foreground mt-1">Séances classiques et concentrations</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/trainings/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvelle séance
                            </Button>
                        </Link>
                        <Link href="/admin/concentrations/create">
                            <Button variant="outline">
                                <Tent className="w-4 h-4 mr-2" />
                                Nouvelle concentration
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="sessions" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="sessions">
                            Séances classiques
                            <Badge variant="secondary" className="ml-2">{sessions.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="concentrations">
                            Concentrations
                            <Badge variant="secondary" className="ml-2">{concList.length}</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sessions" className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes</SelectItem>
                                    {[...new Set(teams.map(t => t.category))].map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="scheduled">Programmée</SelectItem>
                                    <SelectItem value="completed">Réalisée</SelectItem>
                                    <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.get('/admin/trainings', { category: categoryFilter === 'all' ? undefined : categoryFilter, status: statusFilter === 'all' ? undefined : statusFilter })}
                            >
                                Filtrer
                            </Button>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                {sessions.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Aucune séance. Créez une séance classique ou une concentration.
                                    </div>
                                ) : (
                                    <ul className="divide-y">
                                        {sessions.map((t) => (
                                            <li key={t.id}>
                                                <Link
                                                    href={`/admin/trainings/${t.id}`}
                                                    className="flex flex-wrap items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-semibold">
                                                                {formatDate(t.scheduled_at)} · {formatTime(t.scheduled_at)}
                                                            </span>
                                                            <Badge variant={t.status === 'scheduled' ? 'default' : t.status === 'completed' ? 'secondary' : 'outline'}>
                                                                {t.status === 'scheduled' ? 'Programmée' : t.status === 'completed' ? 'Réalisée' : 'Annulée'}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Users className="w-4 h-4" />
                                                                {t.team?.name} ({t.team?.category})
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {t.location}
                                                            </span>
                                                            {t.session_type && sessionTypes[t.session_type] && (
                                                                <span className="flex items-center gap-1">
                                                                    <Dumbbell className="w-4 h-4" />
                                                                    {sessionTypes[t.session_type]}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                        {trainings?.links && (
                            <div className="flex justify-center gap-2">
                                {trainings.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                    >
                                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="concentrations" className="space-y-4">
                        <Card>
                            <CardContent className="p-0">
                                {concList.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Aucune concentration. Créez un camp multi-jours.
                                    </div>
                                ) : (
                                    <ul className="divide-y">
                                        {concList.map((c) => (
                                            <li key={c.id}>
                                                <Link
                                                    href={`/admin/concentrations/${c.id}`}
                                                    className="flex flex-wrap items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Tent className="w-5 h-5 text-primary" />
                                                            <span className="font-semibold">{c.name}</span>
                                                            <Badge variant="outline">{c.duration_days} jour{c.duration_days > 1 ? 's' : ''}</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {formatDate(c.start_date)} → {formatDate(c.end_date)}
                                                            </span>
                                                            {c.location && (
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    {c.location}
                                                                </span>
                                                            )}
                                                            {c.teams?.length > 0 && (
                                                                <span>
                                                                    {c.teams.map(t => t.category).join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                        {concentrations?.links && (
                            <div className="flex justify-center gap-2">
                                {concentrations.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                    >
                                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
