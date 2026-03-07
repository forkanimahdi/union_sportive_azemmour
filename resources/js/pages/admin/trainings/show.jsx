import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Dumbbell, Link as LinkIcon } from 'lucide-react';

const statusLabels = { present: 'Présent', absent: 'Absent', late: 'Retard', excused: 'Excusé' };

export default function TrainingShow({ training, players = [], sessionTypes = {} }) {
    const [saving, setSaving] = useState(false);
    const initialAttendances = players.map((p) => ({
        player_id: p.id,
        status: p.attendance?.status ?? 'present',
        arrival_time: p.attendance?.arrival_time ?? '',
        notes: p.attendance?.notes ?? '',
    }));
    const { data, setData, post, processing } = useForm({ attendances: initialAttendances });

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '–';
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '–';

    const updateAttendance = (playerId, field, value) => {
        setData('attendances', data.attendances.map((a) =>
            a.player_id === playerId ? { ...a, [field]: value } : a
        ));
    };

    const handleSaveAttendance = (e) => {
        e.preventDefault();
        setSaving(true);
        post(`/admin/trainings/${training.id}/attendance`, { onFinish: () => setSaving(false) });
    };

    return (
        <AdminLayout>
            <Head title={`Séance ${formatDate(training.scheduled_at)}`} />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-3xl font-black uppercase italic text-dark">Séance · {training.team?.name}</h1>
                            <Badge variant={training.status === 'scheduled' ? 'default' : training.status === 'completed' ? 'secondary' : 'outline'}>
                                {training.status === 'scheduled' ? 'Programmée' : training.status === 'completed' ? 'Réalisée' : 'Annulée'}
                            </Badge>
                            {training.concentration && (
                                <Link href={`/admin/concentrations/${training.concentration.id}`}>
                                    <Badge variant="outline" className="cursor-pointer"><LinkIcon className="w-3 h-3 mr-1" />{training.concentration.name}</Badge>
                                </Link>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-1">{formatDate(training.scheduled_at)} · {formatTime(training.scheduled_at)}</p>
                    </div>
                    {!training.concentration && (
                        <Link href={`/admin/trainings/${training.id}/edit`}><Button variant="outline">Modifier</Button></Link>
                    )}
                </div>

                <Card>
                    <CardHeader><CardTitle>Détails</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-muted-foreground" /><span>{formatDate(training.scheduled_at)} à {formatTime(training.scheduled_at)}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-muted-foreground" /><span>{training.location}</span></div>
                        {training.coach && <div className="flex items-center gap-2"><User className="w-5 h-5 text-muted-foreground" /><span>{training.coach.name}</span></div>}
                        {training.session_type && sessionTypes[training.session_type] && (
                            <div className="flex items-center gap-2"><Dumbbell className="w-5 h-5 text-muted-foreground" /><span>{sessionTypes[training.session_type]}{training.duration_minutes ? ` (${training.duration_minutes} min)` : ''}</span></div>
                        )}
                        {training.objectives && <p className="text-sm text-muted-foreground pt-2 border-t">{training.objectives}</p>}
                        {training.coach_notes && <p className="text-sm text-muted-foreground">{training.coach_notes}</p>}
                    </CardContent>
                </Card>

                {players.length > 0 && (
                    <Card>
                        <CardHeader><CardTitle>Présences</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveAttendance} className="space-y-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b"><th className="text-left py-2">N°</th><th className="text-left py-2">Joueuse</th><th className="text-left py-2">Statut</th><th className="text-left py-2">Heure</th><th className="text-left py-2">Notes</th></tr>
                                        </thead>
                                        <tbody>
                                            {players.map((p) => {
                                                const att = data.attendances.find((a) => a.player_id === p.id) || {};
                                                return (
                                                    <tr key={p.id} className="border-b border-border/50">
                                                        <td className="py-2 font-medium">{p.number}</td>
                                                        <td className="py-2">{p.first_name} {p.last_name}</td>
                                                        <td className="py-2">
                                                            <Select value={att.status || 'present'} onValueChange={(v) => updateAttendance(p.id, 'status', v)}>
                                                                <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                        <td className="py-2"><Input type="time" className="w-24 h-9" value={att.arrival_time || ''} onChange={(e) => updateAttendance(p.id, 'arrival_time', e.target.value)} /></td>
                                                        <td className="py-2"><Input className="max-w-[160px] h-9" placeholder="Note" value={att.notes || ''} onChange={(e) => updateAttendance(p.id, 'notes', e.target.value)} /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <Button type="submit" disabled={processing || saving}>{saving || processing ? 'Enregistrement...' : 'Enregistrer les présences'}</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Link href="/admin/trainings"><Button variant="outline">← Liste des entraînements</Button></Link>
            </div>
        </AdminLayout>
    );
}
