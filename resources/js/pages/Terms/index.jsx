import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { FileText, ChevronRight, Mail } from 'lucide-react';

const SECTIONS = [
    {
        id: 'article-1',
        title: 'Article 1 – Présentation du site',
        content: (
            <>
                <p className="mb-4">Le site a pour objet de présenter :</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Les activités du club</li>
                    <li>Les équipes et le staff</li>
                    <li>Les programmes de formation</li>
                    <li>Les actualités et événements</li>
                    <li>Les informations relatives aux partenariats</li>
                    <li>La boutique officielle du club</li>
                </ul>
            </>
        ),
    },
    {
        id: 'article-2',
        title: 'Article 2 – Accès au site',
        content: (
            <>
                <p className="mb-4">L&apos;accès au site est libre et gratuit pour tout utilisateur disposant d&apos;une connexion internet.</p>
                <p>Le club s&apos;efforce d&apos;assurer une disponibilité continue du site, sans toutefois pouvoir garantir une accessibilité permanente. Il ne pourra être tenu responsable des interruptions temporaires pour maintenance ou raisons techniques.</p>
            </>
        ),
    },
    {
        id: 'article-3',
        title: 'Article 3 – Utilisation du site',
        content: (
            <>
                <p className="mb-4">L&apos;utilisateur s&apos;engage à utiliser le site conformément aux lois et règlements en vigueur.</p>
                <p className="mb-2">Il est interdit :</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>D&apos;utiliser le site à des fins frauduleuses ou illicites</li>
                    <li>De porter atteinte à l&apos;image ou au fonctionnement du club</li>
                    <li>De tenter d&apos;accéder de manière non autorisée aux systèmes informatiques du site</li>
                </ul>
            </>
        ),
    },
    {
        id: 'article-4',
        title: 'Article 4 – Propriété intellectuelle',
        content: (
            <>
                <p className="mb-4">L&apos;ensemble des contenus présents sur le site (textes, photographies, vidéos, logos, charte graphique, documents, bases de données, etc.) est la propriété exclusive de l&apos;Union Sportif d&apos;Azemmour – Football Féminin, sauf mention contraire.</p>
                <p><strong className="text-dark">Toute reproduction, diffusion ou exploitation, totale ou partielle, sans autorisation écrite préalable est strictement interdite.</strong></p>
            </>
        ),
    },
    {
        id: 'article-5',
        title: 'Article 5 – Responsabilité',
        content: (
            <>
                <p className="mb-4">Le club met tout en œuvre pour assurer l&apos;exactitude des informations publiées sur le site.</p>
                <p className="mb-2">Cependant, il ne saurait être tenu responsable :</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Des erreurs ou omissions</li>
                    <li>De l&apos;utilisation faite des informations publiées</li>
                    <li>Des dommages directs ou indirects liés à l&apos;utilisation du site</li>
                </ul>
            </>
        ),
    },
    {
        id: 'article-6',
        title: 'Article 6 – Liens vers des sites tiers',
        content: (
            <>
                <p className="mb-4">Le site peut contenir des liens vers des sites externes.</p>
                <p>Le club n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
            </>
        ),
    },
    {
        id: 'article-7',
        title: 'Article 7 – Protection des données personnelles',
        content: (
            <>
                <p className="mb-4">Le traitement des données personnelles est régi par la <Link href="/politique-confidentialite" className="text-alpha font-semibold hover:underline">Politique de Confidentialité</Link> du site.</p>
                <p>Le club s&apos;engage à respecter la loi marocaine n° 09-08 relative à la protection des données à caractère personnel.</p>
            </>
        ),
    },
];

