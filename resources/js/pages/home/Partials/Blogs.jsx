import React from 'react';
import { Link } from '@inertiajs/react';
import { Calendar, User, Eye, MessageCircle, ArrowRight } from 'lucide-react';

export default function Blogs() {
    const blogs = [
        {
            id: 1,
            title: "L'histoire de l'Union Sportive Azemmour",
            excerpt: "Découvrez l'histoire riche et passionnante de notre club depuis sa fondation...",
            author: "Ahmed Benali",
            date: "10 Janvier 2025",
            category: "Histoire",
            image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop",
            views: 1245,
            comments: 34
        },
        {
            id: 2,
            title: "Les valeurs du club: Passion, Respect, Excellence",
            excerpt: "Notre club se base sur des valeurs fondamentales qui guident chaque action...",
            author: "Fatima Alami",
            date: "09 Janvier 2025",
            category: "Club",
            image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop",
            views: 892,
            comments: 21
        },
        {
            id: 3,
            title: "Académie: Former les champions de demain",
            excerpt: "Notre académie forme les jeunes talents avec un programme complet...",
            author: "Youssef Idrissi",
            date: "08 Janvier 2025",
            category: "Académie",
            image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000&auto=format&fit=crop",
            views: 1567,
            comments: 45
        },
        {
            id: 4,
            title: "Nutrition et performance: Les secrets de nos athlètes",
            excerpt: "Découvrez comment la nutrition optimale contribue à la performance...",
            author: "Sara Tazi",
            date: "07 Janvier 2025",
            category: "Santé",
            image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop",
            views: 678,
            comments: 18
        }
    ];

    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Blog</h4>
                        <h2 className="text-3xl font-black uppercase italic">Barça Stories</h2>
                    </div>
                    <Link href="#" className="text-alpha font-bold uppercase text-sm hover:underline flex items-center gap-2">
                        Voir tout <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {blogs.map((blog) => (
                        <article key={blog.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden h-48 mb-4 rounded-lg">
                                <img 
                                    src={blog.image} 
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-alpha text-white text-xs font-bold px-3 py-1 uppercase">
                                    {blog.category}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-alpha" />
                                        <span>{blog.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3 h-3 text-alpha" />
                                        <span>{blog.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3 text-alpha" />
                                        <span>{blog.comments}</span>
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-bold uppercase italic leading-tight group-hover:text-alpha transition-colors">
                                    {blog.title}
                                </h3>
                                
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {blog.excerpt}
                                </p>
                                
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <User className="w-3 h-3 text-alpha" />
                                        <span>{blog.author}</span>
                                    </div>
                                    <Link href="#" className="text-alpha font-bold text-xs uppercase hover:underline flex items-center gap-1">
                                        Lire <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}

