function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold mb-4">CodeArena</h1>

      <p className="max-w-2xl text-lg mb-8">
        Practice coding problems, improve your DSA skills, track your progress, and prepare for
        coding interviews.
      </p>

      <div className="flex gap-4">
        <a href="/signup" className="btn btn-primary">
          Get Started
        </a>

        <a href="/login" className="btn btn-outline">
          Login
        </a>
      </div>
    </div>
  );
}

export default LandingPage;
