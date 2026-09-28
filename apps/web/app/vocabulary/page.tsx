"use client";

import { useMemo, useState } from "react";
import {
  RiArrowRightLine,
  RiBookOpenLine,
  RiCheckLine,
  RiCloseLine,
  RiFireLine,
  RiLightbulbLine,
  RiMenuLine,
  RiSettings3Line,
} from "@remixicon/react";
import { DojoSidebar } from "@/components/dojo-sidebar";
import { convertRomajiToKana } from "@/lib/romaji-to-kana";
import n1Vocabulary from "../../../../data/json/vocab/n1.json";
import n2Vocabulary from "../../../../data/json/vocab/n2.json";
import n3Vocabulary from "../../../../data/json/vocab/n3.json";
import n4Vocabulary from "../../../../data/json/vocab/n4.json";
import n5Vocabulary from "../../../../data/json/vocab/n5.json";

type VocabularyItem = {
  question: string;
  kanji_question: string;
  answer: string;
  examples?: { ja: string; en: string }[];
  level?: string;
  lesson?: string;
};
type VocabularyLevel = "N5" | "N4" | "N3" | "N2" | "N1";
type VocabularyRecord = {
  word: string;
  reading: string;
  meanings: string[];
  level: string;
  examples?: { ja: string; en: string }[];
};
const fallbackItem: VocabularyItem = {
  question: "Japanese word",
  kanji_question: "",
  answer: "にほんご",
};

function normalizeAnswer(value: string) {
  return value.replace(/[~～\s]/g, "").trim();
}

