import UserTable from '@/app/components/shared/UserTable/UserTable';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';

const UsersClub = () => {
  return (
    <div className="p-4 w-full h-screen">
      <ActionHeader>
        <BackButton />
        <h2 className="text-lg font-semibold">Користувачі клубу</h2>
        </ActionHeader>
    
      <UserTable />
    </div>
  );
}   
export default UsersClub;