import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { s } from '../styles/pages/verifyEmailStyles';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const response = await axiosClient.get(`/user/verify-email/${token}`);

        setSuccess(true);
        setMessage(response.data.message);
      } catch (error) {
        setSuccess(false);
        setMessage(error.response?.data?.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, navigate]);

  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ textAlign: 'center' }}>
            <span className="loading loading-spinner loading-lg"></span>

            <p
              style={{
                ...s.message,
                marginTop: '20px',
                marginBottom: 0,
              }}
            >
              Verifying your email...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div
          style={{
            ...s.icon,
            ...(success ? s.successIcon : s.errorIcon),
          }}
        >
          {success ? '✓' : '✕'}
        </div>

        <h1 style={s.title}>{success ? 'Email Verified' : 'Verification Failed'}</h1>

        <p style={s.message}>{message}</p>

        <button onClick={() => navigate('/login')} style={s.button}>
          Go To Login
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;
