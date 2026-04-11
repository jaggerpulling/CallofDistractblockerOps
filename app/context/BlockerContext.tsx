"use client"

import { createContext, useContext, useState } from "react"

const BlockerContext = createContext<any>(null)

export function BlockerProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  return (
    <BlockerContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </BlockerContext.Provider>
  )
}

export function useBlocker() {
  return useContext(BlockerContext)
}