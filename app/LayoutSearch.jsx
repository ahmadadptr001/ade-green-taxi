"use client";
import React, { useEffect, useState } from "react";
import { SearchProvider } from "../context/SearchContext";
import { TooltipProvider } from "../components/ui/tooltip";
import { useLanguageStore } from "@/store/languageStore";

export default function LayoutSearch({ children }) {
  const [querySearch, setQuerySearch] = useState("");

  // Apply the persisted language after mount to avoid hydration mismatches.
  useEffect(() => {
    useLanguageStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const querySearchLocal = localStorage.getItem("query-search");
    if (!querySearchLocal) return;
    setQuerySearch(querySearchLocal);
  }, [querySearch]);
  return (
    <SearchProvider querySearch={querySearch}>
      <TooltipProvider>{children}</TooltipProvider>
    </SearchProvider>
  );
}
