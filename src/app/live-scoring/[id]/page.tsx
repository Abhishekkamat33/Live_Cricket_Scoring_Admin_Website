'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScoringControls from '../../components/scoringcomponents/ScoringControls';
import ScoreBoard from '../../components/scoringcomponents/ScoreBoard';
import { ScoringProvider } from '../../components/ScoringContext';
import { useParams } from 'next/navigation';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import CricketPlayersDisplay from '@/app/components/scoringcomponents/squard';
import CommentaryPage from '../../components/scoringcomponents/BallTracker';



interface Player {
  id: string;
  name: string;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  isOut?: boolean;
  isStriker?: boolean;
  isNonStriker?: boolean;
  isCaptain?: boolean;
  teamName?: string;
  imageUrl?: string;
  isCurrentBowler?: boolean;
}
type MatchDataType = {
  teamA: {
    name: string;
    players: Player[];        // Change from string[] to Player[]
    score: number;
    wickets: number;
    overs: string;
  };
  teamB: {
    name: string;
    players: Player[];        // Change from string[] to Player[]
    score: number;
    wickets: number;
    overs: string;
  };
  date: string;
  time: string;
  venue: string;
  matchType: string;
  matchStatus: string;
  overPlayed: number;
  matchWinner: string;
  tossWinner: string;
  tossDecision: string;
};


const Index = () => {
  const [matchData, setMatchData] = useState<MatchDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const { id } = useParams();
  const matchId = id as string;





  // Controlled state for active tab
  const [activeTab, setActiveTab] = useState<'scoring' | 'commentary' | 'teams' | 'scorecard'>('scoring');

  // Mobile hamburger menu toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);



  // Fetch match data on mount or when matchId changes
  useEffect(() => {
    if (!matchId) return;

    const fetchMatch = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, 'matches', matchId);

        const docSnap = await getDoc(docRef);


        if (docSnap.exists()) {
          const data = docSnap.data() as MatchDataType;
          setMatchData(data);


        } else {
          setError('Match not found');
          //console.log('No such match!');
        }
      } catch {
        setError('Error loading match data');
        //console.error('Error fetching match:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);



  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Match</h2>
            <p className="text-gray-600">Fetching match data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
            <p className="text-gray-600 mb-4">Please check the match ID and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScoringProvider>
      <div className="container mx-auto max-w-full sm:max-w-xl md:max-w-5xl lg:max-w-7xl px-2 sm:px-4 ">

        {/* Tabs navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(tab) => {
            setActiveTab(tab as typeof activeTab);
            setMobileMenuOpen(false);
          }}
          className="space-y-8 relative"
        >
          {/* Mobile hamburger menu */}
          <div className="md:hidden mb-4 relative">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-blue-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Toggle tabs menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            {mobileMenuOpen && (
              <div
                ref={menuRef}
                className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-blue-200 z-50"
              >
                <div className="flex flex-col">
                  {['scoring', 'commentary', 'teams'].map((tabKey) => (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => {
                        setActiveTab(tabKey as typeof activeTab);
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-left hover:bg-blue-100 text-blue-700 font-medium"
                    >
                      {{
                        scoring: '🎯 Live Scoring',
                        commentary: '📝 Commentary',
                        teams: '👥 Teams',
                      }[tabKey]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop tabs list */}
          <TabsList className="hidden md:flex bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-blue-100 whitespace-nowrap">
            <TabsTrigger
              value="scoring"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:bg-blue-50"
            >
              🎯 Live Scoring
            </TabsTrigger>
            <TabsTrigger
              value="commentary"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:bg-blue-50"
            >
              📝 Commentary
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:bg-blue-50"
            >
              👥 Teams
            </TabsTrigger>
          </TabsList>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-blue-100 justify-center mx-auto max-w-full sm:max-w-md overflow-x-auto">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shrink-0"></div>
              <span className="font-bold text-blue-700 tracking-wide whitespace-nowrap">{matchData?.teamA.name} vs {matchData?.teamB.name}</span>
            </div>
          </div>
          {/* Tab Contents */}
          <TabsContent value="scoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full">
              {/* ScoreBoard Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <ScoreBoard />
              </div>

              {/* Scoring Controls Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="p-4 md:p-6 overflow-x-auto">
                  <ScoringControls matchId={matchId} matchData={matchData} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="commentary">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <CommentaryPage />
            </div>
          </TabsContent>

          <TabsContent value="teams">

            <CricketPlayersDisplay />


          </TabsContent>
        </Tabs>




        {/* Status Indicator */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-blue-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Live Match Active</span>
          </div>
        </div>
      </div>

    </ScoringProvider>
  );
}

export default Index;
