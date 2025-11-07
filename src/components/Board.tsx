import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Token } from './Token';
import {
  BOARD_SIZE,
  JUNCTION_RADIUS,
  JUNCTIONS,
  CONNECTIONS,
} from '../constants/gameConstants';
import { checkWinner } from '../utils/gameUtils';

interface BoardProps {
  tokens: { [key: number]: number | null };
  selectedToken: number | null;
  possibleMoves: number[];
  onJunctionPress: (junctionId: number) => void;
  currentPlayer: 1 | 2;
  gamePhase: 'placing' | 'moving';
  onTokenDrop?: (fromJunctionId: number, toJunctionId: number | null) => void;
  player1Color?: string;
  player2Color?: string;
  tokensPlaced: { player1: number; player2: number };
  size?: 'small' | 'large';
}

export const Board: React.FC<BoardProps> = ({
  tokens,
  selectedToken,
  possibleMoves,
  onJunctionPress,
  currentPlayer,
  gamePhase,
  onTokenDrop,
  player1Color,
  player2Color,
  tokensPlaced,
  size = 'small',
}) => {
  console.log('Board: Received tokens prop:', JSON.stringify(tokens));
  
  // Log when tokens prop changes
  React.useEffect(() => {
    console.log('Board: tokens prop changed:', JSON.stringify(tokens));
  }, [tokens]);
  const screenWidth = Dimensions.get('window').width;
  const horizontalMargin = 10; // 10px margins on each side
  const availableWidth = screenWidth - (horizontalMargin * 2); // Available width after margins

  // Board size logic
  const LARGE_BOARD_SIZE = BOARD_SIZE + 40;
  const SMALL_BOARD_SIZE = Math.round(BOARD_SIZE * 0.7) + 40;
  // Increase board outer size by 20px
  const boardSize = size === 'large' ? LARGE_BOARD_SIZE + 20 : SMALL_BOARD_SIZE + 20;
  // For small board, make grid slightly smaller than board
  // Keep inner grid size unchanged from previous step
  const cellSize = size === 'large'
    ? (BOARD_SIZE / 2) + 10
    : Math.round((BOARD_SIZE * 0.7) * 0.45) + 15;

  // Center the grid inside the board
  const gridSize = cellSize * 2; // unchanged
  const offset = (boardSize - gridSize) / 2;

  const boardWidth = boardSize;
  const boardHeight = boardSize;

  const getJunctionPosition = (junction: { x: number; y: number }) => {
    return {
      x: offset + junction.x * cellSize - 3, // Move grid slightly left
      y: offset + junction.y * cellSize - 3,
    };
  };

  const findClosestJunction = (x: number, y: number): number | null => {
    let closestJunction = null;
    let minDistance = Infinity;
    const maxDistance = 60; // Maximum distance to consider a valid drop

    JUNCTIONS.forEach(junction => {
      const pos = getJunctionPosition(junction);
      const distance = Math.sqrt(
        Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
      );

      if (distance < minDistance && distance <= maxDistance) {
        minDistance = distance;
        closestJunction = junction.id;
      }
    });

    return closestJunction;
  };

  const checkIfWouldWin = (junctionId: number, currentPlayerTokens: number[]): boolean => {
    // Only check for third token
    if (currentPlayerTokens.length !== 2) return false;
    
    // Create a temporary tokens state with the new position
    const tempTokens: { [key: number]: number | null } = {};
    currentPlayerTokens.forEach(id => {
      tempTokens[id] = currentPlayer;
    });
    tempTokens[junctionId] = currentPlayer;
    
    // Use the existing checkWinner function
    return checkWinner(tempTokens) !== null;
  };

  const renderConnectionLine = (from: number, to: number, index: number) => {
    const fromJunction = JUNCTIONS.find(j => j.id === from)!;
    const toJunction = JUNCTIONS.find(j => j.id === to)!;
    const fromPos = getJunctionPosition(fromJunction);
    const toPos = getJunctionPosition(toJunction);

    const length = Math.sqrt(
      Math.pow(toPos.x - fromPos.x, 2) + Math.pow(toPos.y - fromPos.y, 2)
    );
    const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) * (180 / Math.PI);

    return (
      <View
        key={index}
        style={[
          styles.line,
          {
            left: fromPos.x,
            top: fromPos.y - 1,
            width: length,
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, { marginHorizontal: horizontalMargin }]}>
      <View style={[styles.board, { width: boardWidth, height: boardHeight }]}>
        {/* Draw connection lines */}
        {CONNECTIONS.map(([from, to], index) => renderConnectionLine(from, to, index))}

        {/* Draw junction points */}
        {JUNCTIONS.map(junction => {
          const pos = getJunctionPosition(junction);
          const isPossibleMove = possibleMoves.includes(junction.id);
          const hasToken = tokens[junction.id] !== undefined && tokens[junction.id] !== null;
          const currentPlayerColor = currentPlayer === 1 ? player1Color : player2Color;

          return (
            <TouchableOpacity
              key={junction.id}
              style={[
                styles.junction,
                {
                  left: pos.x - JUNCTION_RADIUS,
                  top: pos.y - JUNCTION_RADIUS,
                  backgroundColor: (() => {
                    if (hasToken) return 'transparent';
                    if (isPossibleMove) return currentPlayerColor ? `${currentPlayerColor}40` : '#F4D03F';
                    if (gamePhase === 'placing') {
                      const currentPlayerTokens = Object.entries(tokens)
                        .filter(([_, player]) => player === currentPlayer)
                        .map(([id]) => parseInt(id));
                      
                      // If this is the third token and would complete a line, don't highlight
                      if (currentPlayerTokens.length === 2 && checkIfWouldWin(junction.id, currentPlayerTokens)) {
                        return '#D4AF37';
                      }
                      return `${currentPlayerColor}40`;
                    }
                    return '#D4AF37';
                  })(),
                  borderColor: (() => {
                    if (hasToken) return 'transparent';
                    if (isPossibleMove) return currentPlayerColor || '#FF6B6B';
                    if (gamePhase === 'placing') {
                      const currentPlayerTokens = Object.entries(tokens)
                        .filter(([_, player]) => player === currentPlayer)
                        .map(([id]) => parseInt(id));
                      
                      // If this is the third token and would complete a line, don't highlight
                      if (currentPlayerTokens.length === 2 && checkIfWouldWin(junction.id, currentPlayerTokens)) {
                        return '#B8860B';
                      }
                      return currentPlayerColor;
                    }
                    return '#B8860B';
                  })(),
                  shadowColor: (() => {
                    if (isPossibleMove) return currentPlayerColor || '#FF6B6B';
                    if (gamePhase === 'placing') {
                      const currentPlayerTokens = Object.entries(tokens)
                        .filter(([_, player]) => player === currentPlayer)
                        .map(([id]) => parseInt(id));
                      
                      // If this is the third token and would complete a line, don't highlight
                      if (currentPlayerTokens.length === 2 && checkIfWouldWin(junction.id, currentPlayerTokens)) {
                        return '#FF6B6B';
                      }
                      return currentPlayerColor;
                    }
                    return '#FF6B6B';
                  })()
                },
              ]}
              onPress={() => onJunctionPress(junction.id)}
              activeOpacity={0.8}
            />
          );
        })}

        {/* Draw tokens */}
        {Object.entries(tokens).map(([junctionId, player]) => {
          console.log(`Board: Rendering token ${junctionId} for player ${player}`);
          if (player === null || player === undefined) return null;
          
          const junction = JUNCTIONS.find(j => j.id === parseInt(junctionId))!;
          const pos = getJunctionPosition(junction);
          const isSelected = selectedToken === parseInt(junctionId);
          const isCurrentPlayerToken = player === currentPlayer;
          const isDraggable = gamePhase === 'moving' && isCurrentPlayerToken;
          
          return (
            <Token
              key={junctionId}
              player={player as 1 | 2}
              x={pos.x}
              y={pos.y}
              junctionId={parseInt(junctionId)}
              isSelected={isSelected}
              isCurrentPlayerToken={isCurrentPlayerToken}
              isDraggable={isDraggable}
              color={player === 1 ? player1Color : player2Color}
              onPress={() => onJunctionPress(parseInt(junctionId))}
              onDragEnd={(x, y) => {
                console.log(`Board: Token ${junctionId} dropped at (${x}, ${y})`);
                const targetJunctionId = findClosestJunction(x, y);
                console.log(`Board: Closest junction is ${targetJunctionId}`);
                
                if (targetJunctionId !== null && targetJunctionId !== parseInt(junctionId) && onTokenDrop) {
                  console.log(`Board: Calling onTokenDrop(${junctionId}, ${targetJunctionId})`);
                  onTokenDrop(parseInt(junctionId), targetJunctionId);
                } else {
                  console.log(`Board: Drop rejected - target: ${targetJunctionId}, same: ${targetJunctionId === parseInt(junctionId)}, handler: ${!!onTokenDrop}`);
                }
              }}
            />
          );
        })}


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // Remove background - now invisible container
  },
  board: {
    // Refined wooden board appearance
    backgroundColor: '#8B4513', // Rich brown wood
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#5D4E75', // Purple-tinted shadow for retro feel
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    position: 'relative',
    // Wood grain border
    borderWidth: 3,
    borderColor: '#654321', // Darker wood edge
    // Ensure board is properly centered
    alignSelf: 'center',
  },
  line: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#FFD700', // Golden neon lines
    transformOrigin: '0 50%',
    borderRadius: 2,
    elevation: 4,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  junction: {
    position: 'absolute',
    width: JUNCTION_RADIUS * 2,
    height: JUNCTION_RADIUS * 2,
    borderRadius: JUNCTION_RADIUS,
    borderWidth: 2,
    // Metallic junction with retro glow
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
});
