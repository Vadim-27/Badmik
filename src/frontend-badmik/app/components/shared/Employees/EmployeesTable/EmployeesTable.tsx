
'use client';

import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
} from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { usersFromMok } from '@/data/mockUsers';
import { ukUA, enUS } from '@mui/x-data-grid/locales';
import { useTranslations, useLocale } from 'next-intl';
// import { slugify } from '@/utils/slugify';

type Employees = {
  id: string;
  firstName: string;
  lastName: string;
  level: string;
  role: string;
  club?: string;
};

const EmployeesTable: React.FC = () => {
  const [users, setUsers] = React.useState<Employees[]>([]);
  const [rowCount, setRowCount] = React.useState(0);

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });

  const [mounted, setMounted] = React.useState(false);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('UserTable');

  React.useEffect(() => {
    setMounted(true);

    
    setUsers(usersFromMok); 
    setRowCount(usersFromMok.length); 
  }, [paginationModel, sortModel, filterModel]);

  const handleRowClick = (params: any) => {
    const employeeId = params.id;
  // const clubName = params.row.club;   
  // const clubSlug = slugify(clubName); 
    router.push(`/${locale}/admin/access-control/${employeeId}`);
  };

   const columns: GridColDef[] = [
    { field: 'firstName', headerName: t('firstName'), flex: 0.5, minWidth: 80 },
    { field: 'lastName', headerName: t('lastName'), flex: 0.5, minWidth: 80 },
    { field: 'level', headerName: t('level'), flex: 0.4, minWidth: 60 },
    { field: 'role', headerName: t('role'), flex: 0.3, minWidth: 60 },
    { field: 'club', headerName: t('club'), flex: 0.3, minWidth: 60 },
  ];

  const localeText = locale === 'uk'
    ? ukUA.components.MuiDataGrid.defaultProps.localeText
    : enUS.components.MuiDataGrid.defaultProps.localeText;

  if (!mounted) return null; 

  return (
    <Box
      sx={{
        height: 600,
        width: '99%',
        minWidth: 180,
        '& .MuiDataGrid-root': {
          fontFamily: 'var(--font-geist-sans)',
        },
        '& [class*="MuiDataGridVariables"]': {
          '--DataGrid-t-header-background-base': '#D1D5DB',
        },
        '& .MuiDataGrid-columnHeaders': {
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '1rem',
        },
        '& .MuiDataGrid-row:hover': {
          cursor: 'pointer',
        },
      }}
    >
      <DataGrid
        rows={users}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        // sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        onRowClick={handleRowClick}
        localeText={localeText}
      />
    </Box>
  );
};

export default EmployeesTable