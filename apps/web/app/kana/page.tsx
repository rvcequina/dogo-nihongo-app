"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import kanaData from "../../../../json-data/KanaQuizzes.json"
import {
	RiBookOpenLine,
	RiCheckLine,
	RiCloseLine,
	RiHome4Line,
	RiKeyboardBoxLine,
	RiLightbulbLine,
	RiMedalLine,
	RiMenuLine,
	RiRefreshLine,
	RiSettings3Line,
	RiTranslate2,
} from "@remixicon/react"

type KanaQuestion = {
	kana: string
	romaji: string
}

const hiragana: KanaQuestion[] = kanaData.hiragana
const katakana: KanaQuestion[] = kanaData.katakana
const dakuten: KanaQuestion[] = kanaData.dakuten
const combination: KanaQuestion[] = kanaData.combination
const allKana: KanaQuestion[] = [...hiragana, ...katakana, ...dakuten, ...combination]

function shuffledQuestions(pool: KanaQuestion[]) {
	return [...pool].sort(() => Math.random() - 0.5)
}

const quizGroups = [
	{ label: "Hiragana", detail: "ひらがな", data: shuffledQuestions(hiragana) },
	{ label: "Katakana", detail: "カタカナ", data: shuffledQuestions(katakana) },
	{ label: "Dakuten Kana", detail: "゛ ゜", data: shuffledQuestions(dakuten) },
	{ label: "Combination Kana", detail: "きゃ · キャ", data: shuffledQuestions(combination) },
	{ label: "All Kana", detail: "全部", data: shuffledQuestions(allKana) },
]

const fallbackGroup = quizGroups[4] ?? { label: "All Kana", detail: "全部", data: allKana }
const initialQuestion = shuffledQuestions(allKana)[0] ?? { kana: "あ", romaji: "a" }

const sidebarItems = [
	{ label: "Overview", href: "/", icon: RiHome4Line },
	{ label: "Kana", href: "/kana", icon: RiTranslate2 },
	{ label: "Kanji", href: "/kanji", icon: RiBookOpenLine },
	{ label: "Vocabulary", href: "/vocabulary", icon: RiKeyboardBoxLine },
	{ label: "Practice", href: "/practice", icon: RiLightbulbLine },
]

function nextQuestion(current: KanaQuestion, pool: KanaQuestion[], masteredKana: Set<string>) {
	const available = pool.filter((question) => question.kana !== current.kana && !masteredKana.has(question.kana))
	const freshCycle = pool.filter((question) => question.kana !== current.kana)
	const candidates = available.length > 0 ? available : freshCycle
	return candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0] ?? current
}

export default function KanaPage() {
	const [groupIndex, setGroupIndex] = useState(4)
	const [question, setQuestion] = useState(initialQuestion)
	const [answer, setAnswer] = useState("")
	const [feedback, setFeedback] = useState<"correct" | "retry" | "incorrect" | null>(null)
	const [score, setScore] = useState(0)
	const [attempts, setAttempts] = useState(0)
	const [questionAttempts, setQuestionAttempts] = useState(0)
	const [masteredKana, setMasteredKana] = useState<Set<string>>(new Set())
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [toast, setToast] = useState<string | null>(null)
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [completionOpen, setCompletionOpen] = useState(false)
	const [completionReason, setCompletionReason] = useState<"mastered" | "attempts" | null>(null)
	const currentGroup = quizGroups[groupIndex] ?? fallbackGroup

	useEffect(() => {
		if (!toast) return

		const timeout = window.setTimeout(() => setToast(null), 2800)
		return () => window.clearTimeout(timeout)
	}, [toast])

	function chooseGroup(index: number) {
		const selectedGroup = quizGroups[index] ?? fallbackGroup
		setGroupIndex(index)
		setQuestion(shuffledQuestions(selectedGroup.data)[0] ?? initialQuestion)
		setAnswer("")
		setFeedback(null)
		setQuestionAttempts(0)
		setMasteredKana(new Set())
		setCompletionOpen(false)
		setCompletionReason(null)
		setToast(`Switched to ${selectedGroup.label}.`)
	}

	function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		checkAnswer()
	}

	function checkAnswer() {
		if (!answer.trim() || feedback) return

		const isCorrect = answer.trim().toLowerCase() === question.romaji
		const nextQuestionAttempts = questionAttempts + 1
		setQuestionAttempts(nextQuestionAttempts)
		setFeedback(isCorrect ? "correct" : nextQuestionAttempts >= 3 ? "incorrect" : "retry")
		setAttempts((value) => value + 1)
		if (isCorrect) {
			setScore((value) => value + 1)
			setMasteredKana((value) => new Set(value).add(question.kana))
			if (masteredKana.size + (masteredKana.has(question.kana) ? 0 : 1) >= currentGroup.data.length) {
				setCompletionReason("mastered")
				setCompletionOpen(true)
			}
		} else if (nextQuestionAttempts >= 3) {
			setCompletionReason("attempts")
			setCompletionOpen(true)
		}
		setToast(isCorrect ? "Correct! Press Enter for the next kana." : nextQuestionAttempts >= 3 ? "Round paused after 3 attempts." : "Try again. You have another attempt.")
	}

	function retryQuestion() {
		setAnswer("")
		setFeedback(null)
	}

	function handleQuizKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
		if (event.key !== "Enter") return

		event.preventDefault()
		if (feedback === "correct") {
			continueQuiz()
		} else if (feedback === "retry") {
			retryQuestion()
		} else if (!feedback) {
			checkAnswer()
		}
	}

	function continueQuiz() {
		const available = currentGroup.data.filter((item) => item.kana !== question.kana && !masteredKana.has(item.kana))
		setQuestion(nextQuestion(question, currentGroup.data, masteredKana))
		setAnswer("")
		setFeedback(null)
		setQuestionAttempts(0)
		if (available.length === 0) setMasteredKana(new Set())
		setToast("Next kana ready.")
	}

	return (
		<main className="min-h-screen bg-[#fbf9ff] text-[#302942]">
			<div className="flex min-h-screen">
				<aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-30 w-64 border-r border-[#eee8f5] bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0`}>
					<div className="flex items-center justify-between px-2">
						<Link href="/" className="text-lg font-black tracking-[-0.06em] text-[#c11963]">Mochi Modern</Link>
						<button type="button" className="text-[#9a91a4] lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><RiCloseLine /></button>
					</div>
					<p className="mb-5 mt-10 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa1b3]">Your dojo</p>
					<nav className="space-y-1">
						{sidebarItems.map(({ label, href, icon: Icon }) => (
							<Link key={label} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${label === "Kana" ? "bg-[#fff0f7] text-[#c11963]" : "text-[#7f758b] hover:bg-[#faf5ff] hover:text-[#c11963]"}`}>
								<Icon className="size-4" />{label}
							</Link>
						))}
					</nav>
					<div className="mt-auto hidden rounded-2xl bg-[#f1edff] p-4 lg:block">
						<RiSettings3Line className="size-5 text-[#7433df]" />
						<p className="mt-3 text-xs font-bold">Keep your rhythm</p>
						<p className="mt-1 text-[10px] leading-4 text-[#8c8198]">A few minutes every day makes the kana stick.</p>
					</div>
				</aside>

				<div className="min-w-0 flex-1">
					<header className="flex items-center justify-between border-b border-[#eee8f5] bg-white px-5 py-4 sm:px-8 lg:px-12">
						<button type="button" className="text-[#71687f] lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><RiMenuLine /></button>
						<div className="ml-auto flex items-center gap-5 text-xs font-semibold text-[#84798f]"><span>{attempts} attempts</span><span className="rounded-full bg-[#fff0f7] px-3 py-1.5 text-[#c11963]">{score} correct</span><button type="button" aria-label="Settings" onClick={() => setSettingsOpen(true)} className="text-[#9a91a4] transition-colors hover:text-[#c11963]"><RiSettings3Line className="size-4" /></button></div>
					</header>

					<section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
						<div className="mb-9 flex flex-wrap items-end justify-between gap-4">
							<div><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c11963]">Kana practice</p><h1 className="text-3xl font-black tracking-[-0.07em] text-[#302942] sm:text-5xl">Kana Quiz</h1><p className="mt-3 max-w-md text-sm leading-6 text-[#8c8198]">Build instant recognition with short, focused rounds.</p></div>
							  <button type="button" onClick={() => { setScore(0); setAttempts(0); setQuestion(shuffledQuestions(currentGroup.data)[0] ?? initialQuestion); setAnswer(""); setFeedback(null); setQuestionAttempts(0); setMasteredKana(new Set()); setCompletionOpen(false); setCompletionReason(null); setToast("Session reset.") }} className="inline-flex items-center gap-2 rounded-full border border-[#e7dfef] bg-white px-4 py-2 text-xs font-bold text-[#786d86] transition-colors hover:border-[#c11963] hover:text-[#c11963]"><RiRefreshLine className="size-4" />Reset session</button>
						</div>

						<div className="mb-7 grid gap-3 sm:grid-cols-2">
							{quizGroups.map((group, index) => <button key={group.label} type="button" onClick={() => chooseGroup(index)} className={`rounded-2xl border p-4 text-left transition-all ${index === groupIndex ? "border-[#c11963] bg-[#fff0f7] shadow-[0_12px_24px_-20px_#c11963]" : "border-[#eee8f5] bg-white hover:border-[#d9c7e7]"}`}><div className="flex items-center justify-between"><span className="text-sm font-bold text-[#3a314d]">{group.label}</span><span className="text-lg text-[#c11963]">{group.detail}</span></div><p className="mt-2 text-[10px] text-[#9a90a5]">{group.data.length} characters · romaji</p></button>)}
						</div>

						<div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
							<section className="rounded-3xl bg-white p-6 shadow-[0_20px_45px_-35px_#4b3568] sm:p-10">
								<div className="mb-8 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa1b3]">Question {attempts + 1}</p><p className="mt-1 text-xs text-[#8c8198]">What is this kana?</p></div><span className="rounded-full bg-[#f1edff] px-3 py-1 text-[10px] font-bold text-[#7433df]">{currentGroup.label}</span></div>
								<div className="flex min-h-56 items-center justify-center rounded-2xl bg-[#faf8ff] text-[9rem] font-black leading-none text-[#302942] sm:min-h-72 sm:text-[11rem]">{question.kana}</div>
								<form onSubmit={submitAnswer} onKeyDown={handleQuizKeyDown} className="mt-7 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="kana-answer">Romaji answer</label><input id="kana-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} readOnly={Boolean(feedback)} autoComplete="off" autoFocus placeholder="Type the romaji" className="h-12 min-w-0 flex-1 rounded-xl border border-[#e8e1ef] bg-[#fdfcff] px-4 text-sm font-semibold text-[#302942] outline-none transition-colors placeholder:text-[#b5acbd] focus:border-[#c11963]" /><button type="submit" disabled={Boolean(feedback)} className="h-12 rounded-xl bg-[#c11963] px-6 text-sm font-bold text-white transition-colors hover:bg-[#a91657] disabled:cursor-not-allowed disabled:opacity-50">Check answer</button></form>
								{feedback && <div className={`mt-5 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${feedback === "correct" ? "bg-[#edf8f5] text-[#3b8573]" : "bg-[#fff0f7] text-[#c11963]"}`}><span className="flex items-center gap-2">{feedback === "correct" ? <RiCheckLine /> : <RiCloseLine />}{feedback === "correct" ? "Correct, keep going!" : feedback === "retry" ? "Not quite, try again." : `The answer is ${question.romaji}.`}</span>{feedback === "correct" ? <button type="button" onClick={continueQuiz} className="text-xs font-bold underline underline-offset-4">Next</button> : feedback === "retry" ? <button type="button" onClick={retryQuestion} className="text-xs font-bold underline underline-offset-4">Try again</button> : null}</div>}
							</section>

							<aside className="rounded-3xl bg-[#f1edff] p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-[#3c3156]">Quick guide</p><p className="mt-1 text-[10px] text-[#8c8198]">Helpful while you practice</p></div><RiLightbulbLine className="size-5 text-[#7433df]" /></div><div className="mt-7 space-y-3">{["Say the sound out loud", "Answer with romaji", "Repeat tricky characters"].map((tip, index) => <div key={tip} className="flex items-center gap-3 rounded-xl bg-white/70 p-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#c11963]">{index + 1}</span><span className="text-xs font-semibold text-[#554a64]">{tip}</span></div>)}</div><div className="mt-7 rounded-2xl bg-[#2d2944] p-4 text-white"><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/50">Session accuracy</p><p className="mt-2 text-3xl font-black text-[#ff8eb5]">{attempts ? Math.round((score / attempts) * 100) : 0}%</p><p className="mt-1 text-[10px] text-white/50">Keep a steady pace.</p></div></aside>
						</div>
					</section>
				</div>
			</div>

			{toast && <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#2d2944] px-5 py-3 text-xs font-semibold text-white shadow-[0_16px_32px_-18px_#2d2944]"><RiCheckLine className="size-4 text-[#ff8eb5]" />{toast}</div>}

			{settingsOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302942]/25 px-5" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSettingsOpen(false) }}><section role="dialog" aria-modal="true" aria-labelledby="settings-title" className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_24px_60px_-24px_#302942] sm:p-8"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c11963]">Quiz settings</p><h2 id="settings-title" className="mt-2 text-2xl font-black tracking-[-0.06em] text-[#302942]">Make practice yours</h2></div><button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings" className="text-[#9a91a4] transition-colors hover:text-[#c11963]"><RiCloseLine /></button></div><div className="mt-7 space-y-3"><div className="rounded-2xl bg-[#f1edff] p-4"><p className="text-xs font-bold text-[#3c3156]">Keyboard flow</p><p className="mt-1 text-[10px] leading-4 text-[#8c8198]">Enter checks an answer, retries mistakes, and moves forward after correct answers.</p></div><button type="button" onClick={() => { setScore(0); setAttempts(0); setQuestion(currentGroup.data[0] ?? initialQuestion); setAnswer(""); setFeedback(null); setQuestionAttempts(0); setMasteredKana(new Set()); setSettingsOpen(false); setCompletionOpen(false); setCompletionReason(null); setToast("Session reset.") }} className="flex w-full items-center justify-between rounded-2xl border border-[#eee8f5] px-4 py-3 text-left text-xs font-bold text-[#786d86] transition-colors hover:border-[#c11963] hover:text-[#c11963]">Reset session<RiRefreshLine className="size-4" /></button></div><button type="button" onClick={() => setSettingsOpen(false)} className="mt-6 w-full rounded-full bg-[#c11963] py-3 text-xs font-bold text-white transition-colors hover:bg-[#a91657]">Done</button></section></div>}

			{completionOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302942]/25 px-5" role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="completion-title" className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_24px_60px_-24px_#302942] sm:p-9"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#fff0f7] text-[#c11963]"><RiMedalLine className="size-7" /></div><p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#c11963]">{completionReason === "mastered" ? "Round complete" : "Session ended"}</p><h2 id="completion-title" className="mt-2 text-center text-3xl font-black tracking-[-0.07em] text-[#302942]">{completionReason === "mastered" ? `You mastered ${currentGroup.label}.` : "Three attempts used."}</h2><p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-[#8c8198]">{completionReason === "mastered" ? "Every character in this set has been answered correctly. Keep the rhythm going or start a fresh round." : `The answer was ${question.romaji}. Review this kana and try the set again when you are ready.`}</p><div className="mt-7 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-[#f1edff] p-3 text-center"><p className="text-2xl font-black text-[#7433df]">{masteredKana.size}</p><p className="mt-1 text-[10px] font-semibold text-[#8c8198]">mastered</p></div><div className="rounded-2xl bg-[#fff0f7] p-3 text-center"><p className="text-2xl font-black text-[#c11963]">{attempts}</p><p className="mt-1 text-[10px] font-semibold text-[#8c8198]">attempts</p></div><div className="rounded-2xl bg-[#edf8f5] p-3 text-center"><p className="text-2xl font-black text-[#3b8573]">{attempts ? Math.round((score / attempts) * 100) : 0}%</p><p className="mt-1 text-[10px] font-semibold text-[#8c8198]">accuracy</p></div></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => { setScore(0); setAttempts(0); setQuestion(currentGroup.data[0] ?? initialQuestion); setAnswer(""); setFeedback(null); setQuestionAttempts(0); setMasteredKana(new Set()); setCompletionOpen(false); setCompletionReason(null); setToast("Fresh round ready.") }} className="flex-1 rounded-full bg-[#c11963] py-3 text-xs font-bold text-white transition-colors hover:bg-[#a91657]">Practice again</button><button type="button" onClick={() => { setCompletionOpen(false); setCompletionReason(null) }} className="flex-1 rounded-full border border-[#e7dfef] py-3 text-xs font-bold text-[#786d86] transition-colors hover:border-[#c11963] hover:text-[#c11963]">Review status</button></div></section></div>}
		</main>
	)
}
