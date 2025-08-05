

import { Club } from '@/data/clubs';

type Props = {
  club: Club;
};

export const ClubDetails = ({ club }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{club.name}</h3>
        <span
          className={`text-sm px-3 py-1 rounded-full bg-${club.statusColor}-100 text-${club.statusColor}-700`}
        >
          {club.status}
        </span>
      </div>

      <div className="text-gray-700 text-sm space-y-2">
        <p><strong>Місто:</strong> {club.city}</p>
        <p><strong>Адреса:</strong> {club.address}</p>
        <p><strong>Менеджер:</strong> {club.manager}</p>
        <p><strong>Кількість кортів:</strong> {club.courts}</p>
      </div>
    </div>
  );
};
