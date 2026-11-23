// Utils
export { cn } from './lib/utils';

// Core UI Components
export { Button, buttonVariants } from './components/button';
export type { ButtonProps } from './components/button';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/card';

export { Input } from './components/input';
export type { InputProps } from './components/input';

export { Badge, badgeVariants } from './components/badge';
export type { BadgeProps } from './components/badge';

export { ThemeSwitcher, PRESET_OPTIONS } from './components/theme-switcher';
export type { ThemePresetOption, ThemeSwitcherProps } from './components/theme-switcher';

export { AdminDashboard } from './components/admin-dashboard';
export type { AdminTelemetryEvent, AdminDashboardProps } from './components/admin-dashboard';

export { Tabs } from './components/tabs';
export type { TabItem, TabsProps } from './components/tabs';

export { Dialog } from './components/dialog';
export type { DialogProps } from './components/dialog';

export { Progress } from './components/progress';
export type { ProgressProps } from './components/progress';

// Appearance & Layout Management (SYS-THM-07 & Workspace Customization)
export { LayoutProvider, useLayout, LayoutManager } from './components/layout-manager';
export type {
  LayoutConfig,
  LayoutDensity,
  LayoutWidth,
  NavStyle,
  SurfaceStyle,
  LayoutManagerProps,
} from './components/layout-manager';

export { AppearanceManager } from './components/appearance-manager';
export type { AppearanceManagerProps } from './components/appearance-manager';

export { AppShell, ECOSYSTEM_APPS } from './components/app-shell';
export type { AppShellProps, AppConfig } from './components/app-shell';
