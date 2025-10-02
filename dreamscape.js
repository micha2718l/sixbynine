// Neural Dreamscape Composer - Where Sound Becomes Life
// A revolutionary audio-visual synthesis engine

class NeuralDreamscape {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.audioContext = null;
        this.masterGain = null;
        
        this.creatures = [];
        this.notes = [];
        this.recording = [];
        this.isRecording = false;
        this.isPlaying = false;
        this.playbackTime = 0;
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.isDrawing = false;
        this.lastNoteTime = 0;
        this.drawMode = 'draw'; // 'draw', 'erase', 'attract', 'repel'
        
        this.scale = [0, 2, 4, 5, 7, 9, 11, 12]; // Major scale
        this.scaleNames = ['Major', 'Minor', 'Pentatonic', 'Blues', 'Chromatic'];
        this.currentScale = 0;
        
        this.time = 0;
        this.energy = 100;
        this.particles = []; // Visual effects particles
        this.soundWaves = []; // Sound visualization
        this.creatureTrails = []; // Trails left by creatures
        this.godMode = false; // Special mode for ecosystem control
        
        this.resize();
        this.initAudio();
        this.setupEventListeners();
        this.animate();
        
        setTimeout(() => {
            document.getElementById('loading').classList.add('fade-out');
        }, 1000);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.audioContext.destination);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            this.handleDrawing(e.clientX, e.clientY);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if (this.isDrawing) {
                this.handleDrawing(e.clientX, e.clientY);
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isDrawing = false;
        });
        
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.clear();
            } else if (e.code === 'KeyR') {
                this.toggleRecording();
            } else if (e.code === 'KeyP') {
                this.playRecording();
            } else if (e.code === 'KeyM') {
                this.cycleMode();
            } else if (e.code === 'KeyG') {
                this.toggleGodMode();
            } else if (e.code === 'Digit1') this.setScale(0);
            else if (e.code === 'Digit2') this.setScale(1);
            else if (e.code === 'Digit3') this.setScale(2);
            else if (e.code === 'Digit4') this.setScale(3);
            else if (e.code === 'Digit5') this.setScale(4);
        });
        
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());
        document.getElementById('record-btn').addEventListener('click', () => this.toggleRecording());
        document.getElementById('play-btn').addEventListener('click', () => this.playRecording());
        document.getElementById('mode-btn').addEventListener('click', () => this.cycleMode());
    }

    setScale(index) {
        this.currentScale = index;
        const scales = [
            [0, 2, 4, 5, 7, 9, 11, 12],        // Major
            [0, 2, 3, 5, 7, 8, 10, 12],        // Natural Minor
            [0, 2, 4, 7, 9, 12],                // Major Pentatonic
            [0, 3, 5, 6, 7, 10, 12],            // Blues
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // Chromatic
        ];
        this.scale = scales[index];
    }

    cycleMode() {
        const modes = ['draw', 'erase', 'attract', 'repel'];
        const currentIndex = modes.indexOf(this.drawMode);
        this.drawMode = modes[(currentIndex + 1) % modes.length];
        document.getElementById('mode-btn').textContent = `MODE: ${this.drawMode.toUpperCase()}`;
        document.getElementById('current-mode').textContent = this.drawMode.toUpperCase();
    }

    toggleGodMode() {
        this.godMode = !this.godMode;
        if (this.godMode) {
            document.body.style.cursor = 'grab';
            this.playNote(1000, 0.3, 0.1);
            this.playNote(1500, 0.3, 0.08);
        } else {
            document.body.style.cursor = 'crosshair';
            this.playNote(500, 0.2, 0.08);
        }
    }

    handleDrawing(x, y) {
        const now = Date.now();
        
        if (this.godMode) {
            this.godModeAction(x, y);
            return;
        }
        
        if (this.drawMode === 'erase') {
            this.eraseNear(x, y);
            return;
        } else if (this.drawMode === 'attract' || this.drawMode === 'repel') {
            this.influenceCreatures(x, y);
            return;
        }
        
        // Create note only if enough time has passed
        if (now - this.lastNoteTime > 100) {
            this.createNote(x, y);
            this.lastNoteTime = now;
        }
    }

    godModeAction(x, y) {
        // In god mode, you can bless creatures (give energy) or create instant ecosystems
        this.creatures.forEach(creature => {
            const dist = Math.hypot(creature.x - x, creature.y - y);
            if (dist < 100) {
                creature.energy = Math.min(1, creature.energy + 0.1);
                creature.maxAge += 50;
                creature.size = Math.min(creature.size + 2, 50);
            }
        });
        
        // Create a burst of harmonic creatures
        if (Math.random() < 0.1) {
            const baseFreq = 200 + Math.random() * 400;
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2;
                const distance = 30;
                this.spawnCreature(
                    x + Math.cos(angle) * distance,
                    y + Math.sin(angle) * distance,
                    baseFreq * Math.pow(1.5, i) // Harmonic series
                );
            }
            this.playNote(baseFreq, 0.5, 0.08);
        }
    }

    createNote(x, y) {
        // Convert Y position to musical note
        const noteRange = 36; // 3 octaves
        const noteIndex = Math.floor((1 - y / this.canvas.height) * noteRange);
        const scaleIndex = noteIndex % this.scale.length;
        const octave = Math.floor(noteIndex / this.scale.length);
        const midiNote = 48 + octave * 12 + this.scale[scaleIndex]; // Start from C3
        
        const frequency = this.midiToFreq(midiNote);
        
        const note = {
            x, y,
            frequency,
            age: 0,
            maxAge: 180,
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            hue: (midiNote * 10) % 360,
            size: 8 + Math.random() * 4
        };
        
        this.notes.push(note);
        this.playNote(frequency, 0.5, 0.1);
        
        // Create sound wave visualization
        this.createSoundWave(x, y, frequency);
        
        // Create particle burst
        this.createParticleBurst(x, y, note.hue);
        
        // Maybe spawn a creature
        if (Math.random() < 0.15) {
            this.spawnCreature(x, y, frequency);
        }
        
        // Record if recording
        if (this.isRecording) {
            this.recording.push({
                time: this.time,
                x, y,
                frequency
            });
        }
        
        this.energy = Math.max(0, this.energy - 0.5);
    }

    createSoundWave(x, y, frequency) {
        this.soundWaves.push({
            x, y,
            radius: 0,
            maxRadius: 100 + (frequency / 1000) * 50,
            hue: (frequency / 10) % 360,
            age: 0,
            maxAge: 60
        });
    }

    createParticleBurst(x, y, hue) {
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                hue: hue + (Math.random() - 0.5) * 60,
                size: 2 + Math.random() * 3,
                life: 1,
                decay: 0.02 + Math.random() * 0.02
            });
        }
    }

    spawnCreature(x, y, frequency) {
        const creature = {
            x, y,
            frequency,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: 15 + Math.random() * 15,
            hue: (frequency / 10) % 360,
            age: 0,
            maxAge: 600 + Math.random() * 400,
            genes: {
                speed: Math.random() * 2 + 0.5,
                attraction: Math.random() * 2 - 1,
                harmony: Math.random(),
                complexity: Math.random()
            },
            tentacles: [],
            energy: 1
        };
        
        // Generate tentacles (DNA strands)
        const tentCount = 3 + Math.floor(creature.genes.complexity * 5);
        for (let i = 0; i < tentCount; i++) {
            creature.tentacles.push({
                angle: (i / tentCount) * Math.PI * 2,
                length: creature.size * (0.5 + Math.random() * 0.5),
                wave: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.1 + 0.05
            });
        }
        
        this.creatures.push(creature);
    }

    eraseNear(x, y) {
        const radius = 50;
        this.notes = this.notes.filter(note => {
            const dist = Math.hypot(note.x - x, note.y - y);
            return dist > radius;
        });
        
        this.creatures = this.creatures.filter(creature => {
            const dist = Math.hypot(creature.x - x, creature.y - y);
            if (dist < radius) {
                this.playNote(creature.frequency * 0.5, 0.2, 0.05);
            }
            return dist > radius;
        });
    }

    influenceCreatures(x, y) {
        const radius = 150;
        const force = this.drawMode === 'attract' ? 0.5 : -0.5;
        
        this.creatures.forEach(creature => {
            const dx = x - creature.x;
            const dy = y - creature.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < radius && dist > 0) {
                const strength = (radius - dist) / radius * force;
                creature.vx += (dx / dist) * strength;
                creature.vy += (dy / dist) * strength;
            }
        });
    }

    midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    playNote(frequency, duration, volume = 0.1) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 4;
        filter.Q.value = 5;
        
        gainNode.gain.value = volume;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    updateNotes() {
        this.notes = this.notes.filter(note => {
            note.age++;
            note.x += note.velocity.x;
            note.y += note.velocity.y;
            
            // Gentle gravity
            note.velocity.y += 0.02;
            
            // Friction
            note.velocity.x *= 0.99;
            note.velocity.y *= 0.99;
            
            // Bounds
            if (note.x < 0 || note.x > this.canvas.width) note.velocity.x *= -0.8;
            if (note.y < 0 || note.y > this.canvas.height) note.velocity.y *= -0.8;
            
            note.x = Math.max(0, Math.min(this.canvas.width, note.x));
            note.y = Math.max(0, Math.min(this.canvas.height, note.y));
            
            return note.age < note.maxAge;
        });
    }

    updateCreatures() {
        this.creatures = this.creatures.filter(creature => {
            creature.age++;
            
            // Update tentacles
            creature.tentacles.forEach(tent => {
                tent.wave += tent.speed;
            });
            
            // Creature AI - interaction with other creatures
            this.creatures.forEach(other => {
                if (other === creature) return;
                
                const dx = other.x - creature.x;
                const dy = other.y - creature.y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < 100 && dist > 0) {
                    // Harmony check - similar frequencies attract
                    const freqDiff = Math.abs(creature.frequency - other.frequency);
                    const harmony = 1 - Math.min(freqDiff / 500, 1);
                    
                    if (harmony > 0.7) {
                        // Attraction
                        const force = creature.genes.attraction * 0.1 * harmony;
                        creature.vx += (dx / dist) * force;
                        creature.vy += (dy / dist) * force;
                        
                        // Play harmony note occasionally
                        if (Math.random() < 0.01) {
                            this.playNote((creature.frequency + other.frequency) / 2, 0.3, 0.05);
                        }
                        
                        // Very close and harmonic = REPRODUCE!
                        if (dist < 50 && Math.random() < 0.002) {
                            this.reproduceCreatures(creature, other);
                        }
                    } else {
                        // Repulsion
                        const force = 0.2;
                        creature.vx -= (dx / dist) * force;
                        creature.vy -= (dy / dist) * force;
                    }
                }
            });
            
            // Random walk
            creature.vx += (Math.random() - 0.5) * 0.2;
            creature.vy += (Math.random() - 0.5) * 0.2;
            
            // Speed limit
            const speed = Math.hypot(creature.vx, creature.vy);
            if (speed > creature.genes.speed * 3) {
                creature.vx = (creature.vx / speed) * creature.genes.speed * 3;
                creature.vy = (creature.vy / speed) * creature.genes.speed * 3;
            }
            
            creature.x += creature.vx;
            creature.y += creature.vy;
            
            // Leave a trail
            if (this.time % 3 === 0) {
                this.creatureTrails.push({
                    x: creature.x,
                    y: creature.y,
                    hue: creature.hue,
                    life: 1,
                    size: creature.size * 0.3
                });
            }
            
            // Bounce off walls
            if (creature.x < 0 || creature.x > this.canvas.width) {
                creature.vx *= -0.8;
                creature.x = Math.max(0, Math.min(this.canvas.width, creature.x));
            }
            if (creature.y < 0 || creature.y > this.canvas.height) {
                creature.vy *= -0.8;
                creature.y = Math.max(0, Math.min(this.canvas.height, creature.y));
            }
            
            // Energy decay
            creature.energy *= 0.998;
            
            return creature.age < creature.maxAge && creature.energy > 0.1;
        });
    }

    reproduceCreatures(parent1, parent2) {
        // Create offspring with mixed genes!
        const childX = (parent1.x + parent2.x) / 2;
        const childY = (parent1.y + parent2.y) / 2;
        const childFreq = (parent1.frequency + parent2.frequency) / 2;
        
        const child = {
            x: childX,
            y: childY,
            frequency: childFreq,
            vx: (parent1.vx + parent2.vx) / 2,
            vy: (parent1.vy + parent2.vy) / 2,
            size: (parent1.size + parent2.size) / 2 + Math.random() * 5,
            hue: ((parent1.hue + parent2.hue) / 2) % 360,
            age: 0,
            maxAge: 700 + Math.random() * 300,
            genes: {
                speed: (parent1.genes.speed + parent2.genes.speed) / 2 + (Math.random() - 0.5) * 0.3,
                attraction: (parent1.genes.attraction + parent2.genes.attraction) / 2 + (Math.random() - 0.5) * 0.2,
                harmony: (parent1.genes.harmony + parent2.genes.harmony) / 2,
                complexity: (parent1.genes.complexity + parent2.genes.complexity) / 2 + (Math.random() - 0.5) * 0.2
            },
            tentacles: [],
            energy: 1
        };
        
        // Inherit tentacle structure
        const tentCount = 3 + Math.floor(child.genes.complexity * 5);
        for (let i = 0; i < tentCount; i++) {
            child.tentacles.push({
                angle: (i / tentCount) * Math.PI * 2,
                length: child.size * (0.5 + Math.random() * 0.5),
                wave: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.1 + 0.05
            });
        }
        
        this.creatures.push(child);
        
        // Play birth sound!
        this.playNote(childFreq * 2, 0.2, 0.08);
        this.playNote(childFreq, 0.3, 0.08);
        
        // Create birth particle effect
        this.createParticleBurst(childX, childY, child.hue);
        this.createParticleBurst(childX, childY, child.hue);
    }

    updateParticles() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life -= p.decay;
            return p.life > 0;
        });
    }

    updateSoundWaves() {
        this.soundWaves = this.soundWaves.filter(w => {
            w.age++;
            w.radius = (w.age / w.maxAge) * w.maxRadius;
            return w.age < w.maxAge;
        });
    }

    updateCreatureTrails() {
        this.creatureTrails = this.creatureTrails.filter(t => {
            t.life -= 0.01;
            return t.life > 0;
        });
    }

    drawNotes() {
        this.notes.forEach(note => {
            const life = 1 - note.age / note.maxAge;
            const alpha = life * 0.8;
            
            // Glow
            const gradient = this.ctx.createRadialGradient(
                note.x, note.y, 0,
                note.x, note.y, note.size * 2
            );
            gradient.addColorStop(0, `hsla(${note.hue}, 100%, 60%, ${alpha})`);
            gradient.addColorStop(0.5, `hsla(${note.hue}, 100%, 50%, ${alpha * 0.5})`);
            gradient.addColorStop(1, `hsla(${note.hue}, 100%, 40%, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(note.x, note.y, note.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core
            this.ctx.fillStyle = `hsla(${note.hue}, 100%, 80%, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(note.x, note.y, note.size * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawCreatures() {
        this.creatures.forEach(creature => {
            const life = 1 - creature.age / creature.maxAge;
            
            // Draw DNA spiral
            this.ctx.save();
            this.ctx.translate(creature.x, creature.y);
            
            // Outer aura
            const auraGradient = this.ctx.createRadialGradient(
                0, 0, 0,
                0, 0, creature.size * 2
            );
            auraGradient.addColorStop(0, `hsla(${creature.hue}, 80%, 50%, ${creature.energy * 0.2})`);
            auraGradient.addColorStop(1, `hsla(${creature.hue}, 80%, 50%, 0)`);
            
            this.ctx.fillStyle = auraGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, creature.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw tentacles (DNA strands)
            creature.tentacles.forEach((tent, i) => {
                const angle = tent.angle + Math.sin(tent.wave) * 0.5;
                const length = tent.length * (1 + Math.sin(tent.wave * 2) * 0.2);
                
                const endX = Math.cos(angle) * length;
                const endY = Math.sin(angle) * length;
                
                // DNA strand
                this.ctx.strokeStyle = `hsla(${(creature.hue + i * 30) % 360}, 90%, 60%, ${creature.energy * 0.8})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                
                // Wavy line
                const segments = 8;
                for (let j = 1; j <= segments; j++) {
                    const t = j / segments;
                    const x = endX * t;
                    const y = endY * t;
                    const wave = Math.sin(tent.wave + t * Math.PI * 4) * 5;
                    const perpX = -Math.sin(angle) * wave;
                    const perpY = Math.cos(angle) * wave;
                    this.ctx.lineTo(x + perpX, y + perpY);
                }
                this.ctx.stroke();
                
                // End particle
                this.ctx.fillStyle = `hsla(${(creature.hue + i * 30) % 360}, 100%, 70%, ${creature.energy})`;
                this.ctx.beginPath();
                this.ctx.arc(endX, endY, 3, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            // Core body
            const coreGradient = this.ctx.createRadialGradient(
                0, 0, 0,
                0, 0, creature.size * 0.8
            );
            coreGradient.addColorStop(0, `hsla(${creature.hue}, 100%, 80%, ${creature.energy})`);
            coreGradient.addColorStop(0.6, `hsla(${creature.hue}, 100%, 60%, ${creature.energy * 0.8})`);
            coreGradient.addColorStop(1, `hsla(${creature.hue}, 100%, 40%, 0)`);
            
            this.ctx.fillStyle = coreGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, creature.size * 0.8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner pulse
            const pulseSize = creature.size * 0.3 * (1 + Math.sin(this.time * 0.1) * 0.2);
            this.ctx.fillStyle = `hsla(${creature.hue}, 100%, 90%, ${creature.energy * 0.9})`;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawBackground() {
        // Subtle fade instead of clear
        this.ctx.fillStyle = 'rgba(10, 0, 21, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid based on current scale
        this.ctx.strokeStyle = 'rgba(100, 50, 200, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = this.canvas.height / 36; // 3 octaves
        for (let i = 0; i < 36; i++) {
            const y = this.canvas.height - (i * gridSize);
            const noteIndex = i % this.scale.length;
            const alpha = noteIndex === 0 ? 0.2 : 0.05;
            this.ctx.strokeStyle = `rgba(100, 50, 200, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawSoundWaves() {
        this.soundWaves.forEach(w => {
            const life = 1 - w.age / w.maxAge;
            const alpha = life * 0.6;
            
            this.ctx.strokeStyle = `hsla(${w.hue}, 80%, 60%, ${alpha})`;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Inner ring
            this.ctx.strokeStyle = `hsla(${w.hue}, 100%, 80%, ${alpha * 0.5})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(w.x, w.y, w.radius * 0.8, 0, Math.PI * 2);
            this.ctx.stroke();
        });
    }

    drawParticles() {
        this.particles.forEach(p => {
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size * 2
            );
            gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.life})`);
            gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawCreatureTrails() {
        this.creatureTrails.forEach(t => {
            this.ctx.fillStyle = `hsla(${t.hue}, 70%, 50%, ${t.life * 0.3})`;
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    updateUI() {
        document.getElementById('creature-count').textContent = this.creatures.length;
        document.getElementById('note-count').textContent = this.notes.length;
        
        // Calculate harmony
        let harmonyScore = 0;
        if (this.creatures.length > 1) {
            let harmonies = 0;
            for (let i = 0; i < this.creatures.length; i++) {
                for (let j = i + 1; j < this.creatures.length; j++) {
                    const freqDiff = Math.abs(this.creatures[i].frequency - this.creatures[j].frequency);
                    if (freqDiff < 100) harmonies++;
                }
            }
            harmonyScore = Math.min(100, (harmonies / this.creatures.length) * 50);
        }
        document.getElementById('harmony-level').textContent = `${Math.round(harmonyScore)}%`;
        
        // Energy regeneration
        this.energy = Math.min(100, this.energy + 0.1);
        document.getElementById('energy-level').textContent = `${Math.round(this.energy)}%`;
        
        // Update creature list
        const listDiv = document.getElementById('creature-list');
        listDiv.innerHTML = '<div style="margin-bottom: 10px; font-weight: bold;">🧬 CREATURES:</div>';
        this.creatures.slice(0, 5).forEach((c, i) => {
            const life = Math.round((1 - c.age / c.maxAge) * 100);
            const freq = Math.round(c.frequency);
            listDiv.innerHTML += `
                <div class="creature-info">
                    #${i + 1} ${freq}Hz<br>
                    Life: ${life}% Energy: ${Math.round(c.energy * 100)}%
                </div>
            `;
        });
    }

    toggleRecording() {
        this.isRecording = !this.isRecording;
        const btn = document.getElementById('record-btn');
        
        if (this.isRecording) {
            this.recording = [];
            this.time = 0;
            btn.classList.add('recording');
            btn.textContent = 'STOP REC';
        } else {
            btn.classList.remove('recording');
            btn.textContent = 'RECORD';
        }
    }

    playRecording() {
        if (this.recording.length === 0 || this.isPlaying) return;
        
        this.isPlaying = true;
        this.playbackTime = 0;
        const btn = document.getElementById('play-btn');
        btn.textContent = 'PLAYING...';
        
        const playInterval = setInterval(() => {
            const notesToPlay = this.recording.filter(
                note => Math.abs(note.time - this.playbackTime) < 5
            );
            
            notesToPlay.forEach(note => {
                this.createNote(note.x, note.y);
            });
            
            this.playbackTime += 5;
            
            const maxTime = Math.max(...this.recording.map(n => n.time));
            if (this.playbackTime > maxTime) {
                clearInterval(playInterval);
                this.isPlaying = false;
                btn.textContent = 'PLAY';
            }
        }, 50);
    }

    clear() {
        this.notes = [];
        this.creatures = [];
        this.particles = [];
        this.soundWaves = [];
        this.creatureTrails = [];
        this.recording = [];
        this.time = 0;
        this.energy = 100;
    }

    animate() {
        this.time++;
        
        this.drawBackground();
        this.updateSoundWaves();
        this.updateParticles();
        this.updateCreatureTrails();
        this.updateNotes();
        this.updateCreatures();
        this.drawCreatureTrails();
        this.drawSoundWaves();
        this.drawParticles();
        this.drawNotes();
        this.drawCreatures();
        this.updateUI();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    new NeuralDreamscape();
});
