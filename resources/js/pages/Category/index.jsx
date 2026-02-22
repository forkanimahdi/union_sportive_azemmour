import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { ChevronRight } from 'lucide-react';

const CLUB_LOGO = '/assets/images/logo.png';
const USA_HERO_BG = '/assets/images/hero/usa_hero.webp';

// Fallback when no dynamic data
const CATEGORY_DATA = {
    senior: {
        name: 'Senior',
        displayName: 'Senior',
        heroNumber: '01',
        division: 'Division d\'Honneur Régionale — Ligue Chaouia Doukkala',
        stats: { rank: '3ÈME', points: 22, players: 25, goalDiff: '+12' },
        nextMatch: {
            homeTeam: 'USA',
            homeTeamLogo: CLUB_LOGO,
            awayTeam: 'Rajae El Jadida',
            awayTeamLogo: null,
            date: 'Dimanche 22 Mars 2026',
            time: '15:00',
            venue: '📍 Haj Merouane, Azemmour',
            form: ['W', 'W', 'D', 'W', 'W'],
        },
        results: [
            { date: '15 Fév', opponent: 'Ansar Bouznika', opponentLogo: null, venue: 'Domicile', score: '3 – 0', type: 'win' },
            { date: '08 Fév', opponent: 'Sporting Deroua', opponentLogo: null, venue: 'Domicile', score: '2 – 0', type: 'win' },
            { date: '01 Fév', opponent: 'Wydad Ben Ahmed', opponentLogo: null, venue: 'Extérieur', score: '1 – 1', type: 'draw' },
            { date: '22 Nov', opponent: 'Rajae El Jadida', opponentLogo: null, venue: 'Extérieur', score: '2 – 1', type: 'loss' },
            { date: '16 Nov', opponent: 'Ansar Bouznika', opponentLogo: null, venue: 'Domicile', score: '3 – 0', type: 'win' },
        ],
        standings: [
            { rank: 1, team: 'Rajae El Jadida', teamLogo: null, played: 10, pts: 28 },
            { rank: 2, team: 'Club Youssoufia B.', teamLogo: null, played: 10, pts: 23 },
            { rank: 3, team: 'USA Azemmour', teamLogo: CLUB_LOGO, played: 10, pts: 22, isUsa: true },
            { rank: 4, team: 'Lionnes de Mzab', teamLogo: null, played: 10, pts: 16 },
            { rank: 5, team: 'Sporting Deroua', teamLogo: null, played: 10, pts: 12 },
        ],
        players: [
            { initials: 'AYA', number: 1, position: 'Gardienne', first: 'Aya', last: 'Arzayane', matches: 10, note: '7.0' },
            { initials: 'HE', number: 2, position: 'Défenseure', first: 'Habiba', last: 'El Barji', matches: 10 },
            { initials: 'KH', number: 4, position: 'Défenseure', first: 'Khadija', last: 'Hamdani', matches: 9 },
            { initials: 'ZN', number: 5, position: 'Milieu', first: 'Zahira', last: 'Najrane', matches: 10 },
            { initials: 'FE', number: 6, position: 'Attaquante', first: 'Fadwa', last: 'Elkhettat', matches: 10, goals: 5 },
            { initials: 'NB', number: 7, position: 'Défenseure', first: 'Nouhaila', last: 'El Barji', matches: 10 },
            { initials: 'HB', number: 8, position: 'Milieu', first: 'Hanane', last: 'Bouaouda', matches: 9 },
            { initials: 'FO', number: 9, position: 'Attaquante', first: 'Fatim', last: 'El Oualyd', matches: 9 },
            { initials: 'HF', number: 11, position: 'Attaquante', first: 'Halima', last: 'Fellaje', matches: 10 },
        ],
        staff: [
            { initials: 'EN', role: 'Entraîneur Principal', name: 'Nom du Coach', detail: 'Depuis 2023' },
            { initials: 'AD', role: 'Entraîneur Adjoint', name: 'Prénom Nom', detail: 'Adjoint Senior' },
            { initials: 'PP', role: 'Préparateur Physique', name: 'Prénom Nom', detail: 'Préparation athlétique' },
        ],
    },
    u17: {
        name: 'U17',
        displayName: 'U17',
        heroNumber: '02',
        division: 'Championnat Régional U17 — Ligue Chaouia Doukkala',
        stats: { rank: '2ÈME', points: 18, players: 20, goalDiff: '+8' },
        nextMatch: {
            homeTeam: 'USA',
            homeTeamLogo: CLUB_LOGO,
            awayTeam: 'Wydad Ben Ahmed',
            awayTeamLogo: null,
            date: 'Samedi 28 Mars 2026',
            time: '14:00',
            venue: '📍 Stade Municipal, Azemmour',
            form: ['W', 'D', 'W', 'L', 'W'],
        },
        results: [
            { date: '14 Fév', opponent: 'Rajae U17', opponentLogo: null, venue: 'Extérieur', score: '2 – 1', type: 'win' },
            { date: '07 Fév', opponent: 'Deroua U17', opponentLogo: null, venue: 'Domicile', score: '1 – 1', type: 'draw' },
            { date: '31 Jan', opponent: 'Bouznika U17', opponentLogo: null, venue: 'Domicile', score: '3 – 0', type: 'win' },
        ],
        standings: [
            { rank: 1, team: 'Wydad Ben Ahmed U17', teamLogo: null, played: 8, pts: 22 },
            { rank: 2, team: 'USA Azemmour U17', teamLogo: CLUB_LOGO, played: 8, pts: 18, isUsa: true },
            { rank: 3, team: 'Rajae El Jadida U17', teamLogo: null, played: 8, pts: 14 },
        ],
        players: [
            { initials: 'SJ', number: 1, position: 'Gardienne', first: 'Sara', last: 'Jamal', matches: 8 },
            { initials: 'IA', number: 5, position: 'Défenseure', first: 'Imane', last: 'Amrani', matches: 8 },
            { initials: 'MB', number: 7, position: 'Milieu', first: 'Meryem', last: 'Benali', matches: 8 },
            { initials: 'YA', number: 9, position: 'Attaquante', first: 'Yasmin', last: 'Ait', matches: 7 },
        ],
        staff: [
            { initials: 'CO', role: 'Entraîneur', name: 'Coach U17', detail: 'Encadrement U17' },
        ],
    },
    u15: {
        name: 'U15',
        displayName: 'U15',
        heroNumber: '03',
        division: 'Championnat Régional U15 — Ligue Chaouia Doukkala',
        stats: { rank: '1ER', points: 24, players: 18, goalDiff: '+15' },
        nextMatch: {
            homeTeam: 'USA',
            homeTeamLogo: CLUB_LOGO,
            awayTeam: 'Ansar Bouznika',
            awayTeamLogo: null,
            date: 'Dimanche 29 Mars 2026',
            time: '10:00',
            venue: '📍 Terrain U15, Azemmour',
            form: ['W', 'W', 'W', 'D', 'W'],
        },
        results: [
            { date: '16 Fév', opponent: 'Youssoufia U15', opponentLogo: null, venue: 'Domicile', score: '4 – 0', type: 'win' },
            { date: '09 Fév', opponent: 'Deroua U15', opponentLogo: null, venue: 'Extérieur', score: '2 – 0', type: 'win' },
        ],
        standings: [
            { rank: 1, team: 'USA Azemmour U15', teamLogo: CLUB_LOGO, played: 6, pts: 24, isUsa: true },
            { rank: 2, team: 'Rajae U15', teamLogo: null, played: 6, pts: 18 },
            { rank: 3, team: 'Bouznika U15', teamLogo: null, played: 6, pts: 12 },
        ],
        players: [
            { initials: 'LN', number: 1, position: 'Gardienne', first: 'Lina', last: 'Naciri', matches: 6 },
            { initials: 'HK', number: 4, position: 'Défenseure', first: 'Houda', last: 'Kettani', matches: 6 },
            { initials: 'ZM', number: 8, position: 'Milieu', first: 'Zineb', last: 'Moussafi', matches: 6 },
            { initials: 'ND', number: 10, position: 'Attaquante', first: 'Nada', last: 'Daoudi', matches: 5 },
        ],
        staff: [
            { initials: 'CO', role: 'Entraîneur', name: 'Coach U15', detail: 'Encadrement U15' },
        ],
    },
    u13: {
        name: 'U13',
        displayName: 'U13',
        heroNumber: '04',
        division: 'Championnat Régional U13 — Ligue Chaouia Doukkala',
        stats: { rank: '2ÈME', points: 16, players: 15, goalDiff: '+6' },
        nextMatch: { homeTeam: 'USA', homeTeamLogo: CLUB_LOGO, awayTeam: 'Sporting', awayTeamLogo: null, date: 'Samedi 27 Mars', time: '09:00', venue: '📍 Azemmour', form: ['W', 'L', 'W', 'D'] },
        results: [],
        standings: [],
        players: [],
        staff: [],
    },
    u7: {
        name: 'U7',
        displayName: 'U7',
        heroNumber: '05',
        division: 'École de football — Initiation',
        stats: { rank: '–', points: 0, players: 12, goalDiff: '–' },
        nextMatch: null,
        results: [],
        standings: [],
        players: [],
        staff: [],
    },
};

