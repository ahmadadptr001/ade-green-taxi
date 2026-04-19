'use client'
import { createContext, useContext } from 'react'

const UserContext = createContext(null)
export const useUser = () => useContext(UserContext)

export function UserProvider({ user, children }) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}
