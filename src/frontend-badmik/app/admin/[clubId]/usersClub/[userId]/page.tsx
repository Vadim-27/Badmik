import React from 'react';
import UserDetail from '@/app/components/shared/UserDetail/UserDetail';
import { usersFromMok } from '@/data/mockUsers';

type Params = {
  userId: string;
};

const UserPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { userId } = await params;
  const user = usersFromMok.find((u) => {
 
  return u.id === userId;
});
 
 
  if (!user) return <div>User not found</div>;

  return <UserDetail user={user} />;
};

export default UserPage;
