import Sound from 'react-native-sound';

const soundFiles = {
  draw: 'draw',
  gameStart: 'game_start',
  invalidMove: 'invalid_move',
  matchWin: 'match_win',
  roundWin: 'round_win',
  tokenPlace: 'token_place',
  tokenSelect: 'token_select',
};

class SoundManager {
  private sounds: { [key: string]: Sound | null } = {};
  private loaded = false;

  async loadAll() {
    if (this.loaded) return;
    Sound.setCategory('Playback');
    const promises = Object.entries(soundFiles).map(([key, fileName]) => {
      return new Promise<void>((resolve, reject) => {
        const sound = new Sound(fileName, '', (error) => {
          if (error) {
            console.log(`Failed to load sound ${fileName}`, error);
            this.sounds[key] = null;
            resolve();
            return;
          }
          this.sounds[key] = sound;
          resolve();
        });
      });
    });
    await Promise.all(promises);
    this.loaded = true;
  }

  play(type: keyof typeof soundFiles, enabled: boolean = true) {
    if (!enabled) return;
    const sound = this.sounds[type];
    if (sound) {
      sound.stop(() => {
        sound.play((success: boolean) => {
          if (!success) {
            console.log(`Sound playback failed for ${type}`);
          }
        });
      });
    }
  }

  releaseAll() {
    Object.values(this.sounds).forEach(sound => {
      if (sound) sound.release();
    });
    this.sounds = {};
    this.loaded = false;
  }
}

export default new SoundManager();
