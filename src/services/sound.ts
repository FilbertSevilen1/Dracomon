class SoundService {
  private ctx: AudioContext | null = null;
  private musicInterval: any = null;
  private musicNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentStep = 0;
  private currentStageNum = 1;
  
  // Volume controls (0 - 1)
  private musicVolume = 0.5;
  private sfxVolume = 0.6;
  private isMuted = false;
  private isMusicEnabled = true;

  public setStageMusic(stageNum: number) {
    this.currentStageNum = stageNum;
    // Restart BGM if already playing to immediately transition to the new stage's sound profile
    if (this.musicInterval) {
      this.stopBGM();
      this.playBGM();
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public updateVolumes(musicVol: number, sfxVol: number, musicEnabled: boolean) {
    this.musicVolume = Math.max(0, Math.min(1, musicVol / 100));
    this.sfxVolume = Math.max(0, Math.min(1, sfxVol / 100));
    this.isMusicEnabled = musicEnabled;

    if (!this.isMusicEnabled || this.isMuted) {
      this.stopBGM();
    } else if (musicEnabled && !this.musicInterval) {
      this.playBGM();
    }
  }

  // PLAY SFX: Click
  public playClick() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // PLAY SFX: Jump
  public playJump() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(this.sfxVolume * 0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // PLAY SFX: Coin
  public playCoin() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const playBeep = (freq: number, startTime: number, duration: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = this.ctx.currentTime;
    playBeep(987.77, now, 0.08); // B5
    playBeep(1318.51, now + 0.08, 0.18); // E6
  }

  // PLAY SFX: Hit
  public playHit() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(this.sfxVolume * 0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // PLAY SFX: Shoot
  public playShoot() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(this.sfxVolume * 0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // PLAY SFX: Block
  public playBlock() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.setValueAtTime(300, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(this.sfxVolume * 0.7, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // PLAY SFX: Level Up
  public playLevelUp() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const playNote = (freq: number, startTime: number, duration: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
    notes.forEach((freq, index) => {
      playNote(freq, now + index * 0.08, 0.3);
    });
  }

  // PLAY SFX: Grim Reaper Scythe Death 💀⚔️
  public playScytheDeath() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Dark spectral blade slice sound
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(180, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

    gain.gain.setValueAtTime(this.sfxVolume * 0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 0.5);
    subOsc.stop(now + 0.5);
  }

  // PLAY SFX: Divine Thunderbolt Electrocution Death ⚡💥
  public playThunderboltDeath() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    
    // 1. High-voltage lightning crackle noise
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1800, now);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.sfxVolume * 0.75, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    // 2. Heavy thunder bass boom thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

    oscGain.gain.setValueAtTime(this.sfxVolume * 0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noise.start(now);
    osc.start(now);
    noise.stop(now + 0.35);
    osc.stop(now + 0.4);
  }

  // PLAY SFX: Molten Lava / Acid Meltdown Death 🌋☠️
  public playLavaDeath() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);

    // Low-pass sizzle filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(150, now + 0.6);

    gain.gain.setValueAtTime(this.sfxVolume * 0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // PLAY SFX: Sub-Zero Flash Freeze Ice Death 🧊❄️
  public playIceDeath() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const playCrystalChime = (freq: number, offset: number, dur: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + offset);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + offset + dur);

      gain.gain.setValueAtTime(this.sfxVolume * 0.6, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + dur);
    };

    // Glassy crystal shattering chime cascade (Sub-Zero Freeze)
    playCrystalChime(1567.98, 0, 0.25);   // G6
    playCrystalChime(1318.51, 0.06, 0.25); // E6
    playCrystalChime(1046.50, 0.12, 0.3);  // C6
    playCrystalChime(783.99, 0.18, 0.35);  // G5
  }

  // BGM: Procedural Music Loop
  public playBGM() {
    this.initCtx();
    if (!this.ctx || this.musicInterval || !this.isMusicEnabled || this.isMuted) return;

    // Stage-specific Chord Progressions, Tempos and Synthesizer Waveforms
    let progressions = [
      [261.63, 329.63, 392.00, 523.25], // C4, E4, G4, C5 (C Major)
      [174.61, 220.00, 261.63, 349.23], // F3, A3, C4, F4 (F Major)
      [196.00, 246.94, 293.66, 392.00], // G3, B3, D4, G4 (G Major)
      [261.63, 329.63, 392.00, 523.25], // C4, E4, G4, C5 (C Major)
    ];
    let tempo = 120; // Default Stage 1 tempo
    let leadWaveform: OscillatorType = 'sine';
    let bassWaveform: OscillatorType = 'sine';

    if (this.currentStageNum === 2) {
      // Stage 2 (Goblin Woods) - Creepy/Mysterious minor feel
      progressions = [
        [220.00, 261.63, 329.63, 440.00], // A3, C4, E4, A4 (A Minor)
        [174.61, 220.00, 261.63, 349.23], // F3, A3, C4, F4 (F Major)
        [293.66, 349.23, 440.00, 587.33], // D4, F4, A4, D5 (D Minor)
        [246.94, 293.66, 392.00, 493.88], // B3, D4, G4, B4 (G Major)
      ];
      tempo = 135;
      leadWaveform = 'triangle';
      bassWaveform = 'sine';
    } else if (this.currentStageNum === 3) {
      // Stage 3 (Volcanic Peak) - Fiery/Aggressive Phrygian/Minor feel
      progressions = [
        [164.81, 196.00, 246.94, 329.63], // E3, G3, B3, E4 (E Minor)
        [174.61, 220.00, 261.63, 349.23], // F3, A3, C4, F4 (F Major)
        [196.00, 233.08, 293.66, 392.00], // G3, Bb3, D4, G4 (G Minor)
        [164.81, 196.00, 246.94, 329.63], // E3, G3, B3, E4 (E Minor)
      ];
      tempo = 160;
      leadWaveform = 'sawtooth';
      bassWaveform = 'triangle';
    } else if (this.currentStageNum === 4) {
      // Stage 4 (Frozen Citadel) - Slow, chilling atmospheric bells
      progressions = [
        [293.66, 349.23, 440.00, 587.33], // D4, F4, A4, D5 (D Dorian)
        [392.00, 493.88, 587.33, 783.99], // G4, B4, D5, G5 (G Major)
        [440.00, 523.25, 659.25, 880.00], // A4, C5, E5, A5 (A Minor)
        [293.66, 349.23, 440.00, 587.33], // D4, F4, A4, D5 (D Dorian)
      ];
      tempo = 105;
      leadWaveform = 'sine';
      bassWaveform = 'sine';
    } else if (this.currentStageNum === 5) {
      // Stage 5 (Shadow Abyss) - Heavy, pulsing synth bass
      progressions = [
        [138.59, 164.81, 207.65, 277.18], // C#3, E3, G#3, C#4 (C# Minor)
        [220.00, 277.18, 329.63, 440.00], // A3, C#4, E4, A4 (A Major)
        [207.65, 246.94, 311.13, 415.30], // G#3, B3, D#4, G#4 (G# Minor)
        [138.59, 164.81, 207.65, 277.18], // C#3, E3, G#3, C#4 (C# Minor)
      ];
      tempo = 142;
      leadWaveform = 'square';
      bassWaveform = 'square';
    } else if (this.currentStageNum === 6) {
      // Stage 6 (Celestial Temple) - Epic, fast melodic speed run
      progressions = [
        [369.99, 466.16, 554.37, 739.99], // F#4, A#4, C#5, F#5 (F# Major)
        [311.13, 369.99, 466.16, 622.25], // D#4, F#4, A#4, D#5 (D# Minor)
        [277.18, 329.63, 415.30, 554.37], // C#4, E4, G#4, C#5 (C# Major)
        [246.94, 293.66, 392.00, 493.88], // B3, D4, G4, B4 (B Major)
      ];
      tempo = 165;
      leadWaveform = 'sawtooth';
      bassWaveform = 'triangle';
    } else if (this.currentStageNum === 7) {
      // Stage 7 (Sky Heavens) - Bright energetic high-altitude BGM
      progressions = [
        [293.66, 349.23, 440.00, 587.33], // D Minor
        [329.63, 392.00, 493.88, 659.25], // E Minor
        [349.23, 440.00, 523.25, 698.46], // F Major
        [392.00, 493.88, 587.33, 783.99], // G Major
      ];
      tempo = 150;
      leadWaveform = 'triangle';
      bassWaveform = 'sine';
    } else if (this.currentStageNum === 8) {
      // Stage 8 (Primordial Core - Final Dragon King) - Doom volcanic dark boss BGM
      progressions = [
        [164.81, 196.00, 246.94, 329.63], // E Minor
        [155.56, 196.00, 233.08, 311.13], // Eb Minor
        [146.83, 174.61, 220.00, 293.66], // D Minor
        [164.81, 196.00, 246.94, 329.63], // E Minor
      ];
      tempo = 175;
      leadWaveform = 'sawtooth';
      bassWaveform = 'square';
    }

    const stepDuration = 60 / tempo; // duration in seconds per step

    this.musicInterval = setInterval(() => {
      this.initCtx();
      if (!this.ctx || this.isMuted || this.musicVolume === 0) return;

      const chordIndex = Math.floor(this.currentStep / 8) % progressions.length;
      const noteIndex = this.currentStep % 4;
      
      // Melody note
      const baseChord = progressions[chordIndex];
      const freq = baseChord[noteIndex];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = leadWaveform;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Volume is soft and fades smoothly
      const leadVolumeMult = leadWaveform === 'sawtooth' || leadWaveform === 'square' ? 0.08 : 0.15;
      gain.gain.setValueAtTime(this.musicVolume * leadVolumeMult, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + stepDuration - 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + stepDuration);

      // Save references in case we want to stop immediately
      this.musicNodes.push({ osc, gain });
      if (this.musicNodes.length > 10) {
        this.musicNodes.shift();
      }

      // Simple bass line on step 0 and 4
      if (this.currentStep % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = bassWaveform;
        bassOsc.frequency.setValueAtTime(baseChord[0] / 2, this.ctx.currentTime); // Octave down

        const bassVolumeMult = bassWaveform === 'square' || (bassWaveform as string) === 'sawtooth' ? 0.12 : 0.22;
        bassGain.gain.setValueAtTime(this.musicVolume * bassVolumeMult, this.ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + stepDuration * 1.8);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);

        bassOsc.start();
        bassOsc.stop(this.ctx.currentTime + stepDuration * 2);

        this.musicNodes.push({ osc: bassOsc, gain: bassGain });
      }

      this.currentStep++;
    }, stepDuration * 1000);
  }

  public stopBGM() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.musicNodes.forEach(node => {
      try {
        node.osc.stop();
      } catch (e) {}
    });
    this.musicNodes = [];
  }
}

export const soundService = new SoundService();
export default soundService;
