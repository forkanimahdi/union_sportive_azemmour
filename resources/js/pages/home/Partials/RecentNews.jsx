import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { User, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function RecentNews({ articles = [] }) {
    const news = Array.isArray(articles) ? articles : [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 3;

    const next = () => {
        setCurrentIndex((prev) => (prev + 1 > Math.max(0, news.length - itemsPerView) ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? Math.max(0, news.length - itemsPerView) : prev - 1));
    };

    const formatDate = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="py-16 sm:py-20 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
                     <div>
                        <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Notre Blog</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">Nos Actualités Récentes</h2>
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

                {news.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">Aucune actualité pour le moment.</p>
                ) : (
                <div className="relative overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6 lg:gap-8"
                        style={{ transform: `translateX(-${currentIndex * (100 / Math.max(1, itemsPerView))}%)` }}
                    >
                        {news.map((item) => (
                            <div key={item.id} className="min-w-[calc(100%-16px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-21.33px)] bg-white group hover:shadow-2xl transition-all duration-300">
                                <div className="relative overflow-hidden h-48 sm:h-56 lg:h-60">
                                    {item.image ? (
                                        <img src={'/storage/' + item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">Sans image</div>
                                    )}
                                    {item.category && (
                                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-alpha text-white text-xs font-bold px-2 sm:px-3 py-1 uppercase">
                                            {item.category}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 sm:p-6">
                                    <div className="text-xs text-gray-500 mb-2">{formatDate(item.created_at)}</div>
                                    <h3 className="text-lg sm:text-xl font-bold uppercase italic leading-tight mb-3 sm:mb-4 hover:text-alpha transition-colors cursor-pointer">
                                        {item.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3 sm:gap-4 border-t border-gray-100 pt-3 sm:pt-4 mb-3 sm:mb-4">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3 text-alpha" />
                                            <span>Par {item.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3 text-alpha" />
                                            <span>{item.views ?? 0}</span>
                                        </div>
                                    </div>
                                    <Link href={`/articles/${item.id}`} className="block w-full bg-dark text-white text-center text-xs font-bold px-4 sm:px-6 py-2 sm:py-3 uppercase tracking-wider group-hover:bg-alpha transition-colors">
                                        Lire la suite
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

