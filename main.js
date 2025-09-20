// ===========================================
// 🌍 ECOSORT CHALLENGE - MAIN APPLICATION
// Application coordinator and initialization
// ===========================================

class EcoSortApp {
    constructor() {
        this.version = '2.0.0';
        this.initialized = false;
        this.systems = {};
        this.gameLoop = null;
        this.lastUpdate = 0;
        
        this.initialize();
    }

    async initialize() {
        try {
            console.log(`🌍 Initializing EcoSort Challenge v${this.version}`);
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize systems in order
            await this.initializeSystems();
            
            // Setup global event handlers
            this.setupGlobalEvents();
            
            // Start the application
            this.start();
            
            this.initialized = true;
            console.log('🎉 EcoSort Challenge fully initialized!');
            
        } catch (error) {
            console.error('Failed to initialize EcoSort Challenge:', error);
            console.error('Error details:', error.stack);
            this.showErrorMessage(`Failed to load the game: ${error.message}. Please refresh the page.`);
        }
    }

    async initializeSystems() {
        const systemNames = ['dataManager', 'audioManager', 'particleSystem', 'uiManager', 'game', 'advancedFeatures'];
        
        // Wait for systems sequentially with individual error handling
        for (const systemName of systemNames) {
            try {
                await this.waitForSystem(systemName);
            } catch (error) {
                console.warn(`Failed to initialize ${systemName}, continuing anyway:`, error);
                // Create a dummy system to prevent further errors
                if (!window[systemName]) {
                    window[systemName] = { initialized: false, error: error.message };
                }
            }
        }

        // Store system references
        this.systems = {
            dataManager: window.dataManager,
            audioManager: window.audioManager,
            particleSystem: window.particleSystem,
            uiManager: window.uiManager,
            game: window.game,
            advancedFeatures: window.advancedFeatures
        };

        // Connect systems
        this.connectSystems();
    }

    async waitForSystem(systemName, timeout = 20000) {
        const startTime = Date.now();
        
        console.log(`⏳ Waiting for ${systemName}...`);
        
        while (!window[systemName] && (Date.now() - startTime) < timeout) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (!window[systemName]) {
            console.error(`❌ System ${systemName} not found. Available systems:`, Object.keys(window).filter(k => k.endsWith('Manager') || k === 'game' || k === 'particleSystem' || k === 'advancedFeatures'));
            throw new Error(`System ${systemName} failed to initialize within ${timeout}ms`);
        }
        
        console.log(`✅ ${systemName} ready`);
        return window[systemName];
    }

    connectSystems() {
        // Connect game events to other systems
        this.setupGameEventHandlers();
        
        // Connect UI events to game
        this.setupUIEventHandlers();
        
        // Connect data persistence
        this.setupDataPersistence();
        
        // Setup achievement system
        this.setupAchievementSystem();
        
        // Setup daily challenges (handled by advanced features now)
        // this.setupDailyChallenges();
    }

    setupGameEventHandlers() {
        // Game to audio events
        document.addEventListener('game-start', () => {
            this.systems.audioManager?.playSound('gamestart');
            this.logEvent('game_start');
        });

        document.addEventListener('game-over', (e) => {
            this.systems.audioManager?.playSound('gameover');
            this.handleGameOver(e.detail);
        });

        // Game to particle events
        document.addEventListener('correct-sort', (e) => {
            const { x, y, points } = e.detail;
            this.systems.particleSystem?.createSuccessParticles(x || window.innerWidth/2, y || window.innerHeight/2, points);
            this.systems.audioManager?.playSound('correct');
            this.checkAchievements('correct_sort');
        });

        document.addEventListener('wrong-sort', (e) => {
            const { x, y } = e.detail;
            this.systems.particleSystem?.createErrorParticles(x || window.innerWidth/2, y || window.innerHeight/2);
            this.systems.audioManager?.playSound('wrong');
        });

        document.addEventListener('level-up', () => {
            this.systems.particleSystem?.createLevelUpParticles();
            this.systems.audioManager?.playSound('levelup');
            this.checkAchievements('level_up');
        });

        document.addEventListener('combo-milestone', (e) => {
            this.systems.particleSystem?.createComboParticles(e.detail.combo);
            this.checkAchievements('combo', e.detail.combo);
        });

        // Power-up events
        document.addEventListener('power-up-activated', (e) => {
            this.systems.audioManager?.playSound('powerup');
            if (this.systems.particleSystem?.createPowerUpParticles) {
                this.systems.particleSystem.createPowerUpParticles(
                    window.innerWidth/2, 
                    window.innerHeight/2, 
                    e.detail.type
                );
            }
        });
    }

