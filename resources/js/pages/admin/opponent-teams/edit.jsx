import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function OpponentTeamEdit({ team }) {
    const { data, setData, put, processing, errors } = useForm({
        name: team.name || '',
        logo: null,
        rank: team.rank || 0,
        matches_played: team.matches_played || 0,
        wins: team.wins || 0,
        draws: team.draws || 0,
        losses: team.losses || 0,
        goals_for: team.goals_for || 0,
        goals_against: team.goals_against || 0,
        points: team.points || 0,
    });

    const [preview, setPreview] = useState(team.logo ? `/storage/${team.logo}` : null);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/opponent-teams/${team.id}`, {
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
            <Head title={`Modifier ${team.name}`} />
            <div className="space-y-6">
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                            <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Modifier {team.name}</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle>Informations de l'équipe</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom de l'équipe *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rank">Rang</Label>
                                    <Input
                                        id="rank"
                                        type="number"
                                        value={data.rank}
                                        onChange={(e) => setData('rank', parseInt(e.target.value))}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                    {errors.rank && <p className="text-sm text-destructive">{errors.rank}</p>}
                                </div>
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

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="matches_played">Matchs joués</Label>
                                    <Input
                                        id="matches_played"
                                        type="number"
                                        value={data.matches_played}
                                        onChange={(e) => setData('matches_played', parseInt(e.target.value))}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="wins">Victoires</Label>
                                    <Input
                                        id="wins"
                                        type="number"
                                        value={data.wins}
                                        onChange={(e) => setData('wins', parseInt(e.target.value))}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="draws">Nuls</Label>
                                    <Input
                                        id="draws"
                                        type="number"
                                        value={data.draws}
                                        onChange={(e) => setData('draws', parseInt(e.target.value))}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="losses">Défaites</Label>
                                    <Input
                                        id="losses"
                                        type="number"
                                        value={data.losses}
                                        onChange={(e) => setData('losses', parseInt(e.target.value))}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="goals_for">Buts pour</Label>
                                    <Input
                                        id="goals_for"
                                        type="number"
                                        value={data.goals_for}
                                        onChange={(e) => setData('goals_for', parseInt(e.target.value))}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="goals_against">Buts contre</Label>
                                    <Input
                                        id="goals_against"
                                        type="number"
                                        value={data.goals_against}
                                        onChange={(e) => setData('goals_against', parseInt(e.target.value))}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="points">Points</Label>
                                    <Input
                                        id="points"
                                        type="number"
                                        value={data.points}
                                        onChange={(e) => setData('points', parseInt(e.target.value))}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <Trophy className="w-4 h-4 mr-2" />
                                    Enregistrer
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

