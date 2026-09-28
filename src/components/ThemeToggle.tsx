'use client';

import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useColorScheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const NEXT = { light: 'dark', dark: 'system', system: 'light' } as const;
const LABEL = { light: 'Light theme', dark: 'Dark theme', system: 'System theme' } as const;

export function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Avoid a hydration mismatch: the stored mode is only known on the client.
  if (!mounted || !mode) return <span className="inline-block size-10" aria-hidden />;

  const Icon = mode === 'light' ? LightModeIcon : mode === 'dark' ? DarkModeIcon : BrightnessAutoIcon;
  return (
    <Tooltip title={`${LABEL[mode]} (click to change)`}>
      <IconButton aria-label={LABEL[mode]} onClick={() => setMode(NEXT[mode])}>
        <Icon />
      </IconButton>
    </Tooltip>
  );
}
