"use client"

import {
  RiArrowRightLine,
  RiCodeLine,
  RiFireLine,
  RiGroupLine,
  RiLayoutGridLine,
  RiMedalLine,
  RiMenuLine,
  RiPlayCircleLine,
  RiSparkling2Line,
  RiTranslate2,
} from "@remixicon/react"
import Link from "next/link"

import { HeroVisual } from "@/components/hero-visual"
import { Placeholder } from "@/components/placeholder"
import { SlideIn } from "@/components/slide-in"
import { Button } from "@workspace/ui/components/button"

const navItems = ["Lessons", "Kanji", "Vocabulary", "Practice", "Community", "About"]

const disciplines = [
  {
    icon: RiCodeLine,
    eyebrow: "The Editorial Dojo",
    title: "Write with clarity.",
    description: "Shape ideas into writing that feels as intentional as the design behind it.",
    tone: "bg-[#dcefe8]",
    visual: "bg-[#1b5b59]",
  },
  {
    icon: RiSparkling2Line,
    eyebrow: "Visual Harmony",
    title: "Make it memorable.",
    description: "Build a visual language with rhythm, restraint, and a little bit of wonder.",
    tone: "bg-[#f4e8f5]",
    visual: "bg-[#f4f0fb]",
  },
]

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf9ff] text-[#171329]">
      <nav className="mx-auto flex w-full max-w-[80vw] items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="text-base font-bold tracking-[-0.04em] text-[#c11963]">Mochi Modern</a>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#706b7f] sm:flex">
          {navItems.filter((item): item is string => Boolean(item)).map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="transition-colors hover:text-[#c11963]">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden text-sm font-semibold text-[#706b7f] transition-colors hover:text-[#c11963] sm:block">Log in</Link>
          <Link href="/auth/register" className="inline-flex h-8 items-center justify-center rounded-full bg-[#be1c63] px-4 text-sm font-medium text-white shadow-[0_8px_18px_-10px_#be1c63] transition-colors hover:bg-[#a91657]">Join Dojo</Link>
          <Button variant="ghost" size="icon-sm" className="sm:hidden" aria-label="Open menu"><RiMenuLine /></Button>
        </div>
      </nav>

      <section id="top" className="mx-auto grid w-full max-w-[70vw] items-center gap-4 px-6 pb-20 pt-10 sm:pt-16 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:pb-28">
        <SlideIn className="max-w-xl">
          <p className="mb-5 inline-flex rounded-full border border-[#f2a8cb] bg-[#fff2f8] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#c11963]">Welcome to the creative dojo</p>
          <h1 className="max-w-lg text-[clamp(3.25rem,8vw,6.5rem)] font-black leading-[0.86] tracking-[-0.085em] text-[#171329]">Master<br /><span className="text-[#c11963]">with Precision.</span></h1>
          <p className="mt-7 max-w-md text-sm leading-6 text-[#777184] sm:text-base">A high-end virtual space for inspired makers to sharpen their craft, find their voice, and build work that feels unmistakably theirs.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button className="h-11 rounded-full bg-[#c11963] px-6 text-xs shadow-[0_12px_22px_-12px_#c11963] hover:bg-[#a91657]">Start your journey <RiArrowRightLine /></Button>
            <a href="#discipline" className="inline-flex items-center gap-2 text-xs font-semibold text-[#4b4655] transition-colors hover:text-[#c11963]"><RiPlayCircleLine className="size-5 text-[#c11963]" />Explore the dojo</a>
          </div>
        </SlideIn>
        <SlideIn delay={140}><HeroVisual /></SlideIn>
      </section>

      <section id="lessons" className="mx-auto w-full max-w-[70vw] px-6 pb-24 lg:px-10 lg:pb-32">
        <SlideIn className="mb-8 flex items-end justify-between">
          <div><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">01 · Structured learning</p><h2 className="text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl">Interactive Lessons</h2></div>
          <p className="hidden max-w-xs text-right text-[10px] leading-4 text-[#8d8495] sm:block">Build a steady rhythm through short lessons, clear examples, and practice that stays with you.</p>
        </SlideIn>
        <div className="grid gap-4 md:grid-cols-3">
          {["First Steps in Kana", "Daily Dojo", "Grammar Foundations"].map((title, index) => (
            <SlideIn key={title} delay={index * 120} className={`rounded-2xl p-5 ${index === 1 ? "bg-[#2d2944] text-white shadow-[0_20px_30px_-20px_#2d2944]" : "bg-white"}`}>
              <div className="flex items-center justify-between"><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${index === 1 ? "bg-[#573e83] text-[#ffd3e7]" : "bg-[#fff0f7] text-[#c11963]"}`}>{index === 1 ? "CONTINUE" : "NEW LESSON"}</span><RiArrowRightLine className="size-4 opacity-50" /></div>
              <div className={`mt-6 flex size-11 items-center justify-center rounded-xl ${index === 1 ? "bg-[#6337a0] text-[#fbd8ec]" : "bg-[#e8e7ff] text-[#7433df]"}`}><RiTranslate2 className="size-5" /></div>
              <h3 className="mt-5 text-lg font-extrabold tracking-[-0.05em]">{title}</h3>
              <p className={`mt-2 text-xs leading-5 ${index === 1 ? "text-white/55" : "text-[#817789]"}`}>{index === 1 ? "Keep your streak alive with a focused daily session." : "A gentle, guided lesson designed for confident progress."}</p>
              <div className={`mt-6 h-1.5 overflow-hidden rounded-full ${index === 1 ? "bg-white/15" : "bg-[#ece8f2]"}`}><div className={`h-full rounded-full ${index === 1 ? "w-2/3 bg-[#ff5794]" : "w-1/3 bg-[#c11963]"}`} /></div>
            </SlideIn>
          ))}
        </div>
      </section>

      <section id="kanji" className="mx-auto grid w-full max-w-[70vw] items-center gap-8 px-6 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-32">
        <SlideIn className="col-span-full"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">02 · Kanji in context</p><h2 className="text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl">Kanji Philosophy</h2></SlideIn>
        <SlideIn className="rounded-2xl bg-white p-6 shadow-[0_18px_40px_-32px_#493769] sm:p-8">
          <div className="flex items-center justify-between text-[9px] font-bold text-[#84798f]"><span>道 · MICHI</span><span className="text-[#c11963]">Lesson 12 / 20</span></div>
          <div className="mt-7 grid gap-6 sm:grid-cols-[0.7fr_1.3fr] sm:items-center"><div className="flex h-36 items-center justify-center rounded-xl bg-[#eee8ff] text-7xl font-black text-[#7433df]">道</div><div><p className="text-[10px] font-semibold text-[#9b91a2]">道 (みち) · michi</p><h3 className="mt-2 text-2xl font-black tracking-[-0.06em]">道 (Road, The Way)</h3><p className="mt-3 text-xs leading-5 text-[#817789]">A path, a practice, and the quiet courage to keep moving forward.</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-[#fff0f7] px-3 py-1 text-[9px] text-[#c11963]">noun</span><span className="rounded-full bg-[#edf8f5] px-3 py-1 text-[9px] text-[#3b8573]">JLPT N5</span><span className="rounded-full bg-[#f1edff] px-3 py-1 text-[9px] text-[#7433df]">stroke order</span></div></div></div>
        </SlideIn>
        <SlideIn delay={140} className="rounded-2xl bg-[#f1edff] p-6 sm:p-8"><div className="flex items-center justify-between"><p className="text-xs font-bold">Grade-by-Grade Progression</p><RiMedalLine className="size-5 text-[#c11963]" /></div><div className="mt-6 space-y-4">{["Start with the basics", "Build your first 100 kanji", "Read everyday sentences", "Express yourself freely"].map((item, index) => <div key={item} className="flex items-center gap-3"><span className={`flex size-7 items-center justify-center rounded-full text-[10px] font-bold ${index < 2 ? "bg-[#c11963] text-white" : "bg-white text-[#9a90a5]"}`}>{index + 1}</span><span className="flex-1 text-xs font-semibold text-[#4d4559]">{item}</span><span className="text-[9px] text-[#a49aaa]">{index < 2 ? "DONE" : "LOCKED"}</span></div>)}</div><div className="mt-7 h-2 rounded-full bg-white"><div className="h-full w-[58%] rounded-full bg-[#c11963]" /></div></SlideIn>
      </section>

      <section id="vocabulary" className="mx-auto w-full max-w-[70vw] px-6 pb-24 lg:px-10 lg:pb-32">
        <SlideIn className="mb-8"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">03 · Context over memorization</p><h2 className="text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl">Vocabulary in Context</h2></SlideIn>
        <div className="grid gap-4 md:grid-cols-3">{[["木曜日", "Thursday", "もくようび"], ["旅人", "Traveler", "たびびと"], ["新築", "New build", "しんちく"]].map(([word, meaning, reading], index) => <SlideIn key={word} delay={index * 120} className="rounded-2xl bg-white p-5"><div className="flex items-center justify-between"><span className="text-2xl font-black text-[#302942]">{word}</span><span className="rounded-full bg-[#fff0f7] px-2 py-1 text-[8px] text-[#c11963]">N{index + 3}</span></div><p className="mt-5 text-sm font-bold text-[#7433df]">{meaning}</p><p className="mt-1 text-[10px] text-[#93889d]">{reading}</p><div className="mt-5 rounded-xl bg-[#f2effb] p-3 text-[10px] leading-4 text-[#6f657b]">{index === 0 ? "木曜日に映画を見ます。" : index === 1 ? "あの旅人はどこから来ましたか。" : "新築の家に引っ越しました。"}</div><p className="mt-4 text-[9px] text-[#aaa0b1]">Tap to hear pronunciation <span className="float-right text-[#c11963]">↗</span></p></SlideIn>)}</div>
      </section>

      <section id="practice" className="mx-auto grid w-full max-w-[70vw] gap-4 px-6 pb-24 lg:grid-cols-[1.25fr_0.75fr] lg:px-10 lg:pb-32">
        <SlideIn className="rounded-2xl bg-white p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">04 · Stay consistent</p><h2 className="text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl">Active Practice Lab</h2></div><RiFireLine className="size-6 text-[#ff5794]" /></div><p className="mt-4 text-sm leading-6 text-[#817789]">“Every morning, I drink warm green tea in the quiet garden.”</p><div className="mt-6 rounded-xl border border-dashed border-[#d6cce9] bg-[#faf8ff] p-4 text-sm text-[#4c425c]">毎朝、静かな庭で温かい緑茶を飲みます。</div><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-[#eee8ff] px-3 py-1 text-[9px] text-[#7433df]">毎朝</span><span className="rounded-full bg-[#edf8f5] px-3 py-1 text-[9px] text-[#3b8573]">quiet garden</span><span className="rounded-full bg-[#fff0f7] px-3 py-1 text-[9px] text-[#c11963]">verb practice</span></div><Button className="mt-7 rounded-full bg-[#c11963] text-xs hover:bg-[#a91657]">Check my answer <RiArrowRightLine /></Button></SlideIn>
        <SlideIn delay={140} className="rounded-2xl bg-[#f1edff] p-6 sm:p-8"><p className="text-xs font-bold">Practice Modes</p><div className="mt-6 space-y-3">{["Quick review", "Listening loop", "Writing sprint"].map((mode, index) => <div key={mode} className="flex items-center gap-3 rounded-xl bg-white/70 p-3"><span className="flex size-7 items-center justify-center rounded-full bg-[#eee8ff] text-[#7433df]">{index + 1}</span><span className="text-xs font-semibold">{mode}</span><RiArrowRightLine className="ml-auto size-4 text-[#b1a7ba]" /></div>)}</div><div className="mt-6 rounded-xl bg-[#2d2944] p-4 text-white"><p className="text-[9px] text-white/50">STREAK</p><p className="mt-1 text-2xl font-black text-[#ff8eb5]">21 days <span className="text-xs font-medium text-white/50">+3.0x</span></p></div></SlideIn>
      </section>

      <section id="community" className="mx-auto grid w-full max-w-[70vw] gap-4 px-6 pb-24 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-32">
        <SlideIn className="rounded-2xl bg-white p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">05 · Learn together</p><h2 className="text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl">Community & Leaderboards</h2></div><RiGroupLine className="size-6 text-[#7433df]" /></div><p className="mt-4 text-sm leading-6 text-[#817789]">Progress feels better when there&apos;s a whole dojo cheering you on.</p><div className="mt-7 flex items-end justify-center gap-3">{[["Mika", "2"], ["Aya", "1"], ["Ren", "3"]].map(([name, rank], index) => <div key={name} className={`text-center ${index === 1 ? "-translate-y-5" : ""}`}><div className={`mx-auto flex size-12 items-center justify-center rounded-full ${index === 1 ? "bg-[#ffcf62]" : "bg-[#dceeff]"} text-xs font-bold`}>{name?.[0]}</div><p className="mt-2 text-[10px] font-bold">{name}</p><p className="text-[9px] text-[#c11963]">#{rank}</p></div>)}</div></SlideIn>
        <SlideIn delay={140} className="rounded-2xl bg-[#e9f8f4] p-6 sm:p-8"><p className="text-xs font-bold">Study Buddy Lounge</p><div className="mt-5 space-y-3">{["What helps you remember kanji?", "Share your study setup", "Morning practice check-in"].map((message, index) => <div key={message} className="flex items-center gap-3 rounded-xl bg-white/70 p-3"><span className="flex size-7 items-center justify-center rounded-full bg-[#d3eee7] text-[10px] font-bold text-[#3b8573]">{index + 1}</span><span className="flex-1 text-[10px] font-semibold text-[#4d4559]">{message}</span><span className="text-[9px] text-[#c11963]">{12 + index * 7}</span></div>)}</div><Button variant="outline" className="mt-6 rounded-full border-[#b9ded5] text-xs text-[#3b8573]">Visit the lounge <RiArrowRightLine /></Button></SlideIn>
      </section>

      <section id="discipline" className="mx-auto w-full max-w-[70vw] px-6 pb-20 lg:px-10 lg:pb-28">
        <div className="mb-8 flex items-end justify-between">
          <SlideIn><div><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">06 · The method</p><h2 className="text-3xl font-extrabold tracking-[-0.06em] text-[#171329] sm:text-4xl">The Discipline of Design.</h2></div></SlideIn>
          <RiArrowRightLine className="mb-1 hidden size-5 text-[#c11963] sm:block" />
        </div>
        <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
          {disciplines.map(({ icon: Icon, eyebrow, title, description, tone, visual }, index) => (
            <SlideIn key={title} delay={index * 130} className={`overflow-hidden rounded-2xl ${tone} ${index === 1 ? "md:translate-y-8" : ""}`}>
            <article className="p-6">
              <div className="mb-5 flex size-8 items-center justify-center rounded-lg bg-white/70 text-[#c11963]"><Icon className="size-4" /></div>
              <p className="text-xs font-bold text-[#272034]">{eyebrow}</p>
              <h3 className="mt-1 text-xl font-extrabold tracking-[-0.05em] text-[#171329]">{title}</h3>
              <p className="mt-3 max-w-sm text-xs leading-5 text-[#777184]">{description}</p>
              <Placeholder label={`${title} image placeholder`} className={`mt-7 h-28 w-full rounded-xl ${visual}`}><RiCodeLine className="size-10 text-white/20" /></Placeholder>
            </article>
            </SlideIn>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[70vw] gap-4 px-6 pb-20 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:pb-28">
        <SlideIn><div className="rounded-2xl bg-[#dceeff] p-6"><div className="mb-10 flex size-8 items-center justify-center rounded-lg bg-white/60 text-[#1676a7]"><RiLayoutGridLine className="size-4" /></div><p className="text-xs font-bold text-[#273c57]">Structural Fluency</p><p className="mt-2 max-w-xs text-xs leading-5 text-[#6c7b8f]">Learn to see the bones of an idea, then give it a body people want to inhabit.</p></div></SlideIn>
        <SlideIn delay={140}><div className="grid grid-cols-2 gap-5 rounded-2xl bg-[#2d2944] p-6 text-white sm:grid-cols-4 sm:items-center"><div className="col-span-2 sm:col-span-4"><p className="text-xs font-bold">Quantifiable Growth</p><p className="mt-1 text-[10px] text-white/45">Small practices. Remarkable outcomes.</p></div>{[["2,138", "members"], ["8.5k", "hours practiced"], ["98%", "feel clearer"], ["120+", "daily prompts"]].map(([value, label]) => <div key={label}><p className="text-xl font-extrabold tracking-[-0.06em] text-[#f5a1c5]">{value}</p><p className="mt-1 text-[10px] text-white/50">{label}</p></div>)}</div></SlideIn>
      </section>

      <section id="about">
      <SlideIn className="mx-auto flex w-full max-w-4xl items-center gap-5 px-6 pb-20 lg:pb-28">
        <Placeholder label="Member portrait placeholder" className="size-14 shrink-0 rounded-full bg-[#7bb2a7] ring-4 ring-white"><span className="text-lg font-black text-white/80">M</span></Placeholder>
        <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">07 · A note from the dojo</p><p className="mb-2 text-xl font-black leading-none text-[#c11963]">“</p><blockquote className="max-w-2xl text-sm font-semibold leading-6 text-[#373142]">Mochi Modern isn&apos;t just an app; it&apos;s a meditative experience. I went from zero to reading light novels in a year.</blockquote><p className="mt-3 text-[10px] font-semibold text-[#898292]">— Emi Sato, Dojo Member</p></div>
      </SlideIn>
      </section>

      <SlideIn className="mx-6 mb-8 overflow-hidden rounded-2xl bg-[#be1c63] text-center text-white sm:mx-auto sm:max-w-5xl"><section className="px-6 py-14"><p className="mx-auto max-w-lg text-3xl font-black leading-[0.95] tracking-[-0.06em] sm:text-4xl">Ready to enter<br />the Dojo?</p><p className="mx-auto mt-4 max-w-sm text-xs leading-5 text-white/70">Your best work is waiting. All it needs is a place to practice.</p><Button className="mt-6 rounded-full bg-white text-xs font-bold text-[#be1c63] hover:bg-[#fff0f7]">Get started free <RiArrowRightLine /></Button></section></SlideIn>

      <footer className="mx-auto flex w-full max-w-[70vw] flex-wrap items-center justify-between gap-4 border-t border-[#ece6f3] px-6 py-7 text-[10px] text-[#9993a5] lg:px-10"><span className="font-bold text-[#c11963]">Mochi Modern</span><span>© 2024 Mochi Modern. For the curious.</span><div className="flex gap-5"><a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Contact</a></div></footer>
    </main>
  )
}
