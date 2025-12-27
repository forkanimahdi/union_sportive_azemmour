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

export default function TeamsEdit({ team, seasons }) {
    const { data, setData, put, processing, errors } = useForm({
        season_id: team.season_id,
        category: team.category,
        name: team.name,
        description: team.description || '',
        is_active: team.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/teams/${team.id}`);
    };

    return (
        <AdminLayout>
            <Head title={`Modifier ${team.name}`} />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic text-dark">Modifier l'Équipe</h1>
                    <p className="text-gray-600 mt-1">{team.name}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations de l'équipe</CardTitle>
                        <CardDescription>Modifiez les informations de l'équipe</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="season_id">Saison *</Label>
                                <Select value={data.season_id} onValueChange={(value) => setData('season_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une saison" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {seasons.map((season) => (
                                            <SelectItem key={season.id} value={season.id}>
                                                {season.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.season_id} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Catégorie *</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="U13">U13</SelectItem>
                                            <SelectItem value="U15">U15</SelectItem>
                                            <SelectItem value="U17">U17</SelectItem>
                                            <SelectItem value="Senior">Senior</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom de l'équipe *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alpha"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Équipe active
                                </Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                </Button>
                                <Link href="/admin/teams">
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}


