// import React from 'react';
// // import Booking from '@/app/components/shared/Booking/Booking';
// import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
// import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
// import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';

// type Params = {
//   clubId: string;
  
// };

// // const BookingPage = async ({
// //   params,
// // }: {
// //   params: Promise<Params>;
// // }) => {
// //   const { clubId } = await params;

// import { getTranslations } from 'next-intl/server';

// export default async function BookingPage({
//   params,
// }: {
//   params: { locale: string; clubId: string };
// }) {
//   const { clubId, locale } = await params;
//   const t = await getTranslations({ locale, namespace: 'Bookings' });


//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <ActionHeader>
//         <BackButton label="buttons.back"/>
//         <h2 className="text-lg font-semibold">{t(`clubs.${clubId}`)}</h2>
//         <AddButton href={`/admin/${clubId}/bookings/add-training`} label="buttons.addTraining" />
//       </ActionHeader>
//       <Booking clubId={clubId} t={t} />
//     </div>
//   );
// }

// export default BookingPage;
