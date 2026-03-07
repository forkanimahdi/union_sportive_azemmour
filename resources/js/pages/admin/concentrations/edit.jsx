import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tent } from 'lucide-react';

export default function ConcentrationEdit({ concentration, teams = [], staff = [], objectives = {} }) {
    const { data, setData, put, processing, errors } = useForm({
        name: concentration.name || '',
        start_date: concentration.start_date || '',
        end_date: concentration.end_date || '',
        location: concentration.location || '',
        accommodation: concentration.accommodation || '',
        objective: concentration.objective || 'autre',
        responsible_id: concentration.responsible_id || '',
        notes: concentration.notes || '',
        team_ids: concentration.team_ids || [],
    });

    const toggleTeam = (id) => {
        const ids = data.team_ids.includes(id) ? data.team_ids.filter((x) => x !== id) : [...data.team_ids, id];
        setData('team_ids', ids);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/concentrations/${concentration.id}`);
    };

    return (
        <AdminLayout>
            <Head title={`Modifier ${concentration.name}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10"><Tent className="w-6 h-6 text-primary" /></div>
                    <h1 className="text-3xl font-black uppercase italic text-dark">Modifier la concentration</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader><CardTitle>Fiche de la concentration</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Nom / Intitulé *</Label>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Date de début *</Label>
                                    <Input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date de fin *</Label>
                                    <Input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Lieu / Ville</Label>
                                    <Input value={data.location} onChange={(e) => setData('location', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Hébergement</Label>
                                    <Input value={data.accommodation} onChange={(e) => setData('accommodation', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Objectif *</Label>
                                    <Select value={data.objective} onValueChange={(v) => setData('objective', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(objectives).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Responsable</Label>
                                    <Select value={data.responsible_id} onValueChange={(v) => setData('responsible_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Staff" /></SelectTrigger>
                                        <SelectContent>
                                            {staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Équipe(s) *</Label>
                                <div className="flex flex-wrap gap-4 border rounded-md p-4">
                                    {teams.map((t) => (
                                        <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                                            <Checkbox checked={data.team_ids.includes(t.id)} onCheckedChange={() => toggleTeam(t.id)} />
                                            <span>{t.name} ({t.category})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Notes générales</Label>
                                <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} />
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
