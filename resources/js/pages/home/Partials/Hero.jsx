import React from 'react';

export default function Hero() {
    return (
        <div className="relative h-screen w-full bg-dark overflow-hidden">
            {/* Background Image Overlay - Using a dark gradient + alpha color tint */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-alpha/40 z-10"></div>
            
            {/* Placeholder for actual background image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>

            <div className="relative z-20 h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white">
                <h2 className="text-lg md:text-xl uppercase tracking-[0.2em] mb-4 text-alpha font-bold">Welcome to our soccer club</h2>
                <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-tight mb-8 drop-shadow-lg">
                    Play with Passion,<br />
                    Win with <span className="text-alpha">Pride</span>
                </h1>
                
                <div className="flex flex-col md:flex-row gap-4 mt-8">
                    <button className="bg-alpha hover:bg-red-700 text-white px-8 py-3 uppercase font-bold tracking-wider transition-all skew-x-[-10deg]">
                        <span className="block skew-x-[10deg]">Read More</span>
                    </button>
                    <button className="bg-white hover:bg-gray-200 text-dark px-8 py-3 uppercase font-bold tracking-wider transition-all skew-x-[-10deg]">
                        <span className="block skew-x-[10deg]">Watch Match</span>
                    </button>
                </div>
            </div>
            
            {/* Next Match Overlay/Floater could go here if design demands, but keeping it simple for now */}
        </div>
    );
}

