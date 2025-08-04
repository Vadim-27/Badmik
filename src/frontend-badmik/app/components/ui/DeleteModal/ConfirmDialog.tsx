import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
} from '@mui/material';

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Підтвердження',
  description = 'Ви дійсно хочете видалити?',
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 2  }}>
        <Button onClick={onConfirm} color="error" variant="contained">Так</Button>
        <Button onClick={onClose} variant="outlined">Ні</Button>
        
      </DialogActions>
    </Dialog>
  );
};
