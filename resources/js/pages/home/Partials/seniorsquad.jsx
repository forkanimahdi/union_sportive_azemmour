import React, { useState } from 'react';

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
        season_appearances: player.season_appearances ?? '–',
        season_goals: player.season_goals ?? '–',
        season_assists: player.season_assists ?? '–',
    };

    return (
        <div
            className="relative overflow-hidden rounded-lg bg-white/5 flex flex-col h-[320px] sm:h-[360px] group"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* Card image / placeholder */}
            <div className="relative flex-1 min-h-[200px] overflow-hidden">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={`${player.first_name} ${player.last_name}`}
                        className="w-full h-full object-cover object-top"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-alpha/90 to-alpha flex items-center justify-center">
                        <span className="text-6xl sm:text-7xl font-black text-white/30">{player.jersey_number ?? '?'}</span>
                    </div>
                )}
                {/* Gradient overlay at bottom of image for name readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Name & position (always visible at bottom of card) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pt-8 text-white z-10">
                <p className="text-white/80 text-xs sm:text-sm uppercase tracking-wider">{player.first_name}</p>
                <p className="font-bold text-lg sm:text-xl truncate">{player.last_name}</p>
                <p className="text-white/90 text-xs sm:text-sm mt-0.5">{positionLabel}</p>
            </div>

            {/* Hover overlay: slides up from bottom with stats (Barcelona-style) */}
            <div
                className={`absolute left-0 right-0 bottom-0 bg-gradient-to-t from-alpha  to-alpha text-white p-4 pt-6 transition-transform duration-300 ease-out z-20 ${
                    hover ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mb-0.5">Matchs</p>
                        <p className="text-xl sm:text-2xl font-black leading-tight">{stats.appearances}</p>

                    </div>
                    <div className="border-x border-white/20">
                        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mb-0.5">Buts</p>
                        <p className="text-xl sm:text-2xl font-black leading-tight">{stats.goals}</p>
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mb-0.5">Passes</p>
                        <p className="text-xl sm:text-2xl font-black leading-tight">{stats.assists}</p>
   
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SeniorSquad({ players = [], activeSeason = null }) {
    const list = Array.isArray(players) ? players : [];
    if (list.length === 0) return null;

    return (
        <div className="py-16 sm:py-20 lg:py-24 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 sm:mb-12">
                    <h4 className=" font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">Effectif</h4>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic text-alpha">
                        {activeSeason?.name ? `Équipe Sénior ${activeSeason.name}` : 'Équipe Sénior'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                    {list.map((player) => (
                        <PlayerCard key={player.id} player={player} />
                    ))}
                </div>
            </div>
        </div>
    );
}
