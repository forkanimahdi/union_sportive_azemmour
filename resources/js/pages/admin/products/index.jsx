import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';

export default function AdminProductsIndex({ products, categories }) {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

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

    return (
        <AdminLayout>
            <Head title="Boutique - Produits" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Produits Boutique</h1>
                        <p className="text-sm text-muted-foreground">Gérer les produits affichés sur la page Boutique.</p>
                    </div>
                    <Link href="/admin/products/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau produit
                        </Button>
                    </Link>
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
