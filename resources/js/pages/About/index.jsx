import React from 'react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { Trophy, Users, Calendar, Target, Award, Heart } from 'lucide-react';

export default function About() {
    const values = [
        { icon: Heart, title: 'Passion', description: 'Notre amour inconditionnel pour le football et notre club' },
        { icon: Users, title: 'Unité', description: 'Ensemble, nous formons une famille soudée' },
        { icon: Trophy, title: 'Excellence', description: 'Toujours viser le meilleur sur et en dehors du terrain' },
        { icon: Award, title: 'Respect', description: 'Respecter nos adversaires, nos supporters et nos valeurs' },
    ];

    const history = [
        { year: '1950', event: 'Fondation du club' },
        { year: '1965', event: 'Premier titre régional' },
        { year: '1980', event: 'Promotion en Botola Pro' },
        { year: '2020', event: 'Rénovation du stade' },
    ];

    return (
        <div className="font-sans antialiased text-dark bg-white">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative h-64 sm:h-80 lg:h-96 bg-dark overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark/90 to-alpha/40 z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="relative z-20 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white">
                    <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-3 sm:mb-4 tracking-wider">À Propos</h4>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase italic leading-tight px-4">
                        Notre <span className="text-alpha">Histoire</span>
                    </h1>
                </div>
            </div>

            {/* About Content */}
            <div className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h4 className="text-alpha font-bold text-sm uppercase mb-2">Notre Club</h4>
                            <h2 className="text-4xl font-black uppercase italic mb-6">Union Sportive Azemmour</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Fondé en 1950, l'Union Sportive Azemmour est un club de football marocain basé à Azemmour. 
                                Depuis plus de 70 ans, nous représentons fièrement notre ville et notre région dans le championnat marocain.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Notre mission est de développer le football local, former les jeunes talents et promouvoir 
                                les valeurs sportives dans notre communauté. Nous croyons en l'excellence, le respect et la passion.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Aujourd'hui, nous continuons à écrire notre histoire avec détermination et ambition, 
                                visant toujours les plus hauts sommets du football marocain.
                            </p>
                        </div>
                        <div className="relative h-96 rounded-lg overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop" 
                                alt="Stadium" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="mb-12 sm:mb-16 lg:mb-20">
                        <div className="text-center mb-8 sm:mb-12">
                            <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Nos Valeurs</h4>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">Ce Qui Nous Définit</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {values.map((value, index) => {
                                const Icon = value.icon;
                                return (
                                    <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-xl transition-all group">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-alpha/10 rounded-full mb-4 group-hover:bg-alpha transition-colors">
                                            <Icon className="w-8 h-8 text-alpha group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold uppercase mb-2">{value.title}</h3>
                                        <p className="text-sm text-gray-600">{value.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* History Timeline */}
                    <div>
                        <div className="text-center mb-8 sm:mb-12">
                            <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Notre Histoire</h4>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">Moments Clés</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {history.map((item, index) => (
                                <div key={index} className="relative p-6 bg-dark text-white rounded-lg">
                                    <div className="text-3xl font-black text-alpha mb-2">{item.year}</div>
                                    <div className="text-sm font-bold uppercase">{item.event}</div>
                                    {index < history.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-alpha"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

