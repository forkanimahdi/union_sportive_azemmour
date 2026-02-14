import React from 'react';

export default function Sponsors({ sponsors = [] }) {
    const list = Array.isArray(sponsors) ? sponsors : [];
    if (list.length === 0) return null;

    // Triple for seamless infinite marquee (animation translates -33.333%)
    const items = [...list, ...list, ...list];

    return (
        <div className="py-12 sm:py-16 bg-gray-50 border-y border-gray-100 overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12l mb-8 text-center">
                <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase tracking-wider mb-1">Nos Partenaires</h4>
                <h2 className="text-xl sm:text-2xl font-black uppercase italic text-dark">Partenaires & Sponsors</h2>
            </div>
            <div className="relative overflow-hidden">
                <div
                    className="flex gap-12 sm:gap-16 lg:gap-20 items-center animate-marquee"
                    style={{ width: 'max-content', display: 'flex' }}
                >
                    {items.map((s, idx) => (
                        <a
                            key={s.id + '-' + idx}
                            href={s.url || '#'}
                            target={s.url ? '_blank' : undefined}
                            rel={s.url ? 'noopener noreferrer' : undefined}
                            className="flex-shrink-0 w-28 sm:w-32 lg:w-40 h-16 sm:h-20 flex items-center justify-center grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
                        >
                            {s.logo ? (
                                <img
                                    src={'/storage/' + s.logo}
                                    alt={s.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <span className="text-sm font-bold text-gray-400 truncate">{s.name}</span>
                            )}
                        </a>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
