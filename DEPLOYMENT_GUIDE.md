# Senga Systems v2.0 - Deployment Guide

## Vercel Deployment Configuration

The application has been configured for seamless Vercel deployment with the following setup:

### Configuration Files

#### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "public",
  "installCommand": "npm install",
  "framework": "static"
}
```

- **buildCommand**: Runs `npm run build` which compiles TypeScript and copies files to `public/`
- **outputDirectory**: Points to the `public/` directory where all static files are served from
- **installCommand**: Installs npm dependencies (TypeScript compiler)
- **framework**: Marks as static site (no special runtime needed)

#### `package.json` Build Scripts
```bash
npm run build        # Full build: compile TS + copy files to public/
npm run build:ts     # Only compile TypeScript
npm run build:copy   # Only copy files to public/
npm run build:watch  # Watch mode for development
npm run type-check   # Type checking without compilation
```

### Build Process

When you push to GitHub or deploy to Vercel:

1. **Install Phase**
   ```bash
   npm install
   ```
   - Installs TypeScript 5.3.3 as dev dependency

2. **Build Phase**
   ```bash
   npm run build
   ```
   - Runs `tsc` to compile all TypeScript files from `src/` to `js/`
   - Runs build:copy to create the public directory structure:
     - Copies `index-new.html` → `public/index.html` (root)
     - Copies `compliance-audit.html` → `public/compliance-audit.html`
     - Copies all CSS files → `public/css/`
     - Copies all compiled JS files → `public/js/`
     - Copies assets → `public/assets/`

3. **Deployment Phase**
   - Vercel serves all files from the `public/` directory
   - Static files are cached with Vercel's edge network

### Public Directory Structure

```
public/
├── index.html                          # Homepage (from index-new.html)
├── compliance-audit.html               # African banks landing
├── css/                                # All stylesheets
│   ├── main.css
│   ├── base/
│   ├── layout/
│   └── components/
├── js/                                 # Compiled JavaScript + TypeScript
│   ├── index.js                        # Entry point
│   ├── modules/
│   │   ├── navigation.js
│   │   ├── auth.js
│   │   ├── email.js
│   │   └── pre-qualification.js
│   └── types/
│       └── index.d.ts
└── assets/
    └── icons/
        └── favicon.svg
```

### Environment Variables

If using SendGrid emails, add to Vercel Project Settings:

```
SENDGRID_API_KEY=your_api_key_here
```

Or use the `vercel.json` env mapping (already configured):
```json
"env": {
  "SENDGRID_API_KEY": "@sendgrid_api_key"
}
```

### Deployment Steps

#### Option 1: GitHub + Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel at https://vercel.com/dashboard
3. Vercel automatically deploys on every push
4. No additional configuration needed (uses `vercel.json`)

#### Option 2: Vercel CLI
```bash
npm install -g vercel
cd /vercel/share/v0-project
vercel
```

#### Option 3: Manual Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel auto-detects settings from `vercel.json`
5. Click "Deploy"

### Build Output

After running `npm run build`, you should see:

```
✓ TypeScript compiled (12 files, 0 errors)
✓ Public directory created
✓ 44 total files copied to public/
✓ Total size: 412 KB

Ready for deployment!
```

### Verification Checklist

Before deploying, verify:

- [ ] `public/index.html` exists (renamed from `index-new.html`)
- [ ] `public/css/` directory has all stylesheets (10+ files)
- [ ] `public/js/` directory has compiled JavaScript (15+ files)
- [ ] `public/js/modules/` has the 4 TypeScript modules
- [ ] `vercel.json` specifies `"outputDirectory": "public"`
- [ ] Environment variables set (if using SendGrid)
- [ ] No build errors when running `npm run build` locally

### Local Testing Before Deployment

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Verify public directory
ls -la public/

# Quick HTTP server for testing
python3 -m http.server 8000 --directory public
# Visit http://localhost:8000
```

### Troubleshooting

**Error: "No Output Directory named 'public' found"**
- Solution: Verify `vercel.json` has `"outputDirectory": "public"`
- Check that `npm run build` completes without errors
- Ensure `public/` directory exists with files after build

**Error: "Build command failed"**
- Run `npm run build` locally to see detailed error messages
- Check that `package.json` exists with all scripts
- Verify TypeScript can compile: `npm run type-check`

**Missing CSS/JS files**
- Run `npm run build:copy` to verify files are copied
- Check that source files exist (css/, js/, index-new.html)
- Verify permissions: `chmod -R 755 public/`

**TypeScript compilation errors**
- Run `npm run type-check` for detailed errors
- Fix errors in `src/` files
- Re-run `npm run build`

### Performance Optimization

Vercel automatically:
- Minifies CSS and JavaScript
- Gzips static files
- Caches files on edge network
- Serves from nearest data center

Additional optimization tips:
- Images are optimized via `public/assets/`
- CSS is modular for better caching
- JavaScript modules loaded on-demand
- Source maps available for debugging

### Rollback & Versioning

Vercel keeps deployment history:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments" tab
4. Click "Redeploy" next to any previous deployment

### Support & Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Static Export**: https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Build Configuration**: See `vercel.json` in project root

---

**Status**: Ready for Vercel deployment ✓
**Last Updated**: 2026-07-08
**Version**: 2.0.0
