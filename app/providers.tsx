'use client';

import { CloudProvider } from '@/cloud/useCloud';

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <CloudProvider>
      {children}
    </CloudProvider>
  );
}
