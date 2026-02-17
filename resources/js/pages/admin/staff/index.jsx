import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Plus, Pencil, Trash2, Users, User } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';

export default function StaffIndex({ staff, roleOptions = {}, sectionOptions = {}, teams = [] }) {
    const list = staff?.data ?? staff ?? [];
    const [deleteId, setDeleteId] = React.useState(null);
    const [createOpen, setCreateOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
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
    const addAssignment = () => setData('team_assignments', [...assignments, { team_id: '', role: '' }]);
    const removeAssignment = (i) => setData('team_assignments', assignments.filter((_, idx) => idx !== i));
    const updateAssignment = (i, field, value) =>
        setData('team_assignments', assignments.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)));

    const handleCreate = (e) => {
        e.preventDefault();
        post('/admin/staff', {
            forceFormData: true,
            onSuccess: () => {
                setCreateOpen(false);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/staff/${deleteId}`, {
                preserveScroll: true,
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Staff technique" />
            <div className="space-y-6 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Staff technique</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Bureau, Coach, Coach Gardiennes, Soigneur… Chaque membre peut être affecté à une ou plusieurs équipes.
                        </p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouveau membre
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Nouveau membre du staff</DialogTitle>
                                <DialogDescription>Bureau, encadrement technique, soigneurs…</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Prénom</Label>
                                        <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                                        <InputError message={errors.first_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nom</Label>
                                        <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                                        <InputError message={errors.last_name} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Photo</Label>
                                    <Input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] || null)} />
                                    <InputError message={errors.image} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Rôle</Label>
                                        <Select value={data.role || ''} onValueChange={(v) => setData('role', v)}>
                                            <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(roleOptions).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Section (À propos)</Label>
                                        <Select value={data.section || ''} onValueChange={(v) => setData('section', v)}>
                                            <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(sectionOptions || {}).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Priorité (ordre affichage)</Label>
                                    <Input type="number" min={0} value={data.priority ?? ''} onChange={(e) => setData('priority', e.target.value ? parseInt(e.target.value, 10) : '')} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Téléphone</Label>
                                        <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <Label className="mb-2 block">Affectation aux équipes</Label>
                                    {assignments.map((a, i) => (
                                        <div key={i} className="flex gap-2 mb-2">
                                            <Select value={a.team_id || 'none'} onValueChange={(v) => updateAssignment(i, 'team_id', v === 'none' ? '' : v)}>
                                                <SelectTrigger className="flex-1"><SelectValue placeholder="Équipe" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">—</SelectItem>
                                                    {(teams || []).map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <Select value={a.role || ''} onValueChange={(v) => updateAssignment(i, 'role', v)}>
                                                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Rôle" /></SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(roleOptions).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeAssignment(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addAssignment}>
                                        <Plus className="w-4 h-4 mr-2" /> Ajouter une équipe
                                    </Button>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Annuler</Button>
                                    <Button type="submit" disabled={processing}>{processing ? 'Création…' : 'Créer'}</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border bg-card">
                    <CardContent className="p-0">
                        {list.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                Aucun membre du staff. Cliquez sur « Nouveau membre » pour ajouter.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-left p-4 font-semibold w-14">Photo</th>
                                            <th className="text-left p-4 font-semibold">Nom</th>
                                            <th className="text-left p-4 font-semibold">Rôle</th>
                                            <th className="text-left p-4 font-semibold">Section</th>
                                            <th className="text-left p-4 font-semibold">Équipes</th>
                                            <th className="text-right p-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((s) => (
                                            <tr key={s.id} className="border-b hover:bg-muted/30">
                                                <td className="p-4">
                                                    {s.image ? (
                                                        <img src={s.image} alt="" className="w-10 h-10 rounded-full object-cover bg-muted" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                            <User className="w-5 h-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {s.first_name || '—'} {s.last_name || ''}
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="secondary">{s.role_label ?? roleOptions[s.role] ?? s.role ?? '—'}</Badge>
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {s.section_label ?? sectionOptions[s.section] ?? s.section ?? '—'}
                                                </td>
                                                <td className="p-4">
                                                    {s.teams?.length > 0 ? (
                                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                                            <Users className="w-4 h-4 shrink-0" />
                                                            {s.teams.map((t) => `${t.name} (${t.pivot_role_label ?? t.pivot_role})`).join(', ')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link href={`/admin/staff/${s.id}/edit`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(s.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {staff?.links && (
                            <div className="flex justify-center gap-2 p-4 border-t">
                                {staff.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                                        preserveScroll
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <DeleteModal
                    open={!!deleteId}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                    onConfirm={handleDelete}
                    title="Supprimer ce membre du staff"
                    description="Cette action est irréversible."
                />
            </div>
        </AdminLayout>
    );
}