    setupUIEventHandlers() {
        // Settings changes
        document.addEventListener('dataManager_settingsChanged', (e) => {
            this.applySettings(e.detail);
        });

        // Theme changes
        document.addEventListener('theme-changed', (e) => {
            this.handleThemeChange(e.detail.theme);
        });

        // Notification events
        document.addEventListener('show-notification', (e) => {
            this.systems.uiManager?.showNotification(e.detail.message, e.detail.type, e.detail.duration);
            this.systems.audioManager?.playSound('notification');
        });
    }

    setupDataPersistence() {
        // Auto-save game stats periodically
        setInterval(() => {
            if (this.systems.game && this.systems.dataManager) {
                const stats = this.systems.game.getStats();
                this.systems.dataManager.saveStats(stats);
            }
        }, 30000); // Every 30 seconds

        // Save on visibility change (tab switch, etc.)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.saveCurrentState();
            }
        });

        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.saveCurrentState();
        });
    }

    setupAchievementSystem() {
        // Listen for achievement events
        document.addEventListener('achievement-check', (e) => {
            this.checkAchievements(e.detail.type, e.detail.value);
        });

        document.addEventListener('achievement-unlock', (e) => {
            this.handleAchievementUnlock(e.detail.achievementId);
        });
    }


    setupGlobalEvents() {
        // Error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            // Only show critical errors to users
            if (this.isCriticalError(e.error)) {
                this.handleError(e.error);
            }
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            // Only show critical promise rejections to users
            if (this.isCriticalError(e.reason)) {
                this.handleError(e.reason);
            }
        });

        // Performance monitoring
        if (typeof PerformanceObserver !== 'undefined') {
            this.setupPerformanceMonitoring();
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });

        // Mouse/touch events for accessibility
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });

        // Focus management
        document.addEventListener('focusin', (e) => {
            this.handleFocusChange(e.target);
        });
    }

    start() {
        // Show welcome message for first-time users
        this.checkFirstTimeUser();
        
        // Start game loop
        this.startGameLoop();
        
        // Load saved game state if available
        this.loadSavedState();
        
        // Daily challenges now handled by advanced features
        // this.showDailyChallengeNotification();
        
        // Check for updates
        this.checkForUpdates();
    }

    startGameLoop() {
        const gameLoop = (timestamp) => {
            const deltaTime = timestamp - this.lastUpdate;
            this.lastUpdate = timestamp;
            
            // Update systems that need regular updates
            this.update(deltaTime);
            
            this.gameLoop = requestAnimationFrame(gameLoop);
        };
        
        this.gameLoop = requestAnimationFrame(gameLoop);
    }

    update(deltaTime) {
        // Update game timer display
        if (this.systems.game?.isGameActive && this.systems.uiManager) {
            this.systems.uiManager.updateGameUI();
        }

        // Update particles (handled by particle system internally)
        
        // Check for achievements
        this.periodicAchievementCheck();
        
        // Update environmental impact
        this.updateEnvironmentalImpact();
    }

    // Achievement system
    checkAchievements(type, value) {
        if (!this.systems.dataManager || !this.systems.game) return;

        const stats = this.systems.game.getStats();
        const achievements = [];

        switch (type) {
            case 'correct_sort':
                if (stats.itemsSorted === 1) achievements.push('first_sort');
                if (stats.itemsSorted === 100) achievements.push('century_club');
                if (stats.itemsSorted === 1000) achievements.push('eco_warrior');
                break;

            case 'level_up':
                if (this.systems.game.level === 10) achievements.push('level_master');
                break;

            case 'combo':
                if (value >= 50) achievements.push('streak_master');
                if (value >= 100) achievements.push('combo_legend');
                break;

            case 'perfect_game':
                achievements.push('perfectionist');
                break;

            case 'high_score':
                if (value >= 10000) achievements.push('high_scorer');
                if (value >= 50000) achievements.push('score_legend');
                break;
        }

        // Process achievement unlocks
        achievements.forEach(achievementId => {
            if (this.systems.dataManager.unlockAchievement(achievementId)) {
                this.handleAchievementUnlock(achievementId);
            }
        });
    }

    periodicAchievementCheck() {
        // Check time-based achievements every few seconds
        if (Date.now() % 5000 < 100) { // Roughly every 5 seconds
            if (this.systems.game) {
                const stats = this.systems.game.getStats();
                
                // Check for streak achievements
                if (this.systems.game.combo >= 50) {
                    this.checkAchievements('combo', this.systems.game.combo);
                }
                
                // Check for score achievements
                if (this.systems.game.score >= 10000) {
                    this.checkAchievements('high_score', this.systems.game.score);
                }
            }
        }
    }

    handleAchievementUnlock(achievementId) {
        const achievement = this.getAchievementData(achievementId);
        if (achievement) {
            // Show particle effect
            if (this.systems.particleSystem) {
                this.systems.particleSystem.createAchievementParticles(achievement);
            }
            
            // Play sound
            this.systems.audioManager?.playSound('achievement');
            
            // Show UI notification
            if (this.systems.uiManager) {
                this.systems.uiManager.showAchievementUnlock(achievementId);
            }
            
            // Log event
            this.logEvent('achievement_unlock', { achievementId });
        }
    }

    getAchievementData(achievementId) {
        const achievements = {
            first_sort: { title: 'First Steps', icon: '🌱', description: 'Sort your first item' },
            century_club: { title: 'Century Club', icon: '💯', description: 'Sort 100 items' },
            eco_warrior: { title: 'Eco Warrior', icon: '🌍', description: 'Sort 1,000 items' },
            perfectionist: { title: 'Perfectionist', icon: '🎯', description: 'Complete a perfect game' },
            high_scorer: { title: 'High Scorer', icon: '🏆', description: 'Score 10,000+ points' },
            streak_master: { title: 'Streak Master', icon: '🔥', description: 'Achieve 50+ combo' }
        };
        
        return achievements[achievementId];
    }

    // Daily challenges now handled by advanced-features.js

    // State management
    saveCurrentState() {
        if (!this.systems.dataManager) return;
        
        // Save game state
        if (this.systems.game) {
            const gameState = {
                score: this.systems.game.score,
                level: this.systems.game.level,
                combo: this.systems.game.combo,
                timeLeft: this.systems.game.timeLeft,
                isActive: this.systems.game.isGameActive,
                mode: this.systems.game.gameMode,
                stats: this.systems.game.getStats(),
                timestamp: Date.now()
            };
            
            this.systems.dataManager.saveGameState(gameState);
            this.systems.dataManager.saveStats(this.systems.game.getStats());
        }
        
        // Save UI state
        if (this.systems.uiManager) {
            const uiState = {
                currentPage: this.systems.uiManager.currentPage,
                isDarkMode: this.systems.uiManager.isDarkMode,
                isAudioEnabled: this.systems.uiManager.isAudioEnabled
            };
            
            this.systems.dataManager.setItem('uiState', uiState);
        }
    }

    loadSavedState() {
        if (!this.systems.dataManager) return;
        
        // Load UI state
        const uiState = this.systems.dataManager.getItem('uiState');
        if (uiState && this.systems.uiManager) {
            if (uiState.currentPage && uiState.currentPage !== 'home') {
                this.systems.uiManager.showPage(uiState.currentPage);
            }
        }
        
        // Check for saved game state (for resume functionality)
        const gameState = this.systems.dataManager.getGameState();
        if (gameState && gameState.isActive && (Date.now() - gameState.timestamp) < 300000) { // 5 minutes
            this.offerGameResume(gameState);
        }
    }

    offerGameResume(gameState) {
        if (confirm('You have an unfinished game. Would you like to resume?')) {
            // Resume game logic would go here
            this.systems.uiManager?.showPage('game');
            this.systems.uiManager?.showNotification('Game resumed! 🎮', 'info');
        } else {
            this.systems.dataManager.clearGameState();
        }
    }

    // Settings and configuration
    applySettings(settings) {
        // Apply audio settings
        if (this.systems.audioManager) {
            this.systems.audioManager.setVolume('master', settings.masterVolume / 100);
            this.systems.audioManager.setVolume('sfx', settings.sfxVolume / 100);
            this.systems.audioManager.setVolume('music', settings.musicVolume / 100);
            
            if (settings.audioEnabled) {
                this.systems.audioManager.enable();
            } else {
                this.systems.audioManager.disable();
            }
        }
        
        // Apply particle settings
        if (this.systems.particleSystem) {
            if (settings.enableParticles) {
                this.systems.particleSystem.enable();
            } else {
                this.systems.particleSystem.disable();
            }
        }
        
        // Apply game settings
        if (this.systems.game) {
            this.systems.game.settings = {
                difficulty: settings.difficulty,
                showHints: settings.showHints
            };
        }
    }

    handleThemeChange(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Error handling
    isCriticalError(error) {
        if (!error) return false;
        
        const errorMessage = error.message ? error.message.toLowerCase() : '';
        const errorStack = error.stack ? error.stack.toLowerCase() : '';
        
        // Ignore non-critical errors
        const nonCriticalPatterns = [
            'network error',
            'failed to fetch',
            'loading chunk',
            'script error',
            'non-error promise rejection',
            'cors',
            'audiocontext',
            'audio',
            'notification',
            'geolocation',
            'camera',
            'microphone'
        ];
        
        // Check if error is in the non-critical list
        for (const pattern of nonCriticalPatterns) {
            if (errorMessage.includes(pattern) || errorStack.includes(pattern)) {
                return false;
            }
        }
        
        // Only show errors that actually break core game functionality
        const criticalPatterns = [
            'failed to initialize',
            'system not found',
            'cannot read property',
            'undefined is not a function'
        ];
        
        return criticalPatterns.some(pattern => 
            errorMessage.includes(pattern) || errorStack.includes(pattern)
        );
    }

    handleError(error) {
        console.error('Application error:', error);
        
        // Show user-friendly error message
        this.showErrorMessage('Something went wrong. The game will continue, but some features may not work properly.');
        
        // Log error for debugging
        this.logEvent('error', {
            message: error.message,
            stack: error.stack,
            timestamp: Date.now()
        });
    }

    showErrorMessage(message) {
        if (this.systems.uiManager) {
            this.systems.uiManager.showNotification(message, 'error', 8000);
        } else {
            alert(message);
        }
    }

    // Event handling
    handleGlobalKeyboard(e) {
        // Global shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'm':
                    e.preventDefault();
                    this.systems.audioManager?.toggle();
                    break;
                case 'p':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.systems.particleSystem?.toggle();
                    }
                    break;
                case 's':
                    e.preventDefault();
                    this.saveCurrentState();
                    this.systems.uiManager?.showNotification('Progress saved! 💾', 'success');
                    break;
            }
        }
        
        // Game shortcuts
        if (this.systems.game?.isGameActive) {
            switch (e.key) {
                case 'Escape':
                    this.pauseGame();
                    break;
            }
        }
    }

    handleGlobalClick(e) {
        // Track clicks for analytics
        if (e.target.matches('button, .btn, .nav-link')) {
            this.logEvent('ui_interaction', {
                element: e.target.className,
                page: this.systems.uiManager?.currentPage
            });
        }
    }

    handleFocusChange(element) {
        // Accessibility: announce page changes to screen readers
        if (element.matches('[data-page]')) {
            const page = element.getAttribute('data-page');
            this.announceToScreenReader(`Navigated to ${page} page`);
        }
    }

    // Utility methods
    checkFirstTimeUser() {
        const hasPlayed = this.systems.dataManager?.getItem('hasPlayedBefore');
        if (!hasPlayed) {
            this.showWelcomeMessage();
            this.systems.dataManager?.setItem('hasPlayedBefore', true);
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            if (this.systems.uiManager) {
                this.systems.uiManager.showNotification(
                    '🌍 Welcome to EcoSort Challenge! Learn waste sorting while having fun!',
                    'info',
                    8000
                );
            }
        }, 2000);
    }

    updateEnvironmentalImpact() {
        if (this.systems.game && this.systems.uiManager) {
            const stats = this.systems.game.getStats();
            const impact = this.calculateEnvironmentalImpact(stats);
            
            // Update impact displays
            this.systems.uiManager.updateEnvironmentalImpact();
        }
    }

    calculateEnvironmentalImpact(stats) {
        return {
            co2Saved: Math.floor(stats.itemsSorted * 0.1), // kg
            waterSaved: Math.floor(stats.itemsSorted * 2.5), // liters
            treesSaved: Math.floor(stats.itemsSorted * 0.02),
            energySaved: Math.floor(stats.itemsSorted * 0.5) // kWh
        };
    }

    pauseGame() {
        if (this.systems.game?.isGameActive) {
            // Implement pause logic
            this.systems.uiManager?.showNotification('Game paused ⏸️', 'info');
        }
    }

    setupPerformanceMonitoring() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.entryType === 'measure') {
                    console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation'] });
    }

    checkForUpdates() {
        const currentVersion = this.systems.dataManager?.getItem('appVersion');
        if (currentVersion && currentVersion !== this.version) {
            this.showUpdateNotification();
            this.systems.dataManager?.setItem('appVersion', this.version);
        }
    }

    showUpdateNotification() {
        setTimeout(() => {
            this.systems.uiManager?.showNotification(
                '🎉 EcoSort Challenge has been updated with new features!',
                'info',
                6000
            );
        }, 5000);
    }

    logEvent(eventType, data = {}) {
        // Simple event logging for analytics
        const event = {
            type: eventType,
            timestamp: Date.now(),
            data: data
        };
        
        console.log('Event:', event);
        
        // Store in data manager for later analysis
        if (this.systems.dataManager) {
            const events = this.systems.dataManager.getItem('events', []);
            events.push(event);
            
            // Keep only recent events
            if (events.length > 1000) {
                events.splice(0, events.length - 1000);
            }
            
            this.systems.dataManager.setItem('events', events);
        }
    }

    announceToScreenReader(text) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = text;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Cleanup
    destroy() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
        // Cleanup systems
        Object.values(this.systems).forEach(system => {
            if (system && typeof system.destroy === 'function') {
                system.destroy();
            }
        });
        
        console.log('EcoSort Challenge destroyed');
    }
}

