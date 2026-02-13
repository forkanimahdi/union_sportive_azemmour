import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import InputError from '@/components/input-error';

export default function AdminArticlesEdit({ article }) {
    const { data, setData, post, processing, errors } = useForm({
        title: article.title || '',
        body: article.body || '',
        image: null,
        _method: 'PUT',
    });

    const [preview, setPreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/articles/${article.id}`, {
            forceFormData: true,
            onSuccess: () => router.visit('/admin/articles'),
        });
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        } else {
            setData('image', null);
            setPreview(article.image ? `/storage/${article.image}` : null);
        }
    };

    const imgSrc = preview || (article.image ? `/storage/${article.image}` : null);

    return (
        <AdminLayout>
            <Head title={`Modifier: ${article.title}`} />
            <div className="space-y-6">
                <Link href="/admin/articles" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux articles
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Modifier l'article</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader><CardTitle>{article.title}</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Titre *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Titre de l'article"
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="body">Article *</Label>
                                <textarea
                                    id="body"
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    placeholder="Contenu..."
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    required
                                />
                                <InputError message={errors.body} />
                            </div>
                            <div className="space-y-2">
                                <Label>Image (laisser vide pour conserver)</Label>
                                <div className="flex items-center gap-4">
                                    <Input type="file" accept="image/*" className="flex-1" onChange={handleFile} />
                                    {imgSrc && (
                                        <div className="w-24 h-24 rounded border overflow-hidden bg-muted shrink-0">
                                            <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <InputError message={errors.image} />
                            </div>
                            <p className="text-xs text-muted-foreground">{article.views} vues • Créé par {article.user?.name}</p>
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing}>Enregistrer</Button>
                                <Button type="button" variant="outline" onClick={() => router.visit('/admin/articles')}>
                                    Annuler
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
