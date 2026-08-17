import { getLevel } from '../game/LevelManager';

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

  public playJump(isDemo = false) {
    if (isDemo) return;
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

  public playHit(isDemo = false) {
    if (isDemo) return;
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

  public playShoot(isDemo = false) {
    if (isDemo) return;
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

  public playBlock(isDemo = false) {
    if (isDemo) return;
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

  public playLevelUp(isDemo = false) {
    if (isDemo) return;
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

  public playScytheDeath(isDemo = false) {
    if (isDemo) return;
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

  public playThunderboltDeath(isDemo = false) {
    if (isDemo) return;
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

  public playLavaDeath(isDemo = false) {
    if (isDemo) return;
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const duration = 0.85;

    // 1. High-frequency Steam Sizzle & Vapor Hiss Noise Layer (TSHHH-FZZZ!)
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.94 ? 1.4 : 0.7);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const sizzleFilter = this.ctx.createBiquadFilter();
    sizzleFilter.type = 'bandpass';
    sizzleFilter.frequency.setValueAtTime(4500, now);
    sizzleFilter.frequency.exponentialRampToValueAtTime(800, now + duration);
    sizzleFilter.Q.setValueAtTime(1.8, now);

    const sizzleGain = this.ctx.createGain();
    sizzleGain.gain.setValueAtTime(0.01, now);
    sizzleGain.gain.linearRampToValueAtTime(this.sfxVolume * 0.9, now + 0.03);
    sizzleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(sizzleFilter);
    sizzleFilter.connect(sizzleGain);
    sizzleGain.connect(this.ctx.destination);

    // 2. Highpass Steam Puff Layer (shhh sizzle)
    const noise2 = this.ctx.createBufferSource();
    noise2.buffer = buffer;

    const hpFilter = this.ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(2500, now);
    hpFilter.frequency.linearRampToValueAtTime(1200, now + duration * 0.6);

    const hpGain = this.ctx.createGain();
    hpGain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
    hpGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.7);

    noise2.connect(hpFilter);
    hpFilter.connect(hpGain);
    hpGain.connect(this.ctx.destination);

    // 3. Low Sub-Molten Boiling Bubble Rumble Layer
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + duration);

    const subFilter = this.ctx.createBiquadFilter();
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(300, now);
    subFilter.frequency.linearRampToValueAtTime(80, now + duration);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.ctx.destination);

    noise.start(now);
    noise2.start(now);
    subOsc.start(now);

    noise.stop(now + duration);
    noise2.stop(now + duration);
    subOsc.stop(now + duration);
  }

  public playIceDeath(isDemo = false) {
    if (isDemo) return;
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

  public playAzuremonCharge(isDemo = false) {
    if (isDemo) return;
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const duration = 0.5;

    // Rising energy pitch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + duration);

    // Filter to sweep up and sound like charging
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(2000, now + duration);
    filter.Q.setValueAtTime(5.0, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.7, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);

    // Add a secondary sine oscillator for sub-bass build up
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(50, now);
    subOsc.frequency.linearRampToValueAtTime(120, now + duration);

    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(this.sfxVolume * 0.8, now + duration);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + duration);
  }

  public playAzuremonBeam(isDemo = false) {
    if (isDemo) return;
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    
    // 1. Dragon Roar / Growl (two detuned sawtooth oscillators)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const growlGain = this.ctx.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(85, now);
    osc1.frequency.linearRampToValueAtTime(55, now + 3.0);
    
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(88, now);
    osc2.frequency.linearRampToValueAtTime(57, now + 3.0);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(350, now);
    lowpass.frequency.exponentialRampToValueAtTime(120, now + 3.5);

    growlGain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
    growlGain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, now + 1.0);
    growlGain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);

    osc1.connect(lowpass);
    osc2.connect(lowpass);
    lowpass.connect(growlGain);
    growlGain.connect(this.ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 4.0);
    osc2.stop(now + 4.0);

    // 2. Rushing Breath Wind (White noise + bandpass sweep)
    const bufSize = this.ctx.sampleRate * 3.5;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 3.0);
    noiseFilter.Q.setValueAtTime(1.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.sfxVolume * 0.65, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    noise.start(now);
    noise.stop(now + 3.5);

    // 3. Flame Crackle (Modulated bandpass filter noise sweep)
    const crackleSource = this.ctx.createBufferSource();
    crackleSource.buffer = buf;

    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = 'peaking';
    crackleFilter.frequency.setValueAtTime(2500, now);
    crackleFilter.frequency.exponentialRampToValueAtTime(1200, now + 3.0);
    crackleFilter.Q.setValueAtTime(8.0, now);

    const crackleGain = this.ctx.createGain();
    crackleGain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    // Dynamic random/vibrato modulation to simulate flames crackling
    const modOsc = this.ctx.createOscillator();
    modOsc.type = 'sine';
    modOsc.frequency.setValueAtTime(35, now);
    
    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(this.sfxVolume * 0.1, now);

    modOsc.connect(modGain);
    modGain.connect(crackleGain.gain);

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(this.ctx.destination);

    crackleSource.start(now);
    modOsc.start(now);
    crackleSource.stop(now + 3.0);
    modOsc.stop(now + 3.0);
  }

  public playAzuremonImpact(isDemo = false) {
    if (isDemo) return;
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const duration = 0.15;

    // Short debris crash noise
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + duration);
    filter.Q.setValueAtTime(1.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.sfxVolume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + duration);

    // Deep impact thump
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = 'triangle';
    thump.frequency.setValueAtTime(130, now);
    thump.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    thumpGain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    thump.connect(thumpGain);
    thumpGain.connect(this.ctx.destination);
    thump.start(now);
    thump.stop(now + 0.12);
  }

  public playBlackHoleActivation(isDemo = false) {
    if (isDemo) return;
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;

    // Deep sub-bass gravitational rumble
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 1.2);
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(this.sfxVolume * 0.9, now + 0.08);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.2);

    // Mid-range gravitational collapse tone
    const midOsc = this.ctx.createOscillator();
    const midGain = this.ctx.createGain();
    midOsc.type = 'sawtooth';
    midOsc.frequency.setValueAtTime(220, now);
    midOsc.frequency.exponentialRampToValueAtTime(40, now + 0.9);
    const midFilter = this.ctx.createBiquadFilter();
    midFilter.type = 'lowpass';
    midFilter.frequency.setValueAtTime(600, now);
    midFilter.frequency.exponentialRampToValueAtTime(80, now + 0.9);
    midGain.gain.setValueAtTime(this.sfxVolume * 0.55, now);
    midGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    midOsc.connect(midFilter);
    midFilter.connect(midGain);
    midGain.connect(this.ctx.destination);
    midOsc.start(now);
    midOsc.stop(now + 0.9);

    // Spacetime distortion white-noise burst
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const bufData = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) bufData[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(120, now);
    noiseFilter.Q.setValueAtTime(0.8, now);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + 0.4);

    // High-pitched event horizon ring (photon sphere)
    const ringOsc = this.ctx.createOscillator();
    const ringGain = this.ctx.createGain();
    ringOsc.type = 'sine';
    ringOsc.frequency.setValueAtTime(880, now + 0.05);
    ringOsc.frequency.exponentialRampToValueAtTime(220, now + 0.6);
    ringGain.gain.setValueAtTime(0, now + 0.05);
    ringGain.gain.linearRampToValueAtTime(this.sfxVolume * 0.35, now + 0.15);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    ringOsc.connect(ringGain);
    ringGain.connect(this.ctx.destination);
    ringOsc.start(now + 0.05);
    ringOsc.stop(now + 0.6);
  }

  public playBlackHolePulse(isDemo = false) {
    if (isDemo) return;
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;

    // Gravitational wave pulse — deep thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);
    gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);

    // High harmonic overtone
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(320, now);
    osc2.frequency.exponentialRampToValueAtTime(110, now + 0.3);
    gain2.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.3);
  }

  public playQuicksandDeath() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;
    const now = this.ctx.currentTime;

    // Deep gurgling sinking vortex noise
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.8);
    gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);

    // Sand friction noise buffer
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.8);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.8);
    filter.Q.setValueAtTime(2.0, now);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + 0.8);
  }

  public playSciFiLaser() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);
    gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playPyramidCharge() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(320, now + 0.4);
    gain.gain.setValueAtTime(this.sfxVolume * 0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playSandVortex() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.6);
    gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  public playBGM() {
    this.initCtx();
    if (!this.ctx || this.musicInterval || !this.isMusicEnabled || this.isMuted) return;

    // ── Per-stage music profiles ──────────────────────────────────────────────
    type MusicProfile = {
      progressions: number[][];
      tempo: number;
      leadWave: OscillatorType;
      bassWave: OscillatorType;
      melodyOctaveShift: number; // multiplier on lead freq for melody arpeggio
      hasDrum: boolean;
      drumRate: number; // every N steps a kick fires
      hihatRate: number;
    };

    const profiles: Record<number, MusicProfile> = {
      1: {
        progressions: [
          [261.63, 329.63, 392.00, 523.25],
          [174.61, 220.00, 261.63, 349.23],
          [196.00, 246.94, 293.66, 392.00],
          [261.63, 329.63, 392.00, 523.25],
        ],
        tempo: 120, leadWave: 'sine', bassWave: 'sine', melodyOctaveShift: 2.0, hasDrum: false, drumRate: 4, hihatRate: 2,
      },
      2: {
        progressions: [
          [220.00, 261.63, 329.63, 440.00],
          [174.61, 220.00, 261.63, 349.23],
          [293.66, 349.23, 440.00, 587.33],
          [246.94, 293.66, 392.00, 493.88],
        ],
        tempo: 135, leadWave: 'triangle', bassWave: 'sine', melodyOctaveShift: 2.0, hasDrum: true, drumRate: 4, hihatRate: 2,
      },
      3: {
        // Volcano — aggressive sawtooth
        progressions: [
          [164.81, 196.00, 246.94, 329.63],
          [174.61, 220.00, 261.63, 349.23],
          [196.00, 233.08, 293.66, 392.00],
          [164.81, 196.00, 246.94, 329.63],
        ],
        tempo: 168, leadWave: 'sawtooth', bassWave: 'square', melodyOctaveShift: 1.5, hasDrum: true, drumRate: 4, hihatRate: 1,
      },
      4: {
        // Frozen — cool, slow, crystalline
        progressions: [
          [293.66, 349.23, 440.00, 587.33],
          [392.00, 493.88, 587.33, 783.99],
          [440.00, 523.25, 659.25, 880.00],
          [293.66, 349.23, 440.00, 587.33],
        ],
        tempo: 100, leadWave: 'sine', bassWave: 'sine', melodyOctaveShift: 2.5, hasDrum: false, drumRate: 8, hihatRate: 4,
      },
      5: {
        // Shadow Abyss — square, eerie
        progressions: [
          [138.59, 164.81, 207.65, 277.18],
          [220.00, 277.18, 329.63, 440.00],
          [207.65, 246.94, 311.13, 415.30],
          [138.59, 164.81, 207.65, 277.18],
        ],
        tempo: 138, leadWave: 'square', bassWave: 'sawtooth', melodyOctaveShift: 2.0, hasDrum: true, drumRate: 4, hihatRate: 2,
      },
      6: {
        // Dragon Temple — epic ascending
        progressions: [
          [369.99, 466.16, 554.37, 739.99],
          [311.13, 369.99, 466.16, 622.25],
          [277.18, 329.63, 415.30, 554.37],
          [246.94, 293.66, 392.00, 493.88],
        ],
        tempo: 165, leadWave: 'sawtooth', bassWave: 'triangle', melodyOctaveShift: 2.0, hasDrum: true, drumRate: 4, hihatRate: 2,
      },
      7: {
        // Sky Heavens — soaring triangle melody
        progressions: [
          [293.66, 349.23, 440.00, 587.33],
          [329.63, 392.00, 493.88, 659.25],
          [349.23, 440.00, 523.25, 698.46],
          [392.00, 493.88, 587.33, 783.99],
        ],
        tempo: 150, leadWave: 'triangle', bassWave: 'sine', melodyOctaveShift: 2.0, hasDrum: false, drumRate: 8, hihatRate: 4,
      },
      8: {
        // Primordial Core — heavy, industrial
        progressions: [
          [164.81, 196.00, 246.94, 329.63],
          [155.56, 196.00, 233.08, 311.13],
          [146.83, 174.61, 220.00, 293.66],
          [164.81, 196.00, 246.94, 329.63],
        ],
        tempo: 178, leadWave: 'sawtooth', bassWave: 'square', melodyOctaveShift: 1.5, hasDrum: true, drumRate: 2, hihatRate: 1,
      },
      9: {
        // Underwater Abyss — undulating sine waves, slow and dreamy
        progressions: [
          [233.08, 293.66, 349.23, 466.16],
          [207.65, 261.63, 311.13, 415.30],
          [246.94, 311.13, 369.99, 493.88],
          [220.00, 277.18, 329.63, 440.00],
        ],
        tempo: 88, leadWave: 'sine', bassWave: 'sine', melodyOctaveShift: 2.0, hasDrum: false, drumRate: 8, hihatRate: 4,
      },
      10: {
        // Jungle Sanctuary — tribal, rhythmic, mid-tempo
        progressions: [
          [196.00, 246.94, 293.66, 392.00],
          [174.61, 220.00, 261.63, 349.23],
          [220.00, 277.18, 329.63, 440.00],
          [196.00, 246.94, 293.66, 392.00],
        ],
        tempo: 145, leadWave: 'triangle', bassWave: 'triangle', melodyOctaveShift: 2.0, hasDrum: true, drumRate: 3, hihatRate: 1,
      },
      11: {
        // Gladiator Arena — bold, march-like, epic fanfare
        progressions: [
          [329.63, 415.30, 493.88, 659.25],
          [369.99, 466.16, 554.37, 739.99],
          [311.13, 392.00, 466.16, 622.25],
          [349.23, 440.00, 523.25, 698.46],
        ],
        tempo: 155, leadWave: 'sawtooth', bassWave: 'square', melodyOctaveShift: 1.5, hasDrum: true, drumRate: 2, hihatRate: 1,
      },
      12: {
        // Outerspace Sphere — cosmic, ethereal, floating
        progressions: [
          [184.00, 220.00, 277.18, 369.99],
          [207.65, 246.94, 311.13, 415.30],
          [164.81, 207.65, 261.63, 349.23],
          [184.00, 233.08, 293.66, 369.99],
        ],
        tempo: 95, leadWave: 'sine', bassWave: 'sine', melodyOctaveShift: 3.0, hasDrum: false, drumRate: 8, hihatRate: 4,
      },
      13: {
        // Desert Oasis — exotic Egyptian harmonic minor, dusty percussion, whirling tempo
        progressions: [
          [220.00, 233.08, 277.18, 293.66], // A Phrygian Dominant (A, Bb, C#, D)
          [293.66, 329.63, 349.23, 440.00], // D minor
          [246.94, 261.63, 311.13, 370.00], // B diminished / exotic
          [220.00, 277.18, 329.63, 440.00], // A Major
        ],
        tempo: 138, leadWave: 'sawtooth', bassWave: 'square', melodyOctaveShift: 1.75, hasDrum: true, drumRate: 2, hihatRate: 1,
      },
    };

    const level = getLevel(this.currentStageNum);
    const worldId = level ? level.worldId : 1;
    const profile = profiles[worldId] ?? profiles[1];
    const { progressions, tempo, leadWave, bassWave, melodyOctaveShift, hasDrum, drumRate, hihatRate } = profile;
    const stepDuration = 60 / tempo;

    // Helper: fire a one-shot noise burst (kick drum / hi-hat)
    const fireNoiseBurst = (freqCenter: number, q: number, durSec: number, volMult: number) => {
      if (!this.ctx) return;
      const bufSize = Math.floor(this.ctx.sampleRate * durSec);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const flt = this.ctx.createBiquadFilter();
      flt.type = 'bandpass';
      flt.frequency.setValueAtTime(freqCenter, this.ctx.currentTime);
      flt.Q.setValueAtTime(q, this.ctx.currentTime);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.musicVolume * volMult, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durSec);
      src.connect(flt);
      flt.connect(g);
      g.connect(this.ctx.destination);
      src.start();
      src.stop(this.ctx.currentTime + durSec);
    };

    this.musicInterval = setInterval(() => {
      this.initCtx();
      if (!this.ctx || this.isMuted || this.musicVolume === 0) return;

      const chordIndex = Math.floor(this.currentStep / 8) % progressions.length;
      const noteIndex = this.currentStep % 4;
      const baseChord = progressions[chordIndex];
      const freq = baseChord[noteIndex];

      // ── Lead melody ──
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = leadWave;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      const leadVol = leadWave === 'sawtooth' || leadWave === 'square' ? 0.07 : 0.13;
      gain.gain.setValueAtTime(this.musicVolume * leadVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + stepDuration - 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + stepDuration);
      this.musicNodes.push({ osc, gain });

      // ── High melody arpeggio (every 2nd step) ──
      if (this.currentStep % 2 === 0) {
        const arpFreq = baseChord[(noteIndex + 2) % 4] * melodyOctaveShift;
        const arpOsc = this.ctx.createOscillator();
        const arpGain = this.ctx.createGain();
        arpOsc.type = leadWave === 'sawtooth' ? 'triangle' : 'sine';
        arpOsc.frequency.setValueAtTime(arpFreq, this.ctx.currentTime);
        arpGain.gain.setValueAtTime(this.musicVolume * 0.06, this.ctx.currentTime);
        arpGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + stepDuration * 0.7);
        arpOsc.connect(arpGain);
        arpGain.connect(this.ctx.destination);
        arpOsc.start();
        arpOsc.stop(this.ctx.currentTime + stepDuration * 0.7);
        this.musicNodes.push({ osc: arpOsc, gain: arpGain });
      }

      // ── Bass (every 4 steps = one beat) ──
      if (this.currentStep % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = bassWave;
        bassOsc.frequency.setValueAtTime(baseChord[0] / 2, this.ctx.currentTime);
        const bassVol = bassWave === 'square' || bassWave === 'sawtooth' ? 0.11 : 0.20;
        bassGain.gain.setValueAtTime(this.musicVolume * bassVol, this.ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + stepDuration * 1.8);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start();
        bassOsc.stop(this.ctx.currentTime + stepDuration * 2);
        this.musicNodes.push({ osc: bassOsc, gain: bassGain });
      }

      // ── Percussion ──
      if (hasDrum) {
        // Kick drum: noise burst + pitched tone
        if (this.currentStep % drumRate === 0) {
          fireNoiseBurst(80, 1.2, 0.12, 0.28);
          if (this.ctx) {
            const kick = this.ctx.createOscillator();
            const kickG = this.ctx.createGain();
            kick.type = 'sine';
            kick.frequency.setValueAtTime(180, this.ctx.currentTime);
            kick.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.1);
            kickG.gain.setValueAtTime(this.musicVolume * 0.35, this.ctx.currentTime);
            kickG.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
            kick.connect(kickG);
            kickG.connect(this.ctx.destination);
            kick.start();
            kick.stop(this.ctx.currentTime + 0.12);
            this.musicNodes.push({ osc: kick, gain: kickG });
          }
        }
        // Hi-hat: thin filtered noise
        if (this.currentStep % hihatRate === 0 && this.currentStep % drumRate !== 0) {
          fireNoiseBurst(7000, 8.0, 0.04, 0.12);
        }
      }

      this.musicNodes.push({ osc, gain });
      if (this.musicNodes.length > 24) {
        this.musicNodes.shift();
      }

      this.currentStep++;
    }, stepDuration * 1000);
  }

  public playScytheSwing() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.38);

    gain.gain.setValueAtTime(this.sfxVolume * 0.75, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.35);
    filter.Q.value = 2.5;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.sfxVolume * 0.65, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.35);
  }

  public playReaperExecution() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.55);

    gain.gain.setValueAtTime(this.sfxVolume * 0.95, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  }

  public playAntimatterDeath() {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.sfxVolume === 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 1.2);
    filter.Q.value = 4.0;

    gain.gain.setValueAtTime(this.sfxVolume * 0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.4);
    subGain.gain.setValueAtTime(this.sfxVolume * 0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.4);
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
