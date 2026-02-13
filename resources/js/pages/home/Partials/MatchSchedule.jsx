import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CLUB_LOGO = '/assets/images/logo.png';
const CLUB_NAME = 'Union Sportive Azemmour';

export default function MatchSchedule({ matches = [], activeSeason = null }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 3;
    const list = Array.isArray(matches) ? matches : [];

    const next = () => {
        setCurrentIndex((prev) => (prev + 1 > list.length - itemsPerView ? 0 : Math.min(prev + 1, Math.max(0, list.length - itemsPerView))));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? Math.max(0, list.length - itemsPerView) : prev - 1));
    };

    const formatDate = (scheduledAt) => {
        if (!scheduledAt) return '';
        const d = new Date(scheduledAt);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    };

    const formatTime = (scheduledAt) => {
        if (!scheduledAt) return '';
        const d = new Date(scheduledAt);
        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const scoreDisplay = (m) => {
        if (m.status === 'finished' && m.home_score != null && m.away_score != null) {
            return `${m.home_score} - ${m.away_score}`;
        }
        const hasResult = m.home_score != null && m.away_score != null;
        const isFuture = m.scheduled_at && new Date(m.scheduled_at) > new Date();
        if (isFuture && !hasResult) {
            return 'VS';
        }
        return '0-0';
    };

    return (
        <div className="py-16 sm:py-20 lg:py-24 bg-white text-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 border-b-2 border-gray-100 pb-4 gap-4">
                    <div>
                        <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Calendrier</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">
                            {activeSeason?.name ? `Calendrier ${activeSeason.name}` : 'Calendrier Sénior'}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={prev}
                            className="w-10 h-10 bg-gray-200 hover:bg-alpha hover:text-white flex items-center justify-center transition-colors"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {list.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">Aucun match programmé pour la saison en cours.</p>
                ) : (
                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6 lg:gap-8"
                            style={{ transform: `translateX(-${currentIndex * (100 / Math.max(1, itemsPerView))}%)` }}
                        >
                            {list.map((match) => {
                                const weAreHome = match.type === 'domicile';
                                const homeLogo = weAreHome ? CLUB_LOGO : (match.home_team_logo ? `/storage/${match.home_team_logo}` : null);
                                const homeName = weAreHome ? CLUB_NAME : match.home_team;
                                const awayLogo = !weAreHome ? CLUB_LOGO : (match.away_team_logo ? `/storage/${match.away_team_logo}` : null);
                                const awayName = !weAreHome ? CLUB_NAME : match.away_team;
                                return (
                                <div
                                    key={match.id}
                                    className="min-w-[calc(100%-16px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-21.33px)] border border-gray-200 p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-shadow group relative overflow-hidden bg-white"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-alpha opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between w-full items-center mb-4 gap-2">
                                        <div className="text-center flex-1">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 mx-auto overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                                                {homeLogo ? (
                                                    <img src={homeLogo} alt={homeName} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-gray-400 text-lg font-bold">?</span>
                                                )}
                                            </div>
                                            <span className="font-bold text-xs sm:text-sm break-words">{homeName}</span>
                                        </div>
                                        <div className="text-xl sm:text-2xl font-black text-alpha bg-gray-100 px-2 sm:px-4 py-2 rounded mx-2 sm:mx-4">
                                            {scoreDisplay(match)}
                                        </div>
                                        <div className="text-center flex-1">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 mx-auto overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                                                {awayLogo ? (
                                                    <img src={awayLogo} alt={awayName} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-gray-400 text-lg font-bold">?</span>
                                                )}
                                            </div>
                                            <span className="font-bold text-xs sm:text-sm break-words">{awayName}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide text-center">
                                        {formatDate(match.scheduled_at)}{match.venue ? `, ${match.venue}` : ''}
                                    </p>
                                    <p className="text-xs text-alpha font-bold mt-1">{formatTime(match.scheduled_at)}</p>
                                    <button className="mt-4 bg-alpha text-white text-xs font-bold px-4 sm:px-6 py-2 uppercase hover:bg-red-700 transition-colors w-full sm:w-auto">
                                        Acheter des billets
                                    </button>
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

