import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Merchandise({ products = [] }) {
    const list = Array.isArray(products) ? products : [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = Math.min(4, list.length);
    const maxIndex = Math.max(0, list.length - itemsPerView);

    const next = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    };

    if (list.length === 0) return null;

    return (
        <div className="py-16 sm:py-20 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
                    <div>
                        <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Fan Shop</h4>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">Exclusive Merchandise</h2>
                    </div>
                    {list.length > itemsPerView && (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={prev}
                                className="w-10 h-10 bg-gray-200 hover:bg-alpha hover:text-white flex items-center justify-center transition-colors"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6 lg:gap-8"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                    >
                        {list.map((product) => {
                            const price = Number(product.new_price ?? product.old_price ?? 0);
                            const hasDiscount = product.old_price != null && Number(product.old_price) > price;
                            const imageSrc = product.image ? `/storage/${product.image}` : null;
                            return (
                                <Link
                                    key={product.id}
                                    href={`/shop/${product.id}`}
                                    className="min-w-[calc(50%-8px)] sm:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-18px)] bg-white p-3 sm:p-4 group text-center hover:shadow-xl transition-all block"
                                >
                                    <div className="relative h-48 sm:h-56 lg:h-60 bg-gray-100 mb-3 sm:mb-4 overflow-hidden flex items-center justify-center">
                                        {imageSrc ? (
                                            <img src={imageSrc} alt={product.name} className="h-full w-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                                        ) : (
                                            <ShoppingBag className="w-16 h-16 text-gray-400" />
                                        )}
                                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:text-alpha shadow cursor-default"><Heart className="w-4 h-4" /></span>
                                            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:text-alpha shadow cursor-default"><ShoppingBag className="w-4 h-4" /></span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold uppercase text-base sm:text-lg mb-1">{product.name}</h3>
                                    <div className="flex justify-center gap-2 items-center mb-3 sm:mb-4">
                                        {hasDiscount && <span className="text-gray-400 line-through text-xs">{Number(product.old_price)} MAD</span>}
                                        <span className="text-alpha font-bold text-sm sm:text-base">{price} MAD</span>
                                    </div>
                                    <span className="block w-full bg-dark text-white text-xs font-bold py-2 uppercase group-hover:bg-alpha transition-colors">
                                        Voir le produit
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

