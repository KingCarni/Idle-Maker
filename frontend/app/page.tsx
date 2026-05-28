'use client';

import dynamic from 'next/dynamic';
import { AppProvider } from '@/components/AppContext';

// AppShell uses window-level effects (cursor) — render client-side only
const AppShell = dynamic(() => import('@/components/AppShell'), { ssr: false });

export default function HomePage() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
