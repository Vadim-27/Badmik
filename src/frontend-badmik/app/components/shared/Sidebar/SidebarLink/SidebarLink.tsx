
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

};

const SidebarLink = ({ href, children, open,  count}: Props) => {
  const pathname = usePathname();
  console.log("href", href);
  console.log("pathname", pathname);
  // const isActive = pathname === href;
  const pathnameWithoutLocale = pathname.replace(/^\/(uk|en)/, '');
  const isActive = pathnameWithoutLocale.startsWith(href);
  console.log("isActive", isActive);

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
