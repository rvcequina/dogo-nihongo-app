export function HeroVisual() {
  return (
    <div className="hero-float relative mx-auto h-[300px] w-full max-w-[440px]">
      <div className="absolute left-[10%] top-[12%] h-[78%] w-[62%] rotate-[-7deg] rounded-[28px] bg-[#e6ddff]" />
      <div className="absolute right-[8%] top-[4%] h-[78%] w-[56%] rounded-[27px] bg-[#7433df] shadow-[0_22px_40px_-24px_rgba(88,37,170,0.9)]">
        <div className="absolute inset-x-5 top-5 flex items-center justify-between text-white/80"><span className="text-xl font-semibold">道</span><span className="h-2 w-2 rounded-full bg-white/70" /></div>
      </div>
      <div className="absolute bottom-[7%] left-[18%] h-[45%] w-[62%] overflow-hidden rounded-[22px] bg-[#05749b] p-5 text-white shadow-[0_25px_34px_-20px_rgba(4,95,126,0.8)]">
        <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-white/70"><span className="h-1.5 w-1.5 rounded-full bg-[#f14f9c]" />PRACTICE / 01</div>
        <div className="space-y-2 font-mono text-[10px] leading-3 text-white/80"><p>const discipline =</p><p className="pl-3 text-[#ffd9f0]">focus + patience;</p><p className="pt-2 text-white/50">{"// keep showing up"}</p></div>
      </div>
      <div className="absolute bottom-[16%] right-[8%] h-16 w-16 rounded-full bg-[#f6d73e] opacity-90" />
    </div>
  )
}
