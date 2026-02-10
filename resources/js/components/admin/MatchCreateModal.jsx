import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import { Home, Plane, Trophy, Users, Swords, Calendar, MapPin, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
    { id: 1, title: 'Lieu du match', icon: Home, field: 'type' },
    { id: 2, title: 'Catégorie', icon: Trophy, field: 'category' },
    { id: 3, title: 'Notre équipe', icon: Users, field: 'team_id' },
    { id: 4, title: 'Équipe adverse', icon: Swords, field: 'opponent' },
    { id: 5, title: 'Date, heure et lieu', icon: Calendar, field: 'datetime_venue' },
];

const CATEGORIES = [
    { value: 'U13', label: 'U13' },
    { value: 'U15', label: 'U15' },
    { value: 'U17', label: 'U17' },
    { value: 'Senior', label: 'Senior' },
];

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

    const [step, setStep] = useState(1);
    const [useOpponentTeam, setUseOpponentTeam] = useState(true);
    const [opponentSearch, setOpponentSearch] = useState('');
    const [opponentDropdownOpen, setOpponentDropdownOpen] = useState(false);
    const opponentDropdownRef = useRef(null);

    const activeSeasonTeams = Array.isArray(teams) ? teams : [];
    const teamsInCategory = useMemo(() => {
        if (!data.category) return activeSeasonTeams;
        return activeSeasonTeams.filter(
            (t) => (t.category || '').toLowerCase() === (data.category || '').toLowerCase()
        );
    }, [activeSeasonTeams, data.category]);

    const opponentCategories = (ot) => Array.isArray(ot.category) ? ot.category : (ot.category ? [ot.category] : []);

    const opponentsInCategory = useMemo(() => {
        if (!data.category) return [];
        return opponentTeams.filter((ot) =>
            opponentCategories(ot).some((c) => (c || '').toLowerCase() === (data.category || '').toLowerCase())
        );
    }, [opponentTeams, data.category]);

    const filteredOpponents = useMemo(() => {
        if (!opponentSearch.trim()) return opponentsInCategory;
        const q = opponentSearch.trim().toLowerCase();
        return opponentsInCategory.filter(
            (ot) =>
                (ot.name || '').toLowerCase().includes(q) ||
                opponentCategories(ot).some((c) => (c || '').toLowerCase().includes(q))
        );
    }, [opponentsInCategory, opponentSearch]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (opponentDropdownRef.current && !opponentDropdownRef.current.contains(e.target)) {
                setOpponentDropdownOpen(false);
            }
        }
        if (opponentDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [opponentDropdownOpen]);

    const handleOpenChange = (next) => {
        if (!next) {
            reset();
            setStep(1);
            setOpponentSearch('');
            setOpponentDropdownOpen(false);
        }
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

    const selectedOpponent = opponentTeams.find((ot) => ot.id.toString() === data.opponent_team_id);
    const canNext = () => {
        switch (step) {
            case 1:
                return true;
            case 2:
                return !!data.category;
            case 3:
                return !!data.team_id;
            case 4:
                return useOpponentTeam ? !!data.opponent_team_id : !!data.opponent?.trim();
            case 5:
                return !!data.scheduled_at && !!data.venue?.trim();
            default:
                return false;
        }
    };

    const goNext = () => {
        if (step < 5) setStep(step + 1);
    };
    const goPrev = () => {
        if (step > 1) setStep(step - 1);
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

                {/* Step indicator */}
                <div className="flex items-center justify-between gap-1 rounded-lg border bg-muted/50 p-1">
                    {STEPS.map((s, idx) => {
                        const Icon = s.icon;
                        const isActive = step === s.id;
                        const isPast = step > s.id;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setStep(s.id)}
                                className={cn(
                                    'flex flex-1 flex-col items-center gap-0.5 rounded-md py-2 text-xs transition-colors',
                                    isActive && 'bg-alpha text-white shadow-sm',
                                    isPast && 'text-muted-foreground',
                                    !isActive && !isPast && 'text-muted-foreground hover:bg-muted'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden truncate sm:inline">{s.title}</span>
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Step 1: Home or Away */}
                    {step === 1 && (
                        <div className="space-y-3">
                            <Label>Où se joue le match ?</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'domicile')}
                                    className={cn(
                                        'flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors',
                                        data.type === 'domicile'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:bg-muted/50'
                                    )}
                                >
                                    <Home className="h-6 w-6" />
                                    <span className="font-medium">Domicile</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'exterieur')}
                                    className={cn(
                                        'flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors',
                                        data.type === 'exterieur'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:bg-muted/50'
                                    )}
                                >
                                    <Plane className="h-6 w-6" />
                                    <span className="font-medium">Extérieur</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Category */}
                    {step === 2 && (
                        <div className="space-y-2">
                            <Label htmlFor="modal_category">Catégorie *</Label>
                            <Select
                                value={data.category}
                                onValueChange={(v) => {
                                    setData('category', v);
                                    setData('team_id', '');
                                    setData('opponent_team_id', '');
                                }}
                            >
                                <SelectTrigger id="modal_category">
                                    <SelectValue placeholder="Choisir la catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((c) => (
                                        <SelectItem key={c.value} value={c.value}>
                                            {c.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-destructive">{errors.category}</p>
                            )}
                        </div>
                    )}

                    {/* Step 3: Our team (active season only) */}
                    {step === 3 && (
                        <div className="space-y-2">
                            <Label htmlFor="modal_team_id">Notre équipe *</Label>
                            <Select
                                value={data.team_id}
                                onValueChange={(value) => setData('team_id', value)}
                            >
                                <SelectTrigger id="modal_team_id">
                                    <SelectValue placeholder="Sélectionner notre équipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teamsInCategory.map((team) => (
                                        <SelectItem key={team.id} value={team.id.toString()}>
                                            {team.name} ({team.category})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {teamsInCategory.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {!data.category
                                        ? 'Choisissez d\'abord une catégorie'
                                        : 'Aucune équipe pour cette catégorie (saison active).'}
                                </p>
                            )}
                            {errors.team_id && (
                                <p className="text-sm text-destructive">{errors.team_id}</p>
                            )}
                        </div>
                    )}

                    {/* Step 4: Opponent (same category, searchable, "Name (Category)") */}
                    {step === 4 && (
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
                                <div className="space-y-1" ref={opponentDropdownRef}>
                                    <div className="relative">
                                        <div
                                            className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                                            onClick={() => setOpponentDropdownOpen((o) => !o)}
                                        >
                                            <span className={selectedOpponent ? '' : 'text-muted-foreground'}>
                                                {selectedOpponent
                                                    ? `${selectedOpponent.name} (${Array.isArray(selectedOpponent.category) ? selectedOpponent.category.join(', ') : (selectedOpponent.category || '-')})`
                                                    : 'Sélectionner une équipe adverse'}
                                            </span>
                                            <ChevronRight
                                                className={cn('h-4 w-4 transition-transform', opponentDropdownOpen && 'rotate-90')}
                                            />
                                        </div>
                                        {opponentDropdownOpen && (
                                            <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover py-1 shadow-md">
                                                <div className="border-b px-2 pb-2" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2">
                                                        <Search className="h-4 w-4 text-muted-foreground" />
                                                        <input
                                                            type="text"
                                                            value={opponentSearch}
                                                            onChange={(e) => setOpponentSearch(e.target.value)}
                                                            placeholder="Rechercher..."
                                                            className="h-8 flex-1 bg-transparent text-sm outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="max-h-48 overflow-y-auto">
                                                    {filteredOpponents.length === 0 ? (
                                                        <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                                            {!data.category
                                                                ? 'Choisissez d\'abord une catégorie'
                                                                : 'Aucun résultat'}
                                                        </div>
                                                    ) : (
                                                        filteredOpponents.map((ot) => (
                                                            <button
                                                                key={ot.id}
                                                                type="button"
                                                                className={cn(
                                                                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent',
                                                                    data.opponent_team_id === ot.id.toString() && 'bg-accent'
                                                                )}
                                                                onClick={() => {
                                                                    setData('opponent_team_id', ot.id.toString());
                                                                    setOpponentDropdownOpen(false);
                                                                    setOpponentSearch('');
                                                                }}
                                                            >
                                                                {ot.logo && (
                                                                    <img
                                                                        src={`/storage/${ot.logo}`}
                                                                        alt=""
                                                                        className="h-6 w-6 rounded-full object-cover"
                                                                    />
                                                                )}
                                                                <span>
                                                                    {ot.name} ({Array.isArray(ot.category) ? ot.category.join(', ') : (ot.category || '-')})
                                                                </span>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.opponent_team_id && (
                                        <p className="text-sm text-destructive">{errors.opponent_team_id}</p>
                                    )}
                                </div>
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
                    )}

                    {/* Step 5: Date, time and venue */}
                    {step === 5 && (
                        <div className="space-y-4">
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
                                <Label htmlFor="modal_venue">Lieu / Adresse *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="modal_venue"
                                        value={data.venue}
                                        onChange={(e) => setData('venue', e.target.value)}
                                        placeholder="Stade, adresse..."
                                        className="pl-9"
                                    />
                                </div>
                                {errors.venue && (
                                    <p className="text-sm text-destructive">{errors.venue}</p>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex flex-row justify-between gap-2 border-t pt-4 sm:justify-between">
                        <div className="flex gap-2">
                            {step > 1 ? (
                                <Button type="button" variant="outline" onClick={goPrev}>
                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                    Retour
                                </Button>
                            ) : (
                                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                                    Annuler
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {step < 5 ? (
                                <Button type="button" onClick={goNext} disabled={!canNext()}>
                                    Suivant
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={processing || !canNext()} className="bg-primary hover:bg-primary/90">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Programmer le match
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
