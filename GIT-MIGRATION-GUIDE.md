# Git Migration Guide

## Prerequisites
- Git installed locally
- GitHub account with access to spruceotter/BMFFFL repo
- Node.js 18+ installed

## Steps

### 1. Clone or initialize
If you have the repo already:
```bash
git clone https://github.com/spruceotter/BMFFFL.git
cd BMFFFL
```

If starting fresh:
```bash
mkdir BMFFFL && cd BMFFFL
git init
git remote add origin https://github.com/spruceotter/BMFFFL.git
```

### 2. Copy the site files
Copy everything from the bmfffl-website build directory into your local repo.

### 3. Stage and commit
```bash
git add .
git commit -m "feat: Next.js 14 dynasty platform — 157 pages, full analytics suite"
```

### 4. Push to GitHub
```bash
git push -u origin main
# OR if creating a new branch:
git checkout -b nextjs-rebuild
git push -u origin nextjs-rebuild
```

### 5. Connect Vercel
See DEPLOY.md for Vercel settings.
