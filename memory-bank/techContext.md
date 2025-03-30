# Technical Context

## Core Technologies

### Framework & Build Tools
- **React 18.2.0** - Core UI framework
- **Vite 5.2.0** - Build tool and development server
- **TypeScript 5.2.2** - Type-safe development
- **SWC** - Fast JavaScript/TypeScript compiler

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Headless UI components
  - Full suite of accessible components including:
    - Dialog, Alert, Toast components
    - Navigation and Menu systems
    - Form elements and controls
    - Layout primitives
- **Class Variance Authority** - Component style variants
- **Tailwind Merge** - Utility class merging
- **Framer Motion** - Animation library

### Routing & Navigation
- **React Router 6.23.1** - Application routing
  - Complete routing system with DOM bindings
  - Route configuration and navigation

### Form Handling
- **React Hook Form 7.51.5** - Form state management
- **Zod 3.23.8** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Date & Time
- **date-fns** - Date manipulation utilities
- **react-day-picker** - Date picker component

### UI Enhancement
- **cmdk** - Command palette interface
- **lucide-react** - Icon library
- **react-icons** - Additional icon sets
- **react-copy-to-clipboard** - Clipboard operations
- **embla-carousel-react** - Carousel component
- **react-resizable-panels** - Resizable layouts
- **vaul** - Drawer component

### Backend Integration
- **Supabase JS Client** - Database and authentication
- **Types generation** for Supabase

## Development Tools

### Build & Compilation
- **@vitejs/plugin-react-swc** - SWC integration for Vite
- **@swc/core** - Core SWC compiler
- **TypeScript** - Type checking and compilation
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Development Utilities
- **tempo-devtools** - Development tooling
- **Types** - TypeScript type definitions for dependencies

## Project Structure
```
project/
├── src/
│   ├── components/
│   │   ├── layout/    # Layout components
│   │   ├── tools/     # Text conversion tools
│   │   └── ui/        # Radix UI components
│   ├── data/          # Configuration
│   ├── lib/           # Utilities
│   ├── stories/       # Component stories
│   └── types/         # TypeScript types
├── public/            # Static assets
└── memory-bank/       # Project documentation
```

## Development Environment
- **Node.js** - JavaScript runtime
- **npm** - Package management
- **VSCode** - Recommended IDE
- **Git** - Version control

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Lint TypeScript files
- `npm run types:supabase` - Generate Supabase types

## Configuration Files
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `vite.config.ts` - Vite configuration
- `components.json` - Component configuration
