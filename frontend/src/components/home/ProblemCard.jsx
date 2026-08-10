import { NavLink } from 'react-router';
import { s } from '../../styles/pages/homepageStyles';

function ProblemCard({ problem, getDifficultyStyle }) {
  return (
    <div style={s.problemCard}>
      <div style={s.problemCardTop}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {problem.problemNo && <span style={s.problemNo}>#{problem.problemNo}</span>}

          <NavLink to={`/problem/${problem.slug}`} style={s.problemTitle}>
            {problem.title}
          </NavLink>
        </div>

        {problem.isSolved && <span style={s.solvedBadge}>✔ Solved</span>}
      </div>

      <div style={s.badgeRow}>
        <span style={getDifficultyStyle(problem.difficulty)}>{problem.difficulty}</span>

        {problem.tags.map((tag) => (
          <span key={tag} style={s.tagBadge}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProblemCard;
