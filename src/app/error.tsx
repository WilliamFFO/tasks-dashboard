'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div className="space-y-3">
        <Typography variant="h4">Something went wrong</Typography>
        <Typography color="text.secondary">An unexpected error occurred. Please try again.</Typography>
        <Button variant="contained" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
