'use client';

import TaxonomyManager from '@/components/dashboard/TaxonomyManager';
import { addTopic, getTopics, removeTopic, updateTopic } from '@/services/articles';

export default function TopikPage() {
  return (
    <TaxonomyManager
      title="Topik"
      subtitle="Kelola topik berita untuk navigasi pembaca."
      label="Topik"
      fetcher={async () => (await getTopics()).topics}
      adder={addTopic}
      remover={removeTopic}
      updater={updateTopic}
    />
  );
}
