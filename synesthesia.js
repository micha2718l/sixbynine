// SYNESTHESIA ENGINE - Reality Painter
// The most intense multi-sensory experience ever created
// Where consciousness, physics, and art merge into one

class SynesthesiaEngine {
    constructor() {
        // Triple canvas system for layered reality
        this.mainCanvas = document.getElementById('mainCanvas');
        this.dimensionCanvas = document.getElementById('dimensionCanvas');
        this.fractalCanvas = document.getElementById('fractalCanvas');
        
        this.ctx = this.mainCanvas.getContext('2d');
        this.dimCtx = this.dimensionCanvas.getContext('2d');
        this.fracCtx = this.fractalCanvas.getContext('2d');
        
        // Audio system
        this.audioContext = null;
        this.masterGain = null;
        this.activeOscillators = [];
        
        // Reality state
        this.particles = [];
        this.consciousParticles = [];
        this.gravityWells = [];
        this.timeDistortions = [];
        this.dimensionalLayers = [[], [], [], [], []];
        this.currentDimension = 0;
        
        // Performance limits
        this.maxParticles = 800; // Reduced from unlimited
        this.maxGravityWells = 10;
        this.maxTimeDistortions = 5;
        
        // Gradient cache for performance
        this.gradientCache = new Map();
        
        // User state
        this.mouseX = 0;
        this.mouseY = 0;
        this.isDrawing = false;
        this.lastDrawTime = 0;
        this.drawPath = [];
        
        // Mode system
        this.mode = 'paint'; // paint, gravity, time, fractal, dimension
        this.consciousnessEnabled = false;
        
        // Reality parameters
        this.reality = 100;
        this.energy = 100;
        this.gravityStrength = 1.0;
        this.timeDilation = 1.0;
        this.time = 0;
        
        // Synesthesia mappings
        this.colorToFreq = new Map();
        this.soundToShape = new Map();
        this.lastFrequency = 880;
        this.lastShape = 'circle';
        
        // Memory system - temporal echoes
        this.memoryEchoes = [];
        
        this.init();
    }

