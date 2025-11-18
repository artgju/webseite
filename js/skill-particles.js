// Skill Bar Particle Effects - Performance Optimized
class SkillParticles {
    constructor() {
        this.activeIntervals = new Map();
        this.particlePools = new Map(); // Reuse DOM elements
        this.maxParticlesPerBar = 15; // Limit per bar
        this.init();
    }
    
    init() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startParticlesForBar(entry.target);
                } else {
                    this.stopParticlesForBar(entry.target);
                }
            });
        }, { threshold: 0.3, rootMargin: '50px' });
        
        skillBars.forEach(bar => observer.observe(bar));
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }
    
    startParticlesForBar(bar) {
        // Stop any existing interval for this bar
        this.stopParticlesForBar(bar);
        
        // Create particle container if not exists
        let container = bar.querySelector('.skill-particles');
        if (!container) {
            container = document.createElement('div');
            container.className = 'skill-particles';
            container.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: visible;
                z-index: 10;
            `;
            
            bar.style.position = 'relative';
            bar.appendChild(container);
            this.particlePools.set(container, []);
        }
        
        // Generate particles with performance throttling
        const interval = setInterval(() => {
            if (bar.offsetParent !== null) {
                const pool = this.particlePools.get(container) || [];
                if (pool.length < this.maxParticlesPerBar) {
                    this.generateParticle(container, bar);
                }
            }
        }, 400);
        
        this.activeIntervals.set(bar, interval);
    }
    
    stopParticlesForBar(bar) {
        const interval = this.activeIntervals.get(bar);
        if (interval) {
            clearInterval(interval);
            this.activeIntervals.delete(bar);
        }
        
        // Clean up particles
        const container = bar.querySelector('.skill-particles');
        if (container) {
            const pool = this.particlePools.get(container);
            if (pool) {
                pool.forEach(p => {
                    if (p.timeout) clearTimeout(p.timeout);
                    if (p.element && p.element.parentNode) {
                        p.element.remove();
                    }
                });
                this.particlePools.set(container, []);
            }
        }
    }
    
    generateParticle(container, bar) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 2;
        const startX = Math.random() * 100;
        const hue = Math.random() * 30 + 180;
        const animationDuration = Math.random() * 1.5 + 1.5;
        
        // Use transform for GPU acceleration
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, hsl(${hue}, 100%, 60%) 0%, transparent 70%);
            border-radius: 50%;
            left: ${startX}%;
            top: 50%;
            box-shadow: 0 0 ${size * 1.5}px hsl(${hue}, 100%, 60%);
            animation: particleFly${Math.floor(Math.random() * 3)} ${animationDuration}s ease-out forwards;
            pointer-events: none;
            opacity: 0.7;
            will-change: transform, opacity;
        `;
        
        container.appendChild(particle);
        
        // Track particle in pool
        const pool = this.particlePools.get(container) || [];
        const particleData = {
            element: particle,
            timeout: setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
                // Remove from pool
                const index = pool.indexOf(particleData);
                if (index > -1) {
                    pool.splice(index, 1);
                }
            }, animationDuration * 1000)
        };
        pool.push(particleData);
        this.particlePools.set(container, pool);
    }
    
    cleanup() {
        // Clear all intervals
        this.activeIntervals.forEach(interval => clearInterval(interval));
        this.activeIntervals.clear();
        
        // Clear all particles
        this.particlePools.forEach(pool => {
            pool.forEach(p => {
                if (p.timeout) clearTimeout(p.timeout);
                if (p.element && p.element.parentNode) {
                    p.element.remove();
                }
            });
        });
        this.particlePools.clear();
    }
}

// Add particle animation CSS with subtle variations
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFly0 {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
        }
        100% {
            transform: translate(25px, -60px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes particleFly1 {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
        }
        100% {
            transform: translate(-20px, -50px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes particleFly2 {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
        }
        100% {
            transform: translate(15px, -70px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SkillParticles();
    });
} else {
    new SkillParticles();
}
