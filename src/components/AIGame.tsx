import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Board } from './Board';
import { HUD } from './HUD';
import { setSoundEnabled } from '../store/settingsSlice';
import { GameModal } from './GameModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  moveToken as moveTokenAction,
  placeToken as placeTokenAction,
  selectToken,
  deselectToken,
  setWinner,
  updateScore,
  setMatchWinner,
  setMessage,
  clearMessage,
  resetRound,
  nextRound,
  resetGame,
} from '../store/gameSlice';
import { checkWinner, getAvailableMoves, canPlayerMove, isGameDraw } from '../utils/gameUtils';
import SoundManager from '../utils/SoundManager';

// Simple AI: picks first available move
function getAIMove(gameState: any) {
  // Placement phase
  if (gameState.gamePhase === 'placing') {
    // Find empty junctions
    const emptySpots = Array.from({ length: 9 }, (_, idx) => idx)
      .filter(idx => gameState.tokens[idx] === undefined || gameState.tokens[idx] === null);
    // Prevent winning by placing third token
    if (gameState.tokensPlaced.player2 === 2) {
      for (let i = 0; i < emptySpots.length; i++) {
        const testTokens = { ...gameState.tokens, [emptySpots[i]]: 2 };
        if (!checkWinner(testTokens)) {
          return { type: 'place', index: emptySpots[i] as number };
        }
      }
      // If all moves would win, just pick the first (shouldn't happen)
      return { type: 'place', index: emptySpots[0] as number };
    }
    if (emptySpots.length > 0) {
      return { type: 'place', index: emptySpots[0] as number };
    }
  }
  // Movement phase
  if (gameState.gamePhase === 'moving') {
    // Find AI tokens and try to move one to first available
    for (let i = 0; i < 9; i++) {
      if (gameState.tokens[i] === 2) {
        const moves = getAvailableMoves(i, gameState.tokens);
        if (moves.length > 0) {
          return { type: 'move', from: i as number, to: moves[0] as number };
        }
      }
    }
  }
  return null;
}

