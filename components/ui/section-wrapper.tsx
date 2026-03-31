import { cn } from "@/lib/utils"

type SectionSurface = "default" | "muted"

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  as?: "section" | "div"
  id?: string
  /** Controls the background surface.
   *  - "default" — transparent, inherits page background
   *  - "muted"   — card/white surface */
  surface?: SectionSurface
}

const surfaceClasses: Record<SectionSurface, string> = {
  default: "",
  muted: "bg-card",
}

export function SectionWrapper({
  children,
  className,
  as: Tag = "section",
  id,
  surface = "default",
}: SectionWrapperProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "section-pad py-20 md:py-28 lg:py-32",
        surfaceClasses[surface],
        className
      )}
    >
      <div className="mx-auto max-w-[var(--max-w-content)]">
        {children}
      </div>
    </Tag>
  )
}
