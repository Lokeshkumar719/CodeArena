import { Link } from 'react-router';

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <div className="badge badge-primary badge-lg mb-6">🚀 Online Coding Platform</div>

          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Practice Coding Problems.
            <br />
            Prepare for Technical Interviews.
          </h1>

          <p className="mb-8 text-lg text-base-content/70 md:text-xl">
            Solve curated DSA problems, execute code securely using Judge0, track submissions, and
            improve problem-solving skills through editorials and video solutions.
          </p>

          <div className="mb-8 flex flex-wrap gap-4">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Solving
            </Link>

            <a href="#features" className="btn btn-outline btn-lg">
              View Features
            </a>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
            <span>✓ Judge0 Powered</span>
            <span>✓ Multi-Language Support</span>
            <span>✓ Video Solutions</span>
            <span>✓ Progress Tracking</span>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-2xl border border-base-300 shadow-2xl">
            <img
              src="/codearena-preview.jpeg"
              alt="CodeArena Platform Preview"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
