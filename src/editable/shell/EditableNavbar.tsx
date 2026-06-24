'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const baseLinks = globalContent.nav.primaryLinks

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--editable-border)] bg-[rgba(251,252,244,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[82px] max-w-[var(--editable-container)] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--editable-border)] bg-white/70"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
          <img src="/favicon.png" width="80" height="80" alt="logo" className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
          <div className="editorial-brand truncate text-3xl font-semibold leading-none tracking-[-0.07em] text-[var(--slot4-page-text)] sm:text-4xl lg:text-[2.8rem]">
            {SITE_CONFIG.name}
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {baseLinks.map((item) => (
            <Link key={`${item.label}-${item.href}`} href={item.href} className="text-sm font-semibold text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form action="/search" className="hidden items-center rounded-full border border-[color:var(--editable-border)] bg-white/80 pl-4 lg:flex">
            <Search className="h-4 w-4 text-[var(--slot4-soft-muted-text)]" />
            <input
              name="q"
              type="search"
              placeholder="Search archive"
              className="w-48 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
            />
          </form>

          {session ? (
            <>
               <button type="button" onClick={logout} className="hidden text-sm font-semibold text-[var(--slot4-muted-text)] sm:block">Logout</button>
            </>
          ) : (
            <Link href="/login" className="hidden text-sm font-semibold text-[var(--slot4-muted-text)] sm:block">Log in</Link>
          )}

          <Link
            href={session ? '/create' : '/signup'}
            className="inline-flex items-center justify-center rounded-full border border-[var(--slot4-page-text)] px-4 py-2.5 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-dark-text)] sm:px-5"
          >
            {session ? 'Publish' : 'Signup'}
          </Link>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-4 lg:hidden">
          <div className="grid gap-3">
            {[
              ...baseLinks,
              ...(session
                ? [{ label: 'Create', href: '/create' }]
                : [{ label: 'Log in', href: '/login' }, { label: 'Sign up', href: '/signup' }]),
            ].map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[1.25rem] border border-[color:var(--editable-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--slot4-page-text)]"
              >
                {item.label}
              </Link>
            ))}
            <form action="/search" className="flex items-center rounded-[1.25rem] border border-[color:var(--editable-border)] bg-white px-4">
              <Search className="h-4 w-4 text-[var(--slot4-soft-muted-text)]" />
              <input name="q" type="search" placeholder="Search archive" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
            </form>
          </div>
        </div>
      ) : null}
    </header>
  )
}
