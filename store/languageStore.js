import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// skipHydration keeps server + first client render identical ('id'); the stored
// language is applied after mount via rehydrate() (see LayoutSearch), avoiding
// hydration mismatches on language-dependent text.
export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'id',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
