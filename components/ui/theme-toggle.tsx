'use client';

import { useTheme } from 'next-themes';
import { Button } from './button';
import { Moon, Sun } from 'lucide-react';
import { PermissionType } from '@prisma/client';
import { hasPermission } from '@/components/layout/Navigation/utils';
import { CAN_MANAGE_UI } from '@/lib/constants/permissions';

interface ThemeToggleProps {
  permissions: { type: PermissionType }[];
}

export const ThemeToggle = ({ permissions }: ThemeToggleProps) => {
  const { setTheme, theme } = useTheme();

  const canChangeTheme = permissions.some((p) =>
    CAN_MANAGE_UI.includes(p.type)
  );

  if (!canChangeTheme) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
