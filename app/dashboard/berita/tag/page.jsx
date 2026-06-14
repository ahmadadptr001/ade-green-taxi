'use client';

import TaxonomyManager from '@/components/dashboard/TaxonomyManager';
import { addTag, getTags, removeTag, updateTag } from '@/services/articles';

export default function TagPage() {
  return (
    <TaxonomyManager
      title="Tag"
      subtitle="Kelola tag berita untuk pengelompokan konten."
      label="Tag"
      fetcher={async () => (await getTags()).tags}
      adder={addTag}
      remover={removeTag}
      updater={updateTag}
    />
  );
}
