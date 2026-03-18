import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

const TEAMS = [
    { slug: 'senior', label: 'Senior' },
    { slug: 'u17', label: 'U17' },
    { slug: 'u15', label: 'U15' },
];

export default function Navbar({ variant = 'dark' }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [teamsOpen, setTeamsOpen] = useState(false);
    const teamsRef = useRef(null);

    useEffect(() => {
        if (!teamsOpen) return;
        const close = (e) => {
            if (teamsRef.current && !teamsRef.current.contains(e.target)) setTeamsOpen(false);
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [teamsOpen]);
    const isLight = variant === 'light';
    const navClasses = isLight
        ? 'absolute top-0 left-0 w-full z-50 text-dark bg-white/95 backdrop-blur-sm border-b border-gray-200'
        : 'absolute top-0 left-0 w-full z-50 text-white border-b border-white/10';

    return (
        <nav className={navClasses}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-2 ">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <AppLogoIcon className="w-14 h-14" />
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium tracking-wide uppercase">
                        <Link href="/" className="hover:text-alpha transition-colors px-2 py-1">Accueil</Link>
                        <Link href="/about" className="hover:text-alpha transition-colors px-2 py-1">À Propos</Link>
                        <Link href="/development" className="hover:text-alpha transition-colors px-2 py-1">S4D</Link>
                        <div className="relative group">
                            <button
                                className="hover:text-alpha transition-colors px-2 py-1 flex items-center gap-1"
                                aria-haspopup="listbox"
                                aria-expanded={teamsOpen}
                            >
                                Nos Équipes
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <div className={`py-1 rounded-lg shadow-lg min-w-[140px] ${isLight ? 'bg-white border border-gray-200' : 'bg-dark/95 border border-white/10'}`}>
                                    {TEAMS.map((t) => (
                                        <Link
                                            key={t.slug}
                                            href={`/category/${t.slug}`}
                                            className={`block px-4 py-2.5 text-sm whitespace-nowrap hover:bg-alpha hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg ${isLight ? 'text-dark' : 'text-white'}`}
                                        >
                                            {t.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link href="/partenaires" className="hover:text-alpha transition-colors px-2 py-1">Partenaires</Link>
                        <Link href="/shop" className="hover:text-alpha transition-colors px-2 py-1">Boutique</Link>
                        <Link href="/contact" className="hover:text-alpha transition-colors px-2 py-1">Contact</Link>
                    </div>

                    {/* Desktop Icons */}
                    <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                        <button className="hover:text-alpha transition-colors p-2" aria-label="Search">
                            <Search className="w-5 h-5" />
                        </button>
                        {/* <button className="hover:text-alpha transition-colors p-2 relative" aria-label="Cart">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-alpha text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </button> */}
                        {/* <button className="hover:text-alpha transition-colors p-2" aria-label="User">
                            <User className="w-5 h-5" />
                        </button> */}
                    </div>

                    {/* Mobile Menu Button */}
                        <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`lg:hidden hover:text-alpha transition-colors p-2 ${isLight ? 'text-dark' : 'text-white'}`}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-white/10 bg-dark/95 backdrop-blur-sm">
                        <div className="px-4 py-6 space-y-4">
                            <Link 
                                href="/" 
                                className="block hover:text-alpha transition-colors uppercase font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Accueil
                            </Link>
                            <Link 
                                href="/about" 
                                className="block hover:text-alpha transition-colors uppercase font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                À Propos
                            </Link>
                            <Link 
                                href="/development" 
                                className="block hover:text-alpha transition-colors uppercase font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Développement
                            </Link>
                            <span className="block text-gray-400 uppercase text-xs font-semibold pt-2 pb-1">Nos Équipes</span>
                            {TEAMS.map((t) => (
                                <Link
                                    key={t.slug}
                                    href={`/category/${t.slug}`}
                                    className="block hover:text-alpha transition-colors uppercase font-medium py-2 pl-4"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {t.label}
                                </Link>
                            ))}
                            <Link 
                                href="/partenaires" 
                                className="block hover:text-alpha transition-colors uppercase font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Partenaires
                            </Link>
                            <Link 
                                href="/shop" 
                                className="block hover:text-alpha transition-colors uppercase font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Boutique
                            </Link>
                            <Link 
                                href="/contact" 
                                className="block hover:text-alpha transition-colors uppercase font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                                <button className="hover:text-alpha transition-colors p-2" aria-label="Search">
                                    <Search className="w-5 h-5" />
                                </button>
                                <button className="hover:text-alpha transition-colors p-2 relative" aria-label="Cart">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 bg-alpha text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                                </button>
                                <button className="hover:text-alpha transition-colors p-2" aria-label="User">
                                    <User className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
