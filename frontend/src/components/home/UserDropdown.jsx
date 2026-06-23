import { NavLink } from 'react-router';
import Chevron from './Chevron';
import { s } from '../../styles/pages/homepageStyles';

function UserDropdown({ user, openPanel, toggle, setOpenPanel, handleLogout, userDropdownRef }) {
  return (
    <div style={{ position: 'relative' }} ref={userDropdownRef}>
      <button style={s.userBtn} onClick={() => toggle('user')}>
        {user?.username} <Chevron open={openPanel === 'user'} />
      </button>

      {openPanel === 'user' && (
        <div style={s.dropdown}>
          <NavLink
            to={`/profile/${user?.username}`}
            style={s.dropdownItem}
            onClick={() => setOpenPanel(null)}
          >
            👤 My Profile
          </NavLink>

          <NavLink to="/profile/edit" style={s.dropdownItem} onClick={() => setOpenPanel(null)}>
            ✏️ Edit Profile
          </NavLink>

          <NavLink to="/change-password" style={s.dropdownItem} onClick={() => setOpenPanel(null)}>
            🔒 Change Password
          </NavLink>

          {user?.role?.toLowerCase() === 'admin' && (
            <NavLink to="/admin" style={s.dropdownItem} onClick={() => setOpenPanel(null)}>
              ⚙️ Admin
            </NavLink>
          )}

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
