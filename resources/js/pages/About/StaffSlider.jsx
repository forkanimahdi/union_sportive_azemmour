import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

const CARD_WIDTH = 260;
const GAP = 24;

function StaffCard({ member }) {
    const imageUrl = member.image || null;
    return (
        <div
            className="relative overflow-hidden rounded-xl flex flex-col h-[280px] sm:h-[300px] flex-shrink-0 group"
            style={{ width: CARD_WIDTH }}
        >
            <div className="relative flex-1 min-h-[160px] overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${member.first_name || ''} ${member.last_name || ''}`}
                        className="w-full h-full object-cover object-top"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-alpha/90 to-alpha flex items-center justify-center">
                        <User className="w-16 h-16 text-white/40" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 pt-8 text-white z-10">
                <p className="text-white/80 text-xs sm:text-sm uppercase tracking-wider">{member.first_name || ''}</p>
                <p className="font-bold text-base sm:text-lg truncate">{member.last_name || ''}</p>
                <p className="text-white/90 text-xs sm:text-sm mt-0.5">{member.role_label || member.role || '–'}</p>
            </div>
        </div>
    );
}

export default function StaffSlider({ title, subtitle, members = [] }) {
    const list = Array.isArray(members) ? members : [];
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
        <section className="py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-4">
                <div>
                    <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 text-alpha">{subtitle || ''}</h4>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase italic text-dark">{title}</h2>
                </div>
                {list.length > itemsPerView && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={goPrev}
                            className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors hover:bg-red-700"
                            aria-label="Précédent"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors hover:bg-red-700"
                            aria-label="Suivant"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out will-change-transform"
                    style={{ gap: GAP, transform: `translateX(${translateX}px)` }}
                >
                    {list.map((member) => (
                        <StaffCard key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}
