// ===========================================
// 🌍 ECOSORT CHALLENGE - DATA MANAGER
// Complete data persistence and management system
// ===========================================

class DataManager {
    constructor() {
        this.storagePrefix = 'ecosort_';
        this.version = '1.0.0';
        this.compressionEnabled = false; // For future use
        
        this.defaultSettings = {
            darkMode: true,
            audioEnabled: true,
            masterVolume: 70,
            sfxVolume: 80,
            musicVolume: 50,
            showHints: true,
            enableParticles: true,
            autoSave: true,
            difficulty: 'normal',
            language: 'en'
        };

        this.defaultStats = {
            gamesPlayed: 0,
            totalScore: 0,
            bestScore: 0,
            itemsSorted: 0,
            correctSorts: 0,
            incorrectSorts: 0,
            streakRecord: 0,
            totalPlayTime: 0,
            powerUpsUsed: 0,
            achievementsUnlocked: 0,
            dailyChallengesCompleted: 0,
            perfectGames: 0,
            lastPlayDate: null,
            firstPlayDate: null
        };

        this.defaultProfile = {
            playerName: 'Eco Warrior',
            avatar: '🌱',
            title: 'Eco Apprentice',
            level: 1,
            experience: 0,
            joinDate: new Date().toISOString(),
            preferences: {
                notifications: true,
                shareStats: false,
                publicProfile: false
            }
        };

        this.initialize();
    }

    initialize() {
        this.validateStorage();
        this.performMigrations();
        this.setupAutoSave();
        console.log('💾 Data Manager initialized successfully!');
    }

    // Storage validation and setup
    validateStorage() {
        try {
            // Test localStorage availability
            const testKey = this.storagePrefix + 'test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            
            // Initialize version tracking
            const currentVersion = this.getItem('version');
            if (!currentVersion) {
                this.setItem('version', this.version);
                this.setItem('installDate', new Date().toISOString());
            }
            
        } catch (error) {
            console.warn('LocalStorage not available, using fallback storage:', error);
            this.initializeFallbackStorage();
        }
    }

    initializeFallbackStorage() {
        // In-memory fallback storage
        this.fallbackStorage = new Map();
        this.usingFallback = true;
    }

    performMigrations() {
        const currentVersion = this.getItem('version') || '0.0.0';
        const targetVersion = this.version;

        if (this.compareVersions(currentVersion, targetVersion) < 0) {
            console.log(`Migrating data from ${currentVersion} to ${targetVersion}`);
            this.migrateData(currentVersion, targetVersion);
            this.setItem('version', targetVersion);
        }
    }

    migrateData(fromVersion, toVersion) {
        // Handle data migrations between versions
        const migrations = {
            '0.0.0_to_1.0.0': () => {
                // Initial migration - ensure all default data exists
                this.ensureDefaultData();
            }
        };

        const migrationKey = `${fromVersion}_to_${toVersion}`;
        if (migrations[migrationKey]) {
            migrations[migrationKey]();
        }
    }

    ensureDefaultData() {
        // Ensure all default settings exist
        const currentSettings = this.getSettings();
        const mergedSettings = { ...this.defaultSettings, ...currentSettings };
        this.saveSettings(mergedSettings);

        // Ensure default stats exist
        const currentStats = this.getStats();
        const mergedStats = { ...this.defaultStats, ...currentStats };
        this.saveStats(mergedStats);

        // Ensure default profile exists
        const currentProfile = this.getProfile();
        const mergedProfile = { ...this.defaultProfile, ...currentProfile };
        this.saveProfile(mergedProfile);
    }

