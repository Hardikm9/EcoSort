// ===========================================
// 🌍 ECOSORT CHALLENGE - ADVANCED FEATURES
// Multiplayer, Quiz Mode, Themes, Voice, AR, and more
// ===========================================

class AdvancedFeatures {
    constructor() {
        this.initialized = false;
        this.voiceSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        this.arSupported = 'getUserMedia' in navigator.mediaDevices;
        this.currentTheme = localStorage.getItem('selectedTheme') || 'default';
        this.voiceEnabled = false;
        this.recognition = null;
        
        this.initialize();
    }

    initialize() {
        this.setupDailyChallenges();
        this.setupAchievementSystem();
        this.setupThemes(); // Keep themes for light/dark mode
        this.setupSimplifiedAdvancedMenu(); // Single clean menu
        this.setupProgressiveDifficulty();
        this.setupImpactTracker();
        
        this.initialized = true;
        console.log('🚀 Advanced Features initialized!');
    }

    // Simplified Advanced Features Menu
    setupSimplifiedAdvancedMenu() {
        const gameHeader = document.querySelector('.game-header');
        if (gameHeader && !document.querySelector('.advanced-menu')) {
            const advancedMenu = document.createElement('div');
            advancedMenu.className = 'advanced-menu';
            advancedMenu.innerHTML = `
                <details class="advanced-features-dropdown">
                    <summary class="advanced-trigger">
                        🎆 Advanced Features
                    </summary>
                    <div class="advanced-features-content">
                        <button class="feature-btn" onclick="window.advancedFeatures.enableMultiplayer()">
                            👥 Multiplayer Mode
                        </button>
                        <button class="feature-btn" onclick="window.advancedFeatures.startQuiz()">
                            ❓ Quiz Mode
                        </button>
                        <button class="feature-btn" onclick="window.advancedFeatures.toggleVoice()">
                            🎤 Voice Commands
                        </button>
                        <button class="feature-btn" onclick="window.advancedFeatures.toggleAR()">
                            📷 AR Mode (Beta)
                        </button>
                    </div>
                </details>
            `;
            gameHeader.appendChild(advancedMenu);
        }
    }

    // Simplified method implementations
    enableMultiplayer() {
        this.showNotification('👥 Multiplayer mode coming soon! Currently in development.', 'info', 3000);
    }

    startQuiz() {
        this.showNotification('❓ Quiz mode coming soon! Test your waste sorting knowledge.', 'info', 3000);
    }

    toggleVoice() {
        if (this.voiceSupported) {
            this.showNotification('🎤 Voice commands feature coming soon!', 'info', 3000);
        } else {
            this.showNotification('🎤 Voice commands not supported in this browser.', 'warning', 3000);
        }
    }

    toggleAR() {
        if (this.arSupported) {
            this.showNotification('📷 AR mode coming soon! Experience waste sorting in augmented reality.', 'info', 3000);
        } else {
            this.showNotification('📷 AR mode requires camera access and is not supported in this browser.', 'warning', 3000);
        }
    }

    // Feature 3: Multiplayer Competition
    setupMultiplayer() {
        this.multiplayer = {
            isMultiplayerMode: false,
            players: [],
            currentPlayer: 0,
            scores: {},
            gameHistory: []
        };

        this.addMultiplayerUI();
    }

    addMultiplayerUI() {
        const gameHeader = document.querySelector('.game-header');
        if (gameHeader && !document.querySelector('.multiplayer-section')) {
            const multiplayerSection = document.createElement('div');
            multiplayerSection.className = 'multiplayer-section';
            multiplayerSection.innerHTML = `
                <div class="multiplayer-controls">
                    <button id="multiplayerToggle" class="btn btn-secondary">
                        <i class="bi bi-people"></i> Enable Multiplayer
                    </button>
                    <div id="multiplayerSetup" class="multiplayer-setup" style="display: none;">
                        <div class="player-setup">
                            <label>Number of Players:</label>
                            <select id="playerCount">
                                <option value="2">2 Players</option>
                                <option value="3">3 Players</option>
                                <option value="4">4 Players</option>
                            </select>
                        </div>
                        <div id="playerNames" class="player-names"></div>
                        <button id="startMultiplayer" class="btn btn-primary">Start Multiplayer Game</button>
                    </div>
                </div>
                <div id="multiplayerScoreboard" class="multiplayer-scoreboard" style="display: none;"></div>
            `;
            gameHeader.appendChild(multiplayerSection);

            this.setupMultiplayerEvents();
        }
    }

    setupMultiplayerEvents() {
        document.getElementById('multiplayerToggle')?.addEventListener('click', this.toggleMultiplayer.bind(this));
        document.getElementById('startMultiplayer')?.addEventListener('click', this.startMultiplayerGame.bind(this));
        document.getElementById('playerCount')?.addEventListener('change', this.updatePlayerSetup.bind(this));
    }

    toggleMultiplayer() {
        const setup = document.getElementById('multiplayerSetup');
        const toggle = document.getElementById('multiplayerToggle');
        
        if (setup.style.display === 'none') {
            setup.style.display = 'block';
            toggle.innerHTML = '<i class="bi bi-person"></i> Disable Multiplayer';
            this.updatePlayerSetup();
        } else {
            setup.style.display = 'none';
            toggle.innerHTML = '<i class="bi bi-people"></i> Enable Multiplayer';
            this.multiplayer.isMultiplayerMode = false;
        }
    }

    updatePlayerSetup() {
        const playerCount = parseInt(document.getElementById('playerCount').value);
        const playerNames = document.getElementById('playerNames');
        
        let html = '';
        for (let i = 1; i <= playerCount; i++) {
            html += `
                <div class="player-input">
                    <label>Player ${i} Name:</label>
                    <input type="text" id="player${i}Name" placeholder="Player ${i}" value="Player ${i}">
                </div>
            `;
        }
        playerNames.innerHTML = html;
    }

    startMultiplayerGame() {
        const playerCount = parseInt(document.getElementById('playerCount').value);
        this.multiplayer.players = [];
        this.multiplayer.scores = {};
        
        for (let i = 1; i <= playerCount; i++) {
            const name = document.getElementById(`player${i}Name`).value || `Player ${i}`;
            this.multiplayer.players.push({
                id: i,
                name: name,
                score: 0,
                games: 0
            });
            this.multiplayer.scores[i] = 0;
        }
        
        this.multiplayer.isMultiplayerMode = true;
        this.multiplayer.currentPlayer = 0;
        
        this.showMultiplayerScoreboard();
        this.showNotification(`🎮 Multiplayer mode started! ${this.multiplayer.players[0].name}'s turn!`, 'info');
    }

    showMultiplayerScoreboard() {
        const scoreboard = document.getElementById('multiplayerScoreboard');
        if (scoreboard) {
            scoreboard.style.display = 'block';
            
            let html = '<h4>🏆 Multiplayer Scoreboard</h4><div class="scores">';
            this.multiplayer.players.forEach((player, index) => {
                html += `
                    <div class="player-score ${index === this.multiplayer.currentPlayer ? 'current-player' : ''}">
                        <span class="player-name">${player.name}</span>
                        <span class="player-score-value">${player.score}</span>
                    </div>
                `;
            });
            html += '</div>';
            scoreboard.innerHTML = html;
        }
    }

    // Feature 4: Educational Quiz Mode
    setupQuizMode() {
        this.quiz = {
            questions: this.generateQuizQuestions(),
            currentQuestion: 0,
            score: 0,
            isActive: false
        };

        this.addQuizUI();
    }

    addQuizUI() {
        const gameHeader = document.querySelector('.game-header');
        if (gameHeader && !document.querySelector('.quiz-section')) {
            const quizSection = document.createElement('div');
            quizSection.className = 'quiz-section';
            quizSection.innerHTML = `
                <button id="startQuiz" class="btn btn-info">
                    <i class="bi bi-question-circle"></i> Start Quiz Mode
                </button>
                <div id="quizContainer" class="quiz-container" style="display: none;">
                    <div class="quiz-progress">
                        <div class="progress-bar">
                            <div id="quizProgress" class="progress-fill"></div>
                        </div>
                    </div>
                    <div id="quizContent" class="quiz-content"></div>
                </div>
            `;
            gameHeader.appendChild(quizSection);

            document.getElementById('startQuiz')?.addEventListener('click', this.startQuiz.bind(this));
        }
    }

    generateQuizQuestions() {
        return [
            {
                question: "Which bin should a banana peel go into?",
                options: ["Organic", "Recyclable", "Hazardous"],
                correct: 0,
                explanation: "Banana peels are organic waste and can be composted."
            },
            {
                question: "How much energy does recycling one aluminum can save?",
                options: ["1 hour of laptop use", "3 hours of laptop use", "5 hours of laptop use"],
                correct: 1,
                explanation: "Recycling one aluminum can saves enough energy to power a laptop for 3 hours!"
            },
            {
                question: "What percentage of plastic bottles are actually recycled?",
                options: ["30%", "50%", "70%"],
                correct: 0,
                explanation: "Only about 30% of plastic bottles are recycled, highlighting the importance of proper waste sorting."
            },
            {
                question: "Which of these should go in hazardous waste?",
                options: ["Glass jar", "Old battery", "Cardboard box"],
                correct: 1,
                explanation: "Batteries contain toxic materials and must be disposed of in hazardous waste bins."
            },
            {
                question: "How long does it take for an aluminum can to decompose in landfill?",
                options: ["50 years", "200 years", "500+ years"],
                correct: 2,
                explanation: "Aluminum cans can take 500+ years to decompose, making recycling crucial!"
            }
        ];
    }

    startQuiz() {
        this.quiz.isActive = true;
        this.quiz.currentQuestion = 0;
        this.quiz.score = 0;
        
        document.getElementById('quizContainer').style.display = 'block';
        document.getElementById('startQuiz').style.display = 'none';
        
        this.showQuizQuestion();
    }

    showQuizQuestion() {
        const question = this.quiz.questions[this.quiz.currentQuestion];
        const progress = ((this.quiz.currentQuestion + 1) / this.quiz.questions.length) * 100;
        
        document.getElementById('quizProgress').style.width = `${progress}%`;
        
        const content = document.getElementById('quizContent');
        content.innerHTML = `
            <div class="quiz-question">
                <h3>Question ${this.quiz.currentQuestion + 1} of ${this.quiz.questions.length}</h3>
                <p class="question-text">${question.question}</p>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option btn btn-outline" onclick="window.advancedFeatures.answerQuestion(${index})">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    answerQuestion(answerIndex) {
        const question = this.quiz.questions[this.quiz.currentQuestion];
        const isCorrect = answerIndex === question.correct;
        
        if (isCorrect) {
            this.quiz.score++;
            this.showNotification('Correct! 🎉', 'success');
        } else {
            this.showNotification('Incorrect. 📚', 'error');
        }
        
        // Show explanation
        document.getElementById('quizContent').innerHTML += `
            <div class="quiz-explanation ${isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>Explanation:</strong> ${question.explanation}</p>
                <button class="btn btn-primary" onclick="window.advancedFeatures.nextQuestion()">Next Question</button>
            </div>
        `;
    }

    nextQuestion() {
        this.quiz.currentQuestion++;
        
        if (this.quiz.currentQuestion >= this.quiz.questions.length) {
            this.endQuiz();
        } else {
            this.showQuizQuestion();
        }
    }

    endQuiz() {
        const percentage = Math.round((this.quiz.score / this.quiz.questions.length) * 100);
        
        document.getElementById('quizContent').innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete! 🎓</h3>
                <div class="quiz-score">
                    <span class="score-text">Your Score:</span>
                    <span class="score-value">${this.quiz.score}/${this.quiz.questions.length} (${percentage}%)</span>
                </div>
                <div class="quiz-badge">
                    ${percentage >= 80 ? '🏆 Eco Expert!' : 
                      percentage >= 60 ? '🌟 Eco Champion!' : 
                      '🌱 Keep Learning!'}
                </div>
                <button class="btn btn-primary" onclick="window.advancedFeatures.resetQuiz()">Try Again</button>
            </div>
        `;
        
        this.quiz.isActive = false;
    }

    resetQuiz() {
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('startQuiz').style.display = 'block';
    }

    // Feature 5: Customizable Themes
    setupThemes() {
        this.themes = {
            default: {
                name: 'Classic Green',
                primary: '#10b981',
                secondary: '#3b82f6',
                accent: '#f59e0b'
            },
            ocean: {
                name: 'Ocean Blue',
                primary: '#0891b2',
                secondary: '#0284c7',
                accent: '#06b6d4'
            },
            sunset: {
                name: 'Sunset Orange',
                primary: '#ea580c',
                secondary: '#dc2626',
                accent: '#f59e0b'
            },
            forest: {
                name: 'Forest Green',
                primary: '#16a34a',
                secondary: '#15803d',
                accent: '#22c55e'
            },
            cosmic: {
                name: 'Cosmic Purple',
                primary: '#7c3aed',
                secondary: '#8b5cf6',
                accent: '#a855f7'
            }
        };

        this.addThemeSelector();
        this.applyTheme(this.currentTheme);
    }

