'use client';

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  AlertTriangle,
  FileText,
  Shield,
  Smartphone,
  Settings,
  Map,
  Route,
  UserCircle2,
  type LucideIcon
} from 'lucide-react';

export type IconsType = keyof typeof Icons;

export const Icons = {
  // Navigation Icons
  dashboard: LayoutDashboard,
  clients: Users,
  overview: Building2,
  incident: AlertTriangle,
  report: FileText,
  guard: Shield,
  guards: Shield,
  device: Smartphone,
  devices: Smartphone,
  settings: Settings,
  location: Map,
  locations: Map,
  patrol: Route,
  patrols: Route,
  user: UserCircle2,

  // UI Icons
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight
} satisfies Record<string, LucideIcon>;
