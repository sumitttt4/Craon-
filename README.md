# Craon

Craon is a cinematic landing page for an AI video editor. The experience combines a full-screen video hero, a scroll-directed editing story, layered Three.js frames, and a live edge overlay generated from the playing footage.

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- GSAP ScrollTrigger
- Three.js with React Three Fiber
- Lenis smooth scrolling

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deployment

The site is ready for standard Next.js hosting such as Vercel. Import the GitHub repository, keep the detected Next.js preset, and deploy with the default build command:

```bash
npm run build
```
