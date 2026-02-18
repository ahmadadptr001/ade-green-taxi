'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchProvider } from '@/context/SearchContext';

export default function LayoutSearch({ children }) {
  const router = useRouter();
  const [querySearch, setQuerySearch] = useState('');

  useEffect(() => {
    const querySearchLocal = localStorage.getItem('query-search');
    if (!querySearchLocal) return;

    setQuerySearch(querySearchLocal);
  }, [querySearch])
  return (
    <SearchProvider querySearch={querySearch}>
        {children}
    </SearchProvider>
  );
}
