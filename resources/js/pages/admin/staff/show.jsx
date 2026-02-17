import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Users } from 'lucide-react';

export default function StaffShow({ staff, roleOptions = {} }) {
    return (
        <AdminLayout>
            <Head title={`${staff?.first_name} ${staff?.last_name}`} />
            <div className="space-y-6 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {staff?.image ? (
                            <img src={staff.image} alt="" className="w-16 h-16 rounded-full object-cover bg-muted" />
                        ) : null}
                        <div>
                            <Link href="/admin/staff" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Staff technique</Link>
                            <h1 className="text-2xl font-bold text-foreground">{staff?.first_name} {staff?.last_name}</h1>
                            <Badge variant="secondary" className="mt-1">{staff?.role_label ?? roleOptions[staff?.role] ?? staff?.role}</Badge>
                            {staff?.section_label && <Badge variant="outline" className="mt-1 ml-1">{staff.section_label}</Badge>}
                        </div>
                    </div>
                    <Link href={`/admin/staff/${staff?.id}/edit`}>
                        <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        {staff?.email && <p><span className="text-muted-foreground">Email :</span> {staff.email}</p>}
                        {staff?.phone && <p><span className="text-muted-foreground">Téléphone :</span> {staff.phone}</p>}
                        {staff?.specialization && <p><span className="text-muted-foreground">Spécialisation :</span> {staff.specialization}</p>}
                        {staff?.license_number && <p><span className="text-muted-foreground">N° licence :</span> {staff.license_number}</p>}
                        {staff?.hire_date && <p><span className="text-muted-foreground">Date d’embauche :</span> {staff.hire_date}</p>}
                        <p><span className="text-muted-foreground">Statut :</span> {staff?.is_active ? 'Actif' : 'Inactif'}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Équipes affectées
                        </CardTitle>
                        <CardDescription>Ce membre peut être affecté à une ou plusieurs équipes (ex. Coach Gardiennes pour toutes).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {staff?.teams?.length > 0 ? (
                            <ul className="space-y-2">
                                {staff.teams.map((t) => (
                                    <li key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <span className="font-medium">{t.name}</span>
                                        <Badge variant="outline">{t.pivot_role_label ?? t.pivot_role}</Badge>
                                        {t.season && <span className="text-muted-foreground text-sm">{t.season.name}</span>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">Aucune équipe affectée.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
