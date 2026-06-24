import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-soft-muted-text)]">{pagesContent.about.badge}</p>
              <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.08em] sm:text-6xl lg:text-[5rem]">
                {pagesContent.about.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
            </div>
            <div className="rounded-[2.25rem] bg-[linear-gradient(180deg,#dcebdc_0%,#e3def7_100%)] p-6 shadow-[0_22px_70px_rgba(24,32,25,0.1)] sm:p-8">
              <div className="rounded-[1.75rem] bg-[rgba(251,252,244,0.84)] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-accent)]">Why this edition</p>
                <p className="mt-4 text-base leading-8 text-[var(--slot4-page-text)]">
                  A cleaner editorial system helps announcements, supporting context, and public-facing updates feel more credible and easier to explore.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pb-16">
          <article className="rounded-[2.5rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-7 shadow-[0_24px_70px_rgba(24,32,25,0.08)] backdrop-blur sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">About {SITE_CONFIG.name}</p>
            <div className="article-content mt-8 space-y-6">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="grid gap-4">
            {pagesContent.about.values.map((value, index) => (
              <div key={value.title} className="rounded-[2rem] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_18px_50px_rgba(24,32,25,0.06)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">0{index + 1}</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.05em]">{value.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
              </div>
            ))}
          </aside>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-8 sm:px-6 lg:px-10">
          <div className="rounded-[2.5rem] bg-[linear-gradient(180deg,#b78af5_0%,#af86f2_55%,#b18bef_100%)] px-6 py-10 text-[#111] shadow-[0_28px_80px_rgba(70,45,140,0.2)] sm:px-10 lg:flex lg:items-center lg:justify-between">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-5xl">Read the stories shaping the conversation.</h2>
            <Link href="/search" className="mt-6 inline-flex w-fit rounded-full bg-[#171717] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white lg:mt-0">Explore the archive</Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
