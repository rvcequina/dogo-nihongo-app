"use client"

import { useEffect, useRef, useState } from "react"

type SlideInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function SlideIn({
  children,
  className = "",
  delay = 0,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const previousScrollY = useRef(0)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        const currentScrollY = window.scrollY
        setScrollDirection(currentScrollY < previousScrollY.current ? "up" : "down")
        previousScrollY.current = currentScrollY
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`motion-reveal motion-reveal-from-${scrollDirection} ${isVisible ? "motion-reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
