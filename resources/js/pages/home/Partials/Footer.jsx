import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-dark text-white pt-12 sm:pt-16 lg:pt-20 border-t-4 border-alpha">
            {/* Newsletter Section */}
            <div className="container mx-auto px-6 sm:px-8 lg:px-12l mb-12 sm:mb-16 lg:mb-20">
                <div className="bg-[url('https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-2xl p-6 sm:p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-dark/80"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic mb-2">Abonnez-vous à notre newsletter</h2>
                            <p className="text-gray-400 text-sm sm:text-base">Restez informé des dernières actualités et offres spéciales.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                            <input type="email" placeholder="Votre adresse email" className="bg-white/10 border border-white/20 px-4 sm:px-6 py-3 sm:py-4 rounded-full w-full md:w-80 text-white placeholder:text-gray-400 focus:outline-none focus:border-alpha text-sm sm:text-base" />
                            <button className="bg-alpha hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold uppercase transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                                S'abonner <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="container mx-auto px-6 sm:px-8 lg:px-12l pb-8 sm:pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <img src="/assets/images/logo.png" alt="Union Sportive Azemmour" className="w-10 h-10 rounded-full object-contain bg-white/5" />
                            <span className="font-bold text-xl uppercase tracking-wider">Union Sportive Azemmour</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            L'Union Sportive Azemmour est un club de football professionnel engagé dans l'excellence, la communauté et le beau jeu.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-alpha transition-colors"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-alpha transition-colors"><Twitter className="w-4 h-4" /></a>
                            <a href="https://www.instagram.com/tihadazemmourwomen/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-alpha transition-colors" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-alpha transition-colors"><Linkedin className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6">Liens Rapides</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-alpha transition-colors">Accueil</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">À Propos</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Matchs</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6">Informations</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-alpha transition-colors">Boutique</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Politique de Confidentialité</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Conditions Générales</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Plan du Site</a></li>
                        </ul>
                    </div>

                    {/* Instagram Embed */}
                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6">
                            <a href="https://www.instagram.com/tihadazemmourwomen/" target="_blank" rel="noopener noreferrer" className="hover:text-alpha transition-colors">
                                @tihadazemmourwomen
                            </a>
                        </h4>
                        <div className="rounded-lg overflow-hidden bg-gray-800/50 border border-white/10">
                            <iframe
                                title="Instagram - Tihad Azemmour Women"
                                src="https://www.instagram.com/tihadazemmourwomen/embed"
                                className="w-full h-[400px] overflow-hidden bg-black border-0"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                        <a
                            href="https://www.instagram.com/tihadazemmourwomen/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-3 text-sm text-gray-400 hover:text-alpha transition-colors"
                        >
                            <Instagram className="w-4 h-4" />
                            Suivez-nous sur Instagram
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Union Sportive Azemmour. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}

