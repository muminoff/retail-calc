# Development Commands

## Primary Commands
- `npm install` - Install all dependencies
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## TypeScript Commands
- `tsc -b` - Build TypeScript (included in npm run build)
- `tsc --noEmit` - Type check without emitting files

## Deployment Commands
- `vercel` - Deploy to Vercel staging
- `vercel --prod` - Deploy to Vercel production
- `vercel env pull` - Pull environment variables locally

## Git Commands
- `git status` - Check changed files
- `git diff` - View changes
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit changes
- `git push` - Push to remote repository

## System Commands (macOS/Darwin)
- `ls -la` - List all files with details
- `find . -name "*.tsx"` - Find TypeScript React files
- `grep -r "pattern" src/` - Search in source files
- `open .` - Open current directory in Finder