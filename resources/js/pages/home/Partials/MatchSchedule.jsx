import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MatchSchedule() {
    const matches = [
        { id: 1, home: 'Raja Casablanca', away: 'Union Sportive Azemmour', time: '0-0', date: '15 Janvier, Stade Municipal Azemmour', timeDetail: '18:00' },
        { id: 2, home: 'Wydad Casablanca', away: 'Union Sportive Azemmour', time: '0-0', date: '22 Janvier, Stade Municipal Azemmour', timeDetail: '19:30' },
        { id: 3, home: 'FAR Rabat', away: 'Union Sportive Azemmour', time: '0-0', date: '29 Janvier, Stade Municipal Azemmour', timeDetail: '17:00' },
        { id: 4, home: 'Olympic Safi', away: 'Union Sportive Azemmour', time: '0-0', date: '05 Février, Stade Municipal Azemmour', timeDetail: '18:30' },
        { id: 5, home: 'Mouloudia Oujda', away: 'Union Sportive Azemmour', time: '0-0', date: '12 Février, Stade Municipal Azemmour', timeDetail: '19:00' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 3;

    const next = () => {
        setCurrentIndex((prev) => (prev + 1 > matches.length - itemsPerView ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? matches.length - itemsPerView : prev - 1));
    };

    return (
        <div className="py-20 bg-white text-dark">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12 border-b-2 border-gray-100 pb-4">
                    <div>
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Schedule</h4>
                        <h2 className="text-3xl font-black uppercase italic">Botola Pro Schedule</h2>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={prev}
                            className="w-10 h-10 bg-gray-200 hover:bg-alpha hover:text-white flex items-center justify-center transition-colors"
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
                        className="flex transition-transform duration-500 ease-in-out gap-8"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                    >
                        {matches.map((match) => (
                            <div key={match.id} className="min-w-[calc(33.333%-21.33px)] border border-gray-200 p-6 flex flex-col items-center hover:shadow-xl transition-shadow group relative overflow-hidden bg-white">
                                <div className="absolute top-0 left-0 w-1 h-full bg-alpha opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between w-full items-center mb-4">
                                    <div className="text-center flex-1">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full mb-2 mx-auto"></div>
                                        <span className="font-bold text-sm">{match.home}</span>
                                    </div>
                                    <div className="text-2xl font-black text-alpha bg-gray-100 px-4 py-2 rounded mx-4">
                                        {match.time}
                                    </div>
                                    <div className="text-center flex-1">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full mb-2 mx-auto"></div>
                                        <span className="font-bold text-sm">{match.away}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide text-center">{match.date}</p>
                                <p className="text-xs text-alpha font-bold mt-1">{match.timeDetail}</p>
                                <button className="mt-4 bg-alpha text-white text-xs font-bold px-6 py-2 uppercase hover:bg-red-700 transition-colors">
                                    Buy Tickets
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

