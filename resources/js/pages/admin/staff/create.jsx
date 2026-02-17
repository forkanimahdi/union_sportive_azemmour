import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Plus, Trash2 } from 'lucide-react';

export default function StaffCreate({ roleOptions = {}, sectionOptions = {}, teams = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        image: null,
        role: '',
        section: '',
        priority: '',
        specialization: '',
        license_number: '',
        hire_date: '',
        is_active: true,
        team_assignments: [{ team_id: '', role: '' }],
    });

    const assignments = data.team_assignments || [{ team_id: '', role: '' }];

    const addAssignment = () => {
        setData('team_assignments', [...assignments, { team_id: '', role: '' }]);
    };

    const removeAssignment = (index) => {
        setData('team_assignments', assignments.filter((_, i) => i !== index));
    };

    const updateAssignment = (index, field, value) => {
        setData('team_assignments', assignments.map((x, i) => (i === index ? { ...x, [field]: value } : x)));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/staff', { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="Nouveau membre du staff" />
            <div className="space-y-6 p-4 sm:p-6">
                <div>
                    <Link href="/admin/staff" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Staff technique</Link>
                    <h1 className="text-2xl font-bold text-foreground">Nouveau membre du staff</h1>
                    <p className="text-muted-foreground text-sm mt-1">Directeur technique, Coach, Coach Gardiennes, Soigneur…</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations</CardTitle>
                        <CardDescription>Rôle principal et équipes d’affectation (une ou plusieurs)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">Prénom *</Label>
                                    <Input id="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} required />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Nom *</Label>
                                    <Input id="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} required />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Photo</Label>
                                <Input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] || null)} />
                                <InputError message={errors.image} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Rôle</Label>
                                    <Select value={data.role || ''} onValueChange={(v) => setData('role', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir un rôle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(roleOptions).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Section (À propos)</Label>
                                    <Select value={data.section || ''} onValueChange={(v) => setData('section', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(sectionOptions || {}).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Priorité (ordre affichage)</Label>
                                <Input type="number" min={0} value={data.priority ?? ''} onChange={(e) => setData('priority', e.target.value ? parseInt(e.target.value, 10) : '')} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialization">Spécialisation</Label>
                                <Input id="specialization" value={data.specialization} onChange={(e) => setData('specialization', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="license_number">N° licence</Label>
                                    <Input id="license_number" value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hire_date">Date d’embauche</Label>
                                    <Input id="hire_date" type="date" value={data.hire_date} onChange={(e) => setData('hire_date', e.target.value)} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(c) => setData('is_active', !!c)} />
                                <Label htmlFor="is_active" className="cursor-pointer">Actif</Label>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-semibold mb-2">Affectation aux équipes</h3>
                                <p className="text-sm text-muted-foreground mb-4">Un même membre peut être affecté à plusieurs équipes (ex. Coach Gardiennes pour toutes les équipes).</p>
                                {assignments.map((a, index) => (
                                    <div key={index} className="flex flex-wrap items-end gap-2 mb-2">
                                        <Select value={a.team_id || 'none'} onValueChange={(v) => updateAssignment(index, 'team_id', v === 'none' ? '' : v)}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Équipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">—</SelectItem>
                                                {teams.map((t) => (
                                                    <SelectItem key={t.id} value={t.id}>{t.name} ({t.category})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={a.role || ''} onValueChange={(v) => updateAssignment(index, 'role', v)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Rôle pour cette équipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(roleOptions).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => removeAssignment(index)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addAssignment} className="mt-2">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter une équipe
                                </Button>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground">
                                    {processing ? 'Création…' : 'Créer'}
                                </Button>
                                <Link href="/admin/staff">
                                    <Button type="button" variant="outline">Annuler</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