// Initialize the application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new EcoSortApp();
    window.ecoSortApp = app;
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && window.ecoSortApp) {
        window.ecoSortApp.saveCurrentState();
    }
});

// Global utility functions
window.triggerGameEvent = (eventType, detail = {}) => {
    document.dispatchEvent(new CustomEvent(eventType, { detail }));
};

window.showGameNotification = (message, type = 'info', duration = 3000) => {
    document.dispatchEvent(new CustomEvent('show-notification', {
        detail: { message, type, duration }
    }));
};

// Global functions for game controls
window.startGame = function() {
    console.log('🎮 Starting game...');
    
    // Ensure all systems are loaded
    if (!window.game) {
        console.error('❌ Game engine not available');
        window.showGameNotification('Game engine not loaded. Please refresh the page.', 'error');
        return;
    }
    
    try {
        // Get selected game mode
        const gameModeSelect = document.getElementById('gameModeSelect');
        const selectedMode = gameModeSelect ? gameModeSelect.value : 'normal';
        
        // Map UI modes to game engine modes
        const modeMapping = {
            'normal': 'time_trial',
            'speed': 'blitz',
            'precision': 'precision',
            'survival': 'survival',
            'blitz': 'blitz',
            'zen': 'zen',
            'challenge': 'challenge'
        };
        const gameMode = modeMapping[selectedMode] || 'time_trial';
        
        // Update button states
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn) {
            startBtn.style.display = 'none';
            startBtn.disabled = true;
        }
        if (pauseBtn) {
            pauseBtn.style.display = 'inline-flex';
            pauseBtn.disabled = false;
        }
        
        // Start the actual game
        window.game.startGame(gameMode);
        
        // Show game instructions if needed
        const instructions = document.getElementById('dragInstructions');
        if (instructions) {
            instructions.style.display = 'block';
        }
        
        // Show game message
        window.showGameNotification('Game Started! Sort items into correct bins! 🎮', 'success');
        
        // Update UI
        if (window.uiManager) {
            window.uiManager.updateGameUI();
        }
        
    } catch (error) {
        console.error('Error starting game:', error);
        window.showGameNotification('Failed to start game. Please try again.', 'error');
    }
};

