// ===========================================
// 🌍 ECOSORT CHALLENGE - UI MANAGER
// Complete interface management system
// ===========================================

class UIManager {
    constructor() {
        this.currentPage = 'home';
        this.isNavigationOpen = false;
        this.isDarkMode = localStorage.getItem('darkMode') !== 'false';
        this.isAudioEnabled = localStorage.getItem('audioEnabled') !== 'false';
        
        this.initialize();
    }

    initialize() {
        this.hideLoadingScreen();
        this.initializeNavigation();
        this.initializeTheme();
        this.setupEventListeners();
        this.loadSettings();
        this.updateUIElements();
        this.startBackgroundAnimations();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 500);
            }, 1500);
        }
    }

    setupEventListeners() {
        // Navigation events
        document.addEventListener('click', this.handleNavigation.bind(this));
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Audio toggle
        const audioToggle = document.getElementById('audioToggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', this.toggleAudio.bind(this));
        }

        // Mobile navigation toggle
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', this.toggleNavigation.bind(this));
        }

        // Game controls
        this.setupGameControls();
        this.setupSettingsControls();
        this.setupHomePageButtons();
        this.setupLearnPageButtons();

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    setupGameControls() {
        // Start button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            // Remove existing listeners
            startBtn.replaceWith(startBtn.cloneNode(true));
            const newStartBtn = document.getElementById('startBtn');
            newStartBtn.addEventListener('click', this.startGame.bind(this));
            console.log('Start button event listener attached');
        } else {
            console.warn('Start button not found');
        }

        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.replaceWith(resetBtn.cloneNode(true));
            const newResetBtn = document.getElementById('resetBtn');
            newResetBtn.addEventListener('click', this.resetGame.bind(this));
            console.log('Reset button event listener attached');
        } else {
            console.warn('Reset button not found');
        }

        // Pause button
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.replaceWith(pauseBtn.cloneNode(true));
            const newPauseBtn = document.getElementById('pauseBtn');
            newPauseBtn.addEventListener('click', this.togglePause.bind(this));
            console.log('Pause button event listener attached');
        } else {
            console.warn('Pause button not found');
        }

        // Game mode selector
        const gameModeSelect = document.getElementById('gameModeSelect');
        if (gameModeSelect) {
            gameModeSelect.addEventListener('change', (e) => {
                this.updateGameModeDescription(e.target.value);
                console.log('Game mode changed to:', e.target.value);
            });
        } else {
            console.warn('Game mode selector not found');
        }
        
        // Also setup global event listeners as backup
        this.setupGlobalGameControls();
    }
    
    setupGlobalGameControls() {
        // Ensure global functions are available
        window.startGame = this.startGame.bind(this);
        window.pauseGame = this.togglePause.bind(this);
        window.resetGame = this.resetGame.bind(this);
        
        // Add event delegation for better reliability
        document.addEventListener('click', (e) => {
            if (e.target.matches('#startBtn') || e.target.closest('#startBtn')) {
                e.preventDefault();
                console.log('Start button clicked via delegation');
                this.startGame();
            }
            if (e.target.matches('#pauseBtn') || e.target.closest('#pauseBtn')) {
                e.preventDefault();
                console.log('Pause button clicked via delegation');
                this.togglePause();
            }
            if (e.target.matches('#resetBtn') || e.target.closest('#resetBtn')) {
                e.preventDefault();
                console.log('Reset button clicked via delegation');
                this.resetGame();
            }
        });
    }

    setupHomePageButtons() {
        const playNowBtn = document.getElementById('playNowBtn');
        if (playNowBtn) {
            playNowBtn.addEventListener('click', () => this.showPage('game'));
        }

        const learnMoreBtn = document.getElementById('learnMoreBtn');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => this.showPage('learn'));
        }
    }

    setupLearnPageButtons() {
        // Wait for DOM to be ready and then setup buttons
        setTimeout(() => {
            console.log('Setting up Learn More buttons...');
            
            // Find all Learn More buttons in the learn page
            const learnButtons = document.querySelectorAll('.learn-categories .btn, .category-card .btn');
            console.log('Found', learnButtons.length, 'learn buttons');
            
            learnButtons.forEach((button, index) => {
                // Remove existing listeners
                button.replaceWith(button.cloneNode(true));
                const newButton = document.querySelectorAll('.learn-categories .btn, .category-card .btn')[index];
                
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Learn More button clicked!');
                    
                    const category = newButton.closest('.category-card');
                    let categoryType = 'organic'; // default
                    
                    if (category) {
                        if (category.classList.contains('organic-category')) categoryType = 'organic';
                        else if (category.classList.contains('recyclable-category')) categoryType = 'recyclable';
                        else if (category.classList.contains('hazardous-category')) categoryType = 'hazardous';
                    }
                    
                    console.log('Opening modal for category:', categoryType);
                    this.showEducationalModal(categoryType);
                });
            });
            
            // Also setup global click handler as backup
            document.addEventListener('click', (e) => {
                if (e.target.matches('.category-card .btn') || e.target.closest('.category-card .btn')) {
                    e.preventDefault();
                    const button = e.target.closest('.btn');
                    const category = button.closest('.category-card');
                    
                    let categoryType = 'organic';
                    if (category) {
                        if (category.classList.contains('organic-category')) categoryType = 'organic';
                        else if (category.classList.contains('recyclable-category')) categoryType = 'recyclable';
                        else if (category.classList.contains('hazardous-category')) categoryType = 'hazardous';
                    }
                    
                    this.showEducationalModal(categoryType);
                }
            });
        }, 1000); // Wait 1 second for page to fully load
    }

    setupSettingsControls() {
        // Volume controls
        const volumeSliders = document.querySelectorAll('input[type="range"]');
        volumeSliders.forEach(slider => {
            const valueDisplay = slider.nextElementSibling;
            
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                if (valueDisplay && valueDisplay.classList.contains('volume-value')) {
                    valueDisplay.textContent = `${value}%`;
                }
                
                // Update audio volumes if audio manager exists
                if (window.audioManager) {
                    window.audioManager.setVolume(slider.id, value / 100);
                }
            });
        });

        // Checkbox settings
        const checkboxes = document.querySelectorAll('.settings-group input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const setting = e.target.id;
                const value = e.target.checked;
                localStorage.setItem(setting, value);
                this.applyGameSettings();
            });
        });

        // Data management buttons
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', this.exportData.bind(this));
        }

        const importBtn = document.getElementById('importData');
        if (importBtn) {
            importBtn.addEventListener('click', this.importData.bind(this));
        }

        const resetBtn = document.getElementById('resetAllData');
        if (resetBtn) {
            resetBtn.addEventListener('click', this.resetAllData.bind(this));
        }
    }

    handleNavigation(event) {
        const navLink = event.target.closest('[data-page]');
        if (navLink) {
            event.preventDefault();
            const page = navLink.dataset.page;
            this.showPage(page);
        }

        // Close modal on backdrop click
        if (event.target.classList.contains('modal-backdrop')) {
            this.closeModal();
        }
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(pageId + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update page-specific content
        this.updatePageContent(pageId);
        this.closeNavigation();
        this.animatePageTransition(pageId);
    }

    updatePageContent(pageId) {
        switch(pageId) {
            case 'profile':
                this.updateProfilePage();
                break;
            case 'learn':
                this.updateLearnPage();
                break;
            case 'achievements':
                this.updateAchievementsPage();
                break;
            case 'learn':
                this.updateLearnPage();
                break;
            case 'home':
                this.updateHomePage();
                break;
            case 'game':
                this.updateGamePage();
                break;
        }
    }

    updateHomePage() {
        if (window.game) {
            const stats = window.game.getStats();
            
            // Update hero stats with animation
            this.animateCounter('totalItemsSorted', stats.itemsSorted || 0);
            this.animateCounter('co2Saved', Math.floor((stats.itemsSorted || 0) * 0.1));
            this.animateCounter('treesSaved', Math.floor((stats.itemsSorted || 0) * 0.02));
        }
    }

    updateProfilePage() {
        if (!window.game) return;

        const stats = window.game.getStats();
        
        // Update profile stats
        document.getElementById('totalGames').textContent = stats.gamesPlayed || 0;
        document.getElementById('bestScore').textContent = (stats.bestScore || 0).toLocaleString();
        document.getElementById('bestStreak').textContent = stats.streakRecord || 0;
        document.getElementById('totalItemsSortedProfile').textContent = stats.itemsSorted || 0;
        document.getElementById('co2Reduced').textContent = `${Math.floor((stats.itemsSorted || 0) * 0.1)} kg`;
        document.getElementById('treesSavedProfile').textContent = Math.floor((stats.itemsSorted || 0) * 0.02);
        document.getElementById('waterSaved').textContent = `${Math.floor((stats.itemsSorted || 0) * 2.5)}L`;

        // Calculate and update accuracy
        const total = (stats.correctSorts || 0) + (stats.incorrectSorts || 0);
        const accuracy = total > 0 ? Math.round(((stats.correctSorts || 0) / total) * 100) : 0;
        document.getElementById('avgAccuracy').textContent = `${accuracy}%`;

        // Update XP and level system
        this.updatePlayerLevel(stats);
    }

    updatePlayerLevel(stats) {
        const xp = stats.itemsSorted || 0;
        const level = Math.floor(xp / 100) + 1;
        const levelXp = (xp % 100);
        const nextLevelXp = 100;

        const xpProgress = document.getElementById('xpProgress');
        if (xpProgress) {
            xpProgress.style.width = `${(levelXp / nextLevelXp) * 100}%`;
        }

        const xpText = document.getElementById('xpText');
        if (xpText) {
            xpText.textContent = `Level ${level} - ${levelXp}/${nextLevelXp} XP`;
        }

        // Update player title based on achievements
        const title = this.getPlayerTitle(stats);
        const playerTitle = document.getElementById('playerTitle');
        if (playerTitle) {
            playerTitle.textContent = title;
        }

        // Update avatar based on level
        this.updatePlayerAvatar(level);
    }

    updatePlayerAvatar(level) {
        const avatars = ['🌱', '🌿', '🌳', '🏆', '👑', '🌟'];
        const avatarIndex = Math.min(Math.floor(level / 10), avatars.length - 1);
        
        const avatarElement = document.getElementById('profileAvatar');
        if (avatarElement) {
            avatarElement.textContent = avatars[avatarIndex];
        }
    }

    getPlayerTitle(stats) {
        const itemsSorted = stats.itemsSorted || 0;
        const accuracy = ((stats.correctSorts || 0) / Math.max((stats.correctSorts || 0) + (stats.incorrectSorts || 0), 1)) * 100;

        if (itemsSorted >= 10000 && accuracy >= 95) return 'Legendary Eco Master';
        if (itemsSorted >= 5000 && accuracy >= 90) return 'Expert Environmental Guardian';
        if (itemsSorted >= 2500 && accuracy >= 85) return 'Advanced Recycling Specialist';
        if (itemsSorted >= 1000 && accuracy >= 80) return 'Skilled Green Warrior';
        if (itemsSorted >= 500) return 'Dedicated Earth Protector';
        if (itemsSorted >= 100) return 'Aspiring Eco Champion';
        return 'Eco Apprentice';
    }

    updateAchievementsPage() {
        const achievementsGrid = document.getElementById('achievementsGrid');
        if (!achievementsGrid) return;

        const achievements = this.getAchievements();
        
        achievementsGrid.innerHTML = achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h3 class="achievement-title">${achievement.title}</h3>
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${achievement.progress}%"></div>
                        </div>
                        <span class="progress-text">${achievement.progressText}</span>
                    </div>
                    ${achievement.reward ? `<div class="achievement-reward">🎁 ${achievement.reward}</div>` : ''}
                </div>
                ${achievement.unlocked ? '<div class="achievement-badge">✓</div>' : ''}
            </div>
        `).join('');

        // Set up achievement filters
        this.setupAchievementFilters();
    }

    setupAchievementFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Filter achievements
                const filter = e.target.dataset.filter;
                const achievementCards = document.querySelectorAll('.achievement-card');
                
                achievementCards.forEach(card => {
                    const category = card.dataset.category || 'basic';
                    card.style.display = filter === 'all' || category === filter ? 'block' : 'none';
                });
            });
        });
    }

    getAchievements() {
        const stats = window.game ? window.game.getStats() : {};
        
        return [
            {
                id: 'first_sort',
                title: 'First Steps',
                description: 'Sort your first item',
                icon: '🌱',
                category: 'basic',
                unlocked: (stats.itemsSorted || 0) >= 1,
                progress: Math.min(100, ((stats.itemsSorted || 0) / 1) * 100),
                progressText: `${Math.min(1, stats.itemsSorted || 0)}/1`,
                reward: '10 XP'
            },
            {
                id: 'century_club',
                title: 'Century Club',
                description: 'Sort 100 items',
                icon: '💯',
                category: 'basic',
                unlocked: (stats.itemsSorted || 0) >= 100,
                progress: Math.min(100, ((stats.itemsSorted || 0) / 100) * 100),
                progressText: `${Math.min(100, stats.itemsSorted || 0)}/100`,
                reward: '100 XP + Power-up'
            },
            {
                id: 'perfect_game',
                title: 'Perfectionist',
                description: 'Complete a game with 100% accuracy',
                icon: '🎯',
                category: 'skill',
                unlocked: this.hasAchievement('perfect_game'),
                progress: this.hasAchievement('perfect_game') ? 100 : 0,
                progressText: this.hasAchievement('perfect_game') ? 'Complete' : 'In Progress',
                reward: 'Precision Master Badge'
            },
            {
                id: 'high_scorer',
                title: 'High Scorer',
                description: 'Reach 10,000 points in a single game',
                icon: '🏆',
                category: 'skill',
                unlocked: (stats.bestScore || 0) >= 10000,
                progress: Math.min(100, ((stats.bestScore || 0) / 10000) * 100),
                progressText: `${Math.min(10000, stats.bestScore || 0).toLocaleString()}/10,000`,
                reward: 'Golden Trophy'
            },
            {
                id: 'streak_master',
                title: 'Streak Master',
                description: 'Achieve a 50-item sorting streak',
                icon: '🔥',
                category: 'skill',
                unlocked: (stats.streakRecord || 0) >= 50,
                progress: Math.min(100, ((stats.streakRecord || 0) / 50) * 100),
                progressText: `${Math.min(50, stats.streakRecord || 0)}/50`,
                reward: 'Streak Multiplier +50%'
            },
            {
                id: 'eco_warrior',
                title: 'Eco Warrior',
                description: 'Sort 1,000 items',
                icon: '🌍',
                category: 'environmental',
                unlocked: (stats.itemsSorted || 0) >= 1000,
                progress: Math.min(100, ((stats.itemsSorted || 0) / 1000) * 100),
                progressText: `${Math.min(1000, stats.itemsSorted || 0)}/1,000`,
                reward: 'Environmental Champion Title'
            },
            {
                id: 'daily_champion',
                title: 'Daily Champion',
                description: 'Complete 7 daily challenges',
                icon: '⭐',
                category: 'special',
                unlocked: this.getDailyChallengesCompleted() >= 7,
                progress: Math.min(100, (this.getDailyChallengesCompleted() / 7) * 100),
                progressText: `${Math.min(7, this.getDailyChallengesCompleted())}/7`,
                reward: 'Exclusive Theme'
            },
            {
                id: 'speed_demon',
                title: 'Speed Demon',
                description: 'Sort 30 items in under 30 seconds',
                icon: '⚡',
                category: 'special',
                unlocked: this.hasAchievement('speed_demon'),
                progress: this.hasAchievement('speed_demon') ? 100 : 0,
                progressText: this.hasAchievement('speed_demon') ? 'Complete' : 'In Progress',
                reward: 'Lightning Theme'
            }
        ];
    }

    getDailyChallengesCompleted() {
        return parseInt(localStorage.getItem('dailyChallengesCompleted') || '0');
    }

    hasAchievement(achievementId) {
        const achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        return achievements.includes(achievementId);
    }

    unlockAchievement(achievementId) {
        const achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            localStorage.setItem('unlockedAchievements', JSON.stringify(achievements));
            this.showAchievementUnlock(achievementId);
        }
    }

    showAchievementUnlock(achievementId) {
        const achievement = this.getAchievements().find(a => a.id === achievementId);
        if (achievement) {
            this.createAchievementModal(achievement);
        }
    }

    createAchievementModal(achievement) {
        const modal = document.createElement('div');
        modal.className = 'achievement-unlock-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="achievement-unlock">
                    <h2>🎉 Achievement Unlocked!</h2>
                    <div class="achievement-display">
                        <div class="achievement-icon-large">${achievement.icon}</div>
                        <h3>${achievement.title}</h3>
                        <p>${achievement.description}</p>
                        ${achievement.reward ? `<div class="reward">Reward: ${achievement.reward}</div>` : ''}
                    </div>
                    <button class="btn btn-primary" onclick="this.closest('.achievement-unlock-modal').remove()">
                        Awesome!
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 5000);
    }

    updateLearnPage() {
        const factsGrid = document.getElementById('factsGrid');
        if (!factsGrid) return;

        const facts = [
            {
                icon: '♻️',
                title: 'Aluminum Recycling',
                content: 'Recycling one aluminum can saves enough energy to power a laptop for 3 hours!',
                impact: 'Energy Saving: 95%'
            },
            {
                icon: '🌱',
                title: 'Composting Power',
                content: 'Composting food waste reduces methane emissions by up to 80% compared to landfilling.',
                impact: 'Emission Reduction: 80%'
            },
            {
                icon: '🔋',
                title: 'Battery Danger',
                content: 'A single battery can contaminate 1,000 gallons of water if not disposed properly.',
                impact: 'Water Protection: 1,000 gallons'
            },
            {
                icon: '📱',
                title: 'E-Waste Crisis',
                content: 'Electronic waste is growing 5% annually and contains precious metals worth billions.',
                impact: 'Recovery Value: $62 billion globally'
            },
            {
                icon: '🥫',
                title: 'Steel Recycling',
                content: 'Recycling steel uses 75% less energy than producing new steel from raw materials.',
                impact: 'Energy Saving: 75%'
            },
            {
                icon: '🍃',
                title: 'Organic Waste Impact',
                content: 'Food waste produces methane, a greenhouse gas 25 times more potent than CO2.',
                impact: 'GHG Reduction: 25x CO2 equivalent'
            },
            {
                icon: '🌊',
                title: 'Plastic in Oceans',
                content: 'Every minute, one garbage truck of plastic enters our oceans.',
                impact: 'Ocean Protection: Critical'
            },
            {
                icon: '🌳',
                title: 'Paper Recycling',
                content: 'Recycling one ton of paper saves 17 trees and 7,000 gallons of water.',
                impact: 'Resource Conservation: Massive'
            }
        ];

        factsGrid.innerHTML = facts.map((fact, index) => `
            <div class="fact-card" style="animation-delay: ${index * 0.1}s">
                <div class="fact-icon">${fact.icon}</div>
                <h3 class="fact-title">${fact.title}</h3>
                <p class="fact-content">${fact.content}</p>
                <div class="fact-impact">${fact.impact}</div>
            </div>
        `).join('');

        // Add educational categories functionality
        this.setupEducationalCategories();
    }

    setupEducationalCategories() {
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const button = card.querySelector('.btn');
            if (button) {
                button.addEventListener('click', (e) => {
                    const category = e.target.closest('.category-card').className.includes('organic') ? 'organic' :
                                   e.target.closest('.category-card').className.includes('recyclable') ? 'recyclable' : 'hazardous';
                    this.showEducationalModal(category);
                });
            }
        });
    }

    showEducationalModal(category, customContent = null) {
        const content = customContent || this.getEducationalContent(category);
        if (!content) return;

        const modal = document.createElement('div');
        modal.className = 'educational-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.closest('.educational-modal').remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${content.icon || '📚'} ${content.title}</h2>
                    <button class="close-btn" onclick="this.closest('.educational-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p class="description">${content.description}</p>
                    
                    ${content.benefits ? `
                    <div class="content-section">
                        <h3>✅ Benefits</h3>
                        <ul>
                            ${content.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    <div class="content-section">
                        <h3>📝 Examples</h3>
                        <div class="examples-grid">
                            ${content.examples.map(example => `<span class="example-tag">${example}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h3>💡 Tips</h3>
                        <ul>
                            ${content.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.educational-modal').remove()">
                        Got it! 🚀
                    </button>
                </div>
            </div>
        `;
        
        // Style the modal to be more attractive and not cover content
        const modalStyle = modal.querySelector('.modal-content');
        modalStyle.style.cssText += `
            max-height: 80vh;
            overflow-y: auto;
            max-width: 600px;
            margin: 2rem auto;
        `;
        
        document.body.appendChild(modal);
        
        // Focus management for accessibility
        setTimeout(() => {
            const closeBtn = modal.querySelector('.close-btn');
            if (closeBtn) closeBtn.focus();
        }, 100);
    }

    getEducationalContent(category) {
        const content = {
            organic: {
                title: "Organic Waste",
                icon: "🌱",
                description: "Biodegradable materials that can be composted to create nutrient-rich soil amendments.",
                benefits: [
                    "Creates nutrient-rich soil amendments",
                    "Reduces methane emissions from landfills",
                    "Supports circular economy principles",
                    "Reduces need for chemical fertilizers"
                ],
                examples: ["Food scraps", "Garden waste", "Paper towels", "Natural fiber clothing", "Coffee grounds", "Eggshells"],
                tips: [
                    "Start a home compost bin",
                    "Avoid adding meat or dairy to home compost",
                    "Balance green and brown materials",
                    "Turn compost regularly for better decomposition"
                ]
            },
            recyclable: {
                title: "Recyclable Materials",
                icon: "♻️",
                description: "Materials that can be processed and transformed into new products, conserving resources.",
                benefits: [
                    "Conserves natural resources",
                    "Reduces energy consumption",
                    "Creates jobs in recycling industry",
                    "Reduces landfill waste"
                ],
                examples: ["Plastic bottles", "Glass containers", "Metal cans", "Paper products", "Cardboard", "Electronics"],
                tips: [
                    "Clean containers before recycling",
                    "Remove caps and lids when required",
                    "Check local recycling guidelines",
                    "Buy products with recycled content"
                ]
            },
            hazardous: {
                title: "Hazardous Waste",
                icon: "⚠️",
                description: "Materials requiring special handling due to their toxic, flammable, or harmful properties.",
                benefits: [
                    "Prevents soil and water contamination",
                    "Protects human and environmental health",
                    "Enables proper treatment of toxic materials",
                    "Recovers valuable materials safely"
                ],
                examples: ["Batteries", "Electronics", "Chemicals", "Medical waste", "Paint", "Motor oil"],
                tips: [
                    "Never put in regular trash",
                    "Use designated collection centers",
                    "Store safely until disposal",
                    "Consider less toxic alternatives"
                ]
            }
        };
        
        return content[category];
    }

    updateGamePage() {
        // Update game mode descriptions
        const gameModeSelect = document.getElementById('gameModeSelect');
        if (gameModeSelect) {
            this.updateGameModeDescription(gameModeSelect.value);
        }

        // Update power-ups display
        this.updatePowerUpsDisplay();
        this.updateEnvironmentalImpact();
    }

    updateGameModeDescription(mode) {
        const descriptions = {
            normal: "Perfect for learning! 90 seconds to sort items with helpful hints.",
            speed: "Fast-paced action! Sort as many items as possible in 45 seconds.",
            precision: "One mistake and you're out! Test your knowledge with 120 seconds.",
            survival: "Endless waves of waste! How long can you survive?",
            blitz: "Pure chaos! 30 seconds of intense sorting madness.",
            zen: "Peaceful sorting experience with no time pressure.",
            challenge: "Daily special objectives with unique rewards!"
        };

        const description = descriptions[mode];
        const gameModeDesc = document.getElementById('gameModeDescription');
        if (gameModeDesc) {
            gameModeDesc.textContent = description;
        }
    }

    updatePowerUpsDisplay() {
        const powerUpsSection = document.getElementById('powerUpsSection');
        if (!powerUpsSection || !window.game) return;

        const powerUps = window.game.powerUps;
        const powerUpsGrid = document.getElementById('powerUpsGrid');
        
        if (powerUpsGrid) {
            powerUpsGrid.innerHTML = Object.entries(powerUps).map(([type, data]) => `
                <div class="power-up-card ${data.count > 0 ? 'available' : 'unavailable'}" 
                     onclick="window.game.activatePowerUp('${type}')">
                    <div class="power-up-icon">${this.getPowerUpIcon(type)}</div>
                    <div class="power-up-name">${this.formatPowerUpName(type)}</div>
                    <div class="power-up-count">${data.count}</div>
                    <div class="power-up-description">${this.getPowerUpDescription(type)}</div>
                </div>
            `).join('');
        }

        powerUpsSection.style.display = Object.values(powerUps).some(p => p.count > 0) ? 'block' : 'none';
    }

    getPowerUpIcon(type) {
        const icons = {
            timeFreeze: '⏸️',
            doublePoints: '✨',
            showHints: '🔍',
            skipItem: '⏭️',
            extraLife: '❤️'
        };
        return icons[type] || '⚡';
    }

    formatPowerUpName(name) {
        const names = {
            timeFreeze: 'Time Freeze',
            doublePoints: 'Double Points',
            showHints: 'Show Hints',
            skipItem: 'Skip Item',
            extraLife: 'Extra Life'
        };
        return names[name] || name;
    }

    getPowerUpDescription(type) {
        const descriptions = {
            timeFreeze: 'Pause the timer for 5 seconds',
            doublePoints: 'Double all points for 10 seconds',
            showHints: 'Show correct bin hints for 15 seconds',
            skipItem: 'Skip the current item',
            extraLife: 'Gain an extra life in survival mode'
        };
        return descriptions[type] || 'Special power-up';
    }

    updateEnvironmentalImpact() {
        const environmentalSection = document.getElementById('environmentalSection');
        if (!environmentalSection || !window.game) return;

        const stats = window.game.getStats();
        const itemsSorted = stats.itemsSorted || 0;

        const impactStats = {
            co2Reduced: Math.floor(itemsSorted * 0.1),
            waterSaved: Math.floor(itemsSorted * 2.5),
            treesSaved: Math.floor(itemsSorted * 0.02),
            energySaved: Math.floor(itemsSorted * 0.5)
        };

        const environmentalStatsDiv = document.getElementById('environmentalStats');
        if (environmentalStatsDiv) {
            environmentalStatsDiv.innerHTML = `
                <div class="impact-stat">
                    <div class="impact-icon">🌱</div>
                    <div class="impact-value">${impactStats.co2Reduced} kg</div>
                    <div class="impact-label">CO₂ Reduced</div>
                </div>
                <div class="impact-stat">
                    <div class="impact-icon">💧</div>
                    <div class="impact-value">${impactStats.waterSaved}L</div>
                    <div class="impact-label">Water Saved</div>
                </div>
                <div class="impact-stat">
                    <div class="impact-icon">🌳</div>
                    <div class="impact-value">${impactStats.treesSaved}</div>
                    <div class="impact-label">Trees Saved</div>
                </div>
                <div class="impact-stat">
                    <div class="impact-icon">⚡</div>
                    <div class="impact-value">${impactStats.energySaved} kWh</div>
                    <div class="impact-label">Energy Saved</div>
                </div>
            `;
        }

        environmentalSection.style.display = itemsSorted > 0 ? 'block' : 'none';
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        
        document.documentElement.classList.toggle('light-mode', !this.isDarkMode);
        
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = this.isDarkMode ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
        }

        this.showNotification(`${this.isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
    }

    toggleAudio() {
        this.isAudioEnabled = !this.isAudioEnabled;
        localStorage.setItem('audioEnabled', this.isAudioEnabled);
        
        if (window.game) {
            window.game.audioEnabled = this.isAudioEnabled;
        }
        
        const icon = document.querySelector('#audioToggle i');
        if (icon) {
            icon.className = this.isAudioEnabled ? 'bi bi-volume-up-fill' : 'bi bi-volume-mute-fill';
        }

        this.showNotification(`Audio ${this.isAudioEnabled ? 'enabled' : 'disabled'}`, 'info');
    }

    toggleNavigation() {
        this.isNavigationOpen = !this.isNavigationOpen;
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu) {
            navMenu.classList.toggle('open', this.isNavigationOpen);
            
            // Update toggle button icon
            if (navToggle) {
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.className = this.isNavigationOpen ? 'bi bi-x-lg' : 'bi bi-list';
                }
            }
        }
        
        // Close menu when clicking outside
        if (this.isNavigationOpen) {
            const handleOutsideClick = (e) => {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    this.closeNavigation();
                    document.removeEventListener('click', handleOutsideClick);
                }
            };
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick);
            }, 100);
        }
    }

    closeNavigation() {
        this.isNavigationOpen = false;
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu) {
            navMenu.classList.remove('open');
        }
        
        // Reset toggle button icon
        if (navToggle) {
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = 'bi bi-list';
            }
        }
    }

    initializeNavigation() {
        this.showPage('home');
    }

    initializeTheme() {
        document.documentElement.classList.toggle('light-mode', !this.isDarkMode);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.isDarkMode ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
        }

        const audioIcon = document.querySelector('#audioToggle i');
        if (audioIcon) {
            audioIcon.className = this.isAudioEnabled ? 'bi bi-volume-up-fill' : 'bi bi-volume-mute-fill';
        }
    }

    loadSettings() {
        // Load volume settings
        const masterVolume = localStorage.getItem('masterVolume') || '70';
        const sfxVolume = localStorage.getItem('sfxVolume') || '80';
        const musicVolume = localStorage.getItem('musicVolume') || '50';

        const masterVolumeSlider = document.getElementById('masterVolume');
        const sfxVolumeSlider = document.getElementById('sfxVolume');
        const musicVolumeSlider = document.getElementById('musicVolume');

        if (masterVolumeSlider) {
            masterVolumeSlider.value = masterVolume;
            const valueDisplay = masterVolumeSlider.nextElementSibling;
            if (valueDisplay) valueDisplay.textContent = `${masterVolume}%`;
        }

        if (sfxVolumeSlider) {
            sfxVolumeSlider.value = sfxVolume;
            const valueDisplay = sfxVolumeSlider.nextElementSibling;
            if (valueDisplay) valueDisplay.textContent = `${sfxVolume}%`;
        }

        if (musicVolumeSlider) {
            musicVolumeSlider.value = musicVolume;
            const valueDisplay = musicVolumeSlider.nextElementSibling;
            if (valueDisplay) valueDisplay.textContent = `${musicVolume}%`;
        }

        // Load checkbox settings
        const showHints = document.getElementById('showHints');
        const enableParticles = document.getElementById('enableParticles');
        const autoSave = document.getElementById('autoSave');

        if (showHints) showHints.checked = localStorage.getItem('showHints') !== 'false';
        if (enableParticles) enableParticles.checked = localStorage.getItem('enableParticles') !== 'false';
        if (autoSave) autoSave.checked = localStorage.getItem('autoSave') !== 'false';

        // Load difficulty
        const difficulty = localStorage.getItem('difficulty') || 'normal';
        const difficultySelect = document.getElementById('difficulty');
        if (difficultySelect) difficultySelect.value = difficulty;
    }

    applyGameSettings() {
        if (window.game) {
            const settings = {
                showHints: document.getElementById('showHints')?.checked || false,
                enableParticles: document.getElementById('enableParticles')?.checked || true,
                autoSave: document.getElementById('autoSave')?.checked || true,
                difficulty: document.getElementById('difficulty')?.value || 'normal'
            };
            
            // Apply settings to game
            Object.keys(settings).forEach(key => {
                if (window.game.settings) {
                    window.game.settings[key] = settings[key];
                }
            });
        }
    }

    startGame() {
        const gameMode = document.getElementById('gameModeSelect')?.value || 'normal';
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
        const mappedMode = modeMapping[gameMode] || 'time_trial';
        
        if (window.game) {
            window.game.startGame(mappedMode);
            this.updateGameUI();
            
            // Update button states
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            
            if (startBtn) startBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'inline-block';
        }
    }

    resetGame() {
        if (window.game) {
            window.game.endGame();
            this.updateGameUI();
        }
    }

    togglePause() {
        if (window.game && window.game.isGameActive) {
            // Implement pause functionality
            this.showNotification('Game paused', 'info');
        }
    }

    updateGameUI() {
        if (!window.game) return;

        const gameElements = {
            gameScore: window.game.score,
            gameLevel: window.game.level,
            gameLives: window.game.lives,
            gameTime: window.game.timeLeft,
            gameStreak: window.game.combo
        };

        Object.entries(gameElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Calculate and update accuracy
        const total = window.game.stats.correctSorts + window.game.stats.incorrectSorts;
        const accuracy = total > 0 ? Math.round((window.game.stats.correctSorts / total) * 100) : 0;
        const accuracyElement = document.getElementById('gameAccuracy');
        if (accuracyElement) {
            accuracyElement.textContent = `${accuracy}%`;
        }

        // Update button states
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn && pauseBtn) {
            if (window.game.isGameActive) {
                startBtn.style.display = 'none';
                pauseBtn.style.display = 'inline-flex';
            } else {
                startBtn.style.display = 'inline-flex';
                pauseBtn.style.display = 'none';
            }
        }
    }

    handleKeyboard(event) {
        // Global keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch(event.key.toLowerCase()) {
                case 'h':
                    event.preventDefault();
                    this.showPage('home');
                    break;
                case 'g':
                    event.preventDefault();
                    this.showPage('game');
                    break;
                case 'p':
                    event.preventDefault();
                    this.showPage('profile');
                    break;
            }
        }

        // Escape to close modals
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }

    animatePageTransition(pageId) {
        const page = document.getElementById(pageId + 'Page');
        if (page) {
            page.style.opacity = '0';
            page.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                page.style.transition = 'all 0.3s ease-out';
                page.style.opacity = '1';
                page.style.transform = 'translateY(0)';
            });
        }
    }

    animateCounter(elementId, targetValue, duration = 1000) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    startBackgroundAnimations() {
        // Animate floating items on home page
        const floatingItems = document.querySelectorAll('.float-item');
        floatingItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.5}s`;
            item.style.animation = 'float 3s ease-in-out infinite';
        });

        // Create background particles
        this.createBackgroundParticles();
    }

    createBackgroundParticles() {
        const particlesContainer = document.getElementById('backgroundParticles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'background-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(16, 185, 129, 0.3);
                border-radius: 50%;
                animation: float-particle ${5 + Math.random() * 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            particlesContainer.appendChild(particle);
        }
    }

    updateUIElements() {
        this.updateHomePage();
        this.updateProfilePage();
    }

    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notifications') || this.createNotificationContainer();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.className = 'notifications-container';
        document.body.appendChild(container);
        return container;
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal-backdrop, .game-over-modal, .educational-modal, .achievement-unlock-modal');
        modals.forEach(modal => modal.remove());
    }

    exportData() {
        const data = {
            stats: window.game ? window.game.getStats() : {},
            settings: {
                darkMode: this.isDarkMode,
                audioEnabled: this.isAudioEnabled,
                masterVolume: document.getElementById('masterVolume')?.value || '70',
                sfxVolume: document.getElementById('sfxVolume')?.value || '80',
                musicVolume: document.getElementById('musicVolume')?.value || '50',
                showHints: document.getElementById('showHints')?.checked || true,
                enableParticles: document.getElementById('enableParticles')?.checked || true,
                autoSave: document.getElementById('autoSave')?.checked || true,
                difficulty: document.getElementById('difficulty')?.value || 'normal'
            },
            achievements: JSON.parse(localStorage.getItem('unlockedAchievements') || '[]'),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecosort-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Progress exported successfully! 📁', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.loadImportedData(data);
                        this.showNotification('Progress imported successfully! 📂', 'success');
                    } catch (error) {
                        this.showNotification('Invalid file format! 🚫', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    loadImportedData(data) {
        // Load stats
        if (data.stats && window.game) {
            Object.keys(data.stats).forEach(key => {
                localStorage.setItem(key, data.stats[key]);
                if (window.game.stats) {
                    window.game.stats[key] = data.stats[key];
                }
            });
        }

        // Load settings
        if (data.settings) {
            Object.keys(data.settings).forEach(key => {
                localStorage.setItem(key, data.settings[key]);
            });
            this.isDarkMode = data.settings.darkMode;
            this.isAudioEnabled = data.settings.audioEnabled;
            this.loadSettings();
            this.initializeTheme();
        }

        // Load achievements
        if (data.achievements) {
            localStorage.setItem('unlockedAchievements', JSON.stringify(data.achievements));
        }

        // Refresh displays
        this.updateUIElements();
    }

    resetAllData() {
        if (confirm('⚠️ Are you sure you want to reset all progress? This cannot be undone!')) {
            // Clear localStorage except for essential settings
            const keysToKeep = ['darkMode', 'audioEnabled'];
            Object.keys(localStorage).forEach(key => {
                if (!keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            });

            // Reset game stats
            if (window.game) {
                window.game.resetStats();
            }

            this.showNotification('All data has been reset! 🔄', 'info');
            this.updateUIElements();
            
            // Refresh the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }
}

// Initialize UI Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
    console.log('🎨 UI Manager initialized successfully!');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}