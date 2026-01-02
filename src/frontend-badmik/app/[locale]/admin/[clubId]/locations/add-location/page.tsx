import AddLocation from '@/app/components/shared/Locations/AddLocation/AddLocation';


type Params = {
  clubId: string;
};

const AddLocationPage = async ({ params }: { params: Params }) => {
  const {   clubId } = await params;
  return (
    <div className="p-6 bg-gray-100 min-h-screen">  
        <AddLocation clubIdParams={clubId}  />
    </div>
  );
}

export default AddLocationPage;