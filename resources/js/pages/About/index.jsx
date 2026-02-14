import React from 'react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { Trophy, Users, Target, Award, Heart, BookOpen, Zap } from 'lucide-react';

export default function About() {
    const values = [
        { icon: Heart, title: 'Passion' },
        { icon: Users, title: 'Unité' },
        { icon: Award, title: 'Respect' },
        { icon: Trophy, title: 'Excellence' },
        { icon: BookOpen, title: 'Formation' },
        { icon: Zap, title: 'Ambition' },
    ];

    const history = [
        { year: 'Années 1980', event: 'Premières pratiques informelles du football féminin à Azemmour' },
        { year: '2003', event: 'Création officielle de l\'Union Sportif d\'Azemmour – Football Féminin' },
        { year: 'Aujourd\'hui', event: 'Structuration en trois catégories : Seniors, U17, U15' },
    ];

    const missions = [
        'Offrir un accès structuré à la pratique du football féminin',
        'Former les joueuses sur les plans technique, tactique et physique',
        'Accompagner le développement personnel et éducatif',
        'Promouvoir l\'égalité des chances et l\'émancipation des filles',
        'Créer un environnement sûr, respectueux et bienveillant',
    ];

    const categories = [
        { name: 'Équipe Seniors' },
        { name: 'Équipe U17' },
        { name: 'Équipe U15' },
    ];

    const ambitions = [
        'Accéder à la division d\'excellence régionale',
        'Renforcer la formation des jeunes catégories',
        'Structurer davantage son organisation',
        'Développer des partenariats durables',
    ];

    return (
        <div className="font-sans antialiased bg-white">
            <Navbar />

            <div className="relative min-h-[50vh] bg-alpha overflow-hidden pt-24 lg:pt-28">
                <div className="absolute inset-0 bg-alpha/90" />
                <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 max-w-7xl">
                    <h4 className="text-white/90 font-bold text-xs sm:text-sm uppercase mb-3 tracking-wider">À Propos</h4>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic leading-tight text-white">
                        Union Sportif d&apos;Azemmour Football Féminin
                    </h1>
                </div>
            </div>

            <div className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12l">
                    {/* Présentation */}
                    <section className="mb-16 p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-6 text-white">Notre Club</h2>
                        <p className="text-white/95 leading-relaxed mb-4">
                            Fondé en <strong>2003</strong>, l&apos;Union Sportif d&apos;Azemmour – Football Féminin est un club engagé dans le développement du football féminin à Azemmour et dans l&apos;accompagnement des jeunes filles à travers un projet sportif, éducatif et social structuré.
                        </p>
                        <p className="text-white/95 leading-relaxed mb-4">
                            Le club œuvre depuis plus de vingt ans pour offrir aux joueuses un cadre sécurisé, formateur et exigeant, favorisant à la fois la performance sportive, l&apos;épanouissement personnel et l&apos;égalité des chances.
                        </p>
                        <p className="text-white/95 leading-relaxed">
                            Ancré dans son territoire, l&apos;Union Sportif d&apos;Azemmour – Football Féminin représente fièrement la ville d&apos;Azemmour dans les compétitions régionales et porte une vision ambitieuse tournée vers l&apos;avenir.
                        </p>
                    </section>

                    {/* Notre Histoire */}
                    <section className="mb-16 p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-6 text-white">Notre Histoire</h2>
                        <p className="text-white/95 leading-relaxed mb-4">
                            L&apos;histoire du football féminin à Azemmour trouve ses premières expressions dès les <strong>années 1980</strong>, lorsque des jeunes filles de la ville ont initié des pratiques informelles de football, dans un contexte où aucune compétition féminine officielle n&apos;existait encore au niveau national.
                        </p>
                        <p className="text-white/95 leading-relaxed mb-4">
                            Cet héritage pionnier a progressivement conduit à la structuration du club, avec la création officielle de l&apos;Union Sportif d&apos;Azemmour – Football Féminin en <strong>2003</strong>, marquant une étape majeure dans l&apos;organisation et la reconnaissance du football féminin à Azemmour.
                        </p>
                        <p className="text-white/95 leading-relaxed mb-8">Depuis, le club n&apos;a cessé d&apos;évoluer, en consolidant ses catégories, son encadrement et son projet global.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {history.map((item, i) => (
                                <div key={i} className="p-6 bg-white/10 rounded-xl text-white">
                                    <div className="text-xl font-black text-white mb-2">{item.year}</div>
                                    <p className="text-sm text-white/90">{item.event}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Identité - Dragon / Tininat */}
                    <section className="mb-16 p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4 text-white">Une Identité Renouvelée, Ancrée dans l&apos;Histoire</h2>
                        <p className="text-white/95 leading-relaxed mb-4">
                            L&apos;Union Sportif d&apos;Azemmour – Football Féminin a récemment adopté une <strong>nouvelle identité visuelle</strong>, comprenant une nouvelle charte graphique et des tenues officielles actualisées.
                        </p>
                        <p className="text-white/95 leading-relaxed mb-4">
                            Cette identité s&apos;inspire du <strong>dragon</strong>, symbole emblématique associé à la ville d&apos;Azemmour. Le dragon incarne la <strong>force</strong>, la <strong>résilience</strong> et la <strong>combativité</strong>, des valeurs qui traduisent l&apos;ADN des joueuses du club.
                        </p>
                        <p className="text-white/95 leading-relaxed">
                            Connues sous le surnom de <strong>Tininat Azemmour</strong>, les joueuses portent cette identité avec fierté et responsabilité.
                        </p>
                    </section>

                    {/* Vision & Mission */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        <div className="p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4 text-white">Notre Vision</h2>
                            <p className="text-white/95 leading-relaxed">
                                Développer durablement le football féminin à Azemmour en formant des joueuses compétitives, autonomes et responsables, capables de s&apos;épanouir dans le sport comme dans la vie.
                            </p>
                        </div>
                        <div className="p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4 text-white">Notre Mission</h2>
                            <p className="text-white/95 leading-relaxed mb-4">
                                L&apos;Union Sportif d&apos;Azemmour – Football Féminin a pour mission de :
                            </p>
                            <ul className="space-y-2 text-white/95">
                                {missions.map((m, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-white font-bold">•</span>
                                        <span>{m}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Valeurs */}
                    <section className="mb-16 p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-6 text-white">Nos Valeurs</h2>
                        <p className="text-white/90 mb-8">Ces valeurs guident l&apos;ensemble des actions du club.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {values.map((v, i) => {
                                const Icon = v.icon;
                                return (
                                    <div key={i} className="text-center p-6 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors">
                                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3">
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="font-bold uppercase text-sm text-white">{v.title}</h3>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Projet & Catégories */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        <div className="p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4 text-white">Un Projet Sportif, Éducatif et Social</h2>
                            <p className="text-white/95 leading-relaxed mb-4">
                                Au-delà de la compétition, le club porte un projet global qui utilise le football comme levier d&apos;éducation, d&apos;inclusion et de transformation sociale.
                            </p>
                            <p className="text-white/95 leading-relaxed">
                                Des actions spécifiques sont menées en faveur de : l&apos;accompagnement scolaire, le développement personnel, la confiance en soi et l&apos;autonomie des jeunes filles.
                            </p>
                        </div>
                        <div className="p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4 text-white">Nos Catégories</h2>
                            <p className="text-white/95 leading-relaxed mb-4">
                                Le club est structuré autour de trois catégories :
                            </p>
                            <ul className="space-y-3">
                                {categories.map((c, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-white rounded-full" />
                                        <span className="font-semibold text-white">{c.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-white/80 text-sm mt-4">Chaque catégorie bénéficie d&apos;un programme d&apos;entraînement adapté.</p>
                        </div>
                    </section>

                    {/* Ambitions */}
                    <section className="mb-16 p-8 sm:p-10 bg-alpha text-white rounded-2xl">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4 text-white">Ambitions</h2>
                        <p className="text-white/95 leading-relaxed mb-6">
                            À court et moyen terme, l&apos;Union Sportif d&apos;Azemmour – Football Féminin ambitionne de :
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {ambitions.map((a, i) => (
                                <li key={i} className="flex gap-3 items-center">
                                    <span className="w-8 h-8 bg-white text-alpha rounded-full flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                                    <span className="text-white/95">{a}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Une Fierté pour Azemmour */}
                    <section className="p-8 sm:p-10 bg-alpha text-white rounded-2xl border-2 border-white/20">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4 text-white">Une Fierté pour Azemmour</h2>
                        <p className="text-white/95 leading-relaxed mb-4">
                            Représenter Azemmour est une responsabilité et un honneur.
                        </p>
                        <p className="text-white/95 leading-relaxed">
                            Chaque match, chaque entraînement et chaque action du club visent à porter haut les couleurs de la ville et à inspirer les générations futures.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}
