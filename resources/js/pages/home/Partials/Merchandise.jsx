import React, { useState } from 'react';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Merchandise() {
    const products = [
        { name: "Maillot Domicile", price: "450 MAD", oldPrice: "600 MAD", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop" },
        { name: "Maillot Extérieur", price: "450 MAD", oldPrice: "600 MAD", image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000&auto=format&fit=crop" },
        { name: "Short Officiel", price: "200 MAD", oldPrice: "280 MAD", image: "https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?q=80&w=1000&auto=format&fit=crop" },
        { name: "Ballon Officiel", price: "180 MAD", oldPrice: "250 MAD", image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?q=80&w=1000&auto=format&fit=crop" },
        { name: "Écharpe Club", price: "120 MAD", oldPrice: "150 MAD", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop" },
        { name: "Casquette Officielle", price: "80 MAD", oldPrice: "100 MAD", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 4;

    const next = () => {
        setCurrentIndex((prev) => (prev + 1 > products.length - itemsPerView ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? products.length - itemsPerView : prev - 1));
    };

    return (
        <div className="py-16 sm:py-20 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
                     <div>
                        <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Fan Shop</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">Exclusive Merchandise</h2>
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
                        {products.map((product, idx) => (
                            <div key={idx} className="min-w-[calc(50%-8px)] sm:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-18px)] bg-white p-3 sm:p-4 group text-center hover:shadow-xl transition-all">
                                <div className="relative h-48 sm:h-56 lg:h-60 bg-gray-100 mb-3 sm:mb-4 overflow-hidden flex items-center justify-center">
                                    <img src={product.image} alt={product.name} className="h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:text-alpha shadow"><Heart className="w-4 h-4" /></button>
                                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:text-alpha shadow"><ShoppingBag className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <h3 className="font-bold uppercase text-base sm:text-lg mb-1">{product.name}</h3>
                                <div className="flex justify-center gap-2 items-center mb-3 sm:mb-4">
                                    <span className="text-gray-400 line-through text-xs">{product.oldPrice}</span>
                                    <span className="text-alpha font-bold text-sm sm:text-base">{product.price}</span>
                                </div>
                                <button className="w-full bg-dark text-white text-xs font-bold py-2 uppercase hover:bg-alpha transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    Ajouter au Panier
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

