export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-brand-bg">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary/20 border-t-brand-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
