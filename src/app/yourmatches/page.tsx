'use client';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { Edit, Trash2, Plus, Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAuth } from 'firebase/auth';

type Team = {
  name: string;
  image?: string;
  score?: string;
  players?: Player[];
};

type Player = {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  isCaptain?: boolean;
  teamName: string;
};

type Match = {
  id: number | string;
  team1: Team;
  team2: Team;
  date: string; // ISO string or date string
  time: string; // "HH:mm"
  venue: string;
  format: string;
  status: 'live' | 'completed' | 'upcoming' | string;
  overs: string;
  result?: string;
  tossWinner?: string;
  tossDecision?: string;
};

type RawMatch = {
  id?: number | string;
  matchId?: number | string;
  teamA?: { name?: string; score?: number; wickets?: number, image?: string, players?: Player[] };
  teamB?: { name?: string; score?: number; wickets?: number, image?: string, players?: Player[] };
  date: string;
  time: string;
  venue?: string;
  matchType?: string;
  matchStatus?: string;
  overPlayed?: number;
  matchWinner?: string;
  tossWinner?: string;
  tossDecision?: string;
};

interface CricketMatchManagerProps {
  initialMatches?: RawMatch[];
}

const CricketMatchManager: React.FC<CricketMatchManagerProps> = ({ initialMatches = [] }) => {
  const [matches, setMatches] = useState<Match[]>(initialMatches.map(transformMatch));
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [matchCreatedBy, setMatchCreatedBy] = useState<string | null>(null);

  const router = useRouter();



// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  async function verifySession() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Force refresh token to avoid expiry errors
    const idToken = await user.getIdToken(true); 

    const response = await fetch('/api/protected', {
      headers: { Authorization: `Bearer ${idToken}` }
    });

    if (response.status === 401) {
      router.push('/login');
    } else {
      const data = await response.json();
      setMatchCreatedBy(data.uid);
    }
  }

  verifySession();
}, [router]);



  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchMatches = async () => {
      if (matchCreatedBy) {
        try {
          const response = await fetch(`/api/matches?uid=${matchCreatedBy}`);
          const data = await response.json();
          data.map((rawMatch: RawMatch) => {
            const match = transformMatch(rawMatch);
            setMatches(prevMatches => [...prevMatches, match]);
          })

        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      }
    }

    fetchMatches();
  }, [matchCreatedBy]);

  function transformMatch(match: RawMatch): Match {
    console.log(match);
    return {
      id: match.id ?? match.matchId ?? Math.random().toString(),
      team1: {
        name: match.teamA?.name || 'Team A',
        image: match.teamA?.image || '🏏',
        score:
          match.teamA?.score !== undefined && match.teamA?.wickets !== undefined
            ? `${match.teamA.score}/${match.teamA.wickets}`
            : '0/0',

        players:match.teamA?.players
      },
      team2: {
        name: match.teamB?.name || 'Team B',
        image: match.teamB?.image || '🏏',
        score:
          match.teamB?.score !== undefined && match.teamB?.wickets !== undefined
            ? `${match.teamB.score}/${match.teamB.wickets}`
            : '0/0',
        players:match.teamB?.players,  
      },
      date: match.date,
      time: match.time,
      venue: match.venue || 'TBD',
      format: match.matchType || 'T20',
      status: getMatchStatus(match.matchStatus),
      overs: `${match.overPlayed ?? 20}/20`,
      result: match.matchWinner ? `${match.matchWinner} won` : '',
      tossWinner: match.tossWinner,
      tossDecision: match.tossDecision,
    };
  }







  function getMatchStatus(status?: string): 'live' | 'completed' | 'upcoming' {
    switch (status) {
      case 'scheduled':
        return 'upcoming';
      case 'live':
        return 'live';
      case 'completed':
        return 'completed';
      default:
        return 'upcoming';
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'live':
        return 'bg-red-500';
      case 'completed':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'completed':
        return 'COMPLETED';
      case 'upcoming':
        return 'UPCOMING';
      default:
        return 'UNKNOWN';
    }
  }

  const handleDelete = (id: number | string): void => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      const deletedMatches = async () => {
        const res = await fetch(`/api/matches/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          setMatches((prev) => prev.filter((match) => match.id !== id));
        }
      }
      if (matchCreatedBy) {
        deletedMatches();
      }
    }
  };

  const handleEdit = (match: Match): void => {
    console.log(match);
    if (match.status === 'live') {
      router.push(`/live-scoring/${match.id}`);
    }
    setEditingMatch({ ...match });
  };

  const handleSaveEdit = (): void => {
    if (!editingMatch) return;
    const edit_match = async () => {
      const res = await fetch(`/api/matches/${editingMatch.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingMatch),
      });
      if (res.ok) {
        setMatches((prev) => prev.map((match) => (match.id === editingMatch.id ? editingMatch : match)));
      }
    }
    if (matchCreatedBy) {
      edit_match();
    }
    setEditingMatch(null);
  };

  const handleAddMatch = () => {
    router.push('/matches');

  };

  const displayMatches = matches;

  // -------------------------

  type MatchCardProps = {
    match: Match;
  };

  const MatchCard: React.FC<MatchCardProps> = ({ match }) => (
    console.log(match),
    
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Status Badge */}
      <div className="relative">
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(
            match.status
          )} animate-pulse z-10`}
        >
          {getStatusText(match.status)}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Teams Section - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
          {/* Team 1 */}
          <div className="flex items-center space-x-3">
          <Image src={match?.team1?.image || ''} alt={match.team1.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">{match.team1.name}</h3>
              {match.team1.score && <p className="text-sm text-gray-600">{match.team1.score}</p>}
            </div>
          </div>

          {/* VS Section */}
          <div className="text-center flex-shrink-0 my-2 sm:my-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-400 mb-1">VS</div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{match.format}</div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0 text-right">
              <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">{match.team2.name}</h3>
              {match.team2.score && <p className="text-sm text-gray-600">{match.team2.score}</p>}
            </div>
            
          <Image src={(match?.team2?.image)|| ''} alt={match.team2.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
          </div>
        </div>

        {/* Match Result */}
        {match.result && (
          <div className="text-center mb-4">
            <p className="text-green-600 font-semibold bg-green-50 px-3 py-2 rounded-full inline-block text-sm">{match.result}</p>
          </div>
        )}

        {/* Match Details - Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{new Date(match.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center space-x-2 sm:col-span-2">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="truncate text-xs sm:text-sm">{match.venue}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <span>{match.overs} Overs</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span>{match.format} Match</span>
          </div>
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleEdit(match)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDelete(match.id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
       {(() => {
  if (match.status === "live") return true;
  if (match.date && match.time) {
    const matchDateTime = new Date(`${match.date}T${match.time}:00`);
    const now = new Date();
    const tenMinBefore = new Date(matchDateTime.getTime() - 10 * 60000);
    return now >= tenMinBefore && now <= matchDateTime;
  }
  return false;
})() ? (
  <button
    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
    onClick={() => router.push(`/live-scoring/${match.id}`)}
  >
    Scoring Control
  </button>
) : (match.team1.players?.length === 0 || match.team2.players?.length === 0 ) ? (
  <button
    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
    onClick={() => router.push(`/addplayer/${match.id}`)} // corrected path here
  >
    Add Squad
  </button>
) : (
  
   <button
    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
    onClick={() => router.push(`/live-scoring/${match.id}`)}
  >
    Scoring Control
  </button>
)}


        </div>
      </div>
    </div>
  );

  const EditForm: React.FC = () => {
    if (!editingMatch) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Edit Match</h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Team 1</label>
              <input
                type="text"
                value={editingMatch.team1.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingMatch({
                    ...editingMatch,
                    team1: { ...editingMatch.team1, name: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team 2</label>
              <input
                type="text"
                value={editingMatch.team2.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingMatch({
                    ...editingMatch,
                    team2: { ...editingMatch.team2, name: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={editingMatch.date}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingMatch({ ...editingMatch, date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                value={editingMatch.time}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingMatch({ ...editingMatch, time: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Venue</label>
              <input
                type="text"
                value={editingMatch.venue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingMatch({ ...editingMatch, venue: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Stadium name, City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={editingMatch.status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setEditingMatch({ ...editingMatch, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
            <button
              onClick={handleSaveEdit}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingMatch(null)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
              Cricket Match Manager
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your cricket matches with ease</p>
          </div>
          <button
            onClick={() => handleAddMatch()}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add New Match</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{displayMatches.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Matches</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{displayMatches.filter((m) => m.status === 'live').length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Live Matches</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{displayMatches.filter((m) => m.status === 'completed').length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{displayMatches.filter((m) => m.status === 'upcoming').length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Upcoming</div>
          </div>
        </div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {displayMatches.length > 0 ? (
            displayMatches.map((match) => <MatchCard key={match.id} match={match} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏏</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches found</h3>
              <p className="text-gray-500">Add some matches to get started!</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingMatch && <EditForm />}
      </div>
    </div>
  );
};

export default CricketMatchManager;
