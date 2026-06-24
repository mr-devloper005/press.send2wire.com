import Link from 'next/link'
import type { CSSProperties } from 'react'
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Camera,
  Download,
  FileText,
  Filter,
  Image as ImageIcon,
  MapPin,
  Megaphone,
  Newspaper,
  Search,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { CompactIndexCard, EditorialListCard, getEditableCategory, getEditableExcerpt, HorizontalStoryCard, postHref, RailPostCard } from '@/editable/cards/PostCards'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Distribution cards prioritize source, category, headline, and publish-ready summaries.', badge: 'News' },
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Readable editorial cards with room for headlines and excerpts.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, location, condition, and quick action.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing with strong visuals and compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay mostly text-based so saved resources scan quickly.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, short bio, and direct discovery.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        task={task}
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-16">
          <div className="rounded-[2.5rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-7 shadow-[0_24px_80px_rgba(24,32,25,0.08)] backdrop-blur sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--archive-accent)]"><Icon className="h-4 w-4" /> {label}</div>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 opacity-70">{voice?.description || SITE_CONFIG.description}</p>
            <div className="mt-6 rounded-[1.5rem] border border-[color:var(--editable-border)] bg-white/60 p-4 text-sm font-medium leading-7 opacity-75">{deck.promise}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={basePath} className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-semibold text-[var(--archive-bg)]">Browse all</Link>
              <Link href="/search" className="rounded-full border border-[color:var(--editable-border)] px-5 py-3 text-sm font-semibold">Search posts</Link>
            </div>
          </div>

          <form action={basePath} className="self-end rounded-[2rem] border border-[color:var(--editable-border)] bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] opacity-55"><Filter className="h-4 w-4" /> Filter</div>
            <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-2xl border border-[color:var(--editable-border)] bg-white px-4 text-sm font-medium outline-none">
              <option value="all">All categories</option>
              {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="mt-3 h-12 w-full rounded-2xl bg-[var(--archive-text)] text-sm font-semibold text-[var(--archive-bg)]">Apply</button>
            <p className="mt-3 text-xs font-medium opacity-55">Showing: {categoryLabel}</p>
          </form>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-10">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[color:var(--editable-border)] bg-white/60 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm opacity-65">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <Pagination basePath={basePath} category={category} page={page} pagination={pagination} />
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  task,
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const page = pagination.page || 1
  const lead = posts[0]
  const featureStrip = posts.slice(1, 5)
  const grid = posts.slice(5, 11)
  const briefing = posts.slice(11, 16)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">{task === 'mediaDistribution' ? 'Distribution archive' : 'Editorial archive'}</p>
              <h1 className="mt-4 text-5xl font-semibold leading-[0.94] tracking-[-0.08em] sm:text-6xl lg:text-[5rem]">
                {category === 'all' ? voiceHeadline(task, label) : categoryLabel}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                Search-ready publishing, refined cards, and archive-first browsing for every media-facing update.
              </p>
            </div>

            <form action={basePath} className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.8)] p-5 backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-[1fr_220px_auto]">
                <label className="flex items-center rounded-full border border-[color:var(--editable-border)] bg-white pl-4">
                  <Search className="h-4 w-4 text-[var(--slot4-soft-muted-text)]" />
                  <input name="q" placeholder="Search this archive" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
                </label>
                <select name="category" defaultValue={category} className="rounded-full border border-[color:var(--editable-border)] bg-white px-4 text-sm font-medium outline-none">
                  <option value="all">All categories</option>
                  {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-semibold text-[var(--slot4-dark-text)]">Apply</button>
              </div>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-12 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-6">
              {lead ? (
                <Link href={postHref(task, lead, basePath)} className="group block rounded-[2.5rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.84)] p-6 shadow-[0_28px_90px_rgba(24,32,25,0.1)] sm:p-8 lg:p-10">
                  <span className="inline-flex rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                    Featured release
                  </span>
                  <h2 className="mt-6 text-4xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-5xl">{lead.title}</h2>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{getSummary(lead)}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                    Open story <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ) : null}

              <div className="grid gap-5 md:grid-cols-2">
                {featureStrip.slice(0, 2).map((post, index) => (
                  <HorizontalStoryCard
                    key={post.id || post.slug}
                    post={post}
                    href={postHref(task, post, basePath)}
                    badge={index === 0 ? 'Horizontal card' : 'Image-first card'}
                  />
                ))}
              </div>

              {grid.length ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {grid.map((post, index) => (
                    <RailPostCard key={post.id || post.slug} post={post} href={postHref(task, post, basePath)} index={index} />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.84)] p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-soft-muted-text)]">Editorial list</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">The briefing</h3>
                  </div>
                  <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
                    {categoryLabel}
                  </span>
                </div>
                <div className="mt-5">
                  {briefing.length ? briefing.map((post, index) => (
                    <EditorialListCard key={post.id || post.slug} post={post} href={postHref(task, post, basePath)} index={index} />
                  )) : posts.slice(0, 5).map((post, index) => (
                    <EditorialListCard key={post.id || post.slug} post={post} href={postHref(task, post, basePath)} index={index} />
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[linear-gradient(180deg,#b78af5_0%,#ae85ef_100%)] p-6 text-[#111] shadow-[0_22px_70px_rgba(76,33,148,0.18)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/65">Search-first archive</p>
                <h3 className="mt-3 text-3xl font-semibold leading-[0.98] tracking-[-0.05em]">
                  Keep every distribution easy to find later.
                </h3>
                <p className="mt-4 text-sm leading-7 text-black/75">
                  Strong cards, category chips, and pagination help this archive feel like a real product instead of a generic feed.
                </p>
                <div className="mt-5 grid gap-3">
                  {posts.slice(0, 3).map((post, index) => (
                    <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(task, post, basePath)} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!posts.length ? (
            <div className="mt-10 rounded-[2rem] border border-dashed border-[color:var(--editable-border)] bg-white/70 p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-soft-muted-text)]" />
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">No stories found</h2>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Try another category or publish a new update.</p>
            </div>
          ) : null}

          <Pagination basePath={basePath} category={category} page={page} pagination={pagination} />
        </section>
      </main>
    </EditableSiteShell>
  )
}

function Pagination({ basePath, category, page, pagination }: { basePath: string; category: string; page: number; pagination: SiteFeedPagination }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[color:var(--editable-border)] bg-white px-5 py-3 text-sm font-semibold">Previous</Link> : null}
      <span className="rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-semibold text-[var(--slot4-dark-text)]">Page {page} of {pagination.totalPages || 1}</span>
      {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[color:var(--editable-border)] bg-white px-5 py-3 text-sm font-semibold">Next</Link> : null}
    </div>
  )
}

function voiceHeadline(task: TaskKey, fallback: string) {
  return task === 'mediaDistribution' ? 'Media distributions with stronger polish.' : fallback
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getEditableCategory(post)
  return (
    <Link href={href} className="group rounded-[2rem] border border-[color:var(--editable-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <span className="rounded-full bg-[var(--slot4-page-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">{category}</span>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
      <h2 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-3 line-clamp-4 text-sm leading-6 opacity-65">{getEditableExcerpt(post, 200)}</p>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[color:var(--editable-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--slot4-page-text)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-dark-text)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--editable-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 opacity-65">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-medium opacity-70 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[color:var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[var(--slot4-page-text)] p-5 text-[var(--slot4-dark-text)]">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-semibold leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-medium opacity-75">{location || condition || 'Details inside'}</p>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid rounded-[2rem] border border-[color:var(--editable-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
      <h2 className="mt-4 line-clamp-3 text-xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-3 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[color:var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-dark-text)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-semibold uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[color:var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--slot4-page-text)] p-5 text-[var(--slot4-dark-text)]"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--slot4-page-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[color:var(--editable-border)] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--slot4-page-bg)] ring-1 ring-[color:var(--editable-border)]">
        <UserRound className="h-8 w-8 opacity-45" />
      </div>
      <h2 className="mt-5 text-xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 opacity-65">{getSummary(post)}</p>
    </Link>
  )
}
