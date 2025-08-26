import Link from 'next/link';
import { mockBookings } from '@/data/mockBookings';

export default function Booking({ clubId, t }: { clubId: string; t: (key: string, values?: any) => string }) {
  // const bookings = mockBookings || [];
  const bookings = Object.values(mockBookings).flat();
  

  const availabilityIcon = {
    free: '🟢',
    queue: '🟡',
    full: '🔴',
  };

  // const statusLabel = {
  //   active: t('status.active'),
  //   cancelled: t('status.cancelled'),
  //   finished: t('status.finished'),
  // };

  return (
    <section>
      <table className="w-full border bg-white rounded-md overflow-hidden text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">{t('dateTime')}</th>
            <th className="p-3">{t('trainingName')}</th>
            <th className="p-3">{t('type')}</th>
            <th className="p-3">{t('level')}</th>
            {clubId === 'superadmin' && <th className="p-3">{t('club')}</th>}
            <th className="p-3">{t('participantsLimit')}</th>
            <th className="p-3">{t('status')}</th>
            <th className="p-3">{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">
                {new Date(b.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })}, {b.startTime}–{b.endTime}
                {b.isToday && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{t('today')}</span>}
                {b.isTomorrow && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{t('tomorrow')}</span>}
                <span className="ml-1">{availabilityIcon[b.availability]}</span>
              </td>
              <td className="p-3">
                <Link href={`/trainings/${b.title}`} className="text-blue-600 hover:underline">
                  {b.title}
                </Link>
                <div className="text-xs text-gray-500">{b.hall}</div>
              </td>
              <td className="p-3">{b.type}</td>
              <td className="p-3">{b.level}</td>
              {clubId === 'superadmin' && <td className="p-3">{b.club}</td>}
              <td className="p-3">
                {b.participants}/{b.limit}
                <div className="h-2 bg-gray-200 rounded mt-1">
                  <div
                    className="h-full bg-blue-500 rounded"
                    style={{ width: `${(b.participants / b.limit) * 100}%` }}
                  ></div>
                </div>
              </td>
              <td className="p-3">{b.status}</td>
              <td className="p-3 space-x-2">
                <button title={t('view')} className="hover:underline">👁</button>
                <button title={t('edit')} className="hover:underline">✏</button>
                <button
                  title={t('delete')}
                  // onClick={() => confirm(t('confirmDelete')) && console.log('deleted')}
                  className="hover:underline"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}



//==========================

// app/[locale]/admin/[clubId]/bookings/page.tsx
// import { mockBookings } from '@/data/mockBookings';



// export default function Booking({ clubId, t }: { clubId: string; t: (key: string, values?: any) => string }) {
//   const bookings = mockBookings[clubId as keyof typeof mockBookings] || [];

//   return (
//     <section >
//     <table className="w-full  border bg-white rounded-md overflow-hidden">
//       <thead className="bg-gray-200">
//         <tr>
//           <th className="p-3 text-left">{t('date')}</th>
//           <th className="p-3 text-left">{t('name')}</th>
//           <th className="p-3 text-left">{t('hall')}</th>
//           <th className="p-3 text-left">{t('courts')}</th>
//           <th className="p-3 text-left">{t('participants')}</th>
//         </tr>
//       </thead>
//       <tbody>
//         {bookings.map((b, i) => (
//           <tr key={i} className="border-t">
//             <td className="p-3">{b.date}</td>
//             <td className="p-3">{b.title}</td>
//             <td className="p-3">{b.hall}</td>
//             <td className="p-3">{b.courts.join(', ')}</td>
//             <td className="p-3">{b.participants}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     </section>
//   );
// }

