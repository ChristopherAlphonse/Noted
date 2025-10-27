---
description: 'Core Discipline: essential rules, minimal coding guidelines, and quick checks.'
applyTo: '**'
---

## Zero Anti-Patterns

- Function-Based Architecture
- Standard Functions
- Named Constants
- Focused Functions
- Consistent Logging
- Type Safety
- API Simplification

## Finding Related Code

1. **Semantic search first**: Use workspace search for high-level concepts
2. **Grep for exact strings**: Use grep for error messages or specific function names
3. **Follow imports**: Check what files import the problematic module
4. **Check test files**: Often reveal usage patterns and expected behavior

- Validating TypeScript Changes (MANDATORY)
- Compilation Process
- Testing & Validation


## Coding Guidelines

### Indentation
Use tabs, not spaces.

### Naming Conventions
- Use PascalCase for `type` names and `enum` values
- Use camelCase for `function` and `method` names, `property` names and `local variables`
- Use whole words in names when possible

### Types
- Prefer explicit types; avoid exporting types/functions unless needed across packages
- Do not export `types` or `functions` unless you need to share it across multiple components
- Do not introduce new `types` or `values` to the global namespace
- Avoid `any`/`unknown` unless strictly necessary; prefer proper interfaces and types

### Comments
Use JSDoc style comments for `functions`, `interfaces`, `enums`, and `classes`

### Strings
- Use "double quotes" for strings shown to the user that need to be externalized (localized)
- Use 'single quotes' otherwise
- All strings visible to the user need to be externalized using the `vs/nls` module
- Externalized strings must not use string concatenation. Use placeholders instead (`{0}`)

### UI Labels
- Use title-style capitalization for command labels, buttons and menu items (each word is capitalized)
- Don't capitalize prepositions of four or fewer letters unless it's the first or last word (e.g. "in", "with", "for")

### Code Style

- Use arrow functions `=>` over anonymous function expressions
- Only surround arrow function parameters when necessary. For example, `(x) => x + x` is wrong but the following are correct:

```typescript
x => x + x
(x, y) => x + y
<T>(x: T, y: T) => x === y
```

- Always surround loop and conditional bodies with curly braces
- Open curly braces always go on the same line as whatever necessitates them
- Parenthesized constructs should have no surrounding whitespace. A single space follows commas, colons, and semicolons in those constructs. For example:

```typescript
for (let i = 0, n = str.length; i < 10; i++) {
    if (x < 10) {
        foo();
    }
}
function f(x: number, y: string): void { }
```

- Whenever possible, use in top-level scopes `export function x(…) {…}` instead of `export const x = (…) => {…}`. One advantage of using the `function` keyword is that the stack-trace shows a good name when debugging
- Prefer `async` and `await` over `Promise` and `then` calls

### Code Quality & Hygiene

- All user facing messages must be localized using the applicable localization framework
- Never commit secrets or `.env` files; add `.env.example` instead
- Clean up temporary files used during iteration
- Never duplicate imports. Always reuse existing imports if they are present
- Don't add tests to the wrong test suite (e.g., adding to end of file instead of inside relevant suite)
- Look for existing test patterns before creating new structures
- Use `describe` and `test` consistently with existing patterns

---

**Read**: `ROADMAP.md`, `tasks/tasks-ROADMAP.md`
