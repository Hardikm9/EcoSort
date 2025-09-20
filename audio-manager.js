// ===========================================
// 🌍 ECOSORT CHALLENGE - AUDIO MANAGER
// Complete sound system and music management
// ===========================================

class AudioManager {
    constructor() {
        this.isEnabled = localStorage.getItem('audioEnabled') !== 'false';
        this.masterVolume = parseFloat(localStorage.getItem('masterVolume') || '0.7');
        this.sfxVolume = parseFloat(localStorage.getItem('sfxVolume') || '0.8');
        this.musicVolume = parseFloat(localStorage.getItem('musicVolume') || '0.5');
        
        this.audioContext = null;
        this.soundEffects = new Map();
        this.backgroundMusic = null;
        this.currentTrack = null;
        
        this.loadingSounds = new Set();
        this.initialized = false;
        
        this.initialize();
    }

    async initialize() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes for volume control
            this.masterGainNode = this.audioContext.createGain();
            this.sfxGainNode = this.audioContext.createGain();
            this.musicGainNode = this.audioContext.createGain();
            
            // Connect gain nodes
            this.masterGainNode.connect(this.audioContext.destination);
            this.sfxGainNode.connect(this.masterGainNode);
            this.musicGainNode.connect(this.masterGainNode);
            
            // Set initial volumes
            this.updateVolumes();
            
            // Generate sound effects
            this.generateSoundEffects();
            
            // Setup event listeners
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('🔊 Audio Manager initialized successfully!');
        } catch (error) {
            console.warn('Audio initialization failed, using fallback audio:', error);
            this.initializeFallbackAudio();
        }
    }

    initializeFallbackAudio() {
        // Fallback for browsers without Web Audio API support
        this.soundEffects = new Map();
        this.createFallbackSounds();
        this.initialized = true;
    }

    createFallbackSounds() {
        // Create simple HTML audio elements as fallback
        const soundData = {
            correct: this.createBeepSound(800, 0.2, 'sine'),
            wrong: this.createBeepSound(300, 0.3, 'square'),
            powerup: this.createBeepSound(1000, 0.4, 'triangle'),
            levelup: this.createChord([523.25, 659.25, 783.99], 0.5),
            combo: this.createBeepSound(660, 0.15, 'sine'),
            achievement: this.createChord([440, 554.37, 659.25, 783.99], 0.6),
            gamestart: this.createBeepSound(440, 0.3, 'sine'),
            gameover: this.createBeepSound(220, 0.8, 'sawtooth'),
            click: this.createBeepSound(1000, 0.1, 'sine'),
            hover: this.createBeepSound(800, 0.05, 'triangle')
        };

        Object.entries(soundData).forEach(([name, audioData]) => {
            this.soundEffects.set(name, audioData);
        });
    }

    generateSoundEffects() {
        const sounds = {
            correct: () => this.generateSuccessSound(),
            wrong: () => this.generateErrorSound(),
            powerup: () => this.generatePowerUpSound(),
            levelup: () => this.generateLevelUpSound(),
            combo: () => this.generateComboSound(),
            achievement: () => this.generateAchievementSound(),
            gamestart: () => this.generateGameStartSound(),
            gameover: () => this.generateGameOverSound(),
            click: () => this.generateClickSound(),
            hover: () => this.generateHoverSound(),
            notification: () => this.generateNotificationSound(),
            whoosh: () => this.generateWhooshSound(),
            sparkle: () => this.generateSparkleSound()
        };

        Object.entries(sounds).forEach(([name, generator]) => {
            try {
                const audioBuffer = generator();
                this.soundEffects.set(name, audioBuffer);
            } catch (error) {
                console.warn(`Failed to generate sound: ${name}`, error);
            }
        });
    }

    // Sound generation methods
    generateSuccessSound() {
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const frequency = 800 + Math.sin(t * 10) * 200; // Vibrato effect
            const envelope = Math.exp(-t * 3); // Decay envelope
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }

        return buffer;
    }

    generateErrorSound() {
        const duration = 0.4;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const frequency = 200 - t * 100; // Falling frequency
            const envelope = Math.exp(-t * 2);
            data[i] = (Math.random() * 2 - 1) * envelope * 0.2 + // Noise
                     Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3; // Tone
        }

        return buffer;
    }

    generatePowerUpSound() {
        const duration = 0.5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 2) * Math.sin(t * Math.PI);
            let sample = 0;
            
            frequencies.forEach((freq, index) => {
                const delay = index * 0.1;
                if (t > delay) {
                    sample += Math.sin(2 * Math.PI * freq * (t - delay)) * (1 / frequencies.length);
                }
            });
            
            data[i] = sample * envelope * 0.4;
        }

        return buffer;
    }

    generateLevelUpSound() {
        const duration = 1.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, sampleRate * duration, sampleRate);
        
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        // Triumphant chord progression
        const chord1 = [261.63, 329.63, 392.00]; // C Major
        const chord2 = [293.66, 369.99, 440.00]; // D Major
        const chord3 = [329.63, 415.30, 493.88]; // E Major

        for (let i = 0; i < leftData.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 1.5) * (1 - Math.exp(-t * 10));
            let sample = 0;

            // First chord (0-0.33s)
            if (t < 0.33) {
                chord1.forEach(freq => {
                    sample += Math.sin(2 * Math.PI * freq * t) * 0.33;
                });
            }
            // Second chord (0.33-0.66s)
            else if (t < 0.66) {
                chord2.forEach(freq => {
                    sample += Math.sin(2 * Math.PI * freq * t) * 0.33;
                });
            }
            // Third chord (0.66-1s)
            else {
                chord3.forEach(freq => {
                    sample += Math.sin(2 * Math.PI * freq * t) * 0.33;
                });
            }

            leftData[i] = sample * envelope * 0.5;
            rightData[i] = sample * envelope * 0.5 * (1 + Math.sin(t * 4) * 0.1); // Slight stereo effect
        }

        return buffer;
    }

    generateComboSound() {
        const duration = 0.15;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const frequency = 440 * Math.pow(2, t * 2); // Rising tone
            const envelope = 1 - t / duration; // Linear decay
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }

        return buffer;
    }

    generateAchievementSound() {
        const duration = 0.8;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, sampleRate * duration, sampleRate);
        
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        // Magical sparkle sound
        for (let i = 0; i < leftData.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 2) * Math.sin(t * Math.PI * 2);
            
            // Multiple sine waves with slight detuning
            let sample = 0;
            const baseFreq = 880;
            for (let harmonic = 1; harmonic <= 5; harmonic++) {
                const freq = baseFreq * harmonic + Math.sin(t * 10) * 10;
                sample += Math.sin(2 * Math.PI * freq * t) * (1 / harmonic);
            }
            
            leftData[i] = sample * envelope * 0.3;
            rightData[i] = sample * envelope * 0.3 * (1 + Math.sin(t * 7) * 0.2);
        }

        return buffer;
    }

    generateGameStartSound() {
        const duration = 0.6;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const frequency = 440 + t * 220; // Rising from 440Hz to 660Hz
            const envelope = Math.sin(t * Math.PI); // Bell curve envelope
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.4;
        }

        return buffer;
    }

    generateGameOverSound() {
        const duration = 1.2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const frequency = 440 * Math.exp(-t * 2); // Exponentially falling frequency
            const envelope = Math.exp(-t * 0.8); // Slow decay
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.5;
        }

        return buffer;
    }

    generateClickSound() {
        const duration = 0.05;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const frequency = 1000;
            const envelope = Math.exp(-t * 50); // Very quick decay
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.2;
        }

        return buffer;
    }

    generateHoverSound() {
        const duration = 0.03;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const frequency = 800;
            const envelope = Math.exp(-t * 80); // Very quick decay
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.1;
        }

        return buffer;
    }

    generateNotificationSound() {
        const duration = 0.4;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            // Two-tone notification
            if (t < 0.2) {
                sample = Math.sin(2 * Math.PI * 800 * t);
            } else {
                sample = Math.sin(2 * Math.PI * 600 * (t - 0.2));
            }
            
            const envelope = Math.exp(-t * 5);
            data[i] = sample * envelope * 0.3;
        }

        return buffer;
    }

    generateWhooshSound() {
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const frequency = 200 + t * 800; // Sweep from 200Hz to 1000Hz
            const noise = (Math.random() * 2 - 1) * 0.3;
            const envelope = Math.sin(t * Math.PI); // Bell curve
            data[i] = (Math.sin(2 * Math.PI * frequency * t) * 0.7 + noise * 0.3) * envelope * 0.2;
        }

        return buffer;
    }

    generateSparkleSound() {
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const frequency = 2000 + Math.sin(t * 40) * 500; // Rapid vibrato
            const envelope = Math.exp(-t * 10); // Quick decay
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.2;
        }

        return buffer;
    }

    // Fallback sound creation for unsupported browsers
    createBeepSound(frequency, duration, waveType = 'sine') {
        return {
            frequency,
            duration,
            waveType,
            isFallback: true
        };
    }

    createChord(frequencies, duration) {
        return {
            frequencies,
            duration,
            isChord: true,
            isFallback: true
        };
    }

    // Play sound methods
    async playSound(soundName, volume = 1, pitch = 1) {
        // Sounds disabled for better user experience
        return;

        try {
            const sound = this.soundEffects.get(soundName);
            if (!sound) {
                console.warn(`Sound not found: ${soundName}`);
                return;
            }

            if (sound.isFallback) {
                this.playFallbackSound(sound, volume);
                return;
            }

            // Resume audio context if suspended (for user interaction requirement)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();

            source.buffer = sound;
            source.playbackRate.value = pitch;
            
            gainNode.gain.value = volume * this.sfxVolume;
            
            source.connect(gainNode);
            gainNode.connect(this.sfxGainNode);
            
            source.start();
            
            // Clean up after playback
            source.onended = () => {
                source.disconnect();
                gainNode.disconnect();
            };
            
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
        }
    }

    playFallbackSound(sound, volume) {
        if (sound.isChord) {
            // Play chord using Web Audio or basic oscillator
            sound.frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.playTone(freq, sound.duration, volume);
                }, index * 50);
            });
        } else {
            this.playTone(sound.frequency, sound.duration, volume, sound.waveType);
        }
    }

    playTone(frequency, duration, volume = 1, waveType = 'sine') {
        if (!this.audioContext) {
            // Ultimate fallback - no sound
            return;
        }

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = waveType;
            oscillator.frequency.value = frequency;
            
            gainNode.gain.value = volume * this.sfxVolume * this.masterVolume;
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Error playing tone:', error);
        }
    }

    // Background music methods
    async loadBackgroundMusic(trackName, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.backgroundMusic = {
                name: trackName,
                buffer: audioBuffer,
                url: url
            };
            
            return true;
        } catch (error) {
            console.warn(`Failed to load background music: ${trackName}`, error);
            return false;
        }
    }

    playBackgroundMusic(loop = true) {
        if (!this.isEnabled || !this.backgroundMusic || !this.initialized) return;

        try {
            this.stopBackgroundMusic();

            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();

            source.buffer = this.backgroundMusic.buffer;
            source.loop = loop;
            
            gainNode.gain.value = this.musicVolume;
            
            source.connect(gainNode);
            gainNode.connect(this.musicGainNode);
            
            source.start();
            
            this.currentTrack = { source, gainNode };
        } catch (error) {
            console.warn('Error playing background music:', error);
        }
    }

    stopBackgroundMusic() {
        if (this.currentTrack) {
            try {
                this.currentTrack.source.stop();
                this.currentTrack.source.disconnect();
                this.currentTrack.gainNode.disconnect();
            } catch (error) {
                // Ignore errors when stopping
            }
            this.currentTrack = null;
        }
    }

    fadeOutMusic(duration = 1000) {
        if (this.currentTrack) {
            const gainNode = this.currentTrack.gainNode;
            const currentTime = this.audioContext.currentTime;
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration / 1000);
            
            setTimeout(() => {
                this.stopBackgroundMusic();
            }, duration);
        }
    }

    // Volume control methods
    setVolume(type, value) {
        const clampedValue = Math.max(0, Math.min(1, value));
        
        switch (type) {
            case 'master':
            case 'masterVolume':
                this.masterVolume = clampedValue;
                if (this.masterGainNode) {
                    this.masterGainNode.gain.value = clampedValue;
                }
                localStorage.setItem('masterVolume', clampedValue.toString());
                break;
                
            case 'sfx':
            case 'sfxVolume':
                this.sfxVolume = clampedValue;
                if (this.sfxGainNode) {
                    this.sfxGainNode.gain.value = clampedValue;
                }
                localStorage.setItem('sfxVolume', clampedValue.toString());
                break;
                
            case 'music':
            case 'musicVolume':
                this.musicVolume = clampedValue;
                if (this.musicGainNode) {
                    this.musicGainNode.gain.value = clampedValue;
                }
                localStorage.setItem('musicVolume', clampedValue.toString());
                break;
        }
    }

    updateVolumes() {
        this.setVolume('master', this.masterVolume);
        this.setVolume('sfx', this.sfxVolume);
        this.setVolume('music', this.musicVolume);
    }

    // Audio control methods
    enable() {
        this.isEnabled = true;
        localStorage.setItem('audioEnabled', 'true');
    }

    disable() {
        this.isEnabled = false;
        this.stopBackgroundMusic();
        localStorage.setItem('audioEnabled', 'false');
    }

    toggle() {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    // Event listeners setup
    setupEventListeners() {
        // Listen for game events
        document.addEventListener('correct-sort', () => this.playSound('correct'));
        document.addEventListener('wrong-sort', () => this.playSound('wrong'));
        document.addEventListener('level-up', () => this.playSound('levelup'));
        document.addEventListener('achievement-unlock', () => this.playSound('achievement'));
        document.addEventListener('combo-milestone', (e) => {
            const combo = e.detail.combo;
            if (combo % 5 === 0) {
                this.playSound('combo', 1, 1 + (combo / 100)); // Higher pitch for higher combos
            }
        });
        document.addEventListener('power-up-activated', () => this.playSound('powerup'));
        document.addEventListener('game-start', () => this.playSound('gamestart'));
        document.addEventListener('game-over', () => this.playSound('gameover'));

        // UI interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, .nav-link')) {
                this.playSound('click');
            }
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('button, .btn, .nav-link')) {
                this.playSound('hover');
            }
        });

        // Notifications
        document.addEventListener('notification-show', () => this.playSound('notification'));

        // User interaction to resume AudioContext
        document.addEventListener('click', this.resumeAudioContext.bind(this), { once: true });
        document.addEventListener('keydown', this.resumeAudioContext.bind(this), { once: true });
    }

    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('Audio context resumed');
            } catch (error) {
                console.warn('Failed to resume audio context:', error);
            }
        }
    }

    // Utility methods
    getSoundList() {
        return Array.from(this.soundEffects.keys());
    }

    getVolumes() {
        return {
            master: this.masterVolume,
            sfx: this.sfxVolume,
            music: this.musicVolume
        };
    }

    isPlaying() {
        return this.currentTrack !== null;
    }

    // Presets for common game scenarios
    playSuccessSequence() {
        this.playSound('correct');
        setTimeout(() => this.playSound('sparkle'), 100);
    }

    playErrorSequence() {
        this.playSound('wrong');
    }

    playPowerUpSequence(powerUpType) {
        this.playSound('powerup');
        setTimeout(() => this.playSound('sparkle'), 200);
        
        // Different sounds for different power-ups
        const powerUpSounds = {
            timeFreeze: () => setTimeout(() => this.playTone(400, 0.3), 400),
            doublePoints: () => setTimeout(() => this.playTone(800, 0.2), 400),
            showHints: () => setTimeout(() => this.playTone(600, 0.25), 400)
        };
        
        const soundFunction = powerUpSounds[powerUpType];
        if (soundFunction) {
            soundFunction();
        }
    }

    // Cleanup
    destroy() {
        this.stopBackgroundMusic();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.soundEffects.clear();
        this.initialized = false;
    }
}

// Initialize audio manager
let audioManager;

document.addEventListener('DOMContentLoaded', () => {
    audioManager = new AudioManager();
    window.audioManager = audioManager;
    console.log('🔊 Audio Manager loaded!');
});

// Utility functions for easy sound triggering
window.playGameSound = (soundName, volume, pitch) => {
    if (window.audioManager) {
        window.audioManager.playSound(soundName, volume, pitch);
    }
};

window.toggleGameAudio = () => {
    if (window.audioManager) {
        window.audioManager.toggle();
    }
};

window.setGameVolume = (type, value) => {
    if (window.audioManager) {
        window.audioManager.setVolume(type, value);
    }
};

// Initialize global instance
window.audioManager = new AudioManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
