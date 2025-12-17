import React, { useState } from 'react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { ShoppingBag, Heart, Filter, Search } from 'lucide-react';

export default function Shop() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'all', name: 'Tous' },
        { id: 'jerseys', name: 'Maillots' },
        { id: 'accessories', name: 'Accessoires' },
        { id: 'equipment', name: 'Équipement' },
    ];

    const products = [
        { id: 1, name: "Maillot Domicile 2024-25", price: "450 MAD", oldPrice: "600 MAD", category: 'jerseys', image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop", featured: true },
        { id: 2, name: "Maillot Extérieur 2024-25", price: "450 MAD", oldPrice: "600 MAD", category: 'jerseys', image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000&auto=format&fit=crop", featured: true },
        { id: 3, name: "Short Officiel", price: "200 MAD", oldPrice: "280 MAD", category: 'equipment', image: "https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?q=80&w=1000&auto=format&fit=crop" },
        { id: 4, name: "Ballon Officiel", price: "180 MAD", oldPrice: "250 MAD", category: 'equipment', image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?q=80&w=1000&auto=format&fit=crop" },
        { id: 5, name: "Écharpe Club", price: "120 MAD", oldPrice: "150 MAD", category: 'accessories', image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop" },
        { id: 6, name: "Casquette Officielle", price: "80 MAD", oldPrice: "100 MAD", category: 'accessories', image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop" },
        { id: 7, name: "Sac de Sport", price: "350 MAD", oldPrice: "450 MAD", category: 'accessories', image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop" },
        { id: 8, name: "Gourde Officielle", price: "90 MAD", oldPrice: "120 MAD", category: 'accessories', image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop" },
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
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
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-6 py-3 uppercase font-bold text-sm transition-colors ${
                                        selectedCategory === category.id
                                            ? 'bg-alpha text-white'
                                            : 'bg-white text-dark hover:bg-gray-100'
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
                            <div key={product.id} className="bg-white p-4 group hover:shadow-xl transition-all">
                                <div className="relative h-64 bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" 
                                    />
                                    {product.featured && (
                                        <div className="absolute top-4 left-4 bg-alpha text-white text-xs font-bold px-3 py-1 uppercase">
                                            Nouveau
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:text-alpha shadow">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:text-alpha shadow">
                                            <ShoppingBag className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold uppercase text-lg mb-1">{product.name}</h3>
                                <div className="flex justify-center gap-2 items-center mb-4">
                                    <span className="text-gray-400 line-through text-xs">{product.oldPrice}</span>
                                    <span className="text-alpha font-bold">{product.price}</span>
                                </div>
                                <button className="w-full bg-dark text-white text-xs font-bold py-2 uppercase hover:bg-alpha transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    Ajouter au Panier
                                </button>
                            </div>
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

