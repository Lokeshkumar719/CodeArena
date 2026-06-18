import Chevron from './Chevron';
import { s } from '../../styles/pages/homepageStyles';

function CustomSelect({ value, onChange, options, placeholder, dropdownRef, isOpen, onToggle }) {
  const selected = options.find((o) => o.value === value);

  return (
    <div style={s.selectWrapper} ref={dropdownRef}>
      <button type="button" style={s.selectBtn} onClick={onToggle}>
        <span style={{ color: value ? '#e2e8f0' : '#9ca3af' }}>
          {selected ? selected.label : placeholder}
        </span>
        <Chevron open={isOpen} />
      </button>

      {isOpen && (
        <div style={s.selectDropdown}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              style={{
                ...s.selectOption,
                ...(value === opt.value ? s.selectOptionActive : {}),
              }}
              onClick={() => {
                onChange(opt.value);
                onToggle();
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
