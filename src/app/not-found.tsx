import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div className="space-y-3">
        <Typography variant="h4">Page not found</Typography>
        <Typography color="text.secondary">The page you are looking for does not exist.</Typography>
        <Button component={Link} href="/" variant="contained">
          Back to dashboard
        </Button>
      </div>
    </main>
  );
}
