
export interface Player {
  id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'wicketkeeper' | 'allrounder';
  isPlaying: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  players: Player[];
  score: number;
  wickets: number;
  overs: number;
  balls: number;
}

export interface CurrentBatsmen {
  striker: Player;
  nonStriker: Player;
  strikerRuns: number;
  nonStrikerRuns: number;
  strikerBalls: number;
  nonStrikerBalls: number;
}

export interface CurrentBowler {
  bowler: Player;
  overs: number;
  runs: number;
  wickets: number;
  balls: number;
}

export interface Ball {
  id: string;
  over: number;
  ball: number;
  runs: number;
  isWide: boolean;
  isNoBall: boolean;
  isBye: boolean;
  isLegBye: boolean;
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';
  commentary: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  battingTeam: string;
  bowlingTeam: string;
  currentBatsmen: CurrentBatsmen;
  currentBowler: CurrentBowler;
  balls: Ball[];
  isMatchActive: boolean;
  target?: number;
}
