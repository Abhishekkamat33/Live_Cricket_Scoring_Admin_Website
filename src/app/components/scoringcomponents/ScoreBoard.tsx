'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useScoring } from '../../components/ScoringContext';
import WinnerAnimation from '../scoringcomponents/winninganimation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';

interface PlayerStats {
  name: string;
  runs: number;
  balls: number;
  isStriker?: boolean;
  isNonStriker?: boolean;
  isOut?: boolean;
  sixes: number;
  fours: number;
  image?: string;
  howOut?: {
    howOut?: string;
    by?: string;
    bowler?: string;
  };
}

interface BowlingPlayer {
  name: string;
  overs: string; // e.g. "4.2"
  runs: number;
  wickets: number;
  isCurrentBowler?: boolean;
  image?: string;
  maiden?: number;
}

interface BattingTeam {
  name: string;
  battingOrder: PlayerStats[];
  overs: string; // e.g. "10.3"
}

interface BowlingTeam {
  name: string;
  bowlingOrder: BowlingPlayer[];
}

interface Inning {
  battingTeam: BattingTeam;
  bowlingTeam: BowlingTeam;
  totalRuns: number;
  wickets: number;
}

const ScoreBoard: React.FC = () => {
  const Router = useRouter();
  const { inningData, isSecondInning, iswinner, setIsWinner, match_data, setStrike, strike } = useScoring();

  const [battingTeam, setBattingTeam] = useState<BattingTeam | null>(null);
  const [bowlingTeam, setBowlingTeam] = useState<BowlingTeam | null>(null);
  const [striker, setStriker] = useState<PlayerStats | null>(null);
  const [nonStriker, setNonStriker] = useState<PlayerStats | null>(null);
  const [currentBowler, setCurrentBowler] = useState<BowlingPlayer | null>(null);
  const [result, setResult] = useState<string>('');
  const [target, setTarget] = useState<number>(0);
  const [activeBatsmen, setActiveBatsmen] = useState<PlayerStats[]>([]);

  
  // Convert overs string like "10.3" to balls count (63 balls)
  const oversToBalls = (oversStr: string): number => {
    if (!oversStr) return 0;
    const [whole, fraction] = oversStr.split('.');
    const wholeOvers = parseInt(whole, 10);
    const balls = fraction ? parseInt(fraction, 10) : 0;
    return wholeOvers * 6 + balls;
  };

  useEffect(() => {
    if (match_data) {
      setResult(match_data.matchWinner);
    }
  }, [match_data]);

  // Calculate run rate = total runs / overs bowled
  const calculateRunRate = (runs: number, oversStr: string): string => {
    const balls = oversToBalls(oversStr);
    if (balls === 0) return '0.00';
    return (runs / (balls / 6)).toFixed(2);
  };

  useEffect(() => {
    if (!inningData || inningData.length === 0) {
      setBattingTeam(null);
      setBowlingTeam(null);
      setStriker(null);
      setNonStriker(null);
      setCurrentBowler(null);
      return;
    }

    if (inningData.length === 2) {
      setTarget(inningData[0]?.totalRuns + 1);
    }

    const latestInning: Inning = inningData[inningData.length - 1];

    setBattingTeam(latestInning.battingTeam);
    setBowlingTeam(latestInning.bowlingTeam);

    const strikerBatsman = latestInning.battingTeam.battingOrder.find(
      (p) => p.isStriker === true && !p.isOut
    ) || null;

    const nonStrikerBatsman = latestInning.battingTeam.battingOrder.find(
      (p) => p.isNonStriker === true && !p.isOut
    ) || null;

    setStriker(strikerBatsman);
    setNonStriker(nonStrikerBatsman);


  


    const strikerBowler = latestInning.bowlingTeam.bowlingOrder.find(
      (p) => p.isCurrentBowler
    ) || null;

    setCurrentBowler(strikerBowler);
  }, [inningData ,match_data]);


useEffect(() => {
  if (striker && nonStriker) {
    // Create a new array with striker and nonStriker
    setActiveBatsmen([striker, nonStriker]);
  } else if (striker) {
    setActiveBatsmen([striker]);
  } else if (nonStriker) {
    setActiveBatsmen([nonStriker]);
  } else {
    setActiveBatsmen([]);
  }
}, [striker, nonStriker]);



  if (!battingTeam || !bowlingTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl w-full max-w-xs">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700 text-center">Loading match data...</p>
        </div>
      </div>
    );
  }

  const totalRuns = inningData[inningData.length - 1].totalRuns;
  const totalWickets = inningData[inningData.length - 1].wickets;
  const runRate = calculateRunRate(totalRuns, battingTeam.overs);

  const activeBowlers = bowlingTeam.bowlingOrder.filter(bowler => bowler.overs !== "0.0");
  const outBatsmen = battingTeam.battingOrder.filter(player => player.isOut);

  // Handler to close winner animation and reset winner in context
  const handleWinnerClose = () => {
    Router.push('/matches');
    setIsWinner('');
  };

  if (iswinner) {
    return isSecondInning ? (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 shadow-2xl text-center w-full max-w-md">
          <div className="animate-pulse text-6xl mb-6">🏏</div>
          <div className="text-2xl font-bold text-gray-700 mb-2">Second Inning in Progress...</div>
          <div className="text-gray-500">The match continues!</div>
        </div>
      </div>
    ) : (
      <WinnerAnimation winner={iswinner} onClose={handleWinnerClose} />
    );
  }

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Main Score Display */}
 <div className="relative max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-blue-900 via-indigo-900 to-purple-900 border border-white/20">
  {/* Decorative Gradient Circles */}
  <div className="absolute top-0 right-0 w-28 h-28 bg-white/20 backdrop-blur-md rounded-full -mr-14 -mt-14 animate-pulse"></div>
  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/15 backdrop-blur-md rounded-full -ml-10 -mb-10 animate-pulse delay-200"></div>

  <div className="relative px-8 py-8 sm:px-12 sm:py-10 flex flex-col sm:flex-row justify-between items-center">
    {/* Left - Team Info */}
    <div className="flex items-center space-x-5 mb-6 sm:mb-0">
      <div className="bg-white/25 backdrop-blur-md p-4 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-700/50 animate-bounce">
        <span className="text-4xl sm:text-5xl select-none">🏏</span>
      </div>
      <div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          {battingTeam.name}
        </h2>
        <div className="mt-1 flex items-center space-x-3 text-white/90 font-semibold text-md sm:text-lg">
          <span>{isSecondInning ? '2nd' : '1st'} Innings</span>
          <span className="text-xl font-bold">•</span>
          <span>{battingTeam.overs} Overs</span>
        </div>
      </div>
    </div>

    {/* Right - Score and Stats */}
    <div className="text-right space-y-4 min-w-[150px] sm:min-w-[220px]">
      <div className="flex items-baseline justify-end space-x-2">
        <span className="text-7xl sm:text-8xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
          {totalRuns}
        </span>
        <span className="text-4xl sm:text-5xl font-semibold text-white/70 tracking-wide">
          /{totalWickets}
        </span>
      </div>

      <div className="flex justify-end space-x-8 items-center text-white">
        <div className="flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">{runRate}</span>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-white/70 select-none">Run Rate</span>
        </div>
        {target > 0 && (
          <div className="bg-red-600/90 backdrop-blur-lg rounded-3xl px-5 py-3 shadow-lg shadow-red-700/70 animate-pulse select-none">
            <div className="uppercase font-bold tracking-widest text-xs sm:text-sm text-white opacity-90 mb-1 text-center">
              Target
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white text-center drop-shadow-md">
              {target}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>


        {/* Current Partnership */}
        <>
              <button
                type="button"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl px-4 py-3 sm:px-6 sm:py-3 shadow-lg transition-all duration-200 transform hover:scale-105 text-base sm:text-lg"
                aria-label="Swap strike between batsmen"
                onClick={() => setStrike(true)}
              >
                <span className="mr-2">🔄</span>
                Swap Strike
              </button>
          

<div className="space-y-4 p-4 rounded-xl max-w-full overflow-x-auto">
  {/* Header Row */}
  <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-4 bg-gray-100 rounded-xl font-bold text-gray-800 text-sm uppercase tracking-wide whitespace-nowrap">
    <span>Batsman</span>
    <span className="text-center">R</span>
    <span className="text-center">B</span>
    <span className="text-center">4s</span>
    <span className="text-center">6s</span>
    <span className="text-center">SR</span>
  </div>

  {/* For mobile/smallscreen: show a simpler header vertically for clarity */}
  <div className="sm:hidden flex flex-col space-y-3 px-2">
    <div className="flex justify-between font-bold text-gray-800 uppercase text-xs tracking-wide pr-8">
      <span>Batsman</span>
      <span>R-B-4s-6s-SR</span>
    </div>
  </div>

  {activeBatsmen.length === 0 ? (
    <div className="text-center text-gray-500 py-8">No batsmen on strike</div>
  ) : (
    activeBatsmen.map((batsman, idx) => (
      <div
        key={idx}
        className={`border rounded-xl p-4 transition-shadow duration-200 hover:shadow-md whitespace-nowrap ${
          batsman.isStriker
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
            : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
        }`}
      >
        {/* Desktop grid layout */}
        <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center">
          <div className="flex items-center space-x-2 truncate min-w-0">
            <span className="font-semibold text-gray-800 truncate">{batsman.name}</span>
            {batsman.isStriker && (
              <span>🏏</span>  
            )}
          </div>
          <span className="text-center font-bold text-blue-600">{batsman.runs}</span>
          <span className="text-center font-bold text-gray-700">{batsman.balls}</span>
          <span className="text-center font-bold text-purple-600">{batsman.fours}</span>
          <span className="text-center font-bold text-red-600">{batsman.sixes}</span>
          <span className="text-center font-semibold text-gray-700">
            {batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(2) : '0.00'}
          </span>
        </div>

        {/* Mobile stacked layout */}
        <div className="sm:hidden flex flex-col space-y-1">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="font-semibold text-gray-800 truncate">{batsman.name}</span>
            {batsman.isStriker && (
              <span>🏏</span>
            )}
          </div>
          <div className="flex justify-between text-sm text-gray-700 font-medium">
            <span>Runs: <span className="font-bold text-blue-600">{batsman.runs}</span></span>
            <span>Balls: <span className="font-bold">{batsman.balls}</span></span>
          </div>
          <div className="flex justify-between text-sm text-gray-700 font-medium">
            <span>4s: <span className="font-bold text-purple-600">{batsman.fours}</span></span>
            <span>6s: <span className="font-bold text-red-600">{batsman.sixes}</span></span>
            <span>SR: <span className="font-bold">{batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(2) : '0.00'}</span></span>
          </div>
        </div>
      </div>
    ))
  )}
</div>

      </>

        {/* Current Bowler */}
       <>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-100 p-2 rounded-xl">
                <span className="text-2xl">🎳</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Current Bowler</h3>
            </div>

            {currentBowler ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 shadow-lg">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1 truncate">{currentBowler.name}</h4>
                    <div className="text-sm text-gray-600 font-medium">BOWLER</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">{currentBowler.overs}</div>
                    <div className="text-sm text-gray-600 font-medium">OVERS</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-red-600">{currentBowler.runs}</div>
                    <div className="text-sm text-gray-600 font-medium">RUNS</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-bluefrom-blue-600">{currentBowler.wickets}</div>
                    <div className="text-sm text-gray-600 font-medium">WICKETS</div>
                  </div>
                </div>
                {currentBowler.overs !== "0.0" && (
                  <div className="mt-4 pt-4 border-t border-blue-200 text-center text-sm text-gray-600">
                    Economy Rate:{' '}
                    <span className="font-semibold text-gray-800">
                      {(currentBowler.runs / (oversToBalls(currentBowler.overs) / 6)).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-4 block">🎳</span>
                <p className="text-lg font-medium">No current bowler assigned</p>
              </div>
            )}
       </>

        {/* Fall of Wickets */}
       <>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-2 rounded-xl">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Fall of Wickets</h3>
            </div>

            {outBatsmen.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🏏</span>
                <p className="text-xl text-gray-500 font-medium">No wickets have fallen yet!</p>
                <p className="text-gray-400 mt-2">The partnership is going strong</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-4 p-4 bg-gray-100 rounded-xl font-bold text-gray-800 text-sm uppercase tracking-wide">
                  <span>Batsman</span>
                  <span className="text-center">R</span>
                  <span className="text-center">B</span>
                  <span>w</span>
                </div>
                {outBatsmen.map((player, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-200"
                  >
                    <span className="font-semibold text-gray-800 truncate">{player.name}</span>
                    <span className="text-center font-bold text-red-600">{player.runs}</span>
                    <span className="text-center text-gray-600">{player.balls}</span>
                    <span className="text-sm text-gray-700 truncate">
                      {player.howOut?.howOut
                        ? `${player.howOut.howOut}${player.howOut.by ? ` b ${player.howOut.by}` : ''}`
                        : 'Not specified'}
                    </span>
                  </div>
                ))}
              </div>
            )}
      </>

        {/* Bowling Analysis */}
   
          <>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-xl">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Bowling Analysis</h3>
            </div>

            {activeBowlers.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🎳</span>
                <p className="text-xl text-gray-500 font-medium">No bowlers have started yet!</p>
                <p className="text-gray-400 mt-2">Waiting for the first delivery</p>
              </div>
            ) : (
              <div className="space-y-4 ">
                <div className="grid grid-cols-[3fr_2fr_1fr_1fr_1fr_1fr] gap-4 p-4 bg-gray-100 rounded-xl font-bold text-gray-800 text-sm uppercase tracking-wide">
                  <span>B</span>
                  <span className="text-center">O</span>
                  <span className="text-center">R</span>
                  <span className="text-center">M</span>
                  <span className="text-center">W</span>
                  <span className="text-center">EC</span>
                </div>
                {activeBowlers.map((bowler, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] gap-2 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${bowler.isCurrentBowler
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                      : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                      }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-small text-gray-800">{bowler.name}</span>
                      {bowler.isCurrentBowler && (
                        <span className="text-xs text-gray-600 font-semibold">🎯</span>
                      )}
                    </div>
                    <span className="text-center font-bold text-blue-600">{bowler.overs}</span>
                    <span className="text-center font-bold text-red-600">{bowler.runs}</span>
                    <span className="text-center font-bold text-green-600">{bowler?.maiden || '0'}</span>
                    <span className="text-center font-bold text-bluefrom-blue-600">{bowler.wickets}</span>
                    <span className="text-center text-gray-700 font-semibold">
                      {bowler.overs !== "0.0"
                        ? (bowler.runs / (oversToBalls(bowler.overs) / 6)).toFixed(2)
                        : '0.00'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
      

      </div>
    </div>
  );
};

export default ScoreBoard;
