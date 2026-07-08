# TypeScript Build & Integration Guide

## Overview

This guide explains how to build, test, and deploy the new TypeScript-based Senga Systems website with the redesigned UI.

## Project Structure

```
/vercel/share/v0-project/
├── src/                          # TypeScript source files
│   ├── index.ts                 # Main entry point
│   ├── types/
│   │   └── index.ts             # Shared type definitions
│   └── modules/
│       ├── navigation.ts        # Navigation & menu handling
│       ├── auth.ts              # Authentication module
│       ├── email.ts             # Email service with retry logic
│       └── pre-qualification.ts # Lead scoring form
│
├── js/                           # Compiled JavaScript (build output)
├── css/
│   ├── main.css                 # Main stylesheet
│   ├── base/
│   │   ├── variables.css        # Design tokens
│   │   └── reset.css            # Reset & typography
│   ├── layout/
│   │   └── utilities.css        # Flexbox & spacing utilities
│   └── components/
│       └── elements.css         # Buttons, cards, forms
│
├── index-new.html               # New redesigned homepage
├── compliance-audit.html        # Compliance landing page
├── tsconfig.json                # TypeScript configuration
├── package.json                 # NPM dependencies & scripts
└── TYPESCRIPT_BUILD_GUIDE.md    # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs TypeScript (required for compilation).

### 2. Build TypeScript

```bash
# One-time build
npm run build

# Watch mode (for development)
npm run build:watch

# Type checking only (no emission)
npm run type-check
```

**Output:** TypeScript files compile from `src/` → `js/` directory.

### 3. HTML Integration

Update your HTML files to reference the compiled JavaScript:

**Before (old)**:
```html
<script src="js/main.js"></script>
<script src="js/pre-qualification.js"></script>
```

**After (new)**:
```html
<!-- Compiled TypeScript modules -->
<script src="js/navigation.js"></script>
<script src="js/pre-qualification.js"></script>
<script src="js/auth.js"></script>
<script src="js/email.js"></script>
```

## Build Process

### Compilation Steps

1. **TypeScript Compilation**
   - Reads `src/**/*.ts` files
   - Validates strict type checking
   - Generates `.js` files in `js/` directory
   - Creates `.d.ts` declaration files
   - Generates source maps (`.js.map`)

2. **Output Structure**
   ```
   js/
   ├── index.d.ts
   ├── index.d.ts.map
   ├── index.js
   ├── index.js.map
   ├── modules/
   │   ├── navigation.d.ts
   │   ├── navigation.js
   │   ├── auth.d.ts
   │   ├── auth.js
   │   ├── email.d.ts
   │   ├── email.js
   │   ├── pre-qualification.d.ts
   │   └── pre-qualification.js
   └── types/
       ├── index.d.ts
       └── index.js
   ```

3. **Validation**
   - Run `npm run type-check` to verify types without building
   - Check console for any type errors
   - All errors must resolve before deployment

## TypeScript Configuration

**tsconfig.json** settings:

- **target**: ES2020 (modern JavaScript, good browser support)
- **module**: ES2020 (ES modules for better tree-shaking)
- **strict**: true (enables all strict type checks)
- **lib**: ES2020 + DOM (includes DOM types for browser APIs)
- **sourceMap**: true (enables debugging in browser DevTools)
- **declaration**: true (generates .d.ts files for type information)

## Module Usage

### In HTML (Global Window)

```html
<script src="js/index.js"></script>
<script>
  // Access modules via window.SengaSystems
  const auth = new window.SengaSystems.Auth();
  const nav = new window.SengaSystems.Navigation();
  const form = new window.SengaSystems.PreQualification();
  const email = new window.SengaSystems.EmailService();
</script>
```

### In TypeScript/JavaScript

```typescript
import { Auth, Navigation, PreQualification, EmailService } from './src/index';

