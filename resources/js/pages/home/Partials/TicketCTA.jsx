import React from 'react';

export default function TicketCTA() {
    return (
        <div className="py-16 sm:py-20 lg:py-24 bg-alpha text-white relative overflow-hidden">
            {/* Background Pattern */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-12 gap-4">
                     <div>
                        <h4 className="text-white/70 font-bold text-xs sm:text-sm uppercase mb-2">Billets de Match</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">Obtenez Vos Billets Ici</h2>
                    </div>
                    <button className="bg-white text-alpha px-6 sm:px-8 py-2 sm:py-3 uppercase font-bold tracking-wider hover:bg-gray-100 transition-colors text-sm sm:text-base w-full sm:w-auto">
                        Acheter des Billets
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {[1, 2].map((item) => (
                        <div key={item} className="bg-white text-dark rounded-xl p-6 flex flex-col md:flex-row items-center relative overflow-hidden group hover:shadow-2xl transition-all">
                             <div className="flex-1 flex flex-col justify-center items-center md:items-start z-10">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-2">16 Novembre</div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        <span className="font-bold uppercase">Raja</span>
                                    </div>
                                    <span className="text-3xl font-black italic text-alpha">VS</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        <span className="font-bold uppercase">USA</span>
                                    </div>
                                </div>
                                <div className="flex gap-8 text-sm text-gray-500 border-t border-gray-100 pt-4 w-full">
                                    <div className="text-center">
                                        <span className="block font-bold text-dark">Nord</span>
                                        <span className="text-xs">Tribune</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block font-bold text-dark">C</span>
                                        <span className="text-xs">Bloc</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block font-bold text-dark">20 A</span>
                                        <span className="text-xs">Rangée</span>
                                    </div>
                                </div>
                             </div>
                             
                             <div className="border-l-2 border-dashed border-gray-300 h-full mx-6 hidden md:block"></div>
                             
                             <div className="flex flex-col justify-center items-center z-10 mt-4 md:mt-0">
                                <div className="rotate-0 md:-rotate-90 text-2xl font-mono tracking-widest text-gray-300">
                                    BILLET
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