    // Core storage methods
    setItem(key, value) {
        const fullKey = this.storagePrefix + key;
        const serializedValue = JSON.stringify({
            data: value,
            timestamp: Date.now(),
            version: this.version
        });

        try {
            if (this.usingFallback) {
                this.fallbackStorage.set(fullKey, serializedValue);
            } else {
                localStorage.setItem(fullKey, serializedValue);
            }
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    getItem(key, defaultValue = null) {
        const fullKey = this.storagePrefix + key;
        
        try {
            let serializedValue;
            if (this.usingFallback) {
                serializedValue = this.fallbackStorage.get(fullKey);
            } else {
                serializedValue = localStorage.getItem(fullKey);
            }

            if (!serializedValue) {
                return defaultValue;
            }

            const parsed = JSON.parse(serializedValue);
            return parsed.data || defaultValue;
        } catch (error) {
            console.warn('Error reading data:', error);
            return defaultValue;
        }
    }

    removeItem(key) {
        const fullKey = this.storagePrefix + key;
        
        try {
            if (this.usingFallback) {
                this.fallbackStorage.delete(fullKey);
            } else {
                localStorage.removeItem(fullKey);
            }
            return true;
        } catch (error) {
            console.error('Error removing data:', error);
            return false;
        }
    }

    // Settings management
    saveSettings(settings) {
        const validatedSettings = this.validateSettings(settings);
        this.setItem('settings', validatedSettings);
        this.dispatchEvent('settingsChanged', validatedSettings);
        return true;
    }

    getSettings() {
        return this.getItem('settings', { ...this.defaultSettings });
    }

    updateSetting(key, value) {
        const currentSettings = this.getSettings();
        currentSettings[key] = value;
        return this.saveSettings(currentSettings);
    }

    validateSettings(settings) {
        const validated = { ...settings };
        
        // Validate numeric ranges
        validated.masterVolume = Math.max(0, Math.min(100, validated.masterVolume));
        validated.sfxVolume = Math.max(0, Math.min(100, validated.sfxVolume));
        validated.musicVolume = Math.max(0, Math.min(100, validated.musicVolume));
        
        // Validate enum values
        if (!['easy', 'normal', 'hard'].includes(validated.difficulty)) {
            validated.difficulty = 'normal';
        }
        
        // Validate boolean values
        validated.darkMode = Boolean(validated.darkMode);
        validated.audioEnabled = Boolean(validated.audioEnabled);
        validated.showHints = Boolean(validated.showHints);
        validated.enableParticles = Boolean(validated.enableParticles);
        validated.autoSave = Boolean(validated.autoSave);
        
        return validated;
    }

    // Statistics management
    saveStats(stats) {
        const validatedStats = this.validateStats(stats);
        this.setItem('stats', validatedStats);
        this.dispatchEvent('statsChanged', validatedStats);
        return true;
    }

    getStats() {
        return this.getItem('stats', { ...this.defaultStats });
    }

    updateStats(updates) {
        const currentStats = this.getStats();
        const updatedStats = { ...currentStats, ...updates };
        
        // Update calculated fields
        updatedStats.lastPlayDate = new Date().toISOString();
        if (!currentStats.firstPlayDate) {
            updatedStats.firstPlayDate = updatedStats.lastPlayDate;
        }
        
        return this.saveStats(updatedStats);
    }

    incrementStat(statName, amount = 1) {
        const currentStats = this.getStats();
        currentStats[statName] = (currentStats[statName] || 0) + amount;
        return this.saveStats(currentStats);
    }

    validateStats(stats) {
        const validated = { ...stats };
        
        // Ensure all numeric stats are non-negative
        const numericStats = [
            'gamesPlayed', 'totalScore', 'bestScore', 'itemsSorted',
            'correctSorts', 'incorrectSorts', 'streakRecord', 'totalPlayTime',
            'powerUpsUsed', 'achievementsUnlocked', 'dailyChallengesCompleted', 'perfectGames'
        ];
        
        numericStats.forEach(stat => {
            validated[stat] = Math.max(0, validated[stat] || 0);
        });
        
        return validated;
    }

    // Profile management
    saveProfile(profile) {
        const validatedProfile = this.validateProfile(profile);
        this.setItem('profile', validatedProfile);
        this.dispatchEvent('profileChanged', validatedProfile);
        return true;
    }

    getProfile() {
        return this.getItem('profile', { ...this.defaultProfile });
    }

    updateProfile(updates) {
        const currentProfile = this.getProfile();
        const updatedProfile = { ...currentProfile, ...updates };
        return this.saveProfile(updatedProfile);
    }

    validateProfile(profile) {
        const validated = { ...profile };
        
        // Validate strings
        validated.playerName = (validated.playerName || 'Eco Warrior').slice(0, 50);
        validated.avatar = validated.avatar || '🌱';
        validated.title = (validated.title || 'Eco Apprentice').slice(0, 100);
        
        // Validate numbers
        validated.level = Math.max(1, validated.level || 1);
        validated.experience = Math.max(0, validated.experience || 0);
        
        // Validate preferences
        if (!validated.preferences) {
            validated.preferences = { ...this.defaultProfile.preferences };
        }
        
        return validated;
    }

    // Achievement management
    saveAchievements(achievements) {
        this.setItem('achievements', achievements);
        this.dispatchEvent('achievementsChanged', achievements);
        return true;
    }

    getAchievements() {
        return this.getItem('achievements', []);
    }

    unlockAchievement(achievementId) {
        const achievements = this.getAchievements();
        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            this.saveAchievements(achievements);
            this.incrementStat('achievementsUnlocked');
            this.dispatchEvent('achievementUnlocked', { achievementId });
            return true;
        }
        return false;
    }

    hasAchievement(achievementId) {
        return this.getAchievements().includes(achievementId);
    }

    // Game progress management
    saveGameSession(sessionData) {
        const sessions = this.getItem('gameSessions', []);
        const session = {
            id: this.generateId(),
            timestamp: Date.now(),
            ...sessionData
        };
        
        sessions.push(session);
        
        // Keep only last 100 sessions
        if (sessions.length > 100) {
            sessions.splice(0, sessions.length - 100);
        }
        
        this.setItem('gameSessions', sessions);
        return session.id;
    }

    getGameSessions(limit = 10) {
        const sessions = this.getItem('gameSessions', []);
        return sessions.slice(-limit).reverse(); // Most recent first
    }

    // Daily challenge management
    saveDailyChallengeProgress(date, progress) {
        const challenges = this.getItem('dailyChallenges', {});
        challenges[date] = progress;
        this.setItem('dailyChallenges', challenges);
        
        if (progress.completed) {
            this.incrementStat('dailyChallengesCompleted');
        }
    }

    getDailyChallengeProgress(date) {
        const challenges = this.getItem('dailyChallenges', {});
        return challenges[date] || null;
    }

    // Leaderboard data
    saveLeaderboardEntry(score, playerData) {
        const leaderboard = this.getItem('localLeaderboard', []);
        const entry = {
            id: this.generateId(),
            score: score,
            player: playerData,
            timestamp: Date.now(),
            date: new Date().toISOString().split('T')[0]
        };
        
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score);
        
        // Keep top 50 scores
        if (leaderboard.length > 50) {
            leaderboard.splice(50);
        }
        
        this.setItem('localLeaderboard', leaderboard);
        return entry;
    }

