'use client';

import { Bookmark } from 'lucide-react';
import SavedArticlesList from '@/components/dashboard/SavedArticlesList';

export default function DisimpanPage() {
  return (
    <SavedArticlesList
      title="Disimpan"
      subtitle="Baca kembali artikel yang sudah Anda simpan."
      icon={Bookmark}
      relationKey="article_bookmarks"
    />
  );
}
