import { cn } from "@/lib/utils"

interface DividerProps {
  className?: string
  accent?: boolean
}

export function Divider({ className, accent = false }: DividerProps) {
  return (
    <hr
      className={cn(
        "border-t",
        accent ? "border-accent/30" : "border-border",
        className
      )}
    />
  )
}
