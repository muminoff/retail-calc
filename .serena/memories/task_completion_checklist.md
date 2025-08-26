# Task Completion Checklist

When completing any development task, ensure:

## Before Committing
1. **Lint Check**: Run `npm run lint` and fix any errors
2. **Type Check**: Ensure `npm run build` passes (includes TypeScript check)
3. **Test Locally**: Run `npm run dev` and verify changes work
4. **Code Review**: Ensure code follows project conventions

## Code Quality Checks
- [ ] No ESLint warnings or errors
- [ ] TypeScript types properly defined (no `any` types unless necessary)
- [ ] Imports use `@/` path alias where applicable
- [ ] Components follow existing patterns
- [ ] Tailwind classes used for styling
- [ ] No console.log statements in production code

## Before Deployment
- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] Environment variables configured if needed
- [ ] No sensitive data in code

## Vercel Deployment
- Changes pushed to `main` branch auto-deploy
- Pull requests get preview deployments
- Check Vercel dashboard for deployment status