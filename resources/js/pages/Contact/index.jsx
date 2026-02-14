import React, { useState } from 'react';
import Navbar from '../home/partials/navbar';
import Footer from '../home/partials/footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Adresse',
            details: ['Stade Municipal Azemmour', 'Azemmour, Maroc']
        },
        {
            icon: Phone,
            title: 'Téléphone',
            details: ['+212 5XX XXX XXX', '+212 5XX XXX XXX']
        },
        {
            icon: Mail,
            title: 'Email',
            details: ['contact@usazemmour.ma', 'info@usazemmour.ma']
        },
        {
            icon: Clock,
            title: 'Horaires',
            details: ['Lun - Ven: 9h - 18h', 'Sam: 9h - 13h']
        }
    ];

    return (
        <div className="font-sans antialiased text-dark bg-white">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative min-h-[50vh] bg-alpha overflow-hidden pt-24 lg:pt-28">
                <div className="absolute inset-0 bg-alpha/90" />
                <div className="relative z-20 h-full container mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 max-w-7xl flex flex-col justify-center items-center text-center text-white">
                    <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-3 sm:mb-4 tracking-wider">Contact</h4>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase italic leading-tight px-4">
                        Restons en <span className="text-alpha">Contact</span>
                    </h1>
                </div>
            </div>

            {/* Contact Content */}
            <div className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12l">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <h4 className="text-alpha font-bold text-sm uppercase mb-2">Informations</h4>
                            <h2 className="text-3xl font-black uppercase italic mb-8">Nos Coordonnées</h2>
                            
                            <div className="space-y-6">
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon;
                                    return (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-alpha/10 rounded-lg flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-alpha" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold uppercase mb-1">{info.title}</h3>
                                                {info.details.map((detail, i) => (
                                                    <p key={i} className="text-sm text-gray-600">{detail}</p>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-8 h-64 bg-gray-100 rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.123456789!2d-8.3456789!3d33.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDA3JzI0LjQiTiA4wrAyMCc0NC40Ilc!5e0!3m2!1sen!2sma!4v1234567890123!5m2!1sen!2sma"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <h4 className="text-alpha font-bold text-sm uppercase mb-2">Message</h4>
                            <h2 className="text-3xl font-black uppercase italic mb-8">Envoyez-nous un Message</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold uppercase mb-2">
                                            Nom Complet
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-alpha transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold uppercase mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-alpha transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-bold uppercase mb-2">
                                        Sujet
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-alpha transition-colors"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold uppercase mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-alpha transition-colors resize-none"
                                        required
                                    ></textarea>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full bg-alpha hover:bg-red-700 text-white px-8 py-4 uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2"
                                >
                                    Envoyer <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

