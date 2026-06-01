import { useSearchParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';

import axiosClient from '../utils/axiosClient';
import { s } from '../styles/pages/loginStyles';

function ResendVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const defaultEmail = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailId: defaultEmail,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axiosClient.post('/user/resend-verification', {
        emailId: data.emailId,
      });

      toast.success(response.data.message);

      // Optional: redirect back to login after 2s
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoArea}>
          <div style={s.logo}>CodeArena</div>
          <div style={s.tagline}>Resend Verification Email</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register('emailId', {
                required: 'Email is required',
              })}
              style={s.input}
            />
            {errors.emailId && <span style={s.errorMsg}>{errors.emailId.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...s.submitBtn,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Sending...' : 'Send Verification Email'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResendVerification;
