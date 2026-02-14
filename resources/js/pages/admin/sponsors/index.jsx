import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';
import InputError from '@/components/input-error';

export default function AdminSponsorsIndex({ sponsors, typeLabels = {} }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [sponsorToDelete, setSponsorToDelete] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState('sponsor');
    const [sortOrder, setSortOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});

    const openDelete = (s) => {
        setSponsorToDelete(s);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (sponsorToDelete) {
            router.delete('/admin/sponsors/' + sponsorToDelete.id, {
                onSuccess: () => { setDeleteModalOpen(false); setSponsorToDelete(null); },
            });
        }
    };

    const resetCreateForm = () => {
        setName('');
        setUrl('');
        setType('sponsor');
        setSortOrder(0);
        setIsActive(true);
        setLogo(null);
        setPreview(null);
        setErrors({});
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('url', url || '');
        formData.append('type', type);
        formData.append('sort_order', sortOrder);
        formData.append('is_active', isActive ? 1 : 0);
        if (logo) formData.append('logo', logo);

        router.post('/admin/sponsors', formData, {
            forceFormData: true,
            onSuccess: () => {
                setCreateModalOpen(false);
                resetCreateForm();
            },
            onError: (err) => setErrors(err),
        });
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            setPreview(URL.createObjectURL(file));
        } else {
            setLogo(null);
            setPreview(null);
        }
    };

    return (
        <AdminLayout>
            <Head title="Partenaires & Sponsors" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Partenaires & Sponsors</h1>
                        <p className="text-sm text-muted-foreground">Gérer les sponsors affichés sur le site.</p>
                    </div>
                    <Button onClick={() => { resetCreateForm(); setCreateModalOpen(true); }}>
                        <Plus className="w-4 h-4 mr-2" />Nouveau sponsor
                    </Button>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {sponsors.map((s) => (
                                <div key={s.id} className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded bg-muted flex items-center justify-center">
                                        {s.logo ? <img src={'/storage/' + s.logo} alt="" className="h-full w-full object-contain p-1" /> : <Image className="h-6 w-6 text-muted-foreground" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold">{s.name}</h3>
                                        <p className="text-xs text-muted-foreground">{s.type_label} • Ordre: {s.sort_order}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Link href={'/admin/sponsors/' + s.id + '/edit'}><Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button></Link>
                                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(s)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {sponsors.length === 0 && <p className="text-center py-12 text-muted-foreground">Aucun sponsor. Ajoutez-en un pour les afficher sur la page d&apos;accueil.</p>}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={createModalOpen} onOpenChange={(open) => { setCreateModalOpen(open); if (!open) resetCreateForm(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nouveau sponsor</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Nom *</Label>
                            <Input id="create-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du sponsor" required />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-type">Type</Label>
                            <select id="create-type" value={type} onChange={(e) => setType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                {Object.entries(typeLabels).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-url">URL (optionnel)</Label>
                            <Input id="create-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                            <InputError message={errors.url} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-sort">Ordre d&apos;affichage</Label>
                            <Input id="create-sort" type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo (optionnel)</Label>
                            <div className="flex gap-4 items-center">
                                <Input type="file" accept="image/*" onChange={handleFile} />
                                {(logo || preview) && (
                                    <div className="w-20 h-14 rounded border overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                                        <img src={preview} alt="" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                            </div>
                            <InputError message={errors.logo} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="create-active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-input" />
                            <Label htmlFor="create-active">Actif</Label>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="submit">Créer</Button>
                            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>Annuler</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                title="Supprimer le sponsor"
                description={sponsorToDelete ? 'Êtes-vous sûr de vouloir supprimer « ' + sponsorToDelete.name + ' » ?' : ''}
            />
        </AdminLayout>
    );
}
