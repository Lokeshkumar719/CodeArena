import { s } from '../../../styles/admin/updateProblemStyles';

function HiddenTestCasesSection({ setValue, watch }) {
  const selectedFile = watch('hiddenTestCasesZip') || null;

  return (
    <div style={s.card}>
      <div style={s.sectionHeader}>
        <h2 style={s.cardTitle}>Hidden Test Cases ZIP</h2>
      </div>

      <p
        style={{
          color: '#94a3b8',
          fontSize: '14px',
          marginBottom: '16px',
        }}
      >
        Upload a ZIP file containing:
      </p>

      <pre
        style={{
          background: '#0f172a',
          padding: '12px',
          borderRadius: '8px',
          color: '#cbd5e1',
          marginBottom: '16px',
          overflowX: 'auto',
        }}
      >
        {`1.in
1.out
2.in
2.out
3.in
3.out`}
      </pre>

      <input
        type="file"
        accept=".zip"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            setValue('hiddenTestCasesZip', file, {
              shouldValidate: true,
            });
          }
        }}
      />

      {selectedFile && (
        <p
          style={{
            marginTop: '12px',
            color: '#22c55e',
            fontWeight: 600,
          }}
        >
          ✓ {selectedFile.name}
        </p>
      )}
    </div>
  );
}

export default HiddenTestCasesSection;
