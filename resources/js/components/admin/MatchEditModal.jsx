import React, { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
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
import { Trash2 } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';

export default function MatchEditModal({
    open,
    onOpenChange,
    match,
    teams = [],
    opponentTeams = [],
    onSuccess,
}) {
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const pageErrors = usePage().props.errors || {};

    const { data, setData, processing, errors: formErrors } = useForm({
        team_id: match?.team?.id?.toString() || match?.team_id?.toString() || '',
        opponent_team_id: match?.opponent_team?.id?.toString() || match?.opponent_team_id?.toString() || '',
        opponent: match?.opponent || '',
        category: match?.category || 'Senior',
        scheduled_at: match?.scheduled_at ? match.scheduled_at.replace(' ', 'T').slice(0, 16) : '',
        venue: match?.venue || '',
        type: match?.type || 'domicile',
        status: match?.status || 'scheduled',
        home_score: match?.home_score ?? '',
        away_score: match?.away_score ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...data,
            home_score: data.home_score === '' || data.home_score == null ? null : parseInt(data.home_score, 10),
            away_score: data.away_score === '' || data.away_score == null ? null : parseInt(data.away_score, 10),
        };
        router.put(`/admin/matches/${match.id}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                onSuccess?.();
            },
        });
    };
    const errors = { ...formErrors, ...pageErrors };

    const handleDelete = () => {
        router.delete(`/admin/matches/${match.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteConfirmOpen(false);
                onOpenChange(false);
                onSuccess?.();
            },
        });
    };

    if (!match) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Modifier le match</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Notre équipe</Label>
                                <Select value={data.team_id} onValueChange={(v) => setData('team_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Équipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teams.map((t) => (
                                            <SelectItem key={t.id} value={t.id.toString()}>
                                                {t.name} ({t.category})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.team_id && <p className="text-sm text-destructive">{errors.team_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
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
                            <Label>Adversaire (équipe enregistrée)</Label>
                            <Select
                                value={data.opponent_team_id || 'none'}
                                onValueChange={(v) => {
                                    setData('opponent_team_id', v === 'none' ? '' : v);
                                    if (v === 'none') setData('opponent', '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucune / Nom manuel</SelectItem>
                                    {opponentTeams.map((ot) => (
                                        <SelectItem key={ot.id} value={ot.id.toString()}>
                                            {ot.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Ou nom adverse (si pas enregistré)</Label>
                            <Input
                                value={data.opponent}
                                onChange={(e) => setData('opponent', e.target.value)}
                                placeholder="Nom de l'équipe adverse"
                            />
                            {errors.opponent && <p className="text-sm text-destructive">{errors.opponent}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date et heure</Label>
                                <Input
                                    type="datetime-local"
                                    value={data.scheduled_at}
                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                />
                                {errors.scheduled_at && <p className="text-sm text-destructive">{errors.scheduled_at}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="domicile">Domicile</SelectItem>
                                        <SelectItem value="exterieur">Extérieur</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Lieu</Label>
                            <Input
                                value={data.venue}
                                onChange={(e) => setData('venue', e.target.value)}
                                placeholder="Stade, adresse..."
                            />
                            {errors.venue && <p className="text-sm text-destructive">{errors.venue}</p>}
                        </div>
                        <DialogFooter className="flex flex-row justify-between gap-2 border-t pt-4 sm:justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                className="text-destructive border-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteConfirmOpen(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </Button>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                                    Enregistrer
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <DeleteModal
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDelete}
                title="Supprimer le match"
                description="Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible."
                loading={false}
            />
        </>
    );
}
