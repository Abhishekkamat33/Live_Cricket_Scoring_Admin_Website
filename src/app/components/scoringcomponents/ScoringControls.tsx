'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card,  CardHeader, CardTitle } from '@/components/ui/card';
import { useScoring } from '../ScoringContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface Staff {
  id: string;
  name: string;
  role: string;
}



type Inning = {
  id?: string;
  battingTeam: {
    name: string;
    wickets: number;
    score: number;
    overs: string;
    battingOrder: Player[]; // You can define a more specific type for players if needed
  };
  bowlingTeam: {
    name: string;
    wickets: number;
    score: number;
    overs: string;
    bowlingOrder: Player[];
  };
  totalRuns: number;
  extras: number;
  wickets: number;
  balls: number;
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  updatedAt: string;
  matchId: string;
  overs: string;
  inningNumber: number;
  target?: number;
  iswinner?: string;
};


interface MatchTeam {
  name: string;
  score: number;
  wickets: number;
  overs: string;
  players: Player[];
  benchPlayers?: Player[];
  supportingStaff?: Staff[];
}

interface MatchData {
  teamA: MatchTeam;
  teamB: MatchTeam;
  tossWinner: string;
  tossDecision: string;
  matchType: string;
  overPlayed: number;
  matchWinner: string;
  innings: Inning[];
}

interface ScoringControlsProps {
  matchId: string;
  matchData: MatchData | null;
}

