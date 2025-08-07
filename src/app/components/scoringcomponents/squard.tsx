'use client';

import React from 'react';
import { useScoring } from "../ScoringContext";

interface Player {
  id: string;
  name: string;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  teamName?: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface Team {
  name: string;
  score?: number;
  wickets?: number;
  overs?: string;
  players?: Player[];           // <-- make players optional here
  benchPlayers?: Player[];
  supportingStaff?: Staff[];
}

const Index = () => {
  const { match_data } = useScoring();
  const { teamA, teamB } = match_data || ({} as { teamA: Team; teamB: Team });

  const getTeamGradient = (teamName: string) =>
    teamName === 'IND' ? 'bg-gradient-to-br from-blue-700 to-orange-600' : 'bg-gradient-to-br from-green-600 to-yellow-400';

  const getTeamColor = (teamName: string) =>
    teamName === 'IND' ? 'border-l-blue-700' : 'border-l-green-600';

  const initials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

  const PlayerCard = ({ player, teamName }: { player: Player; teamName: string }) => (
    <div className="border-l-4 border-transparent hover:border-indigo-500 hover:shadow-lg transition transform hover:-translate-y-1 rounded-md p-3 bg-white">
      <div className="flex items-center space-x-3">
        <div
          className={`flex items-center justify-center rounded-full text-white font-semibold text-sm sm:text-base md:text-xl w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 ${getTeamGradient(
            teamName
          )}`}
        >
          {initials(player.name)}
        </div>
        <div className="flex-1">
          <h4 className="text-gray-900 font-semibold text-sm sm:text-base">{player.name}</h4>
          <p className="text-gray-600 text-xs sm:text-sm">{player.role}</p>
          <p className="text-gray-500 text-xs">{player.battingStyle || player.bowlingStyle || ''}</p>
        </div>
      </div>
    </div>
  );

  const StaffCard = ({ staff }: { staff: Staff }) => (
    <div className="rounded-md p-3 bg-white hover:shadow-md transition">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-600 to-indigo-500 text-white font-semibold text-xs sm:text-sm">
          {initials(staff.name)}
        </div>
        <div>
          <h4 className="text-gray-900 font-medium text-sm sm:text-base">{staff.name}</h4>
          <p className="text-gray-600 text-xs sm:text-sm">{staff.role}</p>
        </div>
      </div>
    </div>
  );

  const TeamSection = ({ team }: { team: Team }) => (
    <div className="space-y-6">
      {/* Team Header */}
      <div className={`border-l-8 ${getTeamColor(team.name)} bg-white rounded-md shadow-md overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center rounded-full text-white font-bold text-lg sm:text-xl w-12 h-12 sm:w-16 sm:h-16 ${getTeamGradient(
                team.name
              )}`}
            >
              {team.name}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{team.name}</h2>
              <p className="text-xs sm:text-sm text-gray-600">Team Squad</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <div className="bg-gray-100 rounded-full px-3 py-1 text-lg sm:text-xl font-semibold min-w-[60px] sm:min-w-[80px] text-gray-800">
              {team.score}/{team.wickets}
            </div>
            <div className="border border-gray-300 rounded-full px-3 py-1 min-w-[60px] sm:min-w-[80px] text-sm sm:text-base text-gray-700">
              {team.overs} overs
            </div>
          </div>
        </div>
      </div>

      {/* Playing XI */}
      <div className="bg-white rounded-md shadow-md">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <div className="w-3 h-3 rounded-full bg-green-600"></div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Playing XI</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {team?.players?.map((player) => (
            <PlayerCard key={player.id} player={player} teamName={team.name} />
          ))}
        </div>
      </div>

      {/* Bench Players */}
      {team.benchPlayers && team.benchPlayers.length > 0 && (
        <div className="bg-white rounded-md shadow-md">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Bench Players</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.benchPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} teamName={team.name} />
            ))}
          </div>
        </div>
      )}

      {/* Supporting Staff */}
      {team.supportingStaff && team.supportingStaff.length > 0 && (
        <div className="bg-white rounded-md shadow-md">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Supporting Staff</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.supportingStaff.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 overflow-x-hidden">
      <div className="max-w-full sm:max-w-3xl md:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">Cricket Squad</h1>
          <p className="text-base sm:text-lg text-gray-600">Team Lineup & Squad Details</p>
          <div className="mx-auto mt-4 w-20 sm:w-24 h-1 rounded-full bg-gradient-to-r from-green-600 to-indigo-500"></div>
        </header>

        {/* Teams Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <TeamSection team={teamA} />
          <TeamSection team={teamB} />
        </main>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Cricket Squad. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
