'use client';

import { Heart } from 'lucide-react';
import SavedArticlesList from '@/components/dashboard/SavedArticlesList';

export default function DisukaiPage() {
  return (
    <SavedArticlesList
      title="Artikel Disukai"
      subtitle="Koleksi berita yang Anda sukai."
      icon={Heart}
      relationKey="article_likes"
    />
  );
}
