import { useEffect, useState } from 'react';

import { getPlatformStats } from '../../services/statsService';

function Stats() {
  const [stats, setStats] = useState({
    problems: 0,
    users: 0,
    submissions: 0,
    videos: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPlatformStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      value: stats.problems,
      label: 'Problems',
    },
    {
      value: stats.users,
      label: 'Users',
    },
    {
      value: stats.submissions,
      label: 'Submissions',
    },
    {
      value: stats.videos,
      label: 'Video Solutions',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Platform Statistics</h2>

        <p className="text-base-content/70">Real-time numbers from the CodeArena platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-base-300 bg-base-200/20 p-8 text-center"
          >
            <h3 className="mb-3 text-5xl font-bold text-primary">{stat.value}</h3>

            <p className="text-base-content/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
