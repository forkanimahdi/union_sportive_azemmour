import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Image } from 'lucide-react';
import InputError from '@/components/input-error';

export default function AdminSponsorsEdit({ sponsor, typeLabels }) {
    const [name, setName] = useState(sponsor?.name ?? '');
    const [url, setUrl] = useState(sponsor?.url ?? '');
    const [type, setType] = useState(sponsor?.type ?? 'sponsor');
    const [sortOrder, setSortOrder] = useState(sponsor?.sort_order ?? 0);
    const [isActive, setIsActive] = useState(sponsor?.is_active ?? true);
    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', name);
        formData.append('url', url || '');
        formData.append('type', type);
        formData.append('sort_order', sortOrder);
        formData.append('is_active', isActive ? 1 : 0);
        if (logo) formData.append('logo', logo);

        router.post('/admin/sponsors/' + sponsor.id, formData, {
            forceFormData: true,
            onSuccess: () => router.visit('/admin/sponsors'),
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

    const logoPreview = preview || (sponsor?.logo ? '/storage/' + sponsor.logo : null);

    return (
        <AdminLayout>
            <Head title="Modifier le sponsor" />
            <div className="space-y-6">
                <Link href="/admin/sponsors" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux sponsors
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Image className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Modifier {sponsor?.name}</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom *</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du sponsor" required />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    {Object.entries(typeLabels || {}).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">URL (optionnel)</Label>
                                <Input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                                <InputError message={errors.url} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sort_order">Ordre d'affichage</Label>
                                <Input id="sort_order" type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Logo (optionnel)</Label>
                                <div className="flex gap-4 items-start">
                                    <Input type="file" accept="image/*" onChange={handleFile} />
                                    {logoPreview && (
                                        <div className="w-20 h-14 rounded border overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                                            <img src={logoPreview} alt="" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                                <InputError message={errors.logo} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="is_active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-input" />
                                <Label htmlFor="is_active">Actif (affiché sur le site)</Label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button type="submit">Enregistrer</Button>
                                <Button type="button" variant="outline" onClick={() => router.visit('/admin/sponsors')}>Annuler</Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
