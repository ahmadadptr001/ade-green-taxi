'use client'
import { createContext, useContext } from 'react'

const SearchContext = createContext(null)
export const useSearch = () => useContext(SearchContext)

export function SearchProvider({ querySearch, children }) {
  return (
    <SearchContext.Provider value={querySearch}>
      {children}
    </SearchContext.Provider>
  )
}
