import { useState, useEffect } from 'react';

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setOrigin(window.location.origin);
    }
    setMounted(true);
  }, []);

  return mounted ? origin : '';
};
