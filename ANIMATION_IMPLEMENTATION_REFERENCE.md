# Implementation Reference & Checklist

## ✅ Pages Already Implemented

### Home Page (`/app/page.js`)
```
┌─────────────────────────────────────────┐
│  Hero Section                  [FADE-UP] │  ← Fades in on page load
│  ├─ Logo                                 │
│  ├─ Main Heading                        │
│  └─ CTA Buttons                         │
├─────────────────────────────────────────┤
│  Stats Strip                   [FADE-UP] │  ← Slides in
│  ├─ Years in Market                     │
│  └─ Clients Served                      │
├─────────────────────────────────────────┤
│  Services Grid              [STAGGERED] │  ← Each card fades in sequence
│  ├─ Local Trading Card                  │
│  ├─ International Trading Card          │
│  ├─ Fund Management Card                │
│  └─ Leverage Trading Card               │
├─────────────────────────────────────────┤
│  CTA Section               [SLIDE-UP] │  ← Final call-to-action fades in
│  └─ "Get Started Today" Button          │
└─────────────────────────────────────────┘
```

### Global Markets Page (`/app/global-markets/page.js`)
```
┌─────────────────────────────────────────┐
│  Header Section                [FADE-UP] │  ← Smooth entry
│  ├─ Page Title                          │
│  └─ Subtitle                           │
├─────────────────────────────────────────┤
│  Global Funds              [STAGGERED] │  ← Multiple animations
│  ├─ Fund Card 1                        │  ← Appears at t=0ms
│  ├─ Fund Card 2                        │  ← Appears at t=100ms
│  ├─ Fund Card 3                        │  ← Appears at t=200ms
│  └─ Fund Card 4                        │  ← Appears at t=300ms
├─────────────────────────────────────────┤
│  Bottom CTA                 [FADE-UP] │  ← Smooth final section
│  └─ "Contact Us" Button                │
└─────────────────────────────────────────┘
```

## 📝 Implementation Checklist

Use this to add animations to other pages:

### ☐ Pages to Animate

#### ☐ `/app/about/page.js`
- [ ] Import ScrollReveal & ScrollRevealGroup
- [ ] Wrap "About Us" hero in ScrollReveal (type="fadeUp")
- [ ] Add staggered animation to company values/benefits
- [ ] Animate team member cards with scroll group

#### ☐ `/app/services/page.js`
- [ ] Wrap each service description in ScrollReveal
- [ ] Stagger service feature lists
- [ ] Animate service comparison table rows

#### ☐ `/app/ipo/page.js`
- [ ] Header with fadeUp
- [ ] IPO cards with staggered animation
- [ ] Featured IPO section with slide animation

#### ☐ `/app/leverage/page.js`
- [ ] Main heading with fadeUp
- [ ] Leverage tiers with staggered cards
- [ ] Risk/reward comparison charts

#### ☐ `/app/contact/page.js`
- [ ] Form fields fade in sequentially
- [ ] Contact info cards appear with stagger
- [ ] Map/location section slides in

#### ☐ `/app/research/page.js`
- [ ] Articles/research items fade in
- [ ] Filters/controls slide in
- [ ] Featured content stands out

#### ☐ `/app/faq/page.js`
- [ ] FAQ items appear with stagger
- [ ] Collapse/expand animations coordinate

---

## 🎬 Animation Timeline Reference

### Stagger Delays (in milliseconds)
```
Card 1: 0ms   ███████████████████ (visible immediately)
Card 2: 100ms         ███████████████████ 
Card 3: 200ms                ███████████████████
Card 4: 300ms                     ███████████████████
Card 5: 400ms                          ███████████████████
```

### Duration & Easing
- **Duration**: 800ms (0.8 seconds)
- **Easing**: ease-out (smooth deceleration)
- **Start Condition**: When element is 100px before viewport
- **Performance**: Unobserves after completion (no continuous polling)

---

## 🔧 Component Props Reference

### ScrollReveal
```jsx
<ScrollReveal
  type="fadeUp"           // Animation type
  threshold={0.1}         // Visible % before trigger (0-1)
  margin="0px 0px -100px" // Root margin for trigger
  className="mb-4"        // Additional CSS
  tag="div"               // HTML element type
>
  Content here
</ScrollReveal>
```

**Type Options:**
- `fadeUp` - Fade in + slide up (default)
- `fadeOnly` - Fade in only
- `slideRight` - Fade in + slide from left
- `slideLeft` - Fade in + slide from right  
- `scale` - Fade in + scale up

### ScrollRevealGroup
```jsx
<ScrollRevealGroup
  staggerDelay={100}      // ms between each child
  threshold={0.1}         // Visible % before trigger
  margin="0px 0px -100px" // Root margin
  className="grid gap-4"  // Container CSS
  tag="div"               // Container element
>
  {children}
</ScrollRevealGroup>
```

---

## 🎨 CSS Classes (For Manual Control)

If you prefer using the hook directly instead of components:

```jsx
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

function Component() {
  const { ref, isVisible } = useScrollFadeIn();
  
  return (
    <div 
      ref={ref} 
      className={`scroll-fade-in ${isVisible ? 'is-visible' : ''}`}
    >
      Content
    </div>
  );
}
```

**Available Classes:**
- `.scroll-fade-in` + `.is-visible`
- `.scroll-fade-only` + `.is-visible`
- `.scroll-slide-right` + `.is-visible`
- `.scroll-slide-left` + `.is-visible`
- `.scroll-scale-in` + `.is-visible`

---

## 📝 Copy-Paste Templates

### Template 1: Section Header
```jsx
<ScrollReveal type="fadeUp" className="text-center mb-16">
  <h2 className="text-4xl font-bold mb-4">Section Title</h2>
  <p className="text-muted-foreground max-w-2xl mx-auto">
    Section description here
  </p>
</ScrollReveal>
```

### Template 2: Card Grid
```jsx
<ScrollRevealGroup 
  className="grid grid-cols-1 md:grid-cols-3 gap-6"
  staggerDelay={100}
>
  {items.map(item => (
    <div key={item.id} className="p-6 rounded-lg">
      {/* Card content */}
    </div>
  ))}
</ScrollRevealGroup>
```

### Template 3: Feature List
```jsx
<ScrollRevealGroup className="space-y-4" staggerDelay={80}>
  {features.map(feature => (
    <div key={feature.id} className="flex items-start gap-4">
      <div className="flex-shrink-0">{feature.icon}</div>
      <div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    </div>
  ))}
</ScrollRevealGroup>
```

### Template 4: Two-Column Layout
```jsx
<div className="grid grid-cols-2 gap-12">
  <ScrollReveal type="slideRight">
    <img src="image.jpg" alt="Left" />
  </ScrollReveal>
  
  <ScrollReveal type="slideLeft">
    <div>
      <h2>Title</h2>
      <p>Description</p>
    </div>
  </ScrollReveal>
</div>
```

---

## 🧪 Testing Scroll Animations

### Desktop Testing
1. Open DevTools (F12)
2. Scroll down the page slowly
3. Watch elements fade in as they enter viewport
4. Animation should feel smooth, not janky

### Mobile Testing
```bash
# Run on actual mobile device via network
npm run dev
# Then visit http://[YOUR-IP]:3000 on mobile
```

### Performance Check
- Open DevTools → Performance tab
- Record while scrolling
- Should see smooth 60fps (not dropping below 30fps)
- No main thread jank

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Animations not triggering | Increase margin: `margin="0px 0px 0px 0px"` |
| Too fast/slow | Adjust duration in globals.css (0.8s) |
| Elements jump | Check for CSS conflicts or padding issues |
| Mobile not working | Verify Intersection Observer support |
| Stagger not sequencing | Check children count matches ScrollRevealGroup items |

---

## 📚 Full Documentation

For comprehensive details, see: **SCROLL_ANIMATION_GUIDE.md**

For quick start with examples, see: **SCROLL_ANIMATION_INSTALLATION.md**
