

'use client';

import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
  
} from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ukUA, enUS } from '@mui/x-data-grid/locales';
import { useTranslations, useLocale } from 'next-intl';
import { useUsers } from '@/features/users/hooks/useUsers';
import type { User } from '@/services/types/users.dto';


function getAge(doB?: string | null): number | null {
  if (!doB) return null;
  const d = new Date(doB);
  if (Number.isNaN(d.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;

  return age >= 0 ? age : null;
}

type Row = {
  id: string;
  fullName: string;
  email: string;
  age: number | null;
  role: string;
  level: string;
  club: string; 
};

const UserTable: React.FC = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('UserTable');


  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({ items: [] });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);


  const { data, isLoading, isError, error } = useUsers();

  
 const rows = React.useMemo<Row[]>(() => {
  const list = (data ?? []).map((u: any) => {
    const age = getAge(u.doB ?? u.dateOfBirth);
  
    return {
      id: u.id,
      fullName: u.fullName ?? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
      email: u.email,
      age,
      role: u.role ?? '',
      level: u.level ?? '',
      club: '',
    };
  });
  return list;
}, [data]);

  const rowCount = rows.length;

  const handleRowClick = (params: any) => {
    const userId = params.id as string;
    router.push(`/${locale}/admin/players/${userId}`);
  };

  const displayOrDefault = (v: unknown) =>
  v === null || v === undefined || v === '' ? 'не обрано' : String(v);

const columns: GridColDef[] = [
  
  { field: 'fullName', headerName: t('fullName'), flex: 0.8, minWidth: 140 },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
  {
    field: 'age',
    headerName: t('age') ?? 'Age',
    flex: 0.3,
    minWidth: 70,
    headerAlign: 'left',   
    align: 'left', 
    type: 'number',
    sortable: false,
    renderCell: (params) => (params.row.age == null ? '' : `${params.row.age} років`),
  },
  { field: 'role', headerName: t('role'), flex: 0.4, minWidth: 90, renderCell: (params) => displayOrDefault(params.row.role), },
  { field: 'level', headerName: t('level'), flex: 0.4, minWidth: 90, renderCell: (params) => displayOrDefault(params.row.level), },
  { field: 'club', headerName: t('club'), flex: 0.4, minWidth: 90 },
];



  const localeText =
    locale === 'uk'
      ? ukUA.components.MuiDataGrid.defaultProps.localeText
      : enUS.components.MuiDataGrid.defaultProps.localeText;

  if (!mounted) return null;

  return (
    <Box
      sx={{
        height: 600,
        width: '99%',
        minWidth: 180,
        position: 'relative',
        '& .MuiDataGrid-root': { fontFamily: 'var(--font-geist-sans)' },
        '& [class*="MuiDataGridVariables"]': { '--DataGrid-t-header-background-base': '#D1D5DB' },
        '& .MuiDataGrid-columnHeaders': { color: '#000', fontWeight: 'bold', fontSize: '1rem' },
        '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        pagination
        paginationMode="client"       
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        onRowClick={handleRowClick}
        localeText={localeText}
        loading={isLoading}           
        disableRowSelectionOnClick
      />

      {isError && (
        <Typography
          variant="body2"
          color="error"
          sx={{ position: 'absolute', top: 8, right: 12 }}
          title={String((error as any)?.message ?? error)}
        >
          {t('loadError') ?? 'Помилка завантаження користувачів'}
        </Typography>
      )}
    </Box>
  );
};

export default UserTable;
