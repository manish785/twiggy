const PageLoader = ({ label = "Loading..." }) => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
    <p className="text-sm font-medium text-ink-500">{label}</p>
  </div>
);

export default PageLoader;
