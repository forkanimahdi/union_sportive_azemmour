import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CARD_WIDTH = 260;
const GAP = 24;

const positionLabels = {
    GK: 'Gardien',
    G: 'Gardien',
    DF: 'Défenseur',
    D: 'Défenseur',
    MF: 'Milieu',
    M: 'Milieu',
    FW: 'Attaquant',
    F: 'Attaquant',
};

function PlayerCard({ player }) {
    const [hover, setHover] = useState(false);
    const photoUrl = player.photo ? (player.photo.startsWith('http') ? player.photo : `/storage/${player.photo}`) : null;
    const positionLabel = positionLabels[player.position?.toUpperCase()] || player.position || '–';
    const stats = {
        appearances: player.appearances ?? '–',
        goals: player.goals ?? '–',
        assists: player.assists ?? '–',
    };

    return (
        <div
            className="relative overflow-hidden rounded-xl flex flex-col h-[300px] sm:h-[340px] flex-shrink-0 group"
            style={{ width: CARD_WIDTH }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="relative flex-1 min-h-[180px] overflow-hidden">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={`${player.first_name} ${player.last_name}`}
                        className="w-full h-full object-cover object-top"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-alpha/90 to-alpha flex items-center justify-center">
                        <span className="text-5xl sm:text-6xl font-black text-white/30">{player.jersey_number ?? '?'}</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 pt-8 text-white z-10">
                <p className="text-white/80 text-xs sm:text-sm uppercase tracking-wider">{player.first_name}</p>
                <p className="font-bold text-base sm:text-lg truncate">{player.last_name}</p>
                <p className="text-white/90 text-xs sm:text-sm mt-0.5">{positionLabel}</p>
            </div>
            <div
                className={`absolute left-0 right-0 bottom-0 bg-gradient-to-t from-alpha to-alpha text-white p-4 pt-6 transition-transform duration-300 ease-out z-20 ${
                    hover ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mb-0.5">Matchs</p>
                        <p className="text-lg sm:text-xl font-black leading-tight">{stats.appearances}</p>
                    </div>
                    <div className="border-x border-white/20">
                        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mb-0.5">Buts</p>
                        <p className="text-lg sm:text-xl font-black leading-tight">{stats.goals}</p>
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mb-0.5">Passes</p>
                        <p className="text-lg sm:text-xl font-black leading-tight">{stats.assists}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SeniorSquad({ players = [], activeSeason = null }) {
    const list = Array.isArray(players) ? players : [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 3;
    const step = 1;
    const maxIndex = Math.max(0, list.length - itemsPerView);

    useEffect(() => {
        if (list.length <= itemsPerView) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + step));
        }, 4500);
        return () => clearInterval(interval);
    }, [list.length, maxIndex]);

    const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - step));
    const goNext = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + step));

    const translateX = list.length > itemsPerView ? -(currentIndex * (CARD_WIDTH + GAP)) : 0;

    if (list.length === 0) return null;

    return (
        <div className="py-16 sm:py-20 lg:py-24 bg-white">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12l">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
                    <div>
                        <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 text-alpha">Effectif</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-dark">
                            {activeSeason?.name ? `Équipe Sénior ${activeSeason.name}` : 'Équipe Sénior'}
                        </h2>
                    </div>
                    {list.length > itemsPerView && (
                        <div className="flex gap-2">
                            <button
                                onClick={goPrev}
                                className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors hover:bg-red-700"
                                aria-label="Précédent"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={goNext}
                                className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors hover:bg-red-700"
                                aria-label="Suivant"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative overflow-hidden" style={{ marginLeft: 0, marginRight: 0 }}>
                    <div
                        className="flex transition-transform duration-500 ease-out will-change-transform"
                        style={{ gap: GAP, transform: `translateX(${translateX}px)` }}
                    >
                        {list.map((player) => (
                            <PlayerCard key={player.id} player={player} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
