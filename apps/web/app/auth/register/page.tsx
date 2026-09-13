import {
  RiArrowRightLine,
  RiBookOpenLine,
  RiCheckLine,
  RiLock2Line,
  RiMailLine,
  RiUser3Line,
} from "@remixicon/react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"

function Field({
  icon: Icon,
  label,
  placeholder,
  type = "text",
}: {
  icon: typeof RiUser3Line
  label: string
  placeholder: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold text-[#343047]">{label}</span>
      <span className="flex h-11 items-center gap-3 rounded-full border border-[#eee9f4] bg-white px-4 shadow-[0_4px_12px_-10px_rgba(55,38,88,0.5)] transition-colors focus-within:border-[#c11963]">
        <Icon className="size-4 shrink-0 text-[#b6aebe]" />
        <input type={type} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-xs text-[#2f2840] outline-none placeholder:text-[#c9c1cf]" />
      </span>
    </label>
  )
}

function FeatureCard({
  title,
  description,
  className,
  icon: Icon,
}: {
  title: string
  description: string
  className: string
  icon: typeof RiBookOpenLine
}) {
  return (
    <div className={`absolute flex flex-col justify-end rounded-[28px] p-5 ${className}`}>
      <Icon className="mb-auto size-7 text-[#c11963]" />
      <div>
        <p className="text-sm font-bold tracking-[-0.03em] text-[#242034]">{title}</p>
        <p className="mt-1 text-[10px] leading-4 text-[#71697d]">{description}</p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf9ff] text-[#171329]">
      <nav className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-[5vw] lg:py-7">
        <Link href="/" className="text-2xl font-black tracking-[-0.08em] text-[#bc1c62] sm:text-3xl">Mochi Modern</Link>
        <Link href="/" className="text-xs font-semibold text-[#746b81] transition-colors hover:text-[#c11963]">Back to home</Link>
      </nav>

      <section className="mx-auto grid min-h-[calc(100svh-92px)] w-full max-w-[1500px] items-center gap-14 px-6 pb-12 pt-4 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-[5vw] lg:pb-20">
        <div className="relative min-h-[520px] lg:min-h-[620px]">
          <div className="max-w-2xl pt-6 lg:pt-14">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#742ee1]">The creative dojo</p>
            <h1 className="max-w-2xl text-[clamp(3.5rem,7vw,7.6rem)] font-black leading-[0.85] tracking-[-0.09em] text-[#bc1c62]">Master<br />Japanese.</h1>
            <p className="mt-5 max-w-xl text-xl font-semibold leading-[1.1] tracking-[-0.04em] text-[#742ee1] sm:text-2xl lg:text-3xl">with the precision<br />of a dojo and the elegance of a magazine.</p>
          </div>
          <div className="relative mt-12 h-[260px] w-full max-w-[620px] sm:h-[310px]">
            <FeatureCard icon={RiBookOpenLine} title="Ethereal Learning" description="Soft UI for curious minds." className="left-0 top-0 h-[180px] w-[48%] bg-[#e1e2ff] sm:h-[220px]" />
            <div className="absolute right-0 top-0 h-[236px] w-[47%] overflow-hidden rounded-[28px] bg-[#ff5794] p-5 sm:h-[290px]">
              <RiBookOpenLine className="size-7 text-[#242034]" />
              <p className="mt-4 text-sm font-bold text-[#242034]">Kanji Mastery</p>
              <p className="text-[10px] text-[#743049]">Stroke order made beautiful.</p>
              <span className="absolute -right-2 -top-2 text-6xl font-black text-[#d83775]/40">語</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 flex w-full max-w-[620px] items-center gap-4 rounded-[28px] bg-white px-5 py-5 shadow-[0_18px_35px_-25px_rgba(50,28,70,0.45)] sm:px-7 sm:py-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#d9efff] text-[#1676a7]"><RiCheckLine className="size-5" /></span>
            <div><p className="text-sm font-bold text-[#242034]">98% Retention Rate</p><p className="text-[10px] text-[#817888]">Our editorial methodology is scientifically proven.</p></div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[490px] rounded-[30px] bg-[#f0ecff] p-7 shadow-[0_26px_50px_-38px_rgba(67,42,104,0.55)] sm:p-10 lg:p-12">
          <div className="mb-8"><h2 className="text-2xl font-extrabold tracking-[-0.06em] text-[#242034] sm:text-3xl">Create Account</h2><p className="mt-2 text-xs text-[#71697d]">Start your linguistic journey today.</p></div>
          <form className="space-y-5">
            <Field icon={RiUser3Line} label="Full Name" placeholder="Yuki Tanaka" />
            <Field icon={RiMailLine} label="Email Address" placeholder="yuki@dojo.com" type="email" />
            <Field icon={RiLock2Line} label="Password" placeholder="••••••••••" type="password" />
            <label className="flex items-start gap-2 pt-1 text-[10px] leading-4 text-[#71697d]"><input type="checkbox" className="mt-0.5 accent-[#c11963]" /> <span>I agree to the <a href="#terms" className="text-[#c11963] underline-offset-2 hover:underline">Terms</a> and <a href="#privacy" className="text-[#c11963] underline-offset-2 hover:underline">Privacy Policy</a>.</span></label>
            <Button type="submit" className="h-11 w-full rounded-full bg-gradient-to-r from-[#bc1c62] to-[#ff5794] text-xs font-bold shadow-[0_12px_18px_-12px_#bc1c62] hover:opacity-90">Get Started <RiArrowRightLine /></Button>
          </form>
          <p className="mt-7 text-center text-xs text-[#71697d]">Already have an account? <a href="#login" className="font-bold text-[#c11963] hover:underline">Login</a></p>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ece6f3] px-6 py-6 text-[10px] text-[#a39aaa] sm:px-10 lg:px-[5vw]"><span>© 2024 Mochi Modern. The Ethereal Dojo.</span><div className="flex gap-5"><a href="#method">Methodology</a><a href="#support">Support</a></div></footer>
    </main>
  )
}
