// PRIMORDIAL SOUP - Emergence Simulator
// A cellular automaton where complex life emerges from simple rules
// Created by AI (Claude) at the request of Michael Haas

class PrimordialSoup {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Grid system
        this.cellSize = 4;
        this.gridWidth = 0;
        this.gridHeight = 0;
        this.grid = [];
        this.nextGrid = [];
        
        // Cell types with different behaviors
        this.cellTypes = {
            0: { name: 'Empty', color: [10, 10, 10], energy: 0 },
            1: { name: 'Basic', color: [50, 255, 150], energy: 3, reproduceThreshold: 5 },
            2: { name: 'Predator', color: [255, 50, 100], energy: 8, reproduceThreshold: 12 },
            3: { name: 'Plant', color: [100, 255, 200], energy: 2, reproduceThreshold: 4 },
            4: { name: 'Spore', color: [255, 200, 50], energy: 1, reproduceThreshold: 3 }
        };
        
        // Current placement type
        this.currentType = 1;
        
        // Simulation state
        this.generation = 0;
        this.paused = false;
        this.updateInterval = 100; // ms between generations
        this.lastUpdate = 0;
        
        // Mouse state
        this.mouseX = 0;
        this.mouseY = 0;
        this.isDrawing = false;
        
        // Rules (can be randomized)
        this.rules = {
            survivalMin: 2,
            survivalMax: 3,
            birthCount: 3,
            predatorHunger: 0.95, // Energy decay per generation
            plantGrowth: 1.1, // Energy gain from photosynthesis
            sporeSpread: 0.3 // Chance to spread
        };
        
        // Audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.1;
        this.masterGain.connect(this.audioContext.destination);
        
        this.init();
    }

    init() {
        this.resize();
        this.setupEventListeners();
        this.initializeGrid();
        
        setTimeout(() => {
            document.getElementById('title').classList.add('fade');
        }, 2000);
        
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.gridWidth = Math.floor(this.canvas.width / this.cellSize);
        this.gridHeight = Math.floor(this.canvas.height / this.cellSize);
        
        this.initializeGrid();
    }

    initializeGrid() {
        this.grid = [];
        this.nextGrid = [];
        
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            this.nextGrid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = { type: 0, energy: 0, age: 0, dna: Math.random() };
                this.nextGrid[y][x] = { type: 0, energy: 0, age: 0, dna: Math.random() };
            }
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            const cursor = document.getElementById('cursor');
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            if (this.isDrawing) {
                this.spawnCells(e.clientX, e.clientY);
            }
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            this.spawnCells(e.clientX, e.clientY);
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Digit1') this.setType(1);
            else if (e.code === 'Digit2') this.setType(2);
            else if (e.code === 'Digit3') this.setType(3);
            else if (e.code === 'Digit4') this.setType(4);
            else if (e.code === 'Space') this.clearSoup();
            else if (e.code === 'KeyR') this.randomizeRules();
            else if (e.code === 'KeyP') this.paused = !this.paused;
        });
        
        // Button controls
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`type-${i}`).addEventListener('click', () => this.setType(i));
        }
    }

    setType(type) {
        this.currentType = type;
        document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`type-${type}`).classList.add('active');
        document.getElementById('current-type').textContent = this.cellTypes[type].name.toUpperCase();
        
        // Change cursor color
        const color = this.cellTypes[type].color;
        document.getElementById('cursor').style.borderColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
        
        // Play tone
        this.playTone(200 + type * 200, 0.05, 0.02);
    }

    spawnCells(x, y) {
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        const radius = 3;
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx * dx + dy * dy > radius * radius) continue;
                
                const nx = gridX + dx;
                const ny = gridY + dy;
                
                if (nx >= 0 && nx < this.gridWidth && ny >= 0 && ny < this.gridHeight) {
                    if (Math.random() < 0.5) {
                        this.grid[ny][nx] = {
                            type: this.currentType,
                            energy: this.cellTypes[this.currentType].energy,
                            age: 0,
                            dna: Math.random()
                        };
                    }
                }
            }
        }
        
        this.playTone(400 + this.currentType * 100, 0.1, 0.01);
    }

    clearSoup() {
        this.initializeGrid();
        this.generation = 0;
        this.playTone(100, 0.2, 0.05);
    }

    randomizeRules() {
        this.rules = {
            survivalMin: Math.floor(Math.random() * 3) + 1,
            survivalMax: Math.floor(Math.random() * 3) + 3,
            birthCount: Math.floor(Math.random() * 4) + 2,
            predatorHunger: 0.85 + Math.random() * 0.15,
            plantGrowth: 1.05 + Math.random() * 0.1,
            sporeSpread: 0.2 + Math.random() * 0.3
        };
        
        this.playTone(800, 0.15, 0.03);
    }

    updateSimulation() {
        if (this.paused) return;
        
        // Copy current grid to next grid
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                this.nextGrid[y][x] = { ...this.grid[y][x] };
            }
        }
        
        // Process each cell
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.grid[y][x];
                
                if (cell.type === 0) {
                    // Empty cell - check for birth
                    this.processBirth(x, y);
                } else {
                    // Living cell - apply rules
                    this.processCell(x, y, cell);
                }
            }
        }
        
        // Swap grids
        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
        this.generation++;
    }

    processBirth(x, y) {
        const neighbors = this.countNeighbors(x, y);
        
        // Count each type
        let counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
        let totalEnergy = 0;
        
        for (let type in neighbors) {
            if (type !== '0') {
                counts[type] = neighbors[type].count;
                totalEnergy += neighbors[type].totalEnergy;
            }
        }
        
        // Classic Conway birth rule with modifications
        const totalNeighbors = Object.values(counts).reduce((a, b) => a + b, 0);
        
        if (totalNeighbors === this.rules.birthCount) {
            // Birth! Determine type by majority
            let maxType = 1;
            let maxCount = 0;
            for (let type in counts) {
                if (counts[type] > maxCount) {
                    maxCount = counts[type];
                    maxType = parseInt(type);
                }
            }
            
            // Mutations based on neighbors
            if (Math.random() < 0.05) {
                maxType = Math.floor(Math.random() * 4) + 1;
            }
            
            this.nextGrid[y][x] = {
                type: maxType,
                energy: this.cellTypes[maxType].energy,
                age: 0,
                dna: Math.random()
            };
        }
    }

    processCell(x, y, cell) {
        const neighbors = this.countNeighbors(x, y);
        const totalNeighbors = Object.values(neighbors).reduce((acc, n) => acc + n.count, 0) - neighbors[0].count;
        
        cell.age++;
        
        // Type-specific behavior
        switch(cell.type) {
            case 1: // Basic - standard Conway rules
                this.processBasicCell(x, y, cell, totalNeighbors);
                break;
            case 2: // Predator - hunts other cells
                this.processPredatorCell(x, y, cell, neighbors);
                break;
            case 3: // Plant - grows with light (empty space)
                this.processPlantCell(x, y, cell, neighbors);
                break;
            case 4: // Spore - spreads aggressively
                this.processSporeCell(x, y, cell, neighbors);
                break;
        }
    }

    processBasicCell(x, y, cell, totalNeighbors) {
        // Standard Conway rules
        if (totalNeighbors < this.rules.survivalMin || totalNeighbors > this.rules.survivalMax) {
            // Die
            this.nextGrid[y][x] = { type: 0, energy: 0, age: 0, dna: Math.random() };
        } else {
            // Survive
            this.nextGrid[y][x].energy = cell.energy;
            this.nextGrid[y][x].age = cell.age;
        }
    }

    processPredatorCell(x, y, cell, neighbors) {
        // Predators consume energy
        cell.energy *= this.rules.predatorHunger;
        
        // Hunt nearby cells
        let hunted = false;
        for (let type in neighbors) {
            if (type === '1' || type === '3') { // Can eat basic and plants
                if (neighbors[type].count > 0) {
                    cell.energy += 2;
                    hunted = true;
                    break;
                }
            }
        }
        
        // Die if no energy
        if (cell.energy < 1) {
            this.nextGrid[y][x] = { type: 0, energy: 0, age: 0, dna: Math.random() };
        } else {
            this.nextGrid[y][x].energy = cell.energy;
            this.nextGrid[y][x].age = cell.age;
            
            // Reproduce if enough energy
            if (cell.energy > this.cellTypes[2].reproduceThreshold && !hunted) {
                this.tryReproduce(x, y, 2, cell.energy / 2);
            }
        }
    }

    processPlantCell(x, y, cell, neighbors) {
        // Plants gain energy from empty space (light)
        if (neighbors[0].count > 0) {
            cell.energy *= this.rules.plantGrowth;
        }
        
        // Die if crowded
        const totalNeighbors = Object.values(neighbors).reduce((acc, n) => acc + n.count, 0) - neighbors[0].count;
        if (totalNeighbors > 6) {
            this.nextGrid[y][x] = { type: 0, energy: 0, age: 0, dna: Math.random() };
        } else {
            this.nextGrid[y][x].energy = Math.min(cell.energy, 10);
            this.nextGrid[y][x].age = cell.age;
            
            // Reproduce if enough energy
            if (cell.energy > this.cellTypes[3].reproduceThreshold) {
                this.tryReproduce(x, y, 3, cell.energy / 2);
            }
        }
    }

    processSporeCell(x, y, cell, neighbors) {
        // Spores spread randomly
        if (Math.random() < this.rules.sporeSpread) {
            const dx = Math.floor(Math.random() * 3) - 1;
            const dy = Math.floor(Math.random() * 3) - 1;
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < this.gridWidth && ny >= 0 && ny < this.gridHeight) {
                if (this.nextGrid[ny][nx].type === 0) {
                    this.nextGrid[ny][nx] = {
                        type: 4,
                        energy: this.cellTypes[4].energy,
                        age: 0,
                        dna: cell.dna
                    };
                }
            }
        }
        
        // Die after spreading
        if (cell.age > 10) {
            this.nextGrid[y][x] = { type: 0, energy: 0, age: 0, dna: Math.random() };
        } else {
            this.nextGrid[y][x].age = cell.age;
        }
    }

    tryReproduce(x, y, type, energy) {
        // Find empty neighbor
        const offsets = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
        const offset = offsets[Math.floor(Math.random() * offsets.length)];
        const nx = x + offset[0];
        const ny = y + offset[1];
        
        if (nx >= 0 && nx < this.gridWidth && ny >= 0 && ny < this.gridHeight) {
            if (this.nextGrid[ny][nx].type === 0) {
                this.nextGrid[ny][nx] = {
                    type: type,
                    energy: energy,
                    age: 0,
                    dna: Math.random()
                };
            }
        }
    }

    countNeighbors(x, y) {
        const neighbors = { 0: { count: 0, totalEnergy: 0 }, 1: { count: 0, totalEnergy: 0 }, 
                           2: { count: 0, totalEnergy: 0 }, 3: { count: 0, totalEnergy: 0 }, 
                           4: { count: 0, totalEnergy: 0 } };
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < this.gridWidth && ny >= 0 && ny < this.gridHeight) {
                    const type = this.grid[ny][nx].type;
                    neighbors[type].count++;
                    neighbors[type].totalEnergy += this.grid[ny][nx].energy;
                }
            }
        }
        
        return neighbors;
    }

    draw() {
        // Clear
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cells
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.grid[y][x];
                
                if (cell.type !== 0) {
                    const color = this.cellTypes[cell.type].color;
                    const energyFactor = Math.min(cell.energy / 10, 1);
                    const ageFactor = Math.max(0, 1 - cell.age / 100);
                    const brightness = energyFactor * ageFactor;
                    
                    this.ctx.fillStyle = `rgb(${color[0] * brightness}, ${color[1] * brightness}, ${color[2] * brightness})`;
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                    
                    // Add glow for high energy cells
                    if (cell.energy > 5) {
                        this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`;
                        this.ctx.fillRect(
                            x * this.cellSize - 1, 
                            y * this.cellSize - 1, 
                            this.cellSize + 2, 
                            this.cellSize + 2
                        );
                    }
                }
            }
        }
    }

    updateHUD() {
        // Count cells and species
        let cellCount = 0;
        let species = { 1: 0, 2: 0, 3: 0, 4: 0 };
        let totalEnergy = 0;
        
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.grid[y][x];
                if (cell.type !== 0) {
                    cellCount++;
                    species[cell.type]++;
                    totalEnergy += cell.energy;
                }
            }
        }
        
        const speciesCount = Object.values(species).filter(c => c > 0).length;
        const entropy = cellCount > 0 ? Math.floor((totalEnergy / cellCount) * 10) : 0;
        
        document.getElementById('cell-count').textContent = cellCount;
        document.getElementById('species-count').textContent = speciesCount;
        document.getElementById('generation').textContent = this.generation;
        document.getElementById('entropy').textContent = entropy + '%';
    }

    playTone(frequency, volume, duration) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    animate(timestamp = 0) {
        // Update simulation at interval
        if (timestamp - this.lastUpdate > this.updateInterval) {
            this.updateSimulation();
            this.lastUpdate = timestamp;
        }
        
        this.draw();
        this.updateHUD();
        
        requestAnimationFrame((t) => this.animate(t));
    }
}

// Initialize
window.addEventListener('load', () => {
    new PrimordialSoup();
});
