import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type { TaskPriority, TaskStatus } from '@/lib/api';
import type { Filters } from '@/lib/useTasks';

interface Props {
  filters: Filters;
  onChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}

export function TaskFilters({ filters, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_170px_170px]">
      <TextField
        className="col-span-2 sm:col-span-1"
        placeholder="Search tasks…"
        value={filters.search}
        onChange={(e) => onChange('search', e.target.value)}
        slotProps={{
          htmlInput: { 'aria-label': 'Search tasks' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      <FormControl size="small">
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          label="Status"
          value={filters.status}
          onChange={(e) => onChange('status', e.target.value as TaskStatus | '')}
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="todo">To do</MenuItem>
          <MenuItem value="in_progress">In progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small">
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          labelId="priority-label"
          label="Priority"
          value={filters.priority}
          onChange={(e) => onChange('priority', e.target.value as TaskPriority | '')}
        >
          <MenuItem value="">All priorities</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
