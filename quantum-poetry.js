// Quantum Poetry Visualizer - A unique generative art experience
// Every moment is unique, influenced by chaos and user interaction

class QuantumField {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;
        this.audioContext = null;
        this.oscillators = [];
        
        // Quantum state parameters
        this.entropy = Math.random();
        this.coherence = 0.5;
        this.resonance = 0;
        this.hueShift = 0;
        this.trailMode = false;
        
        this.resize();
        this.initAudio();
        this.setupEventListeners();
        this.createParticles();
        this.generatePoem();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Mouse position affects quantum state
            this.coherence = (e.clientX / window.innerWidth);
            this.entropy = (e.clientY / window.innerHeight);
        });

        let clickTimer = null;
        let clickCount = 0;
        
        window.addEventListener('click', (e) => {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    // Single click - energy burst
                    this.addEnergyBurst(e.clientX, e.clientY);
                    this.playTone(200 + this.entropy * 400, 0.1);
                    clickCount = 0;
                }, 250);
            } else {
                // Double click - create vortex
                clearTimeout(clickTimer);
                this.createVortex(e.clientX, e.clientY);
                this.playTone(300, 0.3, 'sawtooth', 0.08);
                clickCount = 0;
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.regenerate();
            } else if (e.code === 'KeyC') {
                // C key - create cosmic explosion
                this.cosmicExplosion();
            } else if (e.code === 'KeyT') {
                // T key - toggle trail mode
                this.trailMode = !this.trailMode;
                this.playTone(this.trailMode ? 600 : 400, 0.1);
            } else if (e.code === 'KeyH') {
                // H key - shift hue spectrum
                this.hueShift = (this.hueShift + 60) % 360;
                this.playTone(500 + this.hueShift, 0.1);
            } else if (e.code === 'KeyR') {
                // R key - reverse particle motion
                this.reverseParticles();
            }
        });
    }

    createParticles() {
        const count = 300;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                hue: Math.random() * 360,
                phase: Math.random() * Math.PI * 2,
                energy: Math.random()
            });
        }
    }

    addEnergyBurst(x, y) {
        // Add particles at click location
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                hue: this.resonance * 360,
                phase: this.time,
                energy: 1,
                lifetime: 100
            });
        }
        
        this.resonance += 0.1;
        if (this.resonance > 1) this.resonance = 0;
    }

    createVortex(x, y) {
        // Create spiral vortex of particles
        const numParticles = 60;
        for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * Math.PI * 4;
            const radius = i * 3;
            const speed = 2 + i * 0.1;
            
            this.particles.push({
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius,
                vx: Math.cos(angle + Math.PI / 2) * speed,
                vy: Math.sin(angle + Math.PI / 2) * speed,
                size: 3,
                hue: (angle * 180 / Math.PI) % 360,
                phase: angle,
                energy: 1 - (i / numParticles) * 0.5,
                lifetime: 150 - i
            });
        }
    }

    cosmicExplosion() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Clear existing particles and create massive explosion
        this.particles = [];
        
        for (let i = 0; i < 500; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 15 + 5;
            const distance = Math.random() * 100;
            
            this.particles.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 5 + 2,
                hue: Math.random() * 360,
                phase: angle,
                energy: 1,
                lifetime: 200 + Math.random() * 100
            });
        }
        
        // Play dramatic sound
        this.playTone(100, 0.5, 'sawtooth', 0.1);
        setTimeout(() => this.playTone(200, 0.4, 'sine', 0.08), 100);
        setTimeout(() => this.playTone(400, 0.3, 'triangle', 0.06), 200);
        
        // Regenerate poem with cosmic theme
        this.entropy = Math.random();
        this.coherence = Math.random();
        this.generatePoem();
    }

    reverseParticles() {
        // Reverse all particle velocities for dramatic effect
        this.particles.forEach(p => {
            p.vx *= -1.5;
            p.vy *= -1.5;
            p.energy = Math.min(1, p.energy + 0.3);
        });
        
        this.playTone(800, 0.2, 'square', 0.05);
    }

    updateParticles() {
        this.particles = this.particles.filter(p => {
            // Lorenz attractor influence
            const dx = 10 * (this.entropy - p.x / this.canvas.width);
            const dy = p.x / this.canvas.width * (28 - p.y / this.canvas.height) - p.y / this.canvas.height;
            const dz = p.x / this.canvas.width * p.y / this.canvas.height - 2.667 * this.coherence;
            
            // Apply quantum field effects
            p.vx += dx * 0.001 + Math.sin(this.time * 0.01 + p.phase) * 0.1;
            p.vy += dy * 0.001 + Math.cos(this.time * 0.01 + p.phase) * 0.1;
            
            // Mouse influence
            const distToMouse = Math.hypot(p.x - this.mouseX, p.y - this.mouseY);
            if (distToMouse < 200) {
                const angle = Math.atan2(p.y - this.mouseY, p.x - this.mouseX);
                const force = (200 - distToMouse) / 200;
                p.vx += Math.cos(angle) * force * 0.5;
                p.vy += Math.sin(angle) * force * 0.5;
            }
            
            // Damping
            p.vx *= 0.98;
            p.vy *= 0.98;
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // Update energy
            p.energy = Math.max(0, p.energy * 0.995);
            
            // Update hue
            p.hue = (p.hue + this.coherence * 0.5) % 360;
            
            // Lifetime check
            if (p.lifetime !== undefined) {
                p.lifetime--;
                return p.lifetime > 0;
            }
            
            return true;
        });
    }

    drawParticles() {
        // Create trailing effect with gradient fade
        const fadeAlpha = this.trailMode ? 0.02 : 0.1;
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, `rgba(0, 0, 10, ${fadeAlpha})`);
        gradient.addColorStop(1, `rgba(0, 0, 20, ${fadeAlpha * 0.5})`);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw energy field around mouse
        if (this.mouseX > 0 && this.mouseY > 0) {
            const mouseGradient = this.ctx.createRadialGradient(
                this.mouseX, this.mouseY, 0,
                this.mouseX, this.mouseY, 150
            );
            mouseGradient.addColorStop(0, `hsla(${this.time % 360}, 70%, 50%, 0.1)`);
            mouseGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = mouseGradient;
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, this.mouseY, 150, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw connections with color based on distance and quantum state
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    const hue = ((this.particles[i].hue + this.particles[j].hue) / 2 + this.hueShift) % 360;
                    this.ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${(120 - dist) / 120 * 0.4})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles with enhanced glow
        this.particles.forEach(p => {
            const glow = p.energy * 25 + 8;
            const adjustedHue = (p.hue + this.hueShift) % 360;
            
            // Outer glow
            const outerGradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow * 1.5);
            outerGradient.addColorStop(0, `hsla(${adjustedHue}, 90%, 70%, ${p.energy * 0.3 + 0.1})`);
            outerGradient.addColorStop(0.5, `hsla(${adjustedHue}, 80%, 60%, ${p.energy * 0.2})`);
            outerGradient.addColorStop(1, `hsla(${adjustedHue}, 80%, 60%, 0)`);
            
            this.ctx.fillStyle = outerGradient;
            this.ctx.globalAlpha = 1;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, glow * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner bright core
            const coreGradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow * 0.5);
            coreGradient.addColorStop(0, `hsla(${adjustedHue}, 100%, 90%, ${p.energy * 0.9 + 0.3})`);
            coreGradient.addColorStop(1, `hsla(${adjustedHue}, 100%, 70%, 0)`);
            
            this.ctx.fillStyle = coreGradient;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, glow * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // Quantum-inspired poetry generator
    generatePoem() {
        const poemContainer = document.getElementById('poem-container');
        poemContainer.innerHTML = '';
        
        // Use quantum state to seed poem generation
        const seed = this.entropy * 1000 + this.coherence * 1000 + Date.now() % 1000;
        
        const poem = this.createQuantumPoem(seed);
        
        poem.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'poem-line';
            lineDiv.textContent = line;
            lineDiv.style.animationDelay = `${index * 0.5}s`;
            poemContainer.appendChild(lineDiv);
        });
        
        // Play ambient tones for the poem
        setTimeout(() => this.playPoemSoundscape(), 500);
    }

    createQuantumPoem(seed) {
        // Pseudo-random generator based on seed
        let rng = seed;
        const random = () => {
            rng = (rng * 9301 + 49297) % 233280;
            return rng / 233280;
        };

        // Word banks organized by theme and emotion
        const subjects = [
            ['stars', 'waves', 'shadows', 'whispers', 'dreams', 'echoes', 'fragments', 'memories'],
            ['quantum', 'particle', 'photon', 'void', 'cosmos', 'nebula', 'singularity', 'horizon'],
            ['thoughts', 'moments', 'breaths', 'heartbeats', 'glances', 'silences', 'truths', 'mysteries']
        ];

        const verbs = [
            ['dance', 'shimmer', 'dissolve', 'emerge', 'resonate', 'spiral', 'cascade', 'illuminate'],
            ['collapse', 'entangle', 'superpose', 'observe', 'transform', 'oscillate', 'radiate', 'converge'],
            ['wander', 'drift', 'echo', 'linger', 'bloom', 'fade', 'transcend', 'awaken']
        ];

        const modifiers = [
            ['infinite', 'fleeting', 'ethereal', 'luminous', 'crystalline', 'ephemeral', 'pristine', 'boundless'],
            ['quantum', 'entangled', 'uncertain', 'coherent', 'resonant', 'harmonic', 'chaotic', 'sublime'],
            ['silent', 'gentle', 'fierce', 'tender', 'ancient', 'eternal', 'hidden', 'sacred']
        ];

        const objects = [
            ['dimensions', 'realms', 'spaces', 'fields', 'patterns', 'frequencies', 'wavelengths', 'spectra'],
            ['universes', 'realities', 'existences', 'possibilities', 'probabilities', 'states', 'forms', 'beings'],
            ['gardens', 'oceans', 'forests', 'skies', 'mountains', 'rivers', 'valleys', 'horizons']
        ];

        const conjunctions = [
            'through', 'within', 'beyond', 'between', 'among', 'across', 'beneath', 'above'
        ];

        const endings = [
            'into the unknown', 'toward infinity', 'through time eternal', 'beyond comprehension',
            'into pure light', 'through endless night', 'where nothing exists', 'where all begins',
            'until we forget', 'until we remember', 'as one becomes many', 'as many become one'
        ];

        // Generate structure based on quantum state
        const numLines = 4 + Math.floor(random() * 3);
        const poem = [];
        const theme = Math.floor(random() * 3);

        for (let i = 0; i < numLines; i++) {
            const structure = Math.floor(random() * 4);
            let line = '';

            switch (structure) {
                case 0:
                    // [modifier] [subject] [verb] [conjunction] [modifier] [objects]
                    line = `${this.chooseRandom(modifiers[theme], random)} ${this.chooseRandom(subjects[theme], random)} ` +
                           `${this.chooseRandom(verbs[theme], random)} ${this.chooseRandom(conjunctions, random)} ` +
                           `${this.chooseRandom(modifiers[(theme + 1) % 3], random)} ${this.chooseRandom(objects[theme], random)}`;
                    break;
                case 1:
                    // [subject] of [modifier] [objects] [verb]
                    line = `${this.chooseRandom(subjects[theme], random)} of ${this.chooseRandom(modifiers[theme], random)} ` +
                           `${this.chooseRandom(objects[theme], random)} ${this.chooseRandom(verbs[theme], random)}`;
                    break;
                case 2:
                    // where [modifier] [subjects] [verb] [conjunction] [objects]
                    line = `where ${this.chooseRandom(modifiers[theme], random)} ${this.chooseRandom(subjects[theme], random)} ` +
                           `${this.chooseRandom(verbs[theme], random)} ${this.chooseRandom(conjunctions, random)} ` +
                           `${this.chooseRandom(objects[theme], random)}`;
                    break;
                case 3:
                    // [verb] [conjunction] [modifier] [subjects], [verb] [ending]
                    line = `${this.chooseRandom(verbs[theme], random)} ${this.chooseRandom(conjunctions, random)} ` +
                           `${this.chooseRandom(modifiers[theme], random)} ${this.chooseRandom(subjects[theme], random)}`;
                    break;
            }

            // Capitalize first letter
            line = line.charAt(0).toUpperCase() + line.slice(1);
            poem.push(line);
        }

        // Add poetic ending
        if (random() > 0.5) {
            poem.push(this.chooseRandom(endings, random));
        }

        return poem;
    }

    chooseRandom(array, rng) {
        return array[Math.floor(rng() * array.length)];
    }

    playPoemSoundscape() {
        if (!this.audioContext) return;
        
        // Stop previous oscillators
        this.oscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {}
        });
        this.oscillators = [];

        // Create ambient soundscape based on quantum state
        const frequencies = [
            174 + this.entropy * 100,    // Root frequency
            261.63 * (1 + this.coherence * 0.5),  // Harmony 1
            329.63 * (1 + this.resonance * 0.5),  // Harmony 2
        ];

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 3, 'sine', 0.03);
            }, index * 500);
        });
    }

    playTone(frequency, duration, type = 'sine', volume = 0.1) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.value = volume;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);

        this.oscillators.push(oscillator);
    }

    updateQuantumStateDisplay() {
        const stateDiv = document.getElementById('quantum-state');
        stateDiv.innerHTML = `
            QUANTUM STATE<br>
            Entropy: ${(this.entropy * 100).toFixed(1)}%<br>
            Coherence: ${(this.coherence * 100).toFixed(1)}%<br>
            Resonance: ${(this.resonance * 100).toFixed(1)}%<br>
            Particles: ${this.particles.length}<br>
            Time: ${(this.time / 60).toFixed(1)}s
        `;
    }

    regenerate() {
        // Shift quantum state randomly
        this.entropy = Math.random();
        this.coherence = Math.random();
        this.resonance = Math.random();
        
        // Reset particles with new energy
        this.particles.forEach(p => {
            p.energy = Math.random();
            p.vx = (Math.random() - 0.5) * 3;
            p.vy = (Math.random() - 0.5) * 3;
        });
        
        this.generatePoem();
        this.playTone(440 + Math.random() * 220, 0.2, 'triangle', 0.15);
    }

    animate() {
        this.time++;
        this.updateParticles();
        this.drawParticles();
        this.updateQuantumStateDisplay();
        
        // Natural evolution of quantum state
        this.resonance = (this.resonance + 0.001) % 1;
        
        // Special bloom effect at resonance peaks
        if (Math.abs(this.resonance - 0.5) < 0.01 && this.time % 10 === 0) {
            this.createBloom();
        }
        
        requestAnimationFrame(() => this.animate());
    }

    createBloom() {
        // Create a beautiful bloom of particles from center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const speed = 3 + Math.random() * 2;
            
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 4,
                hue: (this.time + i * 30) % 360,
                phase: angle,
                energy: 0.8,
                lifetime: 150
            });
        }
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    new QuantumField();
});
