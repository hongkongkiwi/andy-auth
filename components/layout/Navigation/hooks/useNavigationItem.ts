import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { NavigationLink } from '../types';
import { useNavigationContext } from './useNavigationContext';
import { useClient } from '@/components/layout/ClientSwitcher/hooks/useClient';

export const useNavigationItem = (item: NavigationLink) => {
  const router = useRouter();
  const pathname = usePathname();
  const { onSelect } = useNavigationContext();
  const { selectedClient } = useClient();

  const isActive = useCallback(() => {
    if (!pathname || !item.href) return false;

    // Replace any remaining [clientId] placeholders with actual ID
    const resolvedHref = selectedClient
      ? item.href.replace(/\[clientId\]/g, selectedClient.id.toString())
      : item.href;

    // Handle root path
    if (resolvedHref === '/') {
      return pathname === '/';
    }

    // Handle client-specific paths
    const normalizedPath = pathname.replace(/\/+$/, '');
    const normalizedHref = resolvedHref.replace(/\/+$/, '');

    return (
      normalizedPath === normalizedHref ||
      normalizedPath.startsWith(`${normalizedHref}/`)
    );
  }, [pathname, item.href, selectedClient]);

  const handleClick = useCallback(() => {
    if (item.disabled) return;

    onSelect?.(item);

    if (item.external) {
      window.open(item.href, '_blank');
      return;
    }

    // Replace [clientId] in href before navigation
    const targetHref = selectedClient
      ? item.href.replace(/\[clientId\]/g, selectedClient.id.toString())
      : item.href;

    router.push(targetHref);
  }, [item, router, onSelect, selectedClient]);

  return {
    handleClick,
    isActive: isActive(),
    isDisabled: item.disabled
  };
};
