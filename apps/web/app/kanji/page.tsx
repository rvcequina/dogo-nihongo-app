"use client"

import { useMemo, useState } from "react"
import { RiArrowRightLine, RiCheckLine, RiCloseLine, RiRefreshLine, RiSearchLine } from "@remixicon/react"
import { DojoSidebar } from "@/components/dojo-sidebar"
import { convertRomajiToKana } from "@/lib/romaji-to-kana"
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
type QuizKind = "meaning" | "onyomi" | "kunyomi"
type KanjiQuestion = {
  character: string
  kind: QuizKind
  answers: string[]
  answerSets: Record<QuizKind, string[]>
}
type AnswerFeedback = "correct" | "retry" | "incorrect"

const kanjiByLevel: Record<KanjiLevel, KanjiRecord[]> = {
  N5: n5Kanji as KanjiRecord[],
  N4: n4Kanji as KanjiRecord[],
  N3: n3Kanji as KanjiRecord[],
  N2: n2Kanji as KanjiRecord[],
  N1: n1Kanji as KanjiRecord[],
}

function shuffled<T>(items: T[]) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = result[index]!
    result[index] = result[swapIndex]!
    result[swapIndex] = current
  }
  return result
}

function makeQuiz(records: KanjiRecord[]): KanjiQuestion[] {
  return shuffled(records.flatMap((item) => {
    const meanings = item.meanings.map((value) => value.trim()).filter(Boolean)
    const onyomi = item.onyomi.map((value) => value.trim()).filter(Boolean)
    const kunyomi = item.kunyomi.map((value) => value.trim()).filter(Boolean)
    const answerSets = { meaning: meanings, onyomi, kunyomi }

    return [
      ...(meanings.length ? [{ character: item.character, kind: "meaning" as const, answers: meanings, answerSets }] : []),
      ...(onyomi.length ? [{ character: item.character, kind: "onyomi" as const, answers: onyomi, answerSets }] : []),
      ...(kunyomi.length ? [{ character: item.character, kind: "kunyomi" as const, answers: kunyomi, answerSets }] : []),
    ]
  }))
}

function normalizeAnswer(value: string, kind: QuizKind) {
  const normalized = value.trim().toLocaleLowerCase().replace(/[ー-]/g, "-")
  return kind === "meaning" ? normalized : normalized.replace(/[ァ-ヶ]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60))
}

function isCorrectAnswer(input: string, question: KanjiQuestion) {
  return question.answers.some((answer) => normalizeAnswer(input, question.kind) === normalizeAnswer(answer, question.kind))
}

function getAnswerReminder(input: string, question: KanjiQuestion) {
  const matchedKind = (Object.keys(question.answerSets) as QuizKind[]).find((kind) =>
    kind !== question.kind && question.answerSets[kind].some((answer) => normalizeAnswer(input, kind) === normalizeAnswer(answer, kind)),
  )
  if (!matchedKind) return null

  if (question.kind === "meaning") return "That's a reading, but this question asks for the meaning."
  if (matchedKind === "meaning") return "That's the meaning, but this question asks for the reading."
  return `That's the ${matchedKind}, but this question asks for the ${question.kind}.`
}

