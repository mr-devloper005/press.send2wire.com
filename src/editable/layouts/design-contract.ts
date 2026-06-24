import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f1f3e0',
  '--slot4-page-text': '#182019',
  '--slot4-panel-bg': '#e7edd0',
  '--slot4-surface-bg': '#fbfcf4',
  '--slot4-muted-text': '#5e6b57',
  '--slot4-soft-muted-text': '#7f8d79',
  '--slot4-accent': '#778873',
  '--slot4-accent-fill': '#778873',
  '--slot4-accent-soft': '#d2dcb6',
  '--slot4-dark-bg': '#1b231d',
  '--slot4-dark-text': '#f8faef',
  '--slot4-media-bg': '#dbe5c8',
  '--slot4-cream': '#f7f8ec',
  '--slot4-warm': '#fbfcf4',
  '--slot4-lavender': '#a1bc98',
  '--slot4-gray': '#e2e8d6',
  '--slot4-body-gradient': 'radial-gradient(circle at top left, rgba(210,220,182,0.7), transparent 35%), linear-gradient(180deg, #f7f8ec 0%, #f1f3e0 44%, #eef2dc 100%)',
  '--editable-container': '1380px',
  '--editable-border': 'rgba(24, 32, 25, 0.12)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[color:var(--editable-border)]',
  darkBorder: 'border-white/15',
  shadow: 'shadow-[0_18px_48px_rgba(24,32,25,0.08)]',
  shadowStrong: 'shadow-[0_32px_90px_rgba(24,32,25,0.15)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(24,32,25,0.02),rgba(24,32,25,0.75))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-10',
    sectionY: 'py-12 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start',
    rail: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4',
    minRailCard: 'min-w-0',
  },
  type: {
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.24em]',
    heroTitle: 'text-5xl font-semibold leading-[0.95] tracking-[-0.07em] sm:text-6xl lg:text-[5rem]',
    sectionTitle: 'text-3xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-4xl lg:text-5xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-dark-text)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-fill)]',
    secondary: 'inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--editable-border)] bg-transparent px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-page-text)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-surface-bg)]',
    accent: 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--slot4-dark-bg)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[2rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(24,32,25,0.14)]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'All visible layout decisions belong inside src/editable; keep data, SEO, API, and route logic untouched.',
  'Use the muted sage palette, soft premium surfaces, rounded feature frames, and editorial SaaS section rhythm.',
  'Keep dynamic post fetching intact and never replace backend posts with mock arrays.',
  'Use postHref() for all post links so route aliases and task-specific detail pages remain functional.',
  'Prioritize readable desktop and mobile layouts with polished split sections and varied card styles.',
  'Branding must remain dynamic from SITE_CONFIG; never hardcode a reference publication name or logo.',
] as const
