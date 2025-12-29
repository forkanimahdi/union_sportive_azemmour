import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Calendar } from 'lucide-react';

export default function MatchCreate({ teams, opponentTeams, activeSeason }) {
    const { data, setData, post, processing, errors } = useForm({
        team_id: '',
        opponent_team_id: '',
        opponent: '',
        category: '',
        scheduled_at: '',
        venue: '',
        type: 'domicile',
    });

    const [useOpponentTeam, setUseOpponentTeam] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/matches', {
            onSuccess: () => {
                router.visit('/admin/matches');
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Programmer un Match" />
            <div className="space-y-6">
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                            <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black uppercase italic text-dark">Programmer un Match</h1>
                    </div>
                    {activeSeason && (
                        <p className="text-muted-foreground mt-2">
                            Saison active: <span className="font-semibold">{activeSeason.name}</span>
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle>Informations du match</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="team_id">Notre équipe *</Label>
                                    <Select value={data.team_id} onValueChange={(value) => {
                                        setData('team_id', value);
                                        const selectedTeam = teams.find(t => t.id.toString() === value);
                                        if (selectedTeam) {
                                            setData('category', selectedTeam.category);
                                        }
                                    }}>
                                        <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                            <SelectValue placeholder="Sélectionner une équipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teams.map((team) => (
                                                <SelectItem key={team.id} value={team.id.toString()}>
                                                    {team.name} ({team.category})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.team_id && <p className="text-sm text-destructive">{errors.team_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Catégorie *</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                            <SelectValue placeholder="Catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="U13">U13</SelectItem>
                                            <SelectItem value="U15">U15</SelectItem>
                                            <SelectItem value="U17">U17</SelectItem>
                                            <SelectItem value="Senior">Senior</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-4 mb-2">
                                    <Label>Type d'équipe adverse</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={useOpponentTeam ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => {
                                                setUseOpponentTeam(true);
                                                setData('opponent', '');
                                            }}
                                        >
                                            Équipe enregistrée
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={!useOpponentTeam ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => {
                                                setUseOpponentTeam(false);
                                                setData('opponent_team_id', '');
                                            }}
                                        >
                                            Nom manuel
                                        </Button>
                                    </div>
                                </div>

                                {useOpponentTeam ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="opponent_team_id">Équipe adverse</Label>
                                        <Select value={data.opponent_team_id} onValueChange={(value) => setData('opponent_team_id', value)}>
                                            <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                                <SelectValue placeholder="Sélectionner une équipe adverse" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {opponentTeams.map((team) => (
                                                    <SelectItem key={team.id} value={team.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            {team.logo && (
                                                                <img src={`/storage/${team.logo}`} alt={team.name} className="w-6 h-6 rounded-full" />
                                                            )}
                                                            {team.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.opponent_team_id && <p className="text-sm text-destructive">{errors.opponent_team_id}</p>}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="opponent">Nom de l'équipe adverse</Label>
                                        <Input
                                            id="opponent"
                                            value={data.opponent}
                                            onChange={(e) => setData('opponent', e.target.value)}
                                            className="bg-white/50 backdrop-blur-sm"
                                            placeholder="Nom de l'équipe adverse"
                                        />
                                        {errors.opponent && <p className="text-sm text-destructive">{errors.opponent}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="scheduled_at">Date et heure *</Label>
                                    <Input
                                        id="scheduled_at"
                                        type="datetime-local"
                                        value={data.scheduled_at}
                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                        className="bg-white/50 backdrop-blur-sm"
                                    />
                                    {errors.scheduled_at && <p className="text-sm text-destructive">{errors.scheduled_at}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Type de match *</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="domicile">Domicile</SelectItem>
                                            <SelectItem value="exterieur">Extérieur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="venue">Lieu *</Label>
                                <Input
                                    id="venue"
                                    value={data.venue}
                                    onChange={(e) => setData('venue', e.target.value)}
                                    className="bg-white/50 backdrop-blur-sm"
                                    placeholder="Stade, adresse..."
                                />
                                {errors.venue && <p className="text-sm text-destructive">{errors.venue}</p>}
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Programmer le match
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => router.visit('/admin/matches')}
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

