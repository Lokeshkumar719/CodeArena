import { Link } from 'react-router';

function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="rounded-3xl border border-primary/20 bg-primary/10 p-12 text-center">
        <h2 className="mb-4 text-4xl font-bold">Ready To Start Solving?</h2>

        <p className="mb-8 text-lg text-base-content/70">
          Join CodeArena and improve your problem-solving skills with curated coding challenges.
        </p>

        <Link to="/signup" className="btn btn-primary btn-lg">
          Create Free Account
        </Link>
      </div>
    </section>
  );
}

export default CTA;
