import React, { useEffect, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package } from 'lucide-react';

function buildStocks(productList, sizeList) {
    const o = {};
    productList.forEach((p) => {
        o[p.id] = {};
        sizeList.forEach((s) => {
            o[p.id][s] = String(p.stock_by_size?.[s] ?? 0);
        });
    });
    return o;
}

export default function BoutiqueStock({ products = [], sizes = [], lowStockThreshold = 5 }) {
    const { flash } = usePage().props;

    const stocksSig = useMemo(
        () => products.map((p) => `${p.id}:${sizes.map((s) => p.stock_by_size?.[s] ?? 0).join(',')}`).join('|'),
        [products, sizes],
    );

    const { data, setData, post, processing, reset } = useForm({
        stocks: buildStocks(products, sizes),
    });

    useEffect(() => {
        reset({ stocks: buildStocks(products, sizes) });
        // stocksSig résume l’état serveur ; évite de resynchroniser à chaque render Inertia si les données sont identiques.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- products / sizes lus depuis la render où stocksSig change
    }, [stocksSig, reset]);

    const setStock = (productId, size, value) => {
        setData('stocks', {
            ...data.stocks,
            [productId]: {
                ...data.stocks[productId],
                [size]: value,
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/boutique-stock');
    };

    return (
        <AdminLayout>
            <Head title="Stocks boutique" />
            <div className="space-y-6">
                <Link href="/admin/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux produits
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Stocks boutique</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Vue rapide par produit et par taille. Seuil d’alerte « stock faible » : {lowStockThreshold} unités.
                            </p>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <p className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">{flash.success}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-semibold">Quantités par taille</CardTitle>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Enregistrement…' : 'Enregistrer tout'}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-sm min-w-[720px]">
                                <thead>
                                    <tr className="border-b bg-muted/50 text-left">
                                        <th className="p-3 font-medium w-[28%]">Produit</th>
                                        {sizes.map((s) => (
                                            <th key={s} className="p-2 font-medium text-center w-[10%]">{s}</th>
                                        ))}
                                        <th className="p-3 font-medium text-center w-[12%]">Alerte</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => {
                                        const low = p.stock_summary?.low_stock ?? [];
                                        const out = p.stock_summary?.out_of_stock;
                                        return (
                                            <tr key={p.id} className={`border-b ${out ? 'bg-red-50/50' : low.length ? 'bg-amber-50/40' : ''}`}>
                                                <td className="p-3 align-top">
                                                    <div className="font-medium">{p.name}</div>
                                                    <div className="text-xs text-muted-foreground">{p.category ?? '–'}{!p.is_active ? ' · masqué' : ''}</div>
                                                </td>
                                                {sizes.map((s) => (
                                                    <td key={s} className="p-2 align-top">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={999999}
                                                            className="h-9 text-center px-1"
                                                            value={data.stocks?.[p.id]?.[s] ?? '0'}
                                                            onChange={(e) => setStock(p.id, s, e.target.value)}
                                                        />
                                                    </td>
                                                ))}
                                                <td className="p-3 align-top text-center text-xs">
                                                    {out ? <span className="font-semibold text-red-700">Rupture</span> : low.length ? <span className="text-amber-800 font-medium">Faible</span> : '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {products.length === 0 && (
                                <p className="p-8 text-center text-muted-foreground">Aucun produit. Créez-en depuis la page Produits.</p>
                            )}
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
