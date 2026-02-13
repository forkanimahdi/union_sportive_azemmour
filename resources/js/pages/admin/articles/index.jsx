import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';

export default function AdminArticlesIndex({ articles }) {
    const [search, setSearch] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);

    const handleSearch = () => {
        router.get('/admin/articles', search ? { search } : {}, { preserveState: true });
    };

    const openDelete = (article) => {
        setArticleToDelete(article);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (articleToDelete) {
            router.delete('/admin/articles/' + articleToDelete.id, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setArticleToDelete(null);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Articles" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Articles</h1>
                        <p className="text-sm text-muted-foreground">Gérer les articles affichés dans les actualités.</p>
                    </div>
                    <Link href="/admin/articles/create">
                        <Button><Plus className="w-4 h-4 mr-2" />Nouvel article</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex gap-2 flex-wrap">
                            <Input placeholder="Rechercher par titre..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                            <Button variant="secondary" onClick={handleSearch}><Search className="w-4 h-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {articles.data.map((a) => (
                                <div key={a.id} className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-muted flex items-center justify-center">
                                        {a.image ? <img src={'/storage/' + a.image} alt="" className="h-full w-full object-cover" /> : <FileText className="h-8 w-8 text-muted-foreground" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold truncate">{a.title}</h3>
                                        <p className="text-xs text-muted-foreground">Par {a.user ? a.user.name : '–'} • {a.views} vues • {a.created_at ? new Date(a.created_at).toLocaleDateString('fr-FR') : ''}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Link href={'/admin/articles/' + a.id + '/edit'}><Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button></Link>
                                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(a)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {articles.data.length === 0 && <p className="text-center py-12 text-muted-foreground">Aucun article.</p>}
                        {(articles.prev_page_url || articles.next_page_url) && (
                            <div className="flex justify-center gap-2 mt-6">
                                {articles.prev_page_url && <Link href={articles.prev_page_url}><Button variant="outline">Précédent</Button></Link>}
                                {articles.next_page_url && <Link href={articles.next_page_url}><Button variant="outline">Suivant</Button></Link>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <DeleteModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} onConfirm={confirmDelete} title="Supprimer l'article" description={articleToDelete ? 'Êtes-vous sûr de vouloir supprimer « ' + articleToDelete.title + ' » ?' : ''} />
        </AdminLayout>
    );
}
