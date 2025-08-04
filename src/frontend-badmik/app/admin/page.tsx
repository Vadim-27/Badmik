import Link from 'next/link';
import { clubs } from '@/data/clubs'; 
import { ClubList } from '../components/shared/Clubs/ClubList/ClubList';
import ClubListHeader from '../components/shared/Clubs/ClubListHeader/ClubListHeader';
import React from 'react';



const AdminPage = () => {
  return (
    <div className="admin-page bg-gray-100">
      {/* <h1>Admin Dashboard</h1> */}

       {/* <div className="p-8"> */}
      {/* <h1 className="text-2xl font-bold mb-6">Клуби</h1> */}
      <ClubListHeader />
      <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
        <ClubList />
        {/* {clubs.map((club) => (
          <Link
            key={club.id}
            href={`/admin/${club.id}`}
            className="block p-6 rounded-xl shadow-md border hover:shadow-lg transition bg-white hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold">{club.name}</h2>
            <p className="text-sm text-gray-500">ID: {club.id}</p>
          </Link>
        ))} */}
      </div>
    </div>
    
    // </div>
  );
}

export default  AdminPage;