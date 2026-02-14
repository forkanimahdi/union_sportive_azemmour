import React from 'react';
import Navbar from './partials/navbar';
import Hero from './partials/hero';
import MatchSchedule from './partials/matchschedule';
import SeniorSquad from './partials/seniorsquad';
import Sponsors from './partials/sponsors';
import Categories from './partials/categories';
import RecentNews from './partials/recentnews';
import Blogs from './partials/blogs';
import LeagueTable from './partials/leaguetable';
import HighlightVideo from './partials/highlightvideo';
import TicketCTA from './partials/ticketcta';
import Champions from './partials/champions';
import Merchandise from './partials/merchandise';
import Footer from './partials/footer';

export default function Index({ matches = [], players = [], articles = [], sponsors = [], activeSeason = null }) {
    return (
        <div className="font-sans antialiased text-dark bg-white">
            <Navbar />
            <Hero />
            <Categories />
            <MatchSchedule matches={matches} activeSeason={activeSeason} />
            <RecentNews articles={articles} />
            {/* <Blogs /> */}
            <LeagueTable />
            <HighlightVideo />
            <TicketCTA />
            {/* <Champions /> */}
            <SeniorSquad players={players} activeSeason={activeSeason} />
            <Sponsors sponsors={sponsors} />
            <Merchandise />
            <Footer />
        </div>
    );
}

