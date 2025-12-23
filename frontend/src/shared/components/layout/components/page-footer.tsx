/**
 * PageFooter - Footer đơn giản cho các admin pages
 * Hiển thị copyright text căn giữa
 */
export function PageFooter() {
  return (
    <div className="text-muted-foreground mt-auto py-6 text-center text-sm">
      © {new Date().getFullYear()} Synapse. All rights reserved.
    </div>
  );
}
