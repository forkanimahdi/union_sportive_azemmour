import React from 'react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import StaffSlider from './StaffSlider';
import { Trophy, Users, Target, Award, Heart, BookOpen, Zap, ChevronRight, Shield, LayoutDashboard, Activity, Stethoscope, GraduationCap, Megaphone, Wallet, UserPlus, FileCheck } from 'lucide-react';

export default function About({ staffBySection = {} }) {
    const values = [
        { icon: Heart, title: 'Passion' },
        { icon: Users, title: 'Unité' },
        { icon: Award, title: 'Respect' },
        { icon: Trophy, title: 'Excellence' },
        { icon: BookOpen, title: 'Formation' },
        { icon: Zap, title: 'Ambition' },
    ];

    const history = [
        { year: '2020', event: "Fondation de l'Union Sportive d'Azemmour – Football Féminin" },
        { year: '2021–22', event: 'Première saison complète avec U13, U15 et Séniors – Podium U13 et U15 au championnat régional' },
        { year: '2023–24', event: "Qualification des Séniors en Division Excellence Régionale" },
        { year: '2025–26', event: 'Division d\'Honneur Régionale – Objectif : Excellence puis Amateur Nationale' },
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
        "Atteindre la Division d'Excellence Régionale",
        "Accéder à l'Amateur Nationale",
        'Renforcer la formation des jeunes catégories',
        'Développer des partenariats durables',
    ];

    const bureauMissions = [
        'Définir la vision et les priorités du club',
        'Assurer la bonne gouvernance et le respect des statuts',
        'Valider les programmes sportifs, éducatifs et sociaux',
        'Suivre le fonctionnement des commissions',
        'Représenter le club auprès des partenaires et institutions',
    ];

    const commissions = [
        { icon: Activity, title: 'Commission Technique', desc: 'Chargée du suivi sportif des équipes (équipe première, U17, U15), de l\'encadrement technique, de la formation et du développement des joueuses.' },
        { icon: Stethoscope, title: 'Commission Médicale', desc: 'Responsable du suivi de la santé des joueuses, de la prévention des blessures et de la mise en place de protocoles de prise en charge et de suivi médical.' },
        { icon: GraduationCap, title: 'Commission S4D – Sport for Development', desc: 'Porte les actions sociales et éducatives du club, notamment le programme de soutien scolaire, les politiques de protection et de sauvegarde, ainsi que l\'élaboration de documents cadres (Charte de la joueuse, Code de conduite).' },
        { icon: Megaphone, title: 'Commission Communication & Sponsoring', desc: 'Assure la gestion de l\'image du club, la communication digitale, le déploiement de l\'identité visuelle, le développement du site web et la recherche de partenariats.' },
        { icon: Wallet, title: 'Commission Finance', desc: 'Chargée de la gestion financière, du suivi budgétaire, de la transparence des comptes et du suivi des cotisations.' },
    ];

    const principesGouvernance = [
        'Transparence dans la gestion',
        'Participation et concertation',
        'Responsabilité et redevabilité',
        'Équité et inclusion',
        'Protection et intérêt supérieur des joueuses',
    ];

    const adhesionBenefits = [
        'Soutenir le projet du club',
        'Participer à la vie associative',
        'Contribuer aux réflexions et actions des commissions',
        'Être informé(e) des activités et orientations du club',
    ];

    const adhesionConditions = [
        'Adhérer aux statuts et au règlement intérieur du club',
        'Respecter les valeurs, la charte et le code de conduite',
        'S\'acquitter de la cotisation annuelle',
        'Remplir le formulaire d\'adhésion',
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
                        Union Sportive d&apos;Azemmour Football Féminin
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
                                Fondé en <strong className="text-dark">2020</strong>, l&apos;Union Sportive d&apos;Azemmour – Football Féminin est un club engagé dans le développement du football féminin à Azemmour et dans l&apos;accompagnement des jeunes filles à travers un projet sportif, éducatif et social structuré.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Membre de la Ligue Régionale Chaouia Doukkala, le club a disputé sa première saison complète en <strong className="text-dark">2021–22</strong> avec trois équipes : U13, U15 et Séniors. Dès cette première année, les équipes U13 et U15 ont décroché le podium du championnat régional. En <strong className="text-dark">2023–24</strong>, les Séniors se sont qualifiées en Division Excellence Régionale, et le club aborde la saison <strong className="text-dark">2025–26</strong> en Division d&apos;Honneur Régionale avec pour objectif d&apos;atteindre la Division Excellence puis l&apos;Amateur Nationale.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Avec plus de <strong className="text-dark">60 joueuses</strong> réparties sur 3 catégories (Séniors, U17 et U15), l&apos;Union Sportive d&apos;Azemmour représente fièrement la ville dans les compétitions régionales et poursuit son ambition de grandir sportivement tout en offrant aux joueuses un cadre sécurisé, formateur et exigeant.
                            </p>
                        </div>
                        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 auto-rows-fr">
                            <div className="bg-alpha rounded-2xl p-6 flex flex-col justify-end text-white">
                                <span className="text-5xl font-black opacity-30">2020</span>
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
                                <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-6 text-dark">Un héritage en construction</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Fondé en <strong className="text-dark">2020</strong>, l&apos;Union Sportive d&apos;Azemmour – Football Féminin s&apos;est structurée dès sa première saison complète en 2021–22 autour de trois équipes : U13, U15 et Séniors.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Les équipes U13 et U15 ont décroché le podium dès 2021–22. Les Séniors se sont qualifiées en Division Excellence Régionale en 2023–24. Le club aborde la saison 2025–26 en Division d&apos;Honneur Régionale, avec pour ambition la Division Excellence puis l&apos;Amateur Nationale.
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
                                L&apos;Union Sportive d&apos;Azemmour a adopté une <strong className="text-white">nouvelle identité visuelle</strong> s&apos;inspirant du <strong className="text-white">dragon</strong>, symbole de la ville. Force, résilience et combativité incarnent l&apos;ADN des joueuses.
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

                    {/* Notre équipe – Bureau, Coaches, Soigneurs (sliders) */}
                    {(staffBySection.bureau?.length > 0 || staffBySection.coach?.length > 0 || staffBySection.soigneur?.length > 0) && (
                        <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12">
                            <div className="mb-10">
                                <span className="text-alpha font-bold text-xs uppercase tracking-wider">Notre équipe</span>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-2 text-dark">Bureau, encadrement & soigneurs</h2>
                                <p className="text-gray-600 max-w-2xl">
                                    Les membres du bureau, l&apos;encadrement technique et les soigneurs qui font vivre le club.
                                </p>
                            </div>

                            {staffBySection.bureau?.length > 0 && (
                                <StaffSlider
                                    title="Bureau / Administratif"
                                    subtitle="Gouvernance"
                                    members={staffBySection.bureau}
                                />
                            )}
                            {staffBySection.coach?.length > 0 && (
                                <StaffSlider
                                    title="Encadrement technique"
                                    subtitle="Coaches"
                                    members={staffBySection.coach}
                                />
                            )}
                            {staffBySection.soigneur?.length > 0 && (
                                <StaffSlider
                                    title="Soigneurs & Médical"
                                    subtitle="Santé"
                                    members={staffBySection.soigneur}
                                />
                            )}
                        </section>
                    )}

                    {/* Gouvernance */}
                    <section className="bg-gray-50 rounded-3xl p-8 sm:p-12 lg:p-16">
                        <div className="mb-10">
                            <span className="text-alpha font-bold text-xs uppercase tracking-wider">Gouvernance</span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-4 text-dark">Transparence, participation, responsabilité</h2>
                            <p className="text-gray-600 leading-relaxed max-w-3xl">
                                Le Club Union Sportive Azemmour adopte un modèle de gouvernance fondé sur la transparence, la participation et la responsabilité. Cette gouvernance vise à garantir une gestion saine du club, à renforcer la confiance des parties prenantes et à assurer la pérennité du projet sportif, éducatif et social.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-5 p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-alpha/10 flex items-center justify-center mb-6">
                                    <LayoutDashboard className="w-6 h-6 text-alpha" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic mb-3 text-dark">Bureau Exécutif</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    Organe central de pilotage du club, il définit les orientations stratégiques, veille à leur mise en œuvre et supervise l&apos;ensemble des activités. Il se réunit de manière régulière, notamment lors de réunions mensuelles dédiées au suivi de la gestion du club et de l&apos;avancement des travaux des différentes commissions.
                                </p>
                                <ul className="space-y-2">
                                    {bureauMissions.map((m, i) => (
                                        <li key={i} className="flex gap-2 text-gray-700 text-sm">
                                            <ChevronRight className="w-4 h-4 text-alpha shrink-0 mt-0.5" />
                                            {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:col-span-7 space-y-4">
                                <h3 className="text-lg font-black uppercase italic text-dark">Commissions permanentes</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Pour une gestion spécialisée et efficace, le club s&apos;appuie sur des commissions permanentes, placées sous la coordination du Bureau Exécutif.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {commissions.map((c, i) => {
                                        const Icon = c.icon;
                                        return (
                                            <div key={i} className="p-5 rounded-xl bg-white border border-gray-100 hover:border-alpha/30 transition-colors">
                                                <div className="w-10 h-10 rounded-lg bg-alpha/10 flex items-center justify-center mb-3">
                                                    <Icon className="w-5 h-5 text-alpha" />
                                                </div>
                                                <h4 className="font-bold text-dark text-sm mb-1">{c.title}</h4>
                                                <p className="text-gray-600 text-xs leading-relaxed">{c.desc}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-5 rounded-xl bg-white border-l-4 border-alpha mt-4">
                                    <h4 className="font-bold text-dark text-sm mb-3 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-alpha" />
                                        Principes de gouvernance
                                    </h4>
                                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-sm">
                                        {principesGouvernance.map((p, i) => (
                                            <li key={i} className="flex gap-1.5">
                                                <span className="text-alpha">•</span> {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Adhésion */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50">
                            <div className="w-12 h-12 rounded-xl bg-alpha/10 flex items-center justify-center mb-6">
                                <UserPlus className="w-6 h-6 text-alpha" />
                            </div>
                            <span className="text-alpha font-bold text-xs uppercase tracking-wider">Adhérer au Club</span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mt-2 mb-4 text-dark">Rejoignez-nous</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Le Club Union Sportive Azemmour est ouvert à toute personne partageant ses valeurs et souhaitant contribuer au développement du football féminin et à la réussite du projet sportif et social du club.
                            </p>
                            <p className="font-semibold text-dark text-sm mb-3">L&apos;adhésion permet notamment de :</p>
                            <ul className="space-y-2 mb-8">
                                {adhesionBenefits.map((b, i) => (
                                    <li key={i} className="flex gap-2 text-gray-600 text-sm">
                                        <ChevronRight className="w-4 h-4 text-alpha shrink-0 mt-0.5" />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-gray-500 text-sm">
                                Toute demande d&apos;adhésion est examinée par le Bureau Exécutif, qui se réserve le droit de validation conformément aux statuts.
                            </p>
                        </div>
                        <div className="p-8 sm:p-10 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-alpha/10 flex items-center justify-center mb-6">
                                <FileCheck className="w-6 h-6 text-alpha" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black uppercase italic mb-4 text-dark">Conditions d&apos;adhésion</h2>
                            <p className="text-gray-600 text-sm mb-6">
                                Pour devenir membre du club, il est nécessaire de :
                            </p>
                            <ul className="space-y-3">
                                {adhesionConditions.map((c, i) => (
                                    <li key={i} className="flex gap-3 p-3 rounded-xl bg-white border border-gray-100">
                                        <span className="w-8 h-8 rounded-lg bg-alpha text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                                        <span className="text-gray-700 text-sm pt-1">{c}</span>
                                    </li>
                                ))}
                            </ul>
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
