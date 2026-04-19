# PostStack

PostStack is a fast, execution-focused publishing tool for founders and operators.

One input becomes an X-first post, then adapted outputs for LinkedIn, Instagram, and email. It is intentionally not a content strategy, scoring, template, or exploration product.

## Scope

- Generate one primary X post from a source thought.
- Adapt that post into secondary platform outputs.
- Transform the current draft with four actions: tighten opening, shorten, expand, and podcast outline.
- Push the X post through the X web intent.
- Copy the complete output stack.

## Constraints

- Dark mode only.
- Chartreuse is reserved for primary actions and focus states.
- No metrics, saved backlog, templates, hook galleries, onboarding, or strategy UI.
- Publishing API credentials are not required for the default browser-intent workflow.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy the example file if you add real API publishing later:

```bash
copy .env.example .env.local
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deploy To Vercel

CLI workflow:

```bash
npm install -g vercel
vercel login
vercel link
vercel deploy
```

Production deploy:

```bash
vercel deploy --prod
```

GitHub workflow:

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Confirm the framework preset is Next.js.
4. Add environment variables from `.env.example` only if you wire direct API publishing.
5. Deploy.
