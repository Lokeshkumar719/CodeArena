import { Link } from 'react-router';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-primary">CodeArena</h1>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features">Features</a>
          <a href="#tech-stack">Tech Stack</a>
          <a href="#about">About</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>

          <Link to="/signup" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
