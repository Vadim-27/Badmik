

import { notFound } from 'next/navigation';
import { clubs } from '@/data/clubs';

type Props = {
  params: {
    clubId: string;
  };
};

export default async function ClubAdminPage({ params }: Props) {
   const  club =   clubs.find((c) => c.id === params.clubId);

  if (!club) {
    notFound(); 
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel for {club.name}</h1>
      <p className="text-gray-600">Club ID: {club.id}</p>
    </main>
  );
}