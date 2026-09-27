export type AmbientSoundscape = 'furnace' | 'lab' | 'wind' | 'vault' | 'off';

/**
 * Web Audio procedural sound synthesizer for graphic novel effects & atmospheric soundscapes
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.5; // 0.0 to 1.0
  private currentSoundscape: AmbientSoundscape = 'furnace';

  // Ambient nodes
  private masterAmbientGain: GainNode | null = null;
  private activeNodes: (AudioNode | { stop?: () => void; disconnect: () => void })[] = [];
  private ambientRunning: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getSoundscape(): AmbientSoundscape {
    return this.currentSoundscape;
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterAmbientGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.masterVolume * 0.12;
      this.masterAmbientGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterAmbientGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterAmbientGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.masterVolume * 0.12;
      this.masterAmbientGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterAmbientGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSoundscape(soundscape: AmbientSoundscape) {
    this.currentSoundscape = soundscape;
    if (soundscape === 'off') {
      this.stopCurrentAtmosphere();
      return;
    }
    this.startAtmosphere(soundscape);
  }

  private stopCurrentAtmosphere() {
    if (this.ctx && this.masterAmbientGain) {
      try {
        this.masterAmbientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
      } catch {
        // Fallback
      }
    }

    setTimeout(() => {
      this.activeNodes.forEach((node) => {
        try {
          if ('stop' in node && typeof node.stop === 'function') {
            node.stop();
          }
          node.disconnect();
        } catch {
          // Ignored
        }
      });
      this.activeNodes = [];
      this.ambientRunning = false;
    }, 220);
  }

  public startAtmosphere(type: AmbientSoundscape = this.currentSoundscape) {
    if (type === 'off') return;

    this.initCtx();
    if (!this.ctx) return;

    // Clean up existing soundscape
    this.stopCurrentAtmosphere();

    setTimeout(() => {
      if (!this.ctx) return;

      // Master gain for ambient atmosphere
      const masterGain = this.ctx.createGain();
      const targetGain = this.isMuted ? 0 : this.masterVolume * 0.12;
      masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.4);
      masterGain.connect(this.ctx.destination);
      this.masterAmbientGain = masterGain;

      if (type === 'furnace') {
        // --- 1. BLAST FURNACE ROAR ---
        // Churning low-frequency flame drone + filtered turbulence
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(52, this.ctx.currentTime); // 52Hz fundamental
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(78, this.ctx.currentTime); // 78Hz harmonic

        // Lowpass filter to muffle sawtooth into a deep roaring rumble
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, this.ctx.currentTime);

        // Turbulent noise simulating air blowers & molten torrent
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.6;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(190, this.ctx.currentTime);
        noiseFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

        // Connect everything
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        osc1.start();
        osc2.start();
        noise.start();

        this.activeNodes = [osc1, osc2, filter, noise, noiseFilter, noiseGain, masterGain];
      } else if (type === 'lab') {
        // --- 2. LABORATORY HUM ---
        // Clean dual sine electrical drone (60Hz & 120Hz mains) + high analytical telemetry hiss
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(60, this.ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(120, this.ctx.currentTime);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

        // Cleanroom HVAC ventilation bandpass
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);
        noiseFilter.Q.setValueAtTime(3.2, this.ctx.currentTime);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

        osc1.connect(oscGain);
        osc2.connect(oscGain);
        oscGain.connect(masterGain);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        osc1.start();
        osc2.start();
        noise.start();

        this.activeNodes = [osc1, osc2, oscGain, noise, noiseFilter, noiseGain, masterGain];
      } else if (type === 'wind') {
        // --- 3. AMBIENT WIND ---
        // Sweeping filtered noise simulating Kudua stack draft & elevated catwalk wind
        const bufferSize = this.ctx.sampleRate * 3;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);
        filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

        // LFO sine modulating the wind filter frequency
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // Slow 0.12Hz sweep

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(220, this.ctx.currentTime); // Sweep depth +/- 220Hz

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(masterGain);

        lfo.start();
        noise.start();

        this.activeNodes = [noise, filter, lfo, lfoGain, masterGain];
      } else if (type === 'vault') {
        // --- 4. SUBTERRANEAN VAULT ---
        // Deep 42Hz earth foundation resonance + battery electrochemical hum
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(42, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(95, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();

        this.activeNodes = [osc, filter, masterGain];
      }

      this.ambientRunning = true;
    }, 250);
  }

  // Alias for backward compatibility
  public startAmbientForge() {
    this.startAtmosphere(this.currentSoundscape);
  }

  public stopAmbientForge() {
    this.stopCurrentAtmosphere();
  }

  // Realistic paper page flip sound using filtered noise
  public playPageFlip() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3200, this.ctx.currentTime + 0.08);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.11);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // Audio fallback silent
    }
  }

  // Heavy pneumatic air purge hiss
  public playPneumaticHiss() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.1));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.24);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Fallback
    }
  }

  // Emergency buzz alarm
  public playAlarm() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // Fallback
    }
  }

  // Heavy mechanical clank
  public playClank() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Fallback
    }
  }
}

export const sound = new SoundEngine();

