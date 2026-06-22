import { s } from '../../../styles/admin/updateProblemStyles';

function HiddenTestCasesSection({ setValue, watch, existingZip = null }) {
  const selectedFile = watch('hiddenTestCasesZip');
  const hasExistingZip = !!existingZip && !selectedFile;
  const isUpdateMode = !!existingZip;

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
        style={{ display: 'none' }}
        id="zipInput"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            setValue('hiddenTestCasesZip', file, {
              shouldValidate: true,
            });
          }
        }}
      />

      <button
        type="button"
        style={s.uploadBtn}
        onClick={() => document.getElementById('zipInput').click()}
      >
        {isUpdateMode ? 'Replace ZIP' : 'Upload ZIP'}
      </button>

      {selectedFile ? (
        <p style={{ color: '#facc15', marginTop: '12px', fontWeight: 600 }}>
          📦 {isUpdateMode ? 'Replacement ZIP selected:' : 'ZIP selected:'} {selectedFile.name}
          {isUpdateMode && (
            <>
              <br />
              <span style={{ color: '#f87171', fontSize: '12px' }}>
                ⚠ This will replace existing ZIP
              </span>
            </>
          )}
        </p>
      ) : hasExistingZip ? (
        <p style={{ color: '#22c55e', marginTop: '12px', fontWeight: 600 }}>
          ✓ Current ZIP available
        </p>
      ) : (
        <p style={{ color: '#94a3b8', marginTop: '12px' }}>No ZIP uploaded</p>
      )}
    </div>
  );
}

export default HiddenTestCasesSection;
