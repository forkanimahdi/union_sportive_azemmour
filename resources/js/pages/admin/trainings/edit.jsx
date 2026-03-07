import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dumbbell } from 'lucide-react';

export default function TrainingEdit({ training, teams = [], staff = [], sessionTypes = {} }) {
    const { data, setData, put, processing, errors } = useForm({
        team_id: training.team_id || '',
        coach_id: training.coach_id || '',
        scheduled_at: training.scheduled_at || '',
        location: training.location || '',
        session_type: training.session_type || '',
        duration_minutes: training.duration_minutes || '',
        objectives: training.objectives || '',
        coach_notes: training.coach_notes || '',
        status: training.status || 'scheduled',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/trainings/${training.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Modifier la séance" />
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Dumbbell className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Modifier la séance</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de la séance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Équipe *</Label>
                                    <Select value={data.team_id} onValueChange={(v) => setData('team_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir une équipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teams.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>{t.name} ({t.category})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.team_id && <p className="text-sm text-destructive">{errors.team_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Coach responsable</Label>
                                    <Select value={data.coach_id} onValueChange={(v) => setData('coach_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir un coach" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {staff.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Date et heure *</Label>
                                    <Input
                                        type="datetime-local"
                                        value={data.scheduled_at}
                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                    />
                                    {errors.scheduled_at && <p className="text-sm text-destructive">{errors.scheduled_at}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Lieu *</Label>
                                    <Input
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                    />
                                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Type de séance</Label>
                                    <Select value={data.session_type} onValueChange={(v) => setData('session_type', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(sessionTypes).map(([k, v]) => (
                                                <SelectItem key={k} value={k}>{v}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Durée (minutes)</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={480}
                                        value={data.duration_minutes}
                                        onChange={(e) => setData('duration_minutes', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Statut</Label>
                                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="scheduled">Programmée</SelectItem>
                                        <SelectItem value="completed">Réalisée</SelectItem>
                                        <SelectItem value="cancelled">Annulée</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Objectifs / Notes</Label>
                                <Textarea
                                    value={data.objectives}
                                    onChange={(e) => setData('objectives', e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Notes coach</Label>
                                <Textarea
                                    value={data.coach_notes}
                                    onChange={(e) => setData('coach_notes', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>Enregistrer</Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>Annuler</Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
