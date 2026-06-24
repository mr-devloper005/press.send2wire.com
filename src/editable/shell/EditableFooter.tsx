'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-10 border-t border-[color:var(--editable-border)] bg-transparent">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-14">
        <div className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#a98af5_0%,#9d79ec_24%,#9f7bf1_44%,#b68ef8_70%,#b491f2_100%)] px-6 py-12 text-center text-[#111] shadow-[0_28px_80px_rgba(70,45,140,0.22)] sm:px-10 lg:px-16 lg:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/65">Stay visible</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            Keep your media updates easy to discover, revisit, and share.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-black/70 sm:text-base">
            Publish headline moments, supporting resources, and archive content through one refined experience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/search" className="inline-flex items-center justify-center rounded-full bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]">
              Browse latest
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-black/35 px-6 py-3 text-sm font-semibold text-[#111] transition hover:bg-white/20">
              Contact
            </Link>
          </div>
          <div className="mt-10 h-16 bg-[repeating-linear-gradient(90deg,rgba(76,33,148,0.35)_0,rgba(76,33,148,0.35)_2px,transparent_2px,transparent_10px)] opacity-80" />
        </div>

        <div className="grid gap-8 px-1 pt-8 lg:grid-cols-[1.1fr_0.7fr_0.7fr]">
          <div>
            <div className="flex items-center gap-4">
              <img src="/favicon.png" width="128" height="128" alt="logo" className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24 lg:h-32 lg:w-32" />
              <div className="editorial-brand text-4xl font-semibold leading-none tracking-[-0.07em] text-[var(--slot4-page-text)] sm:text-5xl lg:text-6xl">{SITE_CONFIG.name}</div>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]">{globalContent.footer.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">{globalContent.footer.bottomNote}</p>
          </div>

          {globalContent.footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">{column.title}</h3>
              <div className="mt-4 grid gap-3">
                {column.links.map((item) => (
                  <Link key={`${item.label}-${item.href}`} href={item.href} className="text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">
                    {item.label}
                  </Link>
                ))}
                {column.title === 'Company' ? (
                  session ? (
                    <>
                      <Link href="/create" className="text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Publish</Link>
                      <button onClick={logout} className="text-left text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Log in</Link>
                      <Link href="/signup" className="text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Sign up</Link>
                    </>
                  )
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[color:var(--editable-border)] pt-5 text-xs font-semibold text-[var(--slot4-soft-muted-text)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="transition hover:text-[var(--slot4-page-text)]">About</Link>
            <Link href="/contact" className="transition hover:text-[var(--slot4-page-text)]">Contact</Link>
            <Link href="/search" className="transition hover:text-[var(--slot4-page-text)]">Search</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
