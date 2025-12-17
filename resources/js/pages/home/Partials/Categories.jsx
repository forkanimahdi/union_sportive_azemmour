import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Categories() {
    const categories = [
        { id: 'senior', name: 'Senior', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop' },
        { id: 'u20', name: 'U20', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop' },
        { id: 'u17', name: 'U17', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop' },
        { id: 'u15', name: 'U15', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop' },
        { id: 'u13', name: 'U13', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop' },
        { id: 'women', name: 'Women', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 4;

    const next = () => {
        setCurrentIndex((prev) => (prev + itemsPerView >= categories.length ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? categories.length - itemsPerView : prev - 1));
    };

    return (
        <div className="py-20 bg-dark text-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Teams</h4>
                        <h2 className="text-3xl font-black uppercase italic">Our Categories</h2>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={prev}
                            className="w-10 h-10 bg-white/10 hover:bg-alpha flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={next}
                            className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                    >
                        {categories.map((category) => (
                            <div 
                                key={category.id} 
                                className="min-w-[calc(25%-12px)] md:min-w-[calc(25%-12px)] px-3 cursor-pointer group"
                            >
                                <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all">
                                    <img 
                                        src={category.image} 
                                        alt={category.name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-2xl font-black uppercase italic">{category.name}</h3>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                                            <span>View Team</span>
                                            <span className="text-alpha">→</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

