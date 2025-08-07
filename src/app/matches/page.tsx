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

  const verifySession = useCallback(async (user: User) => {
    try {
      setAuthError('');
      console.log('Verifying session for user:', user.uid);
      
      // Ensure user is still valid
      await user.reload();
      
      const idToken = await user.getIdToken(true);
      console.log('Making API request with token...');
      
      const response = await fetch('/api/protected', {
        headers: { 
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API response status:', response.status);
      
      if (response.status === 401) {
        console.log('Unauthorized - redirecting to login');
        setAuthError('Session expired. Please log in again.');
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: ProtectedApiResponse = await response.json();
      console.log('Session verified successfully:', data);
      setMatchCreated(data.uid);
      
    } catch (error) {
      console.error('Error verifying session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setAuthError(errorMessage);
      
      // Only redirect on auth-specific errors
      if (errorMessage.includes('auth') || errorMessage.includes('token') || errorMessage.includes('unauthorized')) {
        router.push('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(
      auth, 
      async (user: User | null) => {
        console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user');
        
        if (!user) {
          console.log('No authenticated user - redirecting to login');
          setLoading(false);
          router.push('/login');
          return;
        }
        
        // Give Firebase a moment to fully initialize
        setTimeout(async () => {
          await verifySession(user);
          setLoading(false);
        }, 500);
      },
      (error) => {
        console.error('Auth state listener error:', error);
        setAuthError(`Authentication error: ${error.message}`);
        setLoading(false);
        router.push('/login');
      }
    );

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, [router, verifySession]);

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
                        width={80}
                        height={80}
                        className="mt-2 object-contain"
                        onError={() => setTeamALogoPreview(defaultTeamALogo)}
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
                        width={80}
                        height={80}
                        className="mt-2 object-contain"
                        onError={() => setTeamBLogoPreview(defaultTeamBLogo)}
                      />
                    )}
                  </div>
                </div>

                {/* Rest of your form fields - keeping them unchanged for brevity */}
                {/* ... (keep all your existing form fields here) ... */}

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