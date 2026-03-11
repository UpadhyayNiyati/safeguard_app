# Contributing to SafeGuard

Thank you for your interest in contributing to SafeGuard! We welcome contributions from developers of all skill levels. This guide will help you get started.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your feature or fix
4. **Make your changes** and commit with clear messages
5. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/safeguard.git
cd safeguard

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Start development server
pnpm dev
```

Visit http://localhost:3000 to see your changes with hot reload.

## Project Structure

```
safeguard/
├── app/                      # Next.js pages and routes
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── [other-pages]/       # Other page routes
├── components/              # Reusable React components
│   ├── navbar.tsx           # Navigation component
│   ├── footer.tsx           # Footer component
│   ├── ui/                  # shadcn/ui components
│   └── ...
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── public/                  # Static assets
├── .env.local              # Environment variables (local)
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types for props and return values
- Avoid using `any` type - use proper typing
- Run type checking: `npm run type-check`

```typescript
// ✅ Good
interface Props {
  title: string;
  count: number;
  onClick: (id: string) => void;
}

function Component({ title, count, onClick }: Props) {
  return <div>{title}: {count}</div>;
}

// ❌ Avoid
function Component(props: any) {
  return <div>{props.title}: {props.count}</div>;
}
```

### React Best Practices

- Use functional components with hooks
- Lift state up when multiple components need it
- Use custom hooks for reusable logic
- Keep components small and focused
- Memoize expensive computations with `useMemo`
- Use `useCallback` for stable function references

```typescript
// ✅ Good
function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  const filteredUsers = useMemo(
    () => users.filter(u => u.active),
    [users]
  );

  return (
    <div>
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// ❌ Avoid
function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div>
      {users.map(user => (
        user.active && <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### CSS/Tailwind

- Use Tailwind CSS classes for styling
- Avoid inline styles unless necessary
- Use semantic design tokens (from config)
- Keep component CSS co-located with the component

```typescript
// ✅ Good
<div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
  Button
</div>

// ❌ Avoid
<div style={{ 
  padding: '8px 16px', 
  backgroundColor: '#667eea',
  color: 'white',
  borderRadius: '8px'
}}>
  Button
</div>
```

## Naming Conventions

### Files and Folders

- **Components**: PascalCase (`Navbar.tsx`, `AlertDialog.tsx`)
- **Pages**: kebab-case (`about.tsx`, `emergency-contacts.tsx`)
- **Utilities**: camelCase (`utils.ts`, `getLocation.ts`)
- **Hooks**: camelCase with `use` prefix (`useLocation.ts`, `useMobile.ts`)
- **Types/Interfaces**: PascalCase with `Props` suffix for component props

```
components/
├── Navbar.tsx              # ✅ Component
├── EmergencyButton.tsx     # ✅ Component
└── ui/
    ├── Button.tsx          # ✅ Component
    └── Card.tsx            # ✅ Component

app/
├── page.tsx                # ✅ Page
├── about/page.tsx          # ✅ Page
└── emergency-contacts/page.tsx  # ✅ Page

hooks/
├── useLocation.ts          # ✅ Hook
└── useMobile.ts            # ✅ Hook

lib/
├── utils.ts                # ✅ Utility
└── helpers.ts              # ✅ Utility
```

## Commit Messages

Write clear, concise commit messages:

```
# ✅ Good
feat: Add emergency contact quick-dial feature
fix: Resolve location permission denied error
docs: Update setup guide with Docker instructions
style: Format navbar component with Prettier
refactor: Simplify map component initialization

