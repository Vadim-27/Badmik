// 'use client';

// import * as React from 'react';
// import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
// import { Box, Chip, Button } from '@mui/material';
// import { useTranslations, useLocale } from 'next-intl';
// import { ukUA, enUS } from '@mui/x-data-grid/locales';
// import { mockBookings } from '@/data/mockBookings';

// type Booking = {
//   id: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   title: string;
//   hall: string;
//   type: string;
//   level: string;
//   club: string;
//   participants: number;
//   limit: number;
//   status: string;
//   availability: 'free' | 'queue' | 'full';
// };

// interface BookingTableProps {
//   role: 'owner_admin' | 'club_admin';
//   userClub?: string; // для club_admin
// }

// export default function BookingTable({ role, userClub }: BookingTableProps) {
//   const locale = useLocale();
//   const t = useTranslations('Bookings');
  

//   const [bookings, setBookings] = React.useState<Booking[]>([]);
//   const [rowCount, setRowCount] = React.useState(0);
//   const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({ page: 0, pageSize: 10 });
//   const [sortModel, setSortModel] = React.useState<GridSortModel>([{ field: 'date', sort: 'desc' }]);
//   const [loading, setLoading] = React.useState(false);
//   const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
//   const [activeFilters, setActiveFilters] = React.useState<string[]>([]);// швидкі чипи
//   const [mounted, setMounted] = React.useState(false); 

//   // швидкі чипи

//   const fetchBookings = React.useCallback(async () => {
//   setLoading(true);
//   try {
//     // беремо мокові дані
//     let data: Booking[] = Object.values(mockBookings).flat();
//     console.log("data", data)

//     // фільтр по клубу для club_admin
//     if (role === 'club_admin' && userClub) {
//       data = data.filter((b) => b.club === userClub);
//     }

//     // застосування "швидких чипів"
//     if (activeFilters.length) {
//       data = data.filter(
//         (b) => activeFilters.includes(b.status) || activeFilters.includes(b.availability)
//       );
//       if (activeFilters.includes('today')) {
//         const today = new Date().toISOString().split('T')[0];
//         data = data.filter((b) => b.date === today);
//       }
//     }

//     // сортування
//     if (sortModel.length) {
//       const { field, sort } = sortModel[0];
//       data = [...data].sort((a, b) => {
//         if (a[field as keyof Booking] < b[field as keyof Booking]) return sort === 'asc' ? -1 : 1;
//         if (a[field as keyof Booking] > b[field as keyof Booking]) return sort === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }

//     // пагінація
//     const start = paginationModel.page * paginationModel.pageSize;
//     const end = start + paginationModel.pageSize;
//     const pagedData = data.slice(start, end);

//     setBookings(pagedData);   // <-- використовуємо стейт
//     setRowCount(data.length);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// }, [paginationModel, sortModel, activeFilters, role, userClub]);

//   React.useEffect(() => {
//     fetchBookings();
//     setMounted(true);
//   }, [fetchBookings]);

//   const columns: GridColDef[] = [
//     { field: 'date', headerName: t('dateTime'), flex: 0.8, minWidth: 120 },
//     { field: 'title', headerName: t('trainingName'), flex: 1, minWidth: 150 },
//     { field: 'type', headerName: t('type'), flex: 0.5, minWidth: 100 },
//     { field: 'level', headerName: t('level'), flex: 0.4, minWidth: 80 },
//     role === 'owner_admin' && { field: 'club', headerName: t('club'), flex: 0.5, minWidth: 120 },
//     { field: 'participants', headerName: t('participantsLimit'), flex: 0.5, minWidth: 120 },
//     { field: 'status', headerName: t('status'), flex: 0.4, minWidth: 100 },
//     { field: 'actions', headerName: t('actions'), flex: 0.4, minWidth: 100, sortable: false },
//   ].filter(Boolean) as GridColDef[];

//   const toggleChip = (filter: string) => {
//     setActiveFilters((prev) =>
//       prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
//     );
//   };

//   const handleBatchAction = (action: string) => {
//     console.log('Batch action', action, selectedRows);
//     // тут виклик API для масової зміни
//   };

//   const localeText = locale === 'uk'
//       ? ukUA.components.MuiDataGrid.defaultProps.localeText
//       : enUS.components.MuiDataGrid.defaultProps.localeText;
  
//     if (!mounted) return null;
// console.log("bookings", bookings)
//   return (
//     <Box sx={{
//         height: 600,
//         width: '99%',
//         minWidth: 180,
//         '& .MuiDataGrid-root': {
//           fontFamily: 'var(--font-geist-sans)',
//         },
//         '& [class*="MuiDataGridVariables"]': {
//           '--DataGrid-t-header-background-base': '#f48b29',
//         },
//         '& .MuiDataGrid-columnHeaders': {
//           color: '#fff',
//           fontWeight: 'bold',
//           fontSize: '1rem',
//         },
//         '& .MuiDataGrid-row:hover': {
//           cursor: 'pointer',
//         },
//       }}>
//       <Box sx={{ mb: 1 }}>
//         {/* швидкі чипи */}
//         {['active', 'free', 'queue', 'today'].map((f) => (
//           <Chip
//             key={f}
//             label={f}
//             color={activeFilters.includes(f) ? 'primary' : 'default'}
//             onClick={() => toggleChip(f)}
//             sx={{ mr: 1 }}
//           />
//         ))}

//         {/* масові дії */}
//         <Button onClick={() => handleBatchAction('changeStatus')} disabled={!selectedRows.length}>
//           {/* {t('changeStatus')} */}
//           changeStatus
//         </Button>
//         <Button onClick={() => handleBatchAction('export')} disabled={!selectedRows.length}>
//           {/* {t('export')} */}
//           export
//         </Button>
//       </Box>

//       <DataGrid
//         rows={bookings}
//         columns={columns}
//         rowCount={rowCount}
//         pagination
//         paginationMode="server"
//         paginationModel={paginationModel}
//         onPaginationModelChange={setPaginationModel}
//         // sortingMode="server"
//         sortModel={sortModel}
//         onSortModelChange={setSortModel}
//         checkboxSelection
//         onRowSelectionModelChange={(ids) => setSelectedRows(ids as string[])}
//         localeText={localeText}
//         loading={loading}
//       />
//     </Box>
//   );
// }



//======================================================



'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { mockBookings } from '@/data/mockBookings';
import { Chip, Button, Menu, MenuItem, Checkbox } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { isWithinInterval, parseISO, isToday, isTomorrow, startOfWeek, endOfWeek, addWeeks } from 'date-fns';

type Booking = {
  id: string;
  date: string;       // 'yyyy-MM-dd'
  startTime: string;  // 'HH:mm'
  endTime: string;    // 'HH:mm'
  title: string;
  hall: string;
  type: string;
  level: string;
  club: string;
  participants: number;
  limit: number;
  status: string;     // internal values like 'active' | 'cancelled' | 'finished'
  availability: 'free' | 'queue' | 'full';
};

interface BookingTableProps {
  role: 'owner_admin' | 'club_admin';
  userClub?: string;
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Активне' },
  { value: 'cancelled', label: 'Відмінене' },
  { value: 'finished', label: 'Завершене' },
];

export default function BookingTable({ role, userClub }: BookingTableProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]); // quick chips: today, free, queue
  const [sortField, setSortField] = useState<keyof Booking>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // club/type/level/status menus + selections
  const [anchorElClub, setAnchorElClub] = useState<null | HTMLElement>(null);
  const [anchorElType, setAnchorElType] = useState<null | HTMLElement>(null);
  const [anchorElLevel, setAnchorElLevel] = useState<null | HTMLElement>(null);
  const [anchorElStatus, setAnchorElStatus] = useState<null | HTMLElement>(null);

  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]); // <- новий state

   // дата
  const [anchorElDate, setAnchorElDate] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });

  // час
  const [anchorElTime, setAnchorElTime] = useState<null | HTMLElement>(null);
  const [timeRange, setTimeRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });


  // init data
  useEffect(() => {
    const base = Object.values(mockBookings).flat() as Booking[];
    let data = base;

    if (role === 'club_admin' && userClub) {
      data = data.filter((b) => b.club === userClub);
      setSelectedClub(userClub);
    }

    setBookings(data);
  }, [role, userClub]);

  // compute uniques
  const uniqueClubs = useMemo(() => {
    const base = Object.values(mockBookings).flat() as Booking[];
    return Array.from(new Set(base.map((b) => b.club)));
  }, []);

  const uniqueTypes = useMemo(() => {
    const base = Object.values(mockBookings).flat() as Booking[];
    return Array.from(new Set(base.map((b) => b.type)));
  }, []);

  const levelOptions = ['A', 'B', 'C', 'D', 'Meister'];

    // пресети для дати
  const setDatePreset = (preset: 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek') => {
    const today = new Date();
    if (preset === 'today') {
      setDateRange({ from: today.toISOString().slice(0, 10), to: today.toISOString().slice(0, 10) });
    } else if (preset === 'tomorrow') {
      const t = new Date();
      t.setDate(today.getDate() + 1);
      setDateRange({ from: t.toISOString().slice(0, 10), to: t.toISOString().slice(0, 10) });
    } else if (preset === 'thisWeek') {
      setDateRange({ from: startOfWeek(today, { weekStartsOn: 1 }).toISOString().slice(0, 10), to: endOfWeek(today, { weekStartsOn: 1 }).toISOString().slice(0, 10) });
    } else if (preset === 'nextWeek') {
      const start = addWeeks(startOfWeek(today, { weekStartsOn: 1 }), 1);
      const end = addWeeks(endOfWeek(today, { weekStartsOn: 1 }), 1);
      setDateRange({ from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) });
    }
    setAnchorElDate(null);
  };

  // helper: toggle item in array state
  const toggleInArray = (arr: string[], setArr: (v: string[] | ((prev: string[]) => string[])) => void, value: string) => {
    setArr((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  // filtered + sorted data
  const filteredBookings = useMemo(() => {
    let data = [...bookings];

    // CLUB filter
    if (selectedClub) {
      data = data.filter((b) => b.club === selectedClub);
    }

    // TYPE filter (multi)
    if (selectedTypes.length) {
      data = data.filter((b) => selectedTypes.includes(b.type));
    }

    // LEVEL filter (multi)
    if (selectedLevels.length) {
      data = data.filter((b) => selectedLevels.includes(b.level));
    }

    // STATUS filter (multi)
    if (selectedStatuses.length) {
      data = data.filter((b) => selectedStatuses.includes(b.status));
    }

    // Дата
if (dateRange.from || dateRange.to) {
  data = data.filter((b) => {
    const bookingDate = parseISO(b.date);
    const from = dateRange.from ? parseISO(dateRange.from) : null;
    const to = dateRange.to ? parseISO(dateRange.to) : null;

    if (from && to && !isWithinInterval(bookingDate, { start: from, end: to })) return false;
    if (from && !to && bookingDate < from) return false;
    if (to && !from && bookingDate > to) return false;

    return true;
  });
}

// Час (брати `startTime`, бо в Booking немає `time`)
if (timeRange.from || timeRange.to) {
  data = data.filter((b) => {
    const [h, m] = b.startTime.split(':').map(Number);
    const bookingMinutes = h * 60 + m;

    const fromMin = timeRange.from ? (() => { const [hh, mm] = timeRange.from!.split(':').map(Number); return hh * 60 + mm; })() : null;
    const toMin = timeRange.to ? (() => { const [hh, mm] = timeRange.to!.split(':').map(Number); return hh * 60 + mm; })() : null;

    if (fromMin !== null && bookingMinutes < fromMin) return false;
    if (toMin !== null && bookingMinutes > toMin) return false;

    return true;
  });
}

    // quick chips
    if (activeFilters.includes('today')) {
      const today = new Date().toISOString().split('T')[0];
      data = data.filter((b) => b.date === today);
    }
    if (activeFilters.includes('free')) {
      data = data.filter((b) => b.availability === 'free');
    }
    if (activeFilters.includes('queue')) {
      data = data.filter((b) => b.availability === 'queue');
    }

    // sorting
    data.sort((a, b) => {
      const av: any = a[sortField];
      const bv: any = b[sortField];
      if (av < bv) return sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [bookings, selectedClub, selectedTypes, selectedLevels, selectedStatuses, activeFilters, sortField, sortOrder, dateRange, timeRange  ]);

  // toggles
  const toggleChip = (filter: string) =>
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));

  const toggleSort = (field: keyof Booking) => {
    if (sortField === field) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleRowSelection = (id: string) =>
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  // menus handlers (club/type/level/status)
  const openMenu = (setter: typeof setAnchorElClub) => (e: React.MouseEvent<HTMLElement>) => setter(e.currentTarget);
  const closeMenu = (setter: typeof setAnchorElClub) => () => setter(null);

  // map status value -> label
  const statusLabel = (val: string) => STATUS_OPTIONS.find((s) => s.value === val)?.label ?? val;

  // render
  return (
    <div className="space-y-4">
      {/* CHIPS */}
      <div className="flex flex-wrap gap-2 items-center">
         {/* Дата */}
        <>
          <Chip
            label={dateRange.from || dateRange.to ? `Дата: ${dateRange.from ?? ''} - ${dateRange.to ?? ''}` : 'Дата'}
            color={dateRange.from || dateRange.to ? 'primary' : 'default'}
            onClick={(e) => setAnchorElDate(e.currentTarget)}
          />
          <Menu anchorEl={anchorElDate} open={Boolean(anchorElDate)} onClose={() => setAnchorElDate(null)}>
            <MenuItem
    onClick={() => {
      setDateRange({ from: null, to: null });
      setAnchorElDate(null);
    }}
  >
    Скинути фільтр
  </MenuItem>
            <MenuItem onClick={() => setDatePreset('today')}>Сьогодні</MenuItem>
            <MenuItem onClick={() => setDatePreset('tomorrow')}>Завтра</MenuItem>
            <MenuItem onClick={() => setDatePreset('thisWeek')}>Цього тижня</MenuItem>
            <MenuItem onClick={() => setDatePreset('nextWeek')}>Наступного тижня</MenuItem>
            <MenuItem>
              <input type="date" value={dateRange.from ?? ''} onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))} />
              <span className="mx-2">—</span>
              <input type="date" value={dateRange.to ?? ''} onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))} />
            </MenuItem>
          </Menu>
        </>

        {/* Час */}
        <>
          <Chip
            label={timeRange.from || timeRange.to ? `Час: ${timeRange.from ?? ''} - ${timeRange.to ?? ''}` : 'Час'}
            color={timeRange.from || timeRange.to ? 'primary' : 'default'}
            onClick={(e) => setAnchorElTime(e.currentTarget)}
          />
          <Menu anchorEl={anchorElTime} open={Boolean(anchorElTime)} onClose={() => setAnchorElTime(null)}>
            <MenuItem
    onClick={() => {
      setTimeRange({ from: null, to: null });
      setAnchorElTime(null);
    }}
  >
    Скинути фільтр
  </MenuItem>
            <MenuItem>
              <input type="time" value={timeRange.from ?? ''} onChange={(e) => setTimeRange((prev) => ({ ...prev, from: e.target.value }))} />
              <span className="mx-2">—</span>
              <input type="time" value={timeRange.to ?? ''} onChange={(e) => setTimeRange((prev) => ({ ...prev, to: e.target.value }))} />
            </MenuItem>
          </Menu>
        </>
        {/* simple text chips */}
        {[ 'зал', 'заповненість'].map((f) => (
          <Chip
            key={f}
            label={f}
            variant="outlined"
            color={activeFilters.includes(f) ? 'primary' : 'default'}
            onClick={() => toggleChip(f)}
          />
        ))}

        {/* quick filters */}
        {['free', 'queue', 'today'].map((f) => (
          <Chip
            key={f}
            label={f}
            color={activeFilters.includes(f) ? 'primary' : 'default'}
            onClick={() => toggleChip(f)}
          />
        ))}

        {/* CLUB chip */}
        {role === 'owner_admin' ? (
          <>
            <Chip
              label={selectedClub ? `Клуб: ${selectedClub}` : 'Клуб'}
              color={selectedClub ? 'primary' : 'default'}
              onClick={openMenu(setAnchorElClub)}
            />
            <Menu anchorEl={anchorElClub} open={Boolean(anchorElClub)} onClose={closeMenu(setAnchorElClub)}>
              <MenuItem
                onClick={() => {
                  setSelectedClub(null);
                  closeMenu(setAnchorElClub)();
                }}
              >
                Усі
              </MenuItem>
              {uniqueClubs.map((c) => (
                <MenuItem
                  key={c}
                  onClick={() => {
                    setSelectedClub(c);
                    closeMenu(setAnchorElClub)();
                  }}
                >
                  {c}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Chip label={`Клуб: ${userClub ?? '—'}`} color="primary" variant="outlined" />
        )}

        {/* TYPE chip (multi) */}
        <>
          <Chip
            label={selectedTypes.length ? `Тип: ${selectedTypes.join(', ')}` : 'Тип'}
            color={selectedTypes.length ? 'primary' : 'default'}
            onClick={openMenu(setAnchorElType)}
          />
          <Menu anchorEl={anchorElType} open={Boolean(anchorElType)} onClose={closeMenu(setAnchorElType)}>
            {uniqueTypes.map((t) => (
              <MenuItem
                key={t}
                onClick={() => toggleInArray(selectedTypes, setSelectedTypes, t)}
              >
                <Checkbox checked={selectedTypes.includes(t)} />
                {t}
              </MenuItem>
            ))}
          </Menu>
        </>

        {/* LEVEL chip (multi) */}
        <>
          <Chip
            label={selectedLevels.length ? `Рівень: ${selectedLevels.join(', ')}` : 'Рівень'}
            color={selectedLevels.length ? 'primary' : 'default'}
            onClick={openMenu(setAnchorElLevel)}
          />
          <Menu anchorEl={anchorElLevel} open={Boolean(anchorElLevel)} onClose={closeMenu(setAnchorElLevel)}>
            {levelOptions.map((lvl) => (
              <MenuItem key={lvl} onClick={() => toggleInArray(selectedLevels, setSelectedLevels, lvl)}>
                <Checkbox checked={selectedLevels.includes(lvl)} />
                {lvl}
              </MenuItem>
            ))}
          </Menu>
        </>

        {/* STATUS chip (multi) */}
        <>
          <Chip
            label={selectedStatuses.length ? `Статус: ${selectedStatuses.map(statusLabel).join(', ')}` : 'Статус'}
            color={selectedStatuses.length ? 'primary' : 'default'}
            onClick={openMenu(setAnchorElStatus)}
          />
          <Menu anchorEl={anchorElStatus} open={Boolean(anchorElStatus)} onClose={closeMenu(setAnchorElStatus)}>
            <MenuItem
              onClick={() => {
                setSelectedStatuses([]);
                closeMenu(setAnchorElStatus)();
              }}
            >
              Усі
            </MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s.value} onClick={() => toggleInArray(selectedStatuses, setSelectedStatuses, s.value)}>
                <Checkbox checked={selectedStatuses.includes(s.value)} />
                {s.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      </div>

      {/* bulk actions */}
      <div className="flex gap-2">
        <Button disabled={!selectedRows.length} onClick={() => console.log('Change status', selectedRows)}>
          Змінити статус
        </Button>
        <Button disabled={!selectedRows.length} onClick={() => console.log('Export', selectedRows)}>
          Експорт CSV
        </Button>
      </div>

      {/* table */}
      <table className="w-full border-collapse border border-gray-300 text-left">
  <thead>
    <tr className="bg-gray-200 border-b">
      <th className="p-2" />
      <th className="p-2 cursor-pointer" onClick={() => toggleSort('date')}>
        Дата {sortField === 'date' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
      </th>
      <th className="p-2 cursor-pointer" onClick={() => toggleSort('startTime')}>
        Час {sortField === 'startTime' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
      </th>
      <th className="p-2 cursor-pointer" onClick={() => toggleSort('title')}>
        Назва {sortField === 'title' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
      </th>
      <th className="p-2 cursor-pointer" onClick={() => toggleSort('type')}>
        Тип {sortField === 'type' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
      </th>
      <th className="p-2 cursor-pointer" onClick={() => toggleSort('level')}>
        Рівень {sortField === 'level' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
      </th>
      {role === 'owner_admin' && (
        <th className="p-2 cursor-pointer" onClick={() => toggleSort('club')}>
          Клуб {sortField === 'club' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
        </th>
      )}
      <th className="p-2 cursor-pointer" onClick={() => toggleSort('participants')}>
        Заповненість {sortField === 'participants' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
      </th>
      <th className="p-2 cursor-pointer" onClick={() => toggleSort('status')}>
        Статус {sortField === 'status' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
      </th>
      <th className="p-2">Дії</th>
    </tr>
  </thead>
  <tbody>
    {filteredBookings.map((b) => (
      <tr key={b.id} className="border-t hover:bg-gray-50">
        <td className="p-2">
          <input
            type="checkbox"
            checked={selectedRows.includes(b.id)}
            onChange={() => toggleRowSelection(b.id)}
          />
        </td>
        <td className="p-2">
          {new Date(b.date).toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </td>
        <td className="p-2">
          {b.startTime}–{b.endTime}
        </td>
        <td className="p-2">
          {b.title}
          <div className="text-xs text-gray-500">{b.hall}</div>
        </td>
        <td className="p-2">{b.type}</td>
        <td className="p-2">{b.level}</td>
        {role === 'owner_admin' && <td className="p-2">{b.club}</td>}
        <td className="p-2">
          {b.participants}/{b.limit}
          <div className="h-2 bg-gray-200 rounded mt-1">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${(b.participants / b.limit) * 100}%` }}
            />
          </div>
        </td>
        <td className="p-2">{statusLabel(b.status)}</td>
        <td className="p-2 space-x-1">
          <button title="Переглянути">👁</button>
          <button title="Редагувати">✏</button>
          <button title="Видалити">🗑</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}



//====================



// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import { mockBookings } from '@/data/mockBookings';
// import { format } from 'date-fns';
// import { uk } from 'date-fns/locale';
// import { Chip, Button, IconButton, Menu, MenuItem } from '@mui/material';
// import { ArrowUpward, ArrowDownward, FilterList } from '@mui/icons-material';

// type Booking = {
//   id: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   title: string;
//   hall: string;
//   type: string;
//   level: string;
//   club: string;
//   participants: number;
//   limit: number;
//   status: string;
//   availability: 'free' | 'queue' | 'full';
// };

// interface BookingTableProps {
//   role: 'owner_admin' | 'club_admin';
//   userClub?: string;
// }

// export default function BookingTable({ role, userClub }: BookingTableProps) {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [selectedRows, setSelectedRows] = useState<string[]>([]);
//   const [activeFilters, setActiveFilters] = useState<string[]>([]); 
//   const [sortField, setSortField] = useState<keyof Booking>('date');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

//   // новий стейт для фільтра клубів
//   const [clubFilter, setClubFilter] = useState<string | null>(null);

//   // для меню клубів
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//   const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//   };

//   const handleSelectClub = (club: string | null) => {
//     setClubFilter(club);
//     handleCloseMenu();
//   };

//   // ініціалізація даних
//   useEffect(() => {
//     let data = Object.values(mockBookings).flat();
//     if (role === 'club_admin' && userClub) {
//       data = data.filter((b) => b.club === userClub);
//     }
//     setBookings(data);
//   }, [role, userClub]);

//   // фільтрування і сортування
//   const filteredBookings = useMemo(() => {
//     return bookings
//       .filter((b) => {
//         if (activeFilters.includes('today')) {
//           const today = format(new Date(), 'yyyy-MM-dd');
//           if (b.date !== today) return false;
//         }
//         if (activeFilters.includes('free') && b.availability !== 'free') return false;
//         if (activeFilters.includes('queue') && b.availability !== 'queue') return false;
//         if (activeFilters.includes('active') && b.status !== 'active') return false;
//         if (clubFilter && b.club !== clubFilter) return false;
//         return true;
//       })
//       .sort((a, b) => {
//         const aValue = a[sortField];
//         const bValue = b[sortField];
//         if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
//         if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
//         return 0;
//       });
//   }, [bookings, activeFilters, clubFilter, sortField, sortOrder]);

//   const toggleChip = (filter: string) => {
//     setActiveFilters((prev) =>
//       prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
//     );
//   };

//   const toggleSort = (field: keyof Booking) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortOrder('asc');
//     }
//   };

//   // список доступних клубів (без дублікатів)
//   const uniqueClubs = Array.from(new Set(bookings.map((b) => b.club)));

//   return (
//     <div className="space-y-4">
//       {/* Чипи */}
//       <div className="flex flex-wrap gap-2">
//         {['active', 'free', 'queue', 'today'].map((f) => (
//           <Chip
//             key={f}
//             label={f}
//             color={activeFilters.includes(f) ? 'primary' : 'default'}
//             onClick={() => toggleChip(f)}
//           />
//         ))}
//       </div>

//       {/* Таблиця */}
//       <table className="w-full border-collapse text-left">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2 border" />
//             <th className="p-2 border cursor-pointer" onClick={() => toggleSort('date')}>
//               Дата
//               {sortField === 'date' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
//             </th>
//             <th className="p-2 border cursor-pointer" onClick={() => toggleSort('title')}>
//               Назва
//               {sortField === 'title' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
//             </th>
//             <th className="p-2 border cursor-pointer" onClick={() => toggleSort('type')}>
//               Тип
//               {sortField === 'type' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
//             </th>
//             <th className="p-2 border cursor-pointer" onClick={() => toggleSort('level')}>
//               Рівень
//               {sortField === 'level' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
//             </th>
//             {/* {role === 'owner_admin' && (
//               <th className="p-2 border">
//                 Клуб
//                 <IconButton size="small" onClick={handleOpenMenu}>
//                   <FilterList fontSize="small" />
//                 </IconButton>
//                 <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
//                   <MenuItem onClick={() => handleSelectClub(null)}>Усі</MenuItem>
//                   {uniqueClubs.map((club) => (
//                     <MenuItem key={club} onClick={() => handleSelectClub(club)}>
//                       {club}
//                     </MenuItem>
//                   ))}
//                 </Menu>
//               </th>
//             )} */}
//             {role === 'owner_admin' && <th className="p-2 border cursor-pointer" onClick={() => toggleSort('club')}>Клуб</th>}
//             <th className="p-2 border cursor-pointer" onClick={() => toggleSort('participants')}>
//               Заповненість
//               {sortField === 'participants' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
//             </th>
//             <th className="p-2 border cursor-pointer" onClick={() => toggleSort('status')}>
//               Статус
//               {sortField === 'status' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
//             </th>
//             <th className="p-2 border">Дії</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredBookings.map((b) => (
//             <tr key={b.id} className="border-t hover:bg-gray-50">
//               <td className="p-2 border">
//                 <input
//                   type="checkbox"
//                   checked={selectedRows.includes(b.id)}
//                   onChange={() =>
//                     setSelectedRows((prev) =>
//                       prev.includes(b.id) ? prev.filter((r) => r !== b.id) : [...prev, b.id]
//                     )
//                   }
//                 />
//               </td>
//               <td className="p-2 border">
//                 {format(new Date(b.date), 'dd.MM.yyyy')} {b.startTime}–{b.endTime}
//               </td>
//               <td className="p-2 border">{b.title}<div className="text-xs text-gray-500">{b.hall}</div></td>
//               <td className="p-2 border">{b.type}</td>
//               <td className="p-2 border">{b.level}</td>
//               {role === 'owner_admin' && <td className="p-2 border">{b.club}</td>}
//               <td className="p-2 border">
//                 {b.participants}/{b.limit}
//               </td>
//               <td className="p-2 border">{b.status}</td>
//               <td className="p-2 border space-x-1">
//                 <button>👁</button>
//                 <button>✏</button>
//                 <button>🗑</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


