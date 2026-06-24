import Link from 'next/link'
import { ArrowRight, Search, Sparkles, Star } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  CompactIndexCard,
  EditorialFeatureCard,
  EditorialListCard,
  getEditableExcerpt,
  HorizontalStoryCard,
  postHref,
  RailPostCard,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function safePosts(posts: SitePost[], count: number) {
  return posts.slice(0, count)
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const quick = posts.slice(1, 4)
  const heroTitle = pagesContent.home.hero.title.join(' ')

  return (
    <section className="relative overflow-hidden">
      <div className={`${dc.shell.section} py-8 sm:py-10 lg:py-12`}>
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-soft-muted-text)]">
              {pagesContent.home.hero.badge}
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.08em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[5.2rem]">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-9 text-[var(--slot4-muted-text)]">
              {pagesContent.home.hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              
              <Link href="/search" className={dc.button.secondary}>
                Search archive
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[3rem] border-[3px] border-[var(--slot4-page-text)] bg-[var(--slot4-surface-bg)] p-4 shadow-[0_28px_80px_rgba(24,32,25,0.14)] sm:p-6">
              <div className="absolute left-[-1rem] top-14 rounded-[1.1rem] bg-[#171717] px-5 py-3 text-sm font-semibold text-white shadow-lg sm:left-[-2rem]">
                Found {posts.length ? posts.length * 7 + 120 : 645} mentions
              </div>
              <div className="absolute left-8 top-[-0.75rem] rounded-[1rem] bg-[#ffd596] px-5 py-3 text-sm font-semibold text-[#2a2317] shadow-lg">
                Distribution successfully delivered
              </div>
              <div className="absolute left-3 top-32 rounded-[1rem] bg-[#bca7ff] px-5 py-3 text-sm font-semibold text-white shadow-lg sm:left-[-0.5rem]">
                Generate with AI
              </div>

              <div className="rounded-[2.6rem] bg-[var(--slot4-media-bg)] p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Lead release</p>
                <h3 className="mt-4 text-3xl font-semibold leading-[1] tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-4xl">
                  {lead?.title || SITE_CONFIG.name}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">
                  {lead ? getEditableExcerpt(lead, 180) : 'Fresh releases and public updates stay easy to scan with a text-first presentation.'}
                </p>
              </div>

              <div className="absolute bottom-5 right-3 rounded-[1.6rem] border-[3px] border-[var(--slot4-page-text)] bg-white p-4 shadow-xl sm:right-5 sm:w-[12rem]">
                <p className="text-sm font-semibold leading-tight text-[var(--slot4-page-text)]">Coverage snapshot</p>
                <div className="mt-4 flex items-end gap-2">
                  <div className="h-24 w-24 rounded-full border-[12px] border-[#6d4bf1] border-b-[#ece8ff] border-l-[#cfc3ff] border-r-[#9c7cff]" />
                  <span className="pb-3 text-4xl font-semibold tracking-[-0.06em] text-[var(--slot4-page-text)]">87%</span>
                </div>
                <div className="mt-3 inline-flex rounded-full bg-[#6d4bf1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  ★ ★ ★
                </div>
              </div>
            </div>

            {quick.length ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {quick.map((post, index) => (
                  <Link
                    key={post.id || post.slug}
                    href={postHref(primaryTask, post, primaryRoute)}
                    className="rounded-[1.6rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.76)] p-4 backdrop-blur"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                      {index === 0 ? 'Latest brief' : index === 1 ? 'Coverage note' : 'New update'}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">
                      {post.title}
                    </h3>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featurePosts = safePosts(posts.slice(0, 8), 8)
  const lead = featurePosts[0]
  const list = featurePosts.slice(1, 5)
  if (!lead) return null

  return (
    <section className="bg-transparent">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">
            AI-enhanced distribution
          </p>
          <h2 className="mt-3 max-w-4xl text-4xl font-semibold leading-[0.97] tracking-[-0.07em] text-[var(--slot4-page-text)] sm:text-5xl lg:text-6xl">
            Coverage workflows that stay clear from headline to archive.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(180deg,#dcebdc_0%,#e4e1f6_100%)] p-6 sm:p-8">
            <div className="mx-auto max-w-[34rem] rounded-[2rem] bg-white p-5 shadow-[0_18px_50px_rgba(24,32,25,0.08)]">
              {list.map((post, index) => (
                <Link
                  key={post.id || post.slug}
                  href={postHref(primaryTask, post, primaryRoute)}
                  className="flex items-center gap-4 rounded-[1.2rem] border border-[color:var(--editable-border)] p-4 transition hover:bg-[var(--slot4-cream)]"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
                    <p className="truncate text-sm text-[var(--slot4-accent)]">{getEditableExcerpt(post, 55)}</p>
                  </div>
                  <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-2 text-sm font-semibold text-[var(--slot4-accent)]">
                    {94 - index * 9}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-page-text)]">
              AI-cited media database
            </p>
            <h3 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-5xl">
              Reach the media that shapes modern responses.
            </h3>
            <ul className="mt-6 space-y-4 text-lg leading-8 text-[var(--slot4-page-text)]">
              <li>Identify top outlets, story angles, and categories with stronger visibility.</li>
              <li>Build sharper distributions with images, summaries, and supporting resources.</li>
              <li>Use archive-friendly search and filters to keep posts easy to revisit.</li>
              <li>Preserve a premium reading experience across desktop and mobile.</li>
            </ul>
            <Link href={lead ? postHref(primaryTask, lead, primaryRoute) : primaryRoute} className={`${dc.button.secondary} mt-8 w-fit`}>
              Explore archive
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const rows = [
    {
      eyebrow: 'Email outreach and analytics',
      title: 'Send stories and updates that invite real engagement.',
      points: [
        'Draft press-ready summaries with clear visual structure.',
        'Guide visitors from featured releases to supporting coverage.',
        'Highlight follow-up content through related cards and archive links.',
      ],
      button: 'Explore media pitch',
      post: posts[2] || posts[0],
      reversed: false,
    },
    {
      eyebrow: 'Media monitoring',
      title: 'Track the visibility of every release after it lands.',
      points: [
        'Keep updates searchable by category, date, and topic.',
        'Present summaries and detail pages with consistent trust cues.',
        'Make related stories and comments easy to browse from each post.',
      ],
      button: 'Explore media monitoring',
      post: posts[3] || posts[1] || posts[0],
      reversed: true,
    },
  ]

  return (
    <section className="bg-transparent">
      <div className={`${dc.shell.section} pb-12 sm:pb-16 lg:pb-20`}>
        <div className="space-y-14 lg:space-y-20">
          {rows.map((row, index) => (
            <div key={row.eyebrow} className={`grid gap-8 lg:grid-cols-2 lg:items-center ${row.reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-page-text)]">{row.eyebrow}</p>
                <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-5xl">
                  {row.title}
                </h2>
                <ul className="mt-6 space-y-3 text-lg leading-8 text-[var(--slot4-page-text)]">
                  {row.points.map((point) => <li key={point}>• {point}</li>)}
                </ul>
                <Link href={row.post ? postHref(primaryTask, row.post, primaryRoute) : primaryRoute} className={`${dc.button.secondary} mt-8 w-fit`}>
                  {row.button}
                </Link>
              </div>

              <div className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(180deg,#dcebdc_0%,#e3def7_100%)] p-6 sm:p-8">
                <div className="mx-auto max-w-[34rem] rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(24,32,25,0.08)]">
                  <div className={`rounded-[1.2rem] border ${index === 0 ? 'border-[#2b8af7] bg-[#e9f4ff]' : 'border-[#d5e5db] bg-[#edf7f1]'} p-5 text-lg font-semibold text-[var(--slot4-page-text)]`}>
                    {index === 0 ? 'You have a new earned mention.' : 'Summary'}
                  </div>
                  <div className="mt-5 rounded-[1.5rem] bg-[var(--slot4-cream)] p-4">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--slot4-page-text)]">{row.post?.title || 'Post overview'}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{row.post ? getEditableExcerpt(row.post, 180) : 'A concise update block keeps details easy to scan.'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = timeSections.flatMap((section) => section.posts)
  const source = feed.length ? feed : posts
  const featured = source[0] || posts[0]
  const gridPosts = source.slice(1, 5)
  const quickReads = source.slice(5, 9)

  return (
    <section className="bg-transparent">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">Suited for every media need</p>
              <h2 className="mt-3 text-4xl font-semibold leading-[0.97] tracking-[-0.07em] text-[var(--slot4-page-text)] sm:text-5xl">
                A homepage structure that balances hero moments, useful context, and quick discovery.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: 'In-house teams', body: 'Shape announcements, supporting coverage, and archive pages through one consistent publishing flow.' },
                { title: 'Agencies', body: 'Present client updates with stronger hierarchy, flexible cards, and a cleaner search path.' },
                { title: 'Small businesses', body: 'Share news, updates, and visual stories without sacrificing readability or polish.' },
              ].map((item, index) => (
                <div key={item.title} className="rounded-[1.8rem] bg-[#dcebdc] p-6">
                  <div className="text-6xl font-semibold leading-none tracking-[-0.06em] text-[var(--slot4-page-text)]">{index + 1}</div>
                  <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{item.title}</h3>
                  <p className="mt-5 text-base leading-8 text-[var(--slot4-page-text)]/80">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
              <div className="grid gap-5 md:grid-cols-2">
                {gridPosts.slice(0, 2).map((post, index) => (
                  <HorizontalStoryCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} badge={index === 0 ? 'Featured card' : 'Horizontal card'} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {featured ? <EditorialFeatureCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} label="Featured release" /> : null}

            <div className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">Quick reads</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--slot4-page-text)]">The briefing</h3>
                </div>
                <Sparkles className="h-5 w-5 text-[var(--slot4-accent)]" />
              </div>
              <div className="mt-5 space-y-3">
                {quickReads.map((post, index) => (
                  <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 sm:p-7">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-soft-muted-text)]">
              <Star className="h-4 w-4 text-[var(--slot4-accent)]" />
              Frequently used sections
            </div>
            <div className="mt-5">
              {(source.length ? source : posts).slice(0, 5).map((post, index) => (
                <EditorialListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>

          <form action="/search" className="rounded-[2rem] bg-[linear-gradient(180deg,#b78af5_0%,#af86f2_55%,#b18bef_100%)] p-6 text-[#111] shadow-[0_28px_80px_rgba(70,45,140,0.2)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/65">Search the full archive</p>
            <h3 className="mt-4 text-4xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-5xl">
              Find every {taskLabel(primaryTask).toLowerCase()} in one place.
            </h3>
            <p className="mt-4 max-w-xl text-base leading-8 text-black/75">
              Explore categories, recent updates, and evergreen content without losing the premium reading experience.
            </p>
            <label className="mt-8 flex rounded-full bg-white px-4 shadow-lg">
              <Search className="mt-4 h-4 w-4 text-[var(--slot4-soft-muted-text)]" />
              <input name="q" placeholder="Search stories" className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm outline-none" />
              <button className="my-2 rounded-full bg-[#171717] px-5 text-sm font-semibold text-white">Search</button>
            </label>
          </form>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-transparent">
      <div className={`${dc.shell.section} pb-8 sm:pb-10`}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: 'Featured card', body: 'Lead stories receive large editorial treatment with generous spacing and stronger imagery.' },
            { title: 'Compact card', body: 'Quick-read modules keep category scanning fast without flattening the visual system.' },
            { title: 'Horizontal card', body: 'Split layouts support richer summaries for coverage notes and supporting updates.' },
            { title: 'Editorial list', body: 'Clean text-led blocks make archive navigation and discovery feel lighter.' },
          ].map((item, index) => (
            <div key={item.title} className={`rounded-[2rem] p-6 ${index % 2 === 0 ? 'bg-[var(--slot4-surface-bg)] border border-[color:var(--editable-border)]' : 'bg-[#dcebdc]'}`}>
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--slot4-page-text)]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
