// Web Audio API Synthesizer for Focus Room
// Synthesizes ambient background sounds natively without external MP3 files or network requests

export type AmbientSoundType = 'none' | 'rain' | 'white-noise' | 'clock' | 'cafe' | 'sea-waves' | 'binaural-40';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'none';
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private secondarySources: AudioScheduledSourceNode[] = [];
  private timerId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: AmbientSoundType, volume = 0.5) {
    this.stop();
    if (type === 'none') {
      this.currentType = 'none';
      return;
    }

    try {
      this.initContext();
      if (!this.ctx) return;

      this.currentType = type;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      if (type === 'white-noise') {
        this.startWhiteNoise();
      } else if (type === 'rain') {
        this.startRain();
      } else if (type === 'clock') {
        this.startClock();
      } else if (type === 'cafe') {
        this.startCafe();
      } else if (type === 'sea-waves') {
        this.startSeaWaves();
      } else if (type === 'binaural-40') {
        this.startBinaural40();
      }
    } catch (error) {
      console.error('Ambient audio could not start:', error);
    }
  }

  private startBinaural40() {
    if (!this.ctx || !this.gainNode) return;
    const left = this.ctx.createOscillator();
    const right = this.ctx.createOscillator();
    const leftPan = this.ctx.createStereoPanner();
    const rightPan = this.ctx.createStereoPanner();
    const leftGain = this.ctx.createGain();
    const rightGain = this.ctx.createGain();
    left.type = 'sine';
    right.type = 'sine';
    left.frequency.value = 200;
    right.frequency.value = 240;
    leftPan.pan.value = -1;
    rightPan.pan.value = 1;
    leftGain.gain.value = 0.25;
    rightGain.gain.value = 0.25;
    left.connect(leftGain).connect(leftPan).connect(this.gainNode);
    right.connect(rightGain).connect(rightPan).connect(this.gainNode);
    left.start();
    right.start();
    this.noiseNode = left;
    this.secondarySources.push(right);
  }

  public playNotification() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const startAt = this.ctx.currentTime;
      [660, 880].forEach((frequency, index) => {
        const oscillator = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const at = startAt + index * 0.16;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, at);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.12, at + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.32);
        oscillator.connect(gain).connect(this.ctx!.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.34);
      });
    } catch (error) {
      console.error('Focus session notification could not play:', error);
    }
  }

  private startWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle low-pass filter for soft warm noise
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  private startRain() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    // Pink noise approximation for rain
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.2;
    }

    const rain = this.ctx.createBufferSource();
    rain.buffer = noiseBuffer;
    rain.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    rain.connect(filter);
    filter.connect(this.gainNode);
    rain.start();
    this.noiseNode = rain;
  }

  private startClock() {
    if (!this.ctx || !this.gainNode) return;
    let tick = true;
    const playTick = () => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const tickGain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(tick ? 800 : 600, this.ctx.currentTime);
      
      tickGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      
      osc.connect(tickGain);
      tickGain.connect(this.gainNode);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
      tick = !tick;
    };

    playTick();
    this.timerId = window.setInterval(playTick, 1000);
  }

  private startCafe() {
    // Warm low-frequency rumble with gentle ambient filter
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const cafe = this.ctx.createBufferSource();
    cafe.buffer = noiseBuffer;
    cafe.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(450, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(1.5, this.ctx.currentTime);

    cafe.connect(bandpass);
    bandpass.connect(this.gainNode);
    cafe.start();
    this.noiseNode = cafe;
  }

  private startSeaWaves() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const waves = this.ctx.createBufferSource();
    waves.buffer = noiseBuffer;
    waves.loop = true;

    // Filter to simulate swell
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);

    // LFO for wave swelling rhythm
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // one cycle every ~8 seconds
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    waves.connect(filter);
    filter.connect(this.gainNode);
    waves.start();
    this.noiseNode = waves;
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioScheduledSourceNode).stop?.();
      } catch {}
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    this.secondarySources.forEach(source => {
      try {
        source.stop();
      } catch {}
      source.disconnect();
    });
    this.secondarySources = [];
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    this.currentType = 'none';
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }
}

export const ambientAudio = new AmbientSoundEngine();
