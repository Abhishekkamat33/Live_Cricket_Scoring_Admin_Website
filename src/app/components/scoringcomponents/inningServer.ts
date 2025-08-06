// src/services/inningService.ts
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface PlayerStats {
  name: string;
  runs?: number;
  balls?: number;
  overs?: number;
  wickets?: number;
  isStriker?: boolean;
  isNonStriker?: boolean;
}

export interface InningData {
  battingTeam: {
    name: string;
    wickets: number;
    score: number;
    overs: string;
    battingOrder: PlayerStats[];
  };
  bowlingTeam: {
    name: string;
    wickets: number;
    score: number;
    overs: string;
    bowlingOrder: PlayerStats[];
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
}

/**
 * Save or update inning data under subcollection 'innings' in match document.
 * @param matchId Match document ID
 * @param inningNumber Number of inning (1 or 2)
 * @param inningData Data to save
 */
export async function saveInningData(
  matchId: string,
  inningNumber: number,
  inningData: InningData
): Promise<void> {
  try {
    const inningDocRef = doc(db, 'matches', matchId, 'innings', `inning${inningNumber}`);
    await setDoc(inningDocRef, inningData, { merge: true });
  } catch (error) {
    //console.error(`Error saving inning ${inningNumber} data:`, error);
    throw error;
  }
}

/**
 * Fetch inning data for a given inning.
 * @param matchId Match document ID
 * @param inningNumber Number of inning
 */
export async function getInningData(matchId: string, inningNumber: number) {
  try {
    const inningDocRef = doc(db, 'matches', matchId, 'innings', `inning${inningNumber}`);
    const inningDocSnap = await getDoc(inningDocRef);
    if (inningDocSnap.exists()) {
      return inningDocSnap.data();
    }
    return null;
  } catch (error) {
    //console.error(`Error fetching inning ${inningNumber} data:`, error);
    throw error;
  }
}
