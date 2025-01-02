'use client';

import * as React from 'react';
import {
  LucideProps,
  User,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideIcon
} from 'lucide-react';

interface IconsType {
  user: LucideIcon;
  logout: LucideIcon;
  settings: LucideIcon;
  chevronLeft: LucideIcon;
  chevronRight: LucideIcon;
  spinner: React.FC<LucideProps>;
}

export const Icons: IconsType = {
  user: User,
  logout: LogOut,
  settings: Settings,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  spinner: (props: LucideProps): React.JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
};

export type Icon = keyof typeof Icons;
