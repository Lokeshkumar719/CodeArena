import axiosClient from '../utils/axiosClient';

export const getPlatformStats = async () => {
  const response = await axiosClient.get('/api/stats');
  return response.data.data;
};
