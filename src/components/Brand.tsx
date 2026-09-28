import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Typography from '@mui/material/Typography';

export function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-[10px] bg-[var(--mui-palette-primary-main)] text-white">
        <TaskAltIcon fontSize="small" />
      </span>
      <Typography variant="h6" component="span">
        Tasks
      </Typography>
    </div>
  );
}
