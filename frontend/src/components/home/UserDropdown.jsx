import { NavLink } from 'react-router';
import Chevron from './Chevron';
import { s } from '../../styles/pages/homepageStyles';

function UserDropdown({ user, openPanel, toggle, setOpenPanel, handleLogout, userDropdownRef }) {
  return (
    <div style={{ position: 'relative' }} ref={userDropdownRef}>
      <button style={s.userBtn} onClick={() => toggle('user')}>
        {user?.firstName} <Chevron open={openPanel === 'user'} />
      </button>

      {openPanel === 'user' && (
        <div style={s.dropdown}>
          {user?.role?.toLowerCase() === 'admin' && (
            <NavLink to="/admin" style={s.dropdownItem} onClick={() => setOpenPanel(null)}>
              ⚙️ Admin
            </NavLink>
          )}

          <NavLink to="/change-password" style={s.dropdownItem} onClick={() => setOpenPanel(null)}>
            🔒 Change Password
          </NavLink>

          <button
            onClick={handleLogout}
            style={{
              ...s.dropdownItem,
              background: 'transparent',
              border: 'none',
              width: '100%',
              textAlign: 'left',
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
