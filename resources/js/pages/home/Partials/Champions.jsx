import React from 'react';

export default function Champions() {
    const players = [
        { name: "John Smith", position: "Goalkeeper", number: "01", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1000&auto=format&fit=crop" },
        { name: "Robert Davis", position: "Sweeper", number: "22", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop" },
        { name: "Michael Brown", position: "Right Back", number: "16", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1000&auto=format&fit=crop" },
        { name: "William Garcia", position: "Left Back", number: "88", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop" },
    ];

    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                     <div>
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Our Team</h4>
                        <h2 className="text-3xl font-black uppercase italic">Our Soccer Club Champions</h2>
                    </div>
                     <div className="flex gap-2">
                        <button className="w-10 h-10 bg-gray-200 hover:bg-alpha hover:text-white flex items-center justify-center transition-colors">&lt;</button>
                        <button className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors">&gt;</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {players.map((player, idx) => (
                        <div key={idx} className="group relative text-center">
                            <div className="relative overflow-hidden mb-4 bg-gray-100 pt-8 rounded-lg">
                                <img src={player.image} alt={player.name} className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-white shadow-lg z-10 relative group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute bottom-0 w-full h-1/2 bg-white/0 group-hover:bg-gradient-to-t from-alpha/10 to-transparent transition-all"></div>
                                {/* Jersey Number Background */}
                                <div className="absolute top-0 right-0 text-9xl font-black text-gray-200 opacity-20 -mr-4 -mt-4 select-none">
                                    {player.number}
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-alpha text-white w-10 h-10 flex items-center justify-center font-bold text-lg rounded skew-x-[-10deg]">
                                    <span className="skew-x-[10deg]">{player.number}</span>
                                </div>
                                <h3 className="text-lg font-bold uppercase mt-4">{player.name}</h3>
                                <p className="text-xs text-alpha font-bold uppercase tracking-wider">{player.position}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

