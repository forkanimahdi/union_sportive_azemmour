import React, { useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Area,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import {
    ArrowLeft,
    Edit,
    FileText,
    Shield,
    Download,
    Star,
    Eye,
    Info,
    Upload,
    Badge,
    Trash2,
} from 'lucide-react';
import InputError from '@/components/input-error';
import DeleteModal from '@/components/DeleteModal';

const POSITION_LABELS = {
    gardien: 'Gardien',
    defenseur: 'Défenseur',
    milieu: 'Milieu',
    attaquant: 'Attaquant',
};

const FOOT_LABELS = {
    gauche: 'Gauche',
    droit: 'Droit',
    ambidextre: 'Ambidextre',
};

const statsChartConfig = { value: { label: 'Valeur', color: 'var(--color-primary)' } };

export default function PlayersShow({ player, teams = [] }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const editForm = useForm({
        team_ids: player.teams?.map((t) => t.id) || [],
        first_name: player.first_name,
        last_name: player.last_name,
        date_of_birth: player.date_of_birth || '',
        position: player.position || '',
        preferred_foot: player.preferred_foot || '',
        jersey_number: player.jersey_number || '',
        email: player.email || '',
        phone: player.phone || '',
        address: player.address || '',
        guardian_name: player.guardian_name || '',
        guardian_phone: player.guardian_phone || '',
        guardian_email: player.guardian_email || '',
        guardian_relationship: player.guardian_relationship || '',
        photo: null,
        _method: 'PUT',
        redirect: 'show',
        is_active: player.is_active,
    });

    const openEditModal = () => {
        editForm.setData({
            team_ids: player.teams?.map((t) => t.id) || [],
            first_name: player.first_name,
            last_name: player.last_name,
            date_of_birth: player.date_of_birth || '',
            position: player.position || '',
            preferred_foot: player.preferred_foot || '',
            jersey_number: player.jersey_number || '',
            email: player.email || '',
            phone: player.phone || '',
            address: player.address || '',
            guardian_name: player.guardian_name || '',
            guardian_phone: player.guardian_phone || '',
            guardian_email: player.guardian_email || '',
            guardian_relationship: player.guardian_relationship || '',
            photo: null,
            _method: 'PUT',
            redirect: 'show',
            is_active: player.is_active,
        });
        setEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.post(`/admin/players/${player.id}`, {
            forceFormData: true,
            onSuccess: () => setEditModalOpen(false),
        });
    };

    const confirmDelete = () => {
        router.delete(`/admin/players/${player.id}`, {
            onSuccess: () => setDeleteModalOpen(false),
        });
    };

    const positionLabel = player.position ? POSITION_LABELS[player.position] || player.position : '';
    const footLabel = player.preferred_foot ? FOOT_LABELS[player.preferred_foot] : null;
    const statusLabel = player.status_label || (player.can_play ? 'FIT' : player.is_injured ? 'INJURED' : 'LEFT');

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : null;
    const formatDateShort = (d) =>
        d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

    const age = useMemo(() => {
        if (!player.date_of_birth) return null;
        const today = new Date();
        const birth = new Date(player.date_of_birth);
        return today.getFullYear() - birth.getFullYear();
    }, [player.date_of_birth]);

    const trendData = useMemo(() => {
        const trend = player.performance_trend || [];
        if (trend.length === 0) {
            return Array.from({ length: 7 }, (_, i) => ({ gw: `GW${18 + i}`, value: 6.5 + i * 0.2 }));
        }
        return trend;
    }, [player.performance_trend]);

    const matchHistory = player.match_history || player.recent_matches || [];
    const photoUrl = player.photo ? `/storage/${player.photo}` : null;

    const statCards = [
        { key: 'goals', label: 'BUTS', value: player.stats?.goals ?? 0, primary: true, pct: '+20%', pctGreen: true },
        { key: 'assists', label: 'PASSES DÉC.', value: String(player.stats?.assists ?? 0).padStart(2, '0'), pct: '+15%', pctGreen: true },
        { key: 'yellow', label: 'CARTONS JAUNES', value: String(player.stats?.yellow_cards ?? 0).padStart(2, '0'), pct: '-10%', pctRed: true },
        { key: 'red', label: 'CARTONS ROUGES', value: String(player.stats?.red_cards ?? 0).padStart(2, '0'), pct: '0%', pctGrey: true },
        { key: 'cs', label: 'CLEAN SHEETS', value: String(player.stats?.clean_sheets ?? 0).padStart(2, '0'), pct: '0%', pctGrey: true },
        { key: 'minutes', label: 'MINUTES', value: String(player.stats?.minutes ?? 0), pct: '+5%', pctGreen: true },
    ];

    return (
        <AdminLayout>
            <Head title={`${player.first_name} ${player.last_name}`} />
            <div className="min-h-screen bg-muted/40">
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
                    <Link
                        href="/admin/players"
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux joueuses
                    </Link>

                    {/* Player Overview Card */}
                    <Card className="overflow-hidden border shadow-sm">
                        <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                                <div className="relative h-64 w-full shrink-0 sm:h-72 sm:w-64">
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt=""
                                            className={`h-full w-full object-cover object-top ${!player.is_active ? 'grayscale' : ''}`}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-muted text-4xl font-bold text-muted-foreground">
                                            {player.first_name?.[0]}
                                            {player.last_name?.[0]}
                                        </div>
                                    )}
                                    {player.jersey_number && (
                                        <div className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-background text-xl font-bold text-foreground shadow">
                                            {player.jersey_number}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-between p-6">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <Badge
                                                className={
                                                    statusLabel === 'FIT'
                                                        ? 'bg-green-500 text-white'
                                                        : statusLabel === 'INJURED'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-muted-foreground text-white'
                                                }
                                            >
                                                {statusLabel === 'FIT' ? 'APTES À JOUER' : statusLabel === 'INJURED' ? 'BLESSÉE' : 'PARTIE'}
                                            </Badge>
                                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                                {player.first_name?.toUpperCase()} {player.last_name?.toUpperCase()}
                                            </h1>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {positionLabel}
                                                {player.jersey_number && ` • #${player.jersey_number}`}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {(player.teams?.length > 0 ? player.teams.map((t) => t.name).join(', ') : null) ?? player.team?.name ?? 'Sans équipe'}
                                            </p>
                                            {player.form != null && (
                                                <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground">
                                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                    Forme : {player.form}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <Button variant="outline" size="sm" className="border-muted-foreground/30" onClick={openEditModal}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Modifier
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-destructive/50 text-destructive hover:bg-destructive/10"
                                                onClick={() => setDeleteModalOpen(true)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Supprimer
                                            </Button>
                                            <a href={`/admin/players/${player.id}/export`} target="_blank" rel="noopener noreferrer">
                                                <Button
                                                    size="sm"
                                                    type="button"
                                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Exporter
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Key Statistics */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {statCards.map((card, i) => (
                            <Card
                                key={card.key}
                                className={card.primary ? 'border-primary bg-primary text-primary-foreground' : ''}
                            >
                                <CardContent className="pt-4 pb-3">
                                    <p className={`text-xs font-medium uppercase tracking-wide ${card.primary ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                                        {card.label}
                                    </p>
                                    <p className={`mt-1 text-2xl font-bold ${card.primary ? 'text-white' : 'text-foreground'}`}>
                                        {card.value}
                                    </p>
                                    <p
                                        className={`mt-1 text-xs ${
                                            card.pctGreen ? 'text-green-600' : card.pctRed ? 'text-red-600' : 'text-muted-foreground'
                                        }`}
                                    >
                                        {card.pct}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Two columns: Left = Trend + Match History, Right = Profile + Compliance */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* Season Performance Trend */}
                            <Card className="border shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-semibold">
                                        Évolution de la forme
                                    </CardTitle>
                                    {trendData.length > 0 && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                                            Derniers {trendData.length} matchs
                                        </Badge>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={statsChartConfig} className="min-h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height={200}>
                                            <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                                                <defs>
                                                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                                <XAxis dataKey="gw" tickLine={false} axisLine={false} tickClassName="fill-muted-foreground text-xs" />
                                                <YAxis tickLine={false} axisLine={false} tickClassName="fill-muted-foreground text-xs" domain={[5, 10]} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                                                    formatter={(value) => [value, 'Note']}
                                                    labelFormatter={(l) => l}
                                                />
                                                <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill="url(#trendFill)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            {/* Match History */}
                            <Card className="border shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-semibold">Historique des matchs</CardTitle>
                                    <Link href="/admin/matches" className="text-sm font-medium text-primary hover:underline">
                                        Voir tout →
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b text-left text-muted-foreground">
                                                    <th className="pb-2 pr-4 font-medium">DATE</th>
                                                    <th className="pb-2 pr-4 font-medium">ADVERSAIRE</th>
                                                    <th className="pb-2 pr-4 font-medium">SCORE</th>
                                                    <th className="pb-2 pr-4 font-medium text-center">B</th>
                                                    <th className="pb-2 pr-4 font-medium text-center">PD</th>
                                                    <th className="pb-2 pr-4 font-medium text-center">MIN</th>
                                                    <th className="pb-2 font-medium text-center">NOTE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {matchHistory.length > 0 ? (
                                                    matchHistory.map((m) => (
                                                        <tr key={m.id} className="border-b last:border-0">
                                                            <td className="py-3 pr-4 text-muted-foreground">
                                                                {formatDateShort(m.scheduled_at)}
                                                            </td>
                                                            <td className="py-3 pr-4">
                                                                {m.opponent}
                                                                {m.venue === 'domicile' ? ' (D)' : ' (E)'}
                                                            </td>
                                                            <td className="py-3 pr-4">
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        m.result === 'W'
                                                                            ? 'border-green-500 bg-green-500/10 text-green-700'
                                                                            : m.result === 'D'
                                                                            ? 'border-muted-foreground bg-muted text-muted-foreground'
                                                                            : 'border-orange-500 bg-orange-500/10 text-orange-700'
                                                                    }
                                                                >
                                                                    {m.result} {m.score_display ?? (m.venue === 'domicile' ? `${m.home_score}-${m.away_score}` : `${m.away_score}-${m.home_score}`)}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-3 pr-4 text-center">{m.goals ?? 0}</td>
                                                            <td className="py-3 pr-4 text-center">{m.assists ?? 0}</td>
                                                            <td className="py-3 pr-4 text-center">{m.minutes ?? 90}'</td>
                                                            <td className="py-3 text-center">
                                                                <span className={m.rating >= 7 ? 'font-semibold text-green-600' : 'text-muted-foreground'}>
                                                                    {m.rating ?? '-'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                                            Aucun match récent
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            {/* Player Profile */}
                            <Card className="border shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <FileText className="h-4 w-4" />
                                        Profil
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    {age != null && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Âge</span>
                                            <span className="font-medium">{age} ({formatDate(player.date_of_birth)})</span>
                                        </div>
                                    )}
                                    {player.position && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Poste</span>
                                            <span className="font-medium">{positionLabel}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Taille</span>
                                        <span className="font-medium">—</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Poids</span>
                                        <span className="font-medium">—</span>
                                    </div>
                                    {footLabel && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Pied préféré</span>
                                            <span className="font-medium">{footLabel}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nationalité</span>
                                        <span className="font-medium">—</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Compliance & Docs */}
                            <Card className="border shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <Shield className="h-4 w-4" />
                                        Conformité & documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between rounded-lg border bg-green-500/10 px-3 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600">✓</span>
                                            <span>Certificat médical</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-muted-foreground">
                                                {player.medical_certificate_expiry
                                                    ? `Expire : ${formatDateShort(player.medical_certificate_expiry)}`
                                                    : '—'}
                                            </span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border bg-green-500/10 px-3 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600">✓</span>
                                            <span>Licence</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-muted-foreground">
                                                {player.license_status === 'active' ? 'Active' : '—'}
                                            </span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                            <span>Droit à l'image</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-muted-foreground">
                                                {player.media_permissions_signed_at
                                                    ? `Signé : ${formatDateShort(player.media_permissions_signed_at)}`
                                                    : '—'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 py-6 text-center text-sm text-muted-foreground">
                                        <Upload className="mb-2 h-8 w-8" />
                                        <span>DÉPOSER UN DOCUMENT</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Player Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Modifier la joueuse</DialogTitle>
                        <DialogDescription>
                            {player.first_name} {player.last_name}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Prénom *</Label>
                                <Input
                                    value={editForm.data.first_name}
                                    onChange={(e) => editForm.setData('first_name', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.first_name} />
                            </div>
                            <div className="space-y-2">
                                <Label>Nom *</Label>
                                <Input
                                    value={editForm.data.last_name}
                                    onChange={(e) => editForm.setData('last_name', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.last_name} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Date de naissance *</Label>
                                <Input
                                    type="date"
                                    value={editForm.data.date_of_birth}
                                    onChange={(e) => editForm.setData('date_of_birth', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.date_of_birth} />
                            </div>
                            <div className="space-y-2">
                                <Label>Poste</Label>
                                <Select value={editForm.data.position || 'none'} onValueChange={(v) => editForm.setData('position', v === 'none' ? '' : v)}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Aucun</SelectItem>
                                        <SelectItem value="gardien">Gardien</SelectItem>
                                        <SelectItem value="defenseur">Défenseur</SelectItem>
                                        <SelectItem value="milieu">Milieu</SelectItem>
                                        <SelectItem value="attaquant">Attaquant</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.position} />
                            </div>
                            <div className="space-y-2">
                                <Label>Numéro</Label>
                                <Input
                                    value={editForm.data.jersey_number}
                                    onChange={(e) => editForm.setData('jersey_number', e.target.value)}
                                />
                                <InputError message={editForm.errors.jersey_number} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Équipes (U17 + Senior possible)</Label>
                            <div className="flex flex-wrap gap-4 pt-2">
                                {teams.map((t) => {
                                    const checked = (editForm.data.team_ids || []).includes(t.id);
                                    return (
                                        <div key={t.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`edit-team-${t.id}`}
                                                checked={checked}
                                                onCheckedChange={(c) => {
                                                    const ids = [...(editForm.data.team_ids || [])];
                                                    if (c) ids.push(t.id);
                                                    else ids.splice(ids.indexOf(t.id), 1);
                                                    editForm.setData('team_ids', ids);
                                                }}
                                            />
                                            <Label htmlFor={`edit-team-${t.id}`} className="cursor-pointer text-sm font-normal">{t.name} ({t.category})</Label>
                                        </div>
                                    );
                                })}
                            </div>
                            <InputError message={editForm.errors.team_ids} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} />
                                <InputError message={editForm.errors.email} />
                            </div>
                            <div className="space-y-2">
                                <Label>Téléphone</Label>
                                <Input value={editForm.data.phone} onChange={(e) => editForm.setData('phone', e.target.value)} />
                                <InputError message={editForm.errors.phone} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Adresse</Label>
                            <Input value={editForm.data.address} onChange={(e) => editForm.setData('address', e.target.value)} />
                            <InputError message={editForm.errors.address} />
                        </div>
                        <div className="space-y-2">
                            <Label>Photo (laisser vide pour conserver)</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('photo', e.target.files?.[0] || null)}
                            />
                            <InputError message={editForm.errors.photo} />
                        </div>
                        <details className="rounded-md border p-3">
                            <summary className="cursor-pointer text-sm font-medium">Tuteur légal</summary>
                            <div className="mt-3 grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nom du tuteur</Label>
                                    <Input value={editForm.data.guardian_name} onChange={(e) => editForm.setData('guardian_name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Relation</Label>
                                    <Input value={editForm.data.guardian_relationship} onChange={(e) => editForm.setData('guardian_relationship', e.target.value)} placeholder="Parent, tuteur…" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Téléphone tuteur</Label>
                                    <Input value={editForm.data.guardian_phone} onChange={(e) => editForm.setData('guardian_phone', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email tuteur</Label>
                                    <Input type="email" value={editForm.data.guardian_email} onChange={(e) => editForm.setData('guardian_email', e.target.value)} />
                                </div>
                            </div>
                        </details>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="edit_is_active"
                                checked={editForm.data.is_active}
                                onCheckedChange={(c) => editForm.setData('is_active', !!c)}
                            />
                            <Label htmlFor="edit_is_active" className="cursor-pointer">Joueuse active</Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={editForm.processing}>{editForm.processing ? 'Mise à jour…' : 'Mettre à jour'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                title="Supprimer la joueuse"
                description={`Êtes-vous sûr de vouloir supprimer ${player.first_name} ${player.last_name} ? Cette action est irréversible.`}
                loading={false}
            />
        </AdminLayout>
    );
}
