import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';

const CATEGORY_OPTIONS = ['U13', 'U15', 'U17', 'Senior'];

export default function OpponentTeamEdit({ team }) {
    const categoriesArray = Array.isArray(team.categories)
        ? team.categories
        : Array.isArray(team.category)
          ? team.category
          : team.category
            ? [team.category]
            : [];
    const { data, setData, post, processing, errors, transform } = useForm({
        name: team.name || '',
        categories: categoriesArray,
        logo: null,
        _method: 'PUT',
    });

    const toggleCategory = (value) => {
        const arr = [...(data.categories || [])];
        const idx = arr.indexOf(value);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(value);
        setData('categories', arr.sort());
    };

    const [preview, setPreview] = useState(team.logo ? `/storage/${team.logo}` : null);

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            categories: JSON.stringify(data.categories || []),
        }));
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
                                    <Label>Catégories</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Cochez toutes les catégories auxquelles cette équipe participe.
                                    </p>
                                    <div className="flex flex-wrap gap-4 rounded-md border p-3">
                                        {CATEGORY_OPTIONS.map((opt) => (
                                            <label
                                                key={opt}
                                                className="flex cursor-pointer items-center gap-2 text-sm"
                                            >
                                                <Checkbox
                                                    checked={(data.categories || []).includes(opt)}
                                                    onCheckedChange={() => toggleCategory(opt)}
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.categories} />
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
