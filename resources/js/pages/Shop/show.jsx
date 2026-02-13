import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { ArrowLeft, Shirt, ImageOff, Palette, ShoppingCart, Tag } from 'lucide-react';

const VIEW_MODES = [
    { key: 'default', label: 'Avec logo', icon: Shirt },
    { key: 'without_logo', label: 'Sans logo', icon: ImageOff },
    { key: 'customized', label: 'Personnalisé', icon: Palette },
];

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
    const price = Number(product.new_price ?? product.old_price ?? 0);
    const hasDiscount = product.old_price != null && Number(product.old_price) > price;

    return (
        <div className="font-sans antialiased text-dark bg-gray-50 min-h-screen">
            <Navbar />

            <div className="pt-20 lg:pt-24 pb-12 lg:pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-alpha text-sm font-medium uppercase tracking-wider mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la boutique
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        {/* Image block */}
                        <div className="space-y-5">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="aspect-square max-h-[520px] flex items-center justify-center p-6 sm:p-8">
                                    {imgSrc ? (
                                        <img
                                            src={imgSrc}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-center">
                                            <Shirt className="w-20 h-20 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Aucune image</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {(hasWithoutLogo || hasCustomized) && (
                                <div className="flex flex-wrap gap-2">
                                    {VIEW_MODES.map((mode) => {
                                        const isDefault = mode.key === 'default';
                                        const isWithoutLogo = mode.key === 'without_logo';
                                        const isCustomized = mode.key === 'customized';
                                        const enabled =
                                            isDefault || (isWithoutLogo && hasWithoutLogo) || (isCustomized && hasCustomized);
                                        if (!enabled) return null;
                                        const Icon = mode.icon;
                                        return (
                                            <button
                                                key={mode.key}
                                                type="button"
                                                onClick={() => setViewMode(mode.key)}
                                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                                                    viewMode === mode.key
                                                        ? 'bg-alpha text-white shadow-md'
                                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-alpha/40 hover:text-alpha'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {mode.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="lg:pt-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
                                {product.category?.name && (
                                    <Link
                                        href={`/shop?category_id=${product.category.id}`}
                                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-alpha font-bold mb-3"
                                    >
                                        <Tag className="w-3.5 h-3.5" />
                                        {product.category.name}
                                    </Link>
                                )}
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic leading-tight text-dark mb-5">
                                    {product.name}
                                </h1>

                                <div className="flex flex-wrap items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
                                    {hasDiscount && (
                                        <span className="text-gray-400 line-through text-lg font-medium">
                                            {Number(product.old_price)} MAD
                                        </span>
                                    )}
                                    <span className="text-alpha font-black text-3xl sm:text-4xl">
                                        {price} MAD
                                    </span>
                                    {hasDiscount && (
                                        <span className="bg-alpha/10 text-alpha text-xs font-bold uppercase px-2 py-1 rounded">
                                            Promo
                                        </span>
                                    )}
                                </div>

                                {product.description && (
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 mb-8 prose-p:leading-relaxed prose-a:text-alpha hover:prose-a:underline"
                                        dangerouslySetInnerHTML={{
                                            __html: typeof product.description === 'string'
                                                ? product.description.replace(/\n/g, '<br />')
                                                : product.description,
                                        }}
                                    />
                                )}

                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-alpha text-white font-bold px-8 py-4 uppercase tracking-wider hover:bg-red-700 transition-colors rounded-xl shadow-md hover:shadow-lg"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Ajouter au panier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
