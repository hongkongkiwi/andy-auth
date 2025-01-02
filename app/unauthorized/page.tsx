const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-4xl font-bold text-red-600">401 Unauthorized</h1>
      <p className="mb-6 text-center text-lg text-gray-600">
        You don't have permission to access this resource.
      </p>
      <a
        href="/"
        className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Return Home
      </a>
    </div>
  );
};

export default UnauthorizedPage;