export default function KanjiPage() {
  const [level, setLevel] = useState<KanjiLevel>("N5")
  const [search, setSearch] = useState("")
  const [mode, setMode] = useState<"library" | "quiz">("library")
  const [questions, setQuestions] = useState<KanjiQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answerInput, setAnswerInput] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [questionAttempts, setQuestionAttempts] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [quizTerminated, setQuizTerminated] = useState(false)
  const [score, setScore] = useState(0)
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

  const currentQuestion = questions[questionIndex]
  const answerReminder = currentQuestion ? getAnswerReminder(answerInput, currentQuestion) : null
  const quizComplete = questions.length > 0 && (questionIndex >= questions.length || quizTerminated)
  const questionsCompleted = quizTerminated ? questionIndex + 1 : questions.length

  function startQuiz() {
    setQuestions(makeQuiz(kanjiByLevel[level]))
    setQuestionIndex(0)
    setAnswerInput("")
    setFeedback(null)
    setQuestionAttempts(0)
    setAttempts(0)
    setMistakes(0)
    setQuizTerminated(false)
    setScore(0)
  }

  function changeLevel(nextLevel: KanjiLevel) {
    setLevel(nextLevel)
    setQuestions([])
    setQuestionIndex(0)
    setAnswerInput("")
    setFeedback(null)
    setQuestionAttempts(0)
    setAttempts(0)
    setMistakes(0)
    setQuizTerminated(false)
    setScore(0)
  }

  function checkAnswer() {
    if (!currentQuestion || !answerInput.trim() || feedback) return
    const isCorrect = isCorrectAnswer(answerInput, currentQuestion)
    const nextAttempts = questionAttempts + 1
    setQuestionAttempts(nextAttempts)
    setAttempts((value) => value + 1)
    if (isCorrect) {
      setScore((value) => value + 1)
      setFeedback("correct")
    } else {
      setMistakes((value) => value + 1)
      if (nextAttempts >= 3) {
        setFeedback("incorrect")
      } else {
        setFeedback("retry")
      }
    }
  }

  function retryQuestion() {
    setAnswerInput("")
    setFeedback(null)
  }

  function nextQuestion() {
    if (feedback === "incorrect" && questionAttempts >= 3) {
      setQuizTerminated(true)
      return
    }
    setQuestionIndex((value) => value + 1)
    setAnswerInput("")
    setFeedback(null)
    setQuestionAttempts(0)
  }

  function handleQuizKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return
    event.preventDefault()
    if (feedback === "retry") retryQuestion()
    else if (feedback === "correct" || feedback === "incorrect") nextQuestion()
    else checkAnswer()
  }

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
            {mode === "library" && <label className="flex w-full items-center gap-2 border-b border-[#dcd4e5] py-2 sm:max-w-xs">
              <RiSearchLine className="size-4 shrink-0 text-[#82788e]" />
              <span className="sr-only">Search kanji, readings, and meanings</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search kanji or meaning"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa1b3]"
              />
            </label>}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#e7dfef]">
            <div className="flex gap-2">
            {(["N5", "N4", "N3", "N2", "N1"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeLevel(item)}
                className={`border-b-2 px-4 py-3 text-xs font-bold ${level === item ? "border-[#c11963] text-[#c11963]" : "border-transparent text-[#82788e] hover:text-[#302942]"}`}
              >
                {item}
              </button>
            ))}
            </div>
            <div className="flex shrink-0 rounded-lg border border-[#e7dfef] bg-white p-1">
              {(["library", "quiz"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  aria-pressed={mode === item}
                  className={`rounded px-3 py-2 text-xs font-bold capitalize ${mode === item ? "bg-[#c11963] text-white" : "text-[#82788e] hover:text-[#302942]"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {mode === "library" ? (
            <>
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
            </>
          ) : (
            <section className="mx-auto mt-8 max-w-2xl border border-[#e7dfef] bg-white p-6 sm:p-10">
              {questions.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c11963]">{level} practice</p>
                  <h2 className="mt-3 text-2xl font-black text-[#302942]">Kanji quiz</h2>
                  <p className="mt-2 text-sm text-[#82788e]">Meanings, on’yomi, and kun’yomi for every kanji.</p>
                  <button type="button" onClick={startQuiz} className="mt-7 inline-flex items-center gap-2 bg-[#c11963] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#a91657]">
                    Start quiz <RiArrowRightLine className="size-4" />
                  </button>
                </div>
              ) : quizComplete ? (
                <div className="py-6 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c11963]">{quizTerminated ? "Quiz ended · 3 attempts used" : "Round complete"} · {level}</p>
                  <h2 className="mt-3 text-3xl font-black text-[#302942]">{score} / {questionsCompleted}</h2>
                  <p className="mt-2 text-sm text-[#82788e]">Correct answers</p>
                  <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-2 text-center">
                    <div className="bg-[#edf8f3] px-2 py-3"><p className="text-lg font-black text-[#28694f]">{score}</p><p className="text-[10px] text-[#82788e]">correct</p></div>
                    <div className="bg-[#fff0f7] px-2 py-3"><p className="text-lg font-black text-[#a91657]">{mistakes}</p><p className="text-[10px] text-[#82788e]">mistakes</p></div>
                    <div className="bg-[#f1eaf1] px-2 py-3"><p className="text-lg font-black text-[#51475e]">{attempts}</p><p className="text-[10px] text-[#82788e]">attempts</p></div>
                  </div>
                  <button type="button" onClick={startQuiz} className="mt-7 inline-flex items-center gap-2 border border-[#e7dfef] px-5 py-3 text-sm font-bold text-[#302942] transition-colors hover:border-[#c11963] hover:text-[#c11963]">
                    <RiRefreshLine className="size-4" /> Play again
                  </button>
                </div>
              ) : currentQuestion ? (
                <>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#82788e]">Question {questionIndex + 1} / {questions.length}</span>
                    <span className="text-[#c11963]">{score} correct</span>
                  </div>
                  <div className="mt-4 h-1.5 bg-[#f1eaf1]">
                    <div className="h-full bg-[#c11963] transition-all" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
                  </div>
                  <div className="py-8 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#82788e]">
                      Give the <span className="font-black font-bold text-lg">{currentQuestion.kind}</span> of the kanji below
                    </p>
                    <h2 className="mt-4 text-8xl font-semibold leading-none text-[#302942]" lang="ja">{currentQuestion.character}</h2>
                  </div>
                  <label className="block">
                    <span className="sr-only">Your {currentQuestion.kind} answer</span>
                    <input
                      autoFocus
                      value={answerInput}
                      onChange={(event) => setAnswerInput(currentQuestion.kind === "meaning" || isComposing ? event.target.value : convertRomajiToKana(event.target.value))}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={(event) => {
                        setIsComposing(false)
                        setAnswerInput(currentQuestion.kind === "meaning" ? event.currentTarget.value : convertRomajiToKana(event.currentTarget.value))
                      }}
                      onKeyDown={handleQuizKeyDown}
                      readOnly={feedback === "correct" || feedback === "incorrect"}
                      placeholder={currentQuestion.kind === "meaning" ? "Type the English meaning" : "Type romaji, for example nichi"}
                      className={`w-full border px-4 py-3 text-base outline-none transition-colors placeholder:text-[#aaa1b3] ${feedback === "correct" ? "border-[#4b9b7b] bg-[#edf8f3] text-[#28694f]" : feedback === "incorrect" ? "border-[#c11963] bg-[#fff0f7] text-[#a91657]" : "border-[#e7dfef] focus:border-[#c11963]"}`}
                    />
                  </label>
                  {feedback && (
                    <p role="status" className={`mt-4 flex items-center gap-2 text-sm font-semibold ${feedback === "correct" ? "text-[#28694f]" : "text-[#a91657]"}`}>
                      {feedback === "correct" ? <RiCheckLine className="size-4" /> : <RiCloseLine className="size-4" />}
                      {feedback === "correct" ? "Correct, keep going!" : feedback === "retry" ? <>Not quite. Try again.{answerReminder && ` ${answerReminder}`}</> : <>The answer is {currentQuestion.answers.join(", ")}.{answerReminder && ` ${answerReminder}`}</>}
                    </p>
                  )}
                  <div className="mt-6 flex justify-end">
                    {feedback ? (
                      <button type="button" onClick={feedback === "retry" ? retryQuestion : nextQuestion} className="inline-flex items-center gap-2 bg-[#c11963] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#a91657]">
                        {feedback === "retry" ? "Try again" : feedback === "incorrect" ? "See summary" : questionIndex + 1 === questions.length ? "See results" : "Next question"} <RiArrowRightLine className="size-4" />
                      </button>
                    ) : (
                      <button type="button" onClick={checkAnswer} disabled={!answerInput.trim()} className="bg-[#c11963] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#a91657] disabled:cursor-not-allowed disabled:opacity-40">
                        Check answer
                      </button>
                    )}
                  </div>
                </>
              ) : null}
            </section>
          )}
        </div>
      </main>
    </DojoSidebar>
  )
}
