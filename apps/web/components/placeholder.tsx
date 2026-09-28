type PlaceholderProps = {
  className?: string
  label?: string
  children?: React.ReactNode
}

export function Placeholder({
  className = "",
  label = "Image placeholder",
  children,
}: PlaceholderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} aria-label={label}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