    getLeaderboard(limit = 10) {
        const leaderboard = this.getItem('localLeaderboard', []);
        return leaderboard.slice(0, limit);
    }

    // Auto-save functionality
    setupAutoSave() {
        const autoSaveInterval = 30000; // 30 seconds
        
        setInterval(() => {
            if (this.getSettings().autoSave) {
                this.performAutoSave();
            }
        }, autoSaveInterval);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.performAutoSave();
        });
    }

    performAutoSave() {
        // Save current game state if game is active
        if (window.game && window.game.isGameActive) {
            this.saveGameState({
                score: window.game.score,
                level: window.game.level,
                timeLeft: window.game.timeLeft,
                combo: window.game.combo,
                powerUps: window.game.powerUps,
                mode: window.game.gameMode,
                timestamp: Date.now()
            });
        }
        
        this.setItem('lastAutoSave', Date.now());
    }

    saveGameState(gameState) {
        this.setItem('currentGameState', gameState);
    }

    getGameState() {
        return this.getItem('currentGameState', null);
    }

    clearGameState() {
        this.removeItem('currentGameState');
    }

    // Data export/import
    exportAllData() {
        const exportData = {
            version: this.version,
            exportDate: new Date().toISOString(),
            settings: this.getSettings(),
            stats: this.getStats(),
            profile: this.getProfile(),
            achievements: this.getAchievements(),
            dailyChallenges: this.getItem('dailyChallenges', {}),
            gameSessions: this.getGameSessions(50),
            leaderboard: this.getLeaderboard(20)
        };
        
        return exportData;
    }

    importData(importData) {
        try {
            // Validate import data structure
            if (!importData || !importData.version) {
                throw new Error('Invalid import data format');
            }
            
            // Import each data type with validation
            if (importData.settings) {
                this.saveSettings(importData.settings);
            }
            
            if (importData.stats) {
                this.saveStats(importData.stats);
            }
            
            if (importData.profile) {
                this.saveProfile(importData.profile);
            }
            
            if (importData.achievements) {
                this.saveAchievements(importData.achievements);
            }
            
            if (importData.dailyChallenges) {
                this.setItem('dailyChallenges', importData.dailyChallenges);
            }
            
            if (importData.gameSessions) {
                this.setItem('gameSessions', importData.gameSessions.slice(-100));
            }
            
            if (importData.leaderboard) {
                this.setItem('localLeaderboard', importData.leaderboard.slice(0, 50));
            }
            
            this.setItem('lastImport', Date.now());
            this.dispatchEvent('dataImported', importData);
            
            return true;
        } catch (error) {
            console.error('Data import failed:', error);
            return false;
        }
    }

    // Data analysis and insights
    getPlayTimeAnalytics() {
        const sessions = this.getGameSessions(50);
        const stats = this.getStats();
        
        return {
            totalPlayTime: stats.totalPlayTime,
            averageSessionTime: sessions.length > 0 ? 
                sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length : 0,
            sessionsThisWeek: sessions.filter(s => 
                Date.now() - s.timestamp < 7 * 24 * 60 * 60 * 1000
            ).length,
            longestSession: Math.max(...sessions.map(s => s.duration || 0), 0),
            averageScore: sessions.length > 0 ?
                sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length : 0
        };
    }

    getProgressAnalytics() {
        const stats = this.getStats();
        const profile = this.getProfile();
        const achievements = this.getAchievements();
        
        const accuracy = stats.correctSorts + stats.incorrectSorts > 0 ?
            (stats.correctSorts / (stats.correctSorts + stats.incorrectSorts)) * 100 : 0;
        
        return {
            level: profile.level,
            experience: profile.experience,
            accuracy: Math.round(accuracy),
            achievements: achievements.length,
            improvement: this.calculateImprovement(),
            strengths: this.identifyStrengths(),
            recommendations: this.generateRecommendations()
        };
    }

    calculateImprovement() {
        const sessions = this.getGameSessions(20);
        if (sessions.length < 5) return null;
        
        const recentSessions = sessions.slice(0, 10);
        const olderSessions = sessions.slice(10, 20);
        
        const recentAvg = recentSessions.reduce((sum, s) => sum + (s.score || 0), 0) / recentSessions.length;
        const olderAvg = olderSessions.reduce((sum, s) => sum + (s.score || 0), 0) / olderSessions.length;
        
        return olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
    }

    identifyStrengths() {
        const stats = this.getStats();
        const strengths = [];
        
        if (stats.streakRecord >= 20) strengths.push('Consistency');
        if (stats.powerUpsUsed / Math.max(stats.gamesPlayed, 1) >= 2) strengths.push('Strategic Thinking');
        if (stats.bestScore >= 10000) strengths.push('High Performance');
        if (stats.perfectGames >= 3) strengths.push('Precision');
        
        return strengths;
    }

    generateRecommendations() {
        const stats = this.getStats();
        const accuracy = (stats.correctSorts / Math.max(stats.correctSorts + stats.incorrectSorts, 1)) * 100;
        const recommendations = [];
        
        if (accuracy < 70) {
            recommendations.push('Focus on accuracy over speed');
        }
        if (stats.powerUpsUsed < stats.gamesPlayed) {
            recommendations.push('Use power-ups more strategically');
        }
        if (stats.dailyChallengesCompleted < 5) {
            recommendations.push('Try daily challenges for variety');
        }
        
        return recommendations;
    }

    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;
            
            if (part1 < part2) return -1;
            if (part1 > part2) return 1;
        }
        
        return 0;
    }

    dispatchEvent(eventName, data) {
        document.dispatchEvent(new CustomEvent(`dataManager_${eventName}`, {
            detail: data
        }));
    }

    // Data cleanup and maintenance
    cleanupOldData() {
        const cutoffDate = Date.now() - (90 * 24 * 60 * 60 * 1000); // 90 days
        
        // Clean old game sessions
        const sessions = this.getItem('gameSessions', []);
        const filteredSessions = sessions.filter(session => session.timestamp > cutoffDate);
        this.setItem('gameSessions', filteredSessions);
        
        // Clean old daily challenges
        const challenges = this.getItem('dailyChallenges', {});
        const filteredChallenges = {};
        Object.keys(challenges).forEach(date => {
            if (new Date(date).getTime() > cutoffDate) {
                filteredChallenges[date] = challenges[date];
            }
        });
        this.setItem('dailyChallenges', filteredChallenges);
    }

    getStorageInfo() {
        let totalSize = 0;
        let itemCount = 0;
        
        if (this.usingFallback) {
            itemCount = this.fallbackStorage.size;
            // Estimate size for fallback storage
            this.fallbackStorage.forEach(value => {
                totalSize += value.length * 2; // Rough estimate
            });
        } else {
            for (let key in localStorage) {
                if (key.startsWith(this.storagePrefix)) {
                    itemCount++;
                    totalSize += localStorage[key].length * 2; // 2 bytes per character in UTF-16
                }
            }
        }
        
        return {
            totalSize: totalSize,
            itemCount: itemCount,
            formattedSize: this.formatBytes(totalSize),
            usingFallback: this.usingFallback
        };
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Factory reset
    resetAllData() {
        if (this.usingFallback) {
            this.fallbackStorage.clear();
        } else {
            // Remove all items with our prefix
            const keysToRemove = [];
            for (let key in localStorage) {
                if (key.startsWith(this.storagePrefix)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }
        
        // Reinitialize with defaults
        this.ensureDefaultData();
        this.dispatchEvent('dataReset', {});
    }
}

// Initialize data manager
let dataManager;

document.addEventListener('DOMContentLoaded', () => {
    dataManager = new DataManager();
    window.dataManager = dataManager;
    console.log('💾 Data Manager initialized!');
});

// Utility functions for easy data access
window.saveGameData = (type, data) => {
    if (window.dataManager) {
        switch(type) {
            case 'settings': return window.dataManager.saveSettings(data);
            case 'stats': return window.dataManager.saveStats(data);
            case 'profile': return window.dataManager.saveProfile(data);
            default: return window.dataManager.setItem(type, data);
        }
    }
    return false;
};

window.loadGameData = (type, defaultValue) => {
    if (window.dataManager) {
        switch(type) {
            case 'settings': return window.dataManager.getSettings();
            case 'stats': return window.dataManager.getStats();
            case 'profile': return window.dataManager.getProfile();
            default: return window.dataManager.getItem(type, defaultValue);
        }
    }
    return defaultValue;
};

// Initialize global instance
window.dataManager = new DataManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