const POSITION_FILTERS = ['Toutes', 'Gardiennes', 'Défenseurs', 'Milieux', 'Attaquants'];

export default function CategoryIndex({
    category,
    displayName = 'Senior',
    heroNumber = '01',
    division = '',
    seasonName = '2025–2026',
    stats = { rank: '–', points: 0, players: 0, goalDiff: '–' },
    nextMatch = null,
    results = [],
    standings = [],
    players = [],
    staff = [],
}) {
    const [positionFilter, setPositionFilter] = useState('Toutes');
    const fallback = CATEGORY_DATA[category] ?? CATEGORY_DATA.senior;
    const data = {
        displayName,
        heroNumber,
        division: division || fallback.division,
        stats,
        nextMatch: nextMatch ?? fallback.nextMatch,
        results: results?.length > 0 ? results : fallback.results,
        standings: standings?.length > 0 ? standings : fallback.standings,
        players: players?.length > 0 ? players : fallback.players,
        staff: staff?.length > 0 ? staff : fallback.staff,
    };

    const getScoreClass = (type) => {
        if (type === 'win') return 'text-green-600';
        if (type === 'draw') return 'text-amber-600';
        return 'text-red-600';
    };

    const getBorderClass = (type) => {
        if (type === 'win') return 'border-l-green-500';
        if (type === 'draw') return 'border-l-amber-500';
        return 'border-l-red-500';
    };

    const getFormClass = (f) => {
        if (f === 'W') return 'bg-green-100 text-green-700';
        if (f === 'D') return 'bg-amber-100 text-amber-700';
        return 'bg-red-100 text-red-700';
    };

    const getFormLabel = (f) => (f === 'W' ? 'V' : f === 'D' ? 'N' : 'D');

    const filteredPlayers = positionFilter === 'Toutes'
        ? data.players
        : data.players.filter((p) => {
            const pos = p.position.toLowerCase();
            if (positionFilter === 'Gardiennes') return pos.includes('gardien');
            if (positionFilter === 'Défenseurs') return pos.includes('défenseur');
            if (positionFilter === 'Milieux') return pos.includes('milieu');
            if (positionFilter === 'Attaquants') return pos.includes('attaquante');
            return true;
        });

    return (
        <div className="font-sans antialiased bg-white text-dark">
            <Head title={`Équipe ${data.displayName} — USA Azemmour`} />

            <Navbar />

            {/* Hero - Dark gradient (reference design) */}
            <header className="relative min-h-[70vh] flex items-end overflow-hidden pt-24">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #0D0D0D 0%, #4A0E22 50%, #1a0810 100%)',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)',
                    }}
                />
                <div className="absolute right-0 top-0 bottom-0 w-[55%] bg-gradient-to-l from-alpha/30 to-transparent [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]" />
                <div className="absolute right-[8%] bottom-[10%] font-black text-[clamp(10rem,25vw,20rem)] leading-none text-alpha/15 select-none pointer-events-none">
                    {data.heroNumber}
                </div>
                <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 pb-16 lg:pb-24 max-w-7xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-[#C9A84C]/40 rounded-sm px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">Saison {seasonName} · En cours</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black uppercase italic leading-none mb-2 text-white">
                        Équipe
                        <span className="block text-[#C9A84C]">{data.displayName}</span>
                    </h1>
                    <p className="text-white/50 font-medium uppercase tracking-[0.2em] text-sm sm:text-base mb-10">
                        {data.division}
                    </p>
                    <div className="flex flex-wrap gap-0 border border-white/10 w-fit">
                        {[
                            { label: 'Classement', value: data.stats.rank },
                            { label: 'Points', value: data.stats.points },
                            { label: 'Joueuses', value: data.stats.players },
                            { label: 'Diff. Buts', value: data.stats.goalDiff },
                        ].map((s, i) => (
                            <div key={i} className="px-6 py-4 border-r border-white/10 last:border-r-0 text-center">
                                <span className="block text-xl sm:text-2xl font-black text-[#C9A84C]">{s.value}</span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <main>
                {/* Results & Calendar - Light */}
                <section className="py-16 sm:py-24 bg-gray-50">
                    <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-px bg-alpha" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-alpha">Compétition</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic mb-12">
                            Résultats & Calendrier
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                            {/* Next Match */}
                            {data.nextMatch && (
                                <div className="lg:col-span-4 p-6 sm:p-8 rounded-2xl bg-alpha text-white border border-alpha/20 relative overflow-hidden">
                                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-white/70">Prochain Match</span>
                                    <div className="mt-8">
                                        <div className="flex items-center justify-between gap-4 mb-5">
                                            <div className="text-center flex-1">
                                                <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden mx-auto mb-2">
                                                    {data.nextMatch.homeTeamLogo ? (
                                                        <img src={data.nextMatch.homeTeamLogo} alt={data.nextMatch.homeTeam} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="font-black text-alpha text-sm">{String(data.nextMatch.homeTeam || '').slice(0, 2)}</span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-semibold uppercase text-white/90">{data.nextMatch.homeTeam === 'USA' ? 'USA Azemmour' : data.nextMatch.homeTeam}</span>
                                            </div>
                                            <span className="text-2xl font-black text-white/40">VS</span>
                                            <div className="text-center flex-1">
                                                <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden mx-auto mb-2">
                                                    {data.nextMatch.awayTeamLogo ? (
                                                        <img src={data.nextMatch.awayTeamLogo.startsWith('/') ? data.nextMatch.awayTeamLogo : `/storage/${data.nextMatch.awayTeamLogo}`} alt={data.nextMatch.awayTeam} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="font-black text-white/80 text-sm">{String(data.nextMatch.awayTeam || '').slice(0, 2)}</span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-semibold uppercase text-white/90">{data.nextMatch.awayTeam === 'USA' ? 'USA Azemmour' : data.nextMatch.awayTeam}</span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-1">{data.nextMatch.date}</div>
                                            <div className="text-3xl font-black">{data.nextMatch.time}</div>
                                            <div className="text-xs text-white/60 mt-1">{data.nextMatch.venue}</div>
                                        </div>
                                        {data.nextMatch.form?.length > 0 && (
                                            <div className="flex justify-center gap-1.5 mt-4">
                                                {data.nextMatch.form.map((f, i) => (
                                                    <span key={i} className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${getFormClass(f)}`}>
                                                        {getFormLabel(f)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <Link href="/" className="block w-full mt-6 bg-white text-alpha font-bold py-3 rounded-lg text-center hover:bg-gray-100 transition-colors text-sm uppercase tracking-wider">
                                            Voir le match
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Results list */}
                            <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="grid grid-cols-[60px_36px_1fr_auto] gap-3 px-4 py-3 bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    <span>Date</span>
                                    <span></span>
                                    <span>Adversaire</span>
                                    <span>Score</span>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {data.results.length > 0 ? data.results.map((r, i) => (
                                        <div key={i} className={`grid grid-cols-[60px_36px_1fr_auto] gap-3 px-4 py-3 items-center hover:bg-gray-50 transition-colors border-l-4 ${getBorderClass(r.type)}`}>
                                            <span className="text-xs text-gray-500">{r.date}</span>
                                            <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {r.opponentLogo ? (
                                                    <img src={r.opponentLogo.startsWith('/') ? r.opponentLogo : `/storage/${r.opponentLogo}`} alt={r.opponent} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[10px] font-bold text-gray-500">{r.opponent.slice(0, 2)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-dark">{r.opponent}</span>
                                                <span className="block text-xs text-gray-400">{r.venue}</span>
                                            </div>
                                            <span className={`font-bold ${getScoreClass(r.type)}`}>{r.score}</span>
                                        </div>
                                    )) : (
                                        <div className="px-4 py-8 text-center text-gray-400 text-sm">Aucun résultat pour le moment.</div>
                                    )}
                                </div>
                            </div>

                            {/* Standings */}
                            <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="bg-alpha text-white px-4 py-3 text-sm font-bold uppercase tracking-wider">
                                    Classement {data.displayName} {seasonName}
                                </div>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                            <th className="px-3 py-2.5 text-left">#</th>
                                            <th className="px-3 py-2.5 text-left">Équipe</th>
                                            <th className="px-3 py-2.5 text-left">J</th>
                                            <th className="px-3 py-2.5 text-left">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.standings.length > 0 ? data.standings.map((row) => (
                                            <tr key={row.rank} className={`border-t border-gray-100 hover:bg-gray-50 ${row.isUsa ? 'bg-alpha/5 font-semibold' : ''}`}>
                                                <td className={`px-3 py-2.5 font-black ${row.isUsa ? 'text-alpha' : 'text-gray-400'}`}>{row.rank}</td>
                                                <td className="px-3 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        {row.teamLogo ? (
                                                            <img src={row.teamLogo.startsWith('/') ? row.teamLogo : `/storage/${row.teamLogo}`} alt={row.team} className="w-6 h-6 rounded-full object-cover shrink-0" />
                                                        ) : (
                                                            <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">{row.team.slice(0, 2)}</span>
                                                        )}
                                                        <span>{row.team}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5">{row.played}</td>
                                                <td className={`px-3 py-2.5 font-bold ${row.isUsa ? 'text-alpha' : ''}`}>{row.pts}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Classement à venir.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Squad - Light */}
                {data.players.length > 0 && (
                    <section className="py-16 sm:py-24 bg-white">
                        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-px bg-alpha" />
                                <span className="text-xs font-semibold uppercase tracking-widest text-alpha">Effectif</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic mb-10">
                                L&apos;Équipe 2025–2026
                            </h2>

                            <div className="flex flex-wrap gap-2 mb-10">
                                {POSITION_FILTERS.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setPositionFilter(f)}
                                        className={`px-4 py-2.5 text-sm font-semibold uppercase tracking-wider rounded-lg border transition-colors ${
                                            positionFilter === f
                                                ? 'bg-alpha text-white border-alpha'
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-alpha/40 hover:text-alpha'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filteredPlayers.map((p, i) => {
                                    const hasPhoto = !!(p.photo);
                                    const bgStyle = hasPhoto
                                        ? { backgroundImage: `url(${p.photo.startsWith('/') ? p.photo : '/storage/' + p.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                        : { backgroundImage: `url(${USA_HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' };
                                    return (
                                        <div
                                            key={p.id || i}
                                            className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 hover:border-alpha/30 hover:shadow-xl transition-all"
                                            style={bgStyle}
                                        >
                                            {!hasPhoto && (
                                                <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/30">
                                                    {p.initials}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="absolute top-3 right-3 text-2xl font-black text-alpha/60 drop-shadow">{p.number}</span>
                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                <div className="text-[10px] font-semibold uppercase tracking-wider text-alpha mb-0.5">{p.position}</div>
                                                <div className="text-xs opacity-90">{p.first}</div>
                                                <div className="text-lg font-black">{p.last}</div>
                                                <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                                    {p.matches != null && p.matches > 0 && <span><strong className="text-white">{p.matches}</strong> Matchs</span>}
                                                    {p.note && <span><strong className="text-white">{p.note}</strong> Note</span>}
                                                    {p.goals != null && <span><strong className="text-white">{p.goals}</strong> Buts</span>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* Staff - Light */}
                {data.staff.length > 0 && (
                    <section className="py-16 sm:py-24 bg-gray-50">
                        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-px bg-alpha" />
                                <span className="text-xs font-semibold uppercase tracking-widest text-alpha">Encadrement</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic mb-12">
                                Staff Technique
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {data.staff.map((s, i) => {
                                    const hasStaffPhoto = !!(s.image);
                                    const staffBg = hasStaffPhoto
                                        ? { backgroundImage: `url(${s.image.startsWith('/') ? s.image : '/storage/' + s.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                        : { backgroundImage: `url(${USA_HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' };
                                    return (
                                        <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-alpha/30 transition-colors text-center">
                                            <div
                                                className="w-20 h-20 rounded-full border-2 border-alpha/20 flex items-center justify-center overflow-hidden mx-auto mb-4"
                                                style={staffBg}
                                            >
                                                {!hasStaffPhoto && (
                                                    <span className="font-black text-alpha/60 text-xl">{s.initials}</span>
                                                )}
                                            </div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-alpha mb-1">{s.role}</div>
                                            <div className="font-black text-dark">{s.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">{s.detail}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* Gallery - Light */}
                <section className="py-16 sm:py-24 bg-white">
                    <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-px bg-alpha" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-alpha">Médias</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic mb-12">
                            Photos & Vidéos
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {[
                                { label: "Photo officielle 2025–2026", bg: 'from-alpha/20 to-gray-100' },
                                { label: 'vs Rajae El Jadida', bg: 'from-gray-200 to-gray-100' },
                                { label: "Session tactique", bg: 'from-gray-100 to-gray-200' },
                                { label: 'Victoire 3–0', bg: 'from-alpha/10 to-gray-100' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`aspect-video rounded-xl bg-gradient-to-br ${item.bg} flex items-center justify-center border border-gray-200 group cursor-pointer hover:border-alpha/30 transition-colors`}
                                >
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-alpha transition-colors">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA - Light */}
                <section className="py-16 sm:py-24 bg-alpha relative overflow-hidden">
                    <span className="absolute inset-0 flex items-center justify-center text-[12rem] font-black text-white/5 pointer-events-none">
                        {data.displayName}
                    </span>
                    <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 max-w-3xl text-center">
                        <div className="flex justify-center mb-3">
                            <div className="w-8 h-px bg-white/50" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-white/80 mx-3">Rejoindre le club</span>
                            <div className="w-8 h-px bg-white/50" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black uppercase italic text-white mb-4">
                            Vous souhaitez jouer ?
                        </h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            L&apos;Union Sportive d&apos;Azemmour accueille les joueuses talentueuses et motivées. Rejoignez une équipe ambitieuse dans un cadre formateur et exigeant.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-alpha font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors">
                                Nous contacter <ChevronRight className="w-5 h-5" />
                            </Link>
                            <Link href="/shop" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
                                Voir la boutique
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
