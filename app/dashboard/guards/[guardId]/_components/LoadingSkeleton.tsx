export const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="mb-4 flex items-center justify-between">
      <div className="h-10 w-3/4 rounded-lg bg-muted" />
      <div className="h-10 w-32 rounded-lg bg-muted" />
    </div>

    <div className="rounded-lg border">
      <div className="border-b p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="mb-4 h-6 w-32 rounded bg-muted" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded bg-muted" />
                    <div className="h-4 w-24 rounded bg-muted" />
                    <div className="h-4 w-32 rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="mb-4 h-6 w-40 rounded bg-muted" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-4">
                  <div className="mb-1 h-4 w-20 rounded bg-muted" />
                  <div className="h-8 w-16 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
