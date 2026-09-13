import { RiArrowLeftLine, RiCompass3Line } from "@remixicon/react"
import Link from "next/link"

export default function PagesIndex() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9ff] px-6 text-[#171329]">
      <section className="w-full max-w-lg text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#eee8ff] text-[#7433df]"><RiCompass3Line className="size-7" /></div>
        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c11963]">Mochi Modern</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] sm:text-5xl">Choose your next step.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#777184]">This is the pages hub. Continue to your account or return to the dojo home.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/pages/auth/register" className="inline-flex h-8 items-center justify-center rounded-full bg-[#c11963] px-5 text-sm font-medium text-white transition-colors hover:bg-[#a91657]">Create account</Link>
          <Link href="/pages/auth/login" className="inline-flex h-8 items-center justify-center rounded-full border border-[#e5dfec] bg-transparent px-5 text-sm font-medium text-[#302942] transition-colors hover:bg-white">Log in</Link>
        </div>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-[#746b81] hover:text-[#c11963]"><RiArrowLeftLine className="size-4" /> Back to home</Link>
      </section>
    </main>
  )
}
