import React, { useState } from 'react';
import { FaUser, FaCamera, FaEdit, FaTrash, FaSave, FaTimes ,FaPlus} from 'react-icons/fa';
import { uploadImageToCloudinary } from '../utility/fetchImage';
import Image from 'next/image';

interface Player {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  isCaptain?: boolean;
  teamName: string;
}

const roles = [
  'Batsman',
  'Bowler',
  'All-Rounder',
  'Wicketkeeper',
  'Coach',
  'Physio',
  'Manager',
  'Support',
];

interface MatchTeam {
  name: string;
  benchPlayers?: Player[];
}

interface MatchData {
  teamA: MatchTeam;
  teamB: MatchTeam;
}

interface BenchplayerProps {
  matchData: MatchData;
  updateMatchData: (updatedData: MatchData) => Promise<void>;
}


export default function Benchplayer({ matchData, updateMatchData }: BenchplayerProps) {
  // Add Bench Player States
  const [benchPlayerName, setBenchPlayerName] = useState('');
  const [benchPlayerRole, setBenchPlayerRole] = useState(roles[0]);
  const [benchPlayerImageFile, setBenchPlayerImageFile] = useState<File | null>(null);
  const [benchSelectedTeamName, setBenchSelectedTeamName] = useState(matchData.teamA.name);

  // Edit Bench Player States
  const [benchPlayersEditingId, setBenchPlayersEditingId] = useState<string | null>(null);
  const [benchEditName, setBenchEditName] = useState('');
  const [benchEditRole, setBenchEditRole] = useState(roles[0]);
  const [benchEditImageFile, setBenchEditImageFile] = useState<File | null>(null);
  const [benchEditTeamName, setBenchEditTeamName] = useState('');


  // Render player image or placeholder with styling
  const renderImage = (url?: string, alt?: string) =>
    url ? (
      <Image
            src={url}
            alt={alt ?? ''}
            width={56} // corresponds to w-14 in Tailwind (14*4px)
            height={56}
            className="rounded-full object-cover border-3 border-white shadow-lg"
          />
    ) : (
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 border-4 border-white shadow-lg">
        <FaUser size={20} />
      </div>
    );

  // Add a new bench player
  const addBenchPlayer = async () => {
    if (!benchPlayerName.trim()) {
      alert('Please enter bench player name');
      return;
    }
    if (!benchSelectedTeamName) {
      alert('Please select a team for bench player');
      return;
    }
    const benchPlayerImage = benchPlayerImageFile ? await uploadImageToCloudinary(benchPlayerImageFile) : '';

    if (!matchData) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: benchPlayerName.trim(),
      role: benchPlayerRole,
      imageUrl: benchPlayerImage || '', // replace with upload logic if needed
      teamName: benchSelectedTeamName,
    };

    const updatedTeamABench =
      benchSelectedTeamName === matchData.teamA.name
        ? [...(matchData.teamA.benchPlayers ?? []), newPlayer]
        : matchData.teamA.benchPlayers ?? [];

    const updatedTeamBBench =
      benchSelectedTeamName === matchData.teamB.name
        ? [...(matchData.teamB.benchPlayers ?? []), newPlayer]
        : matchData.teamB.benchPlayers ?? [];

    await updateMatchData({
      teamA: {
        ...matchData.teamA,
        benchPlayers: updatedTeamABench,
      },
      teamB: {
        ...matchData.teamB,
        benchPlayers: updatedTeamBBench,
      },
    });

    setBenchPlayerName('');
    setBenchPlayerRole(roles[0]);
    setBenchPlayerImageFile(null);
  };

  // Start editing a bench player
  const startEditingBenchPlayer = (player: Player) => {
    setBenchPlayersEditingId(player.id);
    setBenchEditName(player.name);
    setBenchEditRole(player.role);
    setBenchEditTeamName(player.teamName);
    setBenchEditImageFile(null);
  };

  // Cancel editing
  const cancelEditingBenchPlayer = () => {
    setBenchPlayersEditingId(null);
    setBenchEditName('');
    setBenchEditRole(roles[0]);
    setBenchEditTeamName('');
    setBenchEditImageFile(null);
  };

  // Save edited bench player
  const saveEditBenchPlayer = async () => {
    if (!benchEditName.trim() || !benchPlayersEditingId || !matchData || !benchEditTeamName) {
      alert('Invalid bench player edit data');
      return;
    }

    const teamIsA = benchEditTeamName === matchData.teamA.name;
    const currentPlayers = teamIsA ? matchData.teamA.benchPlayers ?? [] : matchData.teamB.benchPlayers ?? [];

      const benchPlayerImage = benchEditImageFile ? await uploadImageToCloudinary(benchEditImageFile) : '';
    const updatedPlayers = currentPlayers.map((p) =>
      p.id === benchPlayersEditingId
        ? {
            ...p,
            name: benchEditName.trim(),
            role: benchEditRole,
            imageUrl: benchPlayerImage ? '' : p.imageUrl, // add image upload logic if needed
            teamName: benchEditTeamName,
          }
        : p
    );

    const updatedTeamA = teamIsA ? updatedPlayers : matchData.teamA.benchPlayers ?? [];
    const updatedTeamB = !teamIsA ? updatedPlayers : matchData.teamB.benchPlayers ?? [];

    await updateMatchData({
      teamA: { ...matchData.teamA, benchPlayers: updatedTeamA },
      teamB: { ...matchData.teamB, benchPlayers: updatedTeamB },
    });

    cancelEditingBenchPlayer();
  };

  // Delete bench player
  const deleteBenchPlayer = async (playerId: string) => {
    if (!matchData) return;
    if (!confirm('Are you sure you want to delete this bench player?')) return;

    const isInTeamA = (matchData.teamA.benchPlayers ?? []).some((p) => p.id === playerId);
    const updatedTeamABench = isInTeamA
      ? (matchData.teamA.benchPlayers ?? []).filter((p) => p.id !== playerId)
      : matchData.teamA.benchPlayers ?? [];

    const updatedTeamBBench = !isInTeamA
      ? (matchData.teamB.benchPlayers ?? []).filter((p) => p.id !== playerId)
      : matchData.teamB.benchPlayers ?? [];

    await updateMatchData({
      teamA: { ...matchData.teamA, benchPlayers: updatedTeamABench },
      teamB: { ...matchData.teamB, benchPlayers: updatedTeamBBench },
    });
  };

  return (
    <>
      {/* Add Bench Player Form */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-2xl border border-green-200 mb-8">
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-6 text-center text-green-700">Add Bench Player</h2>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-6 items-end">
          <input
            type="text"
            placeholder="Bench Player Name"
            value={benchPlayerName}
            onChange={(e) => setBenchPlayerName(e.target.value)}
            className="border-2 border-gray-300 rounded-xl p-3 md:col-span-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
          />
          <select
            value={benchSelectedTeamName}
            onChange={(e) => setBenchSelectedTeamName(e.target.value)}
            className="border-2 border-gray-300 rounded-xl p-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
          >
            <option value={matchData.teamA.name}>{matchData.teamA.name}</option>
            <option value={matchData.teamB.name}>{matchData.teamB.name}</option>
          </select>
          <select
            value={benchPlayerRole}
            onChange={(e) => setBenchPlayerRole(e.target.value)}
            className="border-2 border-gray-300 rounded-xl p-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
          >
            {roles
              .filter((r) => !['Coach', 'Physio', 'Manager', 'Support'].includes(r))
              .map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
          </select>
          <div className="relative md:col-span-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBenchPlayerImageFile(e.target.files?.[0] ?? null)}
              className="border-2 border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
            />
            <FaCamera className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={addBenchPlayer}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl p-3 md:col-span-full md:col-start-8 transition transform hover:scale-105 shadow-lg font-semibold flex justify-center items-center"
          >
            <FaPlus className="mr-2" /> 
            Add
          </button>
        </div>
      </section>
      </div>

 
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
    {[matchData.teamA, matchData.teamB].map((team, index) => (
    <div key={index} className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-green-200">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          {/* Optional colored dot per team */}
          <div className={`w-4 h-4 rounded-full mr-3 ${index === 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
          {team.name} Bench Players
          <span className="ml-auto text-sm bg-gray-100 px-3 py-1 rounded-full">{team.benchPlayers?.length || 0}</span>
        </h3>

        {(!team.benchPlayers || team.benchPlayers.length === 0) ? (
          <p className="text-gray-500 italic">No bench players added.</p>
        ) : (
          <ul className="space-y-4">
            {team.benchPlayers.map((player) => (
              <li
                key={player.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  {/* Use your existing renderImage function */}
                  {renderImage(player.imageUrl, player.name)}

                  {/* Editable name or static */}
                  {benchPlayersEditingId === player.id ? (
                    <input
                      type="text"
                      value={benchEditName}
                      onChange={(e) => setBenchEditName(e.target.value)}
                      className="border-2 border-gray-300 rounded-lg p-2 flex-grow min-w-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
                    />
                  ) : (
                    <span className="truncate font-semibold text-gray-800 md:flex md:flex-col">
                      {player.name}
                      <span className="text-gray-600">— {player.role}</span>
                    </span>
                  )}
                </div>

                {/* Edit mode controls or view buttons */}
                {benchPlayersEditingId === player.id ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={benchEditRole}
                      onChange={(e) => setBenchEditRole(e.target.value)}
                      className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition"
                    >
                      {roles
                        .filter((r) => !['Coach', 'Physio', 'Manager', 'Support'].includes(r))
                        .map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                    </select>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBenchEditImageFile(e.target.files ? e.target.files[0] : null)}
                      className="border-2 border-gray-300 rounded-lg p-2"
                    />
                    <button
                      onClick={saveEditBenchPlayer}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={cancelEditingBenchPlayer}
                      className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-4 py-2 transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditingBenchPlayer(player)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg p-2 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteBenchPlayer(player.id)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>



   </>
  );
}