# ❌ Avoid
fixed bugs
updated stuff
changes
new feature
```

Use conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Test changes
- `chore:` - Build, dependencies, etc.

## Pull Request Process

1. **Before submitting:**
   - Run type check: `npm run type-check`
   - Run linter: `npm run lint`
   - Build the project: `npm run build`
   - Test your changes manually

2. **PR Title and Description:**
   ```markdown
   # Title
   feat: Add dark mode toggle to navbar

   ## Description
   Adds a theme switcher to the navbar that allows users to toggle 
   between light and dark modes. Uses next-themes for persistent storage.

   ## Changes
   - Added ThemeToggle component
   - Integrated next-themes provider
   - Updated navbar layout for theme button

   ## Screenshots
   [Optional: Add screenshots of new features]

   ## Testing
   - Tested theme persistence on page reload
   - Verified accessibility with keyboard navigation
   - Tested on mobile devices

   ## Checklist
   - [x] Code follows project style guidelines
   - [x] Self-review completed
   - [x] Comments added for complex logic
   - [x] Documentation updated
   - [x] No new warnings generated
   - [x] Tests added (if applicable)
   ```

3. **Wait for review** and address feedback
4. **PR will be merged** once approved

## Testing

### Manual Testing

- Test in development: `pnpm dev`
- Test in production build: `npm run build && npm start`
- Test on mobile devices using browser DevTools
- Test with different browsers (Chrome, Firefox, Safari)

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Adding New Features

### Adding a New Page

1. Create folder under `app/`:
```
app/new-feature/page.tsx
```

2. Create the component:
```typescript
'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function NewFeature() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      {/* Your content here */}
      <Footer />
    </main>
  );
}
```

3. Update navigation in `components/navbar.tsx`:
```typescript
<Link href="/new-feature" className="...">
  New Feature
</Link>
```

### Adding a New Component

1. Create file in `components/`:
```typescript
interface Props {
  title: string;
  description?: string;
}

export function MyComponent({ title, description }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
```

2. Export from `components/index.ts` if creating a barrel export

### Adding a New Hook

1. Create file in `hooks/`:
```typescript
import { useState, useEffect } from 'react';

export function useMyHook(param: string) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Hook logic
  }, [param]);

  return state;
}
```

2. Use in components:
```typescript
import { useMyHook } from '@/hooks/useMyHook';

function MyComponent() {
  const data = useMyHook('param');
  // ...
}
```

## Bug Reports

Found a bug? Please report it:

1. **Check existing issues** - Don't duplicate reports
2. **Create detailed report:**
   - What did you do?
   - What did you expect?
   - What actually happened?
   - Screenshots/video (if applicable)
   - Browser and OS information
   - Steps to reproduce

```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Go to page/component X
2. Click button Y
3. See error Z

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
[If applicable]

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Node version: 18.0.0
```

## Feature Requests

Have an idea? We'd love to hear it!

```markdown
## Feature Description
Clear description of the requested feature

## Use Case
Why would this be useful?

## Proposed Solution
How should it work?

## Alternatives
Any alternative approaches?
```

## Documentation

Help improve our documentation:

- Update README.md for major changes
- Add JSDoc comments for complex functions
- Include examples for new features
- Fix typos and unclear sections

```typescript
/**
 * Finds the nearest emergency service of a given type
 * @param location - The user's current coordinates
 * @param serviceType - Type of service (hospital, police, fire)
 * @returns Promise with service details and map HTML
 * @example
 * const service = await findNearestService(
 *   { lat: 40.7128, lng: -74.0060 },
 *   'hospital'
 * );
 */
async function findNearestService(
  location: Location,
  serviceType: ServiceType
): Promise<ServiceDetails> {
  // Implementation
}
```

## Performance

Please consider performance when contributing:

- Minimize bundle size
- Use code splitting for routes
- Optimize images
- Avoid unnecessary re-renders
- Use production mode for testing

Check bundle size:
```bash
npm run build
# Check the output size
```

## Accessibility

Ensure your changes are accessible:

- Use semantic HTML
- Add ARIA labels where needed
- Test with keyboard navigation
- Ensure sufficient color contrast
- Test with screen readers

```typescript
// ✅ Good - Semantic HTML and ARIA
<button 
  aria-label="Toggle theme"
  onClick={toggleTheme}
  className="p-2 rounded-lg"
>
  <Sun />
</button>

// ❌ Avoid - Inaccessible
<div onClick={toggleTheme}>
  Theme
</div>
```

## Questions?

- **GitHub Discussions**: Ask questions and discuss ideas
- **GitHub Issues**: Report bugs and request features
- **Email**: support@safeguard.app

## License

By contributing to SafeGuard, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to SafeGuard! Together we're making emergency services more accessible. 🛡️
