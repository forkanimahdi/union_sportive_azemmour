import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Places 1–11 sur un terrain type 4-3-3 (vue du dessus, gardienne en haut).
 */
const PITCH_SLOTS = {
    1: { top: 6, left: 50 },
    2: { top: 20, left: 8 },
    3: { top: 18, left: 32 },
    4: { top: 18, left: 68 },
    5: { top: 20, left: 92 },
    6: { top: 38, left: 20 },
    7: { top: 40, left: 50 },
    8: { top: 38, left: 80 },
    9: { top: 58, left: 15 },
    10: { top: 62, left: 50 },
    11: { top: 58, left: 85 },
};

function initials(firstName, lastName) {
    const a = (firstName || '').charAt(0);
    const b = (lastName || '').charAt(0);
    return `${a}${b}`.toUpperCase() || '?';
}

function shortName(firstName, lastName) {
    const f = (firstName || '').trim();
    const l = (lastName || '').trim();
    if (!f && !l) return '—';
    if (l.length <= 10) return `${f} ${l}`.trim();
    return `${f} ${l.charAt(0)}.`.trim();
}

function PitchPlayer({ line, teamPlayers }) {
    const info = teamPlayers.find((p) => p.id === line.player_id);
    const slot = PITCH_SLOTS[line.starting_position];
    if (!slot) return null;

    const name = shortName(info?.first_name, info?.last_name);
    const num = line.jersey_number ?? info?.jersey_number;

    return (
        <div
            className="absolute z-10 flex w-[22%] min-w-[72px] max-w-[100px] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
        >
            <div className="w-full rounded-lg border-2 border-white/90 bg-white p-1 shadow-lg ring-1 ring-black/10">
                <Avatar className="mx-auto h-9 w-9 sm:h-10 sm:w-10">
                    {info?.photo ? <AvatarImage src={info.photo} alt="" className="object-cover" /> : null}
                    <AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary sm:text-xs">
                        {initials(info?.first_name, info?.last_name)}
                    </AvatarFallback>
                </Avatar>
                <p className="mt-0.5 truncate px-0.5 text-center text-[9px] font-bold leading-tight text-neutral-900 sm:text-[10px]">
                    {name}
                </p>
                {num != null && (
                    <p className="text-center text-[8px] font-semibold text-muted-foreground">#{num}</p>
                )}
            </div>
        </div>
    );
}

/**
 * Terrain stylisé + banc (remplaçantes).
 */
export default function MatchLineupPitch({ startingXI, teamPlayers, substitutes = [], className = '' }) {
    const hasPitch = startingXI.length > 0;

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="rounded-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-3 shadow-inner ring-1 ring-white/10 sm:p-4">
                <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-wider text-white/60">Terrain</p>
                {!hasPitch ? (
                    <p className="rounded-lg border border-dashed border-white/20 bg-white/5 py-12 text-center text-sm text-white/50">
                        Ajoutez des titulaires pour afficher le terrain
                    </p>
                ) : (
                    <div
                        className="relative mx-auto aspect-[3/4] w-full max-w-lg overflow-hidden rounded-lg border border-white/20 shadow-xl"
                        style={{
                            background: 'repeating-linear-gradient(90deg, #1f6b35 0px, #1f6b35 14px, #258f42 14px, #258f42 28px)',
                        }}
                    >
                        <svg
                            className="pointer-events-none absolute inset-0 h-full w-full text-white/45"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden
                        >
                            <rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="0.35" />
                            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.35" />
                            <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="0.35" />
                            <circle cx="50" cy="50" r="0.8" fill="currentColor" />
                            <rect x="20" y="2" width="60" height="22" fill="none" stroke="currentColor" strokeWidth="0.35" />
                            <rect x="20" y="76" width="60" height="22" fill="none" stroke="currentColor" strokeWidth="0.35" />
                            <path d="M 38 2 Q 50 12 62 2" fill="none" stroke="currentColor" strokeWidth="0.35" />
                            <path d="M 38 98 Q 50 88 62 98" fill="none" stroke="currentColor" strokeWidth="0.35" />
                        </svg>
                        {startingXI.map((line) => (
                            <PitchPlayer key={`${line.player_id}-${line.starting_position}`} line={line} teamPlayers={teamPlayers} />
                        ))}
                    </div>
                )}

                {substitutes.length > 0 && (
                    <div className="mt-3">
                        <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-white/50">Banc</p>
                        <div className="flex flex-wrap justify-center gap-2 rounded-lg border border-white/10 bg-black/25 px-2 py-2">
                            {substitutes.map((line) => {
                                const info = teamPlayers.find((p) => p.id === line.player_id);
                                return (
                                    <div
                                        key={line.player_id}
                                        className="flex min-w-[76px] max-w-[120px] flex-col items-center rounded-md border border-white/15 bg-white/90 p-1.5 shadow"
                                    >
                                        <Avatar className="h-8 w-8">
                                            {info?.photo ? <AvatarImage src={info.photo} alt="" className="object-cover" /> : null}
                                            <AvatarFallback className="bg-neutral-200 text-[9px] font-bold text-neutral-700">
                                                {initials(info?.first_name, info?.last_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="mt-0.5 max-w-full truncate px-0.5 text-center text-[9px] font-semibold text-neutral-900">
                                            {shortName(info?.first_name, info?.last_name)}
                                        </p>
                                        <span className="text-[8px] font-medium text-muted-foreground">Rempl.</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
