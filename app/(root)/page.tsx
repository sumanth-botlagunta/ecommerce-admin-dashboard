'use client';
import { useState, useEffect } from 'react';

import { useStoreModal } from '@/hooks/useStore-modal';

export default function Home() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return <div className="p-4 text-lg font-bold">Root Page</div>;
}
