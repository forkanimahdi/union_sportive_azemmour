import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { Target, Globe, BookOpen, TrendingUp, MapPin } from 'lucide-react';

export default function Partners({ sponsors = [] }) {
    const list = Array.isArray(sponsors) ? sponsors : [];

    const benefits = [
        { icon: Target, title: 'Associer votre image à des valeurs fortes', desc: "Le club incarne la passion, l'excellence, le respect, l'unité et l'ambition. Votre marque bénéficie d'une association positive et responsable." },
        { icon: Globe, title: 'Soutenir le développement du sport féminin', desc: 'Le football féminin est en pleine croissance. En devenant sponsor, vous contribuez activement à son développement local et régional.' },
        { icon: BookOpen, title: 'Participer à un projet éducatif et social', desc: "Au-delà du terrain, le club développe des actions d'accompagnement scolaire et de développement personnel des joueuses." },
        { icon: TrendingUp, title: 'Bénéficier d\'une visibilité stratégique', items: ['Présence sur les maillots', 'Visibilité sur les supports de communication', 'Mise en avant sur les réseaux sociaux', 'Présence lors des événements et compétitions'] },
        { icon: MapPin, title: 'Renforcer votre ancrage territorial', desc: "Soutenir l'Union Sportif d'Azemmour, c'est investir dans la jeunesse locale et affirmer votre engagement envers la communauté." },
    ];

    return (
        <div className="font-sans antialiased bg-white">
            <Navbar />

            {/* Hero */}
            <div className="relative min-h-[50vh] bg-alpha overflow-hidden pt-24 lg:pt-28">
                <div className="absolute inset-0 bg-alpha/90" />
                <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 max-w-7xl">
                    <h4 className="text-white/90 font-bold text-xs sm:text-sm uppercase mb-3 tracking-wider">Partenaires & Sponsors</h4>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic leading-tight text-white px-0">
                        Partenaires & Sponsors
                    </h1>
                </div>
            </div>

            <div className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12l">
                    {/* Intro */}
                    <section className="mb-16 p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-6 text-white">Union Sportif d&apos;Azemmour – Football Féminin</h2>
                        <p className="text-white/95 leading-relaxed mb-4">
                            Le développement du projet sportif et éducatif de l&apos;Union Sportif d&apos;Azemmour – Football Féminin repose sur des partenariats solides, fondés sur la confiance, l&apos;engagement et une vision commune en faveur du sport féminin.
                        </p>
                        <p className="text-white/95 leading-relaxed mb-4">Nos partenaires contribuent activement :</p>
                        <ul className="list-disc list-inside space-y-2 text-white/95 mb-4">
                            <li>À la structuration du club</li>
                            <li>À l&apos;amélioration des conditions d&apos;entraînement</li>
                            <li>À l&apos;accompagnement scolaire et éducatif des joueuses</li>
                            <li>Au développement durable du football féminin à Azemmour</li>
                        </ul>
                        <p className="text-white font-semibold">Nous leur adressons nos sincères remerciements.</p>
                    </section>

                    {/* Sponsors logos */}
                    {list.length > 0 && (
                        <section className="mb-16 p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                            <h2 className="text-xl sm:text-2xl font-black uppercase italic mb-8 text-white">Nos Partenaires</h2>
                            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 items-center">
                                {list.map((s) => (
                                    <a
                                        key={s.id}
                                        href={s.url || '#'}
                                        target={s.url ? '_blank' : undefined}
                                        rel={s.url ? 'noopener noreferrer' : undefined}
                                        className="w-32 sm:w-40 h-20 flex items-center justify-center opacity-90 hover:opacity-100 transition-all bg-white/10 rounded-xl p-4"
                                    >
                                        {s.logo ? (
                                            <img src={'/storage/' + s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                                        ) : (
                                            <span className="text-center font-bold text-white text-sm">{s.name}</span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Pourquoi devenir sponsor */}
                    <section className="mb-16">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-8 p-6 bg-alpha text-white rounded-t-2xl">Pourquoi devenir sponsor ?</h2>
                        <p className="text-white/95 leading-relaxed mb-8 p-6 bg-alpha/95 text-white -mt-2 rounded-b-2xl">
                            S&apos;associer à l&apos;Union Sportif d&apos;Azemmour – Football Féminin, c&apos;est investir dans un projet structuré, ambitieux et porteur de sens.
                        </p>
                        <div className="space-y-6">
                            {benefits.map((b, i) => {
                                const Icon = b.icon;
                                return (
                                    <div key={i} className="flex gap-6 p-8 bg-alpha text-white rounded-2xl">
                                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white mb-2">{i + 1}. {b.title}</h3>
                                            {b.desc && <p className="text-white/95 leading-relaxed">{b.desc}</p>}
                                            {b.items && (
                                                <ul className="list-disc list-inside space-y-1 text-white/95 mt-2">
                                                    {b.items.map((item, j) => (
                                                        <li key={j}>{item}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Devenir partenaire CTA */}
                    <section className="p-8 sm:p-12 bg-alpha text-white rounded-2xl text-center border-2 border-white/20">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4 text-white">Devenir partenaire</h2>
                        <p className="text-white/95 leading-relaxed mb-6 max-w-2xl mx-auto">
                            Nous construisons des partenariats personnalisés et durables, adaptés aux objectifs de chaque entreprise.
                        </p>
                        <p className="text-white/95 mb-8">
                            Pour toute demande d&apos;information ou de collaboration, merci de nous contacter via la page Contact.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block bg-white text-alpha font-bold px-8 py-4 uppercase tracking-wider transition-colors rounded-xl hover:bg-white/90"
                        >
                            Nous contacter
                        </Link>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}
