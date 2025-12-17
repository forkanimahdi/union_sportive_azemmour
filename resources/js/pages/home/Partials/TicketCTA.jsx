import React from 'react';

export default function TicketCTA() {
    return (
        <div className="py-20 bg-alpha text-white relative overflow-hidden">
            {/* Background Pattern */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                     <div>
                        <h4 className="text-white/70 font-bold text-sm uppercase mb-2">Match Tickets</h4>
                        <h2 className="text-3xl font-black uppercase italic">Get Your Tickets Here</h2>
                    </div>
                    <button className="bg-white text-alpha px-8 py-3 uppercase font-bold tracking-wider hover:bg-gray-100 transition-colors mt-4 md:mt-0">
                        Buy Tickets
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((item) => (
                        <div key={item} className="bg-white text-dark rounded-xl p-6 flex flex-col md:flex-row items-center relative overflow-hidden group hover:shadow-2xl transition-all">
                             <div className="flex-1 flex flex-col justify-center items-center md:items-start z-10">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-2">16 November</div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        <span className="font-bold uppercase">Arsenal</span>
                                    </div>
                                    <span className="text-3xl font-black italic text-alpha">VS</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        <span className="font-bold uppercase">Leeds</span>
                                    </div>
                                </div>
                                <div className="flex gap-8 text-sm text-gray-500 border-t border-gray-100 pt-4 w-full">
                                    <div className="text-center">
                                        <span className="block font-bold text-dark">North</span>
                                        <span className="text-xs">Venue</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block font-bold text-dark">C</span>
                                        <span className="text-xs">Block</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block font-bold text-dark">20 A</span>
                                        <span className="text-xs">Row</span>
                                    </div>
                                </div>
                             </div>
                             
                             <div className="border-l-2 border-dashed border-gray-300 h-full mx-6 hidden md:block"></div>
                             
                             <div className="flex flex-col justify-center items-center z-10 mt-4 md:mt-0">
                                <div className="rotate-0 md:-rotate-90 text-2xl font-mono tracking-widest text-gray-300">
                                    TICKET
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

