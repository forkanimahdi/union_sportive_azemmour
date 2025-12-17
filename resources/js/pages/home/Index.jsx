import React from 'react';
import Navbar from './Partials/Navbar';
import Hero from './Partials/Hero';
import MatchSchedule from './Partials/MatchSchedule';
import RecentNews from './Partials/RecentNews';
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
            <MatchSchedule />
            <RecentNews />
            <LeagueTable />
            <HighlightVideo />
            <TicketCTA />
            <Champions />
            <Merchandise />
            <Footer />
        </div>
    );
}

