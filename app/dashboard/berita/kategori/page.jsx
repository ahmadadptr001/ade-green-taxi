'use client';

import TaxonomyManager from '@/components/dashboard/TaxonomyManager';
import { addCategory, getCategories, removeCategory, updateCategory } from '@/services/articles';

export default function CategoryPage() {
  return (
    <TaxonomyManager
      title="Kategori"
      subtitle="Kelola kategori berita untuk memudahkan pencarian."
      label="Kategori"
      fetcher={async () => (await getCategories()).categories}
      adder={addCategory}
      remover={removeCategory}
      updater={updateCategory}
    />
  );
}
