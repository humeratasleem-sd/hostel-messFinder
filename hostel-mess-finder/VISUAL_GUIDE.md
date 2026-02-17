# 🎨 Visual Design Guide - Quick Reference

## Color Palette

### Primary Actions
```
Primary Red:        #ff6b6b  RGB(255, 107, 107)  ← Main buttons, important actions
Dark Red:          #ee5a52  RGB(238, 90, 82)   ← Hover states
Light Red:         #ff8787  RGB(255, 135, 135) ← Disabled/light backgrounds
```

### Highlights & Secondary
```
Teal:              #4ecdc4  RGB(78, 205, 196)  ← Secondary buttons, accents
Dark Teal:         #3db8b0  RGB(61, 184, 176) ← Hover states
Light Teal:        #6eddd9  RGB(110, 221, 217) ← Backgrounds
```

### Feedback & Status
```
Gold/Accent:       #ffd93d  RGB(255, 217, 61)  ← Stars, ratings
Green/Success:     #00b894  RGB(0, 184, 148)  ← Checkmarks, success states
Red/Danger:        #d63031  RGB(214, 48, 49)  ← Errors, destructive actions
Orange/Warning:    #fdcb6e  RGB(253, 203, 110) ← Warnings
Blue/Info:         #667eea  RGB(102, 126, 234) ← Information
```

### Neutral Colors
```
Dark Text:         #1a1a1a  ← Headings, dark text
Normal Text:       #2c3e50  ← Body text
Light Text:        #7f8c8d  ← Secondary text, labels
Lighter Text:      #95a5a6  ← Disabled, hints

White/BG:          #ffffff  ← Main background
Off-White:         #f8f9fb  ← Cards, sections
Light Gray:        #f0f2f5  ← Backgrounds
Border:            #e1e8ed  ← Dividers, borders
```

## Buttons

### Button States

**Primary Button (Main CTA)**
```
Default:    Red gradient (#ff6b6b → #ee5a52)
            White text, shadow
Hover:      Lift up 2px, shadow grows
            Slight color brighten
Focus:      Ring outline
Disabled:   50% opacity, cursor not-allowed
```

**Secondary Button**
```
Default:    Teal background (#4ecdc4)
            White text
Hover:      Darker teal (#3db8b0)
            Lift effect
```

**Outline Button**
```
Default:    Transparent background
            2px primary border
            Primary text color
Hover:      Filled with primary color
            White text
```

### Button Sizes
```
Small:      8px 16px padding, 14px font
Default:    8px 24px padding, 14px font (bold)
Large:      16px 32px padding, 16px font (bold)
Block:      100% width, same height as default
```

## Typography

### Headings (all semi-bold #1a1a1a)
```
H1: 36px   ← Page titles
H2: 30px   ← Section titles
H3: 24px   ← Subsection titles
H4: 20px   ← Card titles
H5: 18px   ← Minor headings
H6: 16px   ← Very small headings
```

### Body Text
```
Paragraph:      16px, #2c3e50, line-height: 1.8
Secondary:      14px, #7f8c8d
Small:          12px, #95a5a6
Label:          14px, #2c3e50, 500 weight
Link:           16px, #ff6b6b, no underline
```

## Cards

### Card Layout
```
╔═══════════════════════════╗
║                           ║  ← 32px padding
║  Card Content            ║
║                           ║  ← 32px padding
╚═══════════════════════════╝
```

### Card Styles
```
Background:     #ffffff (white)
Border:         1px #e1e8ed (light)
Border Radius:  12px
Padding:        32px
Shadow:         0 4px 12px rgba(0,0,0,0.1)
Hover Shadow:   0 8px 24px rgba(0,0,0,0.12)
Hover Effect:   translateY(-4px)
```

## Spacing Grid (8px base)

```
4px   = 1 unit (XS - minimal gaps)
8px   = 1 unit (SM - small gaps)
16px  = 2 units (MD - standard spacing)
24px  = 3 units (LG - comfortable spacing)
32px  = 4 units (XL - large spacing)
48px  = 6 units (2XL - very large spacing)
```

### Common Spacing Patterns
```
Within Cards:       32px padding
Between Cards:      24px gap
Section Padding:    48px top/bottom
Container Padding:  16px horizontal
Form Groups:        24px margin-bottom
Button Gap:         8px
```

## Forms

### Input Fields
```
╔════════════════════════════╗
│ placeholder text           │  ← Light gray #7f8c8d
╚════════════════════════════╝
Background:     #ffffff
Border:         1px #e1e8ed
Padding:        8px 16px
Height:         40px minimum
Border Radius:  8px
Font:           16px (prevents mobile zoom)

On Focus:
Border Color:   #ff6b6b (primary)
Shadow:         0 0 0 3px rgba(255,107,107,0.1)
Outline:        none
```

### Textarea
```
Default Height: 120px
Min Height:     100px
Max Height:     400px
Resize:         vertical only
Same styles as input field
```

## Shadows

### Shadow Levels
```
Small:      0 1px 3px rgba(0,0,0,0.08)    ← Subtle
Medium:     0 4px 12px rgba(0,0,0,0.1)    ← Standard
Large:      0 8px 24px rgba(0,0,0,0.12)   ← Hover
Extra:      0 12px 48px rgba(0,0,0,0.15)  ← Modal/Popup
```

## Layouts

### Dashboard Layout (1200px+)
```
┌─────────────────────────────────┐
│ NAVBAR                          │
├────────────┬────────────────────┤
│ SIDEBAR    │  MAIN CONTENT      │
│ 280px      │  Flexible          │
│            │                    │
│            │                    │
└────────────┴────────────────────┘
```

### Mess Container (1200px+)
```
┌─────────────────────────────────┐
│ NAVBAR                          │
├────────────┬────────────────────┤
│ FILTERS    │  MESS GRID         │
│ 280px      │  3 columns         │
│            │  300px min each    │
└────────────┴────────────────────┘
```

### Mess Details (1200px+)
```
┌─────────────────────────────────┐
│ NAVBAR                          │
├────────────────────┬────────────┤
│ DETAILS (FLUID)    │ FORM       │
│                    │ 450px      │
│ Table format       │ Sticky     │
└────────────────────┴────────────┘
```

## Animations

### Transition Speeds
```
Fast:   150ms ease  ← Quick interactions
Base:   250ms ease  ← Standard transitions
Slow:   350ms ease  ← Smooth animations
```

### Common Animations
```
Fade:       opacity 0 → 1, 300ms
Slide In:   translateX(-20px) → 0, 300ms
Fade Up:    translateY(20px) + opacity → normal, 500ms
Lift:       translateY(-2px to -8px) on hover
Scale:      scale(1) → 1.02-1.05 on hover
```

## Responsive Breakpoints

### Desktop (1200px+)
```
- All features visible
- Sidebars sticky
- Multi-column grids
- Full animations
```

### Tablet (768-1023px)
```
- 2-column layouts
- Reduced padding (24px)
- Simplified grids
- Touch-friendly sizes
```

### Mobile (480-767px)
```
- Single column
- Full-width cards
- Padding: 16px
- Larger touch targets
- Responsive headings
```

### Small Mobile (<480px)
```
- Minimal spacing
- Single column everything
- Padding: 12px
- Larger fonts
- Large buttons
```

## Component Usage Examples

### Primary Button (CTA)
```html
<button class="btn btn-primary">
  Get Started
</button>
```
**Use for**: Main actions, important CTAs

### Secondary Button
```html
<button class="btn btn-secondary">
  Learn More
</button>
```
**Use for**: Secondary actions, less important

### Outline Button
```html
<button class="btn btn-outline">
  Cancel
</button>
```
**Use for**: Cancel/back actions, low priority

### Card Component
```html
<div class="card">
  <h3>Title</h3>
  <p>Content goes here</p>
</div>
```
**Use for**: Information containers, feature cards

### Form Group
```html
<div class="form-group">
  <label for="name">Name</label>
  <input type="text" id="name" placeholder="Enter name">
  <small>Helper text</small>
</div>
```
**Use for**: Form inputs, with label and hint

## Best Practices

### Do's ✅
- Use CSS variables for consistency
- Maintain 8px spacing grid
- Use semantic HTML
- Test on multiple devices
- Provide visual feedback
- Use proper color contrast
- Include focus states

### Don'ts ❌
- Don't change colors without system
- Don't use arbitrary spacing
- Don't remove focus indicators
- Don't use text-only hover states
- Don't mix spacing systems
- Don't ignore mobile experience
- Don't animate excessively

---

This is your design guide. Keep it handy when making changes! 🎨
