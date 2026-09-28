import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { Task, TaskPriority, TaskStatus } from '@/lib/api';
import { formatDate, isOverdue, PRIORITY_LABEL, STATUS_LABEL } from '@/lib/format';

const STATUS_COLOR: Record<TaskStatus, 'default' | 'warning' | 'success'> = {
  todo: 'default',
  in_progress: 'warning',
  done: 'success',
};
const PRIORITY_COLOR: Record<TaskPriority, 'info' | 'warning' | 'error'> = {
  low: 'info',
  medium: 'warning',
  high: 'error',
};

interface Props {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function Badges({ task }: { task: Task }) {
  return (
    <>
      <Chip size="small" label={STATUS_LABEL[task.status]} color={STATUS_COLOR[task.status]} variant="outlined" />
      <Chip size="small" label={PRIORITY_LABEL[task.priority]} color={PRIORITY_COLOR[task.priority]} variant="outlined" />
    </>
  );
}

function Actions({ task, onEdit, onDelete }: Omit<Props, 'tasks' | 'onToggle'> & { task: Task }) {
  return (
    <>
      <Tooltip title="Edit">
        <IconButton size="small" aria-label={`Edit "${task.title}"`} onClick={() => onEdit(task)}>
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" color="error" aria-label={`Delete "${task.title}"`} onClick={() => onDelete(task)}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
}

export function TaskTable({ tasks, onToggle, onEdit, onDelete }: Props) {
  const toggleLabel = (t: Task) => `Mark "${t.title}" as ${t.status === 'done' ? 'not done' : 'done'}`;

  return (
    <>
      {/* Tablet and desktop: table */}
      <TableContainer component={Paper} variant="outlined" className="hidden md:block">
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Task</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Due</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox checked={t.status === 'done'} onChange={() => onToggle(t)} slotProps={{ input: { 'aria-label': toggleLabel(t) } }} />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} className={t.status === 'done' ? 'line-through opacity-60' : ''}>
                    {t.title}
                  </Typography>
                  {t.description && (
                    <Typography variant="body2" color="text.secondary" noWrap className="max-w-md">
                      {t.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip size="small" label={STATUS_LABEL[t.status]} color={STATUS_COLOR[t.status]} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip size="small" label={PRIORITY_LABEL[t.priority]} color={PRIORITY_COLOR[t.priority]} variant="outlined" />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Typography variant="body2" color={isOverdue(t) ? 'error' : 'text.secondary'} fontWeight={isOverdue(t) ? 700 : 400}>
                    {formatDate(t.dueDate)}
                  </Typography>
                </TableCell>
                <TableCell align="right" className="whitespace-nowrap">
                  <Actions task={t} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phones: cards */}
      <ul className="space-y-3 md:hidden">
        {tasks.map((t) => (
          <li key={t.id}>
            <Paper variant="outlined" className="p-3">
              <div className="flex items-start gap-1">
                <Checkbox className="!-mt-1 !-ml-2" checked={t.status === 'done'} onChange={() => onToggle(t)} slotProps={{ input: { 'aria-label': toggleLabel(t) } }} />
                <div className="min-w-0 flex-1">
                  <Typography fontWeight={600} className={t.status === 'done' ? 'line-through opacity-60' : ''}>
                    {t.title}
                  </Typography>
                  {t.description && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {t.description}
                    </Typography>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badges task={t} />
                    <Typography variant="body2" color={isOverdue(t) ? 'error' : 'text.secondary'} fontWeight={isOverdue(t) ? 700 : 400}>
                      {formatDate(t.dueDate)}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="mt-1 flex justify-end">
                <Actions task={t} onEdit={onEdit} onDelete={onDelete} />
              </div>
            </Paper>
          </li>
        ))}
      </ul>
    </>
  );
}
