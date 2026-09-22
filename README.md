# FREEVERSE — Student Ecosystem Website

Premium frontend website for the Freeverse student club, built for a Website Creation Competition.

## Concept

**Learn → Create → Showcase → Connect → Freelance → Opportunity**

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS (CDN for simplicity + custom CSS utilities)
- Framer Motion (animations)
- Lucide React (icons)
- localStorage (freelancer profiles)

## Features

### Home / Hero
- Full-screen hero with tagline
- Interactive ecosystem flow: Student → Skills → Portfolio → Client → Hire
- JOIN FREEVERSE & EXPLORE FREELANCERS CTAs

### About
- Vision & Mission
- 8 Objective cards
- 5 Why Join benefit cards

### Journey
- Animated 6-step path: Join → Learn → Build → Showcase → Discover → Hired

### Events & Activities
- Filterable events (Workshops, Competitions, Seminars, Technical, Non-Technical)
- Event detail modals
- Past events gallery with lightbox

### Freelancer Marketplace ⭐
- Search across name, title, skills, projects
- Skill category filters
- Service selector ("What do you need help with?")
- Premium freelancer cards with hover states
- Profile modal with projects
- Hire / Contact modal (prototype)
- **Create Profile form** — validates, image preview, saves to localStorage, appears in marketplace, searchable & filterable

### Design
- Premium dark aesthetic (deep black / navy + electric blue / teal accents)
- Glass surfaces, controlled glow, strong typography
- Fully responsive (mobile → desktop)
- Accessible modals (Escape, focus, ARIA)
- prefers-reduced-motion support

## Getting Started

```bash
cd freeverse
npm install
npm run dev
```

Open http://localhost:5173

## Demo Content

All events and freelancers are clearly marked as SAMPLE / DEMO so real data can replace them later.

## Notes for Presentation

- All major interactions work offline after first load of assets
- Create a profile during the demo to show localStorage persistence
- Use filters and search on the marketplace
- Open profile and hire modals
- Test mobile layout with browser DevTools

Built as a frontend-only prototype. No backend required.
