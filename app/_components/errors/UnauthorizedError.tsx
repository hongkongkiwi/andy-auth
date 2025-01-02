'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const UnauthorizedError = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/unauthorized');
  }, [router]);

  return null;
};
