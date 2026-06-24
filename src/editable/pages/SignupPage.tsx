import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-transparent text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.98fr_1.02fr] lg:px-10 lg:py-14">
          <div className="flex flex-col justify-center rounded-[2.5rem] border border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.82)] p-7 shadow-[0_24px_70px_rgba(24,32,25,0.08)] backdrop-blur sm:p-12 lg:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Create account</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-5 border-t border-[color:var(--editable-border)] pt-5 text-sm text-[var(--slot4-muted-text)]">Already have an account? <Link href="/login" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
          <div className="flex flex-col justify-center rounded-[2.75rem] bg-[var(--slot4-page-text)] p-8 text-[var(--slot4-dark-text)] shadow-[0_28px_80px_rgba(24,32,25,0.18)] sm:p-12 lg:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.94] tracking-[-0.08em] sm:text-6xl lg:text-7xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/68">{pagesContent.auth.signup.description}</p>
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">What you get</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/75">
                <li>Create access to publishing tools and account storage.</li>
                <li>A smoother path into media distributions, articles, and archive content.</li>
                <li>An entry flow that matches the rest of the site’s premium presentation.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
