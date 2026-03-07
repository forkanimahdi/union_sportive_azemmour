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

export default function TrainingCreate({ teams = [], staff = [], sessionTypes = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        team_id: '',
        coach_id: '',
        scheduled_at: '',
        location: '',
        session_type: '',
        duration_minutes: '',
        objectives: '',
        coach_notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/trainings');
    };

    return (
        <AdminLayout>
            <Head title="Nouvelle séance" />
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Dumbbell className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Nouvelle séance</h1>
                        <p className="text-muted-foreground">Séance classique (&lt; 1 journée)</p>
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
                                        placeholder="Terrain, salle..."
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
                                        placeholder="90"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Objectifs / Notes</Label>
                                <Textarea
                                    value={data.objectives}
                                    onChange={(e) => setData('objectives', e.target.value)}
                                    placeholder="Objectifs de la séance..."
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Notes coach</Label>
                                <Textarea
                                    value={data.coach_notes}
                                    onChange={(e) => setData('coach_notes', e.target.value)}
                                    placeholder="Notes libres..."
                                    rows={2}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>Créer la séance</Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>Annuler</Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
