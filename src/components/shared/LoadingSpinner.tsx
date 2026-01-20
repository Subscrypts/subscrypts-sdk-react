/**
 * Default loading spinner component
 */

export function LoadingSpinner() {
  return (
    <div className="subscrypts-flex subscrypts-items-center subscrypts-justify-center subscrypts-p-4">
      <div
        className="subscrypts-animate-spin subscrypts-rounded-full subscrypts-h-8 subscrypts-w-8 subscrypts-border-b-2 subscrypts-border-brand-primary"
        role="status"
        aria-label="Loading"
      >
        <span className="subscrypts-sr-only">Loading...</span>
      </div>
    </div>
  );
}
