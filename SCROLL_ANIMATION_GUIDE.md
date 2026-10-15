# Scroll Fade-In Animation Implementation Guide

## Overview
Your application now has a complete scroll-triggered fade-in animation system similar to EmpireFX. Elements fade in smoothly as users scroll down the page, creating an engaging visual experience.

## Components & Hooks

### 1. **useScrollFadeIn Hook** 
Location: `/hooks/useScrollFadeIn.js`

A custom React hook that detects when elements enter the viewport and triggers animations.

**Basic Usage:**
```jsx
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

function MyComponent() {
  const { ref, isVisible } = useScrollFadeIn();
  
  return (
    <div ref={ref} className="scroll-fade-in">
      Content that fades in on scroll
    </div>
  );
}
```

**Options:**
- `threshold` (0-1): How much of the element must be visible before animation triggers (default: 0.1)
- `margin`: Root margin for intersection observer (default: '0px 0px -100px 0px')
- `animation`: Animation type (not used directly, but for reference)

### 2. **ScrollReveal Component**
Location: `/components/ScrollReveal.js`

A simple wrapper component for adding scroll animations to any content.

**Usage:**
```jsx
import ScrollReveal from '@/components/ScrollReveal';

<ScrollReveal type="fadeUp">
  <h1>This heading fades in from bottom</h1>
</ScrollReveal>
```

**Props:**
- `type`: Animation type
  - `'fadeUp'` (default): Fade in + slide up
  - `'fadeOnly'`: Only fade, no movement
  - `'slideRight'`: Fade in + slide from left
  - `'slideLeft'`: Fade in + slide from right
  - `'scale'`: Fade in + scale up
- `threshold`: Intersection observer threshold (0-1)
- `margin`: Root margin for animation trigger
- `className`: Additional CSS classes
- `tag`: HTML element (default: 'div')

**Examples:**

```jsx
// Header with fade-up
<ScrollReveal type="fadeUp" className="text-center">
  <h1 className="text-4xl font-bold">Welcome</h1>
</ScrollReveal>

// Card that fades in only
<ScrollReveal type="fadeOnly" className="p-6">
  <Card />
</ScrollReveal>

// Image slides in from right
<ScrollReveal type="slideRight">
  <img src="landscape.jpg" alt="Scenic View" />
</ScrollReveal>
```

### 3. **ScrollRevealGroup Component**
Location: `/components/ScrollRevealGroup.js`

For staggered animations on multiple child elements. Each child animates in sequence.

**Usage:**
```jsx
import ScrollRevealGroup from '@/components/ScrollRevealGroup';

<ScrollRevealGroup staggerDelay={100} className="grid grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</ScrollRevealGroup>
```

**Props:**
- `staggerDelay`: Milliseconds delay between each child animation (default: 100)
- `threshold`: Intersection observer threshold
- `margin`: Root margin for animation trigger
- `className`: CSS classes for container
- `tag`: HTML element (default: 'div')

**Example - Staggered Card List:**
```jsx
<ScrollRevealGroup staggerDelay={150}>
  {funds.map(fund => (
    <FundCard key={fund.id} data={fund} />
  ))}
</ScrollRevealGroup>
```

## CSS Animation Classes

All animation classes are available in `/app/globals.css`:

### Individual Animation Classes
```css
.scroll-fade-in       /* Fade in + slide up (default) */
.scroll-fade-only     /* Fade in only */
.scroll-slide-right   /* Fade in + slide from left */
.scroll-slide-left    /* Fade in + slide from right */
.scroll-scale-in      /* Fade in + scale up */
```

### Using CSS Classes Directly
If you prefer to manage animations with the hook instead of ScrollReveal component:

```jsx
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

function MySection() {
  const { ref, isVisible } = useScrollFadeIn();
  
  return (
    <section 
      ref={ref} 
      className={`scroll-fade-in ${isVisible ? 'is-visible' : ''}`}
    >
      Content fades in here
    </section>
  );
}
```

## Implementation Patterns