const ScoringControls: React.FC<ScoringControlsProps> = ({ matchId, matchData }) => {
  const {
    runs, setRuns,
    extras, setExtras,
    byes, setByes,
    legByes, setLegByes,
    wickets, setWickets,
    wides, setWides,
    noBalls, setNoBalls,
    balls, setBalls,
    overs, setOvers,
    strikerName, setStrikerName,
    nonStrikerName, setNonStrikerName,
    currentInning, setCurrentInning,
    match_id, setMatch_id,
    setMatch_data,
    loading, setLoading,
    battingTeam, setBattingTeam,
    bowlingTeam, setBowlingTeam,
    setStrike, strike,
    totalRuns, setTotalRuns,
    currentBowler, setCurrentBowler,
    inningData,
    setNewBatsman, newBatsman,
    outBatsman, setOutBatsman,
    setFetchDataFirst, fetchDataFirst,
    wicketType, setWicketType,
    isSecondInning, setIsSecondInning,
    iswinner,
    setUndo,
    setRecentBowler,
    recentBowler,
  } = useScoring();

  // Wicket info
  const [howOut, setHowOut] = useState<string>('');
  const [bowlerName, setBowlerName] = useState<string>('');
  const [fielderName, setFielderName] = useState<string>('');
  const [out, setOut] = useState<boolean>(true);

  const [runoutRuns, setRunoutRuns] = useState<number>(0);
  const [runoutRunType, setRunoutRunType] = useState<'bat' | 'bye' | 'legbye' | ''>('');

  // Control flags
  const [needBatsmenInput, setNeedBatsmenInput] = useState(true);
  const [needBowlerInput, setNeedBowlerInput] = useState(true);
  const [needNewBowlerInput, setNeedNewBowlerInput] = useState(false);
  const [needNewBatsmanInput, setNeedNewBatsmanInput] = useState(false);

  const [strikerBatsman, setStrikerBatsman] = useState<string>('');
  const [nonStrikerBatsman, setNonStrikerBatsman] = useState<string>('');
  const [strikerBowler, setStrikerBowler] = useState<string >('');
  const [lastOverPrompted, setLastOverPrompted] = useState<number | null>(null);
  const [showNoBallOptions, setShowNoBallOptions] = useState(false);
  const [noBallRunType, setNoBallRunType] = useState<'bat' | 'bye' | 'legbye' | ''>('');
  const [noBallRuns, setNoBallRuns] = useState<number>(0);
  const [showWideOptions, setShowWideOptions] = useState(false);
  const [wideRuns, setWideRuns] = useState<number>(0);
  const [history, setHistory] = useState<Inning[]>([]);

  useEffect(() => {
    if (inningData.length === 0) {
      setNeedBatsmenInput(true);
      setNeedBowlerInput(true);
      return;
    }
  
  

    if (isSecondInning) {
      setNeedBatsmenInput(true);
      setNeedBowlerInput(true);
      setStrikerBowler('');
      setStrikerBatsman('');
      setNonStrikerBatsman('');
      setNeedNewBowlerInput(false);
      setNeedNewBatsmanInput(false);
      return;
    } else {
      setNeedBatsmenInput(false);
      setNeedBowlerInput(false);
      setNeedNewBowlerInput(false);
    }

    setFetchDataFirst(inningData.length);

    setOut(true);
    setHowOut('');
    
    const latestInning = inningData[inningData.length - 1];
    const battingOrder = latestInning.battingTeam?.battingOrder || [];
    const bowlingOrder = latestInning.bowlingTeam?.bowlingOrder || [];

    const striker = battingOrder.find((player: Player) => player.isStriker);
    const nonStriker = battingOrder.find((player:Player) => player.isNonStriker);
    const currentBowler = bowlingOrder.find((player: Player) => player.isCurrentBowler);

    if (currentBowler?.name === '' || currentBowler === null || currentBowler === undefined) {
      setNeedNewBowlerInput(true);
    }
    if (striker?.name === '' || striker === null || striker === undefined) {
      setNeedNewBatsmanInput(true);
    }
    if (nonStriker?.name === '' || nonStriker === null || nonStriker === undefined) {
      setNeedNewBatsmanInput(true);
    }

    setStrikerBatsman(striker?.name || '');
    setNonStrikerBatsman(nonStriker?.name || '');
    setStrikerBowler(currentBowler?.name || '');

    setStrikerName(strikerBatsman || '');
    setNonStrikerName(nonStrikerBatsman || '');
    setCurrentBowler(strikerBowler || '');
    
    if (!striker?.name && !nonStriker?.name && !currentBowler?.name) {
      setNeedBatsmenInput(true);
      setNeedBowlerInput(true);
    } else {
      setNeedBatsmenInput(false);
      setNeedBowlerInput(false);
    }
  }, [matchData, inningData, fetchDataFirst, isSecondInning]);

useEffect(() => {
  if (!matchData) return;

  setMatch_data(matchData);
  setMatch_id(matchId);

  const { teamA, teamB, tossWinner, tossDecision } = matchData;

  let firstBatting, firstBowling;

  if (tossDecision === 'bat') {
    firstBatting = tossWinner === teamA.name ? teamA : teamB;
    firstBowling = tossWinner === teamA.name ? teamB : teamA;
  } else {
    firstBatting = tossWinner === teamA.name ? teamB : teamA;
    firstBowling = tossWinner === teamA.name ? teamA : teamB;
  }


  if (isSecondInning) {
    setBattingTeam(firstBowling);
    setBowlingTeam(firstBatting);
  } else {
    setBattingTeam(firstBatting);
    setBowlingTeam(firstBowling);
  }

  setLoading(false);
}, [isSecondInning , matchData]);




  useEffect(() => {
    if (!inningData) return;
    const previousBowler = inningData[inningData.length - 1]?.bowlingTeam?.recentBowlerName;
    if (!previousBowler) return;
  }, [recentBowler])

  useEffect(() => {
    if (!inningData || inningData.length === 0) return;

    const latest = inningData[inningData.length - 1];
    const oversStr = latest.overs || "0.0";

    const [completedOversStr, ballsInCurrentOverStr] = oversStr.split(".");
    const completedOvers = parseInt(completedOversStr, 10) || 0;
    const ballsInCurrentOver = parseInt(ballsInCurrentOverStr, 10) || 0;

    if (
      ballsInCurrentOver === 0 &&
      completedOvers > 0 &&
      lastOverPrompted !== completedOvers
    ) {
      setRecentBowler(true);
      setLastOverPrompted(completedOvers);
      setCurrentBowler('');
      setNeedNewBowlerInput(true);
    
    }
    else if (ballsInCurrentOver > 0) {
      setNeedNewBowlerInput(false);
    }
  }, [inningData, lastOverPrompted, setNeedNewBowlerInput, setCurrentBowler, setLastOverPrompted]);

  const onScore = (r: number) => {
    if (needBatsmenInput || needBowlerInput) {
      alert('Please enter batsmen and bowler names before scoring.');
      return;
    }

    setTotalRuns(r);
    setBalls(1);
    setRuns(r);
  };

  const onWideConfirm = (byeRuns: number) => {
    setExtras(byeRuns);
    setWides(1);
  };

  const onNoBallConfirm = (runType: 'bat' | 'bye' | 'legbye' | '', runs: number) => {


    if (runType === 'bye') {
      setByes(runs);
      setExtras(runs);
      setBalls(0);
      setNoBalls(1);
    } else if (runType === 'legbye') {
      setLegByes(runs);
      setExtras(runs);
      setNoBalls(1);
    } else {
      setRuns(runs);
      setNoBalls(1);
    }
  };

  const onBye = (r: number) => {
    if (needBatsmenInput || needBowlerInput) {
      alert('Please enter batsmen and bowler names before scoring byes.');
      return;
    }
    setByes(1);
    setExtras(r);
    setBalls(1);
  };

  const onLegBye = (r: number) => {
    if (needBatsmenInput || needBowlerInput) {
      alert('Please enter batsmen and bowler names before scoring leg byes.');
      return;
    }
    setLegByes(1);
    setExtras(r);
    setBalls(1);
  };

  const onWicket = () => {
    const lastInning = inningData[inningData.length - 1];

    const newBatsmanLower = newBatsman?.toLowerCase().trim();
    const fielderNameLower = fielderName?.toLowerCase().trim();
    const strikerBatsmanLower = strikerBatsman?.toLowerCase().trim();


    const newBatsmanPlayer = lastInning?.battingTeam?.battingOrder?.find(
      (player: Player) => player.name.toLowerCase() === newBatsmanLower
    );

    if (!newBatsmanPlayer) {
      alert('Please enter a valid batsman name from the batting team.');
      return;
    }

    const fielderPlayer = fielderName
      ? lastInning?.bowlingTeam?.bowlingOrder?.find(
          (player: Player) => player.name.toLowerCase() === fielderNameLower
        )
      : null;

    if (fielderName && !fielderPlayer) {
      alert('Please enter a valid fielder name from the bowling team.');
      return;
    }

    if (newBatsmanPlayer.name.toLowerCase() === strikerBatsmanLower) {
      alert('Striker cannot be out.');
      return;
    }

    if (newBatsmanPlayer.isOut) {
      alert('The selected batsman is already out.');
      return;
    }

    if (needBatsmenInput || needBowlerInput) {
      alert('Please enter batsmen and bowler names before recording wicket.');
      return;
    }

    if (!newBatsman || newBatsman.trim() === '') {
      alert('Please enter batsman name before recording wicket.');
      return;
    }

    if (!howOut) {
      alert('Please select how the batsman got out.');
      return;
    }

    if (howOut === 'caught' && (!fielderName || fielderName.trim() === '') && !fielderPlayer) {
      alert('Please enter fielder name from fielding team.');
      return;
    }

    if (howOut === 'runout') {
      if (
        !fielderName ||
        fielderName.trim() === '' ||
        !fielderPlayer ||
        !newBatsman ||
        newBatsman.trim() === '' ||
        runoutRuns === undefined ||
        runoutRuns === null ||
        runoutRuns < 0 ||
        runoutRuns > 6 ||
        !runoutRunType
      ) {
        alert('Please enter everything required for runout.');
        return;
      }
    }

    setWicketType(howOut);

    if ((howOut === 'runout' || howOut === 'obstructingfield') && !outBatsman) {
      alert('Please select which batsman is out.');
      return;
    }

    if (howOut === 'runout') {
      if (runoutRuns < 0 || runoutRuns > 6) {
        alert('Please enter valid runs completed during runout (0-6).');
        return;
      }
      if (!runoutRunType) {
        alert('Please select run type for runs completed during runout.');
        return;
      }
      if (runoutRunType === 'bat') {
        setRuns(runoutRuns);
      }
    }

    if (['stumped', 'bowled', 'lbw', 'caught', 'runout', 'obstructingfield'].includes(howOut)) {
      if (!outBatsman) setOutBatsman(strikerName);
    }

    if (wickets >= 10) {
      alert('All out!');
    }

    setWickets(prev => prev + 1);
    setBalls(prev => prev + 1);
    setOut(false);
    setRunoutRuns(0);
    setRunoutRunType('');
  };



  const confirmPlayers = async () => {
    if (!strikerBatsman || !nonStrikerBatsman || !strikerBowler) {
      alert('Please enter all three: striker, non-striker, and bowler names.');
      return;
    }

    if (matchData) {

 
      
      const battingNames = battingTeam?.players?.map((p: Player) => p.name);

    
   

      if (!battingNames?.includes(strikerBatsman)) {
        alert('Striker must be from the batting team.');
        return;
      }

      if (!battingNames?.includes(nonStrikerBatsman)) {
        alert('Non-striker must be from the batting team.');
        return;
      }
      if (strikerBatsman === nonStrikerBatsman) {
        alert('Striker and Non-striker cannot be the same player.');
        return;
      }

      const bowlingNames = bowlingTeam?.players?.map((p: Player) => p.name);

      if (!bowlingNames?.includes(strikerBowler)) {
        alert('Bowler must be from the bowling team.');
        return;
      }

      if (isSecondInning) {
        setCurrentInning((inningData.length || 0) + 1);
      } else {
        setCurrentInning(inningData.length || 0 + 1);
      }

      setStrikerName(strikerBatsman);
      setNonStrikerName(nonStrikerBatsman);
      setCurrentBowler(strikerBowler);
      setNeedBatsmenInput(false);
      setNeedBowlerInput(false);
      setIsSecondInning(false);
    }
  };

  const checkBowler = inningData[inningData.length - 1]?.bowlingTeam.recentBowler?.name;

  useEffect(() => {
    if (checkBowler) {
      setNeedNewBowlerInput(true)
    }
  }, [checkBowler])

  const confirmNewBowler = () => {
    if (!strikerBowler || strikerBowler.trim() === '') {
      alert('Please enter bowler name.');
      return;
    }

    const trimmedBowler = strikerBowler.trim();

    const latestInning = inningData[inningData.length - 1];
    if (!latestInning) {
      alert('Inning data not available.');
      return;
    }

    const bowlingOrder = latestInning.bowlingTeam?.bowlingOrder || [];

    

    const checkBowler = latestInning.bowlingTeam?.recentBowler as unknown as string;
    console.log('checkBowler', checkBowler);
    if (
      checkBowler?.trim().toLowerCase() === trimmedBowler.trim().toLowerCase()
    ) {
      alert('This bowler is already bowling the current over. Please select another bowler.');
      return;
    }


    const newBowlerExists = bowlingOrder.some((player: Player) => player.name === trimmedBowler);
    if (!newBowlerExists) {
      alert('Bowler not found in bowling team. Please enter a valid bowler name.');
      return;
    }

    setCurrentBowler(strikerBowler.trim());

    setNeedNewBowlerInput(false);
    setRecentBowler(false);
  };

  useEffect(() => {
    const completedOvers: number = Math.floor(balls / 6);
    const ballsInCurrentOver: number = balls % 6;
    setOvers(`${completedOvers}.${ballsInCurrentOver}`);
  }, [balls]);

  useEffect(() => {
    if (inningData && inningData.length > 0) {
      setHistory(prev => {
        const lastSnapshot = prev[prev.length - 1];
        const currentSnapshotStr = JSON.stringify(inningData[inningData.length - 1]);
        const lastSnapshotStr = lastSnapshot ? JSON.stringify(lastSnapshot) : null;

        if (currentSnapshotStr !== lastSnapshotStr) {
          return [...prev, JSON.parse(currentSnapshotStr)];
        }
        return prev;
      });
    }
  }, [inningData]);

  const undoLastChange = () => {
    if (history.length < 3) {
      alert('Not enough history to undo two steps');
      return;
    }

    if (!window.confirm("Are you sure you want to undo the last changes?")) {
      return;
    }
   
    const previousState = history[history.length - 3];

    setHistory(prev => prev.slice(0, prev.length - 2));
    setUndo(previousState)
  };

  if (iswinner && isSecondInning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl border border-white/20">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {iswinner === 'Draw' ? 'The match is a draw!' : `Match won by ${iswinner}`}
          </h1>
        </div>
      </div>
    );
  }


   return (
      <div className="max-w-xl sm:max-w-3xl md:max-w-4xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6 overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600">
          <CardHeader className="p-4 sm:p-6 md:p-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            <CardTitle className="text-white text-2xl sm:text-3xl font-bold relative z-10 drop-shadow-lg">
              🏏 Cricket Scoring
            </CardTitle>
            <div className="text-white/90 text-lg sm:text-xl font-semibold mt-2 relative z-10">
              {/* Assuming isSecondInning is in scope */}
              {currentInning === 2 ? '2nd Inning' : '1st Inning'}
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Card */}
     
            {/* Initial batsmen input */}
            {needBatsmenInput && needBowlerInput && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-blue-100 mb-8">
                <div className="text-center mb-6">
                  <div className="text-2xl mb-2">🏏</div>
                  <h4 className="text-xl font-bold text-gray-800">Enter Opening Batsmen & Bowler</h4>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Striker Name"
                    value={strikerBatsman}
                    onChange={(e) => setStrikerBatsman(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all outline-none text-base sm:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Non-Striker Name"
                    value={nonStrikerBatsman}
                    onChange={(e) => setNonStrikerBatsman(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all outline-none text-base sm:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Bowler Name"
                    value={strikerBowler}
                    onChange={(e) => setStrikerBowler(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all outline-none text-base sm:text-lg"
                  />

                  <Button
                    onClick={confirmPlayers}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg transform hover:scale-[1.02] transition-all"
                  >
                    Confirm Players ✓
                  </Button>
                </div>
              </div>
            )}

            {/* New Bowler input */}
            {needNewBowlerInput && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-lg border border-orange-200 mb-8 max-w-md mx-auto">
                <div className="text-center mb-4">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="text-xl font-bold text-gray-800">Enter New Bowler</h4>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Bowler Name"
                    value={strikerBowler} // assuming this is intentional; else replace with another state var
                    onChange={(e) => setStrikerBowler(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all outline-none text-base sm:text-lg"
                  />

                  <Button
                    onClick={confirmNewBowler}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg transform hover:scale-[1.02] transition-all"
                  >
                    New Bowler ✓
                  </Button>
                </div>
              </div>
            )}

            {/* Scoring Interface */}
            {!needBatsmenInput && !needBowlerInput && !needNewBatsmanInput && !needNewBowlerInput && (
              <div className="space-y-8 max-w-4xl mx-auto">
                {/* Runs Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Runs</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 max-w-md mx-auto">
                    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                      <Button
                        key={n}
                        onClick={() => onScore(n)}
                        className={`
                          aspect-square text-xl sm:text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all
                          ${
                            n === 0
                              ? 'bg-gray-600 hover:bg-gray-700'
                              : n === 4
                              ? 'bg-green-600 hover:bg-green-700'
                              : n === 6
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }
                          text-white
                        `}
                      >
                        {n}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Extras Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl max-w-md mx-auto">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Extras</h4>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      onClick={() => setShowWideOptions(true)}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold transition transform hover:scale-105"
                    >
                      Wide Ball
                    </Button>
                    <Button
                      onClick={() => setShowNoBallOptions(true)}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl shadow-lg bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-bold transition transform hover:scale-105"
                    >
                      No Ball
                    </Button>
                  </div>

                  {/* Wide Options Modal */}
                  {showWideOptions && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 sm:mx-auto shadow-2xl">
                        <h4 className="text-xl font-bold text-yellow-800 mb-4 text-center">Wide Ball Details</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block font-semibold text-gray-700 mb-2">Bye Runs</label>
                            <input
                              type="number"
                              min={0}
                              max={6}
                              value={wideRuns}
                              onChange={(e) => setWideRuns(Math.min(6, Math.max(0, Number(e.target.value))))}
                              className="w-full p-3 border-2 border-yellow-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all outline-none text-base sm:text-lg"
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                onWideConfirm(wideRuns);
                                setWideRuns(0);
                                setShowWideOptions(false);
                              }}
                              disabled={wideRuns < 0}
                              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setShowWideOptions(false);
                                setWideRuns(0);
                              }}
                              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-xl transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No Ball Options Modal */}
                  {showNoBallOptions && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 sm:mx-auto shadow-2xl">
                        <h4 className="text-xl font-bold text-amber-800 mb-4 text-center">No Ball Details</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block font-semibold text-gray-700 mb-2">Run Type</label>
                            <select
                              value={noBallRunType}
                              onChange={e => setNoBallRunType(e.target.value as 'bat' | 'bye' | 'legbye' | '')}
                              className="w-full p-3 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none text-base sm:text-lg"
                            >
                              <option value="">Select run type</option>
                              <option value="bat">Runs with Bat</option>
                              <option value="bye">Bye</option>
                              <option value="legbye">Leg Bye</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-2">Runs</label>
                            <input
                              type="number"
                              min={0}
                              max={6}
                              value={noBallRuns}
                              onChange={(e) => setNoBallRuns(Math.min(6, Math.max(0, Number(e.target.value))))}
                              className="w-full p-3 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none text-base sm:text-lg"
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                onNoBallConfirm(noBallRunType, noBallRuns);
                                setNoBallRunType('');
                                setNoBallRuns(0);
                                setShowNoBallOptions(false);
                              }}
                              disabled={!noBallRunType || noBallRuns < 0}
                              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setShowNoBallOptions(false);
                                setNoBallRunType('');
                                setNoBallRuns(0);
                              }}
                              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-xl transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Byes & Leg Byes Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl max-w-md mx-auto">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Byes / Leg Byes</h4>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2 text-center">Byes</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {[1, 2, 3, 4].map((n) => (
                          <Button
                            key={`b${n}`}
                            onClick={() => onBye(n)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all"
                          >
                            B{n}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2 text-center">Leg Byes</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {[1, 2, 3, 4].map((n) => (
                          <Button
                            key={`lb${n}`}
                            onClick={() => onLegBye(n)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all"
                          >
                            LB{n}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wicket Section */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200 max-w-md mx-auto">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">🏏 Wicket</h4>

                  <div className="space-y-6">
                    {/* Wicket Type Dropdown */}
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all min-w-48">
                          How out: {howOut || '—'}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white rounded-xl shadow-2xl border-0 p-2">
                          <DropdownMenuLabel className="text-gray-600 font-semibold">Wicket type</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup value={howOut} onValueChange={setHowOut}>
                            {['runout', 'obstructingfield', 'stumped', 'bowled', 'caught', 'lbw'].map((type) => (
                              <DropdownMenuRadioItem key={type} value={type} className="capitalize hover:bg-gray-50 rounded-lg">
                                {type.replace(/([A-Z])/g, ' $1').trim()}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Wicket Details Form */}
                    {howOut && out && (
                      <div >
                        <div>
                          <label className="block font-semibold text-gray-700 mb-2">Bowler Name:</label>
                          <input
                            type="text"
                            value={strikerBowler}
                            onChange={(e) => setBowlerName(e.target.value)}
                            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all outline-none text-base sm:text-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-2">New Batsman Name:</label>
                          <input
                            type="text"
                            value={newBatsman}
                            onChange={(e) => setNewBatsman(e.target.value)}
                            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all outline-none text-base sm:text-lg"
                          />
                        </div>

                        {(howOut === 'caught' || howOut === 'runout' || howOut === 'stumped' || howOut === 'obstructingfield') && (
                          <div>
                            <label className="block font-semibold text-gray-700 mb-2">Fielder Name</label>
                            <input
                              type="text"
                              value={fielderName}
                              onChange={(e) => setFielderName(e.target.value)}
                              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all outline-none text-base sm:text-lg"
                            />
                          </div>
                        )}

                                  {/* Additional inputs for runout and obstructing field */}
                        {(howOut === 'runout' || howOut === 'obstructingfield') && (
                          <>
                            <label className="block font-semibold text-gray-700 mb-3">Which batsman is out?</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="outBatsman"
                                  value={outBatsman}
                                  checked={outBatsman === strikerName}
                                  onChange={() => setOutBatsman(strikerName)}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span>Striker ({strikerName || 'N/A'})</span>
                              </label>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="outBatsman"
                                  value={outBatsman}
                                  checked={outBatsman === nonStrikerName}
                                  onChange={() => setOutBatsman(nonStrikerName)}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span>Non-Striker ({nonStrikerName || 'N/A'})</span>
                              </label>
                            </div>
                          </>
                        )}


                        {howOut === 'runout' && (
                          <>
                            <div>
                              <label className="block font-semibold text-gray-700 mb-2">Runs completed during runout</label>
                              <input
                                type="number"
                                min={0}
                                max={6}
                                value={runoutRuns}
                                onChange={e => setRunoutRuns(Math.min(6, Math.max(0, Number(e.target.value))))}
                                className="w-24 p-2 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all outline-none"
                              />
                            </div>


                            <div>
                              <label className="block font-semibold text-gray-700 mb-2">Run type</label>
                              <select
                                value={runoutRunType}
                                onChange={e => setRunoutRunType(e.target.value as 'bat' | 'bye' | 'legbye' | '')}
                                className="w-full sm:w-48 p-2 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all outline-none"
                              >
                                <option value="">Select run type</option>
                                <option value="bat">Runs with Bat</option>
                                <option value="bye">Bye</option>
                                <option value="legbye">Leg Bye</option>
                              </select>
                            </div>
                          </>
                        )}
                        <Button
                        onClick={()=>setOut(false)}
                        className=" mt-3.5 w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg transform hover:scale-[1.02] transition-all disabled:transform-none disabled:opacity-50"
                        >
                           Cancel
                        </Button>
                      </div>
                    )}

                    {/* Wicket Button */}
                    <Button
                      onClick={onWicket}
                      disabled={!howOut}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg transform hover:scale-[1.02] transition-all disabled:transform-none disabled:opacity-50"
                    >
                      🏏RECORD WICKET
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 max-w-md mx-auto">
                  <button
                    onClick={undoLastChange}
                    disabled={history.length === 0}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all disabled:transform-none disabled:opacity-50"
                  >
                    ↶ Undo Last Change
                  </button>

                  {/* Button to start second inning */}
                  {currentInning === 1 && (
                    <Button className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold py-4 rounded-xl text-lg shadow-lg transform hover:scale-[1.02] transition-all">
                      🏏 Start Second Inning
                    </Button>
                  )}
                </div>
              </div>
            )}
    
      </div>
  );
}

export default ScoringControls;