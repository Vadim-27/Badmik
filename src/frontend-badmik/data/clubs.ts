
// export const clubs = [
//   { id: 'club-1', name: 'Green Court' },
//   { id: 'club-2', name: 'Ace Arena' },
//   { id: 'club-3', name: 'Smash Spot' },
//   { id: 'club-4', name: 'Topspin Hub' },
//   { id: 'club-5', name: 'Baseline Club' },
//   { id: 'club-6', name: 'Volley Village' },
// ];
export interface Club {
  id: string;
  name: string;
  status: 'Активний' | 'Очікує' | 'Заблокований' | 'Відновлюється';
  statusColor: 'green' | 'yellow' | 'red' | 'blue';
  city: string;
  address: string;
  manager: string;
  courts: number;
}

export const clubs: Club[] = [
  {
    id: '1',
    name: 'Energy Fit',
    status: 'Активний',
    statusColor: 'green',
    city: 'Київ',
    address: 'вул. Гімнастична, 12',
    manager: 'Олена Іваненко',
    courts: 5,
  },
  {
    id: '2',
    name: 'FitZone',
    status: 'Очікує',
    statusColor: 'yellow',
    city: 'Львів',
    address: 'просп. Шевченка, 45',
    manager: 'Андрій Коваль',
    courts: 3,
  },
  {
    id: '3',
    name: 'Power Gym',
    status: 'Заблокований',
    statusColor: 'red',
    city: 'Дніпро',
    address: 'вул. Центральна, 101',
    manager: 'Марія Зоріна',
    courts: 2,
  },
  {
    id: '4',
    name: 'SportLife',
    status: 'Активний',
    statusColor: 'green',
    city: 'Одеса',
    address: 'вул. Дерибасівська, 35',
    manager: 'Ігор Петренко',
    courts: 4,
  },
  {
    id: '5',
    name: 'Urban Tennis Club',
    status: 'Активний',
    statusColor: 'green',
    city: 'Харків',
    address: 'вул. Сумська, 10',
    manager: 'Світлана Мороз',
    courts: 6,
  },
  {
    id: '6',
    name: 'Champion Arena',
    status: 'Очікує',
    statusColor: 'yellow',
    city: 'Запоріжжя',
    address: 'просп. Соборний, 22',
    manager: 'Вадим Кравець',
    courts: 3,
  },
];
