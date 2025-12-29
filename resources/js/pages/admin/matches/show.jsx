import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    ArrowLeft, Trophy, Home, Plane, Clock, Users, Target, 
    Card as CardIcon, AlertTriangle, CheckCircle2, Edit, Save
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MatchShow({ match, teamPlayers, existingLineup = [] }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditingScores, setIsEditingScores] = useState(false);
    const [lineupDialogOpen, setLineupDialogOpen] = useState(false);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);

    const { data: scoreData, setData: setScoreData, put: updateMatch } = useForm({
        home_score: match.home_score || null,
        away_score: match.away_score || null,
        status: match.status,
    });

    const { data: lineupData, setData: setLineupData, post: saveLineup } = useForm({
        lineup: existingLineup.length > 0 ? existingLineup : [],
    });

    const { data: eventData, setData: setEventData, post: addEvent } = useForm({
        type: 'goal',
        player_id: '',
        minute: '',
        description: '',
    });

    const handleSaveScores = () => {
        updateMatch(`/admin/matches/${match.id}`, {
            onSuccess: () => {
                setIsEditingScores(false);
            },
        });
    };

    const handleSaveLineup = () => {
        saveLineup(`/admin/matches/${match.id}/lineup`, {
            onSuccess: () => {
                setLineupDialogOpen(false);
            },
        });
    };

    const handleAddEvent = () => {
        addEvent(`/admin/matches/${match.id}/events`, {
            onSuccess: () => {
                setEventDialogOpen(false);
                setEventData({
                    type: 'goal',
                    player_id: '',
                    minute: '',
                    description: '',
                });
            },
        });
    };

    const eventTypes = {
        goal: { label: 'But', icon: Target, color: 'text-green-600' },
        yellow_card: { label: 'Carton Jaune', icon: CardIcon, color: 'text-yellow-600' },
        red_card: { label: 'Carton Rouge', icon: CardIcon, color: 'text-red-600' },
        injury: { label: 'Blessure', icon: AlertTriangle, color: 'text-orange-600' },
        substitution: { label: 'Remplacement', icon: Users, color: 'text-blue-600' },
    };

    const startingXI = lineupData.lineup.filter(p => p.position === 'titulaire' && p.starting_position).sort((a, b) => a.starting_position - b.starting_position);
    const substitutes = lineupData.lineup.filter(p => p.position === 'remplacante');

    return (
        <AdminLayout>
            <Head title={`Match: ${match.team?.name || 'Match'}`} />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/admin/matches">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                    <Link href={`/admin/matches/${match.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>

                {/* Match Info Card */}
                <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Badge>{match.category}</Badge>
                                <Badge variant={match.status === 'finished' ? 'default' : 'outline'}>
                                    {match.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {new Date(match.scheduled_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between py-6">
                            <div className="flex-1 text-center">
                                <h3 className="font-bold text-xl mb-2">{match.team?.name}</h3>
                                <p className="text-sm text-muted-foreground">{match.team?.category}</p>
                            </div>
                            <div className="px-8">
                                {isEditingScores ? (
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            value={scoreData.home_score || ''}
                                            onChange={(e) => setScoreData('home_score', parseInt(e.target.value) || null)}
                                            className="w-16 text-center text-2xl font-black"
                                        />
                                        <span className="text-3xl font-black">-</span>
                                        <Input
                                            type="number"
                                            value={scoreData.away_score || ''}
                                            onChange={(e) => setScoreData('away_score', parseInt(e.target.value) || null)}
                                            className="w-16 text-center text-2xl font-black"
                                        />
                                        <Button onClick={handleSaveScores} size="sm">
                                            <Save className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-primary mb-2">
                                            {match.home_score !== null && match.away_score !== null
                                                ? match.type === 'domicile'
                                                    ? `${match.home_score} - ${match.away_score}`
                                                    : `${match.away_score} - ${match.home_score}`
                                                : '-'
                                            }
                                        </div>
                                        {match.status === 'finished' && (
                                            <Button variant="ghost" size="sm" onClick={() => setIsEditingScores(true)}>
                                                Modifier
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center">
                                {match.opponent_team ? (
                                    <>
                                        {match.opponent_team.logo && (
                                            <img 
                                                src={`/storage/${match.opponent_team.logo}`} 
                                                alt={match.opponent_team.name}
                                                className="w-16 h-16 mx-auto mb-2 rounded-full object-cover"
                                            />
                                        )}
                                        <h3 className="font-bold text-xl mb-2">{match.opponent_team.name}</h3>
                                    </>
                                ) : (
                                    <h3 className="font-bold text-xl mb-2">{match.opponent}</h3>
                                )}
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    {match.type === 'domicile' ? (
                                        <Home className="w-4 h-4" />
                                    ) : (
                                        <Plane className="w-4 h-4" />
                                    )}
                                    <span>{match.type === 'domicile' ? 'Domicile' : 'Extérieur'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center text-sm text-muted-foreground border-t pt-4">
                            <Trophy className="w-4 h-4 inline mr-2" />
                            {match.venue}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="lineup">Composition</TabsTrigger>
                        <TabsTrigger value="events">Événements</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Composition
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {startingXI.length} titulaire{startingXI.length > 1 ? 's' : ''} / {substitutes.length} remplaçante{substitutes.length > 1 ? 's' : ''}
                                    </p>
                                    <Button onClick={() => setLineupDialogOpen(true)} className="w-full">
                                        Gérer la composition
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Événements du match
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {match.events?.length || 0} événement{(match.events?.length || 0) > 1 ? 's' : ''}
                                    </p>
                                    <Button onClick={() => setEventDialogOpen(true)} className="w-full">
                                        Ajouter un événement
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="lineup">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Composition</CardTitle>
                                    <Button onClick={() => setLineupDialogOpen(true)}>
                                        Modifier
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3">XI Titulaire</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {startingXI.map((player, idx) => {
                                                const playerInfo = teamPlayers.find(p => p.id === player.player_id);
                                                return (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-card rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-primary w-6">{player.starting_position}</span>
                                                            <span>{playerInfo?.first_name} {playerInfo?.last_name}</span>
                                                            <Badge variant="outline">{playerInfo?.position}</Badge>
                                                        </div>
                                                        {player.jersey_number && (
                                                            <Badge>#{player.jersey_number}</Badge>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {substitutes.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">Remplaçantes</h3>
                                            <div className="grid grid-cols-1 gap-2">
                                                {substitutes.map((player, idx) => {
                                                    const playerInfo = teamPlayers.find(p => p.id === player.player_id);
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-card rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <span>{playerInfo?.first_name} {playerInfo?.last_name}</span>
                                                                <Badge variant="outline">{playerInfo?.position}</Badge>
                                                            </div>
                                                            {player.jersey_number && (
                                                                <Badge>#{player.jersey_number}</Badge>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="events">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Événements du match</CardTitle>
                                    <Button onClick={() => setEventDialogOpen(true)}>
                                        Ajouter
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {match.events?.length > 0 ? (
                                        match.events.map((event) => {
                                            const eventType = eventTypes[event.type] || { label: event.type, icon: Target, color: 'text-gray-600' };
                                            const Icon = eventType.icon;
                                            return (
                                                <div key={event.id} className="flex items-center justify-between p-3 bg-card rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Icon className={`w-5 h-5 ${eventType.color}`} />
                                                        <div>
                                                            <span className="font-semibold">{event.player?.first_name} {event.player?.last_name}</span>
                                                            <span className="text-sm text-muted-foreground ml-2">({event.minute}')</span>
                                                        </div>
                                                    </div>
                                                    <Badge>{eventType.label}</Badge>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">Aucun événement enregistré</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notes">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes du match</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Rapport de match</Label>
                                        <p className="mt-2 p-4 bg-card rounded-lg min-h-[100px]">
                                            {match.match_report || 'Aucun rapport enregistré'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label>Notes de l'entraîneur</Label>
                                        <p className="mt-2 p-4 bg-card rounded-lg min-h-[100px]">
                                            {match.coach_notes || 'Aucune note enregistrée'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Lineup Dialog */}
                <Dialog open={lineupDialogOpen} onOpenChange={setLineupDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Gérer la composition</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Titulaires</Label>
                                <div className="grid grid-cols-1 gap-2 mt-2">
                                    {teamPlayers.map((player) => {
                                        const inLineup = lineupData.lineup.find(l => l.player_id === player.id);
                                        return (
                                            <div key={player.id} className="flex items-center gap-3 p-2 border rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={!!inLineup}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setLineupData('lineup', [
                                                                ...lineupData.lineup,
                                                                {
                                                                    player_id: player.id,
                                                                    position: 'titulaire',
                                                                    jersey_number: player.jersey_number,
                                                                    starting_position: null,
                                                                }
                                                            ]);
                                                        } else {
                                                            setLineupData('lineup', lineupData.lineup.filter(l => l.player_id !== player.id));
                                                        }
                                                    }}
                                                />
                                                <span className="flex-1">{player.first_name} {player.last_name}</span>
                                                <Badge variant="outline">{player.position}</Badge>
                                                {inLineup && (
                                                    <Input
                                                        type="number"
                                                        placeholder="Position"
                                                        value={inLineup.starting_position || ''}
                                                        onChange={(e) => {
                                                            setLineupData('lineup', lineupData.lineup.map(l => 
                                                                l.player_id === player.id 
                                                                    ? { ...l, starting_position: parseInt(e.target.value) || null }
                                                                    : l
                                                            ));
                                                        }}
                                                        className="w-20"
                                                        min="1"
                                                        max="11"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSaveLineup} className="flex-1">
                                    Enregistrer
                                </Button>
                                <Button variant="outline" onClick={() => setLineupDialogOpen(false)}>
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Event Dialog */}
                <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ajouter un événement</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Type</Label>
                                <Select value={eventData.type} onValueChange={(value) => setEventData('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(eventTypes).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Joueuse</Label>
                                <Select value={eventData.player_id} onValueChange={(value) => setEventData('player_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une joueuse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teamPlayers.map((player) => (
                                            <SelectItem key={player.id} value={player.id.toString()}>
                                                {player.first_name} {player.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Minute</Label>
                                <Input
                                    type="number"
                                    value={eventData.minute}
                                    onChange={(e) => setEventData('minute', e.target.value)}
                                    min="1"
                                    max="120"
                                />
                            </div>
                            <div>
                                <Label>Description (optionnel)</Label>
                                <Input
                                    value={eventData.description}
                                    onChange={(e) => setEventData('description', e.target.value)}
                                    placeholder="Description..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleAddEvent} className="flex-1">
                                    Ajouter
                                </Button>
                                <Button variant="outline" onClick={() => setEventDialogOpen(false)}>
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}

