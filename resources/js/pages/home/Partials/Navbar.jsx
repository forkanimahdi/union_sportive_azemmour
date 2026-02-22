import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Navbar({ variant = 'dark' }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
