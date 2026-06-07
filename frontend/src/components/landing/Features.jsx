import { FaCode, FaGlobe, FaChartLine, FaVideo } from 'react-icons/fa';

function Features() {
  const features = [
    {
      icon: <FaCode />,
      title: 'Online Judge',
      description: 'Execute code securely using Judge0 and receive instant execution results.',
    },
    {
      icon: <FaGlobe />,
      title: 'Multi-Language Support',
      description:
        'Solve coding problems in C++, Java, and JavaScript using a unified environment.',
    },
    {
      icon: <FaChartLine />,
      title: 'Progress Tracking',
      description:
        'Track solved problems, view submissions, and monitor your improvement over time.',
    },
    {
      icon: <FaVideo />,
      title: 'Video Solutions',
      description: 'Learn efficiently through detailed editorials and video explanations.',
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Everything You Need</h2>

        <p className="mx-auto max-w-3xl text-lg text-base-content/70">
          CodeArena combines coding challenges, secure code execution, submission tracking, and
          learning resources into one platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="min-h-[240px] rounded-2xl border border-base-300 bg-base-200/20 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="mb-6 text-4xl text-primary">{feature.icon}</div>

            <h3 className="mb-4 text-2xl font-semibold">{feature.title}</h3>

            <p className="leading-relaxed text-base-content/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
