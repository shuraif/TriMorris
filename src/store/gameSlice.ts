import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, initialGameState, getRandomFirstPlayer } from '../utils/gameUtils';

interface MoveTokenPayload {
  fromJunctionId: number;
  toJunctionId: number;
}

interface PlaceTokenPayload {
  junctionId: number;
  player: number;
}

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    moveToken: (state, action: PayloadAction<MoveTokenPayload>) => {
      const { fromJunctionId, toJunctionId } = action.payload;
      const player = state.tokens[fromJunctionId];
      
      // Remove token from source
      delete state.tokens[fromJunctionId];
      
      // Place token at destination
      state.tokens[toJunctionId] = player;
      
      // Switch players
      state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
      
      // Clear selection
      state.selectedToken = null;
      state.possibleMoves = [];
    },
    
    placeToken: (state, action: PayloadAction<PlaceTokenPayload>) => {
      const { junctionId, player } = action.payload;
      
      // Place token
      state.tokens[junctionId] = player;
      
      // Update tokens placed count
      if (player === 1) {
        state.tokensPlaced.player1 += 1;
      } else {
        state.tokensPlaced.player2 += 1;
      }
      
      // Check if placing phase is complete
      if (state.tokensPlaced.player1 === 3 && state.tokensPlaced.player2 === 3) {
        state.gamePhase = 'moving';
      }
      
      // Switch players
      state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
    },
    
    selectToken: (state, action: PayloadAction<{ junctionId: number; possibleMoves: number[] }>) => {
      state.selectedToken = action.payload.junctionId;
      state.possibleMoves = action.payload.possibleMoves;
    },
    
    deselectToken: (state) => {
      state.selectedToken = null;
      state.possibleMoves = [];
    },
    
    setWinner: (state, action: PayloadAction<number>) => {
      state.roundWinner = action.payload;
    },
    
    updateScore: (state, action: PayloadAction<{ player1: number; player2: number }>) => {
      state.score = action.payload;
    },
    
    setMatchWinner: (state, action: PayloadAction<number | null>) => {
      state.matchWinner = action.payload;
    },
    
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    
    clearMessage: (state) => {
      state.message = null;
    },
    
    resetRound: (state) => {
      state.tokens = {};
      state.tokensPlaced = { player1: 0, player2: 0 };
      state.selectedToken = null;
      state.gamePhase = 'placing';
      state.winner = null;
      state.possibleMoves = [];
      state.currentPlayer = state.roundWinner !== null ? (state.roundWinner as 1 | 2) : getRandomFirstPlayer();
      //state.roundWinner = null;
      state.message = null;
    },
    
    nextRound: (state) => {
      state.tokens = {};
      state.tokensPlaced = { player1: 0, player2: 0 };
      state.selectedToken = null;
      state.gamePhase = 'placing';
      state.winner = null;
      state.possibleMoves = [];
      state.currentPlayer = state.roundWinner !== null ? (state.roundWinner as 1 | 2) : getRandomFirstPlayer();
      //state.roundWinner = null;
      state.message = null;
      state.currentRound = state.currentRound + 1;
    },
    
    resetGame: (state) => {
      return { 
        ...initialGameState,
        currentPlayer: getRandomFirstPlayer()
      };
    }
  },
});

export const {
  moveToken,
  placeToken,
  selectToken,
  deselectToken,
  setWinner,
  updateScore,
  setMatchWinner,
  setMessage,
  clearMessage,
  resetRound,
  nextRound,
  resetGame
} = gameSlice.actions;

export default gameSlice.reducer;
