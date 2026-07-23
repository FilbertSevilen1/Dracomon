class SoundService {
  private ctx: AudioContext | null = null;
  private musicInterval: any = null;
  private musicNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentStep = 0;
  private currentStageNum = 1;

  private musicVolume = 0.5;
  private sfxVolume = 0.6;
  private isMuted = false;
  private isMusicEnabled = true;

  public setStageMusic(stageNum: number) {
    this.currentStageNum = stageNum;

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
    playBeep(987.77, now, 0.08);
    playBeep(1318.51, now + 0.08, 0.18);
  }

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
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      playNote(freq, now + index * 0.08, 0.3);
    });
  }

  public playScytheDeath() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

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

  public playThunderboltDeath() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;

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

  public playLavaDeath() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);

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

    playCrystalChime(1567.98, 0, 0.25);
    playCrystalChime(1318.51, 0.06, 0.25);
    playCrystalChime(1046.50, 0.12, 0.3);
    playCrystalChime(783.99, 0.18, 0.35);
  }

  public playBGM() {
    this.initCtx();
    if (!this.ctx || this.musicInterval || !this.isMusicEnabled || this.isMuted) return;

    let progressions = [
      [261.63, 329.63, 392.00, 523.25],
      [174.61, 220.00, 261.63, 349.23],
      [196.00, 246.94, 293.66, 392.00],
      [261.63, 329.63, 392.00, 523.25],
    ];
    let tempo = 120;
    let leadWaveform: OscillatorType = 'sine';
    let bassWaveform: OscillatorType = 'sine';

    if (this.currentStageNum === 2) {
      progressions = [
        [220.00, 261.63, 329.63, 440.00],
        [174.61, 220.00, 261.63, 349.23],
        [293.66, 349.23, 440.00, 587.33],
        [246.94, 293.66, 392.00, 493.88],
      ];
      tempo = 135;
      leadWaveform = 'triangle';
      bassWaveform = 'sine';
    } else if (this.currentStageNum === 3) {
      progressions = [
        [164.81, 196.00, 246.94, 329.63],
        [174.61, 220.00, 261.63, 349.23],
        [196.00, 233.08, 293.66, 392.00],
        [164.81, 196.00, 246.94, 329.63],
      ];
      tempo = 160;
      leadWaveform = 'sawtooth';
      bassWaveform = 'triangle';
    } else if (this.currentStageNum === 4) {
      progressions = [
        [293.66, 349.23, 440.00, 587.33],
        [392.00, 493.88, 587.33, 783.99],
        [440.00, 523.25, 659.25, 880.00],
        [293.66, 349.23, 440.00, 587.33],
      ];
      tempo = 105;
      leadWaveform = 'sine';
      bassWaveform = 'sine';
    } else if (this.currentStageNum === 5) {
      progressions = [
        [138.59, 164.81, 207.65, 277.18],
        [220.00, 277.18, 329.63, 440.00],
        [207.65, 246.94, 311.13, 415.30],
        [138.59, 164.81, 207.65, 277.18],
      ];
      tempo = 142;
      leadWaveform = 'square';
      bassWaveform = 'square';
    } else if (this.currentStageNum === 6) {
      progressions = [
        [369.99, 466.16, 554.37, 739.99],
        [311.13, 369.99, 466.16, 622.25],
        [277.18, 329.63, 415.30, 554.37],
        [246.94, 293.66, 392.00, 493.88],
      ];
      tempo = 165;
      leadWaveform = 'sawtooth';
      bassWaveform = 'triangle';
    } else if (this.currentStageNum === 7) {
      progressions = [
        [293.66, 349.23, 440.00, 587.33],
        [329.63, 392.00, 493.88, 659.25],
        [349.23, 440.00, 523.25, 698.46],
        [392.00, 493.88, 587.33, 783.99],
      ];
      tempo = 150;
      leadWaveform = 'triangle';
      bassWaveform = 'sine';
    } else if (this.currentStageNum === 8) {
      progressions = [
        [164.81, 196.00, 246.94, 329.63],
        [155.56, 196.00, 233.08, 311.13],
        [146.83, 174.61, 220.00, 293.66],
        [164.81, 196.00, 246.94, 329.63],
      ];
      tempo = 175;
      leadWaveform = 'sawtooth';
      bassWaveform = 'square';
    }

    const stepDuration = 60 / tempo;

    this.musicInterval = setInterval(() => {
      this.initCtx();
      if (!this.ctx || this.isMuted || this.musicVolume === 0) return;

      const chordIndex = Math.floor(this.currentStep / 8) % progressions.length;
      const noteIndex = this.currentStep % 4;

      const baseChord = progressions[chordIndex];
      const freq = baseChord[noteIndex];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = leadWaveform;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const leadVolumeMult = leadWaveform === 'sawtooth' || leadWaveform === 'square' ? 0.08 : 0.15;
      gain.gain.setValueAtTime(this.musicVolume * leadVolumeMult, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + stepDuration - 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + stepDuration);

      this.musicNodes.push({ osc, gain });
      if (this.musicNodes.length > 10) {
        this.musicNodes.shift();
      }

      if (this.currentStep % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = bassWaveform;
        bassOsc.frequency.setValueAtTime(baseChord[0] / 2, this.ctx.currentTime);

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
