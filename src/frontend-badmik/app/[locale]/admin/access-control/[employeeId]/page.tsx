
import EmployeeDetail from '@/app/components/shared/Staff/StaffDetail/StaffDetail';
import { usersFromMok } from '@/data/mockUsers';

type Params = {
  employeeId: string;
};

const EmployeePage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { employeeId } = await params;
  
  const user = usersFromMok.find((u) => {
   
  return u.id === employeeId;
  
});
 
 
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
  <EmployeeDetail  />
  </div>
);
};

export default EmployeePage;