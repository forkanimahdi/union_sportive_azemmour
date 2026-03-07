import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Tent, Plus, Dumbbell, Utensils } from 'lucide-react';

export default function ConcentrationShow({
    concentration,
    playersForConvocation = [],
    staff = [],
    sessionTypes = {},
    timeSlots = {},
    convocationStatuses = {},
    mealTypes = {},
}) {
    const [dayIdForSession, setDayIdForSession] = useState(null);
    const [dayIdForMeal, setDayIdForMeal] = useState(null);

    const sessionForm = useForm({
        team_id: concentration.teams?.[0]?.id ?? '',
        coach_id: '',
        scheduled_at: '',
        location: '',
        session_type: '',
        duration_minutes: '',
        time_slot: 'matin',
        objectives: '',
        coach_notes: '',
    });
    const mealForm = useForm({ type: 'dejeuner', time_slot: 'apres_midi' });
    const convocationByPlayer = (concentration.convocation || []).reduce((acc, c) => { acc[c.player_id] = c; return acc; }, {});

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '–';
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '–';

    const handleAddSession = (e, dayId) => {
        e.preventDefault();
        sessionForm.post(`/admin/concentrations/${concentration.id}/days/${dayId}/sessions`, { onSuccess: () => setDayIdForSession(null) });
    };
    const handleAddMeal = (e, dayId) => {
        e.preventDefault();
        mealForm.post(`/admin/concentrations/${concentration.id}/days/${dayId}/meals`, { onSuccess: () => setDayIdForMeal(null) });
    };

    return (
        <AdminLayout>
            <Head title={concentration.name} />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Tent className="w-8 h-8 text-primary" />
                            <h1 className="text-3xl font-black uppercase italic text-dark">{concentration.name}</h1>
                            <Badge variant="outline">{concentration.duration_days} jour(s)</Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">
                            {formatDate(concentration.start_date)} → {formatDate(concentration.end_date)}
                            {concentration.location && ` · ${concentration.location}`}
                        </p>
                    </div>
                    <Link href={`/admin/concentrations/${concentration.id}/edit`}><Button variant="outline">Modifier</Button></Link>
                </div>

                <Card>
                    <CardHeader><CardTitle>Convocation</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Joueuses convoquées et statut. Utilisez la page pour gérer les présences.</p>
                        <ul className="space-y-2">
                            {(concentration.convocation || []).map((c) => (
                                <li key={c.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                                    <span className="font-medium">{c.player?.first_name} {c.player?.last_name}</span>
                                    <Badge variant="secondary">{convocationStatuses[c.status] ?? c.status}</Badge>
                                    {c.notes && <span className="text-sm text-muted-foreground">{c.notes}</span>}
                                </li>
                            ))}
                        </ul>
                        {concentration.convocation?.length === 0 && (
                            <p className="text-sm text-muted-foreground">Aucune joueuse convoquée. Associez des équipes et ajoutez des joueuses depuis l’effectif.</p>
                        )}
                    </CardContent>
                </Card>

                <div>
                    <h2 className="text-xl font-bold mb-4">Programme par jour</h2>
                    <div className="space-y-6">
                        {(concentration.days || []).map((day) => (
                            <Card key={day.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{formatDate(day.date)}</span>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => setDayIdForSession(dayIdForSession === day.id ? null : day.id)}>
                                                <Plus className="w-4 h-4 mr-1" /> Séance
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setDayIdForMeal(dayIdForMeal === day.id ? null : day.id)}>
                                                <Utensils className="w-4 h-4 mr-1" /> Repas
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {day.trainings?.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Séances</h3>
                                            <ul className="space-y-2">
                                                {day.trainings.map((t) => (
                                                    <li key={t.id} className="flex items-center gap-2">
                                                        <Dumbbell className="w-4 h-4" />
                                                        {formatTime(t.scheduled_at)} · {t.location} · {sessionTypes[t.session_type] ?? t.session_type} · {t.team?.name}
                                                        <Link href={`/admin/trainings/${t.id}`}><Button variant="ghost" size="sm">Voir</Button></Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {day.meals?.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Repas / Récup</h3>
                                            <ul className="flex flex-wrap gap-2">
                                                {day.meals.map((m) => (
                                                    <li key={m.id}><Badge variant="outline">{mealTypes[m.type] ?? m.type}</Badge></li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {dayIdForSession === day.id && (
                                        <form onSubmit={(e) => handleAddSession(e, day.id)} className="p-4 border rounded-lg space-y-3">
                                            <h4 className="font-medium">Ajouter une séance</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div><Label>Équipe</Label><Select value={sessionForm.data.team_id} onValueChange={(v) => sessionForm.setData('team_id', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{concentration.teams?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
                                                <div><Label>Coach</Label><Select value={sessionForm.data.coach_id} onValueChange={(v) => sessionForm.setData('coach_id', v)}><SelectTrigger><SelectValue placeholder="Optionnel" /></SelectTrigger><SelectContent>{staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
                                                <div><Label>Créneau</Label><Select value={sessionForm.data.time_slot} onValueChange={(v) => sessionForm.setData('time_slot', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(timeSlots).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
                                                <div><Label>Date et heure</Label><Input type="datetime-local" value={sessionForm.data.scheduled_at} onChange={(e) => sessionForm.setData('scheduled_at', e.target.value)} /></div>
                                                <div><Label>Lieu</Label><Input value={sessionForm.data.location} onChange={(e) => sessionForm.setData('location', e.target.value)} /></div>
                                                <div><Label>Type</Label><Select value={sessionForm.data.session_type} onValueChange={(v) => sessionForm.setData('session_type', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(sessionTypes).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
                                                <div><Label>Durée (min)</Label><Input type="number" value={sessionForm.data.duration_minutes} onChange={(e) => sessionForm.setData('duration_minutes', e.target.value)} /></div>
                                            </div>
                                            <Button type="submit" size="sm">Ajouter</Button>
                                        </form>
                                    )}
                                    {dayIdForMeal === day.id && (
                                        <form onSubmit={(e) => handleAddMeal(e, day.id)} className="p-4 border rounded-lg flex flex-wrap gap-3 items-end">
                                            <div><Label>Type</Label><Select value={mealForm.data.type} onValueChange={(v) => mealForm.setData('type', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(mealTypes).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
                                            <div><Label>Créneau</Label><Select value={mealForm.data.time_slot} onValueChange={(v) => mealForm.setData('time_slot', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(timeSlots).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
                                            <Button type="submit" size="sm">Ajouter</Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Link href="/admin/trainings"><Button variant="outline">← Entraînements</Button></Link>
            </div>
        </AdminLayout>
    );
}
