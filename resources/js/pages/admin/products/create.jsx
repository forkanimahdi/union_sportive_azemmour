import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import InputError from '@/components/input-error';

export default function AdminProductsCreate({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        image: null,
        image_without_logo: null,
        image_customized_tshirt: null,
        old_price: '',
        new_price: '',
        product_category_id: '',
        is_active: true,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [previewNoLogo, setPreviewNoLogo] = useState(null);
    const [previewTshirt, setPreviewTshirt] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/products', {
            forceFormData: true,
            onSuccess: () => router.visit('/admin/products'),
        });
    };

    const handleFile = (field, file) => {
        setData(field, file);
        if (field === 'image') setPreviewImage(file ? URL.createObjectURL(file) : null);
        if (field === 'image_without_logo') setPreviewNoLogo(file ? URL.createObjectURL(file) : null);
        if (field === 'image_customized_tshirt') setPreviewTshirt(file ? URL.createObjectURL(file) : null);
    };

    return (
        <AdminLayout>
            <Head title="Nouveau produit" />
            <div className="space-y-6">
                <Link href="/admin/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux produits
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Nouveau produit</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader><CardTitle>Informations du produit</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom *</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nom du produit" required />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Description..." className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                <InputError message={errors.description} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Prix ancien (MAD)</Label>
                                    <Input type="number" step="0.01" min="0" value={data.old_price} onChange={(e) => setData('old_price', e.target.value)} placeholder="0" />
                                    <InputError message={errors.old_price} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Prix actuel (MAD)</Label>
                                    <Input type="number" step="0.01" min="0" value={data.new_price} onChange={(e) => setData('new_price', e.target.value)} placeholder="0" />
                                    <InputError message={errors.new_price} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select value={data.product_category_id || 'none'} onValueChange={(v) => setData('product_category_id', v === 'none' ? '' : v)}>
                                    <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Aucune</SelectItem>
                                        {(categories || []).map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.product_category_id} />
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <Label className="text-base">Images (optionnel)</Label>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Image principale</Label>
                                    <div className="flex items-center gap-4">
                                        <Input type="file" accept="image/*" className="flex-1" onChange={(e) => handleFile('image', e.target.files?.[0] || null)} />
                                        {(data.image || previewImage) && (
                                            <div className="w-20 h-20 rounded border overflow-hidden bg-muted">
                                                <img src={previewImage || (data.image && typeof data.image === 'string' ? `/storage/${data.image}` : null)} alt="" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.image} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Image sans logo</Label>
                                    <div className="flex items-center gap-4">
                                        <Input type="file" accept="image/*" className="flex-1" onChange={(e) => handleFile('image_without_logo', e.target.files?.[0] || null)} />
                                        {(data.image_without_logo || previewNoLogo) && (
                                            <div className="w-20 h-20 rounded border overflow-hidden bg-muted">
                                                <img src={previewNoLogo || (data.image_without_logo && typeof data.image_without_logo === 'string' ? `/storage/${data.image_without_logo}` : null)} alt="" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.image_without_logo} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Image T-shirt personnalisé</Label>
                                    <div className="flex items-center gap-4">
                                        <Input type="file" accept="image/*" className="flex-1" onChange={(e) => handleFile('image_customized_tshirt', e.target.files?.[0] || null)} />
                                        {(data.image_customized_tshirt || previewTshirt) && (
                                            <div className="w-20 h-20 rounded border overflow-hidden bg-muted">
                                                <img src={previewTshirt || (data.image_customized_tshirt && typeof data.image_customized_tshirt === 'string' ? `/storage/${data.image_customized_tshirt}` : null)} alt="" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.image_customized_tshirt} />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing}>Créer le produit</Button>
                                <Button type="button" variant="outline" onClick={() => router.visit('/admin/products')}>Annuler</Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
