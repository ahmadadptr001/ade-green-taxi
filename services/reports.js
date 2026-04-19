import { supabase } from '@/config/supabase';
import axios from 'axios';

export const reportUser = async (dataReport) => {
  const response = await axios.post('/api/reports', dataReport);
  return response;
};