### Pattern 1: Header Sections
```jsx
<ScrollReveal type="fadeUp" className="text-center mb-12">
  <h1 className="text-5xl font-bold">Section Title</h1>
  <p className="text-xl text-muted-foreground">Subtitle</p>
</ScrollReveal>
```

### Pattern 2: Feature Cards Grid
```jsx
<ScrollRevealGroup staggerDelay={100} className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {features.map(feature => (
    <ScrollReveal key={feature.id} type="slideUp">
      <FeatureCard feature={feature} />
    </ScrollReveal>
  ))}
</ScrollRevealGroup>
```

### Pattern 3: Side-by-Side Content
```jsx
<div className="grid grid-cols-2 gap-8">
  <ScrollReveal type="slideRight">
    <img src="image.jpg" alt="Left image" />
  </ScrollReveal>
  
  <ScrollReveal type="slideLeft">
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Title</h2>
      <p>Description text</p>
    </div>
  </ScrollReveal>
</div>
```

### Pattern 4: List Items (With Stagger)
```jsx
<ScrollRevealGroup staggerDelay={80} className="space-y-4">
  {items.map(item => (
    <div key={item.id} className="p-4 bg-white rounded-lg">
      {item.name}
    </div>
  ))}
</ScrollRevealGroup>
```

## Animation Timing

Current defaults:
- **Duration**: 0.8 seconds
- **Easing**: `ease-out` (fast start, smooth finish)
- **Stagger delay**: Customizable per component

To customize timing globally, edit `/app/globals.css`:

```css
.scroll-fade-in {
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  /* Change 0.8s to your preferred duration */
  /* Change ease-out to ease-in-out, ease-in, linear, etc */
}
```

## Where It's Already Implemented

✅ **Global Markets Page** (`/app/global-markets/page.js`)
- Header fades in
- Fund cards appear with staggered animation
- CTA section fades in

## How to Add to Other Pages

### Step 1: Import the components
```jsx
import ScrollReveal from '@/components/ScrollReveal';
import ScrollRevealGroup from '@/components/ScrollRevealGroup';
```

### Step 2: Wrap your content
```jsx
// Wrap sections with ScrollReveal
<ScrollReveal type="fadeUp">
  <YourContent />
</ScrollReveal>

// Or use ScrollRevealGroup for multiple items
<ScrollRevealGroup staggerDelay={100}>
  {items.map(item => <Item key={item.id} data={item} />)}
</ScrollRevealGroup>
```

## Performance Considerations

✅ **Optimized for Performance:**
- Uses Intersection Observer API (efficient browser API)
- Unobserves elements after animation completes
- No continuous polling or event listeners
- Uses CSS transitions (GPU-accelerated)
- Works great on mobile and desktop

## Browser Support

✅ Supported in all modern browsers:
- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 16+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization Examples

### Slower Animation
```jsx
<div className="scroll-fade-in is-visible" style={{
  transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
}}>
  Slower fade-in
</div>
```

### Custom Trigger Point
```jsx
<ScrollReveal 
  margin="0px 0px -50px 0px"  // Triggers sooner
  threshold={0.2}             // Wait for 20% visibility
>
  Content
</ScrollReveal>
```

### Different Easing
Edit the transition in globals.css:
- `ease-out`: Fast start, smooth finish (default)
- `ease-in-out`: Smooth throughout
- `ease-in`: Smooth start, fast finish
- `linear`: Constant speed
- `cubic-bezier(0.34, 1.56, 0.64, 1)`: Bouncy effect

## Troubleshooting

**Animation not triggering:**
1. Check that ScrollReveal is imported correctly
2. Verify the element has enough space in viewport
3. Try increasing margin value (e.g., '0px 0px 0px 0px')
4. Check browser console for errors

**Animation too slow/fast:**
Edit the transition values in globals.css

**Not working on mobile:**
Usually works fine - check that Intersection Observer is supported and no CSS conflicts exist

## Next Steps

1. ✅ Scroll fade-in is now implemented on `/global-markets`
2. Apply it to other pages like:
   - `/` (home/index page)
   - `/about`
   - `/services`
   - `/ipo`
   - Any other pages with sections
3. Customize timing and easing to match your brand
