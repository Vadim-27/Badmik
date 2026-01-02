import AddEmployee from '@/app/components/shared/Staff/AddStaff/AddStaff';

type Params = {
  clubId: string;
};

const AddEmployeePage = async ({ params }: { params: Params }) => {
    const {   clubId } = await params;
  return (
    <div>
      <AddEmployee clubIdParams={clubId} />
    </div>
  );
};
export default AddEmployeePage;
