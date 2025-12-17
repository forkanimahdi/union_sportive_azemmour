import React from 'react';
import Navbar from './Partials/Navbar';
import Hero from './Partials/Hero';
import MatchSchedule from './Partials/MatchSchedule';
import Categories from './Partials/Categories';
import RecentNews from './Partials/RecentNews';
import Blogs from './Partials/Blogs';
import LeagueTable from './Partials/LeagueTable';
import HighlightVideo from './Partials/HighlightVideo';
import TicketCTA from './Partials/TicketCTA';
import Champions from './Partials/Champions';
import Merchandise from './Partials/Merchandise';
import Footer from './Partials/Footer';

export default function Index() {
    return (
        <div className="font-sans antialiased text-dark bg-white">
            <Navbar />
            <Hero />
            <Categories />
            <MatchSchedule />
            <RecentNews />
            <Blogs />
            <LeagueTable />
            <HighlightVideo />
            <TicketCTA />
            <Champions />
            <Merchandise />
            <Footer />
        </div>
    );
}

