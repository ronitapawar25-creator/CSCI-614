# CSS Customization Guide

## How to Customize Your Portfolio

### 1. Change the Color Scheme

Located at the top of `styles.css` in the `:root` selector:

```css
:root {
    /* Update these colors to your brand */
    --primary-dark: #1e3a8a;    /* Main dark blue */
    --primary-main: #3b82f6;    /* Bright blue */
    --primary-light: #60a5fa;   /* Light blue */
    --secondary-accent: #e74c3c; /* Red accent */
}
```

**Example: Change to Purple Theme**
```css
:root {
    --primary-dark: #5b21b6;     /* Dark purple */
    --primary-main: #8b5cf6;     /* Purple */
    --primary-light: #c4b5fd;    /* Light purple */
    --secondary-accent: #ec4899; /* Pink accent */
}
```

All elements will automatically update!

---

### 2. Adjust Spacing Throughout

```css
:root {
    /* Current spacing scale */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-2xl: 48px;
    --space-3xl: 64px;
}
```

**Example: Make everything more compact**
```css
:root {
    --space-xs: 2px;   /* Reduced */
    --space-sm: 4px;   /* Reduced */
    --space-md: 8px;   /* Reduced */
    --space-lg: 16px;  /* Reduced */
    --space-xl: 24px;  /* Reduced */
    --space-2xl: 32px; /* Reduced */
    --space-3xl: 48px; /* Reduced */
}
```

---

### 3. Change Typography

```css
:root {
    --font-family-primary: 'Playfair Display', serif;
    --font-family-secondary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    
    --font-size-base: 16px;
    --font-size-sm: 14px;
    --font-size-lg: 20px;
    --font-size-xl: 24px;
    --font-size-2xl: 32px;
    --font-size-3xl: 48px;
}
```

**Example: Use Google Fonts**
1. Go to [fonts.google.com](https://fonts.google.com)
2. Select font family
3. Update in HTML: `<link href="..." rel="stylesheet">`
4. Update in CSS:
```css
--font-family-primary: 'Your Font Name', serif;
```

---

### 4. Modify Button Styles

Located in **BUTTONS & INTERACTIVE** section:

```css
.btn {
    padding: var(--space-md) var(--space-lg);  /* Change here */
    background-color: var(--primary-main);      /* Color */
    border-radius: var(--border-radius-md);     /* Roundness */
    font-size: var(--font-size-base);          /* Size */
}
```

**Example: Larger, rounder buttons**
```css
.btn {
    padding: var(--space-lg) var(--space-xl);  /* Bigger */
    border-radius: var(--border-radius-lg);    /* More round */
    font-size: var(--font-size-lg);            /* Larger text */
    font-weight: 700;                          /* Bolder */
}
```

---

### 5. Adjust Animation Speeds

```css
:root {
    --transition-fast: 150ms ease-in-out;
    --transition-base: 300ms ease-in-out;
    --transition-slow: 500ms ease-in-out;
}
```

**Example: Faster animations**
```css
:root {
    --transition-fast: 75ms ease-in-out;
    --transition-base: 150ms ease-in-out;
    --transition-slow: 300ms ease-in-out;
}
```

---

### 6. Change Hero Section

```css
#hero {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-main) 100%);
    min-height: 600px;
    padding: var(--space-3xl) var(--space-md);
}
```

**Example: Make hero taller with different angle**
```css
#hero {
    background: linear-gradient(45deg, var(--primary-dark) 0%, var(--primary-main) 100%);
    min-height: 700px;  /* Taller */
    padding: 100px var(--space-md);
}
```

---

### 7. Customize Card Hover Effects

```css
/* Projects - located in PROJECTS SECTION */
.project:hover {
    transform: translateY(-12px);  /* How far it lifts */
    box-shadow: var(--shadow-lg);
}

.project img:hover {
    transform: scale(1.1);  /* Zoom amount */
}
```

**Example: Subtle hover effect**
```css
.project:hover {
    transform: translateY(-4px);  /* Smaller lift */
}

.project img:hover {
    transform: scale(1.05);  /* Smaller zoom */
}
```

---

### 8. Add New Animation

Create a new `@keyframes` rule:

```css
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
```

Then use it on an element:

```css
.project {
    animation: slideInLeft 0.6s ease-out;
}
```

---

### 9. Change Grid Layout

If you want a sidebar layout for larger screens:

```css
/* Original - single column */
body {
    display: grid;
    grid-template-areas:
        "header"
        "main"
        "footer";
}

/* With sidebar */
@media (min-width: 1200px) {
    body {
        grid-template-areas:
            "header header"
            "sidebar main"
            "footer footer";
        grid-template-columns: 250px 1fr;
    }
}
```

---

### 10. Disable Animations for Accessibility

Add at the top of your media queries:

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

This respects users' accessibility preferences.

---

## Common Customization Scenarios

### Scenario 1: Corporate/Professional Look
```css
:root {
    --primary-dark: #1f2937;      /* Dark gray */
    --primary-main: #374151;      /* Medium gray */
    --secondary-accent: #7c3aed;  /* Purple */
    --font-family-primary: 'Georgia', serif;
}

body {
    background-color: #ffffff;  /* Pure white */
}
```

### Scenario 2: Vibrant/Creative Look
```css
:root {
    --primary-dark: #dc2626;      /* Red */
    --primary-main: #f97316;      /* Orange */
    --secondary-accent: #06b6d4;  /* Cyan */
}

.btn {
    text-transform: uppercase;
    letter-spacing: 2px;
}
```

### Scenario 3: Minimal/Clean Look
```css
:root {
    --space-xl: 20px;   /* Reduce spacing */
    --space-2xl: 32px;
}

.project {
    box-shadow: var(--shadow-sm);  /* Subtle shadows */
}
```

---

## Testing Your Changes

1. **Save the file** - `styles.css` will auto-reload
2. **Hard refresh** - Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Test on mobile** - Use browser DevTools (F12) and toggle device mode
4. **Test interactions** - Hover over buttons, links, cards
5. **Check responsiveness** - Resize window or use device presets

---

## Backup Before Major Changes

Before making significant customizations:
1. Save a copy of `styles.css` as `styles-backup.css`
2. Make your changes gradually
3. Test each change
4. Revert to backup if needed

---

## Need Help?

Common issues and solutions:

**Problem**: Colors don't change
- **Solution**: Make sure you're using the variable name in all instances
- **Check**: Search for hard-coded color values (e.g., `#3b82f6`)

**Problem**: Layout breaks on mobile
- **Solution**: Check the media queries
- **Check**: Mobile breakpoint at 480px and tablet at 768px

**Problem**: Animation too fast/slow
- **Solution**: Adjust `--transition-*` variables
- **Check**: Values are in milliseconds (300ms = 0.3s)

**Problem**: Images distorted
- **Solution**: Add `object-fit: cover` or `object-fit: contain`
- **Check**: Image dimensions in media queries

---

## Pro Tips

1. **Use browser DevTools** (F12) to inspect elements and test CSS live
2. **Test on real devices** before deploying
3. **Keep backups** of working versions
4. **Comment your changes** with dates
5. **Use consistent naming** when adding new variables
6. **Validate CSS** using [css-validator.org](https://css-validator.org)
7. **Performance**: Use CSS variables instead of recompiling SASS/LESS
8. **Accessibility**: Always maintain color contrast ratios (WCAG AA standard)

---

Happy customizing! Your portfolio is now fully flexible and ready for your personal brand.
