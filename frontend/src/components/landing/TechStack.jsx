function TechStack() {
  const frontend = ['React', 'Redux Toolkit', 'Tailwind CSS', 'DaisyUI'];

  const backend = ['Node.js', 'Express.js', 'MongoDB', 'Redis'];

  const infrastructure = ['Judge0', 'Cloudinary', 'Render', 'Vercel', 'Resend'];

  const renderSection = (title, technologies) => (
    <div className="rounded-2xl border border-base-300 bg-base-200/20 p-8">
      <h3 className="mb-6 text-2xl font-bold">{title}</h3>

      <div className="flex flex-wrap gap-3">
        {technologies.map((tech) => (
          <span key={tech} className="badge badge-primary badge-lg">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section id="tech-stack" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Tech Stack</h2>

        <p className="mx-auto max-w-3xl text-lg text-base-content/70">
          Built using modern technologies for scalability, performance, and secure code execution.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {renderSection('Frontend', frontend)}

        {renderSection('Backend', backend)}

        {renderSection('Infrastructure', infrastructure)}
      </div>
    </section>
  );
}

export default TechStack;
