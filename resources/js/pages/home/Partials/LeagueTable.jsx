import React from 'react';

export default function LeagueTable() {
    const tableData = [
        { pos: 1, team: 'Arsenal F.C.', p: 10, w: 7, d: 2, l: 1, pts: 23 },
        { pos: 2, team: 'Aston Villa F.C.', p: 10, w: 6, d: 1, l: 3, pts: 19 },
        { pos: 3, team: 'A.F.C. Bournemouth', p: 10, w: 5, d: 4, l: 1, pts: 19 },
        { pos: 4, team: 'Brentford F.C.', p: 10, w: 5, d: 2, l: 3, pts: 17 },
        { pos: 5, team: 'Brighton & Hove Albion', p: 10, w: 4, d: 3, l: 3, pts: 15 },
    ];

    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Trophy Column */}
                    <div className="lg:col-span-1">
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Trophy</h4>
                        <h2 className="text-3xl font-black uppercase italic mb-8">Winner Trophy</h2>
                        <div className="relative h-[400px] w-full bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                             {/* Placeholder for Trophy Image */}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                             <div className="text-9xl text-gray-300">🏆</div>
                        </div>
                    </div>

                    {/* Table Column */}
                    <div className="lg:col-span-2">
                        <h4 className="text-alpha font-bold text-sm uppercase mb-2">Points Table</h4>
                        <h2 className="text-3xl font-black uppercase italic mb-8">National League Point Table</h2>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-alpha text-white uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">Team Name</th>
                                        <th className="px-6 py-4">P</th>
                                        <th className="px-6 py-4">W</th>
                                        <th className="px-6 py-4">D</th>
                                        <th className="px-6 py-4">L</th>
                                        <th className="px-6 py-4">PTS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-alpha">0{row.pos}</td>
                                            <td className="px-6 py-4 font-bold flex items-center gap-3">
                                                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                                {row.team}
                                            </td>
                                            <td className="px-6 py-4">{row.p}</td>
                                            <td className="px-6 py-4">{row.w}</td>
                                            <td className="px-6 py-4">{row.d}</td>
                                            <td className="px-6 py-4">{row.l}</td>
                                            <td className="px-6 py-4 font-bold text-dark">{row.pts}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

