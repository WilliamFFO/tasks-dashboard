'use client';

import LogoutIcon from '@mui/icons-material/Logout';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { Brand } from './Brand';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  userName: string;
  onSignOut: () => void;
}

export function AppHeader({ userName, onSignOut }: Props) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} className="border-b border-[var(--mui-palette-divider)] !bg-[var(--mui-palette-background-default)]/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Brand />
        <div className="flex items-center gap-1 sm:gap-3">
          <span className="hidden max-w-40 truncate text-sm text-[var(--mui-palette-text-secondary)] sm:inline">{userName}</span>
          <ThemeToggle />
          <Button size="small" variant="outlined" color="inherit" startIcon={<LogoutIcon />} onClick={onSignOut}>
            <span className="hidden sm:inline">Sign out</span>
            <span className="sm:hidden sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </AppBar>
  );
}
