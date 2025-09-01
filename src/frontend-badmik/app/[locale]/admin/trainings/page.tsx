import React from 'react';
// import Booking from '@/app/components/shared/Booking/Booking';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import BookingTable from '@/app/components/shared/Booking/BookingTable';

const JWT_SECRET = new TextEncoder().encode('your-secret');


type Params = {
  clubId: string;
  
};

// const BookingPage = async ({
//   params,
// }: {
//   params: Promise<Params>;
// }) => {
//   const { clubId } = await params;

import { getTranslations } from 'next-intl/server';
// import BookingTable from './../../../components/shared/Booking/BookingTable';

export default async function TrainingsPage({
  params,
}: {
  params: { locale: string; clubId: string };
}) {
  const { clubId, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Bookings' });

  // const token = cookies().get('token')?.value;
  const cookieStore = await cookies();
  const token = cookieStore.get('token'); 
  let role: string | null = null;
  // let clubId: string | null = null;
  

  if (token) {
    const { payload } = await jwtVerify(token.value, JWT_SECRET);
    role = payload.role as string;
    // clubId = payload.clubId as string;
  }




  return (
    <div className="p-6 bg-gray-100 w-full h-screen">
      <ActionHeader>
        <BackButton label="buttons.back"/>
        {/* <h2 className="text-lg font-semibold">{t(`clubs.${clubId}`)}</h2> */}
        <AddButton href={`/admin/${clubId}/bookings/add-training`} label="buttons.addTraining" />
      </ActionHeader>
      {/* <Booking clubId={clubId} t={t} role={role} /> */}
      <BookingTable  role={role} />
    </div>
  );
}

// export default BookingPage;
