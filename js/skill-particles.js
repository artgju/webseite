// Skill Bar Particle Effects - Enhanced Version
class SkillParticles {
    constructor() {
        this.particles = [];
        this.activeIntervals = new Map();
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
        }, { threshold: 0.3 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }
    
    startParticlesForBar(bar) {
        // Stop any existing interval for this bar
        this.stopParticlesForBar(bar);
        
        const rect = bar.getBoundingClientRect();
        
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
        }
        
        // Generate particles periodically - subtle and professional
        const interval = setInterval(() => {
            if (bar.offsetParent !== null) {
                // Generate only 1 particle at a time
                this.generateParticle(container, bar);
            }
        }, 400); // Less frequent
        
        this.activeIntervals.set(bar, interval);
    }
    
    stopParticlesForBar(bar) {
        const interval = this.activeIntervals.get(bar);
        if (interval) {
            clearInterval(interval);
            this.activeIntervals.delete(bar);
        }
    }
    
    generateParticle(container, bar) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 2; // Smaller particles (2-5px)
        const startX = Math.random() * 100;
        const hue = Math.random() * 30 + 180; // Narrower blue-cyan range
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, hsl(${hue}, 100%, 60%) 0%, transparent 70%);
            border-radius: 50%;
            left: ${startX}%;
            top: 50%;
            box-shadow: 0 0 ${size * 1.5}px hsl(${hue}, 100%, 60%);
            animation: particleFly${Math.floor(Math.random() * 3)} ${Math.random() * 1.5 + 1.5}s ease-out forwards;
            pointer-events: none;
            opacity: 0.7;
        `;
        
        container.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 3000);
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
