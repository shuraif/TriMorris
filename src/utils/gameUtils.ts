import { JUNCTIONS, CONNECTIONS, WINNING_LINES } from '../constants/gameConstants';

export interface GameState {
  currentPlayer: 1 | 2;
  tokens: { [key: number]: number | null }; // junction id -> player number
  tokensPlaced: { player1: number; player2: number };
  selectedToken: number | null;
  gamePhase: 'placing' | 'moving';
  winner: number | null;
  possibleMoves: number[];
  roundWinner: number | null;
  score: { player1: number; player2: number };
  currentRound: number;
  matchWinner: number | null;
  message: string | null; // For displaying game messages
}

export const initialGameState: GameState = {
  currentPlayer: 1,
  tokens: {},
  tokensPlaced: { player1: 0, player2: 0 },
  selectedToken: null,
  gamePhase: 'placing',
  winner: null,
  possibleMoves: [],
  roundWinner: null,
  score: { player1: 0, player2: 0 },
  currentRound: 1,
  matchWinner: null,
  message: null,
};

export const getAdjacentJunctions = (junctionId: number): number[] => {
  const adjacent: number[] = [];
  
  CONNECTIONS.forEach(([from, to]) => {
    if (from === junctionId) {
      adjacent.push(to);
    } else if (to === junctionId) {
      adjacent.push(from);
    }
  });
  
  return adjacent;
};

export const getAvailableMoves = (
  junctionId: number,
  tokens: { [key: number]: number | null }
): number[] => {
  const adjacent = getAdjacentJunctions(junctionId);
  return adjacent.filter(id => tokens[id] === undefined || tokens[id] === null);
};

export const checkWinner = (tokens: { [key: number]: number | null }): number | null => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (tokens[a] && tokens[a] === tokens[b] && tokens[a] === tokens[c]) {
      return tokens[a];
    }
  }
  return null;
};

export const canPlayerMove = (
  player: number,
  tokens: { [key: number]: number | null }
): boolean => {
  // Find all tokens belonging to the player
  const playerTokens = Object.entries(tokens)
    .filter(([_, owner]) => owner === player)
    .map(([junctionId]) => parseInt(junctionId));

  // Check if any token can move to an adjacent empty junction
  return playerTokens.some(tokenJunction => {
    const availableMoves = getAvailableMoves(tokenJunction, tokens);
    return availableMoves.length > 0;
  });
};

export const isGameDraw = (tokens: { [key: number]: number | null }): boolean => {
  // Game is a draw if both players have all tokens placed but no one can win
  const player1Tokens = Object.values(tokens).filter(p => p === 1).length;
  const player2Tokens = Object.values(tokens).filter(p => p === 2).length;
  
  if (player1Tokens === 3 && player2Tokens === 3) {
    return !canPlayerMove(1, tokens) && !canPlayerMove(2, tokens);
  }
  
  return false;
};

export const getRandomFirstPlayer = (): 1 | 2 => {
  return Math.random() < 0.5 ? 1 : 2;
};

export const getInitialRoundState = (currentRound: number, score: { player1: number; player2: number }): Partial<GameState> => ({
  currentPlayer: getRandomFirstPlayer(),
  tokens: {},
  tokensPlaced: { player1: 0, player2: 0 },
  selectedToken: null,
  gamePhase: 'placing',
  winner: null,
  possibleMoves: [],
  roundWinner: null,
  currentRound,
  score,
});
