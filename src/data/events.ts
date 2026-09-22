export interface EventItem {
  id: string;
  title: string;
  category: 'WORKSHOPS' | 'COMPETITIONS' | 'SEMINARS' | 'TECHNICAL' | 'NON-TECHNICAL';
  date: string;
  description: string;
  image: string;
  gallery: string[];
  longDescription: string;
}

export const eventCategories = [
  'ALL',
  'WORKSHOPS',
  'COMPETITIONS',
  'SEMINARS',
  'TECHNICAL',
  'NON-TECHNICAL',
] as const;

export const demoEvents: EventItem[] = [
  {
    id: 'e1',
    title: 'React Mastery Workshop',
    category: 'WORKSHOPS',
    date: 'SAMPLE — Mar 15, 2025',
    description: 'Hands-on workshop covering modern React patterns, hooks and performance optimization.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
    ],
    longDescription: 'SAMPLE EVENT — A full-day practical workshop where students build a complete React application from scratch. Covers component architecture, state management, API integration and deployment.',
  },
  {
    id: 'e2',
    title: 'Hackathon: Build for Campus',
    category: 'COMPETITIONS',
    date: 'SAMPLE — Apr 5-6, 2025',
    description: '48-hour hackathon focused on solving real campus problems with technology.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
    ],
    longDescription: 'SAMPLE EVENT — Teams of students compete to prototype solutions for campus challenges. Mentors from industry provide guidance. Best projects get showcased in the Freeverse marketplace.',
  },
  {
    id: 'e3',
    title: 'Career in Tech Seminar',
    category: 'SEMINARS',
    date: 'SAMPLE — Feb 28, 2025',
    description: 'Industry professionals share insights on freelancing, internships and early career paths.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1591115765373-432bb4b27f3a?w=600&h=400&fit=crop',
    ],
    longDescription: 'SAMPLE EVENT — Interactive seminar covering how students can start freelancing, build portfolios and approach clients while still in college.',
  },
  {
    id: 'e4',
    title: 'AI Fundamentals Lab',
    category: 'TECHNICAL',
    date: 'SAMPLE — Mar 22, 2025',
    description: 'Introductory technical session on machine learning concepts with live coding demos.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
    ],
    longDescription: 'SAMPLE EVENT — Students explore core ML algorithms, train a simple model and discuss real-world student project ideas using AI.',
  },
  {
    id: 'e5',
    title: 'Design Thinking Day',
    category: 'NON-TECHNICAL',
    date: 'SAMPLE — Apr 12, 2025',
    description: 'Creative workshop on problem framing, ideation and storytelling for product ideas.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop',
    ],
    longDescription: 'SAMPLE EVENT — Non-technical creative session focused on empathy mapping, rapid prototyping with paper and presenting ideas clearly.',
  },
  {
    id: 'e6',
    title: 'UI/UX Design Sprint',
    category: 'WORKSHOPS',
    date: 'SAMPLE — May 3, 2025',
    description: 'Intensive design sprint from research to high-fidelity prototype in one day.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop',
    ],
    longDescription: 'SAMPLE EVENT — Participants work in teams to redesign a student-facing product using design thinking methods and Figma.',
  },
];

export const galleryImages = [
  {
    id: 'g1',
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    label: 'SAMPLE — 1. Coding Workshop',
    event: 'React Mastery Workshop',
  },
  {
    id: 'g2',
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
    label: 'SAMPLE — 2. Hackathon / Competition',
    event: 'Build for Campus Hackathon',
  },
  {
    id: 'g3',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    label: 'SAMPLE — 3. Technical Seminar',
    event: 'Career in Tech Seminar',
  },
  {
    id: 'g4',
    src: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&h=600&fit=crop',
    label: 'SAMPLE — 4. Student Project Showcase',
    event: 'Annual Project Exhibition',
  },
  {
    id: 'g5',
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    label: 'SAMPLE — 5. Student Collaboration',
    event: 'Cross-Disciplinary Team Sprint',
  },
  {
    id: 'g6',
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    label: 'SAMPLE — 6. Design / Creative Activity',
    event: 'UI/UX Design Sprint',
  },
  {
    id: 'g7',
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    label: 'SAMPLE — 7. Technology Demonstration',
    event: 'AI & Robotics Live Demo',
  },
  {
    id: 'g8',
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    label: 'SAMPLE — 8. Club Activity',
    event: 'Freeverse Community Meetup',
  },
];
