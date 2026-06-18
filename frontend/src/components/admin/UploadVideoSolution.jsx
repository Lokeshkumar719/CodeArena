import { useParams, useNavigate, NavLink } from 'react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';

import { s } from '../../styles/admin/uploadVideoSolutionStyles';

function UploadVideoSolution() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axiosClient.post(
        `/video/upload/${problemId}`,
        {
          youtubeUrl: data.youtubeUrl.trim(),
        }
      );

      toast.success(response.data.message);

      reset();

      setTimeout(() => {
        navigate('/admin/video');
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to upload video solution'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button
            onClick={() => navigate(-1)}
            style={s.backBtn}
          >
            <svg
              width='16'
              height='16'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back
          </button>

          <NavLink
            to='/'
            style={{ textDecoration: 'none' }}
          >
            <span style={s.logo}>CodeArena</span>
          </NavLink>
        </div>

        <NavLink
          to='/admin'
          style={s.adminLink}
        >
          <span style={s.adminBox}>
            Admin Dashboard
          </span>
        </NavLink>
      </nav>

      <div style={s.main}>
        <div style={s.header}>
          <h1 style={s.heading}>
            Upload Video Solution
          </h1>

          <p style={s.subheading}>
            Add a YouTube editorial video for this
            problem
          </p>
        </div>

        <div style={s.card}>
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <div style={s.formGroup}>
              <label style={s.label}>
                YouTube URL
              </label>

              <input
                type='url'
                placeholder='https://www.youtube.com/watch?v=...'
                style={s.input}
                disabled={loading}
                {...register('youtubeUrl', {
                  required:
                    'YouTube URL is required',

                  validate: (value) => {
                    try {
                      const parsedUrl =
                        new URL(value);

                      return (
                        parsedUrl.hostname ===
                          'www.youtube.com' ||
                        parsedUrl.hostname ===
                          'youtube.com' ||
                        parsedUrl.hostname ===
                          'youtu.be' ||
                        'Invalid YouTube URL'
                      );
                    } catch {
                      return 'Invalid YouTube URL';
                    }
                  },
                })}
              />

              {errors.youtubeUrl && (
                <p style={s.errorText}>
                  {errors.youtubeUrl.message}
                </p>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '24px',
              }}
            >
              <button
                type='submit'
                disabled={loading}
                style={{
                  ...s.submitBtn,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading
                    ? 'not-allowed'
                    : 'pointer',
                }}
              >
                {loading
                  ? 'Saving...'
                  : 'Save Video'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadVideoSolution;