// ===========================================
// 🌍 ECOSORT CHALLENGE - CORE GAME ENGINE
// Enhanced and optimized game logic
// ===========================================

class EcoSortGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.lives = 3;
        this.timeLeft = 60;
        this.isGameActive = false;
        this.currentItems = [];
        this.selectedItem = null;
        this.itemsToShow = 3; // Show 3 items at once
        this.gameMode = 'time_trial';
        
        // Power-ups
        this.powerUps = {
            timeFreeze: { count: 0, duration: 5000 },
            doublePoints: { count: 0, duration: 10000 },
            showHints: { count: 0, uses: 3 },
            skipItem: { count: 0, uses: 2 },
            extraLife: { count: 0, uses: 1 }
        };
        
        // Active effects
        this.activeEffects = new Set();
        
        // Audio settings
        this.audioEnabled = true;
        this.soundEffects = {};
        
        // Statistics
        this.stats = {
            gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0,
            totalScore: parseInt(localStorage.getItem('totalScore')) || 0,
            bestScore: parseInt(localStorage.getItem('bestScore')) || 0,
            itemsSorted: parseInt(localStorage.getItem('itemsSorted')) || 0,
            correctSorts: parseInt(localStorage.getItem('correctSorts')) || 0,
            incorrectSorts: parseInt(localStorage.getItem('incorrectSorts')) || 0,
            streakRecord: parseInt(localStorage.getItem('streakRecord')) || 0,
            totalPlayTime: parseInt(localStorage.getItem('totalPlayTime')) || 0
        };
        
        // Initialize game
        this.initializeWasteItems();
        this.initializeAudio();
        this.setupEventListeners();
    }

    // Initialize waste items data
    initializeWasteItems() {
        this.wasteItems = [
            // Common Items (60% spawn rate)
            { id: 1, name: 'Apple Core', icon: '🍎', type: 'organic', points: 10, rarity: 'common', description: 'Biodegradable fruit waste' },
            { id: 2, name: 'Plastic Bottle', icon: '🍼', type: 'recyclable', points: 15, rarity: 'common', description: 'PET plastic container' },
            { id: 3, name: 'Banana Peel', icon: '🍌', type: 'organic', points: 10, rarity: 'common', description: 'Natural compostable waste' },
            { id: 4, name: 'Soda Can', icon: '🥤', type: 'recyclable', points: 20, rarity: 'common', description: 'Aluminum beverage container' },
            { id: 5, name: 'Coffee Grounds', icon: '☕', type: 'organic', points: 10, rarity: 'common', description: 'Compostable coffee waste' },
            { id: 6, name: 'Glass Jar', icon: '🏺', type: 'recyclable', points: 25, rarity: 'common', description: 'Reusable glass container' },
            { id: 7, name: 'Paper Bag', icon: '🛍️', type: 'recyclable', points: 12, rarity: 'common', description: 'Recyclable paper packaging' },
            { id: 8, name: 'Orange Peel', icon: '🍊', type: 'organic', points: 10, rarity: 'common', description: 'Citrus compostable waste' },
            
            // Uncommon Items (25% spawn rate)
            { id: 9, name: 'Pizza Box', icon: '📦', type: 'recyclable', points: 18, rarity: 'uncommon', description: 'Cardboard food container' },
            { id: 10, name: 'Egg Shells', icon: '🥚', type: 'organic', points: 15, rarity: 'uncommon', description: 'Calcium-rich compost material' },
            { id: 11, name: 'Wine Bottle', icon: '🍾', type: 'recyclable', points: 30, rarity: 'uncommon', description: 'Dark glass container' },
            { id: 12, name: 'Tea Leaves', icon: '🍃', type: 'organic', points: 12, rarity: 'uncommon', description: 'Organic plant matter' },
            { id: 13, name: 'Cereal Box', icon: '📮', type: 'recyclable', points: 22, rarity: 'uncommon', description: 'Cardboard packaging' },
            { id: 14, name: 'Vegetable Scraps', icon: '🥕', type: 'organic', points: 15, rarity: 'uncommon', description: 'Kitchen compost material' },
            
            // Rare Items (10% spawn rate)
            { id: 15, name: 'Battery', icon: '🔋', type: 'hazardous', points: 50, rarity: 'rare', description: 'Toxic electronic waste' },
            { id: 16, name: 'Smartphone', icon: '📱', type: 'hazardous', points: 100, rarity: 'rare', description: 'E-waste requiring special handling' },
            { id: 17, name: 'Paint Can', icon: '🎨', type: 'hazardous', points: 75, rarity: 'rare', description: 'Chemical waste container' },
            { id: 18, name: 'Light Bulb', icon: '💡', type: 'hazardous', points: 60, rarity: 'rare', description: 'Special disposal required' },
            { id: 19, name: 'Motor Oil', icon: '🛢️', type: 'hazardous', points: 80, rarity: 'rare', description: 'Automotive hazardous waste' },
            
            // Epic Items (4% spawn rate)
            { id: 20, name: 'Computer Monitor', icon: '🖥️', type: 'hazardous', points: 150, rarity: 'epic', description: 'Large electronic waste' },
            { id: 21, name: 'Car Tire', icon: '⚙️', type: 'hazardous', points: 120, rarity: 'epic', description: 'Rubber automotive waste' },
            { id: 22, name: 'Aerosol Can', icon: '💨', type: 'hazardous', points: 100, rarity: 'epic', description: 'Pressurized chemical container' },
            
            // More Common Items
            { id: 26, name: 'Potato Peels', icon: '🥔', type: 'organic', points: 10, rarity: 'common', description: 'Vegetable kitchen scraps' },
            { id: 27, name: 'Milk Carton', icon: '🥛', type: 'recyclable', points: 15, rarity: 'common', description: 'Paper-based container' },
            { id: 28, name: 'Bread Crusts', icon: '🍞', type: 'organic', points: 10, rarity: 'common', description: 'Food waste for composting' },
            { id: 29, name: 'Tin Can', icon: '🥫', type: 'recyclable', points: 20, rarity: 'common', description: 'Metal food container' },
            { id: 30, name: 'Lettuce Leaves', icon: '🥬', type: 'organic', points: 10, rarity: 'common', description: 'Leafy green vegetable waste' },
            { id: 31, name: 'Water Bottle', icon: '💧', type: 'recyclable', points: 15, rarity: 'common', description: 'Plastic beverage container' },
            { id: 32, name: 'Tomato Skin', icon: '🍅', type: 'organic', points: 10, rarity: 'common', description: 'Fruit/vegetable compost material' },
            { id: 33, name: 'Magazine', icon: '📖', type: 'recyclable', points: 12, rarity: 'common', description: 'Printed paper material' },
            
            // More Uncommon Items
            { id: 34, name: 'Yogurt Container', icon: '🧈', type: 'recyclable', points: 18, rarity: 'uncommon', description: 'Plastic dairy container' },
            { id: 35, name: 'Fish Bones', icon: '🐟', type: 'organic', points: 15, rarity: 'uncommon', description: 'Animal protein waste' },
            { id: 36, name: 'Shampoo Bottle', icon: '🧴', type: 'recyclable', points: 22, rarity: 'uncommon', description: 'Personal care container' },
            { id: 37, name: 'Flower Petals', icon: '🌸', type: 'organic', points: 12, rarity: 'uncommon', description: 'Garden organic matter' },
            { id: 38, name: 'Aluminum Foil', icon: '📄', type: 'recyclable', points: 25, rarity: 'uncommon', description: 'Metal food wrap' },
            
            // More Rare Items
            { id: 39, name: 'Cleaning Spray', icon: '🧽', type: 'hazardous', points: 60, rarity: 'rare', description: 'Chemical cleaning product' },
            { id: 40, name: 'Laptop', icon: '💻', type: 'hazardous', points: 120, rarity: 'rare', description: 'Electronic waste with battery' },
            { id: 41, name: 'Nail Polish', icon: '💅', type: 'hazardous', points: 45, rarity: 'rare', description: 'Cosmetic chemical waste' },
            { id: 42, name: 'Thermometer', icon: '🌡️', type: 'hazardous', points: 70, rarity: 'rare', description: 'Mercury-containing device' },
            
            // Epic Items
            { id: 43, name: 'Car Battery', icon: '🔋', type: 'hazardous', points: 180, rarity: 'epic', description: 'Large automotive battery' },
            { id: 44, name: 'Printer', icon: '🖨️', type: 'hazardous', points: 140, rarity: 'epic', description: 'Electronic office equipment' },
            
            // Legendary Items (1% spawn rate)
            { id: 23, name: 'Nuclear Waste', icon: '☢️', type: 'hazardous', points: 500, rarity: 'legendary', description: 'Extremely dangerous radioactive material' },
            { id: 24, name: 'Medical Waste', icon: '🏥', type: 'hazardous', points: 300, rarity: 'legendary', description: 'Biohazardous medical materials' },
            { id: 25, name: 'Industrial Chemical', icon: '⚗️', type: 'hazardous', points: 400, rarity: 'legendary', description: 'Dangerous industrial compound' }
        ];

        // Bin configurations
        this.bins = {
            organic: {
                name: 'Organic Waste',
                icon: '🗂️',
                description: 'Food scraps, garden waste',
                color: '#22c55e',
                shortcut: 'Q'
            },
            recyclable: {
                name: 'Recyclable',
                icon: '♻️',
                description: 'Plastic, glass, paper, metal',
                color: '#3b82f6',
                shortcut: 'W'
            },
            hazardous: {
                name: 'Hazardous Waste',
                icon: '🛑',
                description: 'Toxic, electronic, chemical',
                color: '#ef4444',
                shortcut: 'E'
            }
        };
    }

    // Initialize audio system
    initializeAudio() {
        this.soundEffects = {
            correct: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dto2MdBShgEPn1xHIlBSaNy+f1kjMIF2+z4NyrUQv'), // Success sound
            wrong: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dto2MdBShgEPn1xHIlBSaNy+f1kjMIF2+z4NyrUQwQ') // Error sound
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.isGameActive) return;
            
            switch(e.key.toLowerCase()) {
                case 'q':
                    this.sortItem('organic');
                    break;
                case 'w':
                    this.sortItem('recyclable');
                    break;
                case 'e':
                    this.sortItem('hazardous');
                    break;
                case ' ':
                    e.preventDefault();
                    this.selectCurrentItem();
                    break;
                case 'h':
                    this.activatePowerUp('showHints');
                    break;
                case 's':
                    this.activatePowerUp('skipItem');
                    break;
            }
        });

        // Setup bin interactions after DOM is ready
        this.setupBinInteractions();

        // Store reference to this for event handler
        const gameInstance = this;
        
        // Item click handlers
        document.addEventListener('click', function(e) {
            const wasteItem = e.target.closest('.waste-item');
            console.log('Click detected on:', e.target, 'Waste item found:', !!wasteItem, 'Game active:', gameInstance.isGameActive);
            
            if (wasteItem) {
                const itemId = wasteItem.dataset.itemId;
                console.log('Item clicked - ID:', itemId, 'Available items:', gameInstance.currentItems?.map(i => ({ id: i.uniqueId, name: i.name })));
                
                if (itemId && gameInstance.currentItems && gameInstance.currentItems.length > 0) {
                    gameInstance.selectItem(itemId);
                } else {
                    console.warn('Cannot select item - missing ID or no current items');
                }
            }
        });
    }

    // Start new game
    startGame(mode = 'time_trial') {
        this.gameMode = mode;
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.lives = mode === 'survival' ? 3 : Infinity;
        this.timeLeft = this.getInitialTime(mode);
        this.isGameActive = true;
        this.activeEffects.clear();
        
        this.stats.gamesPlayed++;
        this.saveStats();
        
        this.updateDisplay();
        this.generateNewItems();
        
        if (mode === 'time_trial' || mode === 'blitz') {
            this.startTimer();
        }
        
        // Show drag instructions for first-time users
        this.showDragInstructions();
        
        this.showMessage('Game Started! 🎮', 'info');
        
        // Dispatch game start event
        document.dispatchEvent(new CustomEvent('game-start', {
            detail: { mode: this.gameMode, timeLeft: this.timeLeft }
        }));
    }

    // Get initial time based on mode
    getInitialTime(mode) {
        switch(mode) {
            case 'time_trial': return 60;
            case 'blitz': return 30;
            case 'marathon': return 180;
            default: return 60;
        }
    }

    // Start game timer
    startTimer() {
        this.gameTimer = setInterval(() => {
            if (this.activeEffects.has('timeFreeze')) {
                return; // Don't decrease time during freeze
            }
            
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            } else if (this.timeLeft <= 10 && this.timeLeft > 0) {
                // Only show countdown at specific intervals to avoid spam
                if (this.timeLeft === 10 || this.timeLeft === 5 || this.timeLeft <= 3) {
                    this.showMessage(`⏰ ${this.timeLeft} seconds left!`, 'warning', 1500);
                }
            }
        }, 1000);
    }

    // Generate new items (multiple at once)
    generateNewItems() {
        this.currentItems = [];
        
        for (let i = 0; i < this.itemsToShow; i++) {
            // Determine rarity based on level
            let rarity;
            const rarityRoll = Math.random() * 100;
            
            if (rarityRoll < 1) rarity = 'legendary';
            else if (rarityRoll < 5) rarity = 'epic';
            else if (rarityRoll < 15) rarity = 'rare';
            else if (rarityRoll < 40) rarity = 'uncommon';
            else rarity = 'common';
            
            // Filter items by rarity
            const availableItems = this.wasteItems.filter(item => item.rarity === rarity);
            const selectedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
            
            // Add level-based point multiplier and unique ID
            const item = {
                ...selectedItem,
                displayPoints: Math.floor(selectedItem.points * (1 + (this.level - 1) * 0.1)),
                uniqueId: Date.now() + Math.random() * 1000 + i // More unique identifier
            };
            
            this.currentItems.push(item);
        }
        
        this.displayCurrentItems();
    }

    // Display current items (multiple at once)
    displayCurrentItems() {
        const container = document.querySelector('.current-items-container');
        if (!container) return;
        
        container.innerHTML = this.currentItems.map((item, index) => `
            <div class="waste-item ${this.selectedItem?.uniqueId === item.uniqueId ? 'selected' : ''}" 
                 data-item-id="${item.uniqueId}"
                 data-item-type="${item.type}"
                 draggable="true"
                 data-touch-id="${item.uniqueId}">
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-points">+${item.displayPoints} pts</div>
                <div class="item-type">${item.type}</div>
                <div class="item-rarity rarity-${item.rarity}">${item.rarity}</div>
                ${this.activeEffects.has('showHints') ? 
                    `<div class="item-hint">🔍 Bin: ${this.bins[item.type].name}</div>` : 
''}
            </div>
        `).join('');
        
        // Add drag and drop event listeners
        this.setupDragAndDrop();
    }

    // Setup drag and drop functionality
    setupDragAndDrop() {
        // Wait a bit to ensure DOM is ready
        setTimeout(() => {
            // Remove any existing event listeners first
            this.removeDragListeners();
            
            // Add dragstart event listeners to waste items
            const wasteItems = document.querySelectorAll('.waste-item');
            
            wasteItems.forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    const itemId = e.target.dataset.itemId;
                    const itemType = e.target.dataset.itemType;
                    e.dataTransfer.setData('text/plain', itemId);
                    e.dataTransfer.setData('item-type', itemType);
                    e.target.classList.add('dragging');
                    
                    // Auto-select the item being dragged
                    this.selectItem(itemId);
                });
                
                item.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                });
                
                // Touch event handlers for mobile
                item.addEventListener('touchstart', (e) => {
                    const itemId = e.target.closest('.waste-item').dataset.touchId;
                    this.handleTouchStart(e, itemId);
                });
                
                item.addEventListener('touchmove', (e) => {
                    this.handleTouchMove(e);
                });
                
                item.addEventListener('touchend', (e) => {
                    this.handleTouchEnd(e);
                });
            });
    
            // Setup drop zones (bins)
            const bins = document.querySelectorAll('.bin');
            
            bins.forEach(bin => {
                bin.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    bin.classList.add('drag-over');
                });
                
                bin.addEventListener('dragleave', (e) => {
                    bin.classList.remove('drag-over');
                });
                
                bin.addEventListener('drop', (e) => {
                    e.preventDefault();
                    bin.classList.remove('drag-over');
                    
                    const itemId = e.dataTransfer.getData('text/plain');
                    const itemType = e.dataTransfer.getData('item-type');
                    
                    // Get bin type from class names
                    let binType = 'organic';
                    if (bin.classList.contains('recyclable-bin')) binType = 'recyclable';
                    else if (bin.classList.contains('hazardous-bin')) binType = 'hazardous';
                    
                    // Process the sort
                    this.sortItem(binType);
                });
            });
        }, 100);
    }
    
    // Remove existing drag listeners to prevent duplicates
    removeDragListeners() {
        // This will be handled by replacing innerHTML, but we add this for clarity
        document.querySelectorAll('.waste-item').forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });
    }

    // Touch handling for mobile devices
    handleTouchStart(event, itemId) {
        event.preventDefault();
        this.touchData = {
            itemId: itemId,
            startX: event.touches[0].clientX,
            startY: event.touches[0].clientY,
            element: event.target.closest('.waste-item')
        };
        
        // Auto-select the item
        this.selectItem(itemId);
        
        // Add visual feedback
        this.touchData.element.classList.add('touch-dragging');
    }

    handleTouchMove(event) {
        if (!this.touchData) return;
        event.preventDefault();
        
        const touch = event.touches[0];
        const deltaX = touch.clientX - this.touchData.startX;
        const deltaY = touch.clientY - this.touchData.startY;
        
        // Move the element with the touch
        this.touchData.element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.1)`;
        this.touchData.element.style.zIndex = '1000';
        
        // Highlight bins on hover
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Remove previous highlights
        document.querySelectorAll('.bin').forEach(bin => {
            bin.classList.remove('drag-over');
        });
        
        // Add highlight to current bin
        const bin = elementBelow?.closest('.bin');
        if (bin) {
            bin.classList.add('drag-over');
        }
    }

    handleTouchEnd(event) {
        if (!this.touchData) return;
        event.preventDefault();
        
        const touch = event.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const bin = elementBelow?.closest('.bin');
        
        // Reset element position and styling
        this.touchData.element.style.transform = '';
        this.touchData.element.style.zIndex = '';
        this.touchData.element.classList.remove('touch-dragging');
        
        // Remove all drag-over highlights
        document.querySelectorAll('.bin').forEach(b => {
            b.classList.remove('drag-over');
        });
        
        // Process drop if over a bin
        if (bin) {
            let binType = 'organic';
            if (bin.classList.contains('recyclable-bin')) binType = 'recyclable';
            else if (bin.classList.contains('hazardous-bin')) binType = 'hazardous';
            
            this.sortItem(binType);
        }
        
        this.touchData = null;
    }

    // Setup bin interactions (called from constructor and when DOM updates)
    setupBinInteractions() {
        // Wait for bins to be available
        const checkBins = () => {
            const bins = document.querySelectorAll('.bin');
            if (bins.length === 0) {
                // Bins not ready yet, try again
                setTimeout(checkBins, 100);
                return;
            }
            
            bins.forEach(bin => {
                // Click handler for direct bin clicks
                bin.addEventListener('click', (e) => {
                    // Prevent event if it's part of a drag operation
                    if (bin.classList.contains('drag-over')) return;
                    
                    if (!this.selectedItem) {
                        this.showMessage('Please select an item first! ⚠️', 'warning');
                        return;
                    }
                    
                    const binType = bin.classList.contains('organic-bin') ? 'organic' :
                                  bin.classList.contains('recyclable-bin') ? 'recyclable' : 'hazardous';
                    this.sortItem(binType);
                });
            });
        };
        
        checkBins();
    }

    // Show drag and drop instructions
    showDragInstructions() {
        const instructionsEl = document.getElementById('dragInstructions');
        if (!instructionsEl) return;
        
        // Show instructions for 10 seconds on first game
        const hasSeenInstructions = localStorage.getItem('hasSeenDragInstructions');
        if (!hasSeenInstructions) {
            instructionsEl.style.display = 'block';
            localStorage.setItem('hasSeenDragInstructions', 'true');
            
            setTimeout(() => {
                if (instructionsEl) {
                    instructionsEl.style.opacity = '0';
                    setTimeout(() => {
                        instructionsEl.style.display = 'none';
                    }, 500);
                }
            }, 10000);
        }
    }

    // Select item by unique ID
    selectItem(uniqueId) {
        // Convert to number to handle type inconsistencies from HTML attributes
        const numericId = parseFloat(uniqueId);
        const item = this.currentItems.find(item => item.uniqueId === numericId);
        
        if (!item) {
            console.warn('Item not found with uniqueId:', uniqueId, 'Available items:', this.currentItems.map(i => i.uniqueId));
            return;
        }
        
        this.selectedItem = item;
        this.displayCurrentItems();
        this.playSound('select');
        
        // Show selection message
        this.showMessage(`Selected: ${item.name} ✨`, 'info');
    }
    
    // Legacy method for compatibility
    selectCurrentItem() {
        if (this.currentItems.length > 0) {
            this.selectItem(this.currentItems[0].uniqueId);
        }
        
        // Add visual feedback
        const itemElement = document.querySelector('.waste-item');
        if (itemElement) {
            itemElement.classList.add('selected');
        }
    }

    // Sort item into bin
    sortItem(binType) {
        if (!this.selectedItem || !this.isGameActive) return;
        
        const item = this.selectedItem;
        const isCorrect = item.type === binType;
        
        // Calculate points
        let points = item.displayPoints;
        
        if (isCorrect) {
            // Correct sort
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            
            // Combo bonus
            if (this.combo >= 5) {
                points = Math.floor(points * (1 + this.combo * 0.1));
            }
            
            // Double points power-up
            if (this.activeEffects.has('doublePoints')) {
                points *= 2;
            }
            
            this.score += points;
            this.stats.correctSorts++;
            this.stats.itemsSorted++;
            
            this.showFloatingScore(points, isCorrect);
            this.showMessage(`+${points}`, 'success');
            
            // Dispatch success event for particles and audio
            const itemElement = document.querySelector('.waste-item.selected');
            const rect = itemElement ? itemElement.getBoundingClientRect() : null;
            document.dispatchEvent(new CustomEvent('correct-sort', {
                detail: {
                    points: points,
                    x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
                    y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
                    item: item
                }
            }));
            
            // Level progression
            if (this.stats.itemsSorted % 10 === 0) {
                this.levelUp();
            }
            
        } else {
            // Incorrect sort
            this.combo = 0;
            this.stats.incorrectSorts++;
            this.stats.itemsSorted++;
            
            if (this.gameMode === 'survival') {
                this.lives--;
                if (this.lives <= 0) {
                    this.endGame();
                    return;
                }
            }
            
            // Don't immediately reveal the correct answer - let player learn
            this.showMessage(`Try again`, 'error');
            
            // Offer a delayed hint after 3 seconds if they're still struggling
            this.offerDelayedHint(item);
            
            // Dispatch error event for particles and audio
            const itemElement = document.querySelector('.waste-item.selected');
            const rect = itemElement ? itemElement.getBoundingClientRect() : null;
            document.dispatchEvent(new CustomEvent('wrong-sort', {
                detail: {
                    x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
                    y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
                    item: item,
                    correctBin: this.bins[item.type].name
                }
            }));
        }
        
        // Update streak record and check for combo milestones
        if (this.combo > this.stats.streakRecord) {
            this.stats.streakRecord = this.combo;
        }
        
        // Trigger combo milestone events
        if (isCorrect && this.combo % 5 === 0 && this.combo > 0) {
            document.dispatchEvent(new CustomEvent('combo-milestone', {
                detail: { combo: this.combo }
            }));
        }
        
        // Remove the sorted item and add a new one
        const sortedItemIndex = this.currentItems.findIndex(item => item.uniqueId === this.selectedItem.uniqueId);
        if (sortedItemIndex !== -1) {
            // Generate a single new item to replace the sorted one
            const rarityRoll = Math.random() * 100;
            let rarity;
            if (rarityRoll < 1) rarity = 'legendary';
            else if (rarityRoll < 5) rarity = 'epic';
            else if (rarityRoll < 15) rarity = 'rare';
            else if (rarityRoll < 40) rarity = 'uncommon';
            else rarity = 'common';
            
            const availableItems = this.wasteItems.filter(item => item.rarity === rarity);
            const selectedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
            
            const newItem = {
                ...selectedItem,
                displayPoints: Math.floor(selectedItem.points * (1 + (this.level - 1) * 0.1)),
                uniqueId: Date.now() + Math.random()
            };
            
            this.currentItems[sortedItemIndex] = newItem;
        }
        
        this.selectedItem = null;
        this.updateDisplay();
        this.displayCurrentItems();
        this.saveStats();
    }

    // Level up
    levelUp() {
        this.level++;
        this.showMessage(`Level Up! 🚀 Now at Level ${this.level}`, 'info');
        
        // Dispatch level up event
        document.dispatchEvent(new CustomEvent('level-up', {
            detail: { newLevel: this.level }
        }));
        
        // Award power-up
        this.awardRandomPowerUp();
    }

    // Award random power-up
    awardRandomPowerUp() {
        const powerUpTypes = Object.keys(this.powerUps);
        const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        if (randomPowerUp === 'timeFreeze' || randomPowerUp === 'doublePoints') {
            // Duration-based power-ups get one use
            this.powerUps[randomPowerUp].count++;
        } else {
            // Use-based power-ups get uses added
            this.powerUps[randomPowerUp].count++;
        }
        
        this.showMessage(`Power-up awarded: ${this.formatPowerUpName(randomPowerUp)} ⚡`, 'info');
        this.updatePowerUpsDisplay();
    }

    // Offer delayed hint for wrong answers (educational approach)
    offerDelayedHint(item) {
        // Clear any existing hint timeout
        if (this.hintTimeout) {
            clearTimeout(this.hintTimeout);
        }
        
        // Store the item for which we might show a hint
        this.hintItem = item;
        
        // After 3 seconds, offer a non-intrusive hint
        this.hintTimeout = setTimeout(() => {
            if (this.isGameActive && this.hintItem === item) {
                this.showDelayedHint(item);
            }
        }, 3000);
    }
    
    // Show a subtle, non-intrusive hint
    showDelayedHint(item) {
        // Create a small, dismissible hint that doesn't cover content
        const hintElement = document.createElement('div');
        hintElement.className = 'subtle-hint';
        hintElement.innerHTML = `
            <div class="hint-content">
                <span class="hint-text">💡 Hint: ${item.name} belongs in the ${this.bins[item.type].name} bin</span>
                <button class="hint-close" onclick="this.parentElement.parentElement.remove()">×</button>
                <button class="hint-learn-more" onclick="game.showItemEducation('${item.type}', '${item.name}')">📚 Learn More</button>
            </div>
        `;
        
        // Style the hint to be non-intrusive
        hintElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(16, 185, 129, 0.95);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            max-width: 300px;
            font-size: 14px;
            animation: slideInFromRight 0.3s ease-out;
        `;
        
        // Add CSS for the hint animation if not already present
        if (!document.querySelector('#hint-styles')) {
            const style = document.createElement('style');
            style.id = 'hint-styles';
            style.textContent = `
                @keyframes slideInFromRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .hint-content { display: flex; align-items: center; gap: 8px; }
                .hint-text { flex: 1; }
                .hint-close, .hint-learn-more { 
                    background: rgba(255,255,255,0.2); 
                    border: none; 
                    color: white; 
                    padding: 4px 8px; 
                    border-radius: 4px; 
                    cursor: pointer; 
                    font-size: 12px;
                }
                .hint-close:hover, .hint-learn-more:hover { 
                    background: rgba(255,255,255,0.3); 
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(hintElement);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (hintElement.parentElement) {
                hintElement.remove();
            }
        }, 8000);
    }
    
    // Show educational content for specific items
    showItemEducation(type, itemName) {
        const educationalContent = {
            organic: {
                title: "Organic Waste Education",
                description: `${itemName} is organic waste that can be composted.`,
                tips: [
                    "Organic waste breaks down naturally",
                    "Composting reduces methane emissions",
                    "Creates nutrient-rich soil",
                    "Reduces landfill waste by up to 30%"
                ],
                examples: ["Food scraps", "Garden waste", "Paper towels", "Natural materials"]
            },
            recyclable: {
                title: "Recyclable Materials Education",
                description: `${itemName} can be processed and made into new products.`,
                tips: [
                    "Recycling saves energy and resources",
                    "Clean containers before recycling",
                    "Check local recycling guidelines",
                    "Buy products made from recycled materials"
                ],
                examples: ["Plastic bottles", "Glass jars", "Aluminum cans", "Paper products"]
            },
            hazardous: {
                title: "Hazardous Waste Education",
                description: `${itemName} requires special handling due to toxic properties.`,
                tips: [
                    "Never put in regular trash",
                    "Take to designated collection centers",
                    "Prevents soil and water contamination",
                    "Protects human and environmental health"
                ],
                examples: ["Batteries", "Electronics", "Chemicals", "Medical waste"]
            }
        };
        
        const content = educationalContent[type];
        if (content && window.uiManager) {
            window.uiManager.showEducationalModal(type, content);
        }
    }

    // Format power-up names
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

    // Activate power-up
    activatePowerUp(powerUpType) {
        if (!this.isGameActive || this.powerUps[powerUpType].count <= 0) return;
        
        this.powerUps[powerUpType].count--;
        
        switch(powerUpType) {
            case 'timeFreeze':
                this.activateTimeFreeze();
                break;
            case 'doublePoints':
                this.activateDoublePoints();
                break;
            case 'showHints':
                this.activateShowHints();
                break;
            case 'skipItem':
                this.activateSkipItem();
                break;
            case 'extraLife':
                this.activateExtraLife();
                break;
        }
        
        this.updatePowerUpsDisplay();
        
        // Dispatch power-up activation event
        document.dispatchEvent(new CustomEvent('power-up-activated', {
            detail: { type: powerUpType }
        }));
    }

    // Time freeze power-up
    activateTimeFreeze() {
        this.activeEffects.add('timeFreeze');
        this.showMessage('Time Frozen', 'info');
        
        setTimeout(() => {
            this.activeEffects.delete('timeFreeze');
            this.showMessage('⏰ Time resumed', 'info');
        }, this.powerUps.timeFreeze.duration);
    }

    // Double points power-up
    activateDoublePoints() {
        this.activeEffects.add('doublePoints');
        this.showMessage('Double Points', 'info');
        
        setTimeout(() => {
            this.activeEffects.delete('doublePoints');
            this.showMessage('✨ Double Points ended', 'info');
        }, this.powerUps.doublePoints.duration);
    }

    // Show hints power-up
    activateShowHints() {
        this.activeEffects.add('showHints');
        this.displayCurrentItems(); // Refresh display with hints
        this.showMessage('🔍 Hints enabled!', 'info');
        
        // Use-based, will be removed when uses are exhausted
        setTimeout(() => {
            this.activeEffects.delete('showHints');
            this.displayCurrentItems(); // Refresh display without hints
        }, 15000); // 15 seconds of hints
    }

    // Skip item power-up
    activateSkipItem() {
        this.showMessage('⏭️ Item skipped!', 'info');
        this.generateNewItems();
    }

    // Extra life power-up
    activateExtraLife() {
        if (this.gameMode === 'survival') {
            this.lives++;
            this.showMessage('❤️ Extra life gained!', 'success');
        }
    }

    // Pause game
    pauseGame() {
        if (!this.isGameActive) return;
        
        this.isGameActive = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.showMessage('Game Paused ⏸️', 'info');
        
        // Update button states
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn) {
            startBtn.style.display = 'inline-block';
            startBtn.textContent = '▶️ Resume';
        }
        if (pauseBtn) pauseBtn.style.display = 'none';
    }
    
    // Reset game
    resetGame() {
        this.isGameActive = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        // Reset game state
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.lives = 3;
        this.timeLeft = 60;
        this.currentItems = [];
        this.selectedItem = null;
        this.activeEffects.clear();
        
        // Clear the items container
        const container = document.querySelector('.current-items-container');
        if (container) {
            container.innerHTML = '';
        }
        
        // Update display
        this.updateDisplay();
        
        // Reset button states
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.style.display = 'inline-block';
            startBtn.innerHTML = '<i class="bi bi-play-fill"></i> Start Game';
        }
        
        this.showMessage('Game Reset! 🔄', 'info');
    }

    // End game
    endGame() {
        this.isGameActive = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        // Update statistics
        this.stats.totalScore += this.score;
        if (this.score > this.stats.bestScore) {
            this.stats.bestScore = this.score;
            this.showMessage('🎉 NEW HIGH SCORE! 🎉', 'success');
        }
        
        this.saveStats();
        
        // Calculate final stats
        const total = this.stats.correctSorts + this.stats.incorrectSorts;
        const accuracy = total > 0 ? Math.round((this.stats.correctSorts / total) * 100) : 0;
        
        // Dispatch game over event
        document.dispatchEvent(new CustomEvent('game-over', {
            detail: {
                score: this.score,
                level: this.level,
                combo: this.maxCombo,
                accuracy: accuracy,
                mode: this.gameMode,
                stats: this.stats
            }
        }));
        
        this.showGameOverScreen();
    }

    // Show game over screen
    showGameOverScreen() {
        // Remove any existing game over modal
        const existingModal = document.querySelector('.game-over-modal');
        if (existingModal) existingModal.remove();
        
        const accuracy = this.stats.correctSorts + this.stats.incorrectSorts > 0 ? 
            Math.round((this.stats.correctSorts / (this.stats.correctSorts + this.stats.incorrectSorts)) * 100) : 0;
        
        const gameOverHTML = `
            <div class="game-over-modal" id="gameOverModal">
                <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🎮 Game Over!</h2>
                        <button class="close-btn" onclick="this.closest('.game-over-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="final-stats">
                            <div class="stat-item">
                                <span class="stat-label">FINAL SCORE</span>
                                <span class="stat-value">${this.score.toLocaleString()}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">LEVEL REACHED</span>
                                <span class="stat-value">${this.level}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">BEST COMBO</span>
                                <span class="stat-value">${this.maxCombo}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">ACCURACY</span>
                                <span class="stat-value">${accuracy}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="document.querySelector('.game-over-modal').remove(); window.game.startGame('${this.gameMode}');">Play Again</button>
                        <button class="btn btn-secondary" onclick="document.querySelector('.game-over-modal').remove(); window.uiManager.showPage('home');">Home</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', gameOverHTML);
    }

    // Show floating score animation
    showFloatingScore(points, isCorrect) {
        const container = document.querySelector('.current-items-container');
        if (!container) return;
        
        const floatingScore = document.createElement('div');
        floatingScore.className = `floating-score ${isCorrect ? 'success' : 'error'}`;
        floatingScore.textContent = `${isCorrect ? '+' : '-'}${points}`;
        floatingScore.style.cssText = `
            position: absolute;
            font-size: 2rem;
            font-weight: bold;
            color: ${isCorrect ? '#22c55e' : '#ef4444'};
            pointer-events: none;
            z-index: 1000;
            animation: float-up 2s ease-out forwards;
        `;
        
        container.appendChild(floatingScore);
        
        setTimeout(() => floatingScore.remove(), 2000);
    }

    // Show message (non-intrusive positioning)
    showMessage(text, type = 'info') {
        // Calculate position based on existing messages
        const existingMessages = document.querySelectorAll('.game-message-toast');
        const messageOffset = existingMessages.length * 60; // Stack messages
        
        // Create a non-intrusive message container
        const message = document.createElement('div');
        message.className = `game-message-toast ${type}`;
        message.textContent = text;
        
        // Style the message to appear subtly in corner (much less intrusive)
        const isMobile = window.innerWidth <= 768;
        message.style.cssText = `
            position: fixed;
            top: ${(isMobile ? 70 : 80) + messageOffset}px;
            right: ${isMobile ? '10px' : '20px'};
            background: ${this.getMessageColor(type)};
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            max-width: 200px;
            word-wrap: break-word;
            opacity: 0.9;
            animation: subtleFadeIn 0.2s ease-out;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        // Add subtle animation styles if not already present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes subtleFadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 0.9; transform: translateY(0); }
                }
                @keyframes subtleFadeOut {
                    from { opacity: 0.9; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(message);
        
        // Auto-remove with subtle fade-out
        setTimeout(() => {
            message.style.animation = 'subtleFadeOut 0.2s ease-in';
            setTimeout(() => {
                if (message.parentElement) {
                    message.remove();
                }
            }, 200);
        }, 1800); // Even shorter duration, very subtle
    }
    
    // Get message color based on type (more subtle colors)
    getMessageColor(type) {
        const colors = {
            'success': 'rgba(34, 197, 94, 0.85)',
            'error': 'rgba(239, 68, 68, 0.85)', 
            'warning': 'rgba(245, 158, 11, 0.85)',
            'info': 'rgba(75, 85, 99, 0.85)' // More neutral gray-blue
        };
        return colors[type] || colors.info;
    }

    // Create message container if it doesn't exist
    createMessageContainer() {
        const container = document.createElement('div');
        container.className = 'game-messages';
        document.body.appendChild(container);
        return container;
    }

    // Create particle effect
    createParticleEffect() {
        const container = document.querySelector('.current-items-container');
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.textContent = ['✨', '🎉', '⭐', '💫'][Math.floor(Math.random() * 4)];
            particle.style.cssText = `
                position: absolute;
                font-size: 1.5rem;
                pointer-events: none;
                animation: particle-burst 1s ease-out forwards;
                animation-delay: ${i * 50}ms;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }

    // Play sound effect
    playSound(soundName) {
        if (!this.audioEnabled || !this.soundEffects[soundName]) return;
        
        try {
            const audio = this.soundEffects[soundName].cloneNode();
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore audio errors
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    // Update display
    updateDisplay() {
        // Update score
        const scoreElement = document.getElementById('gameScore');
        if (scoreElement) {
            scoreElement.textContent = this.score.toLocaleString();
        }
        
        // Update level
        const levelElement = document.getElementById('gameLevel');
        if (levelElement) {
            levelElement.textContent = this.level;
        }
        
        // Update combo
        const comboElement = document.getElementById('gameStreak');
        if (comboElement) {
            comboElement.textContent = this.combo;
        }
        
        // Update lives (survival mode)
        const livesElement = document.getElementById('gameLives');
        if (livesElement) {
            livesElement.textContent = this.lives === Infinity ? '∞' : this.lives;
        }
        
        // Update time
        const timeElement = document.getElementById('gameTime');
        if (timeElement) {
            timeElement.textContent = this.formatTime(this.timeLeft);
        }
        
        // Update accuracy
        const total = this.stats.correctSorts + this.stats.incorrectSorts;
        const accuracy = total > 0 ? Math.round((this.stats.correctSorts / total) * 100) : 100;
        const accuracyElement = document.getElementById('gameAccuracy');
        if (accuracyElement) {
            accuracyElement.textContent = `${accuracy}%`;
        }
        
        // Update power-ups display
        this.updatePowerUpsDisplay();
        
        // Trigger UI update event
        document.dispatchEvent(new CustomEvent('game-ui-update', {
            detail: {
                score: this.score,
                level: this.level,
                combo: this.combo,
                lives: this.lives,
                timeLeft: this.timeLeft,
                accuracy: accuracy
            }
        }));
    }

    // Update power-ups display
    updatePowerUpsDisplay() {
        Object.keys(this.powerUps).forEach(powerUpType => {
            const element = document.getElementById(`powerup-${powerUpType}`);
            if (element) {
                const count = this.powerUps[powerUpType].count;
                element.textContent = count;
                element.parentElement.classList.toggle('disabled', count <= 0);
                element.parentElement.classList.toggle('active', this.activeEffects.has(powerUpType));
            }
        });
    }

    // Format time display
    formatTime(seconds) {
        if (seconds === Infinity) return '∞';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Save statistics
    saveStats() {
        Object.keys(this.stats).forEach(key => {
            localStorage.setItem(key, this.stats[key]);
        });
    }

    // Get statistics
    getStats() {
        return { ...this.stats };
    }

    // Reset statistics
    resetStats() {
        Object.keys(this.stats).forEach(key => {
            this.stats[key] = 0;
            localStorage.removeItem(key);
        });
        this.showMessage('Statistics reset! 🔄', 'info');
    }

    // Toggle audio
    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        localStorage.setItem('audioEnabled', this.audioEnabled);
        this.showMessage(`Audio ${this.audioEnabled ? 'enabled' : 'disabled'} 🔊`, 'info');
    }

    // Get leaderboard data
    getLeaderboard() {
        // In a real implementation, this would fetch from a server
        return [
            { name: 'EcoWarrior', score: this.stats.bestScore, level: Math.floor(this.stats.bestScore / 1000) + 1 },
            { name: 'GreenThumb', score: Math.floor(this.stats.bestScore * 0.9), level: Math.floor(this.stats.bestScore * 0.9 / 1000) + 1 },
            { name: 'RecycleMaster', score: Math.floor(this.stats.bestScore * 0.8), level: Math.floor(this.stats.bestScore * 0.8 / 1000) + 1 }
        ].sort((a, b) => b.score - a.score);
    }
}

// Educational content system
class EducationalSystem {
    constructor() {
        this.educationalContent = {
            organic: {
                title: "Organic Waste",
                description: "Biodegradable materials that can be composted",
                benefits: [
                    "Creates nutrient-rich soil amendments",
                    "Reduces methane emissions from landfills",
                    "Supports circular economy principles"
                ],
                examples: ["Food scraps", "Garden waste", "Paper towels", "Natural fiber clothing"],
                tips: [
                    "Compost at home to reduce waste",
                    "Avoid adding meat or dairy to home compost",
                    "Use organic waste to create natural fertilizer"
                ]
            },
            recyclable: {
                title: "Recyclable Materials",
                description: "Materials that can be processed into new products",
                benefits: [
                    "Conserves natural resources",
                    "Reduces energy consumption",
                    "Creates jobs in recycling industry"
                ],
                examples: ["Plastic bottles", "Glass containers", "Metal cans", "Paper products"],
                tips: [
                    "Clean containers before recycling",
                    "Check local recycling guidelines",
                    "Buy products with recycled content"
                ]
            },
            hazardous: {
                title: "Hazardous Waste",
                description: "Materials requiring special handling due to toxicity",
                benefits: [
                    "Prevents soil and water contamination",
                    "Protects human and environmental health",
                    "Enables proper treatment of toxic materials"
                ],
                examples: ["Batteries", "Electronics", "Chemicals", "Medical waste"],
                tips: [
                    "Never put in regular trash",
                    "Use designated collection centers",
                    "Consider purchasing less toxic alternatives"
                ]
            }
        };
    }

    getContent(category) {
        return this.educationalContent[category] || null;
    }

    getAllContent() {
        return this.educationalContent;
    }
}

// Initialize game instance
let game;
let educationalSystem;

// Add CSS for new animations
const additionalStyles = `
<style>
@keyframes float-up {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-50px) scale(0.5); opacity: 0; }
}

@keyframes particle-burst {
    0% { transform: scale(0) rotate(0deg); opacity: 1; }
    100% { transform: scale(1) rotate(360deg) translateY(-30px); opacity: 0; }
}

@keyframes slideInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.game-over-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(10px);
}

.game-over-content {
    background: rgba(15, 23, 42, 0.95);
    padding: 2rem;
    border-radius: 1.5rem;
    border: 1px solid rgba(16, 185, 129, 0.3);
    text-align: center;
    max-width: 400px;
    width: 90%;
}

.game-over-content h2 {
    color: var(--primary);
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-family: 'Cinzel', serif;
}

.final-stats {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
}

.game-over-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.floating-score {
    position: absolute !important;
    font-size: 2rem !important;
    font-weight: bold !important;
    pointer-events: none !important;
    z-index: 1000 !important;
    animation: float-up 2s ease-out forwards !important;
}

.item-hint {
    background: rgba(16, 185, 129, 0.2);
    color: var(--primary);
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    border: 1px solid rgba(16, 185, 129, 0.3);
}
</style>
`;

// Add styles to document
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new EcoSortGame();
    window.educationalSystem = new EducationalSystem();
    console.log('🎮 Game Engine initialized successfully!');
});

// Fallback initialization if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading
} else {
    // DOM is already loaded
    window.game = new EcoSortGame();
    window.educationalSystem = new EducationalSystem();
    console.log('🎮 Game Engine initialized successfully (fallback)!');
}

// Export for modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EcoSortGame, EducationalSystem };
}
