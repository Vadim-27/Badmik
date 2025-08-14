import {Link} from '@/i18n/navigation';
import css from './EditButton.module.scss'; 
import { useTranslations } from 'next-intl';

interface EditButtonProps {
  href: string;
  label?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ href, label = 'Редагувати' }) => {
  const tUI = useTranslations('UI');
  return (
    <Link href={href} className={css.editButton}>
      ✏️ {tUI(label)}
    </Link>
  );
};

export default EditButton;
