import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';

export default function OpponentTeamEdit({ team }) {
    const { data, setData, post, processing, errors } = useForm({
        name: team.name || '',
        category: team.category || '',
        logo: null,
        _method: 'PUT',
    });

    const [preview, setPreview] = useState(team.logo ? `/storage/${team.logo}` : null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/opponent-teams/${team.id}`, {
            forceFormData: true,
            onSuccess: () => router.visit('/admin/opponent-teams'),
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setData('logo', null);
            setPreview(team.logo ? `/storage/${team.logo}` : null);
        }
    };

    return (
        <AdminLayout>
            <Head title={`Modifier ${team.name}`} />
            <div className="min-h-screen bg-muted/30">
                <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
                    <Link
                        href="/admin/opponent-teams"
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux équipes adverses
                    </Link>

                    <Card>
                        <CardHeader>
                            <CardTitle>Modifier l&apos;équipe adverse</CardTitle>
                            <p className="text-sm text-muted-foreground">{team.name}</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom du club *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nom de l'équipe adverse"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Catégorie</Label>
                                    <Select
                                        value={data.category || 'none'}
                                        onValueChange={(v) => setData('category', v === 'none' ? '' : v)}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Sélectionner une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucune</SelectItem>
                                            <SelectItem value="U13">U13</SelectItem>
                                            <SelectItem value="U15">U15</SelectItem>
                                            <SelectItem value="U17">U17</SelectItem>
                                            <SelectItem value="Senior">Senior</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="logo">Logo (laisser vide pour conserver)</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="flex-1"
                                        />
                                        {preview && (
                                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 border-primary/20">
                                                <img src={preview} alt="Aperçu" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.logo} />
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                                        {processing ? 'Enregistrement…' : 'Enregistrer'}
                                    </Button>
                                    <Link href="/admin/opponent-teams">
                                        <Button type="button" variant="outline">
                                            Annuler
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
