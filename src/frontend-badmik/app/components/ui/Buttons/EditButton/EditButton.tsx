import Link from 'next/link';
import css from './EditButton.module.scss'; // шлях до SCSS

interface EditButtonProps {
  href: string;
  label?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ href, label = 'Редагувати' }) => {
  return (
    <Link href={href} className={css.editButton}>
      ✏️ {label}
    </Link>
  );
};

export default EditButton;
