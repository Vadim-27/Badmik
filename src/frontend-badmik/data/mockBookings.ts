export interface Booking {
  date: string;
  title: string;
  hall: string;
  courts: string[];
  participants: string;
}

export const mockBookings: Record<string, Booking[]> = {
  'club-1': [
    {
      date: '2025-06-28',
      title: 'Тренування з Андрієм',
      hall: 'Зал 1',
      courts: ['Корт 1', 'Корт 2'],
      participants: '14/20',
    },
    {
      date: '2025-06-29',
      title: 'Індивідуалка',
      hall: 'Зал 2',
      courts: ['Корт 3'],
      participants: '1/1',
    },
  ],
  'club-2': [
    {
      date: '2025-06-30',
      title: 'Тренування з Олею',
      hall: 'Зал 1',
      courts: ['Корт 1'],
      participants: '10/15',
    },
  ],
  'club-3': [
    {
      date: '2025-07-01',
      title: 'Відкрите тренування',
      hall: 'Зал A',
      courts: ['Корт 2', 'Корт 3'],
      participants: '6/12',
    },
  ],
  'club-4': [
    {
      date: '2025-07-02',
      title: 'Техніка подачі',
      hall: 'Центральний зал',
      courts: ['Корт 4'],
      participants: '8/10',
    },
  ],
  'club-5': [
    {
      date: '2025-07-03',
      title: 'Парне тренування',
      hall: 'Зал 3',
      courts: ['Корт 2', 'Корт 5'],
      participants: '12/16',
    },
  ],
  'club-6': [
    {
      date: '2025-07-04',
      title: 'Дитяча секція',
      hall: 'Зал дитячий',
      courts: ['Корт 1'],
      participants: '9/10',
    },
  ],
};
