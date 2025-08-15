import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

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

  const t = useTranslations('ConfirmDialog');
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 2  }}>
        <Button onClick={onConfirm} color="error" variant="contained">{t('confirm')}</Button>
        <Button onClick={onClose} variant="outlined">{t('cancel')}</Button>
        
      </DialogActions>
    </Dialog>
  );
};
