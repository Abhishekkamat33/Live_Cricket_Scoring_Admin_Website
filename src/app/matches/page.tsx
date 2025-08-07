'use client';
import { db } from '@/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import uuid from 'react-native-uuid';
import { uploadImageToCloudinary } from '../utility/fetchImage';
import Image from 'next/image';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const defaultTeamALogo = '/default-teamA-logo.png';
const defaultTeamBLogo = '/default-teamB-logo.png';

interface ProtectedApiResponse {
  message: string;
  uid: string;
}

const Index = () => {
  const router = useRouter();
  const [matchCreated, setMatchCreated] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  
  const today = new Date().toISOString().split('T')[0];

  // Team logo files and preview URLs
  const [teamALogoFile, setTeamALogoFile] = useState<File | null>(null);
  const [teamBLogoFile, setTeamBLogoFile] = useState<File | null>(null);
  const [teamALogoPreview, setTeamALogoPreview] = useState(defaultTeamALogo);
  const [teamBLogoPreview, setTeamBLogoPreview] = useState(defaultTeamBLogo);

  const [matchForm, setMatchForm] = useState({
    teamA: '',
    teamB: '',
    overplayed: '',
    date: '',
    time: '',
    venue: '',
    tossWinner: '',
    tossDecision: '',
    matchType: '',
  });

  useEffect(() => {
    async function verifySession() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      const idToken = await user.getIdToken(true);

      const response = await fetch('/api/protected', {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (response.status === 401) {
        router.push('/login');
      } else {
        const data = await response.json();
        setMatchCreated(data.uid);
        setLoading(false);
      }
    }

    verifySession();
  }, [router]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cricket-green-light via-background to-cricket-green-light flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-6 animate-spin">
            <span className="text-3xl">🏏</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading...</h2>
          <p className="text-muted-foreground">Verifying your session</p>
        </div>
      </div>
    );
  }

  // Show error screen if authentication failed
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cricket-green-light via-background to-cricket-green-light flex items-center justify-center">
        <div className="text-center bg-card p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Error</h2>
          <p className="text-muted-foreground mb-6">{authError}</p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-6 rounded-xl font-bold transition-all duration-300 hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMatchForm({ ...matchForm, [e.target.name]: e.target.value });
  };

  const handleTeamALogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setTeamALogoFile(file || null);
    if (file) {
      setTeamALogoPreview(URL.createObjectURL(file));
    } else {
      setTeamALogoPreview(defaultTeamALogo);
    }
  };

  const handleTeamBLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setTeamBLogoFile(file || null);
    if (file) {
      setTeamBLogoPreview(URL.createObjectURL(file));
    } else {
      setTeamBLogoPreview(defaultTeamBLogo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (matchForm.tossWinner !== matchForm.teamA && matchForm.tossWinner !== matchForm.teamB) {
      toast("Invalid Toss Winner", { type: "error" });
      return;
    }

    const matchId = uuid.v4();

    try {
      const ImageFile = teamALogoFile ? await uploadImageToCloudinary(teamALogoFile) : '';
      const ImageFile2 = teamBLogoFile ? await uploadImageToCloudinary(teamBLogoFile) : '';

      await setDoc(doc(db, 'matches', matchId), {
        teamA: {
          name: matchForm.teamA,
          image: ImageFile,
          players: [],
          score: 0,
          wickets: 0,
          overs: "0.0",
        },
        teamB: {
          name: matchForm.teamB,
          image: ImageFile2,
          players: [],
          score: 0,
          wickets: 0,
          overs: "0.0",
        },
        date: matchForm.date,
        time: matchForm.time,
        venue: matchForm.venue,
        matchStarted: false,
        matchEnded: false,
        overPlayed: matchForm.overplayed,
        tossWinner: matchForm.tossWinner,
        tossDecision: matchForm.tossDecision,
        matchStatus: 'scheduled',
        createdAt: new Date().toISOString(),
        matchId: matchId,
        matchWinner: '',
        totalRuns: 0,
        firstInningCompleted: false,
        matchCreatedBy: matchCreated,
        matchType: matchForm.matchType
      });

      toast("Match created successfully", { type: "success" });
      router.push(`/addplayer/${matchId}`);

      // Reset form and logos
      setMatchForm({
        teamA: '',
        teamB: '',
        overplayed: '',
        date: '',
        time: '',
        venue: '',
        tossWinner: '',
        tossDecision: '',
        matchType: '',
      });
      setTeamALogoFile(null);
      setTeamBLogoFile(null);
      setTeamALogoPreview(defaultTeamALogo);
      setTeamBLogoPreview(defaultTeamBLogo);
    } catch (error) {
      console.error('Error creating match:', error);
      toast("Failed to create match", { type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cricket-green-light via-background to-cricket-green-light px-4 sm:px-6 md:px-8 lg:px-12 relative">
      <ToastContainer position="top-center" />
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--cricket-green))_2px,_transparent_2px)] bg-[length:60px_60px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-6 shadow-[0_0_40px_hsl(var(--cricket-gold)/0.3)]">
            <span className="text-3xl">🏏</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-cricket-brown to-accent bg-clip-text text-transparent mb-4">
            Cricket Match Central
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create and manage your cricket matches with style
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:ml-60">
          <div className="lg:col-span-2">
            <div className="bg-card/80 backdrop-blur-lg p-8 rounded-2xl shadow-[0_10px_30px_-10px_hsl(var(--cricket-green)/0.3)] border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-lg">⚾</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground">New Match</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Team Names and Logos */}
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  {/* Team A */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                      Team A
                    </label>
                    <input
                      type="text"
                      name="teamA"
                      placeholder="Enter team name"
                      value={matchForm.teamA}
                      onChange={handleChange}
                      required
                      className="w-full p-4 text-sm sm:text-base bg-background/50 border-2 rounded-xl focus:border-primary focus:bg-background transition-all duration-300 placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                      Team A Logo (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTeamALogoChange}
                      className="w-full p-2 text-sm bg-background/50 border-2 rounded-xl cursor-pointer focus:border-primary transition-all duration-300"
                    />
                    {teamALogoPreview && (
                      <Image
                        src={teamALogoPreview}
                        alt="Team A Logo Preview"
                        width={80}   // approximate width you want
                        height={80}  // approximate height you want
                        className="mt-2 object-contain"
                      />
                    )}
                  </div>

                  {/* Team B */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                      Team B
                    </label>
                    <input
                      type="text"
                      name="teamB"
                      placeholder="Enter team name"
                      value={matchForm.teamB}
                      onChange={handleChange}
                      required
                      className="w-full p-4 text-sm sm:text-base bg-background/50 border-2 rounded-xl focus:border-primary focus:bg-background transition-all duration-300 placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                      Team B Logo (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTeamBLogoChange}
                      className="w-full p-2 text-sm bg-background/50 border-2 rounded-xl cursor-pointer focus:border-primary transition-all duration-300"
                    />
                    {teamBLogoPreview && (
                      <Image
                        src={teamBLogoPreview}
                        alt="Team B Logo Preview"
                        width={80}   // approximate width you want
                        height={80}  // approximate height you want
                        className="mt-2 object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Rest of your form fields unchanged (overs, date, time, venue, toss etc.) */}
                {/* Match Details Row */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                      Overs
                    </label>
                    <input
                      type="number"
                      name="overplayed"
                      placeholder="20"
                      value={matchForm.overplayed}
                      onChange={handleChange}
                      required
                      min={1}
                      max={50}
                      className="w-full p-4 text-sm sm:text-base bg-background/50 border-2 rounded-xl focus:border-primary focus:bg-background transition-all duration-300 placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={matchForm.date}
                      onChange={handleChange}
                      required
                      min={today}
                      className="w-full p-4 text-sm sm:text-base bg-background/50 border-2 rounded-xl focus:border-primary focus:bg-background transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={matchForm.time}
                      onChange={handleChange}
                      required
                      className="w-full p-4 text-sm sm:text-base bg-background/50 border-2 rounded-xl focus:border-primary focus:bg-background transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Venue */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    placeholder="Stadium name and location"
                    value={matchForm.venue}
                    onChange={handleChange}
                    required
                    className="w-full p-4 text-sm sm:text-base bg-background/50 border-2 rounded-xl focus:border-primary focus:bg-background transition-all duration-300 placeholder:text-muted-foreground"
                  />
                </div>

                {/* Toss Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                      Toss Winner
                    </label>
                    <div className="flex items-center space-x-2">
                      <select
                        name="tossWinner"
                        value={matchForm.tossWinner}
                        onChange={handleChange}
                        required
                        className="
              appearance-none w-full
              px-4 py-3 sm:px-6 sm:py-4
              text-base sm:text-lg bg-white
              border border-gray-300
              rounded-xl shadow-sm
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              transition-all duration-300
            "
                      >
                        <option value="" disabled>
                          Select toss winner
                        </option>
                        <option value={matchForm.teamA}>{matchForm.teamA}</option>
                        <option value={matchForm.teamB}>{matchForm.teamB}</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 w-full max-w-md mx-auto">
                    <label
                      htmlFor="matchType"
                      className="block text-sm font-semibold text-foreground/90 uppercase tracking-wide"
                    >
                      Match Type
                    </label>
                    <div className="relative">
                      <select
                        id="matchType"
                        name="matchType"
                        value={matchForm.matchType}
                        onChange={handleChange}
                        required
                        className="
                appearance-none w-full
                px-4 py-3 sm:px-6 sm:py-4
                text-base sm:text-lg bg-white
                border border-gray-300
                rounded-xl shadow-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                transition duration-300
                cursor-pointer
                disabled:bg-gray-100
                md:w-full md:max-w-md
              "
                      >
                        <option value="" disabled>
                          Select match type
                        </option>
                        <option value="T20">T20</option>
                        <option value="ODI">ODI</option>
                        <option value="Test">Test</option>
                        <option value="T10">T10</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toss Decision */}
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                    Toss Decision
                  </label>
                  <select
                    name="tossDecision"
                    value={matchForm.tossDecision}
                    onChange={handleChange}
                    required
                    className="w-full p-4 text-sm sm:text-base bg-background/50 border-2 rounded-xl focus:border-primary focus:bg-background transition-all duration-300"
                  >
                    <option value="" disabled>
                      Select decision
                    </option>
                    <option value="bat">Chose to Bat</option>
                    <option value="field">Chose to Field</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground py-4 px-6 sm:px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(var(--cricket-gold)/0.4)] active:scale-[0.98]"
                >
                  🏏 Create Match
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;