import React from 'react';
import UserDetail from '@/app/components/shared/UserDetail/UserDetail';
import { usersFromMok } from '@/data/mockUsers';

const UserPage = ({ params }: { params: { userId: string } }) => {
  const user = usersFromMok.find((u) => {
 
  return u.id === params.userId;
});
 
 
  if (!user) return <div>User not found</div>;

  return <UserDetail user={user} />;
};

export default UserPage;
