# Zesho UI Rebuild Design Spec

**Date:** 2024-12-19
**Status:** Approved
**Scope:** Full app UI rebuild

## Overview

Complete UI overhaul of the Zesho books app, shifting from the dark Runway-inspired aesthetic to a minimal, clean Apple Books-inspired design with premium polish.

## Design Goals

1. **Visual Refresh** - Modern, sophisticated Apple-like aesthetic
2. **Better UX** - Improved navigation, discoverability, reading flow
3. **Performance** - Optimized rendering, reduced re-renders
4. **Premium Feel** - Luxurious depth through shadows, glass effects, gradients

## Color System

### Light Mode (Primary)
| Role | Color | Usage |
|------|-------|-------|
| Background | `#FFFFFF` | Main screen bg |
| Surface | `#F5F5F7` | Cards, elevated areas |
| Surface Hover | `#EBEBED` | Interactive states |
| Border | `#E5E5EA` | Subtle dividers |
| Text Primary | `#1D1D1F` | Headings, primary content |
| Text Secondary | `#86868B` | Descriptions, metadata |
| Text Tertiary | `#AEAEB2` | Placeholders, hints |
| Accent | `#5856D6` | CTAs, links, active states |
| Accent Soft | `rgba(88,86,214,0.12)` | Highlight backgrounds |
| Success | `#34C759` | Positive actions |
| Error | `#FF3B30` | Destructive actions |

### Dark Mode
| Role | Color | Usage |
|------|-------|-------|
| Background | `#000000` | Main screen bg |
| Surface | `#1C1C1E` | Cards, elevated areas |
| Surface Hover | `#2C2C2E` | Interactive states |
| Border | `#38383A` | Subtle dividers |
| Text Primary | `#F5F5F7` | Headings |
| Text Secondary | `#98989D` | Descriptions |
| Text Tertiary | `#636366` | Placeholders |
| Accent | `#5E5CE6` | CTAs (brighter for dark bg) |
| Accent Soft | `rgba(94,92,230,0.16)` | Highlight backgrounds |

## Typography

**Font:** Inter (fallback: -apple-system, BlinkMacSystemFont)

| Role | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| Large Title | 34px | 700 | 1.05 | -0.9px | Screen headers |
| Title 1 | 28px | 700 | 1.1 | -0.5px | Section headers |
| Title 2 | 22px | 700 | 1.2 | -0.3px | Card titles |
| Headline | 17px | 600 | 1.3 | -0.2px | Subsection headers |
| Body | 17px | 400 | 1.5 | -0.1px | Primary content |
| Callout | 15px | 400 | 1.4 | -0.1px | Secondary content |
| Subhead | 13px | 400 | 1.4 | 0.1px | Metadata |
| Caption | 12px | 500 | 1.3 | 0.2px | Hints, labels |
| Section Label | 11px | 600 | 1.3 | 1.5px | Uppercase section markers |

### Typography Principles
- Negative letter-spacing for all headings (tight, editorial feel)
- Uppercase + wide letter-spacing for section labels
- Weight 700 for titles, 600 for headlines, 400 for body
- Generous line-height (1.5) for body text readability

## Components

### Book Card
- **Background:** White/Surface
- **Border Radius:** 16px
- **Shadow:** Layered (0 2px 8px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.03))
- **Book Cover:** 160px width, 224px height (ratio ~1:1.4)
- **Cover Effects:** Left spine accent (3px), gradient overlay at bottom
- **Title:** 14px, weight 600, letter-spacing -0.2px
- **Author:** 12px, weight 400, text secondary color
- **Padding:** 14px

### Tab Bar (Floating)
- **Position:** Absolute, 20px margin from edges
- **Background:** rgba(255,255,255,0.92) light / rgba(0,0,0,0.92) dark
- **Backdrop Filter:** blur(20px)
- **Border Radius:** 24px
- **Border:** 0.5px solid rgba(0,0,0,0.06)
- **Shadow:** 0 4px 24px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.04)
- **Icon Size:** 22px
- **Label Size:** 10px
- **Active:** Accent color, weight 600
- **Inactive:** Text tertiary, weight 500

### Search Bar
- **Background:** #F5F5F7
- **Border Radius:** 16px
- **Height:** 48px
- **Padding:** 14px horizontal
- **Icon:** 18px, text tertiary
- **Placeholder:** 16px, text tertiary
- **No visible border in default state**

