import React from 'react';
import Booking from '@/app/components/shared/Booking/Booking';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';

type Params = {
  clubId: string;
};

const BookingPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { clubId } = await params; 

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
       <ActionHeader>
            <BackButton />
      
              <h2 className="text-lg font-semibold">Клуби</h2>
      
              <AddButton href={`/admin/${clubId}/bookings/add-training`} label="Додати тренування" />
      
          </ActionHeader>
   <Booking />
   </div>
  );
};

export default BookingPage;
