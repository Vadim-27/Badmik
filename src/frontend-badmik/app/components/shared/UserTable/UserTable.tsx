// 'use client';

// import * as React from 'react';
// import {
//   DataGrid,
//   GridColDef,
//   GridPaginationModel,
//   GridSortModel,
//   GridFilterModel,
// } from '@mui/x-data-grid';
// import { Box } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { usersFromMok } from '@/data/mockUsers';

// type User = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   level: string;
//   role: string;
//   club: string;
// };

// type UserTableProps = {};

// const UserTable: React.FC<UserTableProps> = () => {
//   const [users, setUsers] = React.useState<User[]>([]);
//   const [rowCount, setRowCount] = React.useState(0);

//   const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
//     page: 0,
//     pageSize: 10,
//   });

//   const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
//   const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
//     items: [],
//   });

//   const router = useRouter();

//   const handleRowClick = (params: any) => {
//     const userId = params.id;
//     router.push(`/admin/club-6/usersClub/${userId}`);
//   };

//   usersFromMok;

//   const fetchUsers = () => {
//     // const query = {
//     //   page: paginationModel.page + 1,
//     //   limit: paginationModel.pageSize,
//     //   sort: sortModel[0]?.field || '',
//     //   order: sortModel[0]?.sort || '',
//     //   filters: JSON.stringify(filterModel.items),
//     // };
//     // const searchParams = new URLSearchParams(query as any).toString();
//     // const res = await fetch(`/api/users?${searchParams}`);
//     // const json = await res.json();
//     // setUsers(json.data);
//     // setRowCount(json.total);
//     // setUsers(usersFromMok);
//     // setRowCount(usersFromMok.total);
//   };

//   React.useEffect(() => {
//     fetchUsers();
//   }, [paginationModel, sortModel, filterModel]);

//   const columns: GridColDef[] = [
//     { field: 'firstName', headerName: 'First Name', flex: 0.5, minWidth: 80 },
//     { field: 'lastName', headerName: 'Last Name', flex: 0.5, minWidth: 80 },
//     { field: 'level', headerName: 'Level', flex: 0.4, minWidth: 60 },
//     { field: 'role', headerName: 'Role', flex: 0.3, minWidth: 60 },
//     { field: 'club', headerName: 'Club', flex: 0.3, minWidth: 60 },
//   ];

//   // return (
//   //   <Box
//   //     sx={{
//   //       display: 'block',
//   //       height: 800,
//   //       width: '99%',
//   //       minWidth: 180,
//   //       '& .MuiDataGrid-root': {
//   //         fontFamily: 'var(--font-geist-sans)',
//   //       },
//   //       '& [class*="MuiDataGridVariables"]': {
//   //         '--DataGrid-t-header-background-base': '#f48b29',
//   //       },
//   //       '& .MuiDataGrid-root .MuiDataGrid-columnHeaders': {
//   //         //   backgroundColor: '#1e3a8a !important',
//   //         color: '#fff',
//   //         fontWeight: 'bold',
//   //         fontSize: '1rem',
//   //       },
//   //       '& .MuiDataGrid-row:hover': {
//   //         //   backgroundColor: '#1e3a8a',
//   //         cursor: 'pointer',
//   //       },
//   //     }}
//   //     //  sx={{ display: 'inline-flex', alignItems: 'center', height: 48, pl: 2 }}
//   //   >
      
//   //     {/* <div style={{ height: 800, width: '100%' }}>
//   //     <DataGrid
//   //       rows={users}
//   //       columns={columns}
//   //       rowCount={rowCount}
//   //       pagination
//   //       paginationMode="server"
//   //       sortingMode="server"
//   //       filterMode="server"
//   //       pageSizeOptions={[5, 10, 20]}
//   //       paginationModel={paginationModel}
//   //       onPaginationModelChange={setPaginationModel}
//   //       sortModel={sortModel}
//   //       onSortModelChange={setSortModel}
//   //       filterModel={filterModel}
//   //       onFilterModelChange={setFilterModel}
//   //     />
//   //     </div> */}
//   //     <div style={{ height: 400, width: '100%' }}>
//   //     {/* <div className="h-[600px] w-full"> */}
//   //     <DataGrid
//   //       rows={users}
//   //       columns={columns}
//   //       onRowClick={handleRowClick}
//   //       initialState={{
//   //         pagination: {
//   //           paginationModel: { pageSize: 10, page: 0 },
//   //         },
//   //       }}
//   //       pageSizeOptions={[5, 15, 20]}
//   //     />
//   //     </div>
//   //     {/* </div> */}
//   //   </Box>
//   // );

// };

// export default UserTable;
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

type User = {
  id: string;
  firstName: string;
  lastName: string;
  level: string;
  role: string;
  club: string;
};

const UserTable: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
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

    // Імітація API виклику (можеш замінити на реальний)
    setUsers(usersFromMok); // Можеш тут фільтрувати / пагінувати / сортувати
    setRowCount(usersFromMok.length); // Або total
  }, [paginationModel, sortModel, filterModel]);

  const handleRowClick = (params: any) => {
    const userId = params.id;
    router.push(`/${locale}/admin/club-6/usersClub/${userId}`);
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
          '--DataGrid-t-header-background-base': '#f48b29',
        },
        '& .MuiDataGrid-columnHeaders': {
          color: '#fff',
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
        sortingMode="server"
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

export default UserTable;