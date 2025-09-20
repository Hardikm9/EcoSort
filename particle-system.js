// ===========================================
// 🌍 ECOSORT CHALLENGE - PARTICLE SYSTEM
// Advanced visual effects and animations
// ===========================================

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.isEnabled = localStorage.getItem('enableParticles') !== 'false';
        
        this.initialize();
    }

    initialize() {
        this.createCanvas();
        this.setupEventListeners();
        if (this.isEnabled) {
            this.startAnimation();
        }
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particleCanvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        document.body.appendChild(this.canvas);
        
        // Resize handler
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        // Listen for game events
        document.addEventListener('correct-sort', (e) => {
            if (this.isEnabled) {
                this.createSuccessParticles(e.detail.x, e.detail.y, e.detail.points);
            }
        });

        document.addEventListener('wrong-sort', (e) => {
            if (this.isEnabled) {
                this.createErrorParticles(e.detail.x, e.detail.y);
            }
        });

        document.addEventListener('level-up', (e) => {
            if (this.isEnabled) {
                this.createLevelUpParticles();
            }
        });

        document.addEventListener('achievement-unlock', (e) => {
            if (this.isEnabled) {
                this.createAchievementParticles(e.detail.achievement);
            }
        });

        document.addEventListener('combo-milestone', (e) => {
            if (this.isEnabled) {
                this.createComboParticles(e.detail.combo);
            }
        });
    }

    // Particle creation methods
    createSuccessParticles(x, y, points) {
        const colors = ['#22c55e', '#10b981', '#34d399', '#6ee7b7'];
        const particleCount = Math.min(points / 10, 20) + 5;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle({
                x: x + (Math.random() - 0.5) * 50,
                y: y + (Math.random() - 0.5) * 50,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 6 - 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 3,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01,
                type: 'success',
                symbol: ['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)]
            }));
        }
    }

    createErrorParticles(x, y) {
        const colors = ['#ef4444', '#dc2626', '#f87171'];
        
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 4 - 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4 + 2,
                life: 1.0,
                decay: Math.random() * 0.03 + 0.02,
                type: 'error',
                symbol: ['💥', '❌', '🚫'][Math.floor(Math.random() * 3)]
            }));
        }
    }

    createLevelUpParticles() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const colors = ['#fbbf24', '#f59e0b', '#d97706', '#92400e'];

        // Create burst effect
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 / 50) * i;
            const speed = Math.random() * 8 + 4;
            
            this.particles.push(new Particle({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                life: 1.0,
                decay: Math.random() * 0.015 + 0.008,
                type: 'levelup',
                symbol: ['🚀', '🎉', '🏆', '⭐', '🌟'][Math.floor(Math.random() * 5)]
            }));
        }

        // Create floating text effect
        this.createFloatingText('LEVEL UP!', centerX, centerY - 50, '#fbbf24', 3000);
    }

    createAchievementParticles(achievement) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 3;
        const colors = ['#8b5cf6', '#a855f7', '#c084fc', '#ddd6fe'];

        // Create golden shower effect
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY - 100,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 3,
                life: 1.0,
                decay: Math.random() * 0.012 + 0.006,
                type: 'achievement',
                symbol: achievement.icon
            }));
        }

        this.createFloatingText(`Achievement: ${achievement.title}`, centerX, centerY, '#8b5cf6', 4000);
    }

    createComboParticles(combo) {
        const centerX = this.canvas.width / 2;
        const bottomY = this.canvas.height - 100;
        const intensity = Math.min(combo / 10, 5);

        for (let i = 0; i < intensity * 8; i++) {
            this.particles.push(new Particle({
                x: centerX + (Math.random() - 0.5) * 100,
                y: bottomY,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 8 - 4,
                color: '#ff6b6b',
                size: Math.random() * 5 + 2,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01,
                type: 'combo',
                symbol: '🔥'
            }));
        }

        if (combo % 10 === 0) {
            this.createFloatingText(`${combo}x COMBO!`, centerX, bottomY - 50, '#ff6b6b', 2000);
        }
    }

    createPowerUpParticles(x, y, powerUpType) {
        const powerUpEffects = {
            timeFreeze: { color: '#06b6d4', symbols: ['⏸️', '❄️', '⏰'] },
            doublePoints: { color: '#fbbf24', symbols: ['✨', '💰', '💯'] },
            showHints: { color: '#10b981', symbols: ['🔍', '💡', '🎯'] },
            skipItem: { color: '#8b5cf6', symbols: ['⏭️', '🚀', '💨'] },
            extraLife: { color: '#ef4444', symbols: ['❤️', '💖', '💝'] }
        };

        const effect = powerUpEffects[powerUpType] || powerUpEffects.doublePoints;

        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 5 - 2,
                color: effect.color,
                size: Math.random() * 5 + 3,
                life: 1.0,
                decay: Math.random() * 0.015 + 0.01,
                type: 'powerup',
                symbol: effect.symbols[Math.floor(Math.random() * effect.symbols.length)]
            }));
        }
    }

    createEnvironmentalParticles() {
        // Background ambient particles
        if (this.particles.filter(p => p.type === 'ambient').length < 20) {
            for (let i = 0; i < 5; i++) {
                this.particles.push(new Particle({
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height + 20,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -Math.random() * 3 - 1,
                    color: 'rgba(16, 185, 129, 0.3)',
                    size: Math.random() * 3 + 1,
                    life: 1.0,
                    decay: 0.002,
                    type: 'ambient',
                    symbol: ['🌿', '🍃', '🌱'][Math.floor(Math.random() * 3)]
                }));
            }
        }
    }

    createFloatingText(text, x, y, color, duration = 2000) {
        const textParticle = {
            text: text,
            x: x,
            y: y,
            vy: -1,
            color: color,
            life: 1.0,
            decay: 1.0 / (duration / 16.67), // Assuming 60fps
            type: 'text',
            fontSize: 24,
            fontWeight: 'bold'
        };

        this.particles.push(textParticle);
    }

    createCustomEffect(effectName, x, y, options = {}) {
        switch (effectName) {
            case 'sparkle':
                this.createSparkleEffect(x, y, options);
                break;
            case 'explosion':
                this.createExplosionEffect(x, y, options);
                break;
            case 'trail':
                this.createTrailEffect(x, y, options);
                break;
            case 'rain':
                this.createRainEffect(options);
                break;
        }
    }

    createSparkleEffect(x, y, options) {
        const count = options.count || 10;
        const colors = options.colors || ['#ffffff', '#fbbf24', '#34d399'];

        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 3 + 1,
                life: 1.0,
                decay: Math.random() * 0.03 + 0.02,
                type: 'sparkle',
                symbol: '✨'
            }));
        }
    }

    createExplosionEffect(x, y, options) {
        const count = options.count || 20;
        const colors = options.colors || ['#ff6b6b', '#ffa726', '#ffee58'];

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
            const speed = Math.random() * 10 + 5;

            this.particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 3,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.015,
                type: 'explosion',
                symbol: '💥'
            }));
        }
    }

    createTrailEffect(x, y, options) {
        const length = options.length || 5;
        const color = options.color || '#10b981';

        for (let i = 0; i < length; i++) {
            this.particles.push(new Particle({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 2,
                color: color,
                size: (length - i) * 2,
                life: 1.0 - (i / length) * 0.3,
                decay: 0.05,
                type: 'trail'
            }));
        }
    }

    createRainEffect(options) {
        const count = options.count || 50;
        const symbols = options.symbols || ['💧', '🌊'];

        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle({
                x: Math.random() * this.canvas.width,
                y: -20,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 8 + 4,
                color: '#06b6d4',
                size: Math.random() * 3 + 2,
                life: 1.0,
                decay: 0.008,
                type: 'rain',
                symbol: symbols[Math.floor(Math.random() * symbols.length)]
            }));
        }
    }

    // Animation loop
    startAnimation() {
        this.animate();
    }

    animate() {
        if (!this.isEnabled) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create ambient particles occasionally
        if (Math.random() < 0.1) {
            this.createEnvironmentalParticles();
        }

        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            this.updateParticle(particle);
            this.drawParticle(particle);
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    updateParticle(particle) {
        // Update position
        particle.x += particle.vx || 0;
        particle.y += particle.vy || 0;

        // Apply gravity for certain particle types
        if (['success', 'error', 'explosion'].includes(particle.type)) {
            particle.vy = (particle.vy || 0) + 0.3;
        }

        // Update velocity with air resistance
        if (particle.vx) particle.vx *= 0.98;
        if (particle.vy) particle.vy *= 0.98;

        // Update life
        particle.life -= particle.decay;

        // Update size based on life for some effects
        if (particle.type === 'sparkle' || particle.type === 'explosion') {
            particle.currentSize = particle.size * particle.life;
        }

        // Floating text specific updates
        if (particle.type === 'text') {
            particle.y += particle.vy || 0;
        }
    }

    drawParticle(particle) {
        if (particle.life <= 0) return;

        this.ctx.save();
        
        // Set opacity based on life
        this.ctx.globalAlpha = Math.max(0, particle.life);

        if (particle.type === 'text') {
            // Draw floating text
            this.ctx.font = `${particle.fontWeight || 'normal'} ${particle.fontSize || 16}px Inter`;
            this.ctx.fillStyle = particle.color;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(particle.text, particle.x, particle.y);
        } else if (particle.symbol) {
            // Draw emoji/symbol particles
            this.ctx.font = `${particle.currentSize || particle.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(particle.symbol, particle.x, particle.y);
        } else {
            // Draw circle particles
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(
                particle.x, 
                particle.y, 
                particle.currentSize || particle.size, 
                0, 
                Math.PI * 2
            );
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    // Control methods
    enable() {
        this.isEnabled = true;
        localStorage.setItem('enableParticles', 'true');
        if (!this.animationFrame) {
            this.startAnimation();
        }
    }

    disable() {
        this.isEnabled = false;
        localStorage.setItem('enableParticles', 'false');
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    toggle() {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    clear() {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Utility methods
    getParticleCount() {
        return this.particles.length;
    }

    getParticlesByType(type) {
        return this.particles.filter(p => p.type === type);
    }

    destroy() {
        this.disable();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// Particle class
class Particle {
    constructor(options) {
        Object.assign(this, options);
        this.currentSize = this.size;
    }
}

// Preset effects library
class EffectPresets {
    static success(x, y, intensity = 1) {
        return {
            type: 'success',
            particles: Math.floor(10 * intensity),
            colors: ['#22c55e', '#10b981', '#34d399'],
            symbols: ['✨', '⭐', '🌟', '💫'],
            spread: 50 * intensity,
            velocity: 6 * intensity
        };
    }

    static celebration() {
        return {
            type: 'celebration',
            particles: 50,
            colors: ['#fbbf24', '#f59e0b', '#d97706'],
            symbols: ['🎉', '🎊', '🏆', '⭐'],
            spread: 200,
            velocity: 12
        };
    }

    static magic(x, y) {
        return {
            type: 'magic',
            particles: 20,
            colors: ['#8b5cf6', '#a855f7', '#c084fc'],
            symbols: ['✨', '🔮', '⚡', '💫'],
            spread: 80,
            velocity: 8
        };
    }

    static nature() {
        return {
            type: 'nature',
            particles: 15,
            colors: ['#22c55e', '#16a34a', '#15803d'],
            symbols: ['🌿', '🍃', '🌱', '🌳'],
            spread: 60,
            velocity: 4
        };
    }
}

// Initialize particle system
let particleSystem;

document.addEventListener('DOMContentLoaded', () => {
    particleSystem = new ParticleSystem();
    window.particleSystem = particleSystem;
    console.log('✨ Particle System initialized!');
});

// Utility functions for easy particle creation
window.createParticleEffect = (type, x, y, options = {}) => {
    if (window.particleSystem) {
        window.particleSystem.createCustomEffect(type, x, y, options);
    }
};

window.triggerSuccessEffect = (x, y, points) => {
    document.dispatchEvent(new CustomEvent('correct-sort', {
        detail: { x, y, points }
    }));
};

window.triggerErrorEffect = (x, y) => {
    document.dispatchEvent(new CustomEvent('wrong-sort', {
        detail: { x, y }
    }));
};

window.triggerLevelUpEffect = () => {
    document.dispatchEvent(new CustomEvent('level-up'));
};

window.triggerAchievementEffect = (achievement) => {
    document.dispatchEvent(new CustomEvent('achievement-unlock', {
        detail: { achievement }
    }));
};

window.triggerComboEffect = (combo) => {
    document.dispatchEvent(new CustomEvent('combo-milestone', {
        detail: { combo }
    }));
};

// Initialize global instance
window.particleSystem = new ParticleSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, Particle, EffectPresets };
}
