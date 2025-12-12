/**
 * PageFooter - Footer đơn giản cho các admin pages
 * Hiển thị copyright text căn giữa
 */
export function PageFooter() {
  return (
    <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
      © {new Date().getFullYear()} Synapse. All rights reserved.
    </div>
  )
}
