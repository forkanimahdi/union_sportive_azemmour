import React, { useState } from 'react';
import { Calendar, User, ChevronLeft, ChevronRight, Eye, MessageCircle } from 'lucide-react';

export default function RecentNews() {
    const news = [
        {
            id: 1,
            title: "Union Sportive Azemmour remporte la victoire face au Raja",
            author: "Ahmed Benali",
            comments: 12,
            views: 245,
            image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop",
            date: "05 Janvier 2025",
            category: "Match Report"
        },
        {
            id: 2,
            title: "Nouvelle saison: Les objectifs de l'équipe pour 2025",
            author: "Fatima Alami",
            comments: 8,
            views: 189,
            image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop",
            date: "06 Janvier 2025",
            category: "Club News"
        },
        {
            id: 3,
            title: "Académie U17: Les jeunes talents à suivre",
            author: "Youssef Idrissi",
            comments: 15,
            views: 312,
            image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000&auto=format&fit=crop",
            date: "07 Janvier 2025",
            category: "Academy"
        },
        {
            id: 4,
            title: "Interview exclusive avec le capitaine de l'équipe",
            author: "Sara Tazi",
            comments: 23,
            views: 456,
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop",
            date: "08 Janvier 2025",
            category: "Interview"
        },
        {
            id: 5,
            title: "Préparation physique: Les secrets de notre équipe",
            author: "Mohamed Bensaid",
            comments: 7,
            views: 178,
            image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop",
            date: "09 Janvier 2025",
            category: "Training"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 3;

    const next = () => {
        setCurrentIndex((prev) => (prev + 1 > news.length - itemsPerView ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? news.length - itemsPerView : prev - 1));
    };

    return (
        <div className="py-16 sm:py-20 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
                     <div>
                        <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Our Blog</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">Our Recent News</h2>
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

                <div className="relative overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6 lg:gap-8"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                    >
                        {news.map((item) => (
                            <div key={item.id} className="min-w-[calc(100%-16px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-21.33px)] bg-white group hover:shadow-2xl transition-all duration-300">
                                <div className="relative overflow-hidden h-48 sm:h-56 lg:h-60">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-alpha text-white text-xs font-bold px-2 sm:px-3 py-1 uppercase">
                                        {item.category}
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6">
                                    <div className="text-xs text-gray-500 mb-2">{item.date}</div>
                                    <h3 className="text-lg sm:text-xl font-bold uppercase italic leading-tight mb-3 sm:mb-4 hover:text-alpha transition-colors cursor-pointer">
                                        {item.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3 sm:gap-4 border-t border-gray-100 pt-3 sm:pt-4 mb-3 sm:mb-4">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3 text-alpha" />
                                            <span>By {item.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3 text-alpha" />
                                            <span>{item.comments}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3 text-alpha" />
                                            <span>{item.views}</span>
                                        </div>
                                    </div>
                                    <button className="w-full bg-dark text-white text-xs font-bold px-4 sm:px-6 py-2 sm:py-3 uppercase tracking-wider group-hover:bg-alpha transition-colors">
                                        Read More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

