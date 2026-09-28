'use client';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Brand } from './Brand';

type Mode = 'login' | 'register';

export function LoginForm() {
  const { session, ready, signIn } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && session) router.replace('/');
  }, [ready, session, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const s = mode === 'login' ? await api.login(email, password) : await api.register(name, email, password);
      signIn(s);
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  const isRegister = mode === 'register';

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-8">
      <Card className="w-full max-w-[420px] p-6 sm:p-8">
        <Brand />
        <Typography variant="h5" component="h1" fontWeight={700} className="!mt-5">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </Typography>
        <Typography color="text.secondary" className="!mb-4 !mt-1">
          {isRegister ? 'Create a free account to start organizing your tasks.' : 'Sign in to manage your tasks.'}
        </Typography>

        <Tabs
          value={mode}
          onChange={(_, v: Mode) => {
            setMode(v);
            setError('');
          }}
          variant="fullWidth"
          className="!mb-4"
          aria-label="Authentication mode"
        >
          <Tab value="login" label="Sign in" />
          <Tab value="register" label="Create account" />
        </Tabs>

        <form onSubmit={submit} className="grid gap-4" noValidate={false}>
          {error && <Alert severity="error">{error}</Alert>}
          {isRegister && (
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" slotProps={{ htmlInput: { minLength: 2 } }} />
          )}
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            helperText={isRegister ? 'At least 8 characters' : undefined}
            slotProps={{
              htmlInput: { minLength: isRegister ? 8 : 1 },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button type="submit" variant="contained" size="large" loading={busy}>
            {isRegister ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        {process.env.NEXT_PUBLIC_DEMO_HINT === 'true' && (
          <Alert severity="info" className="!mt-4">
            Demo account: <strong>demo@example.com</strong> / <strong>Demo-pass123</strong>
          </Alert>
        )}
      </Card>
    </main>
  );
}
