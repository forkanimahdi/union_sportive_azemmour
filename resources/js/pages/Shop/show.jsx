import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { ArrowLeft, Shirt, ImageOff, Palette } from 'lucide-react';

const VIEW_MODES = {
    default: { key: 'default', label: 'Avec logo', icon: Shirt },
    without_logo: { key: 'without_logo', label: 'Sans logo', icon: ImageOff },
    customized: { key: 'customized', label: 'T-shirt personnalisé', icon: Palette },
};

export default function ShopShow({ product }) {
    const [viewMode, setViewMode] = useState('default');

    const hasWithoutLogo = !!product.image_without_logo;
    const hasCustomized = !!product.image_customized_tshirt;

    const currentImage = () => {
        if (viewMode === 'without_logo' && product.image_without_logo) {
            return `/storage/${product.image_without_logo}`;
        }
        if (viewMode === 'customized' && product.image_customized_tshirt) {
            return `/storage/${product.image_customized_tshirt}`;
        }
        return product.image ? `/storage/${product.image}` : null;
    };

    const imgSrc = currentImage();

    return (
        <div className="font-sans antialiased text-dark bg-white min-h-screen">
            <Navbar />

            <div className="py-8 sm:py-12 lg:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/shop"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-alpha mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à la boutique
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image + view mode selector */}
                        <div className="space-y-4">
                            <div className="aspect-square max-h-[500px] mx-auto bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
                                {imgSrc ? (
                                    <img
                                        src={imgSrc}
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-gray-400 text-center">
                                        <p>Aucune image</p>
                                    </div>
                                )}
                            </div>

                            {(hasWithoutLogo || hasCustomized) && (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('default')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            viewMode === 'default' ? 'bg-alpha text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        <Shirt className="w-4 h-4" />
                                        Avec logo
                                    </button>
                                    {hasWithoutLogo && (
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('without_logo')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                viewMode === 'without_logo' ? 'bg-alpha text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            <ImageOff className="w-4 h-4" />
                                            Sans logo
                                        </button>
                                    )}
                                    {hasCustomized && (
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('customized')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                viewMode === 'customized' ? 'bg-alpha text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            <Palette className="w-4 h-4" />
                                            T-shirt personnalisé
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            {product.category?.name && (
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">{product.category.name}</p>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-black uppercase italic mb-4">{product.name}</h1>
                            <div className="flex items-center gap-3 mb-6">
                                {product.old_price != null && (
                                    <span className="text-gray-400 line-through text-lg">{Number(product.old_price)} MAD</span>
                                )}
                                <span className="text-alpha font-bold text-2xl">{Number(product.new_price ?? product.old_price ?? 0)} MAD</span>
                            </div>
                            {product.description && (
                                <div className="prose prose-sm max-w-none text-gray-700 mb-8">
                                    <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                                </div>
                            )}
                            <button
                                type="button"
                                className="w-full sm:w-auto bg-alpha text-white font-bold px-8 py-3 uppercase hover:bg-red-700 transition-colors"
                            >
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
