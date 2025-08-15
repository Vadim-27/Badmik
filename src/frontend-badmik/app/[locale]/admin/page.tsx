import {Link} from '@/i18n/navigation';
import { clubs } from '@/data/clubs'; 
import { ClubList } from '../../components/shared/Clubs/ClubList/ClubList';
import ClubListHeader from '../../components/shared/Clubs/ClubListHeader/ClubListHeader';
import React from 'react';



const AdminPage = () => {
  return (
    <div className="admin-page bg-gray-100">
      
      <ClubListHeader />
      <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
        <ClubList />
        
      </div>
    </div>
    
  
  );
}

export default  AdminPage;