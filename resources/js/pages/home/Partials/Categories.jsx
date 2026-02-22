import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import usaHero from '../../../../../public/assets/images/hero/usa_hero.webp';

export default function Categories() {
    const categories = [
        { id: 'senior', name: 'Senior', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop' },
        { id: 'u17', name: 'U17', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop' },
        { id: 'u15', name: 'U15', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = Math.min(4, categories.length);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1 >= categories.length ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
    };

    return (
        <div className="py-16 sm:py-20 lg:py-24 bg-alpha text-white">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12l">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
                    <div>
                        <h4 className="text-white font-bold text-xs sm:text-sm uppercase mb-2">Équipes</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">Nos Catégories</h2>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={prev}
                            className="w-10 h-10 bg-white/10 hover:bg-alpha flex items-center justify-center transition-colors"
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

                <div className="relative overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                    >
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.id}`}
                                className="min-w-[calc(50%-8px)] sm:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-18px)] cursor-pointer group block"
                            >
                                <div className="relative h-48 sm:h-56 lg:h-64 bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all">
                                    <img 
                                        src={usaHero} 
                                        alt={category.name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                                        <h3 className="text-xl sm:text-2xl font-black uppercase italic">{category.name}</h3>
                                        <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                                            <span>Voir l&apos;équipe</span>
                                            <span className="text-alpha">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

