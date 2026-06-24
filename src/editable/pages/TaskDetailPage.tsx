import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' || task === 'mediaDistribution' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = { '--detail-bg': preset.colors.background, '--detail-text': preset.colors.foreground, '--detail-surface': preset.colors.surface, '--detail-accent': preset.colors.accent } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-transparent text-[var(--slot4-page-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' || task === 'mediaDistribution' ? <ArticleDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-page-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const published = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

  return (
    <section className="pb-14">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 pt-8 sm:px-6 lg:px-10 lg:pt-10">
        <BackLink task={task} />
      </div>

      <header className="mx-auto max-w-[var(--editable-container)] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">
              <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1.5 text-[var(--slot4-accent)]">{categoryOf(post, 'News')}</span>
              {published ? <time>{published}</time> : null}
            </div>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.08em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[5rem]">
              {post.title}
            </h1>
            {summaryText(post) ? <p className="mt-6 max-w-3xl text-xl leading-9 text-[var(--slot4-muted-text)]">{summaryText(post)}</p> : null}
          </div>

          <div className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-6 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">Story snapshot</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <MetricCard label="Category" value={categoryOf(post, 'Latest')} />
              <MetricCard label="Related reads" value={String(related.length)} />
              <MetricCard label="Comments" value={String(comments.length)} />
              <MetricCard label="Site" value={SITE_CONFIG.name} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,780px)_340px] lg:px-10 lg:py-14">
        <article className="overflow-hidden rounded-[2.5rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-6 shadow-[0_24px_70px_rgba(24,32,25,0.08)] backdrop-blur sm:p-8">
          <div className="mb-8 rounded-[2rem] bg-[linear-gradient(180deg,#dcebdc_0%,#e3def7_100%)] p-6">
            <div className="rounded-[1.4rem] bg-[rgba(251,252,244,0.78)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-accent)]">Summary</p>
              <p className="mt-3 text-base leading-8 text-[var(--slot4-page-text)]">{summaryText(post) || 'A fuller story body appears below with safe rendering and preserved post content.'}</p>
            </div>
          </div>
          <BodyContent post={post} />
          <EditableComments slug={post.slug} comments={comments} />
        </article>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <RelatedPanel task={task} post={post} related={related} />
        </div>
      </div>
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-[2.8rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-6 shadow-[0_30px_90px_rgba(24,32,25,0.09)] backdrop-blur sm:p-9">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Business listing</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 opacity-70">{summaryText(post)}</p>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-14">
      <aside className="rounded-[2.5rem] border border-[color:var(--editable-border)] bg-[var(--slot4-page-text)] p-7 text-[var(--slot4-dark-text)] shadow-xl lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.28em] opacity-60">Classified notice</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.07em] sm:text-5xl">{post.title}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[var(--slot4-dark-text)] px-5 py-3 text-sm font-semibold text-[var(--slot4-page-text)]">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold">Email</a> : null}
        </div>
      </aside>
      <article className="rounded-[2.7rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-6 shadow-[0_30px_90px_rgba(24,32,25,0.08)] backdrop-blur sm:p-9">
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <BackLink task="image" />
      <div className="mt-8">
        <aside className="rounded-[2.5rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-7 backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-dark-text)]"><Camera className="h-4 w-4" /> Image story</div>
          <h1 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.07em] sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-base leading-8 opacity-70">{summaryText(post)}</p>
          <BodyContent post={post} compact />
        </aside>
      </div>
      <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 lg:py-14">
      <article className="rounded-[2.7rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-7 shadow-[0_30px_90px_rgba(24,32,25,0.08)] backdrop-blur sm:p-10">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--slot4-page-text)] text-[var(--slot4-dark-text)]"><Bookmark className="h-9 w-9" /></div>
        <h1 className="mt-7 text-4xl font-semibold leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 opacity-70">{summaryText(post)}</p>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-semibold text-[var(--slot4-dark-text)]">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 lg:py-14">
      <article className="rounded-[2.7rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-6 shadow-[0_30px_90px_rgba(24,32,25,0.08)] backdrop-blur sm:p-9">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[var(--slot4-page-text)] text-[var(--slot4-dark-text)]"><FileText className="h-12 w-12" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">PDF resource</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-[color:var(--editable-border)] bg-[var(--slot4-page-bg)]">
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--editable-border)] bg-white p-4">
              <span className="text-sm font-semibold">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-xs font-semibold text-[var(--slot4-dark-text)]">Download <Download className="h-4 w-4" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-10 lg:py-14">
      <aside className="rounded-[2.7rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-8 text-center shadow-[0_30px_90px_rgba(24,32,25,0.08)] backdrop-blur lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-10 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--slot4-page-bg)] ring-1 ring-[color:var(--editable-border)]">
          <UserRound className="h-10 w-10 opacity-45" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.07em]">{post.title}</h1>
        {role ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-[2.7rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-7 shadow-sm backdrop-blur sm:p-10">
        <BodyContent post={post} />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-[color:var(--editable-border)] bg-white/80 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold leading-6 text-[var(--slot4-page-text)]">{value}</p>
    </div>
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[color:var(--editable-border)] bg-white/75 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-55"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-medium leading-6 opacity-80">{value}</p>
        </div>
      ))}
    </div>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[color:var(--editable-border)] bg-white/85 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-[color:var(--editable-border)] bg-white/85 p-5 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-55">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-sm font-semibold text-[var(--slot4-dark-text)]">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] px-4 py-2 text-sm font-semibold"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] px-4 py-2 text-sm font-semibold"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><span className="font-semibold uppercase tracking-[0.16em] opacity-60">{label}</span><span className="font-semibold">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact ? (
        <div className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-55">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-medium opacity-75">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-[-0.04em]">More like this</h2>
            <Link href={'/search'} className="text-xs font-semibold uppercase tracking-[0.16em] opacity-55">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group rounded-[1.5rem] border border-[color:var(--editable-border)] bg-white/80 p-4 transition hover:-translate-y-0.5 hover:text-[var(--slot4-accent)]">
      <h3 className="line-clamp-3 text-sm font-semibold leading-tight tracking-[-0.03em]">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-xs leading-5 opacity-60">{summaryText(post)}</p>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-12 rounded-[2rem] border border-[color:var(--editable-border)] bg-white/75 p-5">
      <div className="flex items-center gap-2 text-lg font-semibold"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.4rem] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-4">
            <p className="text-sm font-semibold">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 opacity-70">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm opacity-60">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
