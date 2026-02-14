import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { Target, Globe, BookOpen, TrendingUp, MapPin, ChevronRight } from 'lucide-react';

export default function Partners({ sponsors = [] }) {
    const list = Array.isArray(sponsors) ? sponsors : [];

    const benefits = [
        { icon: Target, title: 'Associer votre image à des valeurs fortes', desc: "Le club incarne la passion, l'excellence, le respect, l'unité et l'ambition. Votre marque bénéficie d'une association positive et responsable." },
        { icon: Globe, title: 'Soutenir le développement du sport féminin', desc: 'Le football féminin est en pleine croissance. En devenant sponsor, vous contribuez activement à son développement local et régional.' },
        { icon: BookOpen, title: 'Participer à un projet éducatif et social', desc: "Au-delà du terrain, le club développe des actions d'accompagnement scolaire et de développement personnel des joueuses." },
        { icon: TrendingUp, title: 'Bénéficier d\'une visibilité stratégique', items: ['Présence sur les maillots', 'Visibilité sur les supports de communication', 'Mise en avant sur les réseaux sociaux', 'Présence lors des événements et compétitions'] },
        { icon: MapPin, title: 'Renforcer votre ancrage territorial', desc: "Soutenir l'Union Sportif d'Azemmour, c'est investir dans la jeunesse locale et affirmer votre engagement envers la communauté." },
    ];

    const contributions = [
        'À la structuration du club',
        "À l'amélioration des conditions d'entraînement",
        "À l'accompagnement scolaire et éducatif des joueuses",
        'Au développement durable du football féminin à Azemmour',
    ];

    return (
        <div className="font-sans antialiased bg-white">
            <Navbar />

            {/* Hero */}
            <header className="relative min-h-[55vh] overflow-hidden pt-24 lg:pt-28">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/assets/images/banner/banner-1.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent" />
                <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 max-w-7xl">
                    <span className="inline-block text-alpha font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-4">Partenaires</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic leading-tight text-white max-w-4xl">
                        Partenaires & Sponsors
                    </h1>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </header>

            <main className="relative -mt-8 z-10">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl space-y-16 sm:space-y-24 pb-24">
                    {/* Intro - Bento grid */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        <div className="lg:col-span-8 p-8 sm:p-10 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
                            <span className="text-alpha font-bold text-xs uppercase tracking-wider">Union Sportif d&apos;Azemmour</span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-6 text-dark">Des partenariats solides</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Le développement du projet sportif et éducatif repose sur des partenariats fondés sur la confiance, l&apos;engagement et une vision commune en faveur du sport féminin.
                            </p>
                            <p className="text-gray-600 font-semibold mb-4">Nos partenaires contribuent activement :</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {contributions.map((c, i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <ChevronRight className="w-5 h-5 text-alpha shrink-0" />
                                        <span className="text-gray-700 text-sm">{c}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-dark font-semibold mt-6">Nous leur adressons nos sincères remerciements.</p>
                        </div>
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            <div className="flex-1 rounded-2xl bg-alpha/10 border-2 border-alpha/20 p-6 flex flex-col justify-center">
                                <span className="text-4xl font-black text-alpha">🤝</span>
                                <p className="text-dark font-bold mt-3">Ensemble pour le football féminin</p>
                            </div>
                        </div>
                    </section>

                    {/* Sponsors logos - Grid showcase */}
                    {list.length > 0 && (
                        <section className="bg-gray-50 rounded-3xl p-8 sm:p-12">
                            <div className="text-center mb-10">
                                <span className="text-alpha font-bold text-xs uppercase tracking-wider">Nos Partenaires</span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 text-dark">Ils nous soutiennent</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {list.map((s) => (
                                    <a
                                        key={s.id}
                                        href={s.url || '#'}
                                        target={s.url ? '_blank' : undefined}
                                        rel={s.url ? 'noopener noreferrer' : undefined}
                                        className="group flex items-center justify-center h-28 p-4 rounded-xl bg-white border border-gray-100 hover:border-alpha/40 hover:shadow-lg transition-all grayscale hover:grayscale-0"
                                    >
                                        {s.logo ? (
                                            <img src={'/storage/' + s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                                        ) : (
                                            <span className="text-center font-bold text-gray-500 text-sm group-hover:text-alpha transition-colors">{s.name}</span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Pourquoi devenir sponsor - Bento cards */}
                    <section>
                        <div className="text-center mb-12">
                            <span className="text-alpha font-bold text-xs uppercase tracking-wider">Pourquoi sponsoriser ?</span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 text-dark">5 bonnes raisons</h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                S&apos;associer à l&apos;Union Sportif d&apos;Azemmour – Football Féminin, c&apos;est investir dans un projet structuré, ambitieux et porteur de sens.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {benefits.map((b, i) => {
                                const Icon = b.icon;
                                return (
                                    <div
                                        key={i}
                                        className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-alpha/30 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-alpha/10 flex items-center justify-center mb-6 group-hover:bg-alpha/20 transition-colors">
                                            <Icon className="w-7 h-7 text-alpha" />
                                        </div>
                                        <span className="text-alpha font-bold text-xs uppercase tracking-wider">{i + 1}</span>
                                        <h3 className="font-bold text-lg text-dark mt-1 mb-3">{b.title}</h3>
                                        {b.desc && <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>}
                                        {b.items && (
                                            <ul className="space-y-2 mt-3 text-gray-600 text-sm">
                                                {b.items.map((item, j) => (
                                                    <li key={j} className="flex gap-2">
                                                        <ChevronRight className="w-4 h-4 text-alpha shrink-0 mt-0.5" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* CTA - Devenir partenaire */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark to-dark/95 text-white p-8 sm:p-12 lg:p-16">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/assets/images/banner/banner-1.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className="relative z-10 max-w-2xl mx-auto text-center">
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4">Devenir partenaire</h2>
                            <p className="text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto">
                                Nous construisons des partenariats personnalisés et durables, adaptés aux objectifs de chaque entreprise.
                            </p>
                            <p className="text-gray-400 text-sm mb-8">
                                Pour toute demande d&apos;information ou de collaboration, contactez-nous.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 bg-alpha hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-colors"
                            >
                                Nous contacter <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
