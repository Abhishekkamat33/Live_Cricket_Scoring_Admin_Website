
'use client';
import { useState, useCallback } from 'react';
import { Match, Ball, Team, Player } from './typesCricket';

const createMockTeam = (name: string, shortName: string, isFirst: boolean): Team => {
  const players: Player[] = [
    { id: `${shortName}-1`, name: `${name} Opener 1`, role: 'batsman', isPlaying: isFirst },
    { id: `${shortName}-2`, name: `${name} Opener 2`, role: 'batsman', isPlaying: isFirst },
    { id: `${shortName}-3`, name: `${name} Batsman 1`, role: 'batsman', isPlaying: false },
    { id: `${shortName}-4`, name: `${name} Batsman 2`, role: 'batsman', isPlaying: false },
    { id: `${shortName}-5`, name: `${name} Captain`, role: 'allrounder', isPlaying: false },
    { id: `${shortName}-6`, name: `${name} Keeper`, role: 'wicketkeeper', isPlaying: false },
    { id: `${shortName}-7`, name: `${name} All-rounder`, role: 'allrounder', isPlaying: false },
    { id: `${shortName}-8`, name: `${name} Bowler 1`, role: 'bowler', isPlaying: !isFirst },
    { id: `${shortName}-9`, name: `${name} Bowler 2`, role: 'bowler', isPlaying: false },
    { id: `${shortName}-10`, name: `${name} Bowler 3`, role: 'bowler', isPlaying: false },
    { id: `${shortName}-11`, name: `${name} Bowler 4`, role: 'bowler', isPlaying: false },
  ];

  return {
    id: shortName.toLowerCase(),
    name,
    shortName,
    players,
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
  };
};

export const useCricketMatch = () => {
  const team1 = createMockTeam('Mumbai Indians', 'MI', true);
  const team2 = createMockTeam('Chennai Super Kings', 'CSK', false);

  const [match, setMatch] = useState<Match>({
    id: 'match-1',
    team1,
    team2,
    battingTeam: team1.id,
    bowlingTeam: team2.id,
    currentBatsmen: {
      striker: team1.players[0],
      nonStriker: team1.players[1],
      strikerRuns: 0,
      nonStrikerRuns: 0,
      strikerBalls: 0,
      nonStrikerBalls: 0,
    },
    currentBowler: {
      bowler: team2.players[7],
      overs: 0,
      runs: 0,
      wickets: 0,
      balls: 0,
    },
    balls: [],
    isMatchActive: true,
  });

  const addBall = useCallback((ballData: Partial<Ball>) => {
    setMatch(prevMatch => {
      const newBall: Ball = {
        id: `ball-${prevMatch.balls.length + 1}`,
        over: prevMatch.team1.overs,
        ball: prevMatch.team1.balls,
        runs: 0,
        isWide: false,
        isNoBall: false,
        isBye: false,
        isLegBye: false,
        isWicket: false,
        commentary: '',
        ...ballData,
      };

      const updatedMatch = { ...prevMatch };
      const battingTeam = updatedMatch.battingTeam === 'mi' ? updatedMatch.team1 : updatedMatch.team2;
      
      // Update team score
      battingTeam.score += newBall.runs;
      
      // Update balls and overs (only for legal deliveries)
      if (!newBall.isWide && !newBall.isNoBall) {
        battingTeam.balls += 1;
        updatedMatch.currentBowler.balls += 1;
        
        // Update batsman balls faced (only striker faces the ball)
        updatedMatch.currentBatsmen.strikerBalls += 1;
        
        if (battingTeam.balls === 6) {
          battingTeam.balls = 0;
          battingTeam.overs += 1;
          updatedMatch.currentBowler.balls = 0;
          updatedMatch.currentBowler.overs += 1;
        }
      }
      
      // Update bowler runs
      updatedMatch.currentBowler.runs += newBall.runs;
      
      // Update batsman runs (striker gets the runs unless it's byes/leg-byes)
      if (!newBall.isBye && !newBall.isLegBye) {
        updatedMatch.currentBatsmen.strikerRuns += newBall.runs;
      }
      
      // Swap strike for odd runs (except for last ball of over)
      if (newBall.runs % 2 === 1 && battingTeam.balls !== 0) {
        const temp = updatedMatch.currentBatsmen.striker;
        const tempRuns = updatedMatch.currentBatsmen.strikerRuns;
        const tempBalls = updatedMatch.currentBatsmen.strikerBalls;
        
        updatedMatch.currentBatsmen.striker = updatedMatch.currentBatsmen.nonStriker;
        updatedMatch.currentBatsmen.strikerRuns = updatedMatch.currentBatsmen.nonStrikerRuns;
        updatedMatch.currentBatsmen.strikerBalls = updatedMatch.currentBatsmen.nonStrikerBalls;
        
        updatedMatch.currentBatsmen.nonStriker = temp;
        updatedMatch.currentBatsmen.nonStrikerRuns = tempRuns;
        updatedMatch.currentBatsmen.nonStrikerBalls = tempBalls;
      }
      
      // Handle wicket
      if (newBall.isWicket) {
        battingTeam.wickets += 1;
        updatedMatch.currentBowler.wickets += 1;
        // In a real app, you'd handle new batsman selection here
      }

      return {
        ...updatedMatch,
        balls: [...prevMatch.balls, newBall],
      };
    });
  }, []);

  const scoreBall = useCallback((runs: number) => {
    addBall({
      runs,
      commentary: `${runs} run${runs !== 1 ? 's' : ''} scored`,
    });
  }, [addBall]);

  const scoreWide = useCallback(() => {
    addBall({
      runs: 1,
      isWide: true,
      commentary: 'Wide ball, 1 extra run',
    });
  }, [addBall]);

  const scoreNoBall = useCallback(() => {
    addBall({
      runs: 1,
      isNoBall: true,
      commentary: 'No ball, 1 extra run',
    });
  }, [addBall]);

  const scoreWicket = useCallback(() => {
    addBall({
      runs: 0,
      isWicket: true,
      wicketType: 'bowled',
      commentary: 'WICKET! Batsman is out',
    });
  }, [addBall]);

  const scoreBye = useCallback((runs: number) => {
    addBall({
      runs,
      isBye: true,
      commentary: `${runs} bye${runs !== 1 ? 's' : ''}`,
    });
  }, [addBall]);

  const scoreLegBye = useCallback((runs: number) => {
    addBall({
      runs,
      isLegBye: true,
      commentary: `${runs} leg bye${runs !== 1 ? 's' : ''}`,
    });
  }, [addBall]);

  return {
    match,
    scoreBall,
    scoreWide,
    scoreNoBall,
    scoreWicket,
    scoreBye,
    scoreLegBye,
  };
};

export default useCricketMatch;