import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { ShoppingBag, Search } from 'lucide-react';

export default function Shop({ products = [], categories = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categoryList = [{ id: 'all', name: 'Tous' }, ...(categories || [])];

    const filteredProducts = (products || []).filter((product) => {
        const matchesCategory = selectedCategory === 'all' || product.category?.id === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="font-sans antialiased text-dark bg-white">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative h-64 sm:h-80 lg:h-96 bg-dark overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark/90 to-alpha/40 z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="relative z-20 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white">
                    <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-3 sm:mb-4 tracking-wider">Boutique</h4>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase italic leading-tight px-4">
                        Boutique <span className="text-alpha">Officielle</span>
                    </h1>
                </div>
            </div>

            {/* Shop Content */}
            <div className="py-16 sm:py-20 lg:py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-8 sm:mb-12 flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center justify-between">
                        <div className="flex flex-wrap gap-4">
                            {categoryList.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-6 py-3 uppercase font-bold text-sm transition-colors ${
                                        selectedCategory === category.id ? 'bg-alpha text-white' : 'bg-white text-dark hover:bg-gray-100'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-alpha w-full md:w-64"
                            />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/shop/${product.id}`}
                                className="bg-white p-4 group hover:shadow-xl transition-all block"
                            >
                                <div className="relative h-64 bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
                                    {product.image ? (
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="h-full w-full object-contain mix-blend-multiply transition-transform group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="text-gray-400 flex items-center justify-center">
                                            <ShoppingBag className="w-16 h-16" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold uppercase text-lg mb-1">{product.name}</h3>
                                {product.category?.name && (
                                    <p className="text-xs text-gray-500 uppercase mb-2">{product.category.name}</p>
                                )}
                                <div className="flex justify-center gap-2 items-center mb-4">
                                    {product.old_price != null && (
                                        <span className="text-gray-400 line-through text-xs">{Number(product.old_price)} MAD</span>
                                    )}
                                    <span className="text-alpha font-bold">{Number(product.new_price ?? product.old_price ?? 0)} MAD</span>
                                </div>
                                <span className="block w-full bg-dark text-white text-center text-xs font-bold py-2 uppercase hover:bg-alpha transition-colors">
                                    Voir le produit
                                </span>
                            </Link>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

