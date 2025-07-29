import Link from 'next/link';
import { clubs } from '@/data/clubs'; 
import React from 'react';


const AdminPage = () => {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

       <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Клуби</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <Link
            key={club.id}
            href={`/admin/${club.id}`}
            className="block p-6 rounded-xl shadow-md border hover:shadow-lg transition bg-white hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold">{club.name}</h2>
            <p className="text-sm text-gray-500">ID: {club.id}</p>
          </Link>
        ))}
      </div>
    </div>
    
    </div>
  );
}

export default  AdminPage;