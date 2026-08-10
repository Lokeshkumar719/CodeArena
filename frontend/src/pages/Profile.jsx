import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { s } from '../styles/pages/profileStyles';

function StatCard({ title, value }) {
  return (
    <div style={s.statCard}>
      <div style={s.statTitle}>{title}</div>

      <div style={s.statValue}>{value}</div>
    </div>
  );
}

function Profile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await axiosClient.get(`/profile/${username}`);

      setProfile(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={s.page}>Loading...</div>;
  }

  if (!profile) {
    return <div style={s.page}>Profile not found</div>;
  }

  const joinedText = new Date(profile.joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.profileCard}>
          <div style={s.username}>{profile.username}</div>

          {profile.bio && <div style={s.bio}>{profile.bio}</div>}

          {profile.institution && <div style={s.institution}>🎓 {profile.institution}</div>}

          <div style={s.joined}>Member since {joinedText}</div>
        </div>

        <div style={s.statsGrid}>
          <StatCard title="Solved" value={profile.problemsSolved} />

          <StatCard title="Submissions" value={profile.totalSubmissions} />

          <StatCard title="Accepted" value={profile.acceptedSubmissions} />

          <StatCard title="Acceptance Rate" value={`${profile.acceptanceRate}%`} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
