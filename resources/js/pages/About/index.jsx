import React from 'react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { Trophy, Users, Target, Award, Heart, BookOpen, Zap, ChevronRight } from 'lucide-react';

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
        { year: '2003', event: "Création officielle de l'Union Sportif d'Azemmour – Football Féminin" },
        { year: "Aujourd'hui", event: 'Structuration en trois catégories : Seniors, U17, U15' },
    ];

    const missions = [
        'Offrir un accès structuré à la pratique du football féminin',
        'Former les joueuses sur les plans technique, tactique et physique',
        "Accompagner le développement personnel et éducatif",
        "Promouvoir l'égalité des chances et l'émancipation des filles",
        "Créer un environnement sûr, respectueux et bienveillant",
    ];

    const categories = [
        { name: 'Équipe Seniors' },
        { name: 'Équipe U17' },
        { name: 'Équipe U15' },
    ];

    const ambitions = [
        "Accéder à la division d'excellence régionale",
        'Renforcer la formation des jeunes catégories',
        "Structurer davantage son organisation",
        'Développer des partenariats durables',
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
                    <span className="inline-block text-alpha font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-4">À Propos</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic leading-tight text-white max-w-4xl">
                        Union Sportif d&apos;Azemmour Football Féminin
                    </h1>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </header>

            <main className="relative -mt-8 z-10">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl space-y-16 sm:space-y-24 pb-24">
                    {/* Notre Club - Bento intro */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        <div className="lg:col-span-8 p-8 sm:p-10 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
                            <span className="text-alpha font-bold text-xs uppercase tracking-wider">Notre Club</span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-6 text-dark">Une histoire, une ambition</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Fondé en <strong className="text-dark">2003</strong>, l&apos;Union Sportif d&apos;Azemmour – Football Féminin est un club engagé dans le développement du football féminin à Azemmour et dans l&apos;accompagnement des jeunes filles à travers un projet sportif, éducatif et social structuré.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Le club œuvre depuis plus de vingt ans pour offrir aux joueuses un cadre sécurisé, formateur et exigeant, favorisant à la fois la performance sportive, l&apos;épanouissement personnel et l&apos;égalité des chances.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Ancré dans son territoire, l&apos;Union Sportif d&apos;Azemmour représente fièrement la ville d&apos;Azemmour dans les compétitions régionales.
                            </p>
                        </div>
                        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 auto-rows-fr">
                            <div className="bg-alpha rounded-2xl p-6 flex flex-col justify-end text-white">
                                <span className="text-5xl font-black opacity-30">2003</span>
                                <p className="text-sm font-semibold mt-2">Année de création</p>
                            </div>
                            <div className="bg-gray-100 rounded-2xl p-6 flex flex-col justify-end border-l-4 border-alpha">
                                <span className="text-2xl font-black text-dark">3</span>
                                <p className="text-sm text-gray-600 mt-1">Catégories</p>
                            </div>
                        </div>
                    </section>

                    {/* Notre Histoire - Timeline grid */}
                    <section className="bg-gray-50 rounded-3xl p-8 sm:p-12 lg:p-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                            <div>
                                <span className="text-alpha font-bold text-xs uppercase tracking-wider">Notre Histoire</span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-6 text-dark">Un héritage pionnier</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    L&apos;histoire du football féminin à Azemmour trouve ses premières expressions dès les <strong className="text-dark">années 1980</strong>, lorsque des jeunes filles de la ville ont initié des pratiques informelles de football.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Cet héritage a conduit à la création officielle du club en <strong className="text-dark">2003</strong>, marquant une étape majeure dans l&apos;organisation du football féminin à Azemmour.
                                </p>
                            </div>
                            <div className="grid gap-4">
                                {history.map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-alpha/30 hover:shadow-md transition-all group">
                                        <span className="text-alpha font-black text-2xl shrink-0">{item.year}</span>
                                        <p className="text-gray-700 text-sm pt-1">{item.event}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Identité - Feature block */}
                    <section className="relative overflow-hidden rounded-3xl bg-dark text-white p-8 sm:p-12 lg:p-16">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-alpha/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 max-w-3xl">
                            <span className="text-alpha font-bold text-xs uppercase tracking-wider">Identité</span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-6">Tininat Azemmour</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                L&apos;Union Sportif d&apos;Azemmour a adopté une <strong className="text-white">nouvelle identité visuelle</strong> s&apos;inspirant du <strong className="text-white">dragon</strong>, symbole de la ville. Force, résilience et combativité incarnent l&apos;ADN des joueuses.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                Connues sous le surnom de <strong className="text-alpha">Tininat Azemmour</strong>, les joueuses portent cette identité avec fierté.
                            </p>
                        </div>
                    </section>

                    {/* Vision & Mission - 2-col cards */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-8 sm:p-10 rounded-2xl border-2 border-gray-100 hover:border-alpha/40 transition-colors bg-white shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-alpha/10 flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-alpha" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black uppercase italic mb-4 text-dark">Notre Vision</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Développer durablement le football féminin à Azemmour en formant des joueuses compétitives, autonomes et responsables, capables de s&apos;épanouir dans le sport comme dans la vie.
                            </p>
                        </div>
                        <div className="p-8 sm:p-10 rounded-2xl border-2 border-gray-100 hover:border-alpha/40 transition-colors bg-white shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-alpha/10 flex items-center justify-center mb-6">
                                <Trophy className="w-6 h-6 text-alpha" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black uppercase italic mb-4 text-dark">Notre Mission</h2>
                            <ul className="space-y-3 text-gray-600">
                                {missions.map((m, i) => (
                                    <li key={i} className="flex gap-3">
                                        <ChevronRight className="w-5 h-5 text-alpha shrink-0 mt-0.5" />
                                        <span>{m}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Valeurs - Bento grid */}
                    <section>
                        <div className="text-center mb-12">
                            <span className="text-alpha font-bold text-xs uppercase tracking-wider">Nos Valeurs</span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 text-dark">Ce qui nous anime</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {values.map((v, i) => {
                                const Icon = v.icon;
                                return (
                                    <div
                                        key={i}
                                        className="group p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:border-alpha/30 hover:-translate-y-1 transition-all duration-300 text-center"
                                    >
                                        <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 group-hover:bg-alpha/10 flex items-center justify-center mb-3 transition-colors">
                                            <Icon className="w-7 h-7 text-alpha" />
                                        </div>
                                        <h3 className="font-bold uppercase text-sm text-dark">{v.title}</h3>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Projet & Catégories - Asymmetric grid */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 p-8 sm:p-10 rounded-2xl bg-gray-50 border border-gray-100">
                            <h2 className="text-xl sm:text-2xl font-black uppercase italic mb-4 text-dark">Un Projet Sportif, Éducatif et Social</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Au-delà de la compétition, le club porte un projet global qui utilise le football comme levier d&apos;éducation, d&apos;inclusion et de transformation sociale.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Actions en faveur de l&apos;accompagnement scolaire, du développement personnel, de la confiance en soi et de l&apos;autonomie des jeunes filles.
                            </p>
                        </div>
                        <div className="p-8 sm:p-10 rounded-2xl bg-white border-2 border-alpha/20 shadow-lg">
                            <h2 className="text-xl sm:text-2xl font-black uppercase italic mb-6 text-dark">Nos Catégories</h2>
                            <ul className="space-y-4">
                                {categories.map((c, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-alpha" />
                                        <span className="font-semibold text-dark">{c.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm text-gray-500 mt-6">Chaque catégorie bénéficie d&apos;un programme adapté.</p>
                        </div>
                    </section>

                    {/* Ambitions - Numbered grid */}
                    <section className="bg-gray-50 rounded-3xl p-8 sm:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <div>
                                <span className="text-alpha font-bold text-xs uppercase tracking-wider">Ambitions</span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-4 text-dark">Notre feuille de route</h2>
                                <p className="text-gray-600">
                                    À court et moyen terme, le club ambitionne de :
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ambitions.map((a, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 items-start">
                                        <span className="w-10 h-10 rounded-lg bg-alpha text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                                        <span className="text-gray-700 text-sm pt-1.5">{a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA - Fierté */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark to-dark/95 text-white p-8 sm:p-12 lg:p-16">
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('/assets/images/banner/banner-1.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4">Une Fierté pour Azemmour</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Représenter Azemmour est une responsabilité et un honneur. Chaque match et chaque action du club visent à porter haut les couleurs de la ville.
                            </p>
                            <a href="/contact" className="inline-flex items-center gap-2 bg-alpha hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                                Nous contacter <ChevronRight className="w-5 h-5" />
                            </a>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
