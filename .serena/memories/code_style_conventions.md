# Code Style and Conventions

## TypeScript Configuration
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **Strict Mode**: Enabled
- **Path Alias**: `@/*` maps to `./src/*`
- **JSX**: react-jsx
- **Unused locals/parameters**: Error

## Code Style
- **Components**: Functional components with TypeScript
- **File naming**: PascalCase for components (Calculator.tsx), camelCase for utilities
- **Exports**: Named exports for components, default export at file bottom
- **UI Components**: Using shadcn/ui pattern with separate ui/ directory
- **Styling**: Tailwind CSS utility classes with cn() helper for merging

## Linting Rules
- ESLint with TypeScript support
- React Hooks rules enforced
- React Refresh plugin for HMR
- No unused variables or parameters
- No fallthrough in switch cases

## File Structure
- Components in `src/components/`
- UI primitives in `src/components/ui/`
- Utilities in `src/lib/`
- Type definitions in `src/types/`
- Global styles in `src/index.css`

## Import Style
- Absolute imports using `@/` prefix
- Group imports: external packages, then internal modules
- UI components from `@/components/ui/[component]`