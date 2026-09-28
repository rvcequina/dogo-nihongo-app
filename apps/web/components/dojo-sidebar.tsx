"use client"

import Link from "next/link"
import { useState } from "react"
import {
  RiBookOpenLine,
  RiHome4Line,
  RiKeyboardBoxLine,
  RiLightbulbLine,
  RiMenuLine,
  RiSettings3Line,
  RiTranslate2,
} from "@remixicon/react"

const sidebarItems = [
  { label: "Overview", href: "/", icon: RiHome4Line },
  { label: "Kana", href: "/kana", icon: RiTranslate2 },
  { label: "Kanji", href: "/kanji", icon: RiBookOpenLine },
  { label: "Vocabulary", href: "/vocabulary", icon: RiKeyboardBoxLine },
  { label: "Practice", href: "/practice", icon: RiLightbulbLine },
]

type DojoSidebarProps = {
  active: string
  children: React.ReactNode
}

export function DojoSidebar({ active, children }: DojoSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#fbf9ff] text-[#302942]">
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[#eee8f5] bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0`}>
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="text-lg font-black tracking-[-0.06em] text-[#c11963]">Mochi Modern</Link>
          <button type="button" className="text-[#9a91a4] lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">×</button>
        </div>
        <p className="mb-5 mt-10 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa1b3]">Your dojo</p>
        <nav className="space-y-1">
          {sidebarItems.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${active === label ? "bg-[#fff0f7] text-[#c11963]" : "text-[#7f758b] hover:bg-[#faf5ff] hover:text-[#c11963]"}`}>
              <Icon className="size-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden rounded-2xl bg-[#f1edff] p-4 lg:block">
          <RiSettings3Line className="size-5 text-[#7433df]" />
          <p className="mt-3 text-xs font-bold">Keep your rhythm</p>
          <p className="mt-1 text-[10px] leading-4 text-[#8c8198]">A few minutes every day makes the lesson stick.</p>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="border-b border-[#eee8f5] bg-white px-5 py-4 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open navigation" className="text-[#71687f]"><RiMenuLine /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
