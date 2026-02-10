import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trophy, Upload } from 'lucide-react';

const CATEGORY_OPTIONS = ['U13', 'U15', 'U17', 'Senior'];

export default function OpponentTeamCreate() {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        categories: [],
        logo: null,
    });

    const toggleCategory = (value) => {
        const arr = [...(data.categories || [])];
        const idx = arr.indexOf(value);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(value);
        setData('categories', arr.sort());
    };

    const [preview, setPreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            categories: JSON.stringify(data.categories || []),
        }));
        post('/admin/opponent-teams', {
            forceFormData: true,
            onSuccess: () => {
                router.visit('/admin/opponent-teams');
            },
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AdminLayout>
            <Head title="Nouvelle Équipe Adverse" />
            <div className="space-y-6">
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                            <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Nouvelle Équipe Adverse</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle>Informations de l'équipe</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom de l'équipe *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="bg-white/50 backdrop-blur-sm"
                                    placeholder="Nom de l'équipe adverse"
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Catégories</Label>
                                <p className="text-xs text-muted-foreground">
                                    Cochez toutes les catégories auxquelles cette équipe participe.
                                </p>
                                <div className="flex flex-wrap gap-4 rounded-md border p-3 bg-white/50 backdrop-blur-sm">
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
                                {errors.categories && <p className="text-sm text-destructive">{errors.categories}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="bg-white/50 backdrop-blur-sm"
                                        />
                                    </div>
                                    {preview && (
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                {errors.logo && <p className="text-sm text-destructive">{errors.logo}</p>}
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <Trophy className="w-4 h-4 mr-2" />
                                    Créer l'équipe
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => router.visit('/admin/opponent-teams')}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}

