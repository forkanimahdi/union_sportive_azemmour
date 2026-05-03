import React, { useMemo, useState, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FORMATION_OPTIONS, getPitchSlots } from '@/lib/matchFormationSlots';

const SLOT_MIME = 'application/x-usa-lineup-slot';

/** Compact ball icon (but / penalty on pitch). */
function SoccerBallIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
            <path
                d="M12 3.2 14.2 7.6l5 .7-3.6 3.5.9 5-4.5-2.4L7.5 17.3l.9-5L4.8 8.3l5-.7L12 3.2z"
                fill="currentColor"
                opacity="0.88"
            />
            <path d="M7 8.5c2.5 1.8 7.5 1.8 10 0M5.5 14.5c3.2 2 10.3 2 13 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
        </svg>
    );
}

/** Cleat / boot for assists. */
function BootIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M4 16.5c0-1.1.9-2 2-2h1.5l2.2-4.4a2 2 0 0 1 1.8-1.1H15c.8 0 1.5.4 1.9 1.1L18.5 14.5H20c1.1 0 2 .9 2 2v1H4v-1z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path d="M7 18.5v2M10 18.5v2M13 18.5v2M16 18.5v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

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

function PitchPlayer({
    line,
    slot,
    coords,
    teamPlayers,
    dragSourceSlot,
    onDragStartSlot,
    onDragEnd,
    onSwapStartingPositions,
    lineupStats,
    clickSwapMode,
    clickSwapFromSlot,
    onPitchPlayerClick,
}) {
    const info = teamPlayers.find((p) => p.id === line.player_id);
    const name = shortName(info?.first_name, info?.last_name);
    const num = line.jersey_number ?? info?.jersey_number;
    const isDragging = dragSourceSlot === slot;
    const goals = lineupStats?.goals ?? 0;
    const assists = lineupStats?.assists ?? 0;
    const isClickSwapSource = clickSwapMode && clickSwapFromSlot === slot;

    const handleDragStart = (e) => {
        e.dataTransfer.setData(SLOT_MIME, String(slot));
        e.dataTransfer.effectAllowed = 'move';
        onDragStartSlot(slot);
        e.stopPropagation();
    };

    const handleDragEnd = () => {
        onDragEnd();
    };

    const handleDragOver = (e) => {
        if (dragSourceSlot == null || dragSourceSlot === slot) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const raw = e.dataTransfer.getData(SLOT_MIME);
        const from = parseInt(raw, 10);
        if (!Number.isFinite(from) || from < 1 || from > 11 || from === slot) {
            onDragEnd();
            return;
        }
        onSwapStartingPositions(from, slot);
        onDragEnd();
    };

    return (
        <div
            className="absolute z-10 flex w-[22%] min-w-[72px] max-w-[100px] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${coords.left}%`, top: `${coords.top}%` }}
            data-slot={slot}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onClick={() => onPitchPlayerClick(slot)}
                onKeyDown={(e) => {
                    if (!clickSwapMode) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onPitchPlayerClick(slot);
                    }
                }}
                role={clickSwapMode ? 'button' : undefined}
                tabIndex={clickSwapMode ? 0 : undefined}
                className={`w-full cursor-grab rounded-lg border-2 bg-white p-1 text-left shadow-lg ring-1 ring-black/10 transition-[opacity,transform,box-shadow] active:cursor-grabbing ${
                    isDragging ? 'scale-95 opacity-55' : ''
                } ${isClickSwapSource ? 'border-amber-400 ring-2 ring-amber-300' : 'border-white/90'}`}
            >
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
                {(goals > 0 || assists > 0) && (
                    <div className="mt-0.5 flex items-center justify-center gap-1.5 border-t border-neutral-100 pt-0.5">
                        {goals > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700" title="Buts">
                                <SoccerBallIcon className="h-3 w-3 shrink-0" />
                                {goals}
                            </span>
                        )}
                        {assists > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-sky-700" title="Passes décisives">
                                <BootIcon className="h-3 w-3 shrink-0" />
                                {assists}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Terrain stylisé + banc. Glisser-déposer une joueuse sur une autre pour échanger les places.
 */
export default function MatchLineupPitch({
    formation,
    onFormationChange,
    onSwapStartingPositions,
    startingXI,
    teamPlayers,
    substitutes = [],
    lineupStatsByPlayerId = {},
    className = '',
}) {
    const [dragSourceSlot, setDragSourceSlot] = useState(null);
    const [clickSwapMode, setClickSwapMode] = useState(false);
    const [clickSwapFromSlot, setClickSwapFromSlot] = useState(null);

    const slots = useMemo(() => getPitchSlots(formation), [formation]);

    const bySlot = useMemo(() => {
        const m = {};
        startingXI.forEach((line) => {
            if (line.starting_position >= 1 && line.starting_position <= 11) {
                m[line.starting_position] = line;
            }
        });
        return m;
    }, [startingXI]);

    const handlePitchDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const clearDrag = useCallback(() => {
        setDragSourceSlot(null);
    }, []);

    const handlePitchPlayerClick = useCallback(
        (slot) => {
            if (!clickSwapMode) return;
            if (clickSwapFromSlot == null) {
                setClickSwapFromSlot(slot);
                return;
            }
            if (clickSwapFromSlot === slot) {
                setClickSwapFromSlot(null);
                return;
            }
            onSwapStartingPositions(clickSwapFromSlot, slot);
            setClickSwapFromSlot(null);
        },
        [clickSwapMode, clickSwapFromSlot, onSwapStartingPositions]
    );

    const hasPitch = startingXI.length > 0;

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="rounded-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-3 shadow-inner ring-1 ring-white/10 sm:p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <p className="text-center text-[10px] font-medium uppercase tracking-wider text-white/60 sm:text-left">Terrain</p>
                    <div className="flex flex-col gap-1.5 sm:w-48">
                        <Label className="text-[10px] uppercase tracking-wide text-white/50">Système</Label>
                        <Select value={formation} onValueChange={onFormationChange}>
                            <SelectTrigger className="h-9 border-white/20 bg-white/10 text-white">
                                <SelectValue placeholder="Formation" />
                            </SelectTrigger>
                            <SelectContent>
                                {FORMATION_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <p className="text-center text-[9px] text-white/45 sm:text-left">
                        Glisser-déposer une joueuse sur une autre pour échanger. Les buts et passes D. du match s&apos;affichent sous le nom.
                    </p>
                    <Button
                        type="button"
                        variant={clickSwapMode ? 'default' : 'secondary'}
                        size="sm"
                        className={
                            clickSwapMode
                                ? 'h-8 shrink-0 bg-amber-500 text-neutral-900 hover:bg-amber-400'
                                : 'h-8 shrink-0 border-white/25 bg-white/10 text-white hover:bg-white/20'
                        }
                        onClick={() => {
                            setClickSwapMode((v) => !v);
                            setClickSwapFromSlot(null);
                        }}
                    >
                        {clickSwapMode ? 'Échange par clic (actif)' : 'Échange par clic'}
                    </Button>
                </div>
                {clickSwapMode && (
                    <p className="mb-2 rounded-md border border-amber-400/40 bg-amber-500/15 px-2 py-1.5 text-center text-[10px] font-medium text-amber-100 sm:text-left">
                        {clickSwapFromSlot == null
                            ? 'Cliquez une première joueuse, puis une seconde pour échanger leurs places.'
                            : `Place ${clickSwapFromSlot} sélectionnée — cliquez une autre titulaire pour échanger (ou recliquez pour annuler).`}
                    </p>
                )}

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
                        onDragOver={handlePitchDragOver}
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
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((slot) => {
                            const line = bySlot[slot];
                            const coords = slots[slot];
                            if (!line || !coords) return null;
                            return (
                                <PitchPlayer
                                    key={slot}
                                    line={line}
                                    slot={slot}
                                    coords={coords}
                                    teamPlayers={teamPlayers}
                                    dragSourceSlot={dragSourceSlot}
                                    onDragStartSlot={setDragSourceSlot}
                                    onDragEnd={clearDrag}
                                    onSwapStartingPositions={onSwapStartingPositions}
                                    lineupStats={lineupStatsByPlayerId[line.player_id] ?? lineupStatsByPlayerId[String(line.player_id)]}
                                    clickSwapMode={clickSwapMode}
                                    clickSwapFromSlot={clickSwapFromSlot}
                                    onPitchPlayerClick={handlePitchPlayerClick}
                                />
                            );
                        })}
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
