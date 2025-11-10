export const BOARD_SIZE = 320;
export const JUNCTION_RADIUS = 12; // Reduced from 16 to 12
export const TOKEN_RADIUS = 18; // Increased from 13 to 18

export const PLAYER_COLORS = {
  PLAYER1: '#4A90E2',
  PLAYER2: '#E74C3C',
};

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

export const CONNECTIONS = [
  [0, 1], [1, 2], [2, 5], [5, 8], [8, 7], [7, 6], [6, 3], [3, 0], // Outer square
  [1, 4], [4, 7], [3, 4], [4, 5], // Cross lines
  [0, 4], [2, 4], [4, 6], [4, 8], // Diagonal lines
];

export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
  [0, 4, 8], [2, 4, 6], // Diagonal
];
