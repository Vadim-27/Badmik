


// 'use client';

// import * as React from 'react';
// import { Link } from '@/i18n/navigation';
// import {
//   DataGrid,
//   GridColDef,
//   GridPaginationModel,
//   GridSortModel,
//   GridFilterModel,
// } from '@mui/x-data-grid';
// import { Box, Typography } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { ukUA, enUS } from '@mui/x-data-grid/locales';
// import { useTranslations, useLocale } from 'next-intl';
// import { useStaff } from '@/features/staff/hooks/useStaff';
// import type { Staff } from '@/services/types/staff.dto';



// // ---- helpers & types --------------------------------------------------------

// const EMPTY_LABEL = 'дані ще не заповнені';

// const displayOrDefault = (v: unknown) => {
//   if (v === null || v === undefined) return EMPTY_LABEL;
//   const s = String(v);
//   return s.trim() === '' ? EMPTY_LABEL : s;
// };

// const toNameCase = (s?: string) =>
//   (s ?? '')
//     .trim()
//     .toLocaleLowerCase('uk-UA')
//     .replace(/(^|\s|-)\p{L}/gu, (m) => m.toLocaleUpperCase('uk-UA'));

// const fullName = (first?: string, last?: string) => {
//   const f = (first ?? '').trim();
//   const l = (last ?? '').trim();
//   if (!f && !l) return EMPTY_LABEL;
//   return `${f}${f && l ? ' ' : ''}${l}`;
// };

// type StaffFromApi = Staff & Partial<{
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   title: string;
//   staffStatus: string;
//   employmentType: string;
//   salaryType: 'Salary' | 'Hourly' | 'PerTraining' | string;
//   monthlySalary: number;
//   hourlyRate: number;
//   perTrainingRate: number;
//   currency: string;
// }>;

// // Якщо у Staff нема цих полів у типах — розширюємо локально
// type StaffPayroll = Staff &
//   Partial<{
//     monthlySalary: number;
//     hourlyRate: number;
//     perTrainingRate: number;
//     salaryType: 'Salary' | 'Hourly' | 'PerTraining' | string;
//   }>;
//   type StaffApiResponse = StaffFromApi[] | { list?: StaffFromApi[]; total?: number };

// function calcSum(u: StaffPayroll): number | null {
//   switch (u.salaryType) {
//     case 'Salary':
//       return typeof u.monthlySalary === 'number' ? u.monthlySalary : null;
//     case 'Hourly':
//       return typeof u.hourlyRate === 'number' ? u.hourlyRate : null;
//     case 'PerTraining':
//       return typeof u.perTrainingRate === 'number' ? u.perTrainingRate : null;
//     default:
//       return null;
//   }
// }

// // Рядок таблиці — чіткий тип без any
// type Row = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   FIO: string;
//   email: string;
//   phoneNumber: string;
//   title: string;
//   staffStatus: string;
//   employmentType: string;
//   salaryType: string;
//   sum: number | null;
//   currency: string;
// };

// // ---------------------------------------------------------------------------

// const StaffTable: React.FC = () => {
//   const router = useRouter();
//   const locale = useLocale();
//   const t = useTranslations('UserTable');

//   const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
//     page: 0,
//     pageSize: 10,
//   });
//   const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
//   const [filterModel, setFilterModel] = React.useState<GridFilterModel>({ items: [] });
//   const [mounted, setMounted] = React.useState(false);
//   React.useEffect(() => setMounted(true), []);


//   //===================


  
//   //===================

//   const { data, isLoading, isError, error } = useStaff();
//   console.log(" data staff:", data );

//   const items: StaffFromApi[] = React.useMemo(() => {
//   const d = data as StaffApiResponse | undefined;

//   if (Array.isArray(d)) return d;                 // формат: масив
//   if (d && Array.isArray(d.list)) return d.list;  // формат: { list: [...] }
//   return [];                                      // все інше -> порожній список
// }, [data]);

//   // Трансформація даних у рядки таблиці — без any
//  const rows = React.useMemo<Row[]>(() => {
//   return items.map((u) => {
//     const sum = calcSum(u);
//     return {
//       id: u.id,
//       firstName: u.firstName ?? '',
//       lastName: u.lastName ?? '',
//       FIO: fullName(u.firstName, u.lastName),
//       email: u.email ?? '',
//       phoneNumber: u.phoneNumber ?? '',
//       title: u.title ?? '',
//       staffStatus: u.staffStatus ?? '',
//       employmentType: u.employmentType ?? '',
//       salaryType: u.salaryType ?? '',
//       sum,
//       currency: u.currency ?? '',
//     };
//   });
// }, [items]);

//   const left = { headerAlign: 'left' as const, align: 'left' as const };

//   // Колонки — типізуємо як GridColDef<Row>
//   const columns: GridColDef<Row>[] = [
//     {
//       field: 'FIO',
//       headerName: 'ФІО',
//       ...left,
//       flex: 0.4,
//       minWidth: 120,
//       sortable: false,
//       cellClassName: 'fioCell',
//       renderCell: ({ row }: { row: Row }) => {
//         const first = toNameCase(row.firstName);
//         const last = toNameCase(row.lastName);
//         const hasAny = (first && first.trim()) || (last && last.trim());
//         return (
//           <Link href={`/admin/access-control/${row.id}`} className="fioStack">
//             <span>{hasAny ? first || EMPTY_LABEL : EMPTY_LABEL}</span>
//             {hasAny && <span>{last || EMPTY_LABEL}</span>}
//           </Link>
//         );
//       },
//     },
//     {
//       field: 'email',
//       headerName: 'Email',
//       ...left,
//       flex: 0.6,
//       minWidth: 160,
//       renderCell: ({ row }: { row: Row }) => displayOrDefault(row.email),
//     },
//     {
//       field: 'phoneNumber',
//       headerName: 'Телефон',
//       ...left,
//       flex: 0.4,
//       minWidth: 120,
//       renderCell: ({ row }: { row: Row }) => displayOrDefault(row.phoneNumber),
//     },
//     {
//       field: 'title',
//       headerName: 'Посада',
//       ...left,
//       flex: 0.4,
//       minWidth: 120,
//       renderCell: ({ row }: { row: Row }) => displayOrDefault(row.title),
//     },
//     {
//       field: 'staffStatus',
//       headerName: 'Статус',
//       ...left,
//       flex: 0.35,
//       minWidth: 110,
//       renderCell: ({ row }: { row: Row }) => displayOrDefault(row.staffStatus),
//     },
//     {
//       field: 'employmentType',
//       headerName: 'Оформлення',
//       ...left,
//       flex: 0.4,
//       minWidth: 130,
//       renderCell: ({ row }: { row: Row }) => displayOrDefault(row.employmentType),
//     },
//     {
//       field: 'salaryType',
//       headerName: 'Вид оплати',
//       ...left,
//       flex: 0.4,
//       minWidth: 130,
//       renderCell: ({ row }: { row: Row }) => displayOrDefault(row.salaryType),
//     },
//     {
//       field: 'sum',
//       headerName: 'Сума',
//       type: 'number',
//       ...left,
//       flex: 0.35,
//       minWidth: 110,
//       sortable: false,
//       renderCell: ({ row }: { row: Row }) => (row.sum == null ? '—' : String(row.sum)),
//     },
//     {
//       field: 'currency',
//       headerName: 'Валюта',
//       ...left,
//       flex: 0.3,
//       minWidth: 100,
//       renderCell: ({ row }: { row: Row }) => displayOrDefault(row.currency),
//     },
//   ];

//   const localeText =
//     locale === 'uk'
//       ? ukUA.components.MuiDataGrid.defaultProps.localeText
//       : enUS.components.MuiDataGrid.defaultProps.localeText;

//   if (!mounted) return null;

//   return (
//     <Box
//       sx={{
//         width: '99%',
//         minWidth: 180,
//         position: 'relative',
//         '& .MuiDataGrid-root': { fontFamily: 'var(--font-geist-sans)' },
//         '& [class*="MuiDataGridVariables"]': { '--DataGrid-t-header-background-base': '#D1D5DB' },
//         '& .MuiDataGrid-columnHeaders': { color: '#000', fontWeight: 'bold', fontSize: '1rem' },
//         '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
//       }}
//     >
//       <DataGrid
//         autoHeight
//         getRowHeight={() => 74}
//         sx={{
//           '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': { textAlign: 'left' },
//           '& .MuiDataGrid-columnHeaderTitleContainer': { justifyContent: 'flex-start' },
//           '& .fioCell': {
//             display: 'flex',
//             alignItems: 'center',
//           },
//           '& .fioCell .fioStack': {
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             gap: '10px',
//             width: '100%',
//             lineHeight: 1.15,
//           },
//           '& .fioCell .fioStack span': {
//             whiteSpace: 'nowrap',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//           },
//         }}
//         rows={rows}
//         getRowId={(r: Row) => r.id}
//         columns={columns}
//         pageSizeOptions={[5, 10, 20]}
//         pagination
//         paginationMode="client"
//         paginationModel={paginationModel}
//         onPaginationModelChange={setPaginationModel}
//         sortModel={sortModel}
//         onSortModelChange={setSortModel}
//         filterModel={filterModel}
//         onFilterModelChange={setFilterModel}
//         localeText={localeText}
//         loading={isLoading}
//         disableRowSelectionOnClick
//       />

//       {isError && (
//         <Typography
//           variant="body2"
//           color="error"
//           sx={{ position: 'absolute', top: 8, right: 12 }}
//           title={String((error as unknown as Error)?.message ?? error)}
//         >
//           {t('loadError') ?? 'Помилка завантаження співробітників'}
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default StaffTable;


//==========================================

'use client';

import * as React from 'react';
import { Link } from '@/i18n/navigation';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
  type GridFilterModel,
} from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ukUA, enUS } from '@mui/x-data-grid/locales';
import { useTranslations, useLocale } from 'next-intl';

// ⬇️ нові хуки (джерело даних)
import { useStaffList } from '@/services/staff/queries.client';
import type { Staff } from '@/services/types/staff.dto';

// ---- helpers & types --------------------------------------------------------

const EMPTY_LABEL = 'дані ще не заповнені';

const displayOrDefault = (v: unknown) => {
  if (v === null || v === undefined) return EMPTY_LABEL;
  const s = String(v);
  return s.trim() === '' ? EMPTY_LABEL : s;
};

const toNameCase = (s?: string) =>
  (s ?? '')
    .trim()
    .toLocaleLowerCase('uk-UA')
    .replace(/(^|\s|-)\p{L}/gu, (m) => m.toLocaleUpperCase('uk-UA'));

const fullName = (first?: string, last?: string) => {
  const f = (first ?? '').trim();
  const l = (last ?? '').trim();
  if (!f && !l) return EMPTY_LABEL;
  return `${f}${f && l ? ' ' : ''}${l}`;
};

type StaffFromApi = Staff & Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  title: string;
  staffStatus: string;
  employmentType: string;
  salaryType: 'Salary' | 'Hourly' | 'PerTraining' | string;
  monthlySalary: number;
  hourlyRate: number;
  perTrainingRate: number;
  currency: string;
}>;

type StaffPayroll = Staff & Partial<{
  monthlySalary: number;
  hourlyRate: number;
  perTrainingRate: number;
  salaryType: 'Salary' | 'Hourly' | 'PerTraining' | string;
}>;

type StaffApiResponse = StaffFromApi[] | { list?: StaffFromApi[]; total?: number };

function calcSum(u: StaffPayroll): number | null {
  switch (u.salaryType) {
    case 'Salary':
      return typeof u.monthlySalary === 'number' ? u.monthlySalary : null;
    case 'Hourly':
      return typeof u.hourlyRate === 'number' ? u.hourlyRate : null;
    case 'PerTraining':
      return typeof u.perTrainingRate === 'number' ? u.perTrainingRate : null;
    default:
      return null;
  }
}

// Рядок таблиці
type Row = {
  id: string;
  firstName: string;
  lastName: string;
  FIO: string;
  email: string;
  phoneNumber: string;
  title: string;
  staffStatus: string;
  employmentType: string;
  salaryType: string;
  sum: number | null;
  currency: string;
};

// ---------------------------------------------------------------------------

const StaffTable: React.FC = () => {
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

  // ⬇️ нове джерело даних
  const staffQuery = useStaffList();
  const { data, isLoading, isError, error } = staffQuery;

  // Уніфікуємо можливі формати відповіді
  const items: StaffFromApi[] = React.useMemo(() => {
    const d = data as StaffApiResponse | undefined;
    if (Array.isArray(d)) return d;
    if (d && Array.isArray(d.list)) return d.list;
    return [];
  }, [data]);

  // Мапінг у рядки таблиці
  const rows = React.useMemo<Row[]>(
    () =>
      items.map((u) => ({
        id: u.id,
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        FIO: fullName(u.firstName, u.lastName),
        email: u.email ?? '',
        phoneNumber: u.phoneNumber ?? '',
        title: u.title ?? '',
        staffStatus: u.staffStatus ?? '',
        employmentType: u.employmentType ?? '',
        salaryType: u.salaryType ?? '',
        sum: calcSum(u),
        currency: u.currency ?? '',
      })),
    [items]
  );

  const left = { headerAlign: 'left' as const, align: 'left' as const };

  const columns: GridColDef<Row>[] = [
    {
      field: 'FIO',
      headerName: 'ФІО',
      ...left,
      flex: 0.4,
      minWidth: 120,
      sortable: false,
      cellClassName: 'fioCell',
      renderCell: ({ row }) => {
        const first = toNameCase(row.firstName);
        const last  = toNameCase(row.lastName);
        const hasAny = (first && first.trim()) || (last && last.trim());
        return (
          <Link href={`/admin/access-control/${row.id}`} className="fioStack">
            <span>{hasAny ? first || EMPTY_LABEL : EMPTY_LABEL}</span>
            {hasAny && <span>{last || EMPTY_LABEL}</span>}
          </Link>
        );
      },
    },
    { field: 'email', headerName: 'Email', ...left, flex: 0.6, minWidth: 160, renderCell: ({ row }) => displayOrDefault(row.email) },
    { field: 'phoneNumber', headerName: 'Телефон', ...left, flex: 0.4, minWidth: 120, renderCell: ({ row }) => displayOrDefault(row.phoneNumber) },
    { field: 'title', headerName: 'Посада', ...left, flex: 0.4, minWidth: 120, renderCell: ({ row }) => displayOrDefault(row.title) },
    { field: 'staffStatus', headerName: 'Статус', ...left, flex: 0.35, minWidth: 110, renderCell: ({ row }) => displayOrDefault(row.staffStatus) },
    { field: 'employmentType', headerName: 'Оформлення', ...left, flex: 0.4, minWidth: 130, renderCell: ({ row }) => displayOrDefault(row.employmentType) },
    { field: 'salaryType', headerName: 'Вид оплати', ...left, flex: 0.4, minWidth: 130, renderCell: ({ row }) => displayOrDefault(row.salaryType) },
    { field: 'sum', headerName: 'Сума', type: 'number', ...left, flex: 0.35, minWidth: 110, sortable: false, renderCell: ({ row }) => (row.sum == null ? '—' : String(row.sum)) },
    { field: 'currency', headerName: 'Валюта', ...left, flex: 0.3, minWidth: 100, renderCell: ({ row }) => displayOrDefault(row.currency) },
  ];

  const localeText =
    locale === 'uk'
      ? ukUA.components.MuiDataGrid.defaultProps.localeText
      : enUS.components.MuiDataGrid.defaultProps.localeText;

  if (!mounted) return null;

  return (
    <Box
      sx={{
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
        autoHeight
        getRowHeight={() => 74}
        sx={{
          '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': { textAlign: 'left' },
          '& .MuiDataGrid-columnHeaderTitleContainer': { justifyContent: 'flex-start' },
          '& .fioCell': { display: 'flex', alignItems: 'center' },
          '& .fioCell .fioStack': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            lineHeight: 1.15,
          },
          '& .fioCell .fioStack span': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
        rows={rows}
        getRowId={(r: Row) => r.id}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        pagination
        paginationMode="client"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        localeText={localeText}
        loading={isLoading}
        disableRowSelectionOnClick
      />

      {isError && (
        <Typography
          variant="body2"
          color="error"
          sx={{ position: 'absolute', top: 8, right: 12 }}
          title={String((error as unknown as Error)?.message ?? error)}
        >
          {t('loadError') ?? 'Помилка завантаження співробітників'}
        </Typography>
      )}
    </Box>
  );
};

export default StaffTable;

