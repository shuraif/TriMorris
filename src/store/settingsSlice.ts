import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string[];
    player1: string;
    player2: string;
    accent: string;
    text: string;
    border: string;
    shadow: string;
    button: string[];
  };
}

export interface PlayerConfig {
  name: string;
  color: string;
}

export interface SettingsState {
  theme: Theme;
  roundsPerGame: number;
  player1: PlayerConfig;
  player2: PlayerConfig;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  hasSeenHowToPlay: boolean;
  boardSize: 'small' | 'large';
}

// Available themes
export const THEMES: Theme[] = [
  {
    id: 'classic',
    name: 'Classic',
    colors: {
  background: ['#0B0C2A', '#1E1A78', '#2D1B69'],
  button: ['#1E1A78', '#FFD700'],
      player1: '#FF6B6B',
      player2: '#4ECDC4',
      accent: '#FFD700',
      text: '#FFFFFF',
      border: '#FFFFFF',
      shadow: '#FF6B6B',
    },
  },
  {
    id: 'retro',
    name: 'Retro',
    colors: {
  background: ['#2C1810', '#8B4513', '#A0522D'],
  button: ['#8B4513', '#FFD700'],
      player1: '#FF8C00',
      player2: '#32CD32',
      accent: '#FFD700',
      text: '#FFF8DC',
      border: '#DEB887',
      shadow: '#FF8C00',
    },
  },
  {
    id: 'fancy',
    name: 'Fancy',
    colors: {
      background: ['#0F0F23', '#1A1A2E', '#16213E'],
      player1: '#E94560',
      player2: '#0F3460',
      accent: '#F39C12',
      text: '#F5F5F5',
      border: '#E0E0E0',
      shadow: '#E94560',
      button: ['#1A1A2E', '#E94560'],
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      background: ['#0D1B2A', '#1B263B', '#415A77'],
      player1: '#F72585',
      player2: '#4CC9F0',
      accent: '#FFB700',
      text: '#FFFFFF',
      border: '#B0E0E6',
      shadow: '#4CC9F0',
      button: ['#1B263B', '#4CC9F0'],
    },
  },
];

const initialState: SettingsState = {
  theme: THEMES[0], // Classic theme as default
  roundsPerGame: 3,
  player1: {
    name: 'Player 1',
    color: THEMES[0].colors.player1,
  },
  player2: {
    name: 'Player 2',
    color: THEMES[0].colors.player2,
  },
  soundEnabled: true,
  vibrationEnabled: true,
  animationSpeed: 'normal',
  hasSeenHowToPlay: false,
  boardSize: 'small',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      // Update player colors to match theme
      state.player1.color = action.payload.colors.player1;
      state.player2.color = action.payload.colors.player2;
    },
    setRoundsPerGame: (state, action: PayloadAction<number>) => {
      state.roundsPerGame = action.payload;
    },
    setPlayerConfig: (state, action: PayloadAction<{ player: 1 | 2; config: PlayerConfig }>) => {
      const { player, config } = action.payload;
      if (player === 1) {
        state.player1 = config;
      } else {
        state.player2 = config;
      }
    },
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    setVibrationEnabled: (state, action: PayloadAction<boolean>) => {
      state.vibrationEnabled = action.payload;
    },
    setAnimationSpeed: (state, action: PayloadAction<'slow' | 'normal' | 'fast'>) => {
      state.animationSpeed = action.payload;
    },
    setHasSeenHowToPlay: (state, action: PayloadAction<boolean>) => {
      state.hasSeenHowToPlay = action.payload;
    },
    setBoardSize: (state, action: PayloadAction<'small' | 'large'>) => {
      state.boardSize = action.payload;
    },
    resetSettings: (state) => {
      return initialState;
    },
  },
});

export const {
  setTheme,
  setRoundsPerGame,
  setPlayerConfig,
  setSoundEnabled,
  setVibrationEnabled,
  setAnimationSpeed,
  setHasSeenHowToPlay,
  setBoardSize,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
