import {
  RiArrowRightLine,
  RiBookOpenLine,
  RiFacebookFill,
  RiGoogleFill,
  RiLock2Line,
  RiMailLine,
  RiTranslate2,
} from "@remixicon/react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"

function LoginField({
  icon: Icon,
  label,
  placeholder,
  type = "text",
}: {
  icon: typeof RiMailLine
  label: string
  placeholder: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold text-[#39324a]">{label}</span>
      <span className="flex h-11 items-center gap-3 rounded-full border border-[#eeeaf6] bg-white px-4 shadow-[0_5px_14px_-12px_rgba(69,48,100,0.6)] transition-colors focus-within:border-[#c11963]">
        <Icon className="size-4 shrink-0 text-[#bcb3c8]" />
        <input type={type} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-xs text-[#302942] outline-none placeholder:text-[#c9c2d1]" />
      </span>
    </label>
  )
}

function LanguageBubble({ className, children }: { className: string; children: React.ReactNode }) {
  return <div className={`absolute flex size-12 items-center justify-center rounded-full bg-[#eee8ff]/80 text-[#9c8ed6] shadow-[0_8px_18px_-16px_#8f79db] ${className}`}>{children}</div>
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#fbf9ff] text-[#171329]">
      <LanguageBubble className="left-5 top-6 text-xs sm:left-[6vw] sm:top-8">あa</LanguageBubble>
      <LanguageBubble className="left-12 top-24 sm:left-[9vw] sm:top-28"><RiTranslate2 className="size-5" /></LanguageBubble>
      <LanguageBubble className="bottom-16 right-6 bg-[#e8edff]/80 text-[#70acd0] sm:right-[7vw] sm:bottom-20"><RiArrowRightLine className="size-5 rotate-90" /></LanguageBubble>
      <LanguageBubble className="bottom-7 right-6 size-8 bg-[#f8e9f7]/80 text-[#dca2ca] sm:right-[3vw]"><RiBookOpenLine className="size-3" /></LanguageBubble>

      <header className="flex justify-center px-6 pb-4 pt-10 sm:pt-12">
        <Link href="/" className="flex flex-col items-center gap-2 text-center">
          <RiBookOpenLine className="size-6 text-[#c11963]" />
          <span className="text-2xl font-black tracking-[-0.07em] text-[#c11963] sm:text-3xl">Mochi Modern</span>
          <span className="text-[9px] font-medium text-[#756b83]">Enter the Ethereal Dojo</span>
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center px-6 pb-8 pt-6 sm:pt-8">
        <div className="w-full max-w-[390px] rounded-[28px] bg-[#f0edfb]/90 p-6 shadow-[0_24px_55px_-42px_rgba(70,48,108,0.6)] sm:p-8">
          <form className="space-y-5">
            <LoginField icon={RiMailLine} label="Email Address" placeholder="name@example.com" type="email" />
            <div>
              <div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-semibold text-[#39324a]">Password</span><a href="#forgot-password" className="text-[9px] font-semibold text-[#c11963] hover:underline">Forgot password?</a></div>
              <span className="flex h-11 items-center gap-3 rounded-full border border-[#eeeaf6] bg-white px-4 shadow-[0_5px_14px_-12px_rgba(69,48,100,0.6)] transition-colors focus-within:border-[#c11963]"><RiLock2Line className="size-4 shrink-0 text-[#bcb3c8]" /><input type="password" placeholder="••••••••" className="min-w-0 flex-1 bg-transparent text-xs text-[#302942] outline-none placeholder:text-[#c9c2d1]" /></span>
            </div>
            <Button type="submit" className="h-11 w-full rounded-full bg-gradient-to-r from-[#be1c63] to-[#ff5794] text-[10px] font-bold uppercase tracking-[0.12em] shadow-[0_12px_18px_-11px_#be1c63] hover:opacity-90">Continue to dojo <RiArrowRightLine /></Button>
          </form>

          <div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-[#ded8eb]" /><span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#aaa0b6]">or connect with</span><span className="h-px flex-1 bg-[#ded8eb]" /></div>
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" className="h-10 rounded-full border-white bg-white text-[10px] font-semibold text-[#4f465d] hover:bg-white/70"><RiGoogleFill className="size-4 text-[#4285f4]" />Google</Button>
            <Button type="button" variant="outline" className="h-10 rounded-full border-white bg-white text-[10px] font-semibold text-[#4f465d] hover:bg-white/70"><RiFacebookFill className="size-4 text-[#1d4ed8]" />Facebook</Button>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-[#8b8194]">Don&apos;t have an account? <Link href="/pages/auth/register" className="font-bold text-[#c11963] hover:underline">Sign up for free</Link></p>
      </section>

      <footer className="flex justify-center gap-6 px-6 pb-8 text-[9px] font-medium uppercase tracking-[0.14em] text-[#aaa0b4]"><a href="#privacy" className="hover:text-[#c11963]">Privacy</a><a href="#terms" className="hover:text-[#c11963]">Terms</a></footer>
    </main>
  )
}
