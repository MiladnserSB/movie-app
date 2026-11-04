const MoviesLoading = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="h-9 w-48 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-48 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-xl"
          />
        ))}
      </div>
    </div>
  );
};

export default MoviesLoading;
