export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-content mx-auto section-pad py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <p className="text-sm text-foreground/50">
          Studio © {year}
        </p>
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm text-foreground/50 hover:text-coral transition-colors duration-200">Instagram</a>
          <a href="#" className="text-sm text-foreground/50 hover:text-coral transition-colors duration-200">LinkedIn</a>
          <a href="#" className="text-sm text-foreground/50 hover:text-coral transition-colors duration-200">Dribbble</a>
        </div>
      </div>
    </footer>
  )
}
