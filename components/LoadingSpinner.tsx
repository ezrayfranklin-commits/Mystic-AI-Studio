export function LoadingSpinner({ label = "Generating reading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-stone-300" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-brass" />
      <span>{label}</span>
    </div>
  );
}
