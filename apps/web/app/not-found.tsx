import { RiArrowLeftLine, RiQuestionMark } from "@remixicon/react"
import Link from "next/link"

export default function PagesNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9ff] px-6 text-[#171329]">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#f4e8f5] text-[#c11963]"><RiQuestionMark className="size-9" /></div>
        <p className="mt-7 text-7xl font-black tracking-[-0.1em] text-[#c11963]">404</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.07em]">This page wandered off.</h1>
        <p className="mt-4 text-sm leading-6 text-[#777184]">The dojo couldn&apos;t find the page you were looking for. Let&apos;s get you back to somewhere useful.</p>
        <Link href="/" className="mt-8 inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#c11963] px-5 text-sm font-medium text-white transition-colors hover:bg-[#a91657]"><RiArrowLeftLine /> Back to home</Link>
      </section>
    </main>
  )
}
