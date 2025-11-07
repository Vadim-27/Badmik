'use client';
import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

type Crumb = {
  label: string;
  href?: string; 
};

type Props = {
  items: Crumb[];
  className?: string;
};

export default function AppBreadcrumbs({ items, className }: Props) {
  return (
    <Breadcrumbs
      className={className}
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{
        '& .MuiBreadcrumbs-li': { fontSize: '0.95rem' },
        '& a': {
          color: 'var(--text-muted, #1e3a8a)',
          textDecoration: 'none',
          fontWeight: 500,
          '&:hover': { textDecoration: 'underline' },
        },
      }}
    >
      {items.map((item, idx) =>
        item.href ? (
          <Link key={idx} href={item.href}>
            {item.label}
          </Link>
        ) : (
          <Typography key={idx} color="text.primary" fontWeight={600}>
            {item.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
