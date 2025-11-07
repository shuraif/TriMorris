import React from 'react';
import { View, StyleSheet } from 'react-native';
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
import {
  checkWinner,
  getAvailableMoves,
  canPlayerMove,
  isGameDraw,
} from '../utils/gameUtils';
import Sound from 'react-native-sound';

export const Game: React.FC = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);
  const settings = useAppSelector((state) => state.settings);
  const [sounds, setSounds] = React.useState<{[key: string]: Sound | null}>({
    invalidMove: null,
    gameStart: null,
    roundWin: null,
    matchWin: null
  });

  // Reset game state when leaving the screen
  React.useEffect(() => {
    return () => {
      dispatch(resetGame());
    };
  }, []);

  React.useEffect(() => {
    // Enable playback in silent mode
    Sound.setCategory('Playback');

    // Initialize all sounds
    const loadSound = (fileName: string) => {
      return new Promise<Sound>((resolve, reject) => {
        const sound = new Sound(fileName, '', (error) => {
          if (error) {
            console.log(`Failed to load sound ${fileName}`, error);
            reject(error);
            return;
          }
          resolve(sound);
        });
      });
    };

    const loadSounds = async () => {
      try {
        const draw = await loadSound('draw');
        const gameStart = await loadSound('game_start');
        const invalidMove = await loadSound('invalid_move');
        const matchWin = await loadSound('match_win');
        const roundWin = await loadSound('round_win');
        const tokenPlace = await loadSound('token_place');
        const tokenSelect = await loadSound('token_select');


        console.log('All sounds loaded successfully');
        setSounds({
          draw,
          invalidMove,
          gameStart,
          roundWin,
          matchWin,
          tokenPlace,
          tokenSelect
        });
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    };

    loadSounds();

    // Cleanup
    return () => {
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.release();
        }
      });
    };
  }, []);

  const playSound = (soundType: keyof typeof sounds = 'gameStart') => {
    if(!settings.soundEnabled) return;
    
    const sound = sounds[soundType];
    if (sound) {
      sound.stop(() => {  // Stop any previous playback
        sound.play((success: boolean) => {
          if (!success) {
            console.log(`Sound playback failed for ${soundType}`);
          }
        });
      });
    }
  };

  // Debug: Log when tokens state changes
  React.useEffect(() => {
    console.log('Game: Redux tokens updated:', JSON.stringify(gameState.tokens));
  }, [gameState.tokens]);

  const handleJunctionPress = (junctionId: number) => {
    if (gameState.winner) return; // Game already won

    const { currentPlayer, tokens, tokensPlaced, selectedToken, gamePhase } = gameState;
    const tokenAtJunction = tokens[junctionId];

    if (gamePhase === 'placing') {
      // In placing phase - only allow placing tokens
      if (tokenAtJunction === undefined || tokenAtJunction === null) {
        const playerKey = currentPlayer === 1 ? 'player1' : 'player2';
        if (tokensPlaced[playerKey] < 3) {
          handlePlaceToken(junctionId);
        }
      }
    } else {
      // In moving phase - handle both selection and movement
      if (selectedToken === null) {
        // No token selected, try to select one
        if (tokenAtJunction === currentPlayer) {
          handleSelectToken(junctionId);
        }
      } else {
        // Token is selected
        if (junctionId === selectedToken) {
          // Deselect the same token
          dispatch(deselectToken());
        } else if (tokenAtJunction === currentPlayer) {
          // Select a different token of the same player
          handleSelectToken(junctionId);
        } else if (gameState.possibleMoves.includes(junctionId)) {
          // Move the selected token to this junction
          handleMoveToken(selectedToken, junctionId);
        }
      }
    }
  };

  const handleTokenDrop = (fromJunctionId: number, toJunctionId: number | null) => {
    console.log(`Game: handleTokenDrop called from ${fromJunctionId} to ${toJunctionId}`);
    
    if (gameState.winner || toJunctionId === null) {
      console.log(`Game: Drop rejected - winner: ${gameState.winner}, target: ${toJunctionId}`);
      return;
    }

    const { currentPlayer, tokens, gamePhase } = gameState;
    const tokenOwner = tokens[fromJunctionId];
    
    console.log(`Game: Current player: ${currentPlayer}, token owner: ${tokenOwner}, phase: ${gamePhase}`);

    // Validate the move
    if (gamePhase !== 'moving' || tokenOwner !== currentPlayer) {
      console.log('Game: Invalid move - wrong phase or not current player token');
      return;
    }

    // Check if the move is valid
    const possibleMoves = getAvailableMoves(fromJunctionId, tokens);
    console.log('Game: Possible moves from', fromJunctionId, ':', possibleMoves);
    
    if (possibleMoves.includes(toJunctionId)) {
      console.log('Game: Valid move! Executing moveToken');
      handleMoveToken(fromJunctionId, toJunctionId);
    } else {
      console.log('Game: Invalid move - target not in possible moves');
      playSound('invalidMove');
    }
  };

  const handlePlaceToken = (junctionId: number) => {
    const { currentPlayer, tokens, tokensPlaced } = gameState;
    const playerKey = currentPlayer === 1 ? 'player1' : 'player2';

    console.log(`Game: Placing token for player ${currentPlayer} at junction ${junctionId}`);

    // Check if this is the player's third token (final placement)
    if (tokensPlaced[playerKey] === 2) {
      // This would be the third token, check if it creates a winning line
      const newTokens = { ...tokens, [junctionId]: currentPlayer };
      const wouldWin = checkWinner(newTokens);
      
      if (wouldWin) {
        console.log(`Game: Cannot place third token in a winning line during placement phase`);
        playSound('invalidMove');
        // Show a styled message to the user
        dispatch(setMessage('You cannot win by placing your third token in a line. You can only win by moving tokens!'));
        
        // Clear the message after a few seconds
        setTimeout(() => {
          dispatch(clearMessage());
        }, 3000);
        
        return; // Prevent the placement
      }
    }

    // Place token using Redux action
    dispatch(placeTokenAction({ junctionId, player: currentPlayer }));

    // After placement, only check for winner during moving phase
    // During placement phase, we've already prevented winning above
    const newTokens = { ...tokens, [junctionId]: currentPlayer };
    
    // Only allow winning during moving phase, not placement phase
    if (gameState.gamePhase === 'moving') {
      const winner = checkWinner(newTokens);

      if (winner) {
        console.log(`Game: Winner detected: Player ${winner}`);
        dispatch(setWinner(winner));
        
        // Update score
        const newScore = { ...gameState.score };
        const winnerPlayerKey = winner === 1 ? 'player1' : 'player2';
        newScore[winnerPlayerKey] += 1;
        dispatch(updateScore(newScore));
        
        // Check if someone won the match
        const roundsToWin = Math.ceil(settings.roundsPerGame / 2);
        const winnerName = winner === 1 ? settings.player1.name : settings.player2.name;
        
        if (newScore[winnerPlayerKey] >= roundsToWin) {
          dispatch(setMatchWinner(winner));
          playSound('matchWin');
          
        } else {
          playSound('roundWin');
          dispatch(setMessage(`🎉 ${winnerName} Wins Round ${gameState.currentRound}! 🎉`));
        }
      } else if (isGameDraw(newTokens)) {
        // Handle draw
        dispatch(setMessage('Round Draw! This round is a draw. Starting next round...'));
        setTimeout(() => {
          dispatch(clearMessage());
          handleNextRound();
        }, 3000);
      } else {
        // If no win and no draw, play the token placement sound
        playSound('tokenPlace');
      }
    } else {
      // Not in moving phase, just play token placement sound
      playSound('tokenPlace');
    }
  };

  const handleSelectToken = (junctionId: number) => {
    playSound('tokenSelect');
    const possibleMoves = getAvailableMoves(junctionId, gameState.tokens);
    dispatch(selectToken({ junctionId, possibleMoves }));
  };

  const handleMoveToken = (fromJunctionId: number, toJunctionId: number) => {
    console.log(`Game: Moving token from ${fromJunctionId} to ${toJunctionId}`);
    
    // Move token using Redux action
    dispatch(moveTokenAction({ fromJunctionId, toJunctionId }));

    // Check for winner after moving
    const { tokens, currentPlayer } = gameState;
    const newTokens = { ...tokens };
    delete newTokens[fromJunctionId];
    newTokens[toJunctionId] = currentPlayer;
    
    const winner = checkWinner(newTokens);
    
    if (winner) {
      console.log(`Game: Winner detected after move: Player ${winner}`);
      dispatch(setWinner(winner));
      
      // Update score
      const newScore = { ...gameState.score };
      const playerKey = winner === 1 ? 'player1' : 'player2';
      newScore[playerKey] += 1;
      dispatch(updateScore(newScore));
      
      // Check if someone won the match
      const roundsToWin = Math.ceil(settings.roundsPerGame / 2);
      if (newScore[playerKey] >= roundsToWin) {
        dispatch(setMatchWinner(winner));
        // Play match win sound
        playSound('matchWin');
      } else {
        // Play round win sound
        playSound('roundWin');
         // Show winner message using Modal
      const winnerName = winner === 1 ? settings.player1.name : settings.player2.name;
      dispatch(setMessage(`🎉 ${winnerName} Wins Round ${gameState.currentRound}! 🎉`));
      } 
      return; // Exit early after win
    }

    // If no win, play the token move sound
    playSound('draw');

    // Check if next player can move
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    const canNextPlayerMove = canPlayerMove(nextPlayer, newTokens);
    
    if (!winner && !canNextPlayerMove) {
      // Current player wins if next player can't move
      dispatch(setWinner(currentPlayer));
      
      // Update score
      const newScore = { ...gameState.score };
      const playerKey = currentPlayer === 1 ? 'player1' : 'player2';
      newScore[playerKey] += 1;
      dispatch(updateScore(newScore));
      
      // Check if someone won the match
      const roundsToWin = Math.ceil(settings.roundsPerGame / 2);
      if (newScore[playerKey] >= roundsToWin) {
        dispatch(setMatchWinner(currentPlayer));
      }
       else {
      // Show winner message using Modal
      const winnerName = currentPlayer === 1 ? settings.player1.name : settings.player2.name;
        dispatch(setMessage(`🎉 ${winnerName} Wins Round ${gameState.currentRound}! 🎉`));
      }
      
      if (newScore[playerKey] >= roundsToWin) {
        // Play match win sound
        playSound('matchWin');
      } else {
        // Play round win sound
        playSound('roundWin');
      }
      
    }
  };

  const handleNextRound = () => {
    dispatch(nextRound());
    // Play game start sound for new round
    playSound('gameStart');
  };

  const handleNewGame = () => {
    dispatch(resetGame());
    // Play game start sound for new game
    playSound('gameStart');
  };

  return (
    <>
      <HUD
        currentPlayer={gameState.currentPlayer.toString()}
        gamePhase={gameState.gamePhase === 'placing' ? 'placement' : 'movement'}
        tokensPlaced={gameState.tokensPlaced}
        winner={gameState.winner?.toString() || null}
        score={gameState.score}
        matchWinner={gameState.matchWinner?.toString() || null}
        currentRound={gameState.currentRound}
        onRestart={handleNewGame}
        onNextRound={handleNextRound}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => dispatch(setSoundEnabled(!settings.soundEnabled))}
      >
        <Board
          key={JSON.stringify(gameState.tokens)} // Force re-render when tokens change
          tokens={gameState.tokens}
          selectedToken={gameState.selectedToken}
          possibleMoves={gameState.possibleMoves}
          onJunctionPress={handleJunctionPress}
          currentPlayer={gameState.currentPlayer}
          gamePhase={gameState.gamePhase}
          onTokenDrop={handleTokenDrop}
          player1Color={settings.player1.color}
          player2Color={settings.player2.color}
          tokensPlaced={gameState.tokensPlaced}
          size={settings.boardSize}
        />
      </HUD>
      <GameModal />
    </>
  );
};
