"use client"

import { HomeInner } from '@/components/HomeInner'
import { ConfigProvider } from '@/hooks/useConfig'
import { ConnectionProvider } from '@/hooks/useConnection'

export default function Home() {
  return (
    <ConfigProvider>
      <ConnectionProvider>
        <HomeInner />
      </ConnectionProvider>
    </ConfigProvider>
  )
}
