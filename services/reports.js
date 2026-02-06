import { supabase } from '@/config/supabase';
import axios from 'axios';

export const reportUser = async (dataReport) => {
  try {
    const response = await axios.post('/api/reports', dataReport);
    if (response.ok) return;

    throw response;
  } catch (error) {
    console.error('Error reporting user:', error);
    throw error;
  }
};
