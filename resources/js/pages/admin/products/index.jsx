import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';
import InputError from '@/components/input-error';

export default function AdminProductsIndex({ products, categories }) {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const createForm = useForm({
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

    const handleSearch = () => {
        const params = {};
        if (search) params.search = search;
        if (categoryFilter !== 'all') params.category_id = categoryFilter;
        router.get('/admin/products', params, { preserveState: true });
    };

    const openDelete = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) router.delete(`/admin/products/${productToDelete.id}`, { onSuccess: () => setDeleteModalOpen(false) });
    };

    const openCreateModal = () => {
        createForm.reset();
        setPreviewImage(null);
        setPreviewNoLogo(null);
        setPreviewTshirt(null);
        setCreateModalOpen(true);
    };

    const handleCreateFile = (field, file) => {
        createForm.setData(field, file);
        if (field === 'image') setPreviewImage(file ? URL.createObjectURL(file) : null);
        if (field === 'image_without_logo') setPreviewNoLogo(file ? URL.createObjectURL(file) : null);
        if (field === 'image_customized_tshirt') setPreviewTshirt(file ? URL.createObjectURL(file) : null);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post('/admin/products', {
            forceFormData: true,
            onSuccess: () => {
                setCreateModalOpen(false);
                createForm.reset();
                setPreviewImage(null);
                setPreviewNoLogo(null);
                setPreviewTshirt(null);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Boutique - Produits" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Produits Boutique</h1>
                        <p className="text-sm text-muted-foreground">Gérer les produits affichés sur la page Boutique.</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau produit
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex gap-2 flex-1 min-w-[200px]">
                                <Input
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button variant="secondary" onClick={handleSearch}>
                                    <Search className="w-4 h-4" />
                                </Button>
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes</SelectItem>
                                    {(categories || []).map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch}>Filtrer</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.data.map((p) => (
                                <div key={p.id} className="border rounded-lg overflow-hidden bg-card">
                                    <div className="aspect-square bg-muted flex items-center justify-center p-4">
                                        {p.image ? (
                                            <img src={`/storage/${p.image}`} alt={p.name} className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <span className="text-muted-foreground text-sm">Sans image</span>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold truncate">{p.name}</h3>
                                        <p className="text-sm text-muted-foreground">{p.category?.name ?? '–'}</p>
                                        <div className="flex gap-2 mt-2">
                                            {p.old_price != null && <span className="text-xs line-through">{Number(p.old_price)} MAD</span>}
                                            <span className="font-bold text-primary">{Number(p.new_price ?? p.old_price ?? 0)} MAD</span>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <Link href={`/admin/products/${p.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(p)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {products.data.length === 0 && (
                            <p className="text-center py-12 text-muted-foreground">Aucun produit. Créez-en un pour l’afficher en boutique.</p>
                        )}
                        {products.prev_page_url || products.next_page_url ? (
                            <div className="flex justify-center gap-2 mt-6">
                                {products.prev_page_url && <Link href={products.prev_page_url}><Button variant="outline">Précédent</Button></Link>}
                                {products.next_page_url && <Link href={products.next_page_url}><Button variant="outline">Suivant</Button></Link>}
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Nouveau produit</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Nom *</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="Nom du produit"
                                required
                            />
                            <InputError message={createForm.errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-description">Description</Label>
                            <textarea
                                id="create-description"
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                placeholder="Description..."
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            <InputError message={createForm.errors.description} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Prix ancien (MAD)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={createForm.data.old_price}
                                    onChange={(e) => createForm.setData('old_price', e.target.value)}
                                    placeholder="0"
                                />
                                <InputError message={createForm.errors.old_price} />
                            </div>
                            <div className="space-y-2">
                                <Label>Prix actuel (MAD)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={createForm.data.new_price}
                                    onChange={(e) => createForm.setData('new_price', e.target.value)}
                                    placeholder="0"
                                />
                                <InputError message={createForm.errors.new_price} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Select
                                value={createForm.data.product_category_id || 'none'}
                                onValueChange={(v) => createForm.setData('product_category_id', v === 'none' ? '' : v)}
                            >
                                <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucune</SelectItem>
                                    {(categories || []).map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.product_category_id} />
                        </div>
                        <div className="space-y-3 border-t pt-4">
                            <Label className="text-sm">Images (optionnel)</Label>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs">Image principale</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="flex-1 text-sm"
                                        onChange={(e) => handleCreateFile('image', e.target.files?.[0] || null)}
                                    />
                                    {(createForm.data.image || previewImage) && (
                                        <div className="w-14 h-14 rounded border overflow-hidden bg-muted shrink-0">
                                            <img src={previewImage || (createForm.data.image && typeof createForm.data.image === 'string' ? `/storage/${createForm.data.image}` : null)} alt="" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                                <InputError message={createForm.errors.image} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs">Image sans logo</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="flex-1 text-sm"
                                        onChange={(e) => handleCreateFile('image_without_logo', e.target.files?.[0] || null)}
                                    />
                                    {(createForm.data.image_without_logo || previewNoLogo) && (
                                        <div className="w-14 h-14 rounded border overflow-hidden bg-muted shrink-0">
                                            <img src={previewNoLogo || null} alt="" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                                <InputError message={createForm.errors.image_without_logo} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs">Image T-shirt personnalisé</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="flex-1 text-sm"
                                        onChange={(e) => handleCreateFile('image_customized_tshirt', e.target.files?.[0] || null)}
                                    />
                                    {(createForm.data.image_customized_tshirt || previewTshirt) && (
                                        <div className="w-14 h-14 rounded border overflow-hidden bg-muted shrink-0">
                                            <img src={previewTshirt || null} alt="" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                                <InputError message={createForm.errors.image_customized_tshirt} />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Création…' : 'Créer le produit'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                title="Supprimer le produit"
                description={productToDelete ? `Êtes-vous sûr de vouloir supprimer « ${productToDelete.name } » ?` : ''}
            />
        </AdminLayout>
    );
}
