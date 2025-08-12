import React from 'react';
import TrainingForm from '@/app/components/shared/Booking/TrainingForm/TrainingForm';


export default function AddTrainingPage() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
        
      <h1 className="text-3xl font-bold mb-6">Додати тренування</h1>
      <TrainingForm />
    </main>
  );
}
