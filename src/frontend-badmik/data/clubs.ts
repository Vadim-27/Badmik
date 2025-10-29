
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
    id: '991834b1-2d08-430c-9cbd-ddf17226c1ae',
    name: 'Energy Fit',
    status: 'Активний',
    statusColor: 'green',
    city: 'Київ',
    address: 'вул. Гімнастична, 12',
    manager: 'Олена Іваненко',
    courts: 5,
  },
  {
    id: '48e13f1d-1877-492b-b88d-bd2d777cfcb1',
    name: 'FitZone',
    status: 'Очікує',
    statusColor: 'yellow',
    city: 'Львів',
    address: 'просп. Шевченка, 45',
    manager: 'Андрій Коваль',
    courts: 3,
  },
  {
    id: '94f4c42a-97d5-4044-b093-a42a85b78ec5',
    name: 'Power Gym',
    status: 'Заблокований',
    statusColor: 'red',
    city: 'Дніпро',
    address: 'вул. Центральна, 101',
    manager: 'Марія Зоріна',
    courts: 2,
  },
  {
    id: '9b921175-93b3-4d05-a529-432a0a62c7b0',
    name: 'SportLife',
    status: 'Активний',
    statusColor: 'green',
    city: 'Одеса',
    address: 'вул. Дерибасівська, 35',
    manager: 'Ігор Петренко',
    courts: 4,
  },
  {
    id: 'be12fb23-0be8-4a8f-8d4b-343f9416862c',
    name: 'Urban Tennis Club',
    status: 'Активний',
    statusColor: 'green',
    city: 'Харків',
    address: 'вул. Сумська, 10',
    manager: 'Світлана Мороз',
    courts: 6,
  },
  {
    id: 'eaa85593-0735-42bc-92a2-96df14d6654d',
    name: 'Champion Arena',
    status: 'Очікує',
    statusColor: 'yellow',
    city: 'Запоріжжя',
    address: 'просп. Соборний, 22',
    manager: 'Вадим Кравець',
    courts: 3,
  },
];
