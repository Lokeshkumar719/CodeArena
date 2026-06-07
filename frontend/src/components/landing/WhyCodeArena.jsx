import { FaBolt, FaShieldAlt, FaVideo, FaChartLine } from 'react-icons/fa';

function WhyCodeArena() {
  const benefits = [
    {
      icon: <FaBolt />,
      title: 'Fast Code Execution',
      description: 'Execute solutions instantly using Judge0-powered online code execution.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure Sandbox',
      description: 'Programs run inside isolated environments for safe execution.',
    },
    {
      icon: <FaChartLine />,
      title: 'Track Progress',
      description: 'Monitor solved problems and review previous submissions.',
    },
    {
      icon: <FaVideo />,
      title: 'Learn Efficiently',
      description: 'Understand solutions through editorials and video explanations.',
    },
  ];

  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Why CodeArena?</h2>

        <p className="mx-auto max-w-3xl text-lg text-base-content/70">
          More than just a problem set. CodeArena combines learning, practice, execution, and
          progress tracking into a single platform.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex gap-5 rounded-2xl border border-base-300 bg-base-200/20 p-8"
          >
            <div className="text-3xl text-primary">{benefit.icon}</div>

            <div>
              <h3 className="mb-2 text-2xl font-semibold">{benefit.title}</h3>

              <p className="text-base-content/70">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyCodeArena;
