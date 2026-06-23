import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../../utils/axiosClient';
import { useNavigate, useParams, NavLink } from 'react-router';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/errorHandler';
import useRateLimit from '../../hooks/useRateLimit.jsx';
import AdminUploadSkeleton from '../skeletons/AdminUploadSkeleton';

import { s } from '../../styles/admin/updateProblemStyles';

import BasicInformationSection from './forms/BasicInformationSection';
import VisibleTestCasesSection from './forms/VisibleTestCasesSection';
import HiddenTestCasesSection from './forms/HiddenTestCasesSection';
import CodeTemplatesSection from './forms/CodeTemplatesSection';

import { tagOptions } from '../../constants/problemTags';
import { languageOptions } from '../../constants/problemLanguages';

import TestCaseBlock from './forms/TestCaseBlock';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  inputFormat: z.string().min(1, 'Input format is required'),
  outputFormat: z.string().min(1, 'Output format is required'),
  constraints: z.string().min(1, 'Constraints are required'),

  timeLimit: z.coerce.number().min(1, 'Time limit must be at least 1 second'),

  memoryLimit: z.coerce.number().min(1024, 'Memory limit must be at least 1024 KB'),

  tags: z
    .array(z.string().refine((tag) => tagOptions.includes(tag), 'Invalid tag'))
    .min(1, 'At least one tag is required'),

  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().min(1, 'Explanation is required'),
      })
    )
    .min(1, 'At least one visible test case required'),

  hiddenTestCasesZip: z.any().optional(),

  startCode: z
    .array(
      z.object({
        language: z.enum(['cpp', 'java', 'javascript']),
        initialCode: z.string().min(1, 'Initial code is required'),
      })
    )
    .length(3),

  referenceSolution: z
    .array(
      z.object({
        language: z.enum(['cpp', 'java', 'javascript']),
        completeCode: z.string().min(1, 'Complete code is required'),
      })
    )
    .length(3),
});

function UpdateProblem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const draftKey = `updateProblemDraft-${id}`;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cooldown, startCooldown } = useRateLimit();
  const [existingZip, setExistingZip] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),

    defaultValues: {
      difficulty: 'easy',
      timeLimit: 2,
      memoryLimit: 262144,

      visibleTestCases: [
        {
          input: '',
          output: '',
          explanation: '',
        },
      ],
      startCode: languageOptions.map((lang) => ({
        language: lang.value,
        initialCode: '',
      })),

      referenceSolution: languageOptions.map((lang) => ({
        language: lang.value,
        completeCode: '',
      })),
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: 'visibleTestCases',
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const savedDraft = sessionStorage.getItem(draftKey);

        if (savedDraft) {
          reset(JSON.parse(savedDraft));
          setLoading(false);
          return;
        }

        const response = await axiosClient.get(`/problem/admin/problemById/${id}`);
        setExistingZip(response.data.data.hiddenTestCasesZip);
        reset(response.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));

        if (import.meta.env.DEV) {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, reset, draftKey]);

  // Auto-save draft to sessionStorage with debounce
  const watchedData = watch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (watchedData.title || watchedData.description) {
        sessionStorage.setItem(draftKey, JSON.stringify(watchedData));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [watchedData, draftKey]);

  // Clear draft on navigate away, but NOT on page refresh
  useEffect(() => {
    let isUnloading = false;

    const handleBeforeUnload = () => {
      isUnloading = true;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Only clear draft if navigating away, NOT on page refresh
      if (!isUnloading) {
        sessionStorage.removeItem(draftKey);
      }
    };
  }, [draftKey]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('inputFormat', data.inputFormat);
      formData.append('outputFormat', data.outputFormat);
      formData.append('constraints', data.constraints);

      formData.append('difficulty', data.difficulty);
      formData.append('timeLimit', data.timeLimit);
      formData.append('memoryLimit', data.memoryLimit);

      formData.append('tags', JSON.stringify(data.tags));
      formData.append('visibleTestCases', JSON.stringify(data.visibleTestCases));
      formData.append('startCode', JSON.stringify(data.startCode));
      formData.append('referenceSolution', JSON.stringify(data.referenceSolution));

      if (data.hiddenTestCasesZip instanceof File) {
        formData.append('hiddenTestCasesZip', data.hiddenTestCasesZip);
      }

      await axiosClient.patch(`/problem/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      sessionStorage.removeItem(draftKey);
      toast.success('Problem updated successfully!');
      navigate('/admin/update-list');
    } catch (error) {
      if (error.rateLimitedFor) {
        startCooldown(error.rateLimitedFor);
        toast.error(error.response?.data?.message || 'Too many requests. Please slow down.');
        return;
      }
      toast.error(getErrorMessage(error));
      if (import.meta.env.DEV) {
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || cooldown > 0;

  if (loading) return <AdminUploadSkeleton />;

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            ← Back
          </button>

          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <span style={s.logo}>CodeArena</span>
          </NavLink>
        </div>

        <NavLink to="/admin" style={s.adminLink}>
          <span style={s.adminBox}>Admin Dashboard</span>
        </NavLink>
      </nav>

      <div style={s.main}>
        <div style={s.header}>
          <h1 style={s.heading}>Update Problem</h1>

          <p style={s.subheading}>Edit the details of this coding problem</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, () => {
            toast.error('Please fix validation errors');
          })}
        >
          <BasicInformationSection
            register={register}
            errors={errors}
            control={control}
            tagOptions={tagOptions}
          />

          <VisibleTestCasesSection
            appendVisible={appendVisible}
            visibleFields={visibleFields}
            register={register}
            removeVisible={removeVisible}
            TestCaseBlock={TestCaseBlock}
          />

          <HiddenTestCasesSection setValue={setValue} watch={watch} existingZip={existingZip} />

          <CodeTemplatesSection languageOptions={languageOptions} register={register} />

          {/* Rate limit banner */}
          {cooldown > 0 && (
            <div style={s.rateLimitBanner}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f87171">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"
                />
              </svg>
              <span style={{ fontSize: '13px', color: '#f87171' }}>
                Too many requests. Please wait {cooldown}s before submitting again.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            style={{
              ...s.submitBtn,
              opacity: isDisabled ? 0.7 : 1,
            }}
          >
            {isSubmitting
              ? 'Updating Problem...'
              : cooldown > 0
                ? `Wait ${cooldown}s`
                : 'Update Problem'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProblem;
