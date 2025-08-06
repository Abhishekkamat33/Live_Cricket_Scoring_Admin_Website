'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/firebaseConfig';
import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import Benchplayer from '@/app/playerComponents/Benchplayer';
import SupportStaff from '../../playerComponents/SupportStaff';
import { FaUser, FaCrown, FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaCamera, FaPlusCircle} from 'react-icons/fa';
import { uploadImageToCloudinary } from '@/app/utility/fetchImage';
import Image from 'next/image';

interface Player {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  isCaptain?: boolean;
  teamName: string;
}

interface SupportingStaff {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  teamName: string;
}

interface Team {
  name: string;
  players: Player[];
  overs: number;
  wickets: number;
  score: number;
  benchPlayers?: Player[];
  extraPlayers?: Player[];
  supportingStaff?: SupportingStaff[];
}

interface MatchData {
  teamA: Team;
  teamB: Team;
  benchPlayers?: Player[];
  extraPlayers?: Player[];
  supportingStaff?: SupportingStaff[];
}

const roles = ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper', 'Coach', 'Physio', 'Manager', 'Support'];

interface ManagePlayersProps {
  matchId?: string;
}

export default function ManagePlayers({ matchId: propMatchId }: ManagePlayersProps) {
  const { id } = useParams();
  const router = useRouter();
  const matchId = propMatchId ?? (id as string);


   useEffect(() => {
      async function verifySession() {
        const response = await fetch('/api/protected');
        if (response.status === 401) {
          alert('You are not authorized. Contact with admin.');
          // If unauthorized => redirect to login page
          router.push('/login');
        } else {
          // If authorized, you can load or show data as needed
          const data = await response.json();
       
        
        }
      }
  
      verifySession();
    }, [matchId]);
  
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null);

  // Main Player States
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState(roles[0]);
  const [playerImageFile, setPlayerImageFile] = useState<File | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState('');
  const [isCaptainNewPlayer, setIsCaptainNewPlayer] = useState(false);


  // Editing States
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingTeamName, setEditingTeamName] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState(roles[0]);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [isCaptainEditPlayer, setIsCaptainEditPlayer] = useState(false);

  // CSS variables for cricket green
  const cricketGreenStyle = {
    '--cricket-green': '120 60% 25%'
  } as React.CSSProperties;

  // Fetch match data
  useEffect(() => {
    if (!matchId) return;

    const fetchMatch = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'matches', matchId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as MatchData;
          setMatchData(data);
          setSelectedTeamName(data.teamA.name);
        } else {
          alert('Match not found!');
          setMatchData(null);
        }
      } catch {
        alert('Failed to load match data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  // Update Firestore match data
  const updateMatchData = async (updatedData: Partial<MatchData>) => {
    if (!matchId) return;
  

    try {
      const docRef = doc(db, 'matches', matchId);

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Match document does not exist');
      const currentData = docSnap.data() as MatchData;

      const updatePayload: Partial<MatchData> = {};

      const splitByTeam = <T extends { teamName?: string }>(arr: T[]) => {
        const teamAItems = arr.filter((item) => item.teamName === currentData.teamA.name);
        const teamBItems = arr.filter((item) => item.teamName === currentData.teamB.name);
        return { teamAItems, teamBItems };
      };

      if (updatedData.benchPlayers) {
        const { teamAItems, teamBItems } = splitByTeam(updatedData.benchPlayers);

        updatePayload.teamA = {
          ...(updatePayload.teamA ?? currentData.teamA),
          benchPlayers: [
            ...(currentData.teamA.benchPlayers ?? []),
            ...teamAItems,
          ],
        };
        updatePayload.teamB = {
          ...(updatePayload.teamB ?? currentData.teamB),
          benchPlayers: [
            ...(currentData.teamB.benchPlayers ?? []),
            ...teamBItems,
          ],
        };
      }

      if (updatedData.supportingStaff) {
        const { teamAItems, teamBItems } = splitByTeam(updatedData.supportingStaff);

        updatePayload.teamA = {
          ...(updatePayload.teamA ?? currentData.teamA),
          supportingStaff: [
            ...(currentData.teamA.supportingStaff ?? []),
            ...teamAItems,
          ],
        };
        updatePayload.teamB = {
          ...(updatePayload.teamB ?? currentData.teamB),
          supportingStaff: [
            ...(currentData.teamB.supportingStaff ?? []),
            ...teamBItems,
          ],
        };
      }

      const otherKeys = Object.keys(updatedData).filter(
        (key) => key !== 'extraPlayers' && key !== 'benchPlayers' && key !== 'supportingStaff'
      );

      otherKeys.forEach((key) => {
        updatePayload[key as keyof MatchData] = updatedData[key as keyof MatchData] as any;
      });

      await updateDoc(docRef, updatePayload);
      setMatchData((prev) => prev ? { ...prev, ...updatePayload } : prev);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update match data.');
    }
  };

  const unsetCurrentCaptain = (players: Player[]): Player[] => {
    return players.map((p) => (p.isCaptain ? { ...p, isCaptain: false } : p));
  };

  const addPlayer = async () => {
    if (!playerName.trim()) {
      alert('Please enter player name');
      return;
    }
    if (!selectedTeamName) {
      alert('Please select a team');
      return;
    }
    if (!matchData) return;

    const playerId = crypto.randomUUID();

    const ImageFile = playerImageFile ? await uploadImageToCloudinary(playerImageFile) : '';
   

    const newPlayer: Player = {
      id: playerId,
      name: playerName.trim(),
      role: playerRole,
      imageUrl: ImageFile || '',
      isCaptain: isCaptainNewPlayer,
      teamName: selectedTeamName,
    };

    if (selectedTeamName === matchData.teamA.name) {
      let updatedPlayers = matchData.teamA.players ?? [];

      if (isCaptainNewPlayer) {
        updatedPlayers = unsetCurrentCaptain(updatedPlayers);
      }

      updatedPlayers = [...updatedPlayers, newPlayer];
      await updateMatchData({ teamA: { ...matchData.teamA, players: updatedPlayers } });
    } else if (selectedTeamName === matchData.teamB.name) {
      let updatedPlayers = matchData.teamB.players ?? [];

      if (isCaptainNewPlayer) {
        updatedPlayers = unsetCurrentCaptain(updatedPlayers);
      }

      updatedPlayers = [...updatedPlayers, newPlayer];
      await updateMatchData({ teamB: { ...matchData.teamB, players: updatedPlayers } });
    }

    setPlayerName('');
    setPlayerRole(roles[0]);
    setPlayerImageFile(null);
    setIsCaptainNewPlayer(false);
    setPlayerImageFile(null);
  };

  const startEditing = (player: Player, teamName: string) => {
    setEditingPlayerId(player.id);
    setEditingTeamName(teamName);
    setEditName(player.name);
    setEditRole(player.role);
    setIsCaptainEditPlayer(player.isCaptain ?? false);
    setEditImageFile(null);
  };

  const cancelEditing = () => {
    setEditingPlayerId(null);
    setEditingTeamName(null);
    setEditName('');
    setEditRole(roles[0]);
    setIsCaptainEditPlayer(false);
    setEditImageFile(null);
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editingPlayerId || !editingTeamName || !matchData) {
      alert('Invalid edit data');
      return;
    }

     const ImageFile = editImageFile ? await uploadImageToCloudinary(editImageFile) : '';
 

    const updatePlayers =  (players: Player[]): Player[] => {
      let updatedPlayers = players;
      if (isCaptainEditPlayer) {
        updatedPlayers = unsetCurrentCaptain(updatedPlayers);
      }
       

      return updatedPlayers.map((p) =>
        p.id === editingPlayerId
          ? {
            ...p,
            name: editName.trim(),
            role: editRole,
            imageUrl: ImageFile ?? p.imageUrl,
            isCaptain: isCaptainEditPlayer,
          }
          : p
      );
    };

    if (editingTeamName === matchData.teamA.name) {
      await updateMatchData({ teamA: { ...matchData.teamA, players: updatePlayers(matchData.teamA.players) } });
    } else if (editingTeamName === matchData.teamB.name) {
      await updateMatchData({ teamB: { ...matchData.teamB, players: updatePlayers(matchData.teamB.players) } });
    }

    cancelEditing();
  };

  const deletePlayer = async (playerId: string, teamName: string) => {
    if (!matchData) return;
    if (!confirm('Are you sure you want to delete this player?')) return;

    if (teamName === matchData.teamA.name) {
      const updatedPlayers = matchData.teamA.players.filter((p) => p.id !== playerId);
      await updateMatchData({ teamA: { ...matchData.teamA, players: updatedPlayers } });
    } else if (teamName === matchData.teamB.name) {
      const updatedPlayers = matchData.teamB.players.filter((p) => p.id !== playerId);
      await updateMatchData({ teamB: { ...matchData.teamB, players: updatedPlayers } });
    }
  };

  const startMatch = () => {
    router.push(`/live-scoring/${matchId}`);
  };

  if (loading || !matchData) {
    return (
      <div 
        className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--cricket-green))_2px,_transparent_2px)] bg-[length:60px_60px] flex items-center justify-center"
        style={cricketGreenStyle}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3">
            {/* <FaCricketBall className="text-green-600 animate-spin" size={24} /> */}
            <p className="text-xl font-semibold text-gray-800">Loading match data...</p>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 border-3 border-white shadow-lg">
        <FaUser size={16} />
      </div>
    );

  return (
    <div 
      className="min-h-screen  py-4 sm:py-8"
      style={cricketGreenStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-green-200">
            <div className="flex items-center justify-center mb-4">
              {/* <FaCricketBall className="text-green-600 mr-3" size={32} /> */}
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Player Management</h1>
            </div>
            <p className="text-lg sm:text-xl text-gray-600">
              {matchData.teamA.name} vs {matchData.teamB.name}
            </p>
          </div>
        </div>

        {/* Add Player Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-2xl border border-green-200 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaPlus className="text-green-600 mr-3" />
            Add New Player
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Player Name</label>
              <input
                type="text"
                placeholder="Enter player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
              <select
                value={selectedTeamName}
                onChange={(e) => setSelectedTeamName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              >
                <option value={matchData.teamA.name}>{matchData.teamA.name}</option>
                <option value={matchData.teamB.name}>{matchData.teamB.name}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={playerRole}
                onChange={(e) => setPlayerRole(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              >
                {roles
                  .filter((r) => !['Coach', 'Physio', 'Manager', 'Support'].includes(r))
                  .map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPlayerImageFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                />
                <FaCamera className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex flex-col justify-end">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="newPlayerCaptain"
                  checked={isCaptainNewPlayer}
                  onChange={(e) => setIsCaptainNewPlayer(e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="newPlayerCaptain" className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                  <FaCrown className="text-yellow-500 mr-1" size={14} />
                  Captain
                </label>
              </div>
              <button
                onClick={addPlayer}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl px-6 py-3 hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Add Player
              </button>
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {[matchData?.teamA, matchData?.teamB].map((team, index) => (
            <div key={index} className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-green-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${index === 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                {team.name} Players
                <span className="ml-auto text-sm bg-gray-100 px-3 py-1 rounded-full">
                  {team?.players?.length || 0}
                </span>
              </h3>
              
              {team?.players?.length === 0 ? (
                <div className="text-center py-8">
                  <FaUser className="text-gray-300 mx-auto mb-4" size={48} />
                  <p className="text-gray-500 text-lg">No players added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {team?.players?.map((player) => (
                    <div
                      key={player.id}
                      className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
                    >
                      {editingPlayerId === player.id ? (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            {renderImage(player.imageUrl, player.name)}
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              className="border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
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
                              onChange={(e) => setEditImageFile(e.target.files ? e.target.files[0] : null)}
                              className="border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="editPlayerCaptain"
                                checked={isCaptainEditPlayer}
                                onChange={(e) => setIsCaptainEditPlayer(e.target.checked)}
                                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                              />
                              <label htmlFor="editPlayerCaptain" className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                                <FaCrown className="text-yellow-500 mr-1" size={14} />
                                Captain
                              </label>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEdit}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                              >
                                <FaSave className="mr-1" size={14} />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                              >
                                <FaTimes className="mr-1" size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {renderImage(player.imageUrl, player.name)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-2">
                                <h4 className="font-semibold text-gray-800 text-lg">{player.name}</h4>
                                {player.isCaptain && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                    <FaCrown className="mr-1" size={10} />
                                    Captain
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">{player.role}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => startEditing(player, team.name)}
                              className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-colors"
                              title="Edit Player"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => deletePlayer(player.id, team.name)}
                              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                              title="Delete Player"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bench Players and Support Staff */}
        <div className="space-y-8 mb-8">
          <Benchplayer matchData={matchData} updateMatchData={updateMatchData} />
          <SupportStaff matchData={matchData} updateMatchData={updateMatchData} />
        </div>

        {/* Start Match Button */}
        <div className="text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-green-200">
            {matchData?.teamA?.players?.length >= 4 && matchData?.teamB?.players?.length >= 4 ? (
              <button
                onClick={startMatch}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl px-8 py-4 text-xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center mx-auto"
              >
                {/* <FaCricketBall className="mr-3 animate-pulse" /> */}
                Start Match
              </button>
            ) : (
              <div>
                <button
                  disabled
                  className="bg-gray-400 text-white rounded-2xl px-8 py-4 text-xl font-bold cursor-not-allowed opacity-50 flex items-center mx-auto mb-4"
                >
                  {/* <FaCricketBall className="mr-3" /> */}
                  Start Match
                </button>
                <p className="text-gray-600 text-sm">
                  Add at least 4 players per team to start the match
                </p>
                <div className="flex justify-center mt-4 space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{matchData?.teamA?.players?.length || 0}/4</div>
                    <div className="text-sm text-gray-600">{matchData.teamA.name}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{matchData?.teamB?.players?.length || 0}/4</div>
                    <div className="text-sm text-gray-600">{matchData.teamB.name}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}