# TriMorris Junction Identification System

## Overview

TriMorris (Three Men's Morris) uses a coordinate-based junction identification system that maps a 3x3 grid to unique IDs. This document explains how junctions are identified, connected, and used throughout the game.

## Junction Layout

### Visual Representation
```
0 ——— 1 ——— 2
|  \  |  /  |
|   \ | /   |
3 ——— 4 ——— 5
|   / | \   |
|  /  |  \  |
6 ——— 7 ——— 8
```

### Coordinate System
Each junction has:
- **Unique ID**: Integer from 0-8
- **Grid Coordinates**: (x, y) position in 3x3 grid
- **Screen Position**: Calculated pixel coordinates for rendering

```typescript
export const JUNCTIONS = [
  { id: 0, x: 0, y: 0 },       // Top-left
  { id: 1, x: 1, y: 0 },       // Top-center
  { id: 2, x: 2, y: 0 },       // Top-right
  { id: 3, x: 0, y: 1 },       // Middle-left
  { id: 4, x: 1, y: 1 },       // Center
  { id: 5, x: 2, y: 1 },       // Middle-right
  { id: 6, x: 0, y: 2 },       // Bottom-left
  { id: 7, x: 1, y: 2 },       // Bottom-center
  { id: 8, x: 2, y: 2 },       // Bottom-right
];
```

## Connection System

### Valid Connections
Players can only move tokens along predefined connections:

```typescript
export const CONNECTIONS = [
  // Outer square perimeter
  [0, 1], [1, 2], [2, 5], [5, 8], 
  [8, 7], [7, 6], [6, 3], [3, 0],
  
  // Cross lines (horizontal/vertical through center)
  [1, 4], [4, 7], [3, 4], [4, 5],
  
  // Diagonal lines through center
  [0, 4], [2, 4], [4, 6], [4, 8]
];
```

### Connection Types
1. **Outer Square**: Forms the perimeter (8 connections)
2. **Cross Lines**: Horizontal and vertical through center (4 connections)
3. **Diagonal Lines**: All four diagonals through center (4 connections)

## Game State Management

### Token Storage
Tokens are stored as junction ID → player number mapping:

```typescript
tokens: { [key: number]: number | null }

// Example game state:
{
  0: 1,    // Player 1 token at top-left
  4: 2,    // Player 2 token at center
  8: 1,    // Player 1 token at bottom-right
  // Other junctions are empty (undefined/null)
}
```

### Position Calculation
Screen coordinates are calculated from grid coordinates:

```typescript
const getJunctionPosition = (junction: { x: number; y: number }) => {
  return {
    x: offset + junction.x * cellSize - 3,
    y: offset + junction.y * cellSize - 3,
  };
};
```

## Winning Conditions

### Winning Lines
A player wins by forming a line of 3 tokens:

```typescript
export const WINNING_LINES = [
  // Horizontal lines
  [0, 1, 2],  // Top row
  [3, 4, 5],  // Middle row
  [6, 7, 8],  // Bottom row
  
  // Vertical lines
  [0, 3, 6],  // Left column
  [1, 4, 7],  // Center column
  [2, 5, 8],  // Right column
  
  // Diagonal lines
  [0, 4, 8],  // Top-left to bottom-right
  [2, 4, 6],  // Top-right to bottom-left
];
```

## Movement Logic

### Finding Adjacent Junctions
```typescript
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
```

### Valid Move Detection
```typescript
export const getAvailableMoves = (
  junctionId: number,
  tokens: { [key: number]: number | null }
): number[] => {
  const adjacent = getAdjacentJunctions(junctionId);
  return adjacent.filter(id => tokens[id] === undefined || tokens[id] === null);
};
```

## AI System

### AI Move Generation
The AI analyzes the game state using junction IDs:

```typescript
function getAIMove(gameState: any) {
  if (gameState.gamePhase === 'placing') {
    // Find empty junctions (0-8)
    const emptySpots = Array.from({ length: 9 }, (_, idx) => idx)
      .filter(idx => gameState.tokens[idx] === undefined || gameState.tokens[idx] === null);
    
    return { type: 'place', index: emptySpots[0] };
  }
  
  if (gameState.gamePhase === 'moving') {
    // Find AI tokens and available moves
    for (let i = 0; i < 9; i++) {
      if (gameState.tokens[i] === 2) {
        const moves = getAvailableMoves(i, gameState.tokens);
        if (moves.length > 0) {
          return { type: 'move', from: i, to: moves[0] };
        }
      }
    }
  }
  
  return null;
}
```

## User Interactions

### Touch/Tap Handling
```typescript
const handleJunctionPress = (junctionId: number) => {
  if (gameState.gamePhase === 'placing') {
    // Place token at junction if empty
    if (!gameState.tokens[junctionId]) {
      dispatch(placeTokenAction({ junctionId, player: 1 }));
    }
  } else if (gameState.gamePhase === 'moving') {
    // Select token or move to target junction
    if (gameState.tokens[junctionId] === currentPlayer) {
      // Select own token
      const moves = getAvailableMoves(junctionId, gameState.tokens);
      dispatch(selectToken({ junctionId, possibleMoves: moves }));
    } else if (gameState.possibleMoves.includes(junctionId)) {
      // Move to valid target
      dispatch(moveTokenAction({ 
        fromJunctionId: gameState.selectedToken, 
        toJunctionId: junctionId 
      }));
    }
  }
};
```

### Drag and Drop Support
```typescript
const handleTokenDrop = (fromJunctionId: number, toJunctionId: number | null) => {
  if (
    toJunctionId !== null &&
    gameState.tokens[fromJunctionId] === currentPlayer &&
    (gameState.tokens[toJunctionId] === undefined || gameState.tokens[toJunctionId] === null)
  ) {
    dispatch(moveTokenAction({ fromJunctionId, toJunctionId }));
  }
};
```

## Key Features

### Advantages of This System
1. **Simple Mapping**: Direct 1:1 correspondence between grid positions and IDs
2. **Efficient Storage**: Uses junction IDs as object keys for O(1) lookup
3. **Flexible Rendering**: Easy conversion between logical and screen coordinates  
4. **Connection-Based Logic**: Clear definition of valid moves through connections
5. **Extensible**: Easy to modify board layout or add new junction types

### Performance Considerations
- **Memory Efficient**: Only stores occupied junctions in game state
- **Fast Lookups**: Junction ID → player mapping is O(1)
- **Minimal Calculations**: Screen positions calculated once per render
- **Optimized Rendering**: Only re-renders changed junctions

## Game Rules Implementation

### Placement Phase
- Players alternate placing tokens on empty junctions (IDs 0-8)
- Each player places exactly 3 tokens
- Special rule: Cannot win by placing the third token in a line

### Movement Phase  
- Players can only move tokens to adjacent empty junctions
- Movement follows predefined connections
- Players can win by moving tokens to form a line

### Victory Conditions
- Form any of the 8 possible winning lines
- Game ends immediately when a line is detected
- Draw if no player can move and no winner exists

This junction identification system provides the foundation for all game logic, from basic token placement to complex AI decision-making and user interaction handling.