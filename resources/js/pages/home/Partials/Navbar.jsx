import React from 'react';
import { Link } from '@inertiajs/react';
import { Search, ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="absolute top-0 left-0 w-full z-50 text-white border-b border-white/10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {/* Logo Placeholder */}
                    <div className="w-10 h-10 bg-alpha rounded-full flex items-center justify-center font-bold text-lg">
                        US
                    </div>
                    <span className="font-bold text-xl uppercase tracking-wider">Union Sportive</span>
                </div>
                
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide uppercase">
                    <Link href="/" className="hover:text-alpha transition-colors">Home</Link>
                    <Link href="#" className="hover:text-alpha transition-colors">About Us</Link>
                    <Link href="#" className="hover:text-alpha transition-colors">Pages</Link>
                    <Link href="#" className="hover:text-alpha transition-colors">Products</Link>
                    <Link href="#" className="hover:text-alpha transition-colors">Blog</Link>
                    <Link href="#" className="hover:text-alpha transition-colors">Contacts</Link>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="hover:text-alpha transition-colors"><Search className="w-5 h-5" /></button>
                    <button className="hover:text-alpha transition-colors"><ShoppingCart className="w-5 h-5" /></button>
                    <button className="hover:text-alpha transition-colors"><User className="w-5 h-5" /></button>
                </div>
            </div>
        </nav>
    );
}

