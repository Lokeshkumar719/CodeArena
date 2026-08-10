import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import axiosClient from '../utils/axiosClient';

import { s } from '../styles/pages/editProfileStyles';

function EditProfile() {
  const [formData, setFormData] = useState({
    username: '',
    emailId: '',
    bio: '',
    institution: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosClient.get('/profile/me');

      const profile = response.data.data;

      setFormData({
        username: profile.username || '',
        emailId: profile.emailId || '',
        bio: profile.bio || '',
        institution: profile.institution || '',
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const username = formData.username.trim();
    const bio = formData.bio.trim();
    const institution = formData.institution.trim();

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return false;
    }

    if (username.length > 20) {
      toast.error('Username cannot exceed 20 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error('Username can only contain letters, numbers and underscores');
      return false;
    }

    if (bio.length > 200) {
      toast.error('Bio cannot exceed 200 characters');
      return false;
    }

    if (institution.length > 100) {
      toast.error('Institution cannot exceed 100 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      await axiosClient.patch('/profile/me', {
        username: formData.username.trim(),
        bio: formData.bio.trim(),
        institution: formData.institution.trim(),
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={s.page}>Loading...</div>;
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.card}>
          <h1 style={s.heading}>Edit Profile</h1>

          <form onSubmit={handleSubmit}>
            <div style={s.field}>
              <label style={s.label}>Username</label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={s.input}
              />

              <div style={s.helperText}>{formData.username.length}/20</div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Email Address</label>

              <input type="email" value={formData.emailId} readOnly style={s.readOnlyInput} />

              <div style={s.helperText}>Email cannot be changed.</div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Institution</label>

              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                style={s.input}
              />

              <div style={s.helperText}>{formData.institution.length}/100</div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Bio</label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                style={s.textarea}
              />

              <div style={s.helperText}>{formData.bio.length}/200</div>
            </div>

            <button type="submit" disabled={saving} style={s.saveBtn}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
