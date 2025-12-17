import React from 'react';
import { Play } from 'lucide-react';

export default function HighlightVideo() {
    return (
        <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                     <div>
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Highlights</h4>
                        <h2 className="text-3xl font-black uppercase italic">Today Highlight Video</h2>
                    </div>
                     <div className="flex gap-2">
                        <button className="w-10 h-10 bg-gray-200 hover:bg-alpha hover:text-white flex items-center justify-center transition-colors">&lt;</button>
                        <button className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors">&gt;</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {[1, 2, 3].map((item) => (
                        <div key={item} className="relative group">
                            <div className="relative h-64 bg-black overflow-hidden rounded-lg">
                                {/* Placeholder Video Thumb */}
                                <img src={`https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop`} alt="Video Thumbnail" className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                    7:45
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-1">05 July, 2024</p>
                                <h3 className="text-lg font-bold uppercase leading-tight hover:text-alpha transition-colors cursor-pointer">
                                    Top Soccer Athletes Competing in Action
                                </h3>
                            </div>
                        </div>
                     ))}
                </div>
            </div>
        </div>
    );
}

