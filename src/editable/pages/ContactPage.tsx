'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Send story ideas, corrections, source material, and publication questions.' },
  { icon: Megaphone, title: 'Media partnerships', body: 'Discuss distribution, syndication, newsroom collaborations, and campaigns.' },
  { icon: Mail, title: 'General support', body: 'Reach the team for account, publishing, or site-related help.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-soft-muted-text)]">{pagesContent.contact.eyebrow}</p>
              <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.08em] sm:text-6xl lg:text-[5rem]">{pagesContent.contact.title}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
            </div>
            <div className="rounded-[2.25rem] bg-[linear-gradient(180deg,#dcebdc_0%,#e3def7_100%)] p-6 shadow-[0_22px_70px_rgba(24,32,25,0.1)] sm:p-8">
              <div className="rounded-[1.75rem] bg-[rgba(251,252,244,0.84)] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-accent)]">Contact options</p>
                <p className="mt-4 text-base leading-8 text-[var(--slot4-page-text)]">
                  Route editorial, publishing, partnership, and support requests through one polished contact flow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-10 lg:pb-16">
          <aside className="rounded-[2.5rem] bg-[var(--slot4-page-text)] text-[var(--slot4-dark-text)] shadow-[0_28px_80px_rgba(24,32,25,0.18)]">
            {desks.map((desk, index) => (
              <div key={desk.title} className="border-b border-white/15 p-7 last:border-b-0 sm:p-9">
                <div className="flex items-center justify-between"><desk.icon className="h-5 w-5 text-[var(--slot4-accent-soft)]" /><span className="text-xs font-semibold text-white/45">0{index + 1}</span></div>
                <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em]">{desk.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/65">{desk.body}</p>
              </div>
            ))}
          </aside>
          <div className="rounded-[2.5rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-6 shadow-[0_24px_70px_rgba(24,32,25,0.08)] backdrop-blur sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Send a message</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
