import React from 'react';

export default function MatchSchedule() {
    const matches = [
        { id: 1, home: 'Arsenal F.C.', away: 'Leeds United', time: '0-0', date: '05 July, Wembley Stadium' },
        { id: 2, home: 'Arsenal F.C.', away: 'West Ham', time: '0-0', date: '05 July, Wembley Stadium' },
        { id: 3, home: 'Arsenal F.C.', away: 'Aston Villa', time: '0-0', date: '05 July, Wembley Stadium' },
    ];

    return (
        <div className="py-20 bg-white text-dark">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12 border-b-2 border-gray-100 pb-4">
                    <div>
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Schedule</h4>
                        <h2 className="text-3xl font-black uppercase italic">National League Schedule</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-gray-200 hover:bg-alpha hover:text-white flex items-center justify-center transition-colors">&lt;</button>
                        <button className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors">&gt;</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {matches.map((match) => (
                        <div key={match.id} className="border border-gray-200 p-6 flex flex-col items-center hover:shadow-xl transition-shadow group relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-alpha opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between w-full items-center mb-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full mb-2 mx-auto"></div>
                                    <span className="font-bold text-sm">{match.home}</span>
                                </div>
                                <div className="text-2xl font-black text-alpha bg-gray-100 px-4 py-2 rounded">
                                    {match.time}
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full mb-2 mx-auto"></div>
                                    <span className="font-bold text-sm">{match.away}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">{match.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