    addThemeSelector() {
        const settingsPage = document.getElementById('settingsPage');
        if (settingsPage && !document.querySelector('.theme-selector')) {
            const themeSection = document.createElement('div');
            themeSection.className = 'settings-group';
            themeSection.innerHTML = `
                <h3>🎨 Themes</h3>
                <div class="theme-selector">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <div class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
                             data-theme="${key}" onclick="window.advancedFeatures.setTheme('${key}')">
                            <div class="theme-preview">
                                <div class="theme-colors">
                                    <div class="color-dot" style="background: ${theme.primary};"></div>
                                    <div class="color-dot" style="background: ${theme.secondary};"></div>
                                    <div class="color-dot" style="background: ${theme.accent};"></div>
                                </div>
                            </div>
                            <span class="theme-name">${theme.name}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            settingsPage.appendChild(themeSection);
        }
    }

    setTheme(themeKey) {
        const theme = this.themes[themeKey];
        if (!theme) return;

        this.currentTheme = themeKey;
        this.applyTheme(themeKey);
        
        // Update theme selector
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === themeKey);
        });

        // Save theme preference
        localStorage.setItem('selectedTheme', themeKey);
        
        this.showNotification(`Theme changed to ${theme.name}! 🎨`, 'success');
    }

    applyTheme(themeKey) {
        const theme = this.themes[themeKey];
        if (!theme) return;

        // Update CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--secondary', theme.secondary);
        root.style.setProperty('--accent', theme.accent);
    }

    // Feature 9: Voice Commands
    setupVoiceCommands() {
        if (!this.voiceSupported) {
            console.warn('Voice recognition not supported in this browser');
            return;
        }

        this.voiceCommands = {
            'start game': () => window.game?.startGame(),
            'organic': () => this.sortByVoice('organic'),
            'recyclable': () => this.sortByVoice('recyclable'),
            'recycle': () => this.sortByVoice('recyclable'),
            'hazardous': () => this.sortByVoice('hazardous'),
            'dangerous': () => this.sortByVoice('hazardous'),
            'pause': () => this.showNotification('Pause feature coming soon!', 'info'),
            'help': () => this.showVoiceHelp()
        };

        this.addVoiceUI();
    }

    addVoiceUI() {
        const gameHeader = document.querySelector('.game-header');
        if (gameHeader && this.voiceSupported && !document.querySelector('.voice-section')) {
            const voiceSection = document.createElement('div');
            voiceSection.className = 'voice-section';
            voiceSection.innerHTML = `
                <button id="voiceToggle" class="btn btn-info">
                    <i class="bi bi-mic"></i> Enable Voice Commands
                </button>
                <div id="voiceStatus" class="voice-status" style="display: none;">
                    <span class="status-text">Listening...</span>
                    <div class="voice-animation">🎤</div>
                </div>
            `;
            gameHeader.appendChild(voiceSection);

            document.getElementById('voiceToggle')?.addEventListener('click', this.toggleVoice.bind(this));
        }
    }

    toggleVoice() {
        if (this.voiceEnabled) {
            this.stopVoiceRecognition();
        } else {
            this.startVoiceRecognition();
        }
    }

    startVoiceRecognition() {
        if (!this.voiceSupported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.voiceEnabled = true;
            document.getElementById('voiceToggle').innerHTML = '<i class="bi bi-mic-mute"></i> Disable Voice';
            document.getElementById('voiceStatus').style.display = 'block';
            this.showNotification('Voice commands enabled! 🎤', 'info');
        };

        this.recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            this.processVoiceCommand(command);
        };

        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
        };

        this.recognition.onend = () => {
            if (this.voiceEnabled) {
                this.recognition.start(); // Restart if still enabled
            }
        };

        this.recognition.start();
    }

    stopVoiceRecognition() {
        if (this.recognition) {
            this.voiceEnabled = false;
            this.recognition.stop();
            document.getElementById('voiceToggle').innerHTML = '<i class="bi bi-mic"></i> Enable Voice Commands';
            document.getElementById('voiceStatus').style.display = 'none';
            this.showNotification('Voice commands disabled', 'info');
        }
    }

    processVoiceCommand(command) {
        for (const [trigger, action] of Object.entries(this.voiceCommands)) {
            if (command.includes(trigger)) {
                action();
                this.showNotification(`Voice command: "${trigger}" 🗣️`, 'success');
                return;
            }
        }
        
        console.log('Unrecognized voice command:', command);
    }

    sortByVoice(binType) {
        if (window.game?.isGameActive && window.game.selectedItem) {
            window.game.sortItem(binType);
        }
    }

    showVoiceHelp() {
        const commands = Object.keys(this.voiceCommands).join(', ');
        this.showNotification(`Available commands: ${commands}`, 'info', 5000);
    }

    // Feature 10: Augmented Reality Mode
    setupARMode() {
        if (!this.arSupported) {
            console.warn('Camera access not supported in this browser');
            return;
        }

        this.ar = {
            isActive: false,
            stream: null
        };

        this.addARUI();
    }

    addARUI() {
        if (!this.arSupported) return;

        const gameHeader = document.querySelector('.game-header');
        if (gameHeader && !document.querySelector('.ar-section')) {
            const arSection = document.createElement('div');
            arSection.className = 'ar-section';
            arSection.innerHTML = `
                <button id="arToggle" class="btn btn-warning">
                    <i class="bi bi-camera"></i> AR Mode (Beta)
                </button>
                <div id="arContainer" class="ar-container" style="display: none;">
                    <video id="arVideo" autoplay playsinline style="width: 100%; max-width: 400px; border-radius: 1rem;"></video>
                    <div class="ar-overlay">
                        <div class="ar-instructions">Point camera at objects to sort them!</div>
                        <button id="arCapture" class="btn btn-primary">Capture & Sort</button>
                        <button id="arExit" class="btn btn-secondary">Exit AR</button>
                    </div>
                </div>
            `;
            gameHeader.appendChild(arSection);

            document.getElementById('arToggle')?.addEventListener('click', this.toggleAR.bind(this));
            document.getElementById('arCapture')?.addEventListener('click', this.captureARFrame.bind(this));
            document.getElementById('arExit')?.addEventListener('click', this.exitAR.bind(this));
        }
    }

    async toggleAR() {
        if (this.ar.isActive) {
            this.exitAR();
        } else {
            await this.startAR();
        }
    }

    async startAR() {
        try {
            this.ar.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            const video = document.getElementById('arVideo');
            video.srcObject = this.ar.stream;
            
            document.getElementById('arContainer').style.display = 'block';
            this.ar.isActive = true;
            
            this.showNotification('AR Mode activated! 📷', 'success');
        } catch (error) {
            console.error('AR initialization failed:', error);
            this.showNotification('Camera access denied or unavailable', 'error');
        }
    }

    captureARFrame() {
        // Simulate AR object detection
        const objects = ['plastic bottle', 'banana peel', 'battery', 'paper', 'glass jar'];
        const randomObject = objects[Math.floor(Math.random() * objects.length)];
        
        let binType;
        if (['banana peel', 'apple core'].includes(randomObject)) binType = 'organic';
        else if (['battery', 'phone'].includes(randomObject)) binType = 'hazardous';
        else binType = 'recyclable';
        
        this.showNotification(`Detected: ${randomObject} → ${binType} bin! 🎯`, 'info', 4000);
        
        // Simulate sorting action
        if (window.game?.isGameActive) {
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('correct-sort', {
                    detail: { x: 400, y: 300, points: 50 }
                }));
            }, 1000);
        }
    }

    exitAR() {
        if (this.ar.stream) {
            this.ar.stream.getTracks().forEach(track => track.stop());
            this.ar.stream = null;
        }
        
        document.getElementById('arContainer').style.display = 'none';
        this.ar.isActive = false;
        
        this.showNotification('AR Mode deactivated', 'info');
    }

    // Feature 6: Progressive Difficulty  
    setupProgressiveDifficulty() {
        this.difficulty = {
            baseSpeed: 1000,
            speedIncrease: 0.05,
            complexityThreshold: 50
        };
    }

    calculateDynamicDifficulty(stats) {
        const accuracy = (stats.correctSorts / Math.max(stats.correctSorts + stats.incorrectSorts, 1)) * 100;
        const level = stats.itemsSorted ? Math.floor(stats.itemsSorted / 10) + 1 : 1;
        
        return {
            speed: Math.max(500, this.difficulty.baseSpeed - (level * 50)),
            complexity: level > 5 ? 'high' : level > 2 ? 'medium' : 'low',
            rarityBoost: accuracy > 80 ? 1.5 : accuracy > 60 ? 1.2 : 1.0
        };
    }

    // Feature 7: Real-world Impact Tracker
    setupImpactTracker() {
        this.impact = {
            carbonFootprint: 0,
            waterSaved: 0,
            energySaved: 0,
            landfillDiverted: 0
        };
    }

    calculateRealWorldImpact(itemsSorted) {
        return {
            co2Reduced: itemsSorted * 0.12, // kg CO2 per item
            waterSaved: itemsSorted * 2.8, // liters per item
            energySaved: itemsSorted * 0.6, // kWh per item
            treesEquivalent: itemsSorted * 0.025,
            plasticBottleEquivalent: itemsSorted * 1.3,
            cansEquivalent: itemsSorted * 0.8
        };
    }

    // Enhanced Social Sharing (Feature 8)
    setupSocialSharing() {
        this.social = {
            platforms: {
                twitter: {
                    name: 'Twitter',
                    icon: 'twitter',
                    url: 'https://twitter.com/intent/tweet?text='
                },
                facebook: {
                    name: 'Facebook', 
                    icon: 'facebook',
                    url: 'https://www.facebook.com/sharer/sharer.php?u='
                },
                linkedin: {
                    name: 'LinkedIn',
                    icon: 'linkedin', 
                    url: 'https://www.linkedin.com/sharing/share-offsite/?url='
                }
            }
        };

        this.addSocialUI();
        this.initSocialSharing(); // Keep existing functionality
    }

    addSocialUI() {
        // Add social buttons to profile page
        const profilePage = document.getElementById('profilePage');
        if (profilePage && !document.querySelector('.social-sharing')) {
            const socialSection = document.createElement('div');
            socialSection.className = 'social-sharing';
            socialSection.innerHTML = `
                <h3>📱 Share Your Progress</h3>
                <div class="social-buttons">
                    <button class="btn btn-info" onclick="window.advancedFeatures.shareProgress('twitter')">
                        <i class="bi bi-twitter"></i> Twitter
                    </button>
                    <button class="btn btn-primary" onclick="window.advancedFeatures.shareProgress('facebook')">
                        <i class="bi bi-facebook"></i> Facebook
                    </button>
                    <button class="btn btn-info" onclick="window.advancedFeatures.shareProgress('linkedin')">
                        <i class="bi bi-linkedin"></i> LinkedIn
                    </button>
                    <button class="btn btn-success" onclick="window.advancedFeatures.copyShareText()">
                        <i class="bi bi-clipboard"></i> Copy Text
                    </button>
                </div>
            `;
            profilePage.appendChild(socialSection);
        }
    }

    shareProgress(platform) {
        const stats = window.game?.getStats() || {};
        const shareText = this.generateShareText(stats);
        
        if (this.social.platforms[platform]) {
            const url = this.social.platforms[platform].url + encodeURIComponent(shareText);
            window.open(url, '_blank', 'width=600,height=400');
        }
    }

    generateShareText(stats) {
        const co2Saved = Math.floor((stats.itemsSorted || 0) * 0.1);
        const treesSaved = Math.floor((stats.itemsSorted || 0) * 0.02);
        
        return `🌍 I'm playing EcoSort Challenge and learning waste sorting! ` +
               `I've sorted ${stats.itemsSorted || 0} items, saved ${co2Saved}kg CO₂, ` +
               `and helped save ${treesSaved} trees! 🌱 Join me in making a difference! #EcoSort #Environment`;
    }

    async copyShareText() {
        const stats = window.game?.getStats() || {};
        const text = this.generateShareText(stats);
        
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Share text copied to clipboard! 📋', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Copy failed - please select and copy manually', 'error');
        }
    }

    // Utility methods
    showNotification(message, type = 'info', duration = 3000) {
        if (window.uiManager) {
            window.uiManager.showNotification(message, type, duration);
        } else if (window.showGameNotification) {
            window.showGameNotification(message, type, duration);
        }
    }

    // Feature 1: Daily Challenges
    setupDailyChallenges() {
        this.dailyChallenges = {
            current: null,
            completed: new Set(),
            lastUpdated: null,
            challenges: [
                {
                    id: 'speed_demon',
                    name: '⚡ Speed Demon',
                    description: 'Sort 50 items in under 2 minutes',
                    type: 'speed',
                    target: 50,
                    timeLimit: 120000,
                    reward: { coins: 100, experience: 50 }
                },
                {
                    id: 'perfectionist',
                    name: '🎯 Perfectionist',
                    description: 'Achieve 100% accuracy for 25 consecutive sorts',
                    type: 'accuracy',
                    target: 25,
                    reward: { coins: 150, experience: 75 }
                },
                {
                    id: 'eco_warrior',
                    name: '🌱 Eco Warrior',
                    description: 'Sort 200 organic items today',
                    type: 'category',
                    category: 'organic',
                    target: 200,
                    reward: { coins: 200, experience: 100 }
                },
                {
                    id: 'combo_master',
                    name: '🔥 Combo Master',
                    description: 'Achieve a 15x combo streak',
                    type: 'combo',
                    target: 15,
                    reward: { coins: 120, experience: 60 }
                },
                {
                    id: 'hazard_handler',
                    name: '☢️ Hazard Handler',
                    description: 'Safely sort 30 hazardous items',
                    type: 'category',
                    category: 'hazardous',
                    target: 30,
                    reward: { coins: 180, experience: 90 }
                }
            ]
        };

        this.generateDailyChallenge();
        this.addDailyChallengeUI();
    }

    generateDailyChallenge() {
        const today = new Date().toDateString();
        const savedChallenge = localStorage.getItem('dailyChallenge');
        const savedDate = localStorage.getItem('dailyChallengeDate');

        if (savedDate === today && savedChallenge) {
            this.dailyChallenges.current = JSON.parse(savedChallenge);
        } else {
            // Generate new daily challenge
            const available = this.dailyChallenges.challenges.filter(
                challenge => !this.dailyChallenges.completed.has(challenge.id)
            );
            
            if (available.length === 0) {
                this.dailyChallenges.completed.clear();
            }
            
            const randomChallenge = available[Math.floor(Math.random() * available.length)];
            this.dailyChallenges.current = {
                ...randomChallenge,
                progress: 0,
                startTime: Date.now()
            };

            localStorage.setItem('dailyChallenge', JSON.stringify(this.dailyChallenges.current));
            localStorage.setItem('dailyChallengeDate', today);
        }
    }

    addDailyChallengeUI() {
        const profilePage = document.getElementById('profilePage');
        if (profilePage && !document.querySelector('.daily-challenge')) {
            const challengeSection = document.createElement('div');
            challengeSection.className = 'daily-challenge';
            challengeSection.innerHTML = `
                <h3>🌟 Daily Challenge</h3>
                <div class="challenge-card">
                    <div class="challenge-header">
                        <span class="challenge-name" id="challengeName"></span>
                        <span class="challenge-reward" id="challengeReward"></span>
                    </div>
                    <div class="challenge-description" id="challengeDescription"></div>
                    <div class="challenge-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="challengeProgress"></div>
                        </div>
                        <span class="progress-text" id="challengeProgressText"></span>
                    </div>
                </div>
            `;
            profilePage.appendChild(challengeSection);
            this.updateDailyChallengeUI();
        }
    }

    updateDailyChallengeUI() {
        const challenge = this.dailyChallenges.current;
        if (!challenge) return;

        document.getElementById('challengeName').textContent = challenge.name;
        document.getElementById('challengeDescription').textContent = challenge.description;
        document.getElementById('challengeReward').textContent = `💰${challenge.reward.coins} | ⭐${challenge.reward.experience}`;
        
        const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);
        document.getElementById('challengeProgress').style.width = `${progressPercent}%`;
        document.getElementById('challengeProgressText').textContent = `${challenge.progress}/${challenge.target}`;
    }

    updateChallengeProgress(gameStats, eventType) {
        const challenge = this.dailyChallenges.current;
        if (!challenge || challenge.completed) return;

        let progressMade = false;

        switch (challenge.type) {
            case 'speed':
                if (eventType === 'correct-sort') {
                    challenge.progress++;
                    const timeElapsed = Date.now() - challenge.startTime;
                    if (challenge.progress >= challenge.target && timeElapsed <= challenge.timeLimit) {
                        this.completeChallenge();
                    }
                    progressMade = true;
                }
                break;
            
            case 'accuracy':
                if (eventType === 'correct-sort') {
                    challenge.progress++;
                    progressMade = true;
                } else if (eventType === 'wrong-sort') {
                    challenge.progress = 0; // Reset on mistake
                    progressMade = true;
                }
                break;
            
            case 'combo':
                if (eventType === 'combo-milestone' && gameStats.currentCombo >= challenge.target) {
                    challenge.progress = gameStats.currentCombo;
                    if (challenge.progress >= challenge.target) {
                        this.completeChallenge();
                    }
                    progressMade = true;
                }
                break;
            
            case 'category':
                if (eventType === 'correct-sort' && gameStats.lastSortedCategory === challenge.category) {
                    challenge.progress++;
                    progressMade = true;
                }
                break;
        }

        if (progressMade) {
            this.updateDailyChallengeUI();
            localStorage.setItem('dailyChallenge', JSON.stringify(challenge));
        }

        if (challenge.progress >= challenge.target && !challenge.completed) {
            this.completeChallenge();
        }
    }

    completeChallenge() {
        const challenge = this.dailyChallenges.current;
        if (!challenge) return;

        challenge.completed = true;
        this.dailyChallenges.completed.add(challenge.id);
        
        // Award rewards
        if (window.dataManager) {
            window.dataManager.addCoins(challenge.reward.coins);
            window.dataManager.addExperience(challenge.reward.experience);
        }

        this.showNotification(`🎉 Daily Challenge Complete! +${challenge.reward.coins} coins, +${challenge.reward.experience} XP`, 'success', 5000);
        
        localStorage.setItem('dailyChallenge', JSON.stringify(challenge));
    }

    // Feature 2: Achievement System
    setupAchievementSystem() {
        this.achievements = {
            unlocked: new Set(JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')),
            definitions: [
                {
                    id: 'first_sort',
                    name: '🌱 First Steps',
                    description: 'Sort your first item',
                    type: 'milestone',
                    requirement: { itemsSorted: 1 },
                    reward: { coins: 10, experience: 5 }
                },
                {
                    id: 'century_club',
                    name: '💯 Century Club',
                    description: 'Sort 100 items',
                    type: 'milestone',
                    requirement: { itemsSorted: 100 },
                    reward: { coins: 100, experience: 50 }
                },
                {
                    id: 'thousand_master',
                    name: '🏆 Thousand Master',
                    description: 'Sort 1,000 items',
                    type: 'milestone',
                    requirement: { itemsSorted: 1000 },
                    reward: { coins: 500, experience: 250 }
                },
                {
                    id: 'accuracy_expert',
                    name: '🎯 Accuracy Expert',
                    description: 'Maintain 95% accuracy over 50 sorts',
                    type: 'skill',
                    requirement: { accuracy: 95, minSorts: 50 },
                    reward: { coins: 200, experience: 100 }
                },
                {
                    id: 'speed_racer',
                    name: '⚡ Speed Racer',
                    description: 'Sort 10 items in under 30 seconds',
                    type: 'challenge',
                    requirement: { itemsInTime: 10, timeLimit: 30000 },
                    reward: { coins: 150, experience: 75 }
                },
                {
                    id: 'eco_champion',
                    name: '🌍 Eco Champion',
                    description: 'Save the equivalent of 100kg CO₂',
                    type: 'impact',
                    requirement: { co2Saved: 100 },
                    reward: { coins: 300, experience: 150 }
                },
                {
                    id: 'streak_master',
                    name: '🔥 Streak Master',
                    description: 'Achieve a 20x combo streak',
                    type: 'combo',
                    requirement: { maxCombo: 20 },
                    reward: { coins: 250, experience: 125 }
                },
                {
                    id: 'daily_dedication',
                    name: '📅 Daily Dedication',
                    description: 'Play the game for 7 consecutive days',
                    type: 'streak',
                    requirement: { loginStreak: 7 },
                    reward: { coins: 400, experience: 200 }
                }
            ]
        };

        this.addAchievementUI();
    }

    addAchievementUI() {
        const achievementsPage = document.getElementById('achievementsPage');
        if (achievementsPage && !document.querySelector('.achievement-grid')) {
            achievementsPage.innerHTML = `
                <div class="page-header">
                    <h2>🏆 Achievements</h2>
                    <p>Track your progress and unlock rewards!</p>
                </div>
                <div class="achievement-stats">
                    <div class="stat-card">
                        <div class="stat-number" id="achievementsUnlocked">0</div>
                        <div class="stat-label">Unlocked</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="totalAchievements">0</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="completionPercent">0%</div>
                        <div class="stat-label">Complete</div>
                    </div>
                </div>
                <div class="achievement-grid" id="achievementGrid"></div>
            `;
            
            this.updateAchievementUI();
        }
    }

    updateAchievementUI() {
        const grid = document.getElementById('achievementGrid');
        if (!grid) return;

        let html = '';
        this.achievements.definitions.forEach(achievement => {
            const isUnlocked = this.achievements.unlocked.has(achievement.id);
            html += `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${isUnlocked ? achievement.name.split(' ')[0] : '🔒'}</div>
                    <div class="achievement-info">
                        <h4 class="achievement-name">${isUnlocked ? achievement.name : '???'}</h4>
                        <p class="achievement-description">${isUnlocked ? achievement.description : 'Complete more challenges to unlock'}</p>
                        ${isUnlocked ? `<div class="achievement-reward">💰${achievement.reward.coins} | ⭐${achievement.reward.experience}</div>` : ''}
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;

        // Update stats
        const unlocked = this.achievements.unlocked.size;
        const total = this.achievements.definitions.length;
        const percent = Math.round((unlocked / total) * 100);

        document.getElementById('achievementsUnlocked').textContent = unlocked;
        document.getElementById('totalAchievements').textContent = total;
        document.getElementById('completionPercent').textContent = `${percent}%`;
    }

    checkAchievements(gameStats) {
        this.achievements.definitions.forEach(achievement => {
            if (this.achievements.unlocked.has(achievement.id)) return;

            let unlocked = false;

            switch (achievement.type) {
                case 'milestone':
                    if (gameStats.itemsSorted >= achievement.requirement.itemsSorted) {
                        unlocked = true;
                    }
                    break;
                
                case 'skill':
                    const accuracy = (gameStats.correctSorts / Math.max(gameStats.correctSorts + gameStats.incorrectSorts, 1)) * 100;
                    if (accuracy >= achievement.requirement.accuracy && 
                        (gameStats.correctSorts + gameStats.incorrectSorts) >= achievement.requirement.minSorts) {
                        unlocked = true;
                    }
                    break;
                
                case 'combo':
                    if (gameStats.maxCombo >= achievement.requirement.maxCombo) {
                        unlocked = true;
                    }
                    break;
                
                case 'impact':
                    const impact = this.calculateRealWorldImpact(gameStats.itemsSorted);
                    if (impact.co2Reduced >= achievement.requirement.co2Saved) {
                        unlocked = true;
                    }
                    break;
            }

            if (unlocked) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.achievements.unlocked.add(achievement.id);
        
        // Save to localStorage
        localStorage.setItem('unlockedAchievements', JSON.stringify([...this.achievements.unlocked]));
        
        // Award rewards
        if (window.dataManager) {
            window.dataManager.addCoins(achievement.reward.coins);
            window.dataManager.addExperience(achievement.reward.experience);
        }

        // Show notification
        this.showNotification(`🏆 Achievement Unlocked: ${achievement.name}! +${achievement.reward.coins} coins, +${achievement.reward.experience} XP`, 'success', 5000);
        
        // Update UI
        this.updateAchievementUI();
    }

  // Daily Tips System (keeping existing functionality)
  checkDailyTip() {
    const today = new Date().toDateString();
    const lastTipDate = localStorage.getItem('lastDailyTip');
    
    if (lastTipDate !== today) {
      setTimeout(() => {
        this.showDailyTip();
        localStorage.setItem('lastDailyTip', today);
      }, 2000);
    }
  }

  showDailyTip() {
    const tips = [
      {
        title: "🌱 Composting Tip",
        content: "Coffee grounds are excellent for composting! They add nitrogen to your compost and help it break down faster.",
        category: "organic"
      },
      {
        title: "♻️ Recycling Fact", 
        content: "One recycled aluminum can saves enough energy to run a TV for 3 hours!",
        category: "recyclable"
      },
      {
        title: "🔋 E-Waste Alert",
        content: "Never throw batteries in regular trash! They contain toxic materials that can leach into groundwater.",
        category: "hazardous"
      },
      {
        title: "🌍 Environmental Impact",
        content: "The average person generates 4.5 pounds of waste per day. Small changes in your habits can make a big difference!",
        category: "general"
      },
      {
        title: "💡 Energy Saving",
        content: "Recycling one plastic bottle can save enough energy to power a 60-watt light bulb for 3 hours.",
        category: "recyclable"
      }
    ];

    const todaysTip = tips[Math.floor(Math.random() * tips.length)];
    
    const tipModal = document.createElement('div');
    tipModal.className = 'daily-tip-modal';
    tipModal.innerHTML = `
      <div class="daily-tip-content">
        <div class="tip-header">
          <h3>💡 Daily Eco Tip</h3>
          <button class="close-tip" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
        </div>
        <div class="tip-body">
          <div class="tip-icon">${this.getCategoryIcon(todaysTip.category)}</div>
          <h4>${todaysTip.title}</h4>
          <p>${todaysTip.content}</p>
          <div class="tip-actions">
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">Thanks!</button>
            <button class="btn btn-secondary" onclick="AdvancedFeatures.shareTip('${todaysTip.title}', '${todaysTip.content}')">Share Tip</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(tipModal);
    
    // Add entrance animation
    tipModal.style.animation = 'fadeIn 0.5s ease-out';
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (tipModal.parentElement) {
        tipModal.style.animation = 'fadeOut 0.5s ease-in';
        setTimeout(() => tipModal.remove(), 500);
      }
    }, 15000);
  }

  getCategoryIcon(category) {
    const icons = {
      organic: '🌱',
      recyclable: '♻️', 
      hazardous: '⚠️',
      general: '🌍'
    };
    return icons[category] || '💡';
  }

  // Social Sharing System
  initSocialSharing() {
    // Add sharing capabilities to the game
    window.shareScore = (score, level, environmentalImpact) => {
      this.shareGameResults(score, level, environmentalImpact);
    };
    
    window.shareTip = (title, content) => {
      this.shareTip(title, content);
    };
  }

  shareGameResults(score, level, environmentalImpact) {
    const shareText = `🌍 I just scored ${score.toLocaleString()} points and reached level ${level} in EcoSort Challenge! I've helped save ${Math.floor(environmentalImpact.treesSaved)} trees and ${Math.floor(environmentalImpact.waterSaved)} gallons of water through proper waste sorting! 🌱♻️`;
    
    const shareUrl = window.location.href;
    
    // Try native sharing first (mobile)
    if (navigator.share) {
      navigator.share({
        title: 'EcoSort Challenge - My Results',
        text: shareText,
        url: shareUrl
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback to clipboard and social media links
      this.showSocialShareModal(shareText, shareUrl);
    }
  }

  shareTip(title, content) {
    const shareText = `💡 ${title}: ${content} - Learn more at EcoSort Challenge! 🌍`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: shareText,
        url: shareUrl
      }).catch(err => console.log('Error sharing:', err));
    } else {
      this.showSocialShareModal(shareText, shareUrl);
    }
  }

  showSocialShareModal(text, url) {
    const modal = document.createElement('div');
    modal.className = 'social-share-modal';
    
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    
    modal.innerHTML = `
      <div class="social-share-content">
        <div class="share-header">
          <h3>📤 Share Your Achievement</h3>
          <button class="close-share" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
        </div>
        <div class="share-body">
          <div class="share-text">
            <textarea readonly>${text}</textarea>
            <button class="copy-text-btn" onclick="AdvancedFeatures.copyToClipboard('${text}')">📋 Copy Text</button>
          </div>
          <div class="share-buttons">
            <a href="https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}" target="_blank" class="share-btn twitter">
              🐦 Twitter
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}" target="_blank" class="share-btn facebook">
              📘 Facebook
            </a>
            <a href="https://wa.me/?text=${encodedText}%20${encodedUrl}" target="_blank" class="share-btn whatsapp">
              💬 WhatsApp
            </a>
            <button class="share-btn email" onclick="AdvancedFeatures.shareViaEmail('${text}', '${url}')">
              📧 Email
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.animation = 'fadeIn 0.3s ease-out';
  }

  static copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Show success message
      const message = document.createElement('div');
      message.className = 'copy-success';
      message.textContent = '✅ Copied to clipboard!';
      message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #22c55e;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        z-index: 3000;
        font-weight: 600;
      `;
      document.body.appendChild(message);
      
      setTimeout(() => message.remove(), 2000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
      alert('Failed to copy to clipboard. Please copy manually.');
    });
  }

  static shareViaEmail(text, url) {
    const subject = encodeURIComponent('Check out my EcoSort Challenge results!');
    const body = encodeURIComponent(`${text}\n\nPlay the game at: ${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  // Simple Leaderboard System (local storage based)
  saveScore(playerName, score, level, environmentalImpact) {
    const scoreEntry = {
      name: playerName || 'Anonymous',
      score: score,
      level: level,
      environmentalImpact: environmentalImpact,
      date: new Date().toISOString(),
      id: Date.now()
    };

    let leaderboard = JSON.parse(localStorage.getItem('ecoSortLeaderboard') || '[]');
    leaderboard.push(scoreEntry);
    
    // Keep only top 50 scores
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 50);
    
    localStorage.setItem('ecoSortLeaderboard', JSON.stringify(leaderboard));
    
    return leaderboard.findIndex(entry => entry.id === scoreEntry.id) + 1; // Return rank
  }

  showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('ecoSortLeaderboard') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'leaderboard-modal';
    modal.innerHTML = `
      <div class="leaderboard-content">
        <div class="leaderboard-header">
          <h3>🏆 Local Leaderboard</h3>
          <button class="close-leaderboard" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
        </div>
        <div class="leaderboard-body">
          ${leaderboard.length === 0 ? 
            '<p class="no-scores">No scores yet. Be the first to play!</p>' :
            `<div class="leaderboard-list">
              ${leaderboard.slice(0, 10).map((entry, index) => `
                <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}">
                  <span class="rank">${this.getRankEmoji(index + 1)} #${index + 1}</span>
                  <span class="player-name">${entry.name}</span>
                  <span class="score">${entry.score.toLocaleString()}</span>
                  <span class="level">Lv.${entry.level}</span>
                  <span class="impact">🌳${Math.floor(entry.environmentalImpact.treesSaved)}</span>
                </div>
              `).join('')}
            </div>`
          }
          <div class="leaderboard-actions">
            <button class="btn btn-secondary" onclick="AdvancedFeatures.clearLeaderboard()">🗑️ Clear All</button>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.animation = 'fadeIn 0.3s ease-out';
  }

  getRankEmoji(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  }

  static clearLeaderboard() {
    if (confirm('Are you sure you want to clear all leaderboard data? This cannot be undone.')) {
      localStorage.removeItem('ecoSortLeaderboard');
      document.querySelector('.leaderboard-modal').remove();
    }
  }

  // Statistics and Analytics
  getGameStatistics() {
    const gameData = JSON.parse(localStorage.getItem('wasteGameData') || '{}');
    const leaderboard = JSON.parse(localStorage.getItem('ecoSortLeaderboard') || '[]');
    
    return {
      totalGames: gameData.totalGamesPlayed || 0,
      bestScore: leaderboard.length > 0 ? Math.max(...leaderboard.map(entry => entry.score)) : 0,
      totalTreesSaved: leaderboard.reduce((sum, entry) => sum + (entry.environmentalImpact.treesSaved || 0), 0),
      totalWaterSaved: leaderboard.reduce((sum, entry) => sum + (entry.environmentalImpact.waterSaved || 0), 0),
      averageScore: leaderboard.length > 0 ? 
        Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length) : 0
    };
  }

  // Daily Challenge System (simple implementation)
  getDailyChallenge() {
    const today = new Date().toDateString();
    const challenges = [
      { name: "Speed Demon", description: "Score 500+ points in Speed Challenge mode", mode: "speed", target: 500 },
      { name: "Accuracy Expert", description: "Complete a game with 90%+ accuracy", mode: "any", target: 90 },
      { name: "Streak Master", description: "Achieve a 15+ item streak", mode: "any", target: 15 },
      { name: "Eco Warrior", description: "Save 5+ trees in one game", mode: "any", target: 5 },
      { name: "Level Climber", description: "Reach level 8 or higher", mode: "any", target: 8 }
    ];
    
    // Use date as seed for consistent daily challenge
    const seed = today.split(' ').join('').length;
    const todaysChallenge = challenges[seed % challenges.length];
    
    return {
      ...todaysChallenge,
      date: today,
      completed: this.isDailyChallengeCompleted(today, todaysChallenge)
    };
  }

  isDailyChallengeCompleted(date, challenge) {
    const completed = JSON.parse(localStorage.getItem('dailyChallengeCompleted') || '{}');
    return completed[date] === challenge.name;
  }

  completeDailyChallenge(challengeName) {
    const today = new Date().toDateString();
    const completed = JSON.parse(localStorage.getItem('dailyChallengeCompleted') || '{}');
    completed[today] = challengeName;
    localStorage.setItem('dailyChallengeCompleted', JSON.stringify(completed));
    
    // Show completion message
    const message = document.createElement('div');
    message.className = 'challenge-completed';
    message.innerHTML = `
      <div class="challenge-notification">
        <h4>🎉 Daily Challenge Complete!</h4>
        <p>You've completed: ${challengeName}</p>
        <p>Bonus: +100 XP</p>
      </div>
    `;
    
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 4000);
  }

  // Show daily challenge modal
  showDailyChallenge() {
    const challenge = this.getDailyChallenge();
    
    const modal = document.createElement('div');
    modal.className = 'daily-tip-modal'; // Reuse the daily tip modal styling
    modal.innerHTML = `
      <div class="daily-tip-content">
        <div class="tip-header" style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);"> 
          <h3>⚡ Today's Daily Challenge</h3>
          <button class="close-tip" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
        </div>
        <div class="tip-body">
          <div class="tip-icon">${challenge.completed ? '✅' : '🎯'}</div>
          <h4>${challenge.name}</h4>
          <p><strong>Goal:</strong> ${challenge.description}</p>
          ${challenge.mode !== 'any' ? `<p><strong>Mode:</strong> ${challenge.mode.charAt(0).toUpperCase() + challenge.mode.slice(1)} Mode</p>` : ''}
          <p><strong>Target:</strong> ${challenge.target}${challenge.name.includes('Accuracy') ? '%' : ''}</p>
          <div class="challenge-status">
            ${challenge.completed ? 
              '<p style="color: #22c55e; font-weight: bold;">✅ Challenge Complete! Well done!</p>' : 
              '<p style="color: #f59e0b; font-weight: bold;">🎯 Challenge Active - Good luck!</p>'
            }
          </div>
          <div class="tip-actions">
            ${!challenge.completed ? 
              '<a href="index.html" class="btn btn-primary">🎮 Start Game</a>' : 
              '<button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">Great!</button>'
            }
            <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.animation = 'fadeIn 0.3s ease-out';
  }
}

// Global instance - expose both naming conventions
window.advancedFeatures = new AdvancedFeatures();
window.AdvancedFeatures = window.advancedFeatures;

// Global function for home page button
window.showDailyChallenge = function() {
  if (window.advancedFeatures) {
    window.advancedFeatures.showDailyChallenge();
  }
};

// Add leaderboard and sharing buttons to game over modal
document.addEventListener('DOMContentLoaded', () => {
  // Enhance game over modal with sharing
  const originalShowGameOverModal = window.showGameOverModal;
  if (originalShowGameOverModal) {
    window.showGameOverModal = function(gameData) {
      originalShowGameOverModal(gameData);
      
      // Add sharing and leaderboard buttons
      setTimeout(() => {
        const modal = document.querySelector('.game-over-modal');
        if (modal) {
          const actions = modal.querySelector('.game-over-actions');
          if (actions) {
            actions.insertAdjacentHTML('beforeend', `
              <button class="btn btn-info" onclick="window.shareScore(${gameData?.score || 0}, ${gameData?.level || 1}, ${JSON.stringify(gameData?.environmentalImpact || {})})">📤 Share Results</button>
              <button class="btn btn-secondary" onclick="AdvancedFeatures.showLeaderboard()">🏆 Leaderboard</button>
            `);
          }
        }
      }, 100);
    };
  }
});

console.log('🚀 Advanced Features system loaded successfully!');