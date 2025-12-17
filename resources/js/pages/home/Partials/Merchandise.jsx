import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';

export default function Merchandise() {
    const products = [
        { name: "Red T-Shirt", price: "$80.00", oldPrice: "$120.00", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop" },
        { name: "Red Shorts", price: "$40.00", oldPrice: "$60.00", image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000&auto=format&fit=crop" },
        { name: "Legs Wearing", price: "$20.00", oldPrice: "$30.00", image: "https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?q=80&w=1000&auto=format&fit=crop" }, // Placeholder for socks
        { name: "Football Ball", price: "$50.00", oldPrice: "$70.00", image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?q=80&w=1000&auto=format&fit=crop" },
    ];

    return (
        <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                     <div>
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Fan Shop</h4>
                        <h2 className="text-3xl font-black uppercase italic">Exclusive Merchandise</h2>
                    </div>
                     <div className="flex gap-2">
                        <button className="w-10 h-10 bg-gray-200 hover:bg-alpha hover:text-white flex items-center justify-center transition-colors">&lt;</button>
                        <button className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors">&gt;</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {products.map((product, idx) => (
                        <div key={idx} className="bg-white p-4 group text-center hover:shadow-xl transition-all">
                            <div className="relative h-60 bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
                                <img src={product.image} alt={product.name} className="h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:text-alpha shadow"><Heart className="w-4 h-4" /></button>
                                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:text-alpha shadow"><ShoppingBag className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <h3 className="font-bold uppercase text-lg mb-1">{product.name}</h3>
                            <div className="flex justify-center gap-2 items-center">
                                <span className="text-gray-400 line-through text-xs">{product.oldPrice}</span>
                                <span className="text-alpha font-bold">{product.price}</span>
                            </div>
                            <button className="mt-4 w-full bg-dark text-white text-xs font-bold py-2 uppercase hover:bg-alpha transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

