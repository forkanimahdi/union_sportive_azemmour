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
import {
    ArrowLeft, Edit, Users, Trophy, Calendar as CalendarIcon,
    TrendingUp, BarChart3, Copy, Download, MessageSquare,
    Clock, MapPin, Home, Plane, Award, Target, ArrowRight,
    ChevronDown, ChevronUp, Filter, X, Plus, Frown,
    MoreVertical, User, Filter as FilterIcon
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DEFAULT_TEAM_IMAGE = '/assets/images/hero/usa_hero.jpg';

export default function SeasonsShow({ season }) {
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
    const filteredSquads = useMemo(() => {
        const teams = season.teams || [];
        if (squadCategoryFilter === 'all') return teams;
        return teams.filter(t => t.category === squadCategoryFilter);
    }, [season.teams, squadCategoryFilter]);

    return (
        <AdminLayout>
            <Head title={season.name} />
            <div className="min-h-screen bg-background">
                <div className="space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
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
                        <Link href={`/admin/seasons/${season.id}/teams/create`}>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto shrink-0">
                                <Plus className="w-5 h-5 mr-2" />
                                Nouvelle équipe
                            </Button>
                        </Link>
                    </div>

                    {/* Active Squads */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="text-lg sm:text-xl font-bold text-primary">Effectifs actifs</h2>
                            <Select value={squadCategoryFilter} onValueChange={setSquadCategoryFilter}>
                                <SelectTrigger className="w-[140px] sm:w-[180px] h-9 bg-card border rounded-lg">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {(filteredSquads || []).map((team) => (
                                <Card key={team.id} className="overflow-hidden border rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow flex flex-col">
                                    <div className="relative h-32 sm:h-36 overflow-hidden bg-muted">
                                        <img
                                            src={team.image || DEFAULT_TEAM_IMAGE}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 flex items-center gap-1">
                                            <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium uppercase ${
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
                                                    <DropdownMenuItem onClick={() => router.visit(`/admin/teams/${team.id}/edit`)}>
                                                        <Edit className="w-4 h-4 mr-2" /> Modifier
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
                                        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">
                                            {team.category}
                                        </p>
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
                                    <Link href={`/admin/seasons/${season.id}/teams/create`} className="inline-block mt-3">
                                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                            <Plus className="w-4 h-4 mr-2" /> Nouvelle équipe
                                        </Button>
                                    </Link>
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

                    {/* Legacy actions row */}
                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/seasons">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux saisons
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={handleDuplicate}>
                            <Copy className="w-4 h-4 mr-2" /> Dupliquer
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleBulkMessage}>
                            <MessageSquare className="w-4 h-4 mr-2" /> Message
                        </Button>
                        <Link href={`/admin/seasons/${season.id}/edit`}>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Edit className="w-4 h-4 mr-2" /> Modifier la saison
                            </Button>
                        </Link>
                    </div>

                    {/* Tabs - Calendar, Standings, Statistics */}
                    <Tabs defaultValue="calendar" className="space-y-6">
                        <TabsList className="bg-primary/80 border-primary/20 p-1 h-auto">
                            <TabsTrigger
                                value="calendar"
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                                <CalendarIcon className="w-4 h-4" />
                                Calendrier
                            </TabsTrigger>
                            <TabsTrigger
                                value="standings"
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Classement
                            </TabsTrigger>
                            <TabsTrigger
                                value="statistics"
                                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-white/80 px-6 py-3"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Statistiques
                            </TabsTrigger>
                        </TabsList>

                        {/* Calendar Tab - Match Fixture Cards */}
                        <TabsContent value="calendar" className="space-y-6">
                            {/* Filters and Sort */}
                            <Card className="bg-white border-2 border-gray-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-5 h-5 text-gray-600" />
                                            <span className="font-semibold text-gray-700">Filtres:</span>
                                        </div>
                                        <Select value={matchStatusFilter} onValueChange={setMatchStatusFilter}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tous les matchs</SelectItem>
                                                <SelectItem value="played">Matchs joués</SelectItem>
                                                <SelectItem value="upcoming">Matchs à venir</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={matchSortBy} onValueChange={setMatchSortBy}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="date">Par date</SelectItem>
                                                <SelectItem value="team">Par équipe</SelectItem>
                                                <SelectItem value="opponent">Par adversaire</SelectItem>
                                                <SelectItem value="score">Par score</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {(matchStatusFilter !== 'all' || matchSortBy !== 'date') && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setMatchStatusFilter('all');
                                                    setMatchSortBy('date');
                                                }}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Réinitialiser
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {orderedCategories.length > 0 ? (
                                orderedCategories.map((category, catIndex) => {
                                    const events = eventsByCategory[category];
                                    const matches = events.matches || [];
                                    const trainings = events.trainings || [];
                                    
                                    // Filter and sort matches
                                    const filteredSortedMatches = getFilteredAndSortedMatches(matches);
                                    const sortedTrainings = [...trainings].sort((a, b) => new Date(a.date || a.scheduled_at) - new Date(b.date || b.scheduled_at));

                                    if (matches.length === 0 && trainings.length === 0 && selectedCategory !== 'all' && selectedCategory !== category) return null;

                                    const isExpanded = expandedCalendarCategories[category] || false;
                                    
                                    const toggleExpand = () => {
                                        setExpandedCalendarCategories(prev => ({
                                            ...prev,
                                            [category]: !prev[category]
                                        }));
                                    };

                                    // Show only first 5 matches by default, all if expanded
                                    const displayedMatches = isExpanded ? filteredSortedMatches : filteredSortedMatches.slice(0, 5);

                                    return (
                                        <div key={category} className="space-y-4">
                                            {/* Category Header */}
                                            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Trophy className={`w-6 h-6 ${catIndex % 2 === 0 ? 'text-alpha' : 'text-beta'}`} />
                                                    <h2 className={`text-2xl font-black ${catIndex % 2 === 0 ? 'text-alpha' : 'text-beta'}`}>
                                                        {category}
                                                    </h2>
                                                    <Badge className={`${catIndex % 2 === 0 ? 'bg-alpha/10 text-alpha border-alpha' : 'bg-beta/10 text-beta border-beta'} border`}>
                                                        {filteredSortedMatches.length} match{filteredSortedMatches.length !== 1 ? 'es' : ''}
                                                        {trainings.length > 0 && ` • ${trainings.length} entraînement${trainings.length !== 1 ? 's' : ''}`}
                                                    </Badge>
                                                </div>
                                                {filteredSortedMatches.length > 5 && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={toggleExpand}
                                                        className={`${catIndex % 2 === 0 ? 'border-alpha text-alpha hover:bg-alpha/10' : 'border-beta text-beta hover:bg-beta/10'}`}
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <ChevronUp className="w-4 h-4 sm:mr-2" />
                                                                <span className="hidden sm:inline">Réduire</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-4 h-4 sm:mr-2" />
                                                                <span className="hidden sm:inline">Voir tout ({filteredSortedMatches.length})</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>

                                            {/* Match Fixture Cards */}
                                            {displayedMatches.length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {displayedMatches.map((match) => {
                                                        const played = isMatchPlayed(match);
                                                        const upcoming = isMatchUpcoming(match);
                                                        const isHome = match.type === 'domicile';
                                                        
                                                        // Determine scores - swap if away match
                                                        const ourScore = isHome ? match.home_score : match.away_score;
                                                        const opponentScore = isHome ? match.away_score : match.home_score;
                                                        
                                                        return (
                                                            <Card key={match.id} className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                                                                <CardContent className="p-6">
                                                                    {/* Teams and Score */}
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        {/* Home Team (Our Team) */}
                                                                        <div className="flex-1 text-center">
                                                                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                                                                                <Users className="w-6 h-6 text-gray-400" />
                                                                            </div>
                                                                            <div className="font-bold text-sm text-gray-900">{match.team_name}</div>
                                                                        </div>

                                                                        {/* Score Box */}
                                                                        <div className={`px-4 py-2 rounded-lg ${played ? 'bg-alpha/10' : 'bg-gray-100'}`}>
                                                                            <div className={`text-2xl font-black ${played ? 'text-alpha' : 'text-gray-500'}`}>
                                                                                {played 
                                                                                    ? `${ourScore !== null ? ourScore : '-'} - ${opponentScore !== null ? opponentScore : '-'}`
                                                                                    : '0 - 0'
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                        {/* Away Team (Opponent) */}
                                                                        <div className="flex-1 text-center">
                                                                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                                                                                <Users className="w-6 h-6 text-gray-400" />
                                                                            </div>
                                                                            <div className="font-bold text-sm text-gray-900">{match.opponent}</div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Match Details */}
                                                                    <div className="space-y-2 mb-4">
                                                                        <div className="text-xs text-gray-500 font-medium">
                                                                            {formatMatchDate(match.scheduled_at)} • {match.venue?.toUpperCase()}
                                                                        </div>
                                                                        <div className={`text-lg font-bold ${played ? 'text-alpha' : 'text-gray-700'}`}>
                                                                            {formatMatchTime(match.scheduled_at)}
                                                                        </div>
                                                                    </div>

                                                                    {/* Status Badge */}
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        {match.status === 'finished' && (
                                                                            <Badge className="bg-alpha/10 text-alpha border-alpha">
                                                                                Terminé
                                                                            </Badge>
                                                                        )}
                                                                        {match.status === 'scheduled' && (
                                                                            <Badge className="bg-beta/10 text-beta border-beta">
                                                                                À venir
                                                                            </Badge>
                                                                        )}
                                                                        {match.status === 'live' && (
                                                                            <Badge className="bg-red-100 text-red-600 border-red-300 animate-pulse">
                                                                                En direct
                                                                            </Badge>
                                                                        )}
                                                                        {match.status === 'postponed' && (
                                                                            <Badge className="bg-yellow-100 text-yellow-600 border-yellow-300">
                                                                                Reporté
                                                                            </Badge>
                                                                        )}
                                                                        {match.status === 'cancelled' && (
                                                                            <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                                                                                Annulé
                                                                            </Badge>
                                                                        )}
                                                                        
                                                                        {match.type && (
                                                                            <div className={`text-xs font-semibold ${match.type === 'domicile' ? 'text-alpha' : 'text-beta'}`}>
                                                                                {match.type === 'domicile' ? '🏠 Domicile' : '✈️ Extérieur'}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Competition if available */}
                                                                    {match.competition && (
                                                                        <div className="text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                                                                            {match.competition}
                                                                        </div>
                                                                    )}

                                                                    {/* Action Button */}
                                                                    <Button
                                                                        variant="outline"
                                                                        className="w-full bg-alpha text-white hover:bg-alpha/90 border-alpha"
                                                                        onClick={() => handleMatchClick(match)}
                                                                    >
                                                                        {played ? 'Voir les détails' : 'Gérer le match'}
                                                                    </Button>
                                                                </CardContent>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Trainings Section */}
                                            {sortedTrainings.length > 0 && (
                                                <div className="mt-6">
                                                    <h3 className={`text-xl font-bold mb-4 ${catIndex % 2 === 0 ? 'text-alpha' : 'text-beta'}`}>
                                                        Entraînements
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {sortedTrainings.map((training) => (
                                                            <Card key={training.id} className="bg-white border-2 border-gray-200 shadow-lg">
                                                                <CardContent className="p-4">
                                                                    <div className="flex items-center gap-3 mb-3">
                                                                        <Target className={`w-5 h-5 ${catIndex % 2 === 0 ? 'text-alpha' : 'text-beta'}`} />
                                                                        <div className="font-bold text-gray-900">{training.team_name}</div>
                                                                    </div>
                                                                    <div className="space-y-2 text-sm text-gray-600">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className="w-4 h-4" />
                                                                            {formatDate(training.date || training.scheduled_at)}
                                                                        </div>
                                                                        {training.location && (
                                                                            <div className="flex items-center gap-2">
                                                                                <MapPin className="w-4 h-4" />
                                                                                {training.location}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {displayedMatches.length === 0 && sortedTrainings.length === 0 && (
                                                <Card className="bg-white border-2 border-gray-200">
                                                    <CardContent className="py-12 text-center">
                                                        <p className="text-gray-500">Aucun événement pour cette catégorie</p>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <Card className="bg-white border-2 border-gray-200">
                                    <CardContent className="py-20 text-center">
                                        <p className="text-gray-500 text-lg">Aucun événement programmé</p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Standings Tab - Table Format */}
                        <TabsContent value="standings" className="space-y-6">
                            {Object.keys(standingsByCategory).length > 0 ? (
                                Object.keys(standingsByCategory).sort((a, b) => {
                                    if (a === 'Senior') return -1;
                                    if (b === 'Senior') return 1;
                                    return a.localeCompare(b);
                                }).map((category, catIndex) => {
                                    const categoryStandings = standingsByCategory[category];
                                    const isExpanded = expandedCategories[category] || false;
                                    const bgColor = catIndex % 2 === 0 ? 'bg-alpha' : 'bg-beta';
                                    const borderColor = catIndex % 2 === 0 ? 'border-alpha' : 'border-beta';

                                    const toggleExpand = () => {
                                        setExpandedCategories(prev => ({
                                            ...prev,
                                            [category]: !prev[category]
                                        }));
                                    };

                                    return (
                                        <Card key={category} className={`${bgColor} border-2 ${borderColor} shadow-xl`}>
                                            <CardHeader className="bg-white/10 backdrop-blur-sm">
                                                <div className="flex items-center justify-between flex-wrap gap-3">
                                                    <CardTitle className="text-white text-xl sm:text-2xl font-black flex items-center gap-2 sm:gap-3 flex-wrap">
                                                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                                                        <span>Classement - {category}</span>
                                                        <Badge className="bg-white/30 text-white border-0 text-xs">
                                                            {categoryStandings.length} équipe{categoryStandings.length !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </CardTitle>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={toggleExpand}
                                                        className="text-white hover:bg-white/20 flex-shrink-0"
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <ChevronUp className="w-4 h-4 sm:mr-2" />
                                                                <span className="hidden sm:inline">Réduire</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-4 h-4 sm:mr-2" />
                                                                <span className="hidden sm:inline">Voir tout</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="bg-white/5 p-0">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-white/20 text-white border-b-2 border-white/30">
                                                                <th className="text-left p-4 text-sm font-black text-white uppercase">Pos</th>
                                                                <th className="text-left p-4 text-sm font-black text-white uppercase">Équipe</th>
                                                                {isExpanded && (
                                                                    <>
                                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">J</th>
                                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">V</th>
                                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">N</th>
                                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">D</th>
                                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">BP</th>
                                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">BC</th>
                                                                        <th className="text-center p-4 text-sm font-black text-white uppercase">DB</th>
                                                                    </>
                                                                )}
                                                                <th className="text-center p-4 text-sm font-black text-white uppercase">Pts</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {categoryStandings.map((team, index) => (
                                                                <tr 
                                                                    key={team.id}
                                                                    className="border-b border-white/20 hover:bg-white/20 transition-colors text-white"
                                                                >
                                                                    <td className="p-4 font-black text-lg text-white">{index + 1}</td>
                                                                    <td className="p-4">
                                                                        <div className="font-bold text-white">{team.name}</div>
                                                                    </td>
                                                                    {isExpanded && (
                                                                        <>
                                                                            <td className="p-4 text-center font-semibold text-white">{team.played}</td>
                                                                            <td className="p-4 text-center font-semibold text-white">{team.wins}</td>
                                                                            <td className="p-4 text-center font-semibold text-white">{team.draws}</td>
                                                                            <td className="p-4 text-center font-semibold text-white">{team.losses}</td>
                                                                            <td className="p-4 text-center font-semibold text-white">{team.goals_for}</td>
                                                                            <td className="p-4 text-center font-semibold text-white">{team.goals_against}</td>
                                                                            <td className="p-4 text-center font-bold text-white">
                                                                                {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                                                                            </td>
                                                                        </>
                                                                    )}
                                                                    <td className="p-4 text-center font-black text-lg text-white bg-white/10">{team.points}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            ) : (
                                <Card className="bg-alpha border-2 border-alpha">
                                    <CardContent className="py-20 text-center">
                                        <p className="text-white/80 text-lg">Aucun classement disponible</p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Statistics Tab */}
                        <TabsContent value="statistics" className="space-y-4">
                            <Card className="bg-alpha border-2 border-alpha">
                                <CardHeader className="bg-white/10 backdrop-blur-sm">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Award className="w-5 h-5" />
                                        Meilleurs Buteurs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white/5 p-6">
                                    {filteredTopScorers.length > 0 ? (
                                        <div className="space-y-3">
                                            {filteredTopScorers.map((player, index) => (
                                                <div
                                                    key={player.id}
                                                    className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-white border border-white/20"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-white text-alpha' :
                                                            'bg-white/20 text-white'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-lg text-white">{player.name}</div>
                                                            <div className="text-sm text-white/90 flex items-center gap-2">
                                                                <span>{player.team}</span>
                                                                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                                                                    {player.category}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-3xl font-black text-white">{player.goals}</span>
                                                        <span className="text-sm text-white/90">buts</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-white/80 py-12">
                                            Aucune statistique disponible
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Match Details Modal */}
                    <Dialog open={matchModalOpen} onOpenChange={setMatchModalOpen}>
                        <DialogContent className="bg-white sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-gray-900">
                                    {selectedMatch ? `${selectedMatch.team_name} vs ${selectedMatch.opponent}` : 'Détails du match'}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    {selectedMatch && formatDate(selectedMatch.scheduled_at)} • {selectedMatch?.venue}
                                </DialogDescription>
                            </DialogHeader>

                            {selectedMatch && (
                                <div className="space-y-6">
                                    {/* Match Info */}
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Score</div>
                                            <div className="text-2xl font-black text-alpha">
                                                {selectedMatchDetails?.home_score !== null ? `${selectedMatchDetails.home_score} - ${selectedMatchDetails.away_score}` : 
                                                 selectedMatch.home_score !== null ? `${selectedMatch.home_score} - ${selectedMatch.away_score}` : '0 - 0'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Statut</div>
                                            <Badge className={
                                                (selectedMatchDetails?.status || selectedMatch.status) === 'finished' ? 'bg-alpha/10 text-alpha border-alpha' :
                                                (selectedMatchDetails?.status || selectedMatch.status) === 'scheduled' ? 'bg-beta/10 text-beta border-beta' :
                                                (selectedMatchDetails?.status || selectedMatch.status) === 'live' ? 'bg-red-100 text-red-600 border-red-300' :
                                                (selectedMatchDetails?.status || selectedMatch.status) === 'postponed' ? 'bg-yellow-100 text-yellow-600 border-yellow-300' :
                                                'bg-gray-100 text-gray-600 border-gray-300'
                                            }>
                                                {(selectedMatchDetails?.status || selectedMatch.status) === 'finished' ? 'Terminé' :
                                                 (selectedMatchDetails?.status || selectedMatch.status) === 'scheduled' ? 'À venir' :
                                                 (selectedMatchDetails?.status || selectedMatch.status) === 'live' ? 'En direct' :
                                                 (selectedMatchDetails?.status || selectedMatch.status) === 'postponed' ? 'Reporté' : 'Annulé'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Finish Match / Update Score Section */}
                                    {(selectedMatchDetails?.status || selectedMatch.status) !== 'finished' && (
                                        <Card className="border-2 border-gray-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Terminer le match</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleFinishMatch} className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="finish_home_score">Score domicile *</Label>
                                                            <Input
                                                                id="finish_home_score"
                                                                type="number"
                                                                min="0"
                                                                value={finishMatchForm.data.home_score || selectedMatchDetails?.home_score || ''}
                                                                onChange={(e) => finishMatchForm.setData('home_score', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={finishMatchForm.errors.home_score} />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="finish_away_score">Score extérieur *</Label>
                                                            <Input
                                                                id="finish_away_score"
                                                                type="number"
                                                                min="0"
                                                                value={finishMatchForm.data.away_score || selectedMatchDetails?.away_score || ''}
                                                                onChange={(e) => finishMatchForm.setData('away_score', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={finishMatchForm.errors.away_score} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="match_report">Rapport du match</Label>
                                                        <textarea
                                                            id="match_report"
                                                            value={finishMatchForm.data.match_report}
                                                            onChange={(e) => finishMatchForm.setData('match_report', e.target.value)}
                                                            className="w-full min-h-[100px] px-3 py-2 border-2 border-gray-200 rounded-lg"
                                                            placeholder="Rapport du match..."
                                                        />
                                                        <InputError message={finishMatchForm.errors.match_report} />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="coach_notes">Notes de l'entraîneur</Label>
                                                        <textarea
                                                            id="coach_notes"
                                                            value={finishMatchForm.data.coach_notes}
                                                            onChange={(e) => finishMatchForm.setData('coach_notes', e.target.value)}
                                                            className="w-full min-h-[80px] px-3 py-2 border-2 border-gray-200 rounded-lg"
                                                            placeholder="Notes..."
                                                        />
                                                        <InputError message={finishMatchForm.errors.coach_notes} />
                                                    </div>
                                                    <Button 
                                                        type="submit" 
                                                        disabled={finishMatchForm.processing}
                                                        className="w-full bg-alpha text-white hover:bg-alpha/90"
                                                    >
                                                        {finishMatchForm.processing ? 'Enregistrement...' : 'Terminer le match'}
                                                    </Button>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Update Score Section (if match is finished) */}
                                    {(selectedMatchDetails?.status || selectedMatch.status) === 'finished' && (
                                        <Card className="border-2 border-gray-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Mettre à jour le score</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleUpdateScore} className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="update_home_score">Score domicile *</Label>
                                                            <Input
                                                                id="update_home_score"
                                                                type="number"
                                                                min="0"
                                                                value={updateScoreForm.data.home_score || selectedMatchDetails?.home_score || ''}
                                                                onChange={(e) => updateScoreForm.setData('home_score', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={updateScoreForm.errors.home_score} />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="update_away_score">Score extérieur *</Label>
                                                            <Input
                                                                id="update_away_score"
                                                                type="number"
                                                                min="0"
                                                                value={updateScoreForm.data.away_score || selectedMatchDetails?.away_score || ''}
                                                                onChange={(e) => updateScoreForm.setData('away_score', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={updateScoreForm.errors.away_score} />
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        type="submit" 
                                                        disabled={updateScoreForm.processing}
                                                        className="w-full bg-alpha text-white hover:bg-alpha/90"
                                                    >
                                                        {updateScoreForm.processing ? 'Mise à jour...' : 'Mettre à jour le score'}
                                                    </Button>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Events Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Événements du match</h3>
                                        
                                        {/* Add Event Form */}
                                        <Card className="mb-4 border-2 border-gray-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Ajouter un événement</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleCreateEvent} className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="event_type">Type d'événement *</Label>
                                                            <Select 
                                                                value={eventForm.data.type} 
                                                                onValueChange={(value) => eventForm.setData('type', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="goal">But</SelectItem>
                                                                    <SelectItem value="penalty">Pénalty marqué</SelectItem>
                                                                    <SelectItem value="missed_penalty">Pénalty raté</SelectItem>
                                                                    <SelectItem value="own_goal">But contre son camp</SelectItem>
                                                                    <SelectItem value="yellow_card">Carton jaune</SelectItem>
                                                                    <SelectItem value="red_card">Carton rouge</SelectItem>
                                                                    <SelectItem value="substitution">Remplacement</SelectItem>
                                                                    <SelectItem value="injury">Blessure</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <InputError message={eventForm.errors.type} />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="minute">Minute *</Label>
                                                            <Input
                                                                id="minute"
                                                                type="number"
                                                                min="1"
                                                                max="120"
                                                                value={eventForm.data.minute}
                                                                onChange={(e) => eventForm.setData('minute', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={eventForm.errors.minute} />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="player_id">Joueuse</Label>
                                                        <Select 
                                                            value={eventForm.data.player_id || 'none'} 
                                                            onValueChange={(value) => eventForm.setData('player_id', value === 'none' ? '' : value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner une joueuse" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">Aucune</SelectItem>
                                                                {selectedMatchDetails?.team?.players?.map((player) => (
                                                                    <SelectItem key={player.id} value={player.id.toString()}>
                                                                        {player.first_name} {player.last_name}
                                                                    </SelectItem>
                                                                )) || season.teams?.find(t => t.name === selectedMatch?.team_name)?.players?.map((player) => (
                                                                    <SelectItem key={player.id} value={player.id.toString()}>
                                                                        {player.first_name} {player.last_name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={eventForm.errors.player_id} />
                                                    </div>

                                                    {eventForm.data.type === 'substitution' && (
                                                        <div>
                                                            <Label htmlFor="substituted_player_id">Joueuse remplacée</Label>
                                                            <Select 
                                                                value={eventForm.data.substituted_player_id || 'none'} 
                                                                onValueChange={(value) => eventForm.setData('substituted_player_id', value === 'none' ? '' : value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionner une joueuse" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="none">Aucune</SelectItem>
                                                                    {selectedMatchDetails?.team?.players?.map((player) => (
                                                                        <SelectItem key={player.id} value={player.id.toString()}>
                                                                            {player.first_name} {player.last_name}
                                                                        </SelectItem>
                                                                    )) || season.teams?.find(t => t.name === selectedMatch?.team_name)?.players?.map((player) => (
                                                                        <SelectItem key={player.id} value={player.id.toString()}>
                                                                            {player.first_name} {player.last_name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <Label htmlFor="description">Description (optionnel)</Label>
                                                        <Input
                                                            id="description"
                                                            value={eventForm.data.description}
                                                            onChange={(e) => eventForm.setData('description', e.target.value)}
                                                            placeholder="Détails de l'événement..."
                                                        />
                                                        <InputError message={eventForm.errors.description} />
                                                    </div>

                                                    <DialogFooter>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                eventForm.reset();
                                                                setMatchModalOpen(false);
                                                            }}
                                                        >
                                                            Annuler
                                                        </Button>
                                                        <Button 
                                                            type="submit" 
                                                            disabled={eventForm.processing}
                                                            className="bg-alpha text-white hover:bg-alpha/90"
                                                        >
                                                            {eventForm.processing ? 'Ajout...' : 'Ajouter l\'événement'}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </CardContent>
                                        </Card>

                                        {/* Events List */}
                                        {selectedMatchDetails?.events && selectedMatchDetails.events.length > 0 ? (
                                            <div className="space-y-2">
                                                {selectedMatchDetails.events.map((event) => {
                                                    const eventLabels = {
                                                        'goal': '⚽ But',
                                                        'penalty': '🎯 Pénalty',
                                                        'missed_penalty': '❌ Pénalty raté',
                                                        'own_goal': '🥅 But contre son camp',
                                                        'yellow_card': '🟨 Carton jaune',
                                                        'red_card': '🟥 Carton rouge',
                                                        'substitution': '🔄 Remplacement',
                                                        'injury': '🏥 Blessure',
                                                    };
                                                    
                                                    return (
                                                        <div key={event.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-200">
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <Badge className="bg-alpha text-white font-bold min-w-[50px] text-center">{event.minute}'</Badge>
                                                                <span className="font-semibold text-gray-900">{eventLabels[event.type] || event.type}</span>
                                                                {event.player && (
                                                                    <span className="text-gray-700 font-medium">
                                                                        {event.player.first_name} {event.player.last_name}
                                                                    </span>
                                                                )}
                                                                {event.type === 'substitution' && event.substituted_player && (
                                                                    <span className="text-sm text-gray-500">
                                                                        (remplace {event.substituted_player.first_name} {event.substituted_player.last_name})
                                                                    </span>
                                                                )}
                                                                {event.description && (
                                                                    <span className="text-sm text-gray-500 ml-2 italic">{event.description}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-8">Aucun événement enregistré</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AdminLayout>
    );
}
