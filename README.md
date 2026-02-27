# HabitTracker — Productivity Dashboard

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, providers, SEO)
│   ├── page.tsx                  # Main dashboard page
│   └── globals.css               # Design system + component styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # App header (logo, search, settings)
│   │   └── SettingsModal.tsx     # Settings panel (tabs, calendar, AI, lang)
│   └── widgets/
│       ├── TimeQuote.tsx         # Clock + motivational quote
│       ├── HabitTracker.tsx      # Habit checkboxes with frequency tabs
│       ├── TaskList.tsx          # Priority-sorted task list
│       ├── TaskModal.tsx         # Task create/edit modal
│       ├── AIRecommendations.tsx # AI tips (Gemini-ready)
│       ├── ProgressCharts.tsx    # Bar, Pie, Line charts (Recharts)
│       └── ContributionCalendar.tsx # GitHub-style activity grid
├── hooks/
│   ├── useSettings.ts           # Settings context + localStorage
│   ├── useHabits.ts             # Habit CRUD + streak calculation
│   └── useTasks.ts              # Task CRUD + sorting + filtering
└── lib/
    ├── types.ts                 # All TypeScript interfaces
    ├── constants.ts             # Defaults, quotes, AI tips, icons
    ├── storage.ts               # localStorage abstraction (swap for API later)
    └── i18n/
        ├── uk.ts                # Ukrainian translations
        ├── en.ts                # English translations
        └── useTranslation.ts    # Translation hook
```

## 🎨 Design

- **Color scheme**: Light background (#F5F5F7) + coral accent (#E85D4A)
- **Typography**: Inter (Google Fonts)
- **Layout**: Responsive grid — 1 col (mobile) → 2 col (tablet) → 3 col (desktop)

## ⚙️ Tech Stack

- **Framework**: Next.js 15 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + vanilla CSS design system
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: localStorage (backend-ready abstraction)
- **i18n**: Custom hook (UK/EN)

## 📦 Build & Deploy

```bash
# Static export for GitHub Pages
npm run build
# Output: /out directory
```

## 🔮 Roadmap

- [ ] Backend API (Node.js/Express or Supabase)
- [ ] User authentication
- [ ] Gemini AI integration for personalized recommendations
- [ ] Notifications/reminders (Service Worker)
- [ ] Subtasks support
- [ ] Drag-and-drop widget layout
- [ ] Dark mode
