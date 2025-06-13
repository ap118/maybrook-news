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
        
        // Performance optimization: throttle mouse movement
        this.lastMouseUpdate = 0;
        this.mouseThrottleMs = 16; // ~60fps (1000ms / 60fps)
        
        // Store event listeners for proper cleanup
        this.eventListeners = new Map();
        this.mutationObserver = null;
        
        // Use 64px sprite for quality, display at 32px size
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.displayWidth = 32;
        this.displayHeight = 32;
        
        // Robustly resolve sprite path based on JS file location (works locally, in subdirectories, and in older browsers)
        let scriptBase = '';
        if (document.currentScript) {
            scriptBase = document.currentScript.src.split('/').slice(0, -1).join('/');
        } else {
            // Fallback for older browsers: use the last script tag
            const scripts = document.getElementsByTagName('script');
            if (scripts.length) {
                scriptBase = scripts[scripts.length - 1].src.split('/').slice(0, -1).join('/');
            }
        }
        this.spriteSheetPath = scriptBase + '/running_child_6frames_sprite.png';
        
        // Remove debug logging for production
        // console.log('Iframe detection:', {
        //     window: window,
        //     windowTop: window.top,
        //     isIframeContext: this.isIframeContext,
        //     location: window.location.href
        // });
        
        this.init();
    }
    
    init() {
        // Remove iframe context check to allow animated cursor in iframes
        // if (this.isIframeContext) {
        //     return;
        // }
        
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
            will-change: transform, background-position;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            -webkit-transform: translate3d(-50%, -50%, 0);
            transform: translate3d(-50%, -50%, 0);
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
            
            // Performance monitoring
            this.logPerformance('Sprite sheet loaded successfully');
        };
        spriteSheet.onerror = () => {
            console.warn('Failed to load cursor sprite sheet, falling back to default cursor');
            this.destroy();
        };
        spriteSheet.src = this.spriteSheetPath;
    }
    
    logPerformance(message) {
        if (window.performance && window.performance.memory) {
            const memory = window.performance.memory;
            console.log(`Cursor Performance - ${message}:`, {
                usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
                jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            });
        }
    }
    
    addEventListeners() {
        // Create bound event handlers for proper cleanup
        this.handleMouseMove = (e) => {
            const now = performance.now();
            if (now - this.lastMouseUpdate >= this.mouseThrottleMs) {
                if (this.cursor && this.isVisible) {
                    this.cursor.style.left = e.clientX + 'px';
                    this.cursor.style.top = e.clientY + 'px';
                }
                this.lastMouseUpdate = now;
            }
        };
        
        this.handleMouseLeave = () => {
            if (this.cursor) {
                this.cursor.style.display = 'none';
            }
        };
        
        this.handleMouseEnter = () => {
            if (this.cursor && this.isVisible) {
                this.cursor.style.display = 'block';
            }
        };
        
        this.handleWindowBlur = () => {
            if (this.cursor) {
                this.cursor.style.display = 'none';
            }
        };
        
        this.handleWindowMouseOut = (e) => {
            if (!e.relatedTarget && this.cursor) {
                this.cursor.style.display = 'none';
            }
        };
        
        this.handleWindowFocus = () => {
            if (this.cursor && this.isVisible) {
                this.cursor.style.display = 'block';
            }
        };
        
        this.handleBodyMouseEnter = () => {
            if (this.cursor && this.isVisible) {
                this.cursor.style.display = 'block';
            }
        };
        
        // Track mouse movement with throttling for performance
        document.addEventListener('mousemove', this.handleMouseMove);
        this.eventListeners.set('mousemove', this.handleMouseMove);
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', this.handleMouseLeave);
        this.eventListeners.set('mouseleave', this.handleMouseLeave);
        
        // Show cursor when entering window
        document.addEventListener('mouseenter', this.handleMouseEnter);
        this.eventListeners.set('mouseenter', this.handleMouseEnter);

        // Hide cursor if iframe loses focus (prevents stuck cursor)
        window.addEventListener('blur', this.handleWindowBlur);
        this.eventListeners.set('windowBlur', this.handleWindowBlur);
        
        // Hide cursor if mouse leaves the iframe context
        window.addEventListener('mouseout', this.handleWindowMouseOut);
        this.eventListeners.set('windowMouseOut', this.handleWindowMouseOut);
        
        // Show cursor if iframe regains focus (for FF/Safari)
        window.addEventListener('focus', this.handleWindowFocus);
        this.eventListeners.set('windowFocus', this.handleWindowFocus);
        
        // Show cursor if mouse enters the iframe document (robust for all browsers)
        document.body.addEventListener('mouseenter', this.handleBodyMouseEnter);
        this.eventListeners.set('bodyMouseEnter', this.handleBodyMouseEnter);
        
        // Handle iframe interactions
        this.handleIframeInteractions();
        
        // Handle window resize with debouncing
        let resizeTimeout;
        this.handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
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
            }, 100); // Debounce resize events
        };
        window.addEventListener('resize', this.handleResize);
        this.eventListeners.set('resize', this.handleResize);
    }
    
    handleIframeInteractions() {
        // Find all iframes in the document
        const iframes = document.querySelectorAll('iframe');
        
        const addIframeListeners = (iframe) => {
            const mouseEnterHandler = () => {
                if (this.cursor) {
                    this.cursor.style.display = 'none';
                }
            };
            
            const mouseLeaveHandler = () => {
                if (this.cursor && this.isVisible) {
                    this.cursor.style.display = 'block';
                }
            };
            
            iframe.addEventListener('mouseenter', mouseEnterHandler);
            iframe.addEventListener('mouseleave', mouseLeaveHandler);
            
            // Store references for cleanup
            if (!this.iframeListeners) this.iframeListeners = new Map();
            this.iframeListeners.set(iframe, { mouseEnterHandler, mouseLeaveHandler });
        };
        
        iframes.forEach(addIframeListeners);
        
        // Also handle dynamic iframe additions
        this.mutationObserver = new MutationObserver((mutations) => {
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
                        
                        newIframes.forEach(addIframeListeners);
                    }
                });
            });
        });
        
        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    startAnimation() {
        // Use requestAnimationFrame for smoother animation
        let lastFrameTime = 0;
        const animate = (currentTime) => {
            if (currentTime - lastFrameTime >= this.animationSpeed) {
                if (this.cursor && this.isVisible) {
                    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                    const xOffset = -(this.currentFrame * this.displayWidth);
                    this.cursor.style.backgroundPosition = `${xOffset}px 0`;
                }
                lastFrameTime = currentTime;
            }
            this.animationInterval = requestAnimationFrame(animate);
        };
        this.animationInterval = requestAnimationFrame(animate);
    }
    
    stopAnimation() {
        if (this.animationInterval) {
            cancelAnimationFrame(this.animationInterval);
            this.animationInterval = null;
        }
    }
    
    destroy() {
        this.stopAnimation();
        
        // Clean up iframe listeners
        if (this.iframeListeners) {
            this.iframeListeners.forEach(({ mouseEnterHandler, mouseLeaveHandler }, iframe) => {
                iframe.removeEventListener('mouseenter', mouseEnterHandler);
                iframe.removeEventListener('mouseleave', mouseLeaveHandler);
            });
            this.iframeListeners.clear();
        }
        
        // Clean up mutation observer
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
        
        // Remove cursor element
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        
        // Remove the js-cursor-active class
        document.body.classList.remove('js-cursor-active');
        
        // Remove event listeners
        this.eventListeners.forEach((handler, event) => {
            if (event === 'windowBlur' || event === 'windowMouseOut' || event === 'windowFocus' || event === 'resize') {
                window.removeEventListener(event.replace('window', '').toLowerCase(), handler);
            } else if (event === 'bodyMouseEnter') {
                document.body.removeEventListener('mouseenter', handler);
            } else {
                document.removeEventListener(event, handler);
            }
        });
        this.eventListeners.clear();
    }
}

// Touch device detection
const isTouchDevice = (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
);

// Initialize the animated cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Only initialize if not a touch device
    if (!prefersReducedMotion && !isTouchDevice) {
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
            if (!prefersReducedMotion && !isTouchDevice) {
                new AnimatedCursor();
            }
        }
    }, 2000);
}); 