export const AIGame: React.FC = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);
  const settings = useAppSelector((state) => state.settings);
  const [aiThinking, setAIThinking] = useState(false);


      // Reset game state when leaving the screen
  useEffect(() => {
    return () => {
      dispatch(resetGame());
    };
  }, []);
  // Load sounds once
  useEffect(() => {
    SoundManager.loadAll();
    return () => {
      SoundManager.releaseAll();
    };
  }, []);

  // AI turn effect
  useEffect(() => {
    if (gameState.currentPlayer === 2 && !gameState.winner && !aiThinking) {
      setAIThinking(true);
      setTimeout(() => {
        const move = getAIMove(gameState);
        if (move) {
          if (move.type === 'place' && typeof move.index === 'number') {
            dispatch(placeTokenAction({ junctionId: move.index, player: 2 }));
            SoundManager.play('tokenPlace', settings.soundEnabled);
          } else if (move.type === 'move' && typeof move.from === 'number' && typeof move.to === 'number') {
            dispatch(moveTokenAction({ fromJunctionId: move.from, toJunctionId: move.to }));
            SoundManager.play('draw', settings.soundEnabled);
          }
        }
        setAIThinking(false);
      }, 700); // Simulate AI thinking
    }
  }, [gameState.currentPlayer, gameState.gamePhase, gameState.tokens, gameState.winner]);

  // Check for winner after every move
  useEffect(() => {
    if (!gameState.winner) {
      const winner = checkWinner(gameState.tokens);
      if (winner) {
        dispatch(setWinner(winner));
        dispatch(setMessage(`${winner === 1 ? 'Player 1' : 'System'} Wins Round!`));
        SoundManager.play('roundWin', settings.soundEnabled);
      } else if (isGameDraw(gameState.tokens)) {
        dispatch(setMessage('Draw!'));
        SoundManager.play('draw', settings.soundEnabled);
      }
    }
  }, [gameState.tokens, gameState.winner, dispatch]);

  // Play sound for user actions
  const handleJunctionPress = (junctionId: number) => {
    // Only allow user action if it's Player 1's turn and no winner
    if (gameState.currentPlayer !== 1 || gameState.winner) return;
    if (gameState.gamePhase === 'placing') {
      // Only place if spot is empty
      if (!gameState.tokens[junctionId]) {
        // Prevent winning by placing third token
        const playerKey = 'player1';
        if (gameState.tokensPlaced[playerKey] === 2) {
          const newTokens = { ...gameState.tokens, [junctionId]: 1 };
          const wouldWin = checkWinner(newTokens);
          if (wouldWin) {
            dispatch(setMessage('You cannot win by placing your third token in a line. You can only win by moving tokens!'));
            setTimeout(() => dispatch(clearMessage()), 3000);
            SoundManager.play('invalidMove', settings.soundEnabled);
            return;
          }
        }
        dispatch(placeTokenAction({ junctionId, player: 1 }));
        SoundManager.play('tokenPlace', settings.soundEnabled);
      }
    } else if (gameState.gamePhase === 'moving') {
      // If selecting own token
      if (gameState.tokens[junctionId] === 1) {
        const moves = getAvailableMoves(junctionId, gameState.tokens);
        dispatch(selectToken({ junctionId, possibleMoves: moves }));
        SoundManager.play('tokenSelect', settings.soundEnabled);
      } else if (
        gameState.selectedToken !== null &&
        gameState.possibleMoves.includes(junctionId)
      ) {
        dispatch(moveTokenAction({ fromJunctionId: gameState.selectedToken, toJunctionId: junctionId }));
        dispatch(deselectToken());
        SoundManager.play('draw', settings.soundEnabled);
      }
    }
  };

  const handleTokenDrop = (fromJunctionId: number, toJunctionId: number | null) => {
    // Only allow drag if it's Player 1's turn, moving phase, and no winner
    if (gameState.currentPlayer !== 1 || gameState.gamePhase !== 'moving' || gameState.winner) return;
    if (
      typeof toJunctionId === 'number' &&
      gameState.tokens[fromJunctionId] === 1 &&
      (toJunctionId !== null && (gameState.tokens[toJunctionId] === undefined || gameState.tokens[toJunctionId] === null))
    ) {
      dispatch(moveTokenAction({ fromJunctionId, toJunctionId }));
      dispatch(deselectToken());
      SoundManager.play('draw', settings.soundEnabled);
    }
  };

  return (
    <>
      {/* Player 1 HUD at top */}
      <HUD
        currentPlayer={'Player 1'}
        winner={gameState.winner === 1 ? 'Player 1' : gameState.winner === 2 ? 'System' : null}
        gamePhase={gameState.gamePhase === 'placing' ? 'placement' : 'movement'}
        tokensPlaced={gameState.tokensPlaced}
        onRestart={() => { dispatch(resetGame()); SoundManager.play('gameStart', settings.soundEnabled); }}
        score={gameState.score}
        currentRound={gameState.currentRound}
        matchWinner={gameState.matchWinner === 1 ? 'Player 1' : gameState.matchWinner === 2 ? 'System' : null}
        onNextRound={() => { dispatch(nextRound()); SoundManager.play('gameStart', settings.soundEnabled); }}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => dispatch(setSoundEnabled(!settings.soundEnabled))}
        isAIGame={true}
      >
        <Board
          tokens={gameState.tokens}
          selectedToken={gameState.selectedToken}
          possibleMoves={gameState.possibleMoves}
          onJunctionPress={handleJunctionPress}
          onTokenDrop={handleTokenDrop}
          currentPlayer={gameState.currentPlayer}
          gamePhase={gameState.gamePhase}
          player1Color={settings.player1.color}
          player2Color={settings.player2.color}
          tokensPlaced={gameState.tokensPlaced}
          size={settings.boardSize}
        />
      </HUD>
      <GameModal />
      {aiThinking && (
        <View style={styles.aiOverlay}>
          <Text style={styles.aiText}>System is thinking...</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0B0C2A',
    paddingTop: 32,
    paddingBottom: 16,
  },
  aiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  aiText: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: 'rgba(30,26,120,0.8)',
    padding: 16,
    borderRadius: 12,
  },
});
