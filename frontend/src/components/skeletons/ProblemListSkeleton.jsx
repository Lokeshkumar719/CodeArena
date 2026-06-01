export default function ProblemListSkeleton({ count = 5 }) {
  const shimmer = {
    background: 'linear-gradient(90deg, #1e2738 25%, #2a3448 50%, #1e2738 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };

  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: '#0c1018',
            border: '1px solid #1e2738',
            borderRadius: '16px',
            padding: '22px 28px',
            marginBottom: '12px',
          }}
        >
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ ...shimmer, height: '14px', width: '32px', borderRadius: '6px' }} />
            <div style={{ ...shimmer, height: '16px', width: '200px', borderRadius: '6px' }} />
          </div>
          {/* Tags row */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ ...shimmer, height: '22px', width: '64px', borderRadius: '999px' }} />
            <div style={{ ...shimmer, height: '22px', width: '80px', borderRadius: '999px' }} />
            <div style={{ ...shimmer, height: '22px', width: '56px', borderRadius: '999px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
