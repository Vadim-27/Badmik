
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


type User = {
  id: string;
  firstName: string;
  lastName: string;
  level: string;
  role: string;
  club: string;
};

type UserTableProps = {};

const UserTable: React.FC<UserTableProps> = () => {
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

   const router = useRouter();

  const handleRowClick = (params: any) => {
    const userId = params.id; 
    router.push(`/admin/club-6/usersClub/${userId}`);
  };

usersFromMok
 
  const fetchUsers =  () => {
    // const query = {
    //   page: paginationModel.page + 1, 
    //   limit: paginationModel.pageSize,
    //   sort: sortModel[0]?.field || '',
    //   order: sortModel[0]?.sort || '',
    //   filters: JSON.stringify(filterModel.items),
    // };

    // const searchParams = new URLSearchParams(query as any).toString();
    // const res = await fetch(`/api/users?${searchParams}`);
    // const json = await res.json();
    // setUsers(json.data);
    // setRowCount(json.total);
    // setUsers(usersFromMok);
    // setRowCount(usersFromMok.total);
  };

  React.useEffect(() => {
    fetchUsers();
  }, [paginationModel, sortModel, filterModel]);

  const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First Name', flex: 0.5, minWidth: 80 },
  { field: 'lastName', headerName: 'Last Name', flex: 0.5, minWidth: 80 },
  { field: 'level', headerName: 'Level', flex: 0.4, minWidth: 60 },
  { field: 'role', headerName: 'Role', flex: 0.3, minWidth: 60 },
  { field: 'club', headerName: 'Club', flex: 0.3, minWidth: 60 },
];

  

  return (
    <Box 
        sx={{
    height: 800,
    width: '99%',
    minWidth: 180,
    '& .MuiDataGrid-root': {
      fontFamily: 'var(--font-geist-sans)',
    },
     '& [class*="MuiDataGridVariables"]': {
      '--DataGrid-t-header-background-base': '#f48b29',
    },
    '& .MuiDataGrid-root .MuiDataGrid-columnHeaders': {
    //   backgroundColor: '#1e3a8a !important',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    '& .MuiDataGrid-row:hover': {
    //   backgroundColor: '#1e3a8a',
      cursor: 'pointer',
    },
  }}
    //  sx={{ display: 'inline-flex', alignItems: 'center', height: 48, pl: 2 }}
    >
      {/* <DataGrid
        rows={users}
        columns={columns}
        rowCount={rowCount}
        pagination
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        pageSizeOptions={[5, 10, 20]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
      /> */}
       {/* <div style={{ height: 700, width: '100%' }}> */}
      <DataGrid
        rows={usersFromMok.map((user) => ({ ...user, id: user.id }))}
        columns={columns}
        pageSize={10}
         onRowClick={handleRowClick} 
        rowsPerPageOptions={[5, 15, 20]}
       
      />
    {/* </div> */}
    </Box>
  );
};

export default UserTable;