    init() {
        this.resize();
        this.initAudio();
        this.setupEventListeners();
        this.initSynesthesiaMappings();
        
        setTimeout(() => {
            document.getElementById('instructions').classList.add('fade-out');
        }, 3000);
        
        this.animate();
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.mainCanvas.width = width;
        this.mainCanvas.height = height;
        this.dimensionCanvas.width = width;
        this.dimensionCanvas.height = height;
        this.fractalCanvas.width = width;
        this.fractalCanvas.height = height;
    }

    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.2;
        this.masterGain.connect(this.audioContext.destination);
    }

    initSynesthesiaMappings() {
        // Map colors (hue) to frequencies
        for (let i = 0; i < 360; i++) {
            this.colorToFreq.set(i, 200 + (i / 360) * 1000);
        }
        
        // Map frequency ranges to shapes
        this.soundToShape.set('low', 'circle');
        this.soundToShape.set('mid', 'square');
        this.soundToShape.set('high', 'triangle');
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            const cursor = document.getElementById('cursor');
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            if (this.isDrawing) {
                this.draw(e.clientX, e.clientY);
            }
        });
        
        document.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            this.drawPath = [{x: e.clientX, y: e.clientY}];
            this.handleModeAction(e.clientX, e.clientY, true);
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDrawing && this.drawPath.length > 1) {
                this.finalizeDrawing();
            }
            this.isDrawing = false;
            this.drawPath = [];
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Digit1') this.setMode('paint');
            else if (e.code === 'Digit2') this.setMode('gravity');
            else if (e.code === 'Digit3') this.setMode('time');
            else if (e.code === 'Digit4') this.setMode('fractal');
            else if (e.code === 'Digit5') this.setMode('dimension');
            else if (e.code === 'KeyC') this.toggleConsciousness();
            else if (e.code === 'Space') {
                e.preventDefault();
                this.resetReality();
            }
            else if (e.code === 'ArrowUp') this.changeDimension(1);
            else if (e.code === 'ArrowDown') this.changeDimension(-1);
            else if (e.code === 'KeyG') this.increaseGravity();
            else if (e.code === 'KeyT') this.manipulateTime();
            else if (e.code === 'KeyF') this.createFractalExplosion();
        });
        
        // Button controls
        document.getElementById('mode-paint').addEventListener('click', () => this.setMode('paint'));
        document.getElementById('mode-gravity').addEventListener('click', () => this.setMode('gravity'));
        document.getElementById('mode-time').addEventListener('click', () => this.setMode('time'));
        document.getElementById('mode-fractal').addEventListener('click', () => this.setMode('fractal'));
        document.getElementById('mode-dimension').addEventListener('click', () => this.setMode('dimension'));
        document.getElementById('toggle-consciousness').addEventListener('click', () => this.toggleConsciousness());
        document.getElementById('reality-reset').addEventListener('click', () => this.resetReality());
    }

    setMode(newMode) {
        this.mode = newMode;
        
        // Update button states
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`mode-${newMode}`).classList.add('active');
        
        // Update cursor
        const cursor = document.getElementById('cursor');
        const sizes = {paint: 40, gravity: 80, time: 60, fractal: 100, dimension: 50};
        const colors = {
            paint: '#00ffff',
            gravity: '#ff00ff',
            time: '#ffff00',
            fractal: '#00ff00',
            dimension: '#ff0000'
        };
        
        cursor.style.width = sizes[newMode] + 'px';
        cursor.style.height = sizes[newMode] + 'px';
        cursor.style.borderColor = colors[newMode];
        
        document.getElementById('current-mode').textContent = newMode.toUpperCase();
        
        this.playModeSound(newMode);
    }

    playModeSound(mode) {
        const frequencies = {paint: 440, gravity: 220, time: 660, fractal: 880, dimension: 330};
        this.playTone(frequencies[mode], 0.1, 0.05);
    }

    handleModeAction(x, y, isStart) {
        switch(this.mode) {
            case 'paint':
                this.paintReality(x, y);
                break;
            case 'gravity':
                if (isStart) this.createGravityWell(x, y);
                break;
            case 'time':
                if (isStart) this.createTimeDistortion(x, y);
                break;
            case 'fractal':
                this.spawnFractalParticles(x, y);
                break;
            case 'dimension':
                if (isStart) this.createDimensionalRift(x, y);
                break;
        }
    }

    draw(x, y) {
        const now = Date.now();
        if (now - this.lastDrawTime < 16) return; // ~60fps limit
        this.lastDrawTime = now;
        
        this.drawPath.push({x, y});
        this.handleModeAction(x, y, false);
    }

    paintReality(x, y) {
        // Enforce particle limit
        if (this.particles.length >= this.maxParticles) {
            // Remove oldest particles
            this.particles.splice(0, 50);
        }
        
        // Create particles along the drawing path
        const hue = (this.time * 2 + x * 0.5) % 360;
        const frequency = this.colorToFreq.get(Math.floor(hue));
        
        // Reduce particle creation rate if getting close to limit
        const creationRate = this.particles.length > this.maxParticles * 0.8 ? 1 : 3;
        
        for (let i = 0; i < creationRate; i++) {
            const particle = {
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                hue: hue,
                size: 3 + Math.random() * 5,
                life: 1,
                decay: 0.005 + Math.random() * 0.01,
                frequency: frequency,
                age: 0,
                maxAge: 200 + Math.random() * 200
            };
            
            this.particles.push(particle);
            this.dimensionalLayers[this.currentDimension].push(particle);
        }
        
        // Play synesthetic sound
        if (Math.random() < 0.1) {
            this.playTone(frequency, 0.1, 0.02);
            this.lastFrequency = frequency;
            this.updateSynesthesiaDisplay();
        }
        
        this.energy = Math.max(0, this.energy - 0.1);
    }

    createGravityWell(x, y) {
        // Enforce gravity well limit
        if (this.gravityWells.length >= this.maxGravityWells) {
            this.gravityWells.shift(); // Remove oldest
        }
        
        const well = {
            x, y,
            strength: 5 + Math.random() * 10,
            radius: 100 + Math.random() * 100,
            life: 1,
            decay: 0.002,
            hue: 270 + Math.random() * 60
        };
        
        this.gravityWells.push(well);
        this.gravityStrength += 0.5;
        
        // Deep bass for gravity
        this.playTone(80, 0.5, 0.08, 'sine');
        this.playTone(40, 0.5, 0.05, 'sine');
        
        this.reality -= 2;
    }

    createTimeDistortion(x, y) {
        // Enforce time distortion limit
        if (this.timeDistortions.length >= this.maxTimeDistortions) {
            this.timeDistortions.shift(); // Remove oldest
        }
        
        const distortion = {
            x, y,
            strength: 0.5 + Math.random() * 1.5,
            radius: 80 + Math.random() * 120,
            life: 1,
            decay: 0.003,
            direction: Math.random() < 0.5 ? -1 : 1, // slow down or speed up
            hue: 50 + Math.random() * 60
        };
        
        this.timeDistortions.push(distortion);
        
        // High frequency for time
        this.playTone(1200 + Math.random() * 400, 0.3, 0.06, 'triangle');
        
        this.reality -= 1;
    }

    spawnFractalParticles(x, y) {
        // Create recursive fractal pattern
        this.createFractalBranch(x, y, 0, 5, 30, Math.random() * Math.PI * 2);
    }

    createFractalBranch(x, y, depth, maxDepth, length, angle) {
        if (depth >= maxDepth) return;
        
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        
        // Create particles along the branch
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const px = x + (endX - x) * t;
            const py = y + (endY - y) * t;
            
            const particle = {
                x: px,
                y: py,
                vx: Math.cos(angle) * 0.5,
                vy: Math.sin(angle) * 0.5,
                hue: 120 + depth * 20,
                size: (maxDepth - depth) * 2,
                life: 1,
                decay: 0.003,
                frequency: 400 + depth * 100,
                age: 0,
                maxAge: 300
            };
            
            this.particles.push(particle);
        }
        
        // Branch recursively
        const branches = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < branches; i++) {
            const newAngle = angle + (Math.random() - 0.5) * Math.PI / 2;
            const newLength = length * (0.6 + Math.random() * 0.2);
            setTimeout(() => {
                this.createFractalBranch(endX, endY, depth + 1, maxDepth, newLength, newAngle);
            }, depth * 50);
        }
        
        if (depth < 3 && Math.random() < 0.5) {
            this.playTone(400 + depth * 150, 0.1, 0.02);
        }
    }

    createDimensionalRift(x, y) {
        // Create a rift that shows another dimension
        const riftSize = 50 + Math.random() * 100;
        const targetDim = (this.currentDimension + 1) % 5;
        
        // Visual effect
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2;
            const dist = Math.random() * riftSize;
            
            const particle = {
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                vx: Math.cos(angle) * 5,
                vy: Math.sin(angle) * 5,
                hue: targetDim * 72,
                size: 4,
                life: 1,
                decay: 0.01,
                frequency: 200 + targetDim * 200,
                age: 0,
                maxAge: 100
            };
            
            this.particles.push(particle);
        }
        
        // Dimensional sound
        this.playTone(200 + targetDim * 200, 0.3, 0.06, 'sawtooth');
        this.playTone(400 + targetDim * 400, 0.2, 0.04, 'sawtooth');
        
        this.reality -= 5;
        this.flashRealityShift();
    }

    finalizeDrawing() {
        // Create memory echo of the drawing
        const echo = {
            path: [...this.drawPath],
            hue: (this.time * 2) % 360,
            life: 1,
            decay: 0.001,
            dimension: this.currentDimension
        };
        
        this.memoryEchoes.push(echo);
    }

    toggleConsciousness() {
        this.consciousnessEnabled = !this.consciousnessEnabled;
        const btn = document.getElementById('toggle-consciousness');
        btn.classList.toggle('active');
        
        if (this.consciousnessEnabled) {
            // Give some particles consciousness
            this.particles.forEach(p => {
                if (Math.random() < 0.1) {
                    p.conscious = true;
                    p.decision = Math.random();
                    p.target = null;
                }
            });
            
            this.playTone(1000, 0.2, 0.05);
            this.playTone(1500, 0.2, 0.05);
        }
    }

    changeDimension(delta) {
        const oldDim = this.currentDimension;
        this.currentDimension = (this.currentDimension + delta + 5) % 5;
        
        // Update indicator
        document.querySelectorAll('.dimension-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentDimension);
        });
        
        document.getElementById('dimension-count').textContent = this.currentDimension + 1;
        
        this.flashRealityShift();
        this.playTone(300 + this.currentDimension * 150, 0.2, 0.06);
    }

    increaseGravity() {
        this.gravityStrength += 0.5;
        this.playTone(100, 0.3, 0.08);
    }

    manipulateTime() {
        this.timeDilation = this.timeDilation === 1.0 ? 0.5 : (this.timeDilation === 0.5 ? 2.0 : 1.0);
        this.playTone(800 * this.timeDilation, 0.2, 0.05);
    }

    createFractalExplosion() {
        const centerX = this.mainCanvas.width / 2;
        const centerY = this.mainCanvas.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            this.createFractalBranch(centerX, centerY, 0, 6, 50, angle);
        }
        
        this.reality -= 10;
    }

    flashRealityShift() {
        const flash = document.getElementById('reality-shift');
        flash.style.opacity = '0.5';
        setTimeout(() => {
            flash.style.opacity = '0';
        }, 100);
    }

    resetReality() {
        this.particles = [];
        this.consciousParticles = [];
        this.gravityWells = [];
        this.timeDistortions = [];
        this.memoryEchoes = [];
        this.dimensionalLayers = [[], [], [], [], []];
        
        this.reality = 100;
        this.energy = 100;
        this.gravityStrength = 1.0;
        this.timeDilation = 1.0;
        this.currentDimension = 0;
        
        this.changeDimension(0);
        
        // Reality reset sound
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playTone(200 + i * 200, 0.1, 0.03);
            }, i * 50);
        }
        
        this.flashRealityShift();
    }

    updateParticles() {
        // Skip expensive operations if too many particles
        const skipConsciousness = this.particles.length > 600;
        const skipTimeDistortions = this.particles.length > 800;
        
        this.particles = this.particles.filter(p => {
            p.age++;
            
            // Apply gravity wells (always important)
            this.gravityWells.forEach(well => {
                const dx = well.x - p.x;
                const dy = well.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < well.radius && dist > 0) {
                    const force = (well.strength / dist) * 0.1 * this.gravityStrength;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
            });
            
            // Apply time distortions (skip if too many particles)
            if (!skipTimeDistortions) {
                this.timeDistortions.forEach(distortion => {
                    const dx = distortion.x - p.x;
                    const dy = distortion.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < distortion.radius) {
                        const timeEffect = distortion.strength * distortion.direction * (1 - dist / distortion.radius);
                        p.vx *= (1 + timeEffect * 0.1);
                        p.vy *= (1 + timeEffect * 0.1);
                        p.decay *= (1 + timeEffect * 0.05);
                    }
                });
            }
            
            // Conscious particles make decisions (skip if too many particles)
            if (!skipConsciousness && p.conscious && this.consciousnessEnabled) {
                if (Math.random() < 0.01) {
                    // Choose a target
                    const others = this.particles.filter(other => other !== p);
                    if (others.length > 0) {
                        p.target = others[Math.floor(Math.random() * others.length)];
                    }
                }
                
                if (p.target) {
                    const dx = p.target.x - p.x;
                    const dy = p.target.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist > 0) {
                        const attraction = p.decision > 0.5 ? 0.1 : -0.1;
                        p.vx += (dx / dist) * attraction;
                        p.vy += (dy / dist) * attraction;
                    }
                }
            }
            
            // Update position with time dilation
            p.x += p.vx * this.timeDilation;
            p.y += p.vy * this.timeDilation;
            
            // Friction
            p.vx *= 0.99;
            p.vy *= 0.99;
            
            // Decay
            p.life -= p.decay * this.timeDilation;
            
            // Bounds wrapping
            if (p.x < 0) p.x = this.mainCanvas.width;
            if (p.x > this.mainCanvas.width) p.x = 0;
            if (p.y < 0) p.y = this.mainCanvas.height;
            if (p.y > this.mainCanvas.height) p.y = 0;
            
            return p.life > 0 && p.age < p.maxAge;
        });
    }

    updateGravityWells() {
        this.gravityWells = this.gravityWells.filter(well => {
            well.life -= well.decay;
            well.radius *= 0.998;
            return well.life > 0;
        });
    }

    updateTimeDistortions() {
        this.timeDistortions = this.timeDistortions.filter(dist => {
            dist.life -= dist.decay;
            return dist.life > 0;
        });
    }

    updateMemoryEchoes() {
        this.memoryEchoes = this.memoryEchoes.filter(echo => {
            echo.life -= echo.decay;
            return echo.life > 0 && echo.path.length > 0;
        });
    }

    draw() {
        // Clear with fade
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        
        this.dimCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.dimCtx.fillRect(0, 0, this.dimensionCanvas.width, this.dimensionCanvas.height);
        
        this.fracCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.fracCtx.fillRect(0, 0, this.fractalCanvas.width, this.fractalCanvas.height);
        
        // Draw memory echoes
        this.drawMemoryEchoes();
        
        // Draw gravity wells
        this.drawGravityWells();
        
        // Draw time distortions
        this.drawTimeDistortions();
        
        // Draw particles
        this.drawParticles();
        
        // Draw current path
        if (this.drawPath.length > 1) {
            this.drawCurrentPath();
        }
    }

    drawMemoryEchoes() {
        this.memoryEchoes.forEach(echo => {
            if (echo.dimension !== this.currentDimension) return;
            
            this.dimCtx.strokeStyle = `hsla(${echo.hue}, 70%, 50%, ${echo.life * 0.3})`;
            this.dimCtx.lineWidth = 3;
            this.dimCtx.lineCap = 'round';
            this.dimCtx.lineJoin = 'round';
            
            this.dimCtx.beginPath();
            echo.path.forEach((point, i) => {
                if (i === 0) {
                    this.dimCtx.moveTo(point.x, point.y);
                } else {
                    this.dimCtx.lineTo(point.x, point.y);
                }
            });
            this.dimCtx.stroke();
        });
    }

    drawGravityWells() {
        this.gravityWells.forEach(well => {
            const gradient = this.ctx.createRadialGradient(
                well.x, well.y, 0,
                well.x, well.y, well.radius
            );
            gradient.addColorStop(0, `hsla(${well.hue}, 100%, 50%, ${well.life * 0.3})`);
            gradient.addColorStop(0.5, `hsla(${well.hue}, 100%, 30%, ${well.life * 0.2})`);
            gradient.addColorStop(1, `hsla(${well.hue}, 100%, 10%, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(well.x, well.y, well.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw spiral
            this.ctx.strokeStyle = `hsla(${well.hue}, 80%, 60%, ${well.life * 0.5})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            for (let a = 0; a < Math.PI * 4; a += 0.1) {
                const r = (a / (Math.PI * 4)) * well.radius;
                const x = well.x + Math.cos(a + this.time * 0.05) * r;
                const y = well.y + Math.sin(a + this.time * 0.05) * r;
                if (a === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
        });
    }

    drawTimeDistortions() {
        this.timeDistortions.forEach(dist => {
            // Draw rippling circles
            for (let i = 0; i < 5; i++) {
                const radius = dist.radius * (i / 5) + Math.sin(this.time * 0.1 + i) * 10;
                this.dimCtx.strokeStyle = `hsla(${dist.hue}, 80%, 60%, ${dist.life * 0.2 * (1 - i / 5)})`;
                this.dimCtx.lineWidth = 2;
                this.dimCtx.beginPath();
                this.dimCtx.arc(dist.x, dist.y, radius, 0, Math.PI * 2);
                this.dimCtx.stroke();
            }
        });
    }

    drawParticles() {
        // Batch particles by hue for better performance
        const batchSize = 5;
        
        this.particles.forEach((p, index) => {
            const alpha = p.life * 0.8;
            
            // Only draw full glow for every Nth particle when count is high
            const drawFullGlow = this.particles.length < 500 || index % 2 === 0;
            
            if (drawFullGlow) {
                // Main glow - use simpler gradient
                const gradient = this.ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, p.size * 3
                );
                gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${alpha})`);
                gradient.addColorStop(1, `hsla(${p.hue}, 100%, 30%, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Core - always draw
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, ${drawFullGlow ? 90 : 70}%, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Conscious particles get special indicator (only if not too many particles)
            if (p.conscious && this.consciousnessEnabled && this.particles.length < 600) {
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        });
    }

    drawCurrentPath() {
        const hue = (this.time * 2) % 360;
        this.ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.6)`;
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.drawPath.forEach((point, i) => {
            if (i === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });
        this.ctx.stroke();
    }

    updateHUD() {
        // Update stats
        const particleCount = this.particles.length;
        document.getElementById('particle-count').textContent = particleCount;
        document.getElementById('dimension-count').textContent = this.currentDimension + 1;
        document.getElementById('gravity-level').textContent = this.gravityStrength.toFixed(1) + 'x';
        document.getElementById('time-dilation').textContent = this.timeDilation.toFixed(1) + 'x';
        
        // Update bars with performance warning
        const realityBar = document.getElementById('reality-bar');
        const energyBar = document.getElementById('energy-bar');
        
        realityBar.style.width = Math.max(0, this.reality) + '%';
        energyBar.style.width = Math.max(0, this.energy) + '%';
        
        // Visual warning if too many particles
        if (particleCount > 600) {
            realityBar.style.background = '#ff6600';
            energyBar.style.background = '#ff6600';
        } else {
            realityBar.style.background = '';
            energyBar.style.background = '';
        }
        
        // Update synesthesia
        document.getElementById('synth-sound').textContent = Math.round(this.lastFrequency) + 'Hz';
        document.getElementById('synth-shape').textContent = this.lastShape;
        
        // Regenerate energy and reality
        this.energy = Math.min(100, this.energy + 0.05);
        this.reality = Math.min(100, this.reality + 0.02);
        
        // Reality glitch effect when low
        if (this.reality < 20) {
            document.getElementById('hud').classList.add('glitch');
        } else {
            document.getElementById('hud').classList.remove('glitch');
        }
    }

    updateSynesthesiaDisplay() {
        // Determine shape from frequency
        if (this.lastFrequency < 400) {
            this.lastShape = 'Circle';
        } else if (this.lastFrequency < 800) {
            this.lastShape = 'Square';
        } else {
            this.lastShape = 'Triangle';
        }
    }

    playTone(frequency, duration, volume = 0.1, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 3;
        filter.Q.value = 5;
        
        gainNode.gain.value = volume;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
        
        this.activeOscillators.push(oscillator);
    }

    animate() {
        this.time++;
        
        this.updateParticles();
        this.updateGravityWells();
        this.updateTimeDistortions();
        this.updateMemoryEchoes();
        this.draw();
        this.updateHUD();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the ultimate experience
window.addEventListener('load', () => {
    new SynesthesiaEngine();
});
