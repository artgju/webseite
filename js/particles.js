// Network Particle Animation for Hero Background - Performance Optimized
class NetworkAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d', { alpha: true }); // Enable transparency
        this.particles = [];
        this.particleCount = 60;
        this.maxDistance = 120;
        this.mouse = { x: null, y: null, radius: 120 };
        this.animationId = null;
        this.isVisible = true;
        this.lastFrameTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        
        this.init();
        this.animate();
        this.addEventListeners();
        this.setupVisibilityDetection();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        // Set actual size in memory (scaled to account for DPR)
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        // Normalize coordinate system to use CSS pixels
        this.ctx.scale(dpr, dpr);
        
        // Set display size
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Store dimensions for use in drawing
        this.width = rect.width;
        this.height = rect.height;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.3, // Slower movement
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 1
            });
        }
    }
    
    drawParticles() {
        // Batch drawing for performance
        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    connectParticles() {
        // Optimize: Only check nearby particles, skip if too many connections
        let connectionCount = 0;
        const maxConnections = 100; // Limit total connections
        
        for (let i = 0; i < this.particles.length && connectionCount < maxConnections; i++) {
            for (let j = i + 1; j < this.particles.length && connectionCount < maxConnections; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.maxDistance) {
                    const opacity = 1 - (distance / this.maxDistance);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.25})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    connectionCount++;
                }
            }
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Optimized mouse interaction - only if mouse is active
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distanceSquared = dx * dx + dy * dy; // Avoid sqrt for performance
                const radiusSquared = this.mouse.radius * this.mouse.radius;
                
                if (distanceSquared < radiusSquared) {
                    const distance = Math.sqrt(distanceSquared);
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.x -= (dx / distance) * force * 1.5;
                    particle.y -= (dy / distance) * force * 1.5;
                }
            }
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.height, particle.y));
            }
        });
    }
    
    animate(currentTime = 0) {
        // Stop animation if not visible
        if (!this.isVisible) {
            this.animationId = null;
            return;
        }
        
        // FPS throttling for consistent performance
        const elapsed = currentTime - this.lastFrameTime;
        
        if (elapsed > this.frameInterval) {
            this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
            
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawParticles();
            this.connectParticles();
            this.updateParticles();
        }
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    setupVisibilityDetection() {
        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible && !this.animationId) {
                this.animate();
            }
        });
        
        // Pause animation when hero is out of viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible && !this.animationId) {
                    this.animate();
                }
            });
        }, { threshold: 0 });
        
        if (this.canvas.parentElement) {
            observer.observe(this.canvas.parentElement);
        }
    }
    
    addEventListeners() {
        // Debounced resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 250);
        });
        
        // Throttled mousemove
        let mouseTimeout;
        this.canvas.addEventListener('mousemove', (e) => {
            if (mouseTimeout) return;
            
            mouseTimeout = setTimeout(() => {
                mouseTimeout = null;
            }, 16); // ~60fps
            
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    // Cleanup method
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles = [];
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NetworkAnimation('particleCanvas');
});
