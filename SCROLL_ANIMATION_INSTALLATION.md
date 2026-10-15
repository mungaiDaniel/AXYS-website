# 🎨 Scroll Fade-In Animation - Quick Start Guide

## ✅ What's Been Implemented

Your application now has a **smooth scroll-triggered fade-in animation system** similar to EmpireFX's website. When users scroll down, content elegantly fades in and slides up!

### Files Created:
- ✅ `/hooks/useScrollFadeIn.js` - Custom React hook for scroll detection
- ✅ `/components/ScrollReveal.js` - Simple wrapper component  
- ✅ `/components/ScrollRevealGroup.js` - Staggered animations for multiple items

### Files Updated:
- ✅ `/app/globals.css` - Added all CSS animations
- ✅ `/app/page.js` - Home page now uses scroll animations
- ✅ `/app/global-markets/page.js` - Global markets page with staggered animations

## 🚀 See It In Action

### Option 1: Preview Locally
```bash
npm run dev
```
Then visit:
- **Home Page**: `http://localhost:3000`
  - Hero section fades in
  - Stats section slides up
  - Service cards appear with staggered animation
  - CTA section fades in

- **Global Markets Page**: `http://localhost:3000/global-markets`
  - Header fades in
  - Fund cards appear one-by-one with stagger effect
  - Bottom CTA fades in

### Option 2: What to Look For
As you scroll down the page:
1. **Headers** fade in from bottom with elegant motion
2. **Cards** appear in sequence (staggered timing)
3. **Images & text** slide in smoothly from the sides
4. Everything uses smooth easing (not jarring)

## 📋 Animation Types Available

| Type | Effect | Best For |
|------|--------|----------|
| `fadeUp` | Fade + slide up | Headers, main content |
| `fadeOnly` | Fade in only | Text, subtle elements |
| `slideRight` | Fade + slide from left | Left-aligned content |
| `slideLeft` | Fade + slide from right | Right-aligned content |
| `scale` | Fade + scale up | Cards, thumbnails |

## 💻 Usage Examples

### Basic: Single Element
```jsx
import ScrollReveal from '@/components/ScrollReveal';

<ScrollReveal type="fadeUp">
  <h1>This heading fades in</h1>
</ScrollReveal>
```

### Intermediate: Multiple Cards (Staggered)
```jsx
import ScrollRevealGroup from '@/components/ScrollRevealGroup';

<ScrollRevealGroup staggerDelay={100}>
  {cards.map(card => <Card key={card.id} {...card} />)}
</ScrollRevealGroup>
```

### Advanced: Custom Hook
```jsx
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

function MyComponent() {
  const { ref, isVisible } = useScrollFadeIn();
  
  return (
    <div ref={ref} className={`scroll-fade-in ${isVisible ? 'is-visible' : ''}`}>
      Custom animation trigger
    </div>
  );
}
```

## 🎯 Apply to Other Pages

Want to add scroll animations to other pages? It's easy!

### Step 1: Import
```jsx
import ScrollReveal from '@/components/ScrollReveal';
import ScrollRevealGroup from '@/components/ScrollRevealGroup';
```

### Step 2: Wrap Content
Replace existing `<div>` or `<section>` with `<ScrollReveal>`:
```jsx
// Before:
<div className="text-center">
  <h1>Title</h1>
</div>

// After:
<ScrollReveal type="fadeUp" className="text-center">
  <h1>Title</h1>
</ScrollReveal>
```

### Step 3: Use for Lists/Grids
Wrap card containers with `<ScrollRevealGroup>`:
```jsx
// Before:
<div className="grid grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// After:
<ScrollRevealGroup className="grid grid-cols-3 gap-4" staggerDelay={100}>
  {items.map(item => <Card key={item.id} {...item} />)}
</ScrollRevealGroup>
```

## ⚙️ Customization

### Change Animation Duration
Edit `/app/globals.css` (currently 0.8s):
```css
.scroll-fade-in {
  transition: opacity 1.2s ease-out, transform 1.2s ease-out; /* Change 0.8s to 1.2s */
}
```

### Change Trigger Point
When element starts animating (currently at 100px before entering viewport):
```jsx
<ScrollReveal margin="0px 0px -200px 0px">  {/* Triggers sooner */}
  Content
</ScrollReveal>
```

### Change Easing Style
Available options: `ease-out` (default), `ease-in`, `ease-in-out`, `linear`
```css
.scroll-fade-in {
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}
```

## 📊 Performance

✅ **Highly Optimized:**
- Uses Intersection Observer API (efficient native browser API)
- No event listeners after animation completes
- CSS transitions use GPU acceleration
- Works great on mobile and desktop
- ~2KB minified JavaScript

## 🔗 For More Details

See the comprehensive guide at: **SCROLL_ANIMATION_GUIDE.md**

## 🎉 Done!

Your website now has modern scroll-triggered animations just like EmpireFX! 

**Next Steps:**
1. Run `npm run dev` and scroll through pages to see animations
2. Apply animations to other pages as needed
3. Adjust timing/easing to match your brand
