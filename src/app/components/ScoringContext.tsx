'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, use } from 'react';
import { db } from '@/firebaseConfig';
import { collection, doc, getDoc, increment, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';


type BallEntry = {
  name: string;
  runs: number;
  isWide: boolean;
  isNoBall: boolean;
  isBye: boolean;
  isLegBye: boolean;
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';
};
interface CommentaryEntry {
  text: string;
  runs?: number;
  wickets?: number;
  wicketType?: string | null;
  strikerName?: string;
  currentBowler?: string;
  fielder?: string;
  wides?: number;
  noBalls?: number;
  byes?: number;
  legByes?: number;
  balls?: number;
  timestamp?: Date;
}


type Inning = {
  id?: string;
  battingTeam: {
    name: string;
    wickets: number;
    score: number;
    overs: string;
    battingOrder: any[]; // You can define a more specific type for players if needed
  };
  bowlingTeam: {
    name: string;
    wickets: number;
    score: number;
    overs: string;
    bowlingOrder: any[];
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

type ScoringContextType = {
  runs: number; setRuns: React.Dispatch<React.SetStateAction<number>>;
  extras: number; setExtras: React.Dispatch<React.SetStateAction<number>>;
  byes: number; setByes: React.Dispatch<React.SetStateAction<number>>;
  legByes: number; setLegByes: React.Dispatch<React.SetStateAction<number>>;
  wickets: number; setWickets: React.Dispatch<React.SetStateAction<number>>;
  wides: number; setWides: React.Dispatch<React.SetStateAction<number>>;
  noBalls: number; setNoBalls: React.Dispatch<React.SetStateAction<number>>;
  balls: number; setBalls: React.Dispatch<React.SetStateAction<number>>;
  overs: string; setOvers: React.Dispatch<React.SetStateAction<string>>;
  ballSummary: Record<number, BallEntry>;
  strikerName: string; setStrikerName: React.Dispatch<React.SetStateAction<string>>;
  nonStrikerName: string; setNonStrikerName: React.Dispatch<React.SetStateAction<string>>;
  strike: boolean; setStrike: React.Dispatch<React.SetStateAction<boolean>>;
  strikeSwapInProgress: boolean;
  setBallSummary: React.Dispatch<React.SetStateAction<Record<number, BallEntry>>>;
  match_id: string; setMatch_id: React.Dispatch<React.SetStateAction<string>>;
  currentInning: number; setCurrentInning: React.Dispatch<React.SetStateAction<number>>;
  match_data: any; setMatch_data: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean; setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  battingTeam: any; setBattingTeam: React.Dispatch<React.SetStateAction<any>>;
  bowlingTeam: any; setBowlingTeam: React.Dispatch<React.SetStateAction<any>>;
  totalRuns: number; setTotalRuns: React.Dispatch<React.SetStateAction<number>>;
  currentBowler: string; setCurrentBowler: React.Dispatch<React.SetStateAction<string>>;
  inningData: any; setInningData: React.Dispatch<React.SetStateAction<any>>;
  newBatsman: string; setNewBatsman: React.Dispatch<React.SetStateAction<string>>;
  outBatsman: string; setOutBatsman: React.Dispatch<React.SetStateAction<string>>;
  fielderName: string; setFielderName: React.Dispatch<React.SetStateAction<string>>;
  fetchDataFirst: any; setFetchDataFirst: React.Dispatch<React.SetStateAction<any>>;
  wicketType: string; setWicketType: React.Dispatch<React.SetStateAction<string>>;
  isSecondInning: boolean; setIsSecondInning: React.Dispatch<React.SetStateAction<boolean>>;
  target: number; setTarget: React.Dispatch<React.SetStateAction<number>>;
  iswinner: string; setIsWinner: React.Dispatch<React.SetStateAction<string>>;
  undo: Inning | null;
  setUndo: React.Dispatch<React.SetStateAction<Inning | null>>;
  recentBowler: boolean; setRecentBowler: React.Dispatch<React.SetStateAction<boolean>>;
  recentBowlerName: any; setRecentBowlerName: React.Dispatch<React.SetStateAction<any>>;
};

const ScoringContext = createContext<ScoringContextType | undefined>(undefined);

export const ScoringProvider = ({ children }: { children: ReactNode }) => {
  // State variables
  const [runs, setRuns] = useState(0);
  const [extras, setExtras] = useState(0);
  const [byes, setByes] = useState(0);
  const [legByes, setLegByes] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [wides, setWides] = useState(0);
  const [noBalls, setNoBalls] = useState(0);
  const [balls, setBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");
  const [ballSummary, setBallSummary] = useState<Record<number, BallEntry>>({});
  const [strikerName, setStrikerName] = useState('');
  const [nonStrikerName, setNonStrikerName] = useState('');
  const [currentInning, setCurrentInning] = useState(0);
  const [match_id, setMatch_id] = useState('');
  const [strike, setStrike] = useState(false);
  const [strikeSwapInProgress, setStrikeSwapInProgress] = useState(false);
  const [match_data, setMatch_data] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [battingTeam, setBattingTeam] = useState<any | null>(null);
  const [bowlingTeam, setBowlingTeam] = useState<any | null>(null);
  const [totalRuns, setTotalRuns] = useState(0);
  const [currentBowler, setCurrentBowler] = useState<string>('');
  const [inningData, setInningData] = useState<any[]>([]);
  const [newBatsman, setNewBatsman] = useState<string>('');
  const [outBatsman, setOutBatsman] = useState<string>('');
  const [fielderName, setFielderName] = useState<string>('');
  const [fetchDataFirst, setFetchDataFirst] = useState<any | null>(null);
  const [wicketType, setWicketType] = useState('');
  const [isSecondInning, setIsSecondInning] = useState(false);
  const [target, setTarget] = useState(0);
  const [iswinner, setIsWinner] = useState('');
  const [undo, setUndo] = useState<Inning | null>(null);
  const [recentBowler, setRecentBowler] = useState<boolean>(false);
  const [recentBowlerName, setRecentBowlerName] = useState<any>('');
  const [commentaryArray, setCommentaryArray] = useState<CommentaryEntry[]>([]);





  // Helper functions
  const oversToBalls = (oversStr: string): number => {
    if (!oversStr) return 0;
    const [whole, part] = oversStr.split('.');
    return (parseInt(whole) * 6) + (parseInt(part) || 0);
  };

  const ballsToOvers = (ballsCount: number): string => {
 

    const whole = Math.floor(ballsCount / 6);
    const part = ballsCount % 6;
    return `${whole}.${part}`;
  };

  const calculateOvers = (ballsCount: number): string => ballsToOvers(ballsCount);





  useEffect(() => {
    if (!match_id) return
    if (iswinner !== '' || iswinner !== null || iswinner !== undefined) {
      const saveisWinner = async () => {
        await updateDoc(doc(db, 'matches', match_id), {
          iswinner: iswinner,
          matchStatus: 'completed'
        })
      }
      saveisWinner()
      return
    }
    return

  }, [iswinner,])

  // Initialize React state from Firestore when match_id or currentInning changes
  useEffect(() => {
    if (!match_id) return;

    const inningDocRef = doc(db, 'matches', match_id, 'innings', `inning${fetchDataFirst}`);

    const fetchInningData = async () => {
      try {
        const inningSnap = await getDoc(inningDocRef);
        if (inningSnap.exists()) {
          const data = inningSnap.data();
          const target = inningData[0]?.totalRuns + 1;
          setTarget(target);




          const battingOrder = data.battingTeam?.battingOrder ?? [];
          setStrikerName(battingOrder.find((p: any) => p.isStriker)?.name ?? '');
          setNonStrikerName(battingOrder.find((p: any) => p.isNonStriker)?.name ?? '');

          const bowlingOrder = data.bowlingTeam?.bowlingOrder ?? [];
          setCurrentBowler(bowlingOrder.find((p: any) => p.isCurrentBowler)?.name ?? '');

          setBattingTeam(data.battingTeam ?? null);
          setBowlingTeam(data.bowlingTeam ?? null);



          // Reset wicket-related states
          setNewBatsman('');
          setOutBatsman('');
          setFielderName('');
        } else {
          // No inning data found, reset states
          setRuns(0);
          setExtras(0);
          setByes(0);
          setLegByes(0);
          setWickets(0);
          setWides(0);
          setNoBalls(0);
          setBalls(0);
          setOvers("0.0");
          setTotalRuns(0);
          setStrikerName('');
          setNonStrikerName('');
          setCurrentBowler('');
          setBattingTeam(null);
          setBowlingTeam(null);
          setNewBatsman('');
          setOutBatsman('');
          setFielderName('');
        }
      } catch (error) {
        //console.error('Error fetching inning data:', error);
      }
    };



    fetchInningData();
  }, [fetchDataFirst]);


  // Listen to inning collection realtime updates (optional, for UI sync)
  useEffect(() => {
    if (!match_id) return;

    const inningsRef = collection(db, 'matches', match_id, 'innings');

    const unsubscribe = onSnapshot(
      inningsRef,
      (snapshot) => {
        const inningsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInningData(inningsData);
      },
      (error) => {
        //console.error('Error fetching realtime innings:', error);
      }
    );

    return () => unsubscribe();
  }, [match_id]);

  const fixedOver = match_data?.overPlayed;



  useEffect(() => {
    if (!match_id || !inningData || inningData.length === 0 || !match_data) return;

    const totalWickets = inningData[inningData.length - 1].wickets;
    const totalOvers = inningData[inningData.length - 1]?.overs;

    function oversToBalls(oversStr: string): number {
      if (!oversStr) return 0;
      const [whole, fraction] = oversStr.split('.');
      const wholeOvers = parseInt(whole, 10);
      const balls = fraction ? parseInt(fraction, 10) : 0;
      return wholeOvers * 6 + balls;
    }

    const totalBalls = oversToBalls(totalOvers);
    const fixedBalls = fixedOver * 6;



    if (inningData.length > 1) {
      const firstInning = inningData[0];
      const secondInning = inningData[1];

      // 1. Early win by chasing team (second inning)
      if (secondInning.totalRuns > firstInning.totalRuns) {
        setIsWinner(secondInning.battingTeam.name);
      }
      // 2. Overs completed, decide winner or draw
      else if (totalBalls === fixedBalls) {
        if (firstInning.totalRuns > secondInning.totalRuns) {
          setIsWinner(firstInning.battingTeam.name);
        } else if (secondInning.totalRuns > firstInning.totalRuns) {
          setIsWinner(secondInning.battingTeam.name);
        } else {
          setIsWinner('Draw');
        }
      }
      // 3. Innings ended early due to all wickets lost
      else if (firstInning.wicket === 10 && firstInning.totalRuns > secondInning.totalRuns) {
        setIsWinner(firstInning.battingTeam.name);
      } else if (secondInning.wicket === 10 && secondInning.totalRuns > firstInning.totalRuns) {
        setIsWinner(secondInning.battingTeam.name);
      } else if (firstInning.wicket === 10 && firstInning.totalRuns === secondInning.totalRuns) {
        setIsWinner('Draw');
      }
    } else {
      setIsWinner('');
    }


    // Alert if all out
    if (totalWickets >= 10) {
      setIsSecondInning(true);
      setOvers("0.0");
      setBalls(0);
      setRuns(0);
      return;
    }

    // Start second inning if overs completed
    if (totalBalls >= fixedBalls) {
      setIsSecondInning(true);
      
      setOvers("0.0");
      setBalls(0);
      setRuns(0);
      return;
    }
    setIsSecondInning(false);
  }, [match_id, inningData, match_data, fixedOver]);


  // Save current inning data on key state changes
  useEffect(() => {

    if (!match_id) return;

    const saveCurrentInning = async () => {


      if (
        !battingTeam ||
        !bowlingTeam ||
        !strikerName ||
        !nonStrikerName ||
        !match_id
      ) return;



      const battingOrder = battingTeam.players?.map((player: any) => ({
        name: player.name,
        runs: player.runs ?? 0,
        balls: player.balls ?? 0,
        fours: player.fours ?? 0,
        sixes: player.sixes ?? 0,
        strikeRate: player.strikeRate ?? 0,
        battingAverage: player.battingAverage ?? 0,
        image: player.imageUrl ?? '',
        isStriker: player.name === strikerName,
        isNonStriker: player.name === nonStrikerName,
        batting_position: player.name === strikerName ? 1 : player.name === nonStrikerName ? 2 : 0,
        isOut: player.isOut ?? false,
        howOut: {
          by: player.howOut?.by ?? '',
          howOut: player.howOut?.howOut ?? '',
          bowler: player.howOut?.bowler ?? '',
        }
      })) || [];

      const bowlingOrder = bowlingTeam.players?.map((player: any) => ({
        name: player.name,
        overs: player.overs ?? "0.0",
        runs: player.runs ?? 0,
        wickets: player.wickets ?? 0,
        economy: player.economy ?? 0,
        maiden: player.maiden ?? 0,
        image: player.imageUrl ?? '',
        playerWickets: player.playerWickets ?? [],
        bowlingAverage: player.bowlingAverage ?? 0,
        strikeRate: player.strikeRate ?? 0,
        isCurrentBowler: player.name === currentBowler,
        bowling_position: player.name === currentBowler ? 1 : 0,
        wides: player.wides ?? 0,
        noBalls: player.noBalls ?? 0
      })) || [];



      const inningData = {
        battingTeam: {
          name: battingTeam.name,
          wickets: wickets || 0,
          score: totalRuns,
          overs: overs,
          battingOrder,
          partnership: [
            {
              batsman1: strikerName,
              batsman2: nonStrikerName,
              wicketNo: wickets,
              balls: balls,
              runs: 0
            }
          ],

        },
        bowlingTeam: {
          name: bowlingTeam.name,
          wickets: bowlingTeam.wickets || 0,
          score: totalRuns,
          overs: overs,
          bowlingOrder,
        },

        totalRuns: totalRuns,
        extras: extras,
        wickets: wickets || 0,
        balls: balls,
        wides: wides,
        noBalls: noBalls,
        byes: byes,
        legByes: legByes,
        updatedAt: new Date().toISOString(),
        matchId: match_id,
        overs: overs,
        inningNumber: currentInning
      };



      if (currentInning === 2) {
        const battingOrder = battingTeam.players?.map((player: any) => ({
          name: player.name,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          battingAverage: 0,
          isStriker: player.name === strikerName,
          isNonStriker: player.name === nonStrikerName,
          batting_position: player.name === strikerName ? 1 : player.name === nonStrikerName ? 2 : 0,
          isOut: false,
          howOut: {
            by: '',
            howOut: '',
            bowler: '',
          }
        })) || [];

        const bowlingOrder = bowlingTeam.players?.map((player: any) => ({
          name: player.name,
          overs: "0.0",
          runs: 0,
          wickets: 0,
          economy: 0,
          playerWickets: [],
          bowlingAverage: 0,
          strikeRate: 0,
          isCurrentBowler: player.name === currentBowler,
          bowling_position: 1,
        })) || [];

        const inningData2 = {
          battingTeam: {
            name: battingTeam.name,
            wickets: 0,
            score: 0,
            overs: '0.0',
            battingOrder,
            partnership: [
              {
                batsman1: strikerName,
                batsman2: nonStrikerName,
                runs: 0,
                wicketNo: wickets,
                balls: balls
              }
            ],
            fallofWickets: [
              {
                score: totalRuns,
                wickets: wickets,
                outBatsman: "",
                bowler: currentBowler,
                overs: overs,
              }
            ],
          },
          bowlingTeam: {
            name: battingTeam.name,
            wickets: 0,
            score: 0,
            overs: '0.0',
            bowlingOrder,
          },

          totalRuns: 0,
          extras: extras,
          wickets: 0,
          balls: 0,
          wides: 0,
          noBalls: 0,
          byes: 0,
          legByes: 0,
          updatedAt: new Date().toISOString(),
          matchId: match_id,
          overs: "0.0",
          inningNumber: currentInning,
          target: target

        }
        try {
          await setDoc(doc(db, 'matches', match_id, 'innings', `inning${currentInning}`), inningData2);
          const matchDocRef = doc(db, 'matches', match_id);
          await updateDoc(matchDocRef, {
            firstInningCompleted: true
          });
          setIsSecondInning(false);
          // //console.log('Inning data saved successfully');
        } catch (error) {
          //console.error('Error saving inning data:', error);
        }
        return
      }



      try {
        await setDoc(doc(db, 'matches', match_id, 'innings', `inning${currentInning}`), inningData);
        const matchDocRef = doc(db, 'matches', match_id);
        await updateDoc(matchDocRef, {
          matchStatus: 'live'
        });
      } catch (error) {
        console.error('Error saving inning data:', error);
      }
    };

    saveCurrentInning();
  }, [currentInning]);

  // Update overs string and alert on over completion
  useEffect(() => {
    const completedOvers = Math.floor(balls / 6);
    const ballsInCurrentOver = balls % 6;
    setOvers(`${completedOvers}.${ballsInCurrentOver}`);

    if (ballsInCurrentOver === 0 && balls > 0) {
      alert(`Over ${completedOvers} completed! Please select new bowler.`);
      setCurrentBowler('');
      // Additional logic to prompt new bowler input can go here
    }
  }, [balls]);

  // Swap strike in Firestore when strike state changes
  useEffect(() => {
    if (!match_id) return;

    const swapStrike = async () => {
      setStrikeSwapInProgress(true);
      try {
        const inningDocRef = doc(db, 'matches', match_id, 'innings', `inning${fetchDataFirst}`);
        const inningSnap = await getDoc(inningDocRef);

        if (!inningSnap.exists()) {
          //console.warn('Inning document does not exist');
          setStrikeSwapInProgress(false);
          return;
        }

        const inningData = inningSnap.data();
        const currentBattingOrder = inningData?.battingTeam?.battingOrder || [];

        const updatedBattingOrder = currentBattingOrder.map((player: any) => {
          if (player.isStriker) {
            return { ...player, isStriker: false, isNonStriker: true };
          }
          if (player.isNonStriker) {
            return { ...player, isStriker: true, isNonStriker: false };
          }
          return player;
        });

        await updateDoc(inningDocRef, {
          'battingTeam.battingOrder': updatedBattingOrder,
        });

        setStrike(false);
      } catch (error) {
        //console.error('Error swapping striker/non-striker:', error);
      } finally {
        setStrikeSwapInProgress(false);
      }
    };

    if (strike) {
      swapStrike();
    }
  }, [strike]);

  // Update isCurrentBowler flag when currentBowler changes
  useEffect(() => {
    if (!match_id) return;

    const inningNo = (inningData?.length);


    const updateCurrentBowlerFlag = async () => {
      if (recentBowler === true) return
      try {
        const inningDocRef = doc(db, 'matches', match_id, 'innings', `inning${inningNo}`);
        const inningSnap = await getDoc(inningDocRef);
        if (!inningSnap.exists()) return;


        const inningData = inningSnap.data();
        const bowlingOrder = inningData?.bowlingTeam?.bowlingOrder || [];


        const updatedBowlingOrder = bowlingOrder.map((player: any) => ({
          ...player,
          isCurrentBowler: player.name === currentBowler,
        }));


        await updateDoc(inningDocRef, {
          'bowlingTeam.bowlingOrder': updatedBowlingOrder,
          'bowlingTeam.recentBowler': recentBowler
        });


        setBowlingTeam((prev: any) => ({
          ...prev,
          bowlingOrder: updatedBowlingOrder,
        }));
      } catch (error) {
        //console.error('Failed to update current bowler flag:', error);
      }
    };


    if (currentBowler) {
      updateCurrentBowlerFlag();
    }
  }, [currentBowler]);


  //update bolwer current value

  useEffect(() => {

    if (!match_id) return
    if (recentBowler === false) return

    const updateCurrentBowler = async () => {
      try {
        const inningDocRef = doc(db, 'matches', match_id, 'innings', `inning${fetchDataFirst}`);
        const inningSnap = await getDoc(inningDocRef);
        if (!inningSnap.exists()) return;
        const inningData = inningSnap.data();
        const bowlingOrder = inningData?.bowlingTeam?.bowlingOrder || [];

        // If recentBowler is boolean true, then set isCurrentBowler = false for the current abowler
        if (recentBowler === true) {
          const updatedBowlingOrder = bowlingOrder.map((player: any) => ({
            ...player,
            isCurrentBowler: false,   // Clear all current bowler flags
          }));

          await updateDoc(inningDocRef, {
            'bowlingTeam.bowlingOrder': updatedBowlingOrder,
          });
          setBowlingTeam((prev: any) => ({
            ...prev,
            bowlingOrder: updatedBowlingOrder,
          }));
        }
      } catch (error) {
        //console.error('Failed to update current bowler flag:', error);
      }
    }

    // Only update if recentBowler is true or a string (your logic)
    if (recentBowler === true || typeof recentBowler === 'boolean') {
      updateCurrentBowler();
    }
  }, [recentBowler]);



  // Update inning stats on ball/run changes
  useEffect(() => {
    if (match_data?.matchWinner) {
      return
    }
    if (!match_id) return;
    if (strikeSwapInProgress) return;

    if (
      balls === 0 &&
      runs === 0 &&
      extras === 0 &&
      byes === 0 &&
      wides === 0 &&
      noBalls === 0 &&
      currentBowler === '' &&
      wickets === 0
    ) {
      return;
    }



    const inningDocRef = doc(db, 'matches', match_id, 'innings', `inning${fetchDataFirst}`);
    const matchDocRef = doc(db, 'matches', match_id);



    const updateInning = async () => {
      try {
        const inningSnap = await getDoc(inningDocRef);
        if (!inningSnap.exists()) return;



        const inningData = inningSnap.data();

        const previousBalls = inningData?.balls ?? 0;
        const newTotalBalls = previousBalls + balls;
        const newTotalRuns = inningData?.totalRuns + runs + noBalls + byes + wides + legByes + extras;
        const newTotalNoballs = inningData?.noballs + noBalls;
        const newTotalByes = inningData?.byes + byes;
        const newTotalExtras = inningData?.extras + extras;
        const newTotalLegByes = (inningData?.legbyes + legByes) || 0;
        const newTotalwides = inningData?.wides + wides;
        const six = runs === 6 ? 1 : 0;
        const four = runs === 4 ? 1 : 0;

        const oversFormatted = calculateOvers(newTotalBalls);
        const currentBallInOver = (previousBalls + balls - 1) % 6;

        const Allcommentary: CommentaryEntry[] = inningData?.commentary || [];









        if (wickets === 1) {
          const currentBattingOrder = inningData?.battingTeam?.battingOrder ?? [];
          const currentBowlingOrder = inningData?.bowlingTeam?.bowlingOrder ?? [];

          // Find out if the out batsman is striker or non-striker
          const outPlayer = currentBattingOrder.find((p: any) => p.name === outBatsman);
          const outIsStriker = outPlayer?.isStriker ?? false;
          const outIsNonStriker = outPlayer?.isNonStriker ?? false;

          // Determine if runs are odd or even (for strike rotation)
          const runsAreOdd = runs % 2 === 1;

          // Update batting order
          let updatedBattingOrder = currentBattingOrder.map((player: any) => {
            if (player.name === outBatsman) {
              // Mark out batsman as out and update runs/balls
              return {
                ...player,
                isOut: true,
                balls: (player.balls ?? 0) + balls,
                isStriker: false,
                isNonStriker: false,
                runs: player.runs + runs,
                howOut: {
                  by: fielderName || '',
                  howOut: wicketType || '',
                  bowler: currentBowler || player.howOut?.bowler || '',
                },
              };
            }

            if (player.name === newBatsman) {
              // New batsman takes strike if out batsman was striker, else non-striker
              return {
                ...player,
                isOut: false,
                isStriker: outIsStriker,
                isNonStriker: outIsNonStriker,
              };
            }


            // For other players, update strike flags depending on runs and who got out
            if (wicketType === "runout") {
              if (outIsStriker) {
                if (runsAreOdd) {
                  // Strike rotates: non-striker becomes striker, striker becomes non-striker
                  if (player.isNonStriker) {
                    return { ...player, isStriker: false, isNonStriker: true };
                  }
                  if (player.isStriker) {
                    return { ...player, isStriker: true, isNonStriker: false };
                  }
                } else {
                  // Runs even: no strike change
                  if (player.isNonStriker) {
                    return { ...player, isStriker: false, isNonStriker: true };
                  }
                  if (player.isStriker) {
                    return { ...player, isStriker: true, isNonStriker: false };
                  }
                }
              } else if (outIsNonStriker) {
                if (runsAreOdd) {
                  // Strike rotates: striker becomes non-striker, non-striker becomes striker
                  if (player.isStriker) {
                    return { ...player, isStriker: false, isNonStriker: true };
                  }
                  if (player.isNonStriker) {
                    return { ...player, isStriker: true, isNonStriker: false };
                  }
                } else {
                  // Runs even: no strike change
                  if (player.isStriker) {
                    return { ...player, isStriker: true, isNonStriker: false };
                  }
                  if (player.isNonStriker) {
                    return { ...player, isStriker: false, isNonStriker: true };
                  }
                }
              }
            } else {
              // For other wicket types, no strike rotation here
              // Keep strike flags as is for other players
            }

            return player;
          });
          // Prevent adding new batsman if already out
          const existingBatsman = currentBattingOrder.find((p: any) => p.name === newBatsman);
          if (existingBatsman && existingBatsman.isOut) {
            alert(`Player "${newBatsman}" is already out. Please select a different batsman.`);
            return; // Stop execution
          }


          const maxPosition = updatedBattingOrder.reduce((max: number, player: any) => {
            return player.batting_position && player.batting_position > max ? player.batting_position : max;
          }, 0);
          // Add new batsman if not present and not out
          const newBatsmanExists = updatedBattingOrder.some((p: any) => p.name === newBatsman);
          if (!newBatsmanExists && newBatsman) {
            // Get current maximum batting_position or 0 if none
            updatedBattingOrder.push({
              name: newBatsman,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0,
              battingAverage: 0,
              isOut: false,
              isStriker: outIsStriker,
              isNonStriker: outIsNonStriker,
              howOut: { by: '', howOut: '', bowler: '' },
              batting_position: maxPosition + 1
            });
          }

          // Over-end strike swap for certain wicket types and last ball in over
          if (
            currentBallInOver === 5 &&
            ['caught', 'lbw', 'bowled', 'stumped'].includes(wicketType)
          ) {
            if (runs % 2 === 0) {
              updatedBattingOrder = updatedBattingOrder.map((player: any) => {
                if (player.isStriker) return { ...player, isStriker: false, isNonStriker: true, batting_position: maxPosition + 1 };
                if (player.isNonStriker) return { ...player, isStriker: true, isNonStriker: false, batting_position: maxPosition + 1 };
                return player;
              });
            }
          }

          // Update bowling order with bowler stats
          const updatedBowlingOrder = currentBowlingOrder.map((player: any) => {
            if (player.name === currentBowler) {
              const previousBallsBowled = player.balls ?? 0;
              const previousWickets = player.wickets ?? 0;
              const previousRunsConceded = player.runs ?? 0;
              const previousNoballs = player.noballs ?? 0;
              const previousWides = player.wides ?? 0;

              // Increment wickets only if NOT a runout
              const newWickets = wicketType === 'runout' ? previousWickets : previousWickets + 1;



              // Add wicket to playerWickets only if NOT a runout
              const newPlayerWickets = wicketType === 'runout' ? (player.playerWickets || []) : [...(player.playerWickets || []), outBatsman];

              return {
                ...player,
                playerWickets: newPlayerWickets,
                balls: previousBallsBowled + balls,
                wickets: newWickets,
                runs: previousRunsConceded + runs + noBalls + wides,
                overs: calculateOvers(previousBallsBowled + balls),
                isCurrentBowler: true,
                noballs: previousNoballs + noBalls,
                wides: previousWides + wides,
              };
            }
            return {
              ...player,
              isCurrentBowler: false,
            };
          });

          // Prepare updated total wickets (increment by 1)
          const newTotalWickets = (inningData?.wickets ?? 0) + 1;

          const updateBatsmanposition = updatedBattingOrder.map((player: any) => {
            if (player.name === newBatsman) {
              return {
                ...player,
                batting_position: maxPosition + 1,
              };
            }
            return player;
          })

          // Update Firestore document with new inning stats
          await updateDoc(inningDocRef, {
            'battingTeam.battingOrder': updateBatsmanposition,
            'battingTeam.score': newTotalRuns,
            'battingTeam.wickets': newTotalWickets,
            commentary: commentaryArray,
            wickets: newTotalWickets,
            balls: newTotalBalls,
            totalRuns: newTotalRuns,
            overs: oversFormatted,
            extras: newTotalExtras,
            wides: newTotalwides,
            noBalls: newTotalNoballs,
            'battingTeam.overs': oversFormatted,
            'bowlingTeam.score': newTotalRuns,
            'bowlingTeam.recentBowler': recentBowlerName,
            'bowlingTeam.bowlingOrder': updatedBowlingOrder,
            'bowlingTeam.wickets': newTotalWickets,
            updatedAt: new Date().toISOString(),
          });



          if (fetchDataFirst === 1) {
            if (match_data.tossWinner === match_data.teamA.name && match_data.tossDecision === 'bat') {
              await updateDoc(matchDocRef, {
                'teamA.score': newTotalRuns,
                'teamA.wickets': increment(1),
                'teamA.overs': oversFormatted,
              });
            } else if (match_data.tossWinner === match_data.teamB.name && match_data.tossDecision === 'bat') {
              await updateDoc(matchDocRef, {
                'teamB.score': newTotalRuns,
                'teamB.wickets': increment(1),
                'teamB.overs': oversFormatted,
              });
            }
          } else if (fetchDataFirst === 2) {
            // Opposite team update — assuming second innings is the other team batting
            if (match_data.tossWinner === match_data.teamA.name && match_data.tossDecision === 'bat') {
              // Team B batting second innings
              await updateDoc(matchDocRef, {
                'teamB.score': newTotalRuns,
                'teamB.wickets': increment(1),
                'teamB.overs': oversFormatted,
              });
            } else if (match_data.tossWinner === match_data.teamB.name && match_data.tossDecision === 'bat') {
              // Team A batting second innings
              await updateDoc(matchDocRef, {
                'teamA.score': newTotalRuns,
                'teamA.wickets': increment(wickets),
                'teamA.overs': oversFormatted,
              });
            }
          }

          // Update local batting team state
          setBattingTeam((prev: any) => ({
            ...prev,
            battingOrder: updatedBattingOrder,
          }));

          // Reset ball-level stats for next ball
          setBalls(0);
          setRuns(0);
          setExtras(0);
          setByes(0);
          setLegByes(0);
          setWickets(0);
          setWides(0);
          setNoBalls(0);
          setNewBatsman('');
          setFielderName('');
          setOutBatsman('');

          ////console.log('Wicket update done');
        } else {
          // Normal run/ball update logic
          const currentBattingOrder = inningData?.battingTeam?.battingOrder ?? [];
          const updatedBattingOrder = currentBattingOrder.map((player: any) => {
            if (player.isStriker) {
              return {
                ...player,
                runs: (player.runs ?? 0) + runs,
                balls: (player.balls ?? 0) + balls,
                sixes: (player.sixes ?? 0) + six,
                fours: (player.fours ?? 0) + four,
              };
            }
            return player;
          });

          console.log('balls', balls);

          const currentBowlingOrder = inningData?.bowlingTeam?.bowlingOrder ?? [];
          const updatedBowlingOrder = currentBowlingOrder.map((player: any) => {
            if (player.name === currentBowler) {
              return {
                ...player,
                balls: (player.balls ?? 0) + balls,
                runs: (player.runs ?? 0) + runs + wides + noBalls,
                wickets: (player.wickets ?? 0) + wickets,
                overs: calculateOvers((player.balls ?? 0) + balls),
                isCurrentBowler: true,
                noballs: (player.noballs ?? 0) + noBalls,
                wides: (player.wides ?? 0) + wides,
                maiden: (player.maiden ?? 0) 
              };
            }
            return {
              ...player,
              isCurrentBowler: false,
            };
          });

          let battingOrderToSave = updatedBattingOrder;


          if (currentBallInOver === 5 && wickets === 0) {
            if (runs % 2 === 0 || byes % 2 === 0 || legByes % 2 === 0) {
              battingOrderToSave = updatedBattingOrder.map((player: any) => {
                if (player.isStriker) return { ...player, isStriker: false, isNonStriker: true };
                if (player.isNonStriker) return { ...player, isStriker: true, isNonStriker: false };
                return player;
              });
            }
          } else {
            if (runs !== 0 && runs % 2 !== 0 || byes !== 0 && byes % 2 !== 0 || legByes !== 0 && legByes % 2 !== 0) {
              battingOrderToSave = updatedBattingOrder.map((player: any) => {
                if (player.isStriker) return { ...player, isStriker: false, isNonStriker: true };
                if (player.isNonStriker) return { ...player, isStriker: true, isNonStriker: false };
                return player;
              });
            }
          }




          // commentary
          // Commentary line generator function


          await updateDoc(inningDocRef, {
            'battingTeam.battingOrder': battingOrderToSave,
            'battingTeam.score': newTotalRuns,
            'battingTeam.overs': oversFormatted,
            'bowlingTeam.score': newTotalRuns,
            'bowlingTeam.overs': oversFormatted,
            'bowlingTeam.recentBowler': recentBowlerName,
            'bowlingTeam.bowlingOrder': updatedBowlingOrder,
            totalRuns: newTotalRuns,
            overs: oversFormatted,
            balls: newTotalBalls,
            extras: newTotalExtras,
            byes: newTotalByes,
            legByes: newTotalLegByes,
            wides: newTotalwides,
            noBalls: noBalls,
            iswinner: iswinner,
            updatedAt: new Date().toISOString(),
          });

          await updateDoc(matchDocRef, {
            totalRuns: newTotalRuns,
          })

          if (fetchDataFirst === 1) {
            if (match_data.tossWinner === match_data.teamA.name && match_data.tossDecision === 'bat') {
              await updateDoc(matchDocRef, {
                'teamA.score': newTotalRuns,
                'teamA.overs': oversFormatted,
              });
            } else if (match_data.tossWinner === match_data.teamB.name && match_data.tossDecision === 'bat') {
              await updateDoc(matchDocRef, {
                'teamB.score': newTotalRuns,
                'teamB.overs': oversFormatted,
              });
            }
          } else if (fetchDataFirst === 2) {
            // Opposite team update — assuming second innings is the other team batting
            if (match_data.tossWinner === match_data.teamA.name && match_data.tossDecision === 'bat') {
              // Team B batting second innings
              await updateDoc(matchDocRef, {
                'teamB.score': newTotalRuns,
                'teamB.overs': oversFormatted,
              });
            } else if (match_data.tossWinner === match_data.teamB.name && match_data.tossDecision === 'bat') {
              // Team A batting second innings
              await updateDoc(matchDocRef, {
                'teamA.score': newTotalRuns,
                'teamA.overs': oversFormatted,
              });
            }
          }


          // Update local batting team state
          setBattingTeam((prev: any) => ({
            ...prev,
            battingOrder: battingOrderToSave,
          }));

          // Reset ball-level stats
          setBalls(0);
          setRuns(0);
          setExtras(0);
          setByes(0);
          setLegByes(0);
          setWickets(0);
          setWides(0);
          setNoBalls(0);

          ////console.log('Normal update done');
        }
      } catch (error) {
        ////console.error('Error updating inning stats:', error);
      }
    };


    updateInning();

  }, [balls, noBalls, wides]);





  //for partnerShip and fallofwickets
  useEffect(() => {
    if (!match_id) return;

    const inningDocRef = doc(db, 'matches', match_id, 'innings', `inning${fetchDataFirst}`);

    const updatePartnershipAndFallOfWicket = async () => {
      try {
        // Fetch latest inning data
        const inningSnap = await getDoc(inningDocRef);
        if (!inningSnap.exists()) return;
        const inningData = inningSnap.data();

        // Get current batting order
        const battingOrder = inningData?.battingTeam?.battingOrder || [];
        // Identify striker/non-striker
        const striker = battingOrder.find((p: any) => p.isStriker);
        const nonStriker = battingOrder.find((p: any) => p.isNonStriker);
        if (!striker || !nonStriker) return;

        // ALWAYS treat as arrays
        const existingPartnerships = Array.isArray(inningData?.battingTeam?.partnership)
          ? inningData.battingTeam.partnership
          : [];
        const existingFallOfWickets = Array.isArray(inningData?.battingTeam?.fallofWicket)
          ? inningData.battingTeam.fallofWicket
          : [];

        let updatedPartnerships = [...existingPartnerships];
        let updatedFallOfWickets = [...existingFallOfWickets];

        // --- Handle wicket
        if (typeof wickets === "number" && wickets === 1 && outBatsman) {
          // Finalize previous partnership
          if (updatedPartnerships.length > 0) {
            const last = updatedPartnerships[updatedPartnerships.length - 1];
            updatedPartnerships[updatedPartnerships.length - 1] = {
              ...last,
              runs: (last.runs || 0) + runs + byes + legByes + wides + noBalls,
              balls: (last.balls || 0) + balls,
              endedAt: new Date().toISOString(),
            };
          }
          // Determine non-out batsman for next partnership
          let nonOut = "";
          if (updatedPartnerships.length > 0) {
            const last = updatedPartnerships[updatedPartnerships.length - 1];
            nonOut = last.batsman1 === outBatsman ? last.batsman2 : last.batsman1;
          } else {
            nonOut = (striker.name === outBatsman ? nonStriker.name : striker.name) || "";
          }
          if (newBatsman) {
            updatedPartnerships.push({
              batsman1: nonOut,
              batsman2: newBatsman,
              runs: 0,
              balls: 0,
              startedAt: new Date().toISOString(),
            });
          }
          // Append to fallofWicket array
          updatedFallOfWickets.push({
            batsmanOut: outBatsman,
            runsAtFall: (inningData?.totalRuns || 0) + runs + byes + legByes + wides + noBalls,
            overAtFall: calculateOvers((inningData?.balls || 0) + balls),
            time: new Date().toISOString(),
          });

        } else {
          // Normal ball
          if (updatedPartnerships.length === 0) {
            updatedPartnerships.push({
              batsman1: striker?.name || "",
              batsman2: nonStriker?.name || "",
              runs: runs + byes + legByes + wides + noBalls,
              balls: balls,
              startedAt: new Date().toISOString(),
            });
          } else {
            updatedPartnerships[updatedPartnerships.length - 1] = {
              ...updatedPartnerships[updatedPartnerships.length - 1],
              batsman1: striker?.name || "",
              batsman2: nonStriker?.name || "",
              runs: (updatedPartnerships[updatedPartnerships.length - 1].runs || 0) + runs + byes + legByes + wides + noBalls,
              balls: (updatedPartnerships[updatedPartnerships.length - 1].balls || 0) + balls,
            };
          }
        }

        // --- Save arrays UNDER 'battingTeam'
        await updateDoc(inningDocRef, {
          "battingTeam.partnership": updatedPartnerships,
          "battingTeam.fallofWicket": updatedFallOfWickets,
        });

      } catch (error) {
        //console.error("Failed to update partnership/fallofwicket:", error);
      }
    };

    updatePartnershipAndFallOfWicket();
  }, [balls, wides, noBalls]);




  //udate inning data in firestore for undo 
  useEffect(() => {
    const updateInningInFirestore = async () => {
      if (inningData && undo) {
        try {
          const inningDocRef = doc(db, 'matches', match_id, 'innings', `inning${fetchDataFirst}`);
          const matchDocRef = doc(db, 'matches', match_id);
          await updateDoc(inningDocRef, undo);
          await updateDoc(matchDocRef, {
            totalRuns: undo.totalRuns,
            wickets: undo.wickets,
            overs: undo.overs
          });
        } catch (error) {
          //console.error('Failed to update inningData in undo:', error);
        }
      }
    };

    updateInningInFirestore();
  }, [undo]);


  const [matchLiveSet, setMatchLiveSet] = useState(false);

  useEffect(() => {
    if (!match_id) return;

    // Run only once: when there is something recorded in the match (balls/runs/etc)
    if (matchLiveSet) return;

    if (
      balls === 0 &&
      runs === 0 &&
      extras === 0 &&
      byes === 0 &&
      wides === 0 &&
      noBalls === 0 &&
      wickets === 0
    ) {
      return; // no meaningful action yet
    }

    const matchDocRef = doc(db, 'matches', match_id);

    const setLiveStatus = async () => {
      try {
        const matchSnap = await getDoc(matchDocRef);
        if (matchSnap.exists()) {
          const currentStatus = matchSnap.data().matchStatus;
          if (currentStatus !== 'live') {
            await updateDoc(matchDocRef, { matchStatus: 'live' });
            setMatchLiveSet(true);
          } else {
            setMatchLiveSet(true); // already live, just mark as done
          }
        }
      } catch (error) {
        //console.error('Error setting match status live:', error);
      }
    };

    setLiveStatus();

  }, [balls, noBalls, wides]);



  useEffect(() => {
    if (!inningData || !match_id) return;

    const lastInning = inningData[inningData.length - 1];
    if (!lastInning) return;

    const battingTeamName = lastInning.battingTeam.name;

    const updateMatchData = async (teamName: string) => {
      await updateDoc(doc(db, 'matches', match_id), {
        [`${teamName}.score`]: lastInning.battingTeam.score,
        [`${teamName}.wickets`]: lastInning.battingTeam.wickets,
        [`${teamName}.overs`]: lastInning.battingTeam.overs,
      });
    };

    if (battingTeamName === match_data.teamA.name) {
      updateMatchData('teamA');
    } else if (battingTeamName === match_data.teamB.name) {
      updateMatchData('teamB');
    }
  }, [match_id, inningData]);

  return (
    <ScoringContext.Provider value={{
      runs, setRuns,
      extras, setExtras,
      byes, setByes,
      legByes, setLegByes,
      wickets, setWickets,
      wides, setWides,
      noBalls, setNoBalls,
      balls, setBalls,
      overs, setOvers,
      ballSummary, setBallSummary,
      strikerName, setStrikerName,
      nonStrikerName, setNonStrikerName,
      currentInning, setCurrentInning,
      match_id, setMatch_id,
      strike, setStrike,
      strikeSwapInProgress,
      setMatch_data, match_data,
      loading, setLoading,
      battingTeam, setBattingTeam,
      bowlingTeam, setBowlingTeam,
      totalRuns, setTotalRuns,
      currentBowler, setCurrentBowler,
      inningData, setInningData,
      newBatsman, setNewBatsman,
      outBatsman, setOutBatsman,
      fielderName, setFielderName,
      fetchDataFirst,
      setFetchDataFirst,
      wicketType, setWicketType,
      setIsSecondInning, isSecondInning,
      setTarget, target,
      iswinner, setIsWinner,
      setUndo, undo,
      recentBowler, setRecentBowler,
      recentBowlerName, setRecentBowlerName
    }}>
      {children}
    </ScoringContext.Provider>
  );
};

export const useScoring = () => {
  const ctx = useContext(ScoringContext);
  if (!ctx) throw new Error('useScoring must be used within ScoringProvider');
  return ctx;
};
