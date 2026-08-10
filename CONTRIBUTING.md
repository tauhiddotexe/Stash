# Contributing to Stash

Thank you for your interest in contributing to Stash! This document outlines the guidelines and steps to help you get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be respectful, constructive, and inclusive. Harassment or unwelcoming behavior will not be tolerated.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Stash.git
   cd Stash
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Start** the development server:
   ```bash
   npm run dev
   ```

---

## How to Contribute

You can contribute in several ways:

- **Bug fixes** — address open issues or fix bugs you discover
- **Features** — implement new functionality from the future scope or your own ideas
- **Documentation** — improve README, code comments, or project docs
- **Design** — improve UI/UX, accessibility, or visual polish
- **Tests** — add tests for calculations, validation, or components

---

## Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Ensure the project builds and type-checks:
   ```bash
   npm run build
   ```
4. Commit your changes (see [Commit Guidelines](#commit-guidelines))
5. Push to your fork and open a Pull Request

---

## Coding Standards

- **TypeScript** — strict mode enabled; avoid `any`
- **Functional components** — prefer React function components with hooks
- **No hardcoded values** — use the design token system (colors, spacing, radii, typography)
- **Separation of concerns** — keep UI, business logic, and storage in separate layers
- **Pure calculations** — domain logic should be deterministic and testable
- **Accessible markup** — semantic HTML, ARIA labels, keyboard support
- **No external dependencies** without justification — keep the bundle lean

---

## Commit Guidelines

Follow a clear, descriptive commit style:

```
<type>: <short summary>

<optional body>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`, `perf`

Examples:
- `feat: add CSV export for expense history`
- `fix: correct week boundary calculation for custom ranges`
- `docs: update installation instructions`

---

## Pull Request Process

1. Ensure your branch builds successfully (`npm run build`)
2. Update documentation if your change affects usage
3. Describe what your PR does and why in the PR description
4. Link any related issues
5. Request review and address feedback promptly

---

## Reporting Bugs

When reporting a bug, include:

- A clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Browser and OS version
- Screenshots if applicable

Open an issue at [github.com/tauhiddotexe/Stash/issues](https://github.com/tauhiddotexe/Stash/issues).

---

## Suggesting Features

Feature suggestions are welcome! Open an issue describing:

- What the feature does
- Why it would be valuable
- Any implementation ideas you have

---
