'use client';

import ArchiveList from '@/components/berita/ArchiveList';
import { getArticlesByTagSlug } from '@/services/articles';

export default function BeritaTag({ params }) {
  return <ArchiveList params={params} fetcher={getArticlesByTagSlug} kind="Tag" />;
}
