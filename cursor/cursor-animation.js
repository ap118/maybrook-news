// Animated Cursor Implementation
// Uses sprite sheet for cross-browser compatibility

class AnimatedCursor {
    constructor() {
        this.cursor = null;
        this.currentFrame = 0;
        this.totalFrames = 6; // Updated to match the actual sprite sheet
        this.animationSpeed = 100; // Milliseconds between frames
        this.animationInterval = null;
        this.isVisible = false;
        
        // Responsive sizing
        this.isLargeScreen = window.innerWidth >= 768;
        this.frameWidth = this.isLargeScreen ? 128 : 32;
        this.frameHeight = this.isLargeScreen ? 128 : 32;
        this.spriteSheetPath = this.isLargeScreen ? 
            'cursor/running_child_6frames_sprite.png' : 
            'cursor/running_child_6frames_32px_sprite.png';
        
        this.init();
    }
    
    init() {
        // Create cursor element
        this.createCursorElement();
        
        // Load sprite sheet
        this.loadSpriteSheet();
        
        // Add event listeners
        this.addEventListeners();
        
        // Start animation
        this.startAnimation();
    }
    
    createCursorElement() {
        this.cursor = document.createElement('div');
        this.cursor.id = 'animated-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: ${this.frameWidth}px;
            height: ${this.frameHeight}px;
            pointer-events: none;
            z-index: 9999;
            background-size: ${this.frameWidth * this.totalFrames}px ${this.frameHeight}px;
            background-repeat: no-repeat;
            background-position: 0 0;
            transform: translate(-50%, -50%);
            display: none;
        `;
        
        document.body.appendChild(this.cursor);
    }
    
    loadSpriteSheet() {
        const spriteSheet = new Image();
        spriteSheet.onload = () => {
            this.cursor.style.backgroundImage = `url('${spriteSheet.src}')`;
            this.cursor.style.display = 'block';
            this.isVisible = true;
            // Add class to body to indicate JavaScript cursor is active
            document.body.classList.add('js-cursor-active');
        };
        spriteSheet.onerror = () => {
            console.warn('Failed to load cursor sprite sheet, falling back to default cursor');
            this.destroy();
        };
        spriteSheet.src = this.spriteSheetPath;
    }
    
    addEventListeners() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            if (this.cursor && this.isVisible) {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
            }
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            if (this.cursor) {
                this.cursor.style.display = 'none';
            }
        });
        
        // Show cursor when entering window
        document.addEventListener('mouseenter', () => {
            if (this.cursor && this.isVisible) {
                this.cursor.style.display = 'block';
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Check if we need to switch sprite sheets
            const newIsLargeScreen = window.innerWidth >= 768;
            if (newIsLargeScreen !== this.isLargeScreen) {
                // Recreate cursor with new size
                this.isLargeScreen = newIsLargeScreen;
                this.frameWidth = this.isLargeScreen ? 128 : 32;
                this.frameHeight = this.isLargeScreen ? 128 : 32;
                this.spriteSheetPath = this.isLargeScreen ? 
                    'cursor/running_child_6frames_sprite.png' : 
                    'cursor/running_child_6frames_32px_sprite.png';
                
                // Recreate cursor element
                if (this.cursor && this.cursor.parentNode) {
                    this.cursor.parentNode.removeChild(this.cursor);
                }
                this.createCursorElement();
                this.loadSpriteSheet();
            }
            
            // Ensure cursor stays within bounds
            if (this.cursor && this.isVisible) {
                const rect = this.cursor.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    this.cursor.style.left = (window.innerWidth - this.frameWidth / 2) + 'px';
                }
                if (rect.bottom > window.innerHeight) {
                    this.cursor.style.top = (window.innerHeight - this.frameHeight / 2) + 'px';
                }
            }
        });
    }
    
    startAnimation() {
        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            const xOffset = -(this.currentFrame * this.frameWidth);
            this.cursor.style.backgroundPosition = `${xOffset}px 0`;
        }, this.animationSpeed);
    }
    
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
    
    destroy() {
        this.stopAnimation();
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        
        // Remove the js-cursor-active class
        document.body.classList.remove('js-cursor-active');
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseleave', this.handleMouseLeave);
        document.removeEventListener('mouseenter', this.handleMouseEnter);
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize the animated cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        new AnimatedCursor();
    }
});

// Also try initializing on window load as a fallback
window.addEventListener('load', () => {
    // If cursor element doesn't exist after 2 seconds, try to initialize again
    setTimeout(() => {
        const cursorElement = document.getElementById('animated-cursor');
        if (!cursorElement) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion) {
                new AnimatedCursor();
            }
        }
    }, 2000);
}); 