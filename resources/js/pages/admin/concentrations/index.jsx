import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Tent, ChevronRight } from 'lucide-react';

export default function ConcentrationsIndex({ concentrations = { data: [] }, teams = [], seasons = [], objectives = {} }) {
    const list = concentrations?.data ?? [];
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '–';

    return (
        <AdminLayout>
            <Head title="Concentrations" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Concentrations</h1>
                        <p className="text-muted-foreground mt-1">Camps multi-jours</p>
                    </div>
                    <Link href="/admin/concentrations/create">
                        <Button><Plus className="w-4 h-4 mr-2" />Nouvelle concentration</Button>
                    </Link>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {list.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">Aucune concentration.</div>
                        ) : (
                            <ul className="divide-y">
                                {list.map((c) => (
                                    <li key={c.id}>
                                        <Link href={`/admin/concentrations/${c.id}`} className="flex flex-wrap items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Tent className="w-5 h-5 text-primary" />
                                                    <span className="font-semibold">{c.name}</span>
                                                    <Badge variant="outline">{c.duration_days} jour{c.duration_days > 1 ? 's' : ''}</Badge>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(c.start_date)} → {formatDate(c.end_date)}</span>
                                                    {c.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{c.location}</span>}
                                                    {c.teams?.length > 0 && <span>{c.teams.map(t => t.category).join(', ')}</span>}
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
                            <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url)}>
                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
