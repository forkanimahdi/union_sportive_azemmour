import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { Shield, ChevronRight, Mail } from 'lucide-react';

const SECTIONS = [
    {
        id: 'responsable',
        title: '1. Responsable du traitement',
        content: (
            <>
                <p className="mb-4">Le responsable du traitement des données est :</p>
                <p className="font-semibold text-dark">Union Sportif d&apos;Azemmour – Football Féminin</p>
                <p>Siège : Azemmour – Royaume du Maroc</p>
                <p>Email : <a href="mailto:contact@tihadazemmourwomen.ma" className="text-alpha font-semibold hover:underline">contact@tihadazemmourwomen.ma</a></p>
            </>
        ),
    },
    {
        id: 'cadre-legal',
        title: '2. Cadre légal',
        content: (
            <>
                <p className="mb-4">Le traitement des données personnelles effectué via le site est régi par la <strong className="text-dark">loi marocaine n° 09-08</strong> relative à la protection des personnes physiques à l&apos;égard du traitement des données à caractère personnel.</p>
                <p className="mb-2">Conformément à cette loi :</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Les données sont collectées de manière loyale et licite.</li>
                    <li>Les données sont utilisées pour des finalités déterminées, explicites et légitimes.</li>
                    <li>Les personnes concernées disposent d&apos;un droit d&apos;information, d&apos;accès, de rectification et d&apos;opposition.</li>
                    <li>Les données sont conservées de manière sécurisée et confidentielle.</li>
                </ul>
                <p>Lorsque cela est requis, l&apos;Union Sportif d&apos;Azemmour – Football Féminin effectue les déclarations nécessaires auprès de la <strong className="text-dark">Commission Nationale de Contrôle de la Protection des Données à caractère Personnel (CNDP)</strong>.</p>
            </>
        ),
    },
    {
        id: 'donnees',
        title: '3. Données personnelles collectées',
        content: (
            <>
                <p className="mb-4">Selon l&apos;utilisation du site, nous pouvons collecter :</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Informations fournies via les formulaires (contact, inscription, partenariat, etc.)</li>
                    <li>Données de navigation (adresse IP, type de navigateur, pages consultées, cookies)</li>
                </ul>
            </>
        ),
    },
    {
        id: 'finalites',
        title: '4. Finalités de la collecte',
        content: (
            <>
                <p className="mb-4">Les données collectées sont utilisées pour :</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Répondre aux demandes envoyées via le site</li>
                    <li>Gérer les inscriptions aux activités du club</li>
                    <li>Communiquer sur les événements et actualités</li>
                    <li>Développer les partenariats</li>
                    <li>Améliorer le fonctionnement et l&apos;expérience utilisateur du site</li>
                </ul>
            </>
        ),
    },
    {
        id: 'confidentialite',
        title: '5. Confidentialité et sécurité',
        content: (
            <>
                <p className="mb-4">L&apos;Union Sportif d&apos;Azemmour – Football Féminin met en œuvre des mesures techniques et organisationnelles appropriées afin de garantir la sécurité et la confidentialité des données personnelles.</p>
                <p><strong className="text-dark">Les données ne sont ni vendues, ni cédées, ni louées à des tiers.</strong></p>
            </>
        ),
    },
    {
        id: 'duree',
        title: '6. Durée de conservation',
        content: (
            <p>Les données personnelles sont conservées pendant la durée strictement nécessaire aux finalités pour lesquelles elles ont été collectées, sauf obligation légale contraire.</p>
        ),
    },
    {
        id: 'cookies',
        title: '7. Cookies',
        content: (
            <>
                <p className="mb-4">Le site peut utiliser des cookies afin de :</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Faciliter la navigation</li>
                    <li>Mesurer l&apos;audience</li>
                    <li>Améliorer les performances du site</li>
                </ul>
                <p>L&apos;utilisateur peut configurer son navigateur pour refuser ou supprimer les cookies.</p>
            </>
        ),
    },
    {
        id: 'droits',
        title: '8. Droits des personnes concernées',
        content: (
            <>
                <p className="mb-4">Conformément à la loi n° 09-08, toute personne dispose des droits suivants :</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Droit d&apos;accès à ses données</li>
                    <li>Droit de rectification</li>
                    <li>Droit d&apos;opposition au traitement</li>
                    <li>Droit de suppression, lorsque applicable</li>
                </ul>
                <p>Toute demande peut être adressée à : <a href="mailto:contact@tihadazemmourwomen.ma" className="text-alpha font-semibold hover:underline">contact@tihadazemmourwomen.ma</a></p>
            </>
        ),
    },
    {
        id: 'liens',
        title: '9. Liens vers des sites tiers',
        content: (
            <>
                <p className="mb-4">Le site peut contenir des liens vers des sites externes.</p>
                <p>L&apos;Union Sportif d&apos;Azemmour – Football Féminin n&apos;est pas responsable du contenu ni des politiques de confidentialité de ces sites.</p>
            </>
        ),
    },
    {
        id: 'modification',
        title: '10. Modification de la politique',
        content: (
            <>
                <p className="mb-4">L&apos;Union Sportif d&apos;Azemmour – Football Féminin se réserve le droit de modifier la présente politique à tout moment.</p>
                <p>Les modifications prennent effet dès leur publication sur le site.</p>
            </>
        ),
    },
    {
        id: 'contact',
        title: '11. Contact',
        content: (
            <>
                <p className="mb-4">Pour toute question relative à la protection des données personnelles :</p>
                <a href="mailto:contact@tihadazemmourwomen.ma" className="inline-flex items-center gap-2 text-alpha font-bold hover:underline">
                    <Mail className="w-5 h-5" />
                    contact@tihadazemmourwomen.ma
                </a>
            </>
        ),
    },
];

