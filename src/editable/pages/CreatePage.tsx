'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-bold text-[var(--editable-page-text,#2f1d16)] outline-none transition placeholder:text-current/35 focus:border-current'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-transparent px-4 py-16 text-[var(--slot4-page-text)] sm:px-6 lg:px-10">
          <section className="mx-auto grid max-w-6xl gap-8 rounded-[2.8rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.8)] p-7 shadow-[0_30px_90px_rgba(24,32,25,0.08)] backdrop-blur md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div className="flex h-full min-h-72 items-center justify-center rounded-[2.4rem] bg-[linear-gradient(180deg,#dcebdc_0%,#e3def7_100%)] text-[var(--slot4-page-text)]">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.08em] sm:text-7xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 rounded-[1.8rem] border border-[color:var(--editable-border)] bg-white/80 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Publishing access</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--slot4-page-text)]">
                  <li>Sign in to open the publishing workspace.</li>
                  <li>Create posts for any active content section.</li>
                  <li>Stay inside the same premium workflow used across the site.</li>
                </ul>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-semibold text-[var(--slot4-dark-text)]">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--editable-border)] bg-white px-6 py-3 text-sm font-semibold">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="grid gap-8 rounded-[2.8rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-6 shadow-[0_30px_90px_rgba(24,32,25,0.08)] backdrop-blur lg:grid-cols-[0.84fr_1.16fr] lg:p-10">
            <aside>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-soft-muted-text)]">{pagesContent.create.hero.badge}</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.08em] sm:text-7xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
              <div className="mt-8 rounded-[2rem] bg-[linear-gradient(180deg,#dcebdc_0%,#e3def7_100%)] p-5">
                <div className="rounded-[1.5rem] bg-[rgba(251,252,244,0.84)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Workflow</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-page-text)]">
                    Choose a section, add the core post details, and store a polished draft through the existing publishing flow.
                  </p>
                </div>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`rounded-[1.6rem] border p-4 text-left transition ${active ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-[var(--slot4-dark-text)] shadow-[0_18px_48px_rgba(24,32,25,0.18)]' : 'border-[color:var(--editable-border)] bg-white hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(24,32,25,0.08)]'}`}>
                      <Icon className="h-5 w-5" />
                      <span className="mt-3 block text-sm font-semibold">{item.label}</span>
                      <span className="mt-1 block text-xs leading-6 opacity-65">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[2.3rem] border border-[color:var(--editable-border)] bg-white/85 p-5 shadow-[0_18px_50px_rgba(24,32,25,0.08)] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-[-0.06em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              <div className="mt-6 grid gap-4 rounded-[1.8rem] bg-[var(--slot4-page-bg)] p-5 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">Section</p>
                  <p className="mt-2 text-sm font-semibold">{activeTask?.label || 'Post'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">Summary</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Keep it concise so the archive and cards stay clean.</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">Body</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Longer details can still flow safely into the post body.</p>
                </div>
              </div>

              {created ? (
                <div className="mt-5 rounded-[1.6rem] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] px-6 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--slot4-dark-text)] transition hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:bg-[var(--slot4-accent)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
