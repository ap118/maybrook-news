# Animated Cursor System

This directory contains a cross-browser compatible animated cursor implementation that replaces the GIF-based cursor with a JavaScript solution.

## Files

- `cursor-animation.js` - Main JavaScript implementation (production-ready)
- `cursor-style.css` - CSS styles with fallback support
- `running_child_6frames_sprite.png` - Large sprite sheet (128px frames, 6 frames)
- `running_child_6frames_32px_sprite.png` - Small sprite sheet (32px frames, 6 frames)
- `test-js-cursor.html` - Simple test page to verify functionality
- `README.md` - This documentation

## How It Works

### JavaScript Implementation
The `AnimatedCursor` class creates a custom cursor element that:
1. Uses responsive sprite sheets for optimal performance
2. Tracks mouse movement and positions the cursor accordingly
3. Animates through 6 frames at 100ms intervals
4. Automatically switches between 128px and 32px sprites based on screen size
5. Automatically falls back to CSS if JavaScript fails

### Responsive Design
- **Large screens (768px+)**: Uses 128x128 pixel frames
- **Small screens (<768px)**: Uses 32x32 pixel frames
- Automatically switches on window resize

### CSS Fallback
The CSS provides a fallback using the original GIF files:
- `runningchild_32.gif` for smaller screens
- `runningchild_64.gif` for larger screens (768px+)

### Cross-Browser Compatibility
- **Modern browsers**: JavaScript animated cursor
- **Older browsers**: CSS GIF fallback
- **JavaScript disabled**: CSS GIF fallback
- **Reduced motion preference**: Disabled (respects user preferences)

## Implementation

### 1. Include the CSS
```html
<link href="cursor/cursor-style.css" rel="stylesheet" />
```

### 2. Include the JavaScript
```html
<script src="cursor/cursor-animation.js"></script>
```

### 3. Automatic Detection
The system automatically:
- Detects screen size and loads appropriate sprite sheet
- Detects if JavaScript is available
- Adds `js-cursor-active` class to body when JavaScript cursor is working
- Falls back to CSS if JavaScript fails

## Testing

Use `test-js-cursor.html` to verify:
- JavaScript cursor functionality
- CSS fallback behavior
- Sprite sheet loading
- Responsive sprite switching
- Cross-browser compatibility

## Browser Support

- **Chrome/Edge**: Full JavaScript support
- **Firefox**: Full JavaScript support
- **Safari**: Full JavaScript support
- **Internet Explorer**: CSS fallback only
- **Mobile browsers**: CSS fallback (touch devices)

## Performance

- Uses responsive sprite sheets for optimal file sizes
- Hardware acceleration with `transform3d`
- Optimized sprite sheet loading
- Minimal DOM manipulation
- Automatic sprite switching on resize

## Troubleshooting

1. **Cursor not animating**: Check browser console for errors
2. **No cursor visible**: Verify sprite sheet paths
3. **Fallback not working**: Check GIF file paths in CSS
4. **Performance issues**: Reduce animation speed in JavaScript
5. **Wrong sprite size**: Check screen width and responsive logic

## Customization

To modify the animation:
- Change `animationSpeed` in `cursor-animation.js`
- Adjust `frameWidth` and `frameHeight` for different sprite sheets
- Modify `totalFrames` for different animation lengths
- Change the 768px breakpoint for responsive switching

## Sprite Sheet Creation

The sprite sheets were created from the original GIF files using ImageMagick:
```bash
# Large sprite sheet (128px frames)
convert runningchild_01.gif -coalesce +append running_child_6frames_sprite.png

# Small sprite sheet (32px frames)
convert runningchild_32.gif -coalesce +append running_child_6frames_32px_sprite.png
```

## Production Status

✅ **Production Ready** - All debugging code removed  
✅ **Cross-browser tested** - Works on all modern browsers  
✅ **Performance optimized** - Responsive sprite sheets  
✅ **Accessibility compliant** - Respects reduced motion preferences  
✅ **Fallback system** - CSS fallback for older browsers 