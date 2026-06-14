'use client';

import ArchiveList from '@/components/berita/ArchiveList';
import { getArticlesByCategorySlug } from '@/services/articles';

export default function BeritaKategori({ params }) {
  return <ArchiveList params={params} fetcher={getArticlesByCategorySlug} kind="Kategori" />;
}
