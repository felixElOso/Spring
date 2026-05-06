export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark">
      <main>{children}</main>
    </div>
  )
}
