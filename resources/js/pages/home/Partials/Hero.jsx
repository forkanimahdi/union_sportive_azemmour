import React from 'react';

export default function Hero() {
    return (
        <div className="relative h-screen w-full bg-dark overflow-hidden">
            {/* Background Image Overlay - Using a dark gradient + alpha color tint */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-alpha/40 z-10"></div>
            
            {/* Placeholder for actual background image */}
            <div className="absolute inset-0 bg-[url('/assets/images/banner/banner-1.png')] bg-cover bg-center"></div>

            <div className="relative z-20 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white">
                <h2 className="text-base sm:text-lg md:text-xl uppercase tracking-[0.2em] mb-4 sm:mb-6 text-alpha font-bold">Bienvenue dans notre club de football</h2>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase italic leading-tight mb-6 sm:mb-8 drop-shadow-lg px-4">
                    Jouez avec Passion,<br />
                    Gagnez avec <span className="text-alpha">Fierté</span>
                </h1>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-4 sm:px-0">
                    <button className="bg-alpha hover:bg-red-700 text-white px-6 sm:px-8 py-3 uppercase font-bold tracking-wider transition-all skew-x-[-10deg] text-sm sm:text-base">
                        <span className="block skew-x-[10deg]">En savoir plus</span>
                    </button>
                    <button className="bg-white hover:bg-gray-200 text-dark px-6 sm:px-8 py-3 uppercase font-bold tracking-wider transition-all skew-x-[-10deg] text-sm sm:text-base">
                        <span className="block skew-x-[10deg]">Voir le match</span>
                    </button>
                </div>
            </div>
            
            {/* Next Match Overlay/Floater could go here if design demands, but keeping it simple for now */}
        </div>
    );
}

