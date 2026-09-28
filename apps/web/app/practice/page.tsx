"use client"

import { useMemo, useState } from "react"
import { RiSearchLine } from "@remixicon/react"
import { DojoSidebar } from "@/components/dojo-sidebar"
import n1Grammar from "../../../../data/json/grammar/n1.json"
import n2Grammar from "../../../../data/json/grammar/n2.json"
import n3Grammar from "../../../../data/json/grammar/n3.json"
import n4Grammar from "../../../../data/json/grammar/n4.json"
import n5Grammar from "../../../../data/json/grammar/n5.json"

type GrammarLevel = "N5" | "N4" | "N3" | "N2" | "N1"
type GrammarRecord = {
  pattern: string
  level: string
  meaning: string
  formation: string
  examples: { ja: string; en: string }[]
  tags: string[]
}

const grammarByLevel: Record<GrammarLevel, GrammarRecord[]> = {
  N5: n5Grammar as GrammarRecord[],
  N4: n4Grammar as GrammarRecord[],
  N3: n3Grammar as GrammarRecord[],
  N2: n2Grammar as GrammarRecord[],
  N1: n1Grammar as GrammarRecord[],
}

export default function PracticePage() {
  const [level, setLevel] = useState<GrammarLevel>("N5")
  const [search, setSearch] = useState("")
  const patterns = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    if (!query) return grammarByLevel[level]
    return grammarByLevel[level].filter((item) =>
      [item.pattern, item.meaning, item.formation, ...item.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
    )
  }, [level, search])

  return (
    <DojoSidebar active="Practice">
      <main className="min-h-screen bg-[#fbf9ff] px-6 py-8 text-[#302942] sm:px-10 lg:px-16 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">Grammar reference</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">Practice</h1>
              <p className="mt-2 text-sm text-[#82788e]">{patterns.length} grammar patterns · {level}</p>
            </div>
            <label className="flex w-full items-center gap-2 border-b border-[#dcd4e5] py-2 sm:max-w-xs">
              <RiSearchLine className="size-4 shrink-0 text-[#82788e]" />
              <span className="sr-only">Search grammar patterns</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search pattern or meaning"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa1b3]"
              />
            </label>
          </div>
          <div className="mt-7 flex gap-2 border-b border-[#e7dfef]">
            {(["N5", "N4", "N3", "N2", "N1"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLevel(item)}
                className={`border-b-2 px-4 py-3 text-xs font-bold ${level === item ? "border-[#c11963] text-[#c11963]" : "border-transparent text-[#82788e] hover:text-[#302942]"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-3">
            {patterns.map((item) => (
              <article key={item.pattern} className="grid gap-3 border-b border-[#e7dfef] py-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-8">
                <div>
                  <h2 className="text-xl font-bold text-[#302942]">{item.pattern}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#c11963]">{item.meaning}</p>
                  <p className="mt-3 text-xs leading-5 text-[#82788e]">{item.formation}</p>
                  <p className="mt-2 text-[10px] text-[#9b91a5]">{item.tags.join(" · ")}</p>
                </div>
                <div className="space-y-3">
                  {item.examples.map((example) => (
                    <div key={`${example.ja}-${example.en}`}>
                      <p className="text-sm font-medium text-[#51475e]">{example.ja}</p>
                      <p className="mt-1 text-xs text-[#82788e]">{example.en}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
            {!patterns.length && <p className="py-12 text-center text-sm text-[#82788e]">No grammar patterns match that search.</p>}
          </div>
        </div>
      </main>
    </DojoSidebar>
  )
}
