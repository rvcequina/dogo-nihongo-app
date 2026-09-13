import Link from "next/link"
import { RiArrowRightLine, RiBookOpenLine } from "@remixicon/react"
import { DojoSidebar } from "@/app/components/dojo-sidebar"

type PageScaffoldProps = {
  active: string
  eyebrow: string
  title: string
  description: string
  href: string
  action: string
}

export function PageScaffold({ active, eyebrow, title, description, href, action }: PageScaffoldProps) {
  return (
    <DojoSidebar active={active}>
      <main className="min-h-screen bg-[#fbf9ff] px-6 py-10 text-[#302942] sm:px-10 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <section className="mt-10 rounded-3xl bg-white p-8 shadow-[0_20px_45px_-35px_#4b3568] sm:mt-20 sm:p-12">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#fff0f7] text-[#c11963]"><RiBookOpenLine className="size-6" /></div>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c11963]">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#8c8198]">{description}</p>
            <Link href={href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c11963] px-5 py-3 text-sm font-bold text-white hover:bg-[#a91657]">{action}<RiArrowRightLine /></Link>
          </section>
        </div>
      </main>
    </DojoSidebar>
  )
}
