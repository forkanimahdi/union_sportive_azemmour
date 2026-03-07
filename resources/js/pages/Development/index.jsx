import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { BookOpen, Heart, Shield, Users, Check, ChevronRight } from 'lucide-react';

const PROGRAMS = [
    {
        icon: BookOpen,
        title: 'Suivi & Soutien Scolaire',
        description: "Nous accompagnons individuellement chaque joueuse dans son parcours scolaire avec un soutien adapté, aide aux examens, orientation et suivi des résultats. Parce que la réussite scolaire est indissociable de l'épanouissement sportif.",
    },
    {
        icon: Heart,
        title: 'Compétences de Vie & Autonomisation',
        description: "Des ateliers conçus pour développer leadership, communication, gestion des émotions et esprit d'équipe. Nous formons des femmes capables de faire face aux défis de la vie, pas seulement de bonnes joueuses.",
    },
    {
        icon: Shield,
        title: 'Protection & Espaces Sûrs',
        description: "Une politique de safeguarding structurée avec protocoles clairs pour garantir un environnement sûr, respectueux et protecteur. La protection de chaque individu est notre priorité absolue.",
    },
    {
        icon: Users,
        title: 'Engagement Communautaire',
        description: "Actions sociales concrètes ancrées dans le territoire d'Azemmour. Nous renforçons les liens sociaux et changeons le regard sur la place des femmes dans le sport.",
    },
];

const PRINCIPLES = [
    {
        title: 'Respect des Personnes',
        description: "Chaque joueuse, bénévole et partenaire est traité avec dignité. Nous assurons que tous/toutes soient écoutés, considérés et traités de manière équitable, sans discrimination.",
    },
    {
        title: 'Développement Positif',
        description: "Les joueuses sont au centre de notre action. Nous leur donnons les moyens de se développer par elles-mêmes, en s'appuyant sur leurs forces et leur potentiel.",
    },
    {
        title: 'Ne Pas Nuire',
        description: "Nous évaluons et anticipons l'impact de nos actions pour nous assurer qu'elles ne créent pas de préjudice direct ou indirect pour les personnes et la communauté.",
    },
];

export default function DevelopmentIndex() {
    return (
        <div className="font-sans antialiased bg-white text-dark">
            <Head title="Sport for Development — USA Azemmour" />

            <Navbar />

            {/* Hero */}
            <header className="relative min-h-[50vh] overflow-hidden pt-24 lg:pt-28">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/assets/images/banner/banner-1.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-alpha/80 to-alpha/40" />
                <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 max-w-7xl text-center">
                    <span className="inline-block text-white/90 font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-4">
                        Commission S4D
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic leading-tight text-white max-w-4xl mx-auto mb-6">
                        Le Football comme Moteur de Développement
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10">
                        Transformer des vies par le sport, l&apos;éducation et l&apos;empowerment
                    </p>
                    <Link
                        href="#rejoindre"
                        className="inline-flex items-center gap-2 bg-white text-alpha font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Nous Rejoindre <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </header>

            <main className="relative -mt-8 z-10">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl space-y-16 sm:space-y-24 pb-24">
                    {/* Mission */}
                    <section className="p-8 sm:p-10 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 border-l-4 border-alpha">
                        <span className="text-alpha font-bold text-xs uppercase tracking-wider">Notre Mission</span>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-6 text-dark">
                            Sport for Development
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg max-w-4xl">
                            La Commission <strong className="text-alpha">Sport for Development (S4D)</strong> de l&apos;Union Sportive Azemmour a pour mission de faire du football un levier de développement humain et social pour les joueuses et leur communauté.
                        </p>
                    </section>

                    {/* Four Programs */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-alpha" />
                            <span className="text-alpha font-bold text-xs uppercase tracking-widest">Nos Programmes</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic text-dark mb-12">
                            Nos Quatre Programmes
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {PROGRAMS.map((program, i) => {
                                const Icon = program.icon;
                                return (
                                    <div
                                        key={i}
                                        className="p-8 sm:p-10 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-alpha/30 transition-all duration-300 border-l-4 border-l-alpha"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-alpha/10 flex items-center justify-center mb-6">
                                            <Icon className="w-7 h-7 text-alpha" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase italic text-dark mb-3">
                                            {program.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {program.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Principles */}
                    <section className="bg-gray-50 rounded-3xl p-8 sm:p-12 lg:p-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-alpha" />
                            <span className="text-alpha font-bold text-xs uppercase tracking-widest">Valeurs</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic text-dark mb-12">
                            Nos Principes Fondamentaux
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {PRINCIPLES.map((principle, i) => (
                                <div
                                    key={i}
                                    className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-alpha/30 transition-colors"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="w-8 h-8 rounded-lg bg-alpha text-white flex items-center justify-center">
                                            <Check className="w-5 h-5" />
                                        </span>
                                        <h3 className="text-lg font-black uppercase italic text-alpha">
                                            {principle.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {principle.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Partnership CTA */}
                    <section
                        id="rejoindre"
                        className="relative overflow-hidden rounded-3xl bg-alpha text-white p-8 sm:p-12 lg:p-16"
                    >
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/assets/images/banner/banner-1.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className="relative z-10 max-w-3xl mx-auto text-center">
                            <span className="text-white/80 font-bold text-xs uppercase tracking-widest">Partenariats</span>
                            <h2 className="text-3xl sm:text-4xl font-black uppercase italic mt-2 mb-6">
                                Rejoignez Nous
                            </h2>
                            <p className="text-white/90 leading-relaxed mb-4">
                                Nous recherchons des <strong className="text-white">partenaires engagés</strong> (publics, privés et associatifs) prêts à investir dans un modèle novateur de Sport for Development qui contribue concrètement à l&apos;éducation, la protection et l&apos;autonomisation de jeunes filles.
                            </p>
                            <p className="text-white/90 leading-relaxed mb-10">
                                Ensemble, renforçons l&apos;ancrage communautaire et la cohésion sociale à travers le football.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 bg-white text-alpha font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Prendre Contact <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
