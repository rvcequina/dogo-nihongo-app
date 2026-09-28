"use client"

import { useMemo, useState } from "react"
import { RiSearchLine } from "@remixicon/react"
import { DojoSidebar } from "@/components/dojo-sidebar"
import n1Kanji from "../../../../data/json/kanji/n1.json"
import n2Kanji from "../../../../data/json/kanji/n2.json"
import n3Kanji from "../../../../data/json/kanji/n3.json"
import n4Kanji from "../../../../data/json/kanji/n4.json"
import n5Kanji from "../../../../data/json/kanji/n5.json"

type KanjiLevel = "N5" | "N4" | "N3" | "N2" | "N1"
type KanjiRecord = {
  character: string
  level: string
  strokes: number
  onyomi: string[]
  kunyomi: string[]
  meanings: string[]
}

const kanjiByLevel: Record<KanjiLevel, KanjiRecord[]> = {
  N5: n5Kanji as KanjiRecord[],
  N4: n4Kanji as KanjiRecord[],
  N3: n3Kanji as KanjiRecord[],
  N2: n2Kanji as KanjiRecord[],
  N1: n1Kanji as KanjiRecord[],
}

export default function KanjiPage() {
  const [level, setLevel] = useState<KanjiLevel>("N5")
  const [search, setSearch] = useState("")
  const characters = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    if (!query) return kanjiByLevel[level]
    return kanjiByLevel[level].filter((item) =>
      [item.character, ...item.onyomi, ...item.kunyomi, ...item.meanings]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
    )
  }, [level, search])

  return (
    <DojoSidebar active="Kanji">
      <main className="min-h-screen bg-[#fbf9ff] px-6 py-8 text-[#302942] sm:px-10 lg:px-16 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">Character library</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">Kanji</h1>
              <p className="mt-2 text-sm text-[#82788e]">{characters.length} characters · {level}</p>
            </div>
            <label className="flex w-full items-center gap-2 border-b border-[#dcd4e5] py-2 sm:max-w-xs">
              <RiSearchLine className="size-4 shrink-0 text-[#82788e]" />
              <span className="sr-only">Search kanji, readings, and meanings</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search kanji or meaning"
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
          {characters.length ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {characters.slice(0, 100).map((item) => (
                <article key={item.character} className="min-w-0 border border-[#e7dfef] bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-4xl font-semibold text-[#302942]">{item.character}</span>
                    <span className="text-[10px] text-[#82788e]">{item.strokes} strokes</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#c11963]">{item.meanings.join(", ")}</p>
                  <p className="mt-2 text-xs leading-5 text-[#82788e]">
                    <span className="font-bold text-[#51475e]">On</span> {item.onyomi.join(" · ") || "-"}
                  </p>
                  <p className="text-xs leading-5 text-[#82788e]">
                    <span className="font-bold text-[#51475e]">Kun</span> {item.kunyomi.join(" · ") || "-"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-[#82788e]">No kanji match that search.</p>
          )}
          {characters.length > 100 && (
            <p className="mt-5 text-center text-xs text-[#82788e]">Showing the first 100 of {characters.length}. Refine your search to narrow the list.</p>
          )}
        </div>
      </main>
    </DojoSidebar>
  )
}
