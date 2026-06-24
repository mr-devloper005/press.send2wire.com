import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((value): value is string => typeof value === 'string' && Boolean(value))
  const directImage = ['featuredImage', 'image', 'thumbnail', 'coverImage', 'logo', 'avatar']
    .map((key) => content[key])
    .find((value): value is string => typeof value === 'string' && Boolean(value))
  return mediaUrl || directImage || contentImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Latest'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Lead story' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block min-w-0 rounded-[2.25rem] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_24px_70px_rgba(24,32,25,0.12)]">
      <div className="flex min-h-[380px] flex-col justify-between p-6 sm:p-8 lg:p-10">
        <div>
          <span className="inline-flex rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{label}</span>
          <h3 className="mt-6 text-4xl font-semibold leading-[0.95] tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-5xl">{post.title}</h3>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--slot4-muted-text)] sm:text-base">{getEditableExcerpt(post, 220)}</p>
        </div>
        <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-page-text)]">
          Open story <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block rounded-[2rem] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 ${dc.motion.lift}`}>
      <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[.18em] text-[var(--slot4-accent)]">
        <span>{getEditableCategory(post)}</span><span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-3 line-clamp-3 text-xl font-semibold leading-[1.05] tracking-[-.045em] text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 150)}</p>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 grid-cols-[48px_1fr] gap-4 rounded-[1.5rem] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(24,32,25,0.08)]">
      <span className="text-3xl font-semibold leading-none text-[var(--slot4-accent)]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[var(--slot4-soft-muted-text)]"><Clock3 className="h-3 w-3" /> {getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-3 text-lg font-semibold leading-tight tracking-[-.035em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block min-w-0 rounded-[2rem] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 sm:p-6">
      <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{String(index + 1).padStart(2, '0')} / {getEditableCategory(post)}</p>
      <h2 className="mt-3 line-clamp-3 text-3xl font-semibold leading-[1.02] tracking-[-.05em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      <p className={`mt-4 line-clamp-4 text-sm leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 220)}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[var(--slot4-page-text)]">Read story <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}

export function HorizontalStoryCard({ post, href, badge }: { post: SitePost; href: string; badge: string }) {
  return (
    <Link href={href} className="group block rounded-[2rem] border border-[color:var(--editable-border)] bg-white p-6 sm:p-7">
      <div>
        <span className="inline-flex rounded-full border border-[color:var(--editable-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{badge}</span>
        <h3 className="mt-4 text-3xl font-semibold leading-[1] tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-4 line-clamp-5 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 220)}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">
        Continue reading <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

export function EditorialListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex gap-4 border-b border-[color:var(--editable-border)] py-5 last:border-b-0">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}
