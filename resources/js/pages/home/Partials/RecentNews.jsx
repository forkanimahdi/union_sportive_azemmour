import React from 'react';
import { Calendar, User } from 'lucide-react';

export default function RecentNews() {
    const news = [
        {
            id: 1,
            title: "Breaking Boundaries: Soccer's Impact on Social Change",
            author: "Emma Rose",
            comments: 2,
            image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop",
            date: "05 July 2024"
        },
        {
            id: 2,
            title: "Navigating Soccer's Digital Realm: Online Fanatics Unite",
            author: "Mark David",
            comments: 0,
            image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop",
            date: "06 July 2024"
        },
        {
            id: 3,
            title: "Kickstarting Your Soccer Journey: Beginner's Guidebook",
            author: "Anna Smith",
            comments: 5,
            image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000&auto=format&fit=crop",
            date: "07 July 2024"
        }
    ];

    return (
        <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                     <div>
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Our Blog</h4>
                        <h2 className="text-3xl font-black uppercase italic">Our Recent News</h2>
                    </div>
                     <div className="flex gap-2">
                        <button className="w-10 h-10 bg-gray-200 hover:bg-alpha hover:text-white flex items-center justify-center transition-colors">&lt;</button>
                        <button className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors">&gt;</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <div key={item.id} className="bg-white group hover:shadow-2xl transition-all duration-300">
                            <div className="relative overflow-hidden h-60">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute top-4 left-4 bg-alpha text-white text-xs font-bold px-3 py-1 uppercase">
                                    Football
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-xs text-gray-500 mb-2">{item.date}</div>
                                <h3 className="text-xl font-bold uppercase italic leading-tight mb-4 hover:text-alpha transition-colors cursor-pointer">
                                    {item.title}
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 space-x-4 border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3 text-alpha" />
                                        <span>By {item.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-alpha" />
                                        <span>{item.comments} Comments</span>
                                    </div>
                                </div>
                                <button className="mt-6 bg-dark text-white text-xs font-bold px-6 py-3 uppercase tracking-wider group-hover:bg-alpha transition-colors">
                                    Read More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

