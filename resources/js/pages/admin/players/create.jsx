import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';

export default function PlayersCreate({ teams }) {
    const { data, setData, post, processing, errors } = useForm({
        team_ids: [],
        first_name: '',
        last_name: '',
        date_of_birth: '',
        position: '',
        preferred_foot: '',
        jersey_number: '',
        email: '',
        phone: '',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_email: '',
        guardian_relationship: '',
        photo: null,
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/players', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Nouvelle Joueuse" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic text-dark">Nouvelle Joueuse</h1>
                    <p className="text-gray-600 mt-1">Ajouter une nouvelle joueuse</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                        <CardDescription>Remplissez les informations de la joueuse</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">Prénom *</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Nom *</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_birth">Date de naissance *</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.date_of_birth} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="position">Poste</Label>
                                    <Select value={data.position} onValueChange={(value) => setData('position', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gardien">Gardien</SelectItem>
                                            <SelectItem value="defenseur">Défenseur</SelectItem>
                                            <SelectItem value="milieu">Milieu</SelectItem>
                                            <SelectItem value="attaquant">Attaquant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.position} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jersey_number">Numéro de maillot</Label>
                                    <Input
                                        id="jersey_number"
                                        value={data.jersey_number}
                                        onChange={(e) => setData('jersey_number', e.target.value)}
                                    />
                                    <InputError message={errors.jersey_number} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Équipes (une joueuse peut être U17 et Senior)</Label>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {teams.map((team) => {
                                        const checked = (data.team_ids || []).includes(team.id);
                                        return (
                                            <div key={team.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`team-${team.id}`}
                                                    checked={checked}
                                                    onCheckedChange={(c) => {
                                                        const ids = [...(data.team_ids || [])];
                                                        if (c) ids.push(team.id);
                                                        else ids.splice(ids.indexOf(team.id), 1);
                                                        setData('team_ids', ids);
                                                    }}
                                                />
                                                <Label htmlFor={`team-${team.id}`} className="cursor-pointer text-sm font-normal">
                                                    {team.name} ({team.category})
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                                <InputError message={errors.team_ids} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="photo">Photo</Label>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('photo', e.target.files[0])}
                                />
                                <InputError message={errors.photo} />
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-4">Informations tuteur légal (pour mineures)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="guardian_name">Nom du tuteur</Label>
                                        <Input
                                            id="guardian_name"
                                            value={data.guardian_name}
                                            onChange={(e) => setData('guardian_name', e.target.value)}
                                        />
                                        <InputError message={errors.guardian_name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guardian_relationship">Relation</Label>
                                        <Input
                                            id="guardian_relationship"
                                            value={data.guardian_relationship}
                                            onChange={(e) => setData('guardian_relationship', e.target.value)}
                                            placeholder="Parent, tuteur, etc."
                                        />
                                        <InputError message={errors.guardian_relationship} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guardian_phone">Téléphone tuteur</Label>
                                        <Input
                                            id="guardian_phone"
                                            value={data.guardian_phone}
                                            onChange={(e) => setData('guardian_phone', e.target.value)}
                                        />
                                        <InputError message={errors.guardian_phone} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guardian_email">Email tuteur</Label>
                                        <Input
                                            id="guardian_email"
                                            type="email"
                                            value={data.guardian_email}
                                            onChange={(e) => setData('guardian_email', e.target.value)}
                                        />
                                        <InputError message={errors.guardian_email} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Joueuse active
                                </Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Création...' : 'Créer la joueuse'}
                                </Button>
                                <Link href="/admin/players">
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


















