import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';

export default function SeasonsEdit({ season }) {
    const { data, setData, put, processing, errors } = useForm({
        name: season.name,
        start_date: season.start_date,
        end_date: season.end_date,
        description: season.description || '',
        is_active: season.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/seasons/${season.id}`);
    };

    return (
        <AdminLayout>
            <Head title={`Modifier ${season.name}`} />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic text-dark">Modifier la Saison</h1>
                    <p className="text-gray-600 mt-1">{season.name}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations de la saison</CardTitle>
                        <CardDescription>Modifiez les informations de la saison</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom de la saison *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Date de début *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Date de fin *</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.end_date} />
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
                                    Définir comme saison active
                                </Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                </Button>
                                <Link href="/admin/seasons">
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

