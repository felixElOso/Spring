"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatTileProps {
  value: string
  label: string
  description?: string
  className?: string
}

export function StatTile({ value, label, description, className }: StatTileProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex flex-col gap-16 p-8 md:p-10">
        <div className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1] tracking-tight text-foreground">
          {value}
        </div>
        <div>
          <div className="text-base font-medium leading-relaxed text-foreground">
            {label}
          </div>
          {description && (
            <div className="mt-2 text-base leading-relaxed text-foreground/80">
              {description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