window.pauseGame = function() {
    if (!window.game) {
        console.error('Game engine not available');
        return;
    }
    
    try {
        if (window.game.isGameActive) {
            window.game.pauseGame();
            window.showGameNotification('Game Paused ⏸️', 'info');
            
            // Update button states
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            
            if (startBtn) {
                startBtn.style.display = 'inline-flex';
                startBtn.textContent = 'Resume';
                startBtn.disabled = false;
            }
            if (pauseBtn) {
                pauseBtn.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error pausing game:', error);
    }
};

window.resetGame = function() {
    if (!window.game) {
        console.error('Game engine not available');
        return;
    }
    
    try {
        // Confirm reset if game is active
        if (window.game.isGameActive) {
            if (!confirm('Are you sure you want to reset the current game?')) {
                return;
            }
        }
        
        // Reset the game
        if (window.game.resetGame) {
            window.game.resetGame();
        } else {
            window.game.endGame();
        }
        
        // Reset button states
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn) {
            startBtn.style.display = 'inline-flex';
            startBtn.textContent = 'Start Game';
            startBtn.disabled = false;
        }
        if (pauseBtn) {
            pauseBtn.style.display = 'none';
        }
        
        // Hide game instructions
        const instructions = document.getElementById('dragInstructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
        
        // Clear current items
        const itemsContainer = document.getElementById('currentItemsContainer');
        if (itemsContainer) {
            itemsContainer.innerHTML = '';
        }
        
        // Update UI
        if (window.uiManager) {
            window.uiManager.updateGameUI();
        }
        
        window.showGameNotification('Game Reset! 🔄', 'info');
        
    } catch (error) {
        console.error('Error resetting game:', error);
        window.showGameNotification('Failed to reset game. Please try again.', 'error');
    }
};

// Initialize the main application
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        console.log('🌍 Initializing EcoSort Challenge...');
        window.ecoSortApp = new EcoSortApp();
    });
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EcoSortApp;
}
