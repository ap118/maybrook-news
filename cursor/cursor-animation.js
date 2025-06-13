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
        this.isInIframe = false; // Track iframe state
        this.isIframeContext = window !== window.top; // Check if we're in an iframe
        
        // Use 64px sprite for quality, display at 32px size
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.displayWidth = 32;
        this.displayHeight = 32;
        this.spriteSheetPath = 'cursor/running_child_6frames_sprite.png';
        
        this.init();
    }
    
    init() {
        // If we're in an iframe, don't initialize the cursor to prevent conflicts
        if (this.isIframeContext) {
            return;
        }
        
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
            width: ${this.displayWidth}px;
            height: ${this.displayHeight}px;
            pointer-events: none;
            z-index: 9999;
            background-size: ${this.displayWidth * this.totalFrames}px ${this.displayHeight}px;
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
        
        // Handle iframe interactions
        this.handleIframeInteractions();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Ensure cursor stays within bounds
            if (this.cursor && this.isVisible) {
                const rect = this.cursor.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    this.cursor.style.left = (window.innerWidth - this.displayWidth / 2) + 'px';
                }
                if (rect.bottom > window.innerHeight) {
                    this.cursor.style.top = (window.innerHeight - this.displayHeight / 2) + 'px';
                }
            }
        });
    }
    
    handleIframeInteractions() {
        // Find all iframes in the document
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
            // Hide parent cursor when mouse enters iframe
            iframe.addEventListener('mouseenter', () => {
                if (this.cursor) {
                    this.cursor.style.display = 'none';
                }
            });
            
            // Show parent cursor when mouse leaves iframe
            iframe.addEventListener('mouseleave', () => {
                if (this.cursor && this.isVisible) {
                    this.cursor.style.display = 'block';
                }
            });
        });
        
        // Also handle dynamic iframe additions
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        let newIframes = [];
                        if (node.querySelectorAll) {
                            newIframes = Array.from(node.querySelectorAll('iframe'));
                        }
                        if (node.tagName === 'IFRAME') {
                            newIframes.push(node);
                        }
                        
                        newIframes.forEach(iframe => {
                            iframe.addEventListener('mouseenter', () => {
                                if (this.cursor) {
                                    this.cursor.style.display = 'none';
                                }
                            });
                            
                            iframe.addEventListener('mouseleave', () => {
                                if (this.cursor && this.isVisible) {
                                    this.cursor.style.display = 'block';
                                }
                            });
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    startAnimation() {
        // Ensure animation starts regardless of iframe state
        this.animationInterval = setInterval(() => {
            if (this.cursor && this.isVisible) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                const xOffset = -(this.currentFrame * this.displayWidth);
                this.cursor.style.backgroundPosition = `${xOffset}px 0`;
            }
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
    
    // Don't initialize in iframe contexts to prevent conflicts
    const isIframeContext = window !== window.top;
    
    if (!prefersReducedMotion && !isIframeContext) {
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
            const isIframeContext = window !== window.top;
            
            if (!prefersReducedMotion && !isIframeContext) {
                new AnimatedCursor();
            }
        }
    }, 2000);
}); 