import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import DeleteModal from '@/components/DeleteModal';
import {
    ArrowLeft, Edit, Users, Trophy, Calendar as CalendarIcon,
    TrendingUp, BarChart3, Copy, Download, MessageSquare,
    Clock, MapPin, Home, Plane, Award, Target, ArrowRight,
    ChevronDown, ChevronUp, Filter, X, Plus, Frown,
    MoreVertical, User, Filter as FilterIcon, Trash2, UserPlus
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DEFAULT_TEAM_IMAGE = '/assets/images/hero/usa_hero.jpg';

export default function SeasonsShow({ season, teamsNotInThisSeason = [] }) {
    const [assignTeamsModalOpen, setAssignTeamsModalOpen] = useState(false);
    const [assigningTeamId, setAssigningTeamId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [expandedCalendarCategories, setExpandedCalendarCategories] = useState({});
    
    // Calendar filters and sorting
    const [matchStatusFilter, setMatchStatusFilter] = useState('all'); // all, played, upcoming
    const [matchSortBy, setMatchSortBy] = useState('date'); // date, team, opponent, score
    
    // Match modal
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matchModalOpen, setMatchModalOpen] = useState(false);
    const [selectedMatchDetails, setSelectedMatchDetails] = useState(null);
    
    // Event form
    const eventForm = useForm({
        type: 'goal',
        player_id: '',
        minute: '',
        description: '',
        substituted_player_id: '',
    });

    // Finish match form
    const finishMatchForm = useForm({
        home_score: '',
        away_score: '',
        match_report: '',
        coach_notes: '',
    });

    // Update score form
    const updateScoreForm = useForm({
        home_score: '',
        away_score: '',
    });

    // Group matches and trainings by category
    const eventsByCategory = useMemo(() => {
        const grouped = {};

        // Group matches
        (season.matches || []).forEach(match => {
            const cat = match.category || 'Autre';
            if (!grouped[cat]) grouped[cat] = { matches: [], trainings: [] };
            grouped[cat].matches.push(match);
        });

        // Group trainings
        (season.trainings || []).forEach(training => {
            const cat = training.category || 'Autre';
            if (!grouped[cat]) grouped[cat] = { matches: [], trainings: [] };
            grouped[cat].trainings.push(training);
        });

        return grouped;
    }, [season.matches, season.trainings]);

    // Group standings by category
    const standingsByCategory = useMemo(() => {
        const grouped = {};
        (season.standings || []).forEach(team => {
            const cat = team.category || 'Autre';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(team);
        });

        // Sort each category by points, goal difference, goals for
        Object.keys(grouped).forEach(cat => {
            grouped[cat] = grouped[cat].sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
                return b.goals_for - a.goals_for;
            });
        });

        return grouped;
    }, [season.standings]);

    // Get categories ordered: Senior first, then others
    const orderedCategories = useMemo(() => {
        const cats = Object.keys(eventsByCategory);
        const seniorIndex = cats.indexOf('Senior');
        if (seniorIndex > -1) {
            const senior = cats.splice(seniorIndex, 1)[0];
            return [senior, ...cats.sort()];
        }
        return cats.sort();
    }, [eventsByCategory]);

    const filteredStandings = useMemo(() => {
        if (selectedCategory === 'all') return season.standings || [];
        return (season.standings || []).filter(s => s.category === selectedCategory);
    }, [selectedCategory, season.standings]);

    const filteredTopScorers = useMemo(() => {
        if (selectedCategory === 'all') return season.top_scorers || [];
        return (season.top_scorers || []).filter(s => s.category === selectedCategory);
    }, [selectedCategory, season.top_scorers]);

    const handleDuplicate = () => {
        if (confirm('Voulez-vous dupliquer cette saison avec les mêmes paramètres ?')) {
            router.post(`/admin/seasons/${season.id}/duplicate`, {}, {
                onSuccess: () => {
                    // Will be handled by backend
                }
            });
        }
    };

    const handleExport = () => {
        window.open(`/admin/seasons/${season.id}/export`, '_blank');
    };

    const handleBulkMessage = () => {
        router.visit(`/admin/seasons/${season.id}/bulk-message`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMatchDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long'
        }).toUpperCase();
    };

    const formatMatchTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isMatchPlayed = (match) => {
        return match.status === 'finished' && match.home_score !== null && match.away_score !== null;
    };

    const isMatchUpcoming = (match) => {
        return match.status === 'scheduled' || match.status === 'live';
    };

    // Filter and sort matches
    const getFilteredAndSortedMatches = (matches) => {
        let filtered = [...matches];
        
        // Filter by status
        if (matchStatusFilter === 'played') {
            filtered = filtered.filter(m => m.status === 'finished' && m.home_score !== null && m.away_score !== null);
        } else if (matchStatusFilter === 'upcoming') {
            filtered = filtered.filter(m => m.status === 'scheduled' || m.status === 'live');
        }
        
        // Sort
        switch (matchSortBy) {
            case 'date':
                filtered.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
                break;
            case 'team':
                filtered.sort((a, b) => a.team_name.localeCompare(b.team_name));
                break;
            case 'opponent':
                filtered.sort((a, b) => a.opponent.localeCompare(b.opponent));
                break;
            case 'score':
                filtered.sort((a, b) => {
                    const scoreA = (a.home_score || 0) + (a.away_score || 0);
                    const scoreB = (b.home_score || 0) + (b.away_score || 0);
                    return scoreB - scoreA;
                });
                break;
            default:
                filtered.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
        }
        
        return filtered;
    };

    const handleMatchClick = async (match) => {
        setSelectedMatch(match);
        setMatchModalOpen(true);
        // Initialize forms with current match data
        finishMatchForm.setData({
            home_score: match.home_score || '',
            away_score: match.away_score || '',
            match_report: '',
            coach_notes: '',
        });
        updateScoreForm.setData({
            home_score: match.home_score || '',
            away_score: match.away_score || '',
        });
        // Set basic match details from the match data we have
        setSelectedMatchDetails({
            ...match,
            events: [],
            team: season.teams?.find(t => t.name === match.team_name) || null
        });
        // Fetch full match details by visiting the match page and extracting data
        router.visit(`/admin/matches/${match.id}`, {
            preserveState: true,
            preserveScroll: true,
            only: ['match'],
            onSuccess: (page) => {
                if (page.props.match) {
                    setSelectedMatchDetails(page.props.match);
                    // Update forms with fetched data
                    finishMatchForm.setData({
                        home_score: page.props.match.home_score || '',
                        away_score: page.props.match.away_score || '',
                        match_report: page.props.match.match_report || '',
                        coach_notes: page.props.match.coach_notes || '',
                    });
                    updateScoreForm.setData({
                        home_score: page.props.match.home_score || '',
                        away_score: page.props.match.away_score || '',
                    });
                }
            }
        });
    };

    const handleCreateEvent = (e) => {
        e.preventDefault();
        if (!selectedMatch) return;
        
        eventForm.post(`/admin/matches/${selectedMatch.id}/events`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Reload match details
                router.visit(`/admin/matches/${selectedMatch.id}`, {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['match'],
                    onSuccess: (page) => {
                        if (page.props.match) {
                            setSelectedMatchDetails(page.props.match);
                        }
                        eventForm.reset();
                    }
                });
            }
        });
    };

    const handleFinishMatch = (e) => {
        e.preventDefault();
        if (!selectedMatch) return;
        
        finishMatchForm.post(`/admin/matches/${selectedMatch.id}/finish`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['season'] });
                setMatchModalOpen(false);
                finishMatchForm.reset();
            }
        });
    };

    const handleUpdateScore = (e) => {
        e.preventDefault();
        if (!selectedMatch) return;
        
        updateScoreForm.post(`/admin/matches/${selectedMatch.id}/update-score`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['season'] });
                // Also reload match details if modal is still open
                if (selectedMatch) {
                    router.visit(`/admin/matches/${selectedMatch.id}`, {
                        preserveState: true,
                        preserveScroll: true,
                        only: ['match'],
                        onSuccess: (page) => {
                            if (page.props.match) {
                                setSelectedMatchDetails(page.props.match);
                            }
                            updateScoreForm.reset();
                        }
                    });
                }
            }
        });
    };

    const [squadCategoryFilter, setSquadCategoryFilter] = useState('all');
    const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
    const [editTeamModalOpen, setEditTeamModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [deleteTeamModalOpen, setDeleteTeamModalOpen] = useState(false);

    const createTeamForm = useForm({
        season_id: '',
        category: '',
        division: '',
        name: '',
        description: '',
        is_active: true,
        return_to_season_id: '',
    });

    const editTeamForm = useForm({
        season_id: '',
        name: '',
        category: '',
        division: '',
        description: '',
        is_active: true,
        return_to_season_id: '',
    });

    const openCreateTeamModal = () => {
        createTeamForm.setData({
            season_id: season.id,
            category: '',
            division: '',
            name: '',
            description: '',
            is_active: true,
            return_to_season_id: season.id,
        });
        setCreateTeamModalOpen(true);
    };

    const handleCreateTeam = (e) => {
        e.preventDefault();
        createTeamForm.post('/admin/teams', {
            preserveScroll: true,
            onSuccess: () => setCreateTeamModalOpen(false),
        });
    };

    const openEditTeamModal = (team) => {
        setSelectedTeam(team);
        editTeamForm.setData({
            season_id: season.id,
            name: team.name,
            category: team.category,
            division: team.division || '',
            description: team.description || '',
            is_active: team.is_active ?? true,
            return_to_season_id: season.id,
        });
        setEditTeamModalOpen(true);
    };

    const handleEditTeam = (e) => {
        e.preventDefault();
        if (!selectedTeam) return;
        editTeamForm.put(`/admin/teams/${selectedTeam.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditTeamModalOpen(false);
                setSelectedTeam(null);
            },
        });
    };

    const handleDeleteTeam = () => {
        if (!teamToDelete) return;
        router.delete(`/admin/teams/${teamToDelete}?return_to_season_id=${season.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTeamModalOpen(false);
                setTeamToDelete(null);
            },
        });
    };

    const filteredSquads = useMemo(() => {
        const teams = season.teams || [];
        if (squadCategoryFilter === 'all') return teams;
        return teams.filter(t => t.category === squadCategoryFilter);
    }, [season.teams, squadCategoryFilter]);

    return (
        <AdminLayout>
            <Head title={season.name} />
            <div className="min-h-screen  w-full ">
                <div className="space-y-6 p-4 sm:p-6 ">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/admin/dashboard" className="hover:text-foreground">Accueil</Link>
                        <span>/</span>
                        <Link href="/admin/seasons" className="hover:text-foreground">Saisons</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{season.name}</span>
                    </nav>

                    {/* Season Overview Header + Create New Team */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {season.name} – Aperçu
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-base mt-1">
                                Gérez les effectifs, équipes et staff pour ce cycle.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto shrink-0"
                                onClick={() => setAssignTeamsModalOpen(true)}
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                Affecter des équipes
                            </Button>
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto shrink-0"
                                onClick={openCreateTeamModal}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nouvelle équipe
                            </Button>
                        </div>
                    </div>

                    {/* Assign teams modal */}
                    <Dialog open={assignTeamsModalOpen} onOpenChange={setAssignTeamsModalOpen}>
                        <DialogContent className="max-h-[85vh] overflow-hidden flex flex-col sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Équipes à affecter à cette saison</DialogTitle>
                                <DialogDescription>
                                    Sélectionnez une équipe pour l&apos;affecter à la saison &quot;{season.name}&quot;. Les équipes listées appartiennent actuellement à une autre saison ou n&apos;ont pas de saison.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6">
                                {teamsNotInThisSeason.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-6 text-center">
                                        Aucune équipe disponible à affecter. Toutes les équipes sont déjà dans cette saison.
                                    </p>
                                ) : (
                                    <ul className="space-y-2 py-2">
                                        {teamsNotInThisSeason.map((team) => (
                                            <li
                                                key={team.id}
                                                className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3"
                                            >
                                                <div>
                                                    <p className="font-medium text-foreground">{team.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {team.category}
                                                        {team.division && ` • ${team.division}`}
                                                        {team.season && ` • Saison: ${team.season.name}`}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                                                    disabled={assigningTeamId === team.id}
                                                    onClick={() => {
                                                        setAssigningTeamId(team.id);
                                                        router.post(`/admin/seasons/${season.id}/assign-team`, { team_id: team.id }, {
                                                            preserveScroll: true,
                                                            onSuccess: () => {
                                                                setAssigningTeamId(null);
                                                                setAssignTeamsModalOpen(false);
                                                            },
                                                            onError: () => setAssigningTeamId(null),
                                                            onFinish: () => setAssigningTeamId(null),
                                                        });
                                                    }}
                                                >
                                                    {assigningTeamId === team.id ? 'Affectation…' : 'Affecter à cette saison'}
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Active Squads */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="text-lg sm:text-xl font-bold text-primary">Effectifs actifs</h2>
                            <Select value={squadCategoryFilter} onValueChange={setSquadCategoryFilter}>
                                <SelectTrigger className="w-fit px-2 h-9 bg-card border rounded-lg">
                                    <FilterIcon className="w-4 h-4 mr-1 sm:mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Filtrer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes</SelectItem>
                                    {(season.categories || []).map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                            {(filteredSquads || []).map((team) => (
                                <Card key={team.id} className="overflow-hidden border p-0 rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow flex flex-col">
                                    <div className="relative h-32 sm:h-36 overflow-hidden bg-muted">
                                        <img
                                            src={team.image || DEFAULT_TEAM_IMAGE}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-0 right-2 flex flex-col items-end h-full justify-between py-3 gap-1">
                                            <span className={`inline-flex rounded-lg items-center  px-2 py-0.5 text-xs font-medium uppercase ${
                                                team.is_active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}>
                                                {team.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            {!team.roster_complete && (
                                                <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium uppercase bg-amber-500 text-white">
                                                    Effectif incomplet
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute top-2 left-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white" onClick={(e) => e.stopPropagation()}>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem onClick={() => router.visit(`/admin/teams/${team.id}`)}>
                                                        <Users className="w-4 h-4 mr-2" /> Voir l&apos;équipe
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEditTeamModal(team)}>
                                                        <Edit className="w-4 h-4 mr-2" /> Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => {
                                                            setTeamToDelete(team.id);
                                                            setDeleteTeamModalOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <CardContent className="p-3 sm:p-4 flex flex-col flex-1">
                                        <h3 className="font-bold text-foreground text-base truncate">{team.name}</h3>
                                        {team.coach_name && (
                                            <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <User className="w-4 h-4 shrink-0" />
                                                <span className="truncate">Coach: {team.coach_name}</span>
                                            </p>
                                        )}
                                        <p className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                            <Users className="w-4 h-4 shrink-0" />
                                            <span>{team.players_count ?? 0} joueur{(team.players_count ?? 0) !== 1 ? 's' : ''} inscrit{(team.players_count ?? 0) !== 1 ? 's' : ''}</span>
                                        </p>
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                                {team.division || team.category}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3 w-full border-primary text-primary hover:bg-primary/10"
                                            onClick={() => router.visit(`/admin/teams/${team.id}`)}
                                        >
                                            Voir l&apos;équipe
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {(!filteredSquads || filteredSquads.length === 0) && (
                            <Card className="border-2 border-dashed border-border bg-card">
                                <CardContent className="py-10 text-center">
                                    <p className="text-muted-foreground">Aucune équipe dans cette saison.</p>
                                    <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={openCreateTeamModal}>
                                        <Plus className="w-4 h-4 mr-2" /> Nouvelle équipe
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Season Planning & Insights */}
                    <Card className="rounded-xl border bg-card shadow-sm">
                        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-primary text-lg">Planification & suivi</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Utilisez cet aperçu pour suivre les délais d&apos;inscription, les affectations des coachs et la taille des effectifs par catégorie. Besoin d&apos;une nouvelle équipe ? Utilisez l&apos;action « Nouvelle équipe » pour commencer.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 shrink-0">
                                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={handleExport}>
                                    <Download className="w-4 h-4 mr-2" /> Exporter les stats
                                </Button>
                                <Link href={`/admin/seasons/${season.id}`}>
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <CalendarIcon className="w-4 h-4 mr-2" /> Calendrier de la saison
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Create Team Modal */}
                    <Dialog open={createTeamModalOpen} onOpenChange={setCreateTeamModalOpen}>
                        <DialogContent className="bg-card border border-border text-foreground sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-primary text-xl font-bold">Nouvelle équipe</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    L&apos;équipe sera liée à la saison {season.name}.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateTeam} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create_team_category">Catégorie *</Label>
                                        <Select
                                            value={createTeamForm.data.category}
                                            onValueChange={(v) => createTeamForm.setData('category', v)}
                                            required
                                        >
                                            <SelectTrigger id="create_team_category" className="bg-background border-border">
                                                <SelectValue placeholder="Choisir" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="U13">U13</SelectItem>
                                                <SelectItem value="U15">U15</SelectItem>
                                                <SelectItem value="U17">U17</SelectItem>
                                                <SelectItem value="Senior">Senior</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={createTeamForm.errors.category} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create_team_name">Nom *</Label>
                                        <Input
                                            id="create_team_name"
                                            value={createTeamForm.data.name}
                                            onChange={(e) => createTeamForm.setData('name', e.target.value)}
                                            placeholder="Ex: U17 A"
                                            required
                                            className="bg-background border-border"
                                        />
                                        <InputError message={createTeamForm.errors.name} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create_team_division">Division</Label>
                                    <Input
                                        id="create_team_division"
                                        value={createTeamForm.data.division}
                                        onChange={(e) => createTeamForm.setData('division', e.target.value)}
                                        placeholder="Ex: Division 1, Premier Division"
                                        className="bg-background border-border"
                                    />
                                    <InputError message={createTeamForm.errors.division} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create_team_description">Description</Label>
                                    <textarea
                                        id="create_team_description"
                                        value={createTeamForm.data.description}
                                        onChange={(e) => createTeamForm.setData('description', e.target.value)}
                                        className="w-full min-h-[80px] px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Optionnel"
                                    />
                                    <InputError message={createTeamForm.errors.description} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="create_team_is_active"
                                        checked={createTeamForm.data.is_active}
                                        onCheckedChange={(checked) => createTeamForm.setData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="create_team_is_active" className="cursor-pointer text-sm">Équipe active</Label>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button type="button" variant="outline" onClick={() => setCreateTeamModalOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={createTeamForm.processing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        {createTeamForm.processing ? 'Création...' : 'Créer'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Team Modal */}
                    <Dialog open={editTeamModalOpen} onOpenChange={setEditTeamModalOpen}>
                        <DialogContent className="bg-card border border-border text-foreground sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-primary text-xl font-bold">Modifier l&apos;équipe</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    {selectedTeam?.name}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEditTeam} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_team_category">Catégorie *</Label>
                                        <Select
                                            value={editTeamForm.data.category}
                                            onValueChange={(v) => editTeamForm.setData('category', v)}
                                            required
                                        >
                                            <SelectTrigger id="edit_team_category" className="bg-background border-border">
                                                <SelectValue placeholder="Choisir" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="U13">U13</SelectItem>
                                                <SelectItem value="U15">U15</SelectItem>
                                                <SelectItem value="U17">U17</SelectItem>
                                                <SelectItem value="Senior">Senior</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={editTeamForm.errors.category} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_team_name">Nom *</Label>
                                        <Input
                                            id="edit_team_name"
                                            value={editTeamForm.data.name}
                                            onChange={(e) => editTeamForm.setData('name', e.target.value)}
                                            required
                                            className="bg-background border-border"
                                        />
                                        <InputError message={editTeamForm.errors.name} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_team_division">Division</Label>
                                    <Input
                                        id="edit_team_division"
                                        value={editTeamForm.data.division}
                                        onChange={(e) => editTeamForm.setData('division', e.target.value)}
                                        placeholder="Ex: Division 1, Premier Division"
                                        className="bg-background border-border"
                                    />
                                    <InputError message={editTeamForm.errors.division} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_team_description">Description</Label>
                                    <textarea
                                        id="edit_team_description"
                                        value={editTeamForm.data.description}
                                        onChange={(e) => editTeamForm.setData('description', e.target.value)}
                                        className="w-full min-h-[80px] px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <InputError message={editTeamForm.errors.description} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit_team_is_active"
                                        checked={editTeamForm.data.is_active}
                                        onCheckedChange={(checked) => editTeamForm.setData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="edit_team_is_active" className="cursor-pointer text-sm">Équipe active</Label>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button type="button" variant="outline" onClick={() => setEditTeamModalOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={editTeamForm.processing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        {editTeamForm.processing ? 'Enregistrement...' : 'Enregistrer'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <DeleteModal
                        open={deleteTeamModalOpen}
                        onOpenChange={setDeleteTeamModalOpen}
                        onConfirm={handleDeleteTeam}
                        title="Supprimer l&apos;équipe"
                        description="Cette équipe sera définitivement supprimée. Cette action est irréversible."
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