export default function PrivacyIndex() {
    return (
        <div className="font-sans antialiased bg-white text-dark">
            <Head title="Politique de Confidentialité — USA Azemmour" />

            <Navbar />

            {/* Hero */}
            <header className="relative min-h-[40vh] overflow-hidden pt-24 lg:pt-28">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/assets/images/banner/banner-1.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/60 to-alpha/50" />
                <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20 max-w-7xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white/80 font-bold text-xs uppercase tracking-widest">Légal</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic text-white max-w-4xl mb-3">
                        Politique de Confidentialité
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl">
                        Union Sportif d&apos;Azemmour – Football Féminin
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
            </header>

            <main className="relative -mt-4 z-10">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl pb-20">
                    {/* Intro */}
                    <section className="mb-16">
                        <div className="p-6 sm:p-8 rounded-2xl bg-gray-50 border-l-4 border-alpha">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                L&apos;Union Sportif d&apos;Azemmour – Football Féminin accorde une importance particulière à la protection des données à caractère personnel et au respect de la vie privée des utilisateurs de son site internet.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                La présente politique de confidentialité a pour objectif d&apos;informer les visiteurs, membres, joueuses, parents, partenaires et toute personne utilisant le site des modalités de collecte, d&apos;utilisation et de protection de leurs données personnelles.
                            </p>
                        </div>
                    </section>

                    {/* Sections */}
                    <div className="space-y-10">
                        {SECTIONS.map((section) => (
                            <article
                                key={section.id}
                                id={section.id}
                                className="scroll-mt-24"
                            >
                                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h2 className="text-xl font-black uppercase italic text-alpha mb-6 pb-2 border-b border-gray-200">
                                        {section.title}
                                    </h2>
                                    <div className="text-gray-600 leading-relaxed prose prose-gray max-w-none">
                                        {section.content}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* CTA */}
                    <section className="mt-16 p-8 rounded-2xl bg-alpha text-white text-center">
                        <p className="mb-6 text-white/90">Une question sur vos données personnelles ?</p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-white text-alpha font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Nous contacter <ChevronRight className="w-5 h-5" />
                        </Link>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
