import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { ArrowLeft, Shirt, ImageOff, Palette, ShoppingCart, Tag, ChevronRight, Truck, Shield, RotateCcw, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const VIEW_MODES = [
    { key: 'default', label: 'Avec logo', icon: Shirt },
    { key: 'without_logo', label: 'Sans logo', icon: ImageOff },
    { key: 'customized', label: 'Personnalisé', icon: Palette },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ShopShow({ product }) {
    const { flash } = usePage().props;
    const [viewMode, setViewMode] = useState('default');
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [size, setSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (flash?.orderSuccess) setConfirmationOpen(true);
    }, [flash?.orderSuccess]);

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

    const trustItems = [
        { icon: Truck, label: 'Livraison sécurisée' },
        { icon: Shield, label: 'Paiement sécurisé' },
        { icon: RotateCcw, label: 'Échanges possibles' },
    ];

    const resetOrderForm = () => {
        setCustomerName('');
        setEmail('');
        setPhone('');
        setSize('M');
        setQuantity(1);
        setNotes('');
        setErrors({});
    };

    const handleOrderSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        router.post(`/shop/${product.id}/order`, {
            customer_name: customerName || null,
            email,
            phone,
            size,
            quantity,
            notes: notes || null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setOrderModalOpen(false);
                setConfirmationOpen(true);
                resetOrderForm();
            },
            onError: (err) => setErrors(err),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="font-sans antialiased text-dark bg-white min-h-screen">
            <Navbar />

            {/* Hero banner - same as shop index */}
            <header className="relative h-56 sm:h-64 lg:h-72 bg-dark overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark/90 to-alpha/40 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/assets/images/banner/banner-1.png')" }}
                />
                <div className="relative z-20 h-full container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl flex flex-col justify-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium uppercase tracking-wider mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Boutique
                    </Link>
                    <span className="text-alpha font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-2">Produit</span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic leading-tight text-white max-w-3xl">
                        {product.name}
                    </h1>
                </div>
            </header>

            {/* Main product section */}
            <div className="pt-8 sm:pt-12 pb-16 lg:pb-24">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left: Image + view modes */}
                        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
                            <div className="relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xl shadow-gray-200/40">
                                <div className="aspect-square flex items-center justify-center p-8 sm:p-12 lg:p-16">
                                    {imgSrc ? (
                                        <img
                                            src={imgSrc}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Shirt className="w-28 h-28 mx-auto mb-4 opacity-50" />
                                            <p className="text-sm font-medium">Aucune image</p>
                                        </div>
                                    )}
                                </div>
                                {hasDiscount && (
                                    <div className="absolute top-4 left-4 bg-alpha text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg shadow-lg">
                                        Promo
                                    </div>
                                )}
                            </div>

                            {(hasWithoutLogo || hasCustomized) && (
                                <div className="flex flex-wrap gap-3">
                                    {VIEW_MODES.map((mode) => {
                                        const isDefault = mode.key === 'default';
                                        const isWithoutLogo = mode.key === 'without_logo';
                                        const isCustomized = mode.key === 'customized';
                                        const enabled =
                                            isDefault || (isWithoutLogo && hasWithoutLogo) || (isCustomized && hasCustomized);
                                        if (!enabled) return null;
                                        const Icon = mode.icon;
                                        const active = viewMode === mode.key;
                                        return (
                                            <button
                                                key={mode.key}
                                                type="button"
                                                onClick={() => setViewMode(mode.key)}
                                                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                                                    active
                                                        ? 'bg-alpha text-white shadow-lg shadow-alpha/30'
                                                        : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-alpha/50 hover:text-alpha'
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

                        {/* Right: Details */}
                        <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-24 lg:self-start space-y-6">
                            {product.category?.name && (
                                <Link
                                    href={`/shop?category_id=${product.category.id}`}
                                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-alpha font-bold hover:text-red-700 transition-colors"
                                >
                                    <Tag className="w-3.5 h-3.5" />
                                    {product.category.name}
                                </Link>
                            )}

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.5rem] font-black uppercase italic leading-tight text-dark">
                                {product.name}
                            </h2>

                            <div className="flex flex-wrap items-baseline gap-4 p-6 rounded-2xl bg-gray-50 border-2 border-gray-100">
                                {hasDiscount && (
                                    <span className="text-gray-400 line-through text-lg font-semibold">
                                        {Number(product.old_price)} MAD
                                    </span>
                                )}
                                <span className="text-alpha font-black text-3xl sm:text-4xl">
                                    {price} MAD
                                </span>
                                {hasDiscount && (
                                    <span className="bg-alpha/15 text-alpha text-xs font-black uppercase px-3 py-1.5 rounded-lg">
                                        −{Math.round((1 - price / Number(product.old_price)) * 100)}%
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    type="button"
                                    onClick={() => { setErrors({}); setOrderModalOpen(true); }}
                                    className="inline-flex items-center justify-center gap-3 bg-alpha hover:bg-red-700 text-white font-bold px-8 py-4 uppercase tracking-wider rounded-xl shadow-lg"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Commander
                                </Button>
                                <Link href="/shop">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full sm:w-auto border-2 border-dark text-dark font-bold px-8 py-4 uppercase tracking-wider rounded-xl hover:bg-dark hover:text-white"
                                    >
                                        Continuer mes achats
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                {trustItems.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="flex flex-col items-center text-center gap-2">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">{item.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Description - store-style block */}
                    {product.description && (
                        <section className="mt-16 lg:mt-24">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 sm:p-10">
                                <h2 className="text-lg font-black uppercase italic text-dark mb-6">Description</h2>
                                <div
                                    className="prose prose-lg max-w-none text-gray-600 prose-p:leading-relaxed prose-headings:text-dark prose-headings:font-bold prose-a:text-alpha hover:prose-a:underline"
                                    dangerouslySetInnerHTML={{
                                        __html: typeof product.description === 'string'
                                            ? product.description.replace(/\n/g, '<br />')
                                            : product.description,
                                    }}
                                />
                            </div>
                        </section>
                    )}

                    <div className="mt-16 lg:mt-20 pt-12 border-t border-gray-100">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-alpha font-bold text-sm uppercase tracking-wider transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour à la boutique
                        </Link>
                    </div>
                </div>
            </div>

            {/* Order modal */}
            <Dialog open={orderModalOpen} onOpenChange={(open) => { setOrderModalOpen(open); if (!open) resetOrderForm(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase italic">Passer commande</DialogTitle>
                        <p className="text-sm text-gray-500 mt-1">{product.name}</p>
                    </DialogHeader>
                    <form onSubmit={handleOrderSubmit} className="space-y-4 mt-4">
                        <div>
                            <Label htmlFor="order_name">Nom (optionnel)</Label>
                            <Input
                                id="order_name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Votre nom"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="order_email">Email *</Label>
                            <Input
                                id="order_email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@exemple.com"
                                className="mt-1"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div>
                            <Label htmlFor="order_phone">Téléphone *</Label>
                            <Input
                                id="order_phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="06 00 00 00 00"
                                className="mt-1"
                            />
                            <InputError message={errors.phone} />
                        </div>
                        <div>
                            <Label>Taille *</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {SIZES.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSize(s)}
                                        className={`w-12 h-12 rounded-xl font-bold text-sm border-2 transition-all ${
                                            size === s ? 'bg-alpha text-white border-alpha' : 'border-gray-200 hover:border-alpha/50 text-dark'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.size} />
                        </div>
                        <div>
                            <Label htmlFor="order_quantity">Quantité</Label>
                            <Input
                                id="order_quantity"
                                type="number"
                                min={1}
                                max={10}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                                className="mt-1 w-24"
                            />
                            <InputError message={errors.quantity} />
                        </div>
                        <div>
                            <Label htmlFor="order_notes">Notes (optionnel)</Label>
                            <textarea
                                id="order_notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Remarques pour la commande..."
                                rows={3}
                                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOrderModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={submitting} className="bg-alpha hover:bg-red-700">
                                {submitting ? 'Envoi...' : 'Confirmer la commande'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirmation modal */}
            <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
                <DialogContent className="sm:max-w-sm text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase italic">Commande enregistrée</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 text-sm mt-2">
                        Votre commande a bien été prise en compte. Vous serez contacté pour finaliser la livraison et le paiement.
                    </p>
                    <DialogFooter className="sm:justify-center pt-4">
                        <Button onClick={() => setConfirmationOpen(false)} className="bg-alpha hover:bg-red-700">
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}
