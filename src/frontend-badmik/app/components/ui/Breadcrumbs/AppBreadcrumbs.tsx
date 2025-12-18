// 'use client';
// import React from 'react';
// import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Link from 'next/link';
// import Typography from '@mui/material/Typography';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// type Crumb = {
//   label: string;
//   href?: string; 
// };

// type Props = {
//   items: Crumb[];
//   className?: string;
// };

// export default function AppBreadcrumbs({ items, className }: Props) {
//   return (
//     <Breadcrumbs
//       className={className}
//       separator={<NavigateNextIcon fontSize="small" />}
//       aria-label="breadcrumb"
//       sx={{
//         '& .MuiBreadcrumbs-li': { fontSize: '0.95rem' },
//         '& a': {
//           color: 'var(--text-muted, #1e3a8a)',
//           textDecoration: 'none',
//           fontWeight: 500,
//           '&:hover': { textDecoration: 'underline' },
//         },
//       }}
//     >
//       {items.map((item, idx) =>
//         item.href ? (
//           <Link key={idx} href={item.href}>
//             {item.label}
//           </Link>
//         ) : (
//           <Typography key={idx} color="text.primary" fontWeight={600}>
//             {item.label}
//           </Typography>
//         )
//       )}
//     </Breadcrumbs>
//   );
// }

//============================= IGNORE BELOW THIS LINE ============================


// AppBreadcrumbs.tsx (SERVER component) — без "use client"
import Link from 'next/link';
import styles from './AppBreadcrumbs.module.scss';

type Crumb = { label: string; href?: string };

export default function AppBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" className={styles.root}>
      <ol className={styles.list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className={styles.item}>
              {item.href && !isLast ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current}>{item.label}</span>
              )}
              {!isLast && <span className={styles.sep}>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

