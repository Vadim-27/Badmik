import UserTable from '@/app/components/shared/UserTable/UserTable';

const UsersClub = () => {
  return (
    <div className="p-4 w-full h-screen">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <UserTable />
    </div>
  );
}   
export default UsersClub;