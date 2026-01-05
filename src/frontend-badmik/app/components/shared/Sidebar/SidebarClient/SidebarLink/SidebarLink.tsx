
'use client';
import {Link} from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import css from './SidebarLink.module.scss';

type Props = {
  href: string;
  children: React.ReactNode;
  open: boolean;
  count?: number;
  exact?: boolean;
};

const SidebarLink = ({ href, children, open, exact , count}: Props) => {
  const pathname = usePathname();
 
  const normalize = (s: string) => s.replace(/\/+$/, '');
  // const isActive = pathname === href;
  const pathnameWithoutLocale = pathname.replace(/^\/(uk|en)/, '');
  // const isActive = pathnameWithoutLocale.startsWith(href);
   const cur = normalize(pathnameWithoutLocale);
  const target = normalize(href);

  const isActive = exact
    ? cur === target
    : cur === target || cur.startsWith(target + '/');
  

  return (
    <Link
      href={href}
      className={classNames(css.navItem, { [css.active]: isActive })}
    >
      {/* {open && ( */}
        <>
      {open ? children : <span >{children}</span>}
      {/* {open && count !== undefined && <span className={css.count}>{count}</span>} */}
      </>
    {/* )} */}
    </Link>
  );
};

export default SidebarLink;