const BOUTIQUE_SECTIONS = [
    { id: 'article-8', title: 'Article 8 – Vente et prévente', content: <>L&apos;Union Sportif d&apos;Azemmour peut proposer à la vente ou en prévente des produits dérivés (maillots, équipements, textiles, accessoires). Les produits en prévente sont fabriqués ou commandés après validation des commandes. Les visuels présentés sur le site sont fournis à titre indicatif.</> },
    { id: 'article-9', title: 'Article 9 – Commandes et paiements', content: <>Toute commande implique l&apos;acceptation des présentes CGU. Les modalités de paiement et de livraison sont précisées lors de la commande.</> },
    { id: 'article-10', title: 'Article 10 – Délais de livraison', content: <>En cas de prévente, des délais supplémentaires peuvent être nécessaires pour la production des articles. Le club s&apos;engage à informer les acheteurs en cas de retard significatif.</> },
    {
        id: 'article-11',
        title: 'Article 11 – Utilisation des bénéfices',
        content: (
            <>
                <p className="mb-4">Les bénéfices issus de la vente et de la prévente des produits sont intégralement réinjectés dans les programmes sociaux, éducatifs et sportifs du club, notamment :</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>La formation des jeunes joueuses</li>
                    <li>L&apos;accompagnement scolaire</li>
                    <li>L&apos;amélioration des conditions d&apos;entraînement</li>
                    <li>Le développement du football féminin à Azemmour</li>
                </ul>
            </>
        ),
    },
    {
        id: 'article-12',
        title: 'Article 12 – Retours et échanges',
        content: (
            <>
                <p className="mb-4">Les retours sont acceptés dans un délai de 7 jours à compter de la réception, sous réserve que :</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Le produit soit neuf</li>
                    <li>Il soit non utilisé</li>
                    <li>Il soit retourné dans son emballage d&apos;origine</li>
                </ul>
                <p className="mb-2">Les produits personnalisés ne sont ni repris ni échangés.</p>
                <p>Les frais de retour sont à la charge de l&apos;acheteur sauf erreur imputable au club.</p>
            </>
        ),
    },
    {
        id: 'article-13',
        title: 'Article 13 – Droit de rétractation',
        content: (
            <>
                <p className="mb-4">Conformément aux principes généraux du droit marocain de la consommation, l&apos;acheteur dispose d&apos;un délai de 7 jours à compter de la réception du produit pour exercer son droit de rétractation, sauf pour les produits personnalisés ou fabriqués sur commande.</p>
                <p className="mb-4">Toute demande doit être adressée à : <a href="mailto:contact@tihadazemmourwomen.ma" className="text-alpha font-semibold hover:underline">contact@tihadazemmourwomen.ma</a></p>
                <p>Le remboursement intervient après réception et vérification du produit.</p>
            </>
        ),
    },
    { id: 'article-14', title: 'Article 14 – Force majeure', content: <>Le club ne pourra être tenu responsable en cas de force majeure ou d&apos;événement indépendant de sa volonté empêchant l&apos;exécution normale de ses obligations.</> },
    { id: 'article-15', title: 'Article 15 – Modification des CGU', content: <>Le club se réserve le droit de modifier les présentes CGU à tout moment. Les nouvelles dispositions prennent effet dès leur publication sur le site.</> },
    { id: 'article-16', title: 'Article 16 – Droit applicable et juridiction compétente', content: <>Les présentes CGU sont soumises au droit marocain. En cas de litige, et à défaut de résolution amiable, les juridictions compétentes du Royaume du Maroc seront seules compétentes.</> },
];

function SectionBlock({ id, title, content }) {
    return (
        <article id={id} className="scroll-mt-24">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-black uppercase italic text-alpha mb-6 pb-2 border-b border-gray-200">
                    {title}
                </h2>
                <div className="text-gray-600 leading-relaxed prose prose-gray max-w-none">
                    {content}
                </div>
            </div>
        </article>
    );
}

export default function TermsIndex() {
    return (
        <div className="font-sans antialiased bg-white text-dark">
            <Head title="Conditions Générales d'Utilisation — USA Azemmour" />

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
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white/80 font-bold text-xs uppercase tracking-widest">Légal</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic text-white max-w-4xl mb-3">
                        Conditions Générales d&apos;Utilisation
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
                                Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») définissent les modalités d&apos;accès et d&apos;utilisation du site internet de l&apos;Union Sportif d&apos;Azemmour – Football Féminin.
                            </p>
                            <p className="text-gray-700 leading-relaxed font-semibold">
                                Toute navigation sur le site implique l&apos;acceptation pleine et entière des présentes CGU.
                            </p>
                        </div>
                    </section>

                    {/* Articles 1–7 */}
                    <div className="space-y-10">
                        {SECTIONS.map((section) => (
                            <SectionBlock key={section.id} {...section} />
                        ))}
                    </div>

                    {/* Boutique – titre de partie */}
                    <div className="mt-16 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-px bg-alpha" />
                            <span className="text-alpha font-bold text-xs uppercase tracking-widest">Boutique</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase italic text-dark mt-2">
                            Dispositions relatives à la boutique
                        </h2>
                    </div>

                    {/* Articles 8–16 */}
                    <div className="space-y-10">
                        {BOUTIQUE_SECTIONS.map((section) => (
                            <SectionBlock key={section.id} {...section} />
                        ))}
                    </div>

                    {/* Contact */}
                    <section className="mt-16">
                        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-black uppercase italic text-alpha mb-6 pb-2 border-b border-gray-200">
                                Contact
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Pour toute question relative aux présentes CGU :
                            </p>
                            <a
                                href="mailto:contact@tihadazemmourwomen.ma"
                                className="inline-flex items-center gap-2 text-alpha font-bold hover:underline"
                            >
                                <Mail className="w-5 h-5" />
                                contact@tihadazemmourwomen.ma
                            </a>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="mt-16 p-8 rounded-2xl bg-alpha text-white text-center">
                        <p className="mb-6 text-white/90">Consultez aussi notre politique de confidentialité.</p>
                        <Link
                            href="/politique-confidentialite"
                            className="inline-flex items-center gap-2 bg-white text-alpha font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Politique de Confidentialité <ChevronRight className="w-5 h-5" />
                        </Link>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
