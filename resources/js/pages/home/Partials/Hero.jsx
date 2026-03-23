import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
    const slides = [
        '/assets/images/others/p1.webp',
        '/assets/images/others/p2.webp',
        '/assets/images/others/p3.webp',
        '/assets/images/others/senior.jpeg',
        '/assets/images/others/u17.jpeg',
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="relative h-screen w-full bg-dark overflow-hidden">
            {/* Background Image Overlay - Using a dark gradient + alpha color tint */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-alpha/40 z-10"></div>
            
            {/* Hero carousel background */}
            <div className="absolute inset-0">
                {slides.map((src, index) => (
                    <div
                        key={src}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                            currentSlide === index ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ backgroundImage: `url('${src}')` }}
                    />
                ))}
            </div>

            <div className="relative z-20 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white">
                <h2 className="text-base sm:text-lg md:text-xl uppercase tracking-[0.2em] mb-4 sm:mb-6 text-alpha font-bold bg-white">Bienvenue dans notre club de football</h2>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase italic leading-tight mb-6 sm:mb-8 drop-shadow-lg px-4">
                    Jouez avec Passion,<br />
                    Gagnez avec <span className="text-alpha bg-white">Fierté</span>
                </h1>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-4 sm:px-0">
                    <button className="bg-alpha hover:bg-red-700 text-white px-6 sm:px-8 py-3 uppercase font-bold tracking-wider transition-all skew-x-[-10deg] text-sm sm:text-base">
                        <span className="block skew-x-[10deg]">En savoir plus</span>
                    </button>
                    {/* <button className="bg-white hover:bg-gray-200 text-dark px-6 sm:px-8 py-3 uppercase font-bold tracking-wider transition-all skew-x-[-10deg] text-sm sm:text-base">
                        <span className="block skew-x-[10deg]">Voir le match</span>
                    </button> */}
                </div>
            </div>

            {/* Carousel controls */}
            <button
                onClick={prevSlide}
                aria-label="Slide précédent"
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-alpha text-white flex items-center justify-center transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={nextSlide}
                aria-label="Slide suivant"
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-alpha text-white flex items-center justify-center transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Aller au slide ${index + 1}`}
                        className={`h-2.5 rounded-full transition-all ${
                            currentSlide === index ? 'w-7 bg-alpha' : 'w-2.5 bg-white/60 hover:bg-white'
                        }`}
                    />
                ))}
            </div>
            
            {/* Next Match Overlay/Floater could go here if design demands, but keeping it simple for now */}
        </div>
    );
}

