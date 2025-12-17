import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function HighlightVideo() {
    const videos = [
        {
            id: 1,
            title: "Résumé: Union Sportive Azemmour vs Raja Casablanca",
            duration: "7:45",
            date: "05 Janvier, 2025",
            thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual video URL
        },
        {
            id: 2,
            title: "Entraînement: Préparation pour le prochain match",
            duration: "5:23",
            date: "04 Janvier, 2025",
            thumbnail: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
            id: 3,
            title: "Interview avec le coach après la victoire",
            duration: "12:15",
            date: "03 Janvier, 2025",
            thumbnail: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
            id: 4,
            title: "Académie U17: Match de la semaine",
            duration: "8:30",
            date: "02 Janvier, 2025",
            thumbnail: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000&auto=format&fit=crop",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const itemsPerView = 3;

    const next = () => {
        setCurrentIndex((prev) => (prev + 1 > videos.length - itemsPerView ? 0 : prev + 1));
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev === 0 ? videos.length - itemsPerView : prev - 1));
    };

    const openVideo = (video) => {
        setSelectedVideo(video);
    };

    const closeVideo = () => {
        setSelectedVideo(null);
    };

    return (
        <>
            <div className="py-16 sm:py-20 lg:py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
                         <div>
                            <h4 className="text-alpha font-bold text-xs sm:text-sm uppercase mb-2">Résumés</h4>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic">Vidéo du Jour</h2>
                        </div>
                         <div className="flex gap-2">
                            <button 
                                onClick={prev}
                                className="w-10 h-10 bg-gray-200 hover:bg-alpha hover:text-white flex items-center justify-center transition-colors"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={next}
                                className="w-10 h-10 bg-alpha text-white flex items-center justify-center transition-colors"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6 lg:gap-8"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                        >
                            {videos.map((video) => (
                                <div key={video.id} className="min-w-[calc(100%-16px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-21.33px)] relative group">
                                    <div className="relative h-48 sm:h-56 lg:h-64 bg-black overflow-hidden rounded-lg cursor-pointer" onClick={() => openVideo(video)}>
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                            {video.duration}
                                        </div>
                                    </div>
                                    <div className="mt-3 sm:mt-4">
                                        <p className="text-xs text-gray-500 mb-1">{video.date}</p>
                                        <h3 className="text-base sm:text-lg font-bold uppercase leading-tight hover:text-alpha transition-colors cursor-pointer">
                                            {video.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={closeVideo}>
                    <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={closeVideo}
                            className="absolute -top-12 right-0 text-white hover:text-alpha transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <iframe
                                src={selectedVideo.videoUrl}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h3 className="text-white text-xl font-bold mt-4">{selectedVideo.title}</h3>
                    </div>
                </div>
            )}
        </>
    );
}