function escapePattern(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function answerMatches(value: string, expected: string) {
  const normalizedValue = normalizeAnswer(value);
  return expected.split(/[/／、]/).some((alternative) => {
    const normalizedExpected = alternative.replace(/[~～\s]/g, "");
    let pattern = "";
    let cursor = 0;

    for (const match of normalizedExpected.matchAll(/「([^」]*)」/g)) {
      const start = match.index ?? 0;
      const optionalText = match[1] ?? "";
      pattern += escapePattern(normalizedExpected.slice(cursor, start));
      pattern += `(?:${escapePattern(optionalText)})?`;
      cursor = start + match[0].length;
    }

    pattern += escapePattern(normalizedExpected.slice(cursor).replace(/[「」]/g, ""));
    return new RegExp(`^${pattern}$`).test(normalizedValue);
  });
}

type VocabularyLesson = {
  key: string;
  label: string;
  items: VocabularyItem[];
};

function groupVocabulary(
  source: VocabularyRecord[],
  level: VocabularyLevel,
  setSize = 30,
) {
  const items = source.map((item, index) => ({
    question: item.meanings.join("; "),
    kanji_question: item.word,
    answer: item.reading || item.word,
    examples: item.examples,
    level,
    lesson: `Set ${Math.floor(index / setSize) + 1}`,
  }));
  return Array.from({ length: Math.ceil(items.length / setSize) }, (_, index) => ({
    key: `${level}-${index + 1}`,
    label: `Set ${index + 1}`,
    items: items.slice(index * setSize, (index + 1) * setSize),
  } satisfies VocabularyLesson));
}

const vocabularySets: Record<VocabularyLevel, VocabularyLesson[]> = {
  N5: groupVocabulary(n5Vocabulary as VocabularyRecord[], "N5"),
  N4: groupVocabulary(n4Vocabulary as VocabularyRecord[], "N4"),
  N3: groupVocabulary(n3Vocabulary as VocabularyRecord[], "N3"),
  N2: groupVocabulary(n2Vocabulary as VocabularyRecord[], "N2"),
  N1: groupVocabulary(n1Vocabulary as VocabularyRecord[], "N1"),
};

export default function VocabularyPage() {
  const [level, setLevel] = useState<VocabularyLevel>("N5");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<"correct" | "retry" | "incorrect" | null>(null);
  const [, setSidebarOpen] = useState(false);
  const [streak, setStreak] = useState(7);
  const [score, setScore] = useState(0);
  const [questionAttempts, setQuestionAttempts] = useState(0);
  const [masteredWords, setMasteredWords] = useState<Set<string>>(new Set());
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const lessons = vocabularySets[level];
  const currentLesson = lessons[lessonIndex] ?? lessons[0];
  const items = currentLesson?.items ?? [fallbackItem];
  const item = items[itemIndex % items.length] ?? fallbackItem;
  const mnemonicExample = item.examples?.[0];
  const typedJapanese = useMemo(() => convertRomajiToKana(answer), [answer]);
  const progress = Math.round(((itemIndex + 1) / items.length) * 100);

  function changeLevel(nextLevel: VocabularyLevel) {
    setLevel(nextLevel);
    setLessonIndex(0);
    setItemIndex(0);
    setAnswer("");
    setChecked(null);
    setQuestionAttempts(0);
    setMasteredWords(new Set());
    setHasStartedQuiz(false);
    setReviewOpen(false);
  }

  function changeLesson(nextLesson: number) {
    setLessonIndex(nextLesson);
    setItemIndex(0);
    setAnswer("");
    setChecked(null);
    setQuestionAttempts(0);
    setMasteredWords(new Set());
    setHasStartedQuiz(false);
    setReviewOpen(false);
  }

  function wordKey(value: VocabularyItem) {
    return `${value.level}:${value.lesson}:${value.question}:${value.answer}`;
  }

  function checkAnswer() {
    if (!answer.trim() || checked || !item) return;
    const isCorrect =
      answerMatches(typedJapanese, item.answer) ||
      answerMatches(answer.toLowerCase(), item.answer.toLowerCase());
    const nextAttempts = questionAttempts + 1;
    setQuestionAttempts(nextAttempts);
    setChecked(isCorrect ? "correct" : nextAttempts >= 3 ? "incorrect" : "retry");
    if (isCorrect) {
      setScore((value) => value + 1);
      setStreak((value) => value + 1);
      setMasteredWords((value) => new Set(value).add(wordKey(item)));
    }
  }

  function retryItem() {
    setAnswer("");
    setChecked(null);
  }

  function handleQuizKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (checked === "correct") nextItem();
    else if (checked === "retry") retryItem();
    else if (!checked) checkAnswer();
  }

  function nextItem() {
    const nextIndex = items.findIndex(
      (entry, index) => index !== itemIndex && !masteredWords.has(wordKey(entry)),
    );
    setItemIndex(nextIndex >= 0 ? nextIndex : (itemIndex + 1) % items.length);
    setAnswer("");
    setChecked(null);
    setQuestionAttempts(0);
  }

  return (
    <DojoSidebar active="Vocabulary">
      <main className="min-h-screen bg-[#fbf9ff] text-[#242034]">
        <header className="flex items-center justify-between border-b border-[#eee8f5] bg-white px-6 py-4 lg:px-10">
          <div className="flex flex-end items-center gap-4 text-[#82788e]">
            <RiFireLine className="size-4 text-[#c11963]" />
            <span className="hidden text-xs font-bold sm:block">
              {streak} day streak
            </span>
            <span className="rounded-full bg-[#fff0f7] px-3 py-1.5 text-xs font-bold text-[#c11963]">
              {score} correct
            </span>
            <RiSettings3Line className="size-4" />
          </div>
        </header>
        <div className="flex min-h-[calc(100vh-65px)]">
          <section className="min-w-0 flex-1 px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
            <div className="mx-auto max-w-5xl">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="mb-6 text-[#82788e] lg:hidden"
                aria-label="Open navigation"
              >
                <RiMenuLine />
              </button>
              <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">
                    Japanese vocabulary
                  </p>
                  <h1 className="mt-3 text-4xl font-black tracking-[-0.08em] sm:text-6xl">
                    Vocabulary <span className="text-[#c11963]">Library</span>
                  </h1>
                  <p className="mt-3 max-w-md text-sm leading-6 text-[#8c8198]">
                    Learn useful words through recall, context, and gentle
                    spaced review.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm">
                  {(["N5", "N4", "N3", "N2", "N1"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => changeLevel(item)}
                      aria-pressed={level === item}
                      className={`rounded-full px-4 py-2 text-[10px] font-bold ${level === item ? "bg-[#9333d8] text-white" : "text-[#8c8198]"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6 flex gap-3 overflow-x-auto rounded-2xl border border-[#eee8f5] bg-white/70 p-2 pb-3 shadow-[0_8px_20px_-20px_#4b3568] [scrollbar-color:#d9a1c4_#f1edff] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d9a1c4] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f1edff]">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.key}
                    type="button"
                    onClick={() => changeLesson(index)}
                    className={`shrink-0 rounded-xl px-4 py-2 text-[10px] font-bold transition-colors ${index === lessonIndex ? "bg-[#c11963] text-white shadow-[0_6px_14px_-8px_#c11963]" : "bg-[#faf8ff] text-[#8c8198] hover:bg-[#fff0f7] hover:text-[#c11963]"}`}
                  >
                    {lesson.label}
                  </button>
                ))}
              </div>
              <div className="mb-8 flex items-center gap-4">
                <span className="text-[10px] font-bold text-[#8c8198]">
                  {currentLesson?.label} · {level}
                </span>
                <div className="h-2 flex-1 rounded-full bg-[#eee8f5]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#c11963] to-[#ff5794] transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#c11963]">
                  {Math.min(progress, 100)}%
                </span>
              </div>
              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-3xl bg-white p-7 shadow-[0_22px_45px_-35px_#4b3568] sm:p-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">
                      Vocabulary review
                    </span>
                    <span className="rounded-full bg-[#f1edff] px-3 py-1 text-[10px] font-bold text-[#7433df]">
                      {itemIndex + 1} / {items.length}
                    </span>
                  </div>
                  <div className="mt-12 text-center">
                    <p className="text-sm font-semibold text-[#8c8198]">
                      What is the Japanese word for
                    </p>
                    <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#302942] sm:text-4xl">
                      {item.question}
                    </h2>
                    {item.kanji_question && (
                      <p className="mt-3 text-lg text-[#a39aaa]">
                        {item.kanji_question}
                      </p>
                    )}
                  </div>
                  <div className="mt-12 rounded-2xl bg-[#faf8ff] p-5">
                    <label
                      htmlFor="vocabulary-answer"
                      className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa1b3]"
                    >
                      Type in romaji
                    </label>
                    <input
                      id="vocabulary-answer"
                      value={answer}
                      onChange={(event) => {
                        setAnswer(event.target.value);
                        setHasStartedQuiz(true);
                        setChecked(null);
                      }}
                      onKeyDown={handleQuizKeyDown}
                      readOnly={checked === "correct" || checked === "incorrect"}
                      autoComplete="off"
                      autoFocus
                      placeholder="e.g. watashi"
                      className="mt-3 w-full bg-transparent text-2xl font-bold text-[#302942] outline-none placeholder:text-[#c9c1cf]"
                    />
                    {answer && (
                      <p className="mt-3 border-t border-[#eee8f5] pt-3 text-xl text-[#c11963]">
                        {typedJapanese}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={checkAnswer}
                      disabled={!answer.trim() || Boolean(checked)}
                      className="flex-1 rounded-full bg-[#c11963] py-3 text-xs font-bold text-white transition-colors hover:bg-[#a91657] disabled:opacity-50"
                    >
                      Check answer{" "}
                      <RiCheckLine className="ml-2 inline size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={checked === "retry" ? retryItem : nextItem}
                      className="rounded-full border border-[#e7dfef] px-5 py-3 text-xs font-bold text-[#786d86] hover:border-[#c11963] hover:text-[#c11963]"
                    >
                      {checked === "retry" ? "Try again" : "Next"} <RiArrowRightLine className="ml-1 inline size-4" />
                    </button>
                  </div>
                  {checked && (
                    <div
                      className={`mt-5 rounded-2xl p-4 text-sm font-semibold ${checked === "correct" ? "bg-[#edf8f5] text-[#3b8573]" : "bg-[#fff0f7] text-[#c11963]"}`}
                    >
                      {checked === "correct"
                        ? "Correct. Press Enter for the next word."
                        : checked === "retry"
                          ? "Not quite. Try again."
                          : `The answer is ${item.answer}.`}
                    </div>
                  )}
                </section>
                <aside className="space-y-5">
                  <div className="rounded-3xl bg-[#f1edff] p-7 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-white text-[#7433df]">
                        <RiLightbulbLine className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#3c3156]">
                          Memory scene
                        </p>
                        <p className="text-[10px] text-[#8c8198]">
                          Connect the word to its meaning
                        </p>
                      </div>
                    </div>
                    <div className={`mt-7 transition-[filter] duration-300 ${checked === "correct" ? "" : "blur-sm"}`}>
                      {mnemonicExample ? (
                        <div className="rounded-2xl bg-white/75 p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8c8198]">Imagine this moment</p>
                          <p lang="ja" className="mt-2 text-base font-bold leading-7 text-[#302942]">{mnemonicExample.ja}</p>
                          <p className="mt-1 text-xs leading-5 text-[#766b84]">{mnemonicExample.en}</p>
                        </div>
                      ) : (
                        <p className="rounded-2xl bg-white/75 p-4 text-sm leading-6 text-[#5c506b]">
                          Picture <span className="font-bold text-[#7433d8]">{item.kanji_question || item.answer}</span> in a moment that means <span className="font-bold">{item.question}</span>.
                        </p>
                      )}
                      <div className="mt-4 flex min-h-28 flex-col items-center justify-center rounded-2xl bg-white/70 p-4 text-center">
                        <span lang="ja" className="text-4xl font-black text-[#c11963]">{item.kanji_question || item.answer}</span>
                        <span className="mt-1 text-xs font-semibold text-[#766b84]">{item.answer} · {item.question}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-[#f1edff] p-7 sm:p-8">
                    <div className="flex items-center gap-2">
                      <RiBookOpenLine className="size-4 text-[#c11963]" />
                      <p className="text-xs font-bold text-[#3c3156]">
                        Study guide
                      </p>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      {["See it", "Say it", "Use it"].map((step, index) => (
                        <div
                          key={step}
                          className="rounded-xl bg-white/75 p-3 text-center"
                        >
                          <span className="text-lg font-black text-[#c11963]">
                            {index + 1}
                          </span>
                          <p className="mt-1 text-[9px] font-bold text-[#8c8198]">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 text-[10px] leading-4 text-[#8c8198]">
                      Review a little today, then return later. Short spaced
                      sessions help words stick.
                    </p>
                  </div>
                </aside>
              </div>
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa1b3]">Vocabulary in this lesson</p>
                  <button type="button" onClick={() => setReviewOpen(true)} className="shrink-0 rounded-full border border-[#e7dfef] bg-white px-3 py-1.5 text-[10px] font-bold text-[#786d86] transition-colors hover:border-[#c11963] hover:text-[#c11963]">Review lesson</button>
                </div>
                <div className={`grid gap-2 transition-[filter] duration-300 sm:grid-cols-2 ${hasStartedQuiz && masteredWords.size < items.length ? "blur-sm" : ""}`}>
                  {items.slice(itemIndex, itemIndex + 4).map((entry) => (
                    <div
                      key={`${entry.question}-${entry.answer}`}
                      className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-[0_8px_20px_-20px_#4b3568]"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#302942]">
                          {entry.kanji_question || entry.answer}
                        </p>
                        <p className="text-[10px] text-[#8c8198]">
                          {entry.question}
                        </p>
                      </div>
                      <span className="text-xs text-[#c11963]">
                        {entry.answer}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
        <footer className="border-t border-[#eee8f5] px-8 py-6 text-[9px] font-medium uppercase tracking-[0.14em] text-[#aaa0b4]">
          <div className="mx-auto flex max-w-5xl justify-between">
            <span>© 2024 Mochi Modern Japanese</span>
            <span className="hidden gap-5 sm:flex">
              <span>About</span>
              <span>Privacy</span>
              <span>Contact</span>
            </span>
          </div>
        </footer>
        {reviewOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#302942]/25 px-5 py-6"
            role="presentation"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setReviewOpen(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-lesson-title"
              className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl bg-white p-6 shadow-[0_24px_60px_-24px_#302942] sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">{level} vocabulary</p>
                  <h2 id="review-lesson-title" className="mt-2 text-2xl font-black tracking-[-0.06em] text-[#302942]">{currentLesson?.label}</h2>
                  <p className="mt-1 text-xs text-[#8c8198]">Review all {items.length} words in this lesson.</p>
                </div>
                <button type="button" onClick={() => setReviewOpen(false)} aria-label="Close lesson review" className="text-[#9a91a4] transition-colors hover:text-[#c11963]"><RiCloseLine className="size-5" /></button>
              </div>
              <div className="mt-6 min-h-0 space-y-2 overflow-y-auto pr-1 [scrollbar-color:#d9a1c4_#f1edff] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d9a1c4] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f1edff]">
                {items.map((entry, index) => (
                  <div key={`${entry.question}-${entry.answer}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl bg-[#faf8ff] px-4 py-3">
                    <div className="min-w-0"><p className="truncate text-sm font-bold text-[#302942]">{entry.kanji_question || entry.answer}</p><p className="truncate text-[10px] text-[#8c8198]">{entry.question}</p></div>
                    <span className="shrink-0 text-xs font-semibold text-[#c11963]">{entry.answer}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setReviewOpen(false)} className="mt-6 w-full rounded-full bg-[#c11963] py-3 text-xs font-bold text-white transition-colors hover:bg-[#a91657]">Done</button>
            </section>
          </div>
        )}
      </main>
    </DojoSidebar>
  );
}
