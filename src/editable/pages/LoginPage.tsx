import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-14">
          <div className="flex flex-col justify-center rounded-[2.75rem] bg-[linear-gradient(180deg,#dcebdc_0%,#e3def7_100%)] p-8 shadow-[0_28px_80px_rgba(24,32,25,0.12)] sm:p-12 lg:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.94] tracking-[-0.08em] sm:text-6xl lg:text-7xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
            <div className="mt-8 rounded-[1.75rem] bg-[rgba(251,252,244,0.82)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">Member benefits</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--slot4-page-text)]">
                <li>Access publishing and account tools from one place.</li>
                <li>Move from login to archive browsing without friction.</li>
                <li>Keep the same premium experience across entry pages and site content.</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-[2.5rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-7 shadow-[0_24px_70px_rgba(24,32,25,0.08)] backdrop-blur sm:p-12 lg:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Member access</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 border-t border-[color:var(--editable-border)] pt-5 text-sm text-[var(--slot4-muted-text)]">New here? <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