const auth = new Auth();
const nav = new Navigation();
const form = new PreQualification();
const email = new EmailService();
```

## Development Workflow

### 1. Make Changes

Edit TypeScript files in `src/`:

```typescript
// src/modules/my-module.ts
export class MyModule {
  public doSomething(): void {
    console.log('Hello!');
  }
}
```

### 2. Compile & Test

```bash
# Watch for changes
npm run build:watch

# In another terminal, open browser to test
# TypeScript automatically recompiles on save
```

### 3. Debug

- Browser DevTools shows original TypeScript code (via source maps)
- Set breakpoints directly in `.ts` files
- Console shows proper error stack traces

### 4. Deploy

```bash
# Final build before deployment
npm run build

# Verify no type errors
npm run type-check

# Commit compiled JS files (js/ directory)
git add js/
git commit -m "Build: Compile TypeScript changes"
```

## Type System Benefits

### 1. Compile-Time Checking

```typescript
// This catches an error before runtime
const form: PreQualificationForm = {
  name: 'test',
  // Missing required field 'email' ❌
};
```

### 2. IntelliSense & Autocomplete

```typescript
const auth = new Auth();
// IDE suggests: login(), logout(), getUser(), etc.
auth.lo... // Shows autocomplete suggestions
```

### 3. Self-Documenting Code

```typescript
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user'; // Only these two values allowed
}

// Clear what's expected
function getUser(id: string): User | null { ... }
```

### 4. Refactoring Safety

```typescript
// Rename a property across entire codebase
// TypeScript immediately shows all broken references
property.oldName → property.newName
// All usages highlighted
```

## Common Commands

```bash
# Build once
npm run build

# Watch mode (rebuild on save)
npm run build:watch

# Type check only (fast, no build)
npm run type-check

# Type check in watch mode
npm run type-check:watch

# List package scripts
npm run
```

## Troubleshooting

### "Cannot find module"

**Error**: `Cannot find module '@types/index'`

**Fix**: Ensure `tsconfig.json` paths are correct:
```json
{
  "compilerOptions": {
    "paths": {
      "@types/*": ["src/types/*"]
    }
  }
}
```

### Type errors on compile

**Error**: `Object is not assignable to type...`

**Fix**: Check the type definition in `src/types/index.ts` and ensure data matches:
```typescript
// If type expects string, don't pass number
const user: User = {
  id: "123",  // ✓ string
  email: "test@example.com"  // ✓ string
};
```

### Compiled JavaScript not updating

**Error**: Old compiled JS still running

**Fix**: 
1. Clear browser cache (Ctrl+Shift+Del)
2. Hard refresh (Ctrl+F5)
3. Check `js/` directory modification times
4. Rebuild: `npm run build`

## Performance Optimization

### 1. Tree-Shaking

ES2020 modules enable tree-shaking: unused code is eliminated in production builds.

```typescript
// Only imported functions are included in bundle
import { Auth } from './src/index';
// EmailService not imported = not included in bundle
```

### 2. Source Maps

Disabled in production:
```json
{
  "compilerOptions": {
    "sourceMap": false  // For production
  }
}
```

### 3. Module Splitting

Keep modules small and focused:
- `auth.ts` - Authentication only
- `email.ts` - Email service only
- `navigation.ts` - Navigation only

## Migration Checklist

- [ ] `npm install` (install TypeScript)
- [ ] `npm run build` (compile TypeScript → JS)
- [ ] `npm run type-check` (verify no type errors)
- [ ] Update HTML to use compiled `.js` files
- [ ] Test in browser (open DevTools, check console)
- [ ] Verify all features work
- [ ] Hard refresh browser (Ctrl+F5)
- [ ] Deploy to production
- [ ] Monitor error logs (console should be clean)

## Next Steps

1. **API Integration**: Connect modules to real backend endpoints
2. **Error Handling**: Implement comprehensive error boundary
3. **Analytics**: Add tracking for form submissions & user events
4. **Testing**: Add unit tests with Jest or Vitest
5. **Bundling**: Use esbuild or Webpack for production optimization

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [DOM Types](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [ES2020 Features](https://www.ecma-international.org/ecma-262/11.0/)
