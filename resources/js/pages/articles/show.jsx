import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { User, Eye, Calendar, ArrowLeft, Newspaper } from 'lucide-react';

export default function ArticleShow({ article, recommended = [] }) {
    const formatDate = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="font-sans antialiased text-dark bg-gray-50 min-h-screen">
            <Navbar />

            {/* Hero banner: full-bleed image with title overlay */}
            <header className="relative w-full min-h-[50vh] lg:min-h-[60vh] flex flex-col justify-end pt-20 lg:pt-24">
                <div className="absolute inset-0">
                    {article.image ? (
                        <img
                            src={'/storage/' + article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-dark to-dark/90 flex items-center justify-center">
                            <Newspaper className="w-24 h-24 text-white/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/30" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-alpha text-sm font-medium uppercase tracking-wider mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux actualités
                    </Link>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic leading-[1.1] text-white drop-shadow-lg max-w-4xl">
                        {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-5 mt-5 text-white/90 text-sm">
                        <span className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-alpha/90 flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </span>
                            {article.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-alpha" />
                            {formatDate(article.created_at)}
                        </span>
                        <span className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-alpha" />
                            {article.views ?? 0} vues
                        </span>
                    </div>
                </div>
            </header>

            {/* Main content + sidebar */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
                    {/* Article body – 80% feel with max-width for readability */}
                    <article className="min-w-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 sm:p-8 lg:p-10">
                                <div
                                    className="article-body prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:text-dark prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-alpha prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
                                    dangerouslySetInnerHTML={{ __html: article.body || '' }}
                                />
                            </div>
                        </div>
                    </article>

                    {/* Sidebar – recommended articles */}
                    <aside className="lg:pt-2">
                        <div className="sticky top-24">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-1 w-12 bg-alpha rounded-full" />
                                <h2 className="text-sm font-bold uppercase tracking-wider text-dark">
                                    Articles recommandés
                                </h2>
                            </div>
                            {recommended.length === 0 ? (
                                <p className="text-sm text-gray-500">Aucun autre article pour le moment.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {recommended.map((rec) => (
                                        <li key={rec.id}>
                                            <Link
                                                href={`/articles/${rec.id}`}
                                                className="group flex gap-4 bg-white rounded-lg border border-gray-100 hover:border-alpha/40 hover:shadow-md transition-all duration-200 overflow-hidden"
                                            >
                                                <div className="w-24 min-w-[6rem] aspect-square overflow-hidden bg-gray-100">
                                                    {rec.image ? (
                                                        <img
                                                            src={'/storage/' + rec.image}
                                                            alt={rec.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <Newspaper className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 py-3 pr-3 flex flex-col justify-center">
                                                    <h3 className="text-sm font-bold uppercase italic leading-snug line-clamp-2 text-dark group-hover:text-alpha transition-colors">
                                                        {rec.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(rec.created_at)}
                                                    </p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </div>
    );
}
