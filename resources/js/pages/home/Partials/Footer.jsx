import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-dark text-white pt-20 border-t-4 border-alpha">
            {/* Newsletter Section */}
            <div className="container mx-auto px-4 mb-20">
                <div className="bg-[url('https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-2xl p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-dark/80"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase italic mb-2">Subscribe to our newsletter</h2>
                            <p className="text-gray-400">Stay updated with the latest news and special offers.</p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <input type="email" placeholder="Your Email Address" className="bg-white/10 border border-white/20 px-6 py-4 rounded-full w-full md:w-80 text-white placeholder:text-gray-400 focus:outline-none focus:border-alpha" />
                            <button className="bg-alpha hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold uppercase transition-colors flex items-center gap-2">
                                Subscribe <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="container mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-alpha rounded-full flex items-center justify-center font-bold text-lg">US</div>
                            <span className="font-bold text-xl uppercase tracking-wider">Union Sportive</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Union Sportive Azemmour is a professional soccer club committed to excellence, community, and the beautiful game.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-alpha transition-colors"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-alpha transition-colors"><Twitter className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-alpha transition-colors"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-alpha transition-colors"><Linkedin className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-alpha transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Matches</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6">Information</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-alpha transition-colors">Shop</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-alpha transition-colors">Sitemap</a></li>
                        </ul>
                    </div>

                    {/* Instagram Feed (Placeholder) */}
                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6">@Instagram</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-square bg-gray-800 rounded hover:opacity-80 cursor-pointer">
                                    <img src={`https://picsum.photos/seed/${i + 50}/200`} alt="Insta" className="w-full h-full object-cover rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Union Sportive Azemmour. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}