### Section Headers
- **Container:** Flex row, space-between, baseline alignment
- **Label:** 11px, weight 600, uppercase, letter-spacing 1.5px, text secondary
- **Title:** 20px, weight 700, letter-spacing -0.3px, text primary
- **"See all":** 15px, weight 500, accent color

### Buttons
- **Primary:** Accent bg, white text, 14px radius, 50px height, weight 600
- **Secondary:** Surface bg, text primary, 1px border, 14px radius
- **Ghost:** No background, accent text, weight 500

### Hero Card
- **Border Radius:** 20px
- **Background:** Deep gradient (varies by collection)
- **Effects:** Ambient glow (radial gradient with blur)
- **Content:** Section label, title, description, CTA button
- **CTA:** Glassmorphism (backdrop-blur, semi-transparent bg, border)

### Quick Actions
- **Container:** White bg, 18px radius, multi-layer shadow
- **Icon Container:** 48px, gradient bg (accent soft), 14px radius
- **Icon:** 24px, accent color, stroke-width 1.5
- **Title:** 15px, weight 600, text primary
- **Subtitle:** 12px, weight 400, text secondary

## Layout System

### Spacing Scale
- **xxs:** 2px
- **xs:** 4px
- **sm:** 8px
- **md:** 12px
- **lg:** 16px
- **xl:** 20px
- **xxl:** 24px
- **xxxl:** 32px

### Screen Margins
- **Horizontal:** 20px (consistent across all screens)
- **Header Bottom:** 28px
- **Section Gap:** 28px

### Border Radius Scale
- **sm:** 12px (search bars, small buttons)
- **md:** 16px (cards, inputs)
- **lg:** 18px (quick actions)
- **xl:** 20px (hero cards, modals)
- **xxl:** 24px (tab bar)
- **full:** 9999px (avatars, badges)

## Shadow System

### Card Shadow (Default)
```css
box-shadow: 
  0 1px 2px rgba(0,0,0,0.02),
  0 4px 8px rgba(0,0,0,0.03),
  0 12px 24px rgba(0,0,0,0.04),
  0 24px 48px rgba(0,0,0,0.02);
```

### Elevated Shadow
```css
box-shadow: 
  0 2px 6px rgba(0,0,0,0.06),
  0 8px 20px rgba(0,0,0,0.08),
  0 16px 36px rgba(0,0,0,0.06);
```

### Tab Bar Shadow
```css
box-shadow: 
  0 4px 24px rgba(0,0,0,0.08), 
  0 12px 40px rgba(0,0,0,0.04);
```

## Effects

### Glassmorphism
- Background: rgba(255,255,255,0.92) light / rgba(0,0,0,0.92) dark
- Backdrop Filter: blur(20px)
- Border: 0.5px solid rgba(0,0,0,0.06)

### Ambient Glow
- Radial gradient with accent color
- Filter: blur(40px)
- Opacity: 0.25-0.3

## Animations

- **Page Transitions:** Fade (existing)
- **Card Press:** Scale to 0.98 (200ms ease)
- **Tab Press:** Subtle scale feedback
- **Pull to Refresh:** Native implementation

## Screens to Rebuild

### Priority 1 (Core)
1. Home Screen (index.tsx)
2. Library Screen (library.tsx)
3. Profile Screen (profile.tsx)
4. Tab Bar Layout (_layout.tsx)

### Priority 2 (Secondary)
5. Category/Shelf Screen
6. Book Detail Screen
7. Search Screen
8. Settings Screen

### Priority 3 (Remaining)
9. Favorites
10. History
11. Notes
12. Notifications
13. Help
14. Onboarding
15. Auth screens

## Implementation Notes

### Theme System
- Extend existing ThemeContext with new color tokens
- Add dark mode variant for new accent colors
- Ensure all components use theme colors consistently

### Performance
- Maintain React.memo on BookCard, BookRow
- Use useMemo for filtered lists
- FlatList for library (already implemented)
- Optimize image caching

### Accessibility
- Ensure proper contrast ratios (WCAG AA)
- Add accessibility labels to interactive elements
- Support dynamic type scaling

## Open Questions

None - design approved.

## Next Steps

1. Create implementation plan (writing-plans skill)
2. Update theme constants
3. Rebuild components in priority order
4. Test across all screens
5. Verify dark mode consistency
