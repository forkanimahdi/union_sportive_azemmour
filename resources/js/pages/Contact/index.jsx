import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Adresse',
            details: ['Stade Municipal Azemmour', 'Azemmour, Maroc'],
        },
        {
            icon: Phone,
            title: 'Téléphone',
            details: ['+212 5XX XXX XXX'],
        },
        {
            icon: Mail,
            title: 'Email',
            details: ['contact@tihadazemmourwomen.ma'],
        },
        {
            icon: Clock,
            title: 'Horaires',
            details: ['Lun - Ven : 9h - 18h', 'Sam : 9h - 13h'],
        },
    ];

    return (
        <div className="font-sans antialiased text-dark bg-white">
            <Head title="Contact — USA Azemmour" />
            <Navbar />

            {/* Hero */}
            <header className="relative min-h-[45vh] overflow-hidden pt-24 lg:pt-28">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/assets/images/banner/banner-1.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/60 to-alpha/40" />
                <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20 max-w-7xl">
                    <span className="inline-block text-white/80 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                        Contact
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic text-white max-w-3xl">
                        Restons en <span className="text-alpha">Contact</span>
                    </h1>
                    <p className="text-white/90 mt-4 text-lg max-w-xl">
                        Une question, un partenariat ou une demande d&apos;information ? Écrivez-nous.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </header>

            <main className="relative -mt-8 z-10">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Contact info cards */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-alpha" />
                                <span className="text-alpha font-bold text-xs uppercase tracking-widest">
                                    Coordonnées
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic text-dark mb-8">
                                Nos informations
                            </h2>
                            <div className="space-y-4">
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-alpha/20 transition-all flex gap-4"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-alpha/10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-alpha" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold uppercase text-dark text-sm mb-1">
                                                    {info.title}
                                                </h3>
                                                {info.details.map((detail, i) => (
                                                    <p key={i} className="text-gray-600 text-sm">
                                                        {detail}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Map */}
                            <div className="mt-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-[4/3] min-h-[220px]">
                                <iframe
                                    title="Carte Azemmour"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.123456789!2d-8.3456789!3d33.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDA3JzI0LjQiTiA4wrAyMCc0NC40Ilc!5e0!3m2!1sfr!2sma!4v1234567890123!5m2!1sfr!2sma"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full min-h-[220px]"
                                />
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-8">
                            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-px bg-alpha" />
                                    <span className="text-alpha font-bold text-xs uppercase tracking-widest">
                                        Message
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase italic text-dark mb-8">
                                    Envoyez-nous un message
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-bold uppercase text-dark mb-2"
                                            >
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alpha/30 focus:border-alpha transition-colors"
                                                placeholder="Votre nom"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-bold uppercase text-dark mb-2"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alpha/30 focus:border-alpha transition-colors"
                                                placeholder="votre@email.ma"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-bold uppercase text-dark mb-2"
                                        >
                                            Sujet
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alpha/30 focus:border-alpha transition-colors"
                                            placeholder="Objet de votre message"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-bold uppercase text-dark mb-2"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alpha/30 focus:border-alpha transition-colors resize-none"
                                            placeholder="Votre message..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto min-w-[200px] bg-alpha hover:bg-red-700 text-white px-8 py-4 rounded-xl uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2"
                                    >
                                        Envoyer <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
