import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';

export default function MatchCreateModal({
    open,
    onOpenChange,
    teams = [],
    opponentTeams = [],
    activeSeason,
    onSuccess,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        team_id: '',
        opponent_team_id: '',
        opponent: '',
        category: '',
        scheduled_at: '',
        venue: '',
        type: 'domicile',
    });

    const [useOpponentTeam, setUseOpponentTeam] = useState(true);

    const handleOpenChange = (next) => {
        if (!next) reset();
        onOpenChange(next);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/matches', {
            onSuccess: () => {
                handleOpenChange(false);
                onSuccess?.();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Programmer un match</DialogTitle>
                    {activeSeason && (
                        <p className="text-sm text-muted-foreground">
                            Saison active: <span className="font-semibold">{activeSeason.name}</span>
                        </p>
                    )}
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="modal_team_id">Notre équipe *</Label>
                            <Select
                                value={data.team_id}
                                onValueChange={(value) => {
                                    setData('team_id', value);
                                    const selectedTeam = teams.find((t) => t.id.toString() === value);
                                    if (selectedTeam) setData('category', selectedTeam.category);
                                }}
                            >
                                <SelectTrigger id="modal_team_id">
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
                            {errors.team_id && (
                                <p className="text-sm text-destructive">{errors.team_id}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="modal_category">Catégorie *</Label>
                            <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                                <SelectTrigger id="modal_category">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="U13">U13</SelectItem>
                                    <SelectItem value="U15">U15</SelectItem>
                                    <SelectItem value="U17">U17</SelectItem>
                                    <SelectItem value="Senior">Senior</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-destructive">{errors.category}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Label>Équipe adverse</Label>
                            <div className="flex gap-1">
                                <Button
                                    type="button"
                                    variant={useOpponentTeam ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => {
                                        setUseOpponentTeam(true);
                                        setData('opponent', '');
                                    }}
                                >
                                    Enregistrée
                                </Button>
                                <Button
                                    type="button"
                                    variant={!useOpponentTeam ? 'default' : 'outline'}
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
                            <>
                                <Select
                                    value={data.opponent_team_id}
                                    onValueChange={(v) => setData('opponent_team_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une équipe adverse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {opponentTeams.map((team) => (
                                            <SelectItem key={team.id} value={team.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    {team.logo && (
                                                        <img
                                                            src={`/storage/${team.logo}`}
                                                            alt=""
                                                            className="h-5 w-5 rounded-full object-cover"
                                                        />
                                                    )}
                                                    {team.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.opponent_team_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.opponent_team_id}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <Input
                                    value={data.opponent}
                                    onChange={(e) => setData('opponent', e.target.value)}
                                    placeholder="Nom de l'équipe adverse"
                                />
                                {errors.opponent && (
                                    <p className="text-sm text-destructive">{errors.opponent}</p>
                                )}
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="modal_scheduled_at">Date et heure *</Label>
                            <Input
                                id="modal_scheduled_at"
                                type="datetime-local"
                                value={data.scheduled_at}
                                onChange={(e) => setData('scheduled_at', e.target.value)}
                            />
                            {errors.scheduled_at && (
                                <p className="text-sm text-destructive">{errors.scheduled_at}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="modal_type">Type *</Label>
                            <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                <SelectTrigger id="modal_type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="domicile">Domicile</SelectItem>
                                    <SelectItem value="exterieur">Extérieur</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-destructive">{errors.type}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="modal_venue">Lieu *</Label>
                        <Input
                            id="modal_venue"
                            value={data.venue}
                            onChange={(e) => setData('venue', e.target.value)}
                            placeholder="Stade, adresse..."
                        />
                        {errors.venue && (
                            <p className="text-sm text-destructive">{errors.venue}</p>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                            <Calendar className="mr-2 h-4 w-4" />
                            Programmer le match
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
