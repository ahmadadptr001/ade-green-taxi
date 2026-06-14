'use client';

import ArchiveList from '@/components/berita/ArchiveList';
import { getArticlesByTopicSlug } from '@/services/articles';

export default function BeritaTopik({ params }) {
  return <ArchiveList params={params} fetcher={getArticlesByTopicSlug} kind="Topik" />;
}
