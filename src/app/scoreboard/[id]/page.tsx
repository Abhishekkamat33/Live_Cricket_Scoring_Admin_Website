// /app/scoreboard/page.tsx
'use client';
import React from 'react';

export default function ScorePage() {
  // 🧾 Dummy summary
  const summary = {
    teams: 'India vs England',
    score: '320/7',
    overs: '75.3',
  };

  // 🏏 Dummy detailed data
  const scorecard = {
    batting: [
      { name: 'Rohit Sharma', runs: 80, balls: 123, fours: 8, sixes: 2, dismissal: 'c Anderson' },
      { name: 'Virat Kohli', runs: 45, balls: 67, fours: 4, sixes: 1, dismissal: 'b Broad' },
      { name: 'KL Rahul', runs: 20, balls: 30, fours: 2, sixes: 0, dismissal: 'lbw Anderson' },
      { name: 'Shreyas Iyer', runs: 15, balls: 22, fours: 1, sixes: 0, dismissal: 'c Root' },
      { name: 'All-Rounder', runs: 10, balls: 15, fours: 1, sixes: 0, dismissal: 'b Woakes' },
      { name: 'No.6 Batsman', runs: 30, balls: 40, fours: 3, sixes: 1, dismissal: null }, // currently batting
    ],
    bowling: [
      { name: 'James Anderson', overs: 17.0, maidens: 4, runs: 60, wickets: 2, economy: 3.53 },
      { name: 'Stuart Broad', overs: 15.0, maidens: 2, runs: 80, wickets: 1, economy: 5.33 },
      { name: 'Chris Woakes', overs: 13.3, maidens: 1, runs: 55, wickets: 1, economy: 4.09 },
      { name: 'Ben Stokes', overs: 12.0, maidens: 0, runs: 75, wickets: 0, economy: 6.25 },
      { name: 'Sam Curran', overs: 14.0, maidens: 1, runs: 50, wickets: 2, economy: 3.57 },
    ],
    fallOfWickets: [
      { score: 100, over: '20.4', batsman: 'Virat Kohli' },
      { score: 150, over: '30.2', batsman: 'KL Rahul' },
      { score: 200, over: '45.6', batsman: 'Shreyas Iyer' },
      { score: 250, over: '60.4', batsman: 'All-Rounder' },
      { score: 300, over: '70.3', batsman: 'No.6 Batsman' },
    ],
    extras: { wides: 5, noBalls: 1, byes: 3, legByes: 2, total: 11 },
    partnership: { runs: 50, balls: 75 },
    currentBowler: { name: 'Chris Woakes', overs: '4.0', runs: 20, wickets: 1 },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Live Summary */}
      <div className="bg-green-600 text-white p-4 rounded shadow mb-4 flex justify-between items-center">
        <span className="font-bold">{summary.teams}</span>
        <span className="text-lg">{summary.score} ({summary.overs} ov)</span>
        <span className="italic">Live</span>
      </div>

      {/* Scorecard */}
      <div className="bg-white rounded shadow p-4 space-y-6">
        <h2 className="text-xl font-semibold">Batting</h2>
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-2 py-1">Batsman</th>
              <th className="px-2 py-1">R</th>
              <th className="px-2 py-1">B</th>
              <th className="px-2 py-1">4s</th>
              <th className="px-2 py-1">6s</th>
              <th className="px-2 py-1">Dismissal</th>
            </tr>
          </thead>
          <tbody>
            {scorecard.batting.map((b) => (
              <tr key={b.name} className="border-b">
                <td className="px-2 py-1">{b.name}</td>
                <td className="px-2 py-1">{b.runs}</td>
                <td className="px-2 py-1">{b.balls}</td>
                <td className="px-2 py-1">{b.fours}</td>
                <td className="px-2 py-1">{b.sixes}</td>
                <td className="px-2 py-1">{b.dismissal || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-semibold">Bowling</h2>
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-200">
            <tr>
              <th>Name</th><th>O</th><th>M</th><th>R</th><th>W</th><th>Econ</th>
            </tr>
          </thead>
          <tbody>
            {scorecard.bowling.map((b) => (
              <tr key={b.name} className="border-b">
                <td className="px-2 py-1">{b.name}</td>
                <td className="px-2 py-1">{b.overs}</td>
                <td className="px-2 py-1">{b.maidens}</td>
                <td className="px-2 py-1">{b.runs}</td>
                <td className="px-2 py-1">{b.wickets}</td>
                <td className="px-2 py-1">{b.economy.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Extras */}
          <div className="bg-white p-6 rounded-lg shadow border border-yellow-200">
            <h3 className="font-semibold text-lg mb-4 text-yellow-800">Extras</h3>
            <ul className="space-y-1">
              <li>Wides: {scorecard.extras.wides}</li>
              <li>No Balls: {scorecard.extras.noBalls}</li>
              <li>Byes: {scorecard.extras.byes}</li>
              <li>Leg Byes: {scorecard.extras.legByes}</li>
              <li><strong>Total Extras: {scorecard.extras.total}</strong></li>
            </ul>
          </div>

          {/* Partnership */}
          <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
            <h3 className="font-semibold text-lg mb-4 text-blue-800">Partnership</h3>
            <div className="space-y-1">
              <div>Runs: <strong>{scorecard.partnership.runs}</strong></div>
              <div>Balls: {scorecard.partnership.balls}</div>
            </div>
          </div>

          {/* Current Bowler */}
          <div className="bg-white p-6 rounded-lg shadow border border-purple-200">
            <h3 className="font-semibold text-lg mb-4 text-purple-800">Current Bowler</h3>
            <div className="space-y-1">
              <div>{scorecard.currentBowler.name}</div>
              <div>Figures: {scorecard.currentBowler.overs} – {scorecard.currentBowler.runs} – {scorecard.currentBowler.wickets}</div>
              <div>Economy: {(scorecard.currentBowler.runs / parseFloat(scorecard.currentBowler.overs)).toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Fall of Wickets */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow border border-red-200">
          <h3 className="font-semibold text-lg mb-4 text-red-800">Fall of Wickets</h3>
          <ul className="list-disc list-inside space-y-1">
            {scorecard.fallOfWickets.map((f, idx) => (
              <li key={idx}>{f.score} – {f.batsman} ({f.over})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
