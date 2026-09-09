"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';

export function DatabaseSyncProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    DB.init().then(() => setIsSyncing(false));
  }, []);

  if (isSyncing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-mono">
        <div className="w-12 h-12 border-4 border-danger border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl tracking-widest animate-pulse">SYNCING CLOUD STATE...</p>
      </div>
    );
  }

  return <>{children}</>;
}
