# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 fullstack application for Railway.com assessment - a landing page for a container management service that allows users to spin up and spin down containers. The project uses a modern stack with React 19, TypeScript, Tailwind CSS v4, and shadcn/ui components.

## Architecture

### Tech Stack
- **Framework**: Next.js 15.5.6 with Turbopack for faster builds and development
- **UI Library**: React 19.1.0 with Server Components (RSC) by default
- **Component Library**: shadcn/ui (New York style) with Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom OKLch color variables and animations (tw-animate-css)
- **Type Safety**: TypeScript 5 with strict mode enabled
- **Linting**: ESLint 9 with Next.js and TypeScript configurations

### Directory Structure

```
src/
├── app/           # Next.js App Router (client entry points and layouts)
│   ├── page.tsx   # Home page - composes Navbar and Hero components
│   ├── layout.tsx # Root layout with metadata and font configuration
│   └── globals.css # Global Tailwind CSS configuration with CSS variables
├── components/    # Reusable React components
│   ├── Navbar.tsx # Navigation bar (client-side interactive component)
│   ├── Hero.tsx   # Hero section landing component
│   └── ui/        # shadcn/ui components (generated from registry)
└── lib/
    └── utils.ts   # Utility functions (class merging via clsx/tailwind-merge)
```

### Styling Architecture

The project uses Tailwind CSS v4 with a comprehensive CSS variables system:

- **Color System**: OKLch color space for accessible, modern colors
- **Light/Dark Theming**: Dual theme setup with CSS custom properties (`:root` and `.dark`)
- **CSS Variables**: All design tokens (colors, shadows, fonts, radius) are CSS variables
- **Animations**: tw-animate-css library provides pre-built Tailwind animations

Key CSS variable categories:
- **Colors**: background, foreground, card, primary, secondary, accent, destructive, border, input, ring
- **Semantic Colors**: sidebar variants, chart colors
- **Typography**: --font-sans (Geist), --font-mono, --font-serif
- **Spacing & Radius**: Custom spacing unit (0.25rem) and radius system
- **Shadows**: Shadow system with 2xs through 2xl variants

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with Turbopack (localhost:3000) |
| `npm run build` | Create optimized production build with Turbopack |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint with ESLint v9 flat config system |

## Component Development

### Client vs Server Components
- Components are Server Components by default in the app directory
- Use `"use client"` directive for interactive components (Navbar, Hero)
- Interactive features like button clicks require client-side rendering

### shadcn/ui Setup
- Configuration is in `components.json` with New York style
- Component aliases allow clean imports: `@/components/ui/button`
- The `@/lib/utils` file exports `cn()` helper for class merging
- Generate new components using: `npx shadcn-ui@latest add [component-name]`

### Component Pattern
- UI components are composable and use CVA (class-variance-authority) for variants
- Components accept standard HTML attributes and Tailwind className props
- Responsive design is built-in via Tailwind responsive prefixes (sm:, md:, lg:)

## Code Quality

- **ESLint Config**: Uses `next/core-web-vitals` and `next/typescript` configurations
- **Ignored Paths**: node_modules, .next, out, build directories
- **TypeScript**: Strict mode enabled with incremental compilation
- **Path Aliases**: `@/*` points to `./src/` for clean imports

## Important Notes

- The project uses Next.js v15 with Turbopack enabled by default for faster development and builds
- Tailwind CSS v4 uses the new `@import "tailwindcss"` syntax instead of PostCSS config
- Component colors automatically adapt to light/dark theme via CSS variables
- All fonts (Geist Sans, Geist Mono) are optimized via Next.js font system
