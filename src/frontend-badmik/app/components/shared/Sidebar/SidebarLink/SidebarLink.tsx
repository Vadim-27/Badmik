
'use client';
import {Link} from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import css from './SidebarLink.module.scss';

type Props = {
  href: string;
  children: React.ReactNode;
  open: boolean;
};

const SidebarLink = ({ href, children, open }: Props) => {
  const pathname = usePathname();
  
  const isActive = pathname === href;
  

  return (
    <Link
      href={href}
      className={classNames(css.link, { [css.active]: isActive })}
    >
      {open ? children : <span>{children}</span>}
    </Link>
  );
};

export default SidebarLink;
