import { supabase } from "@/config/supabase";

export const reportUser = async (dataReport)   => {
  try {
    
    const { data, error } = await supabase
          .from('reports')
          .insert(dataReport)
          .select()
          .single();
  
        if (error) throw error;
        return data;
  } catch (error) {
    console.error('Error reporting user:', error);
    throw error;
  }
}