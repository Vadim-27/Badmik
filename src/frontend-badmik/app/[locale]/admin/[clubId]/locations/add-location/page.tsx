import AddLocation from '@/app/components/shared/Locations/AddLocation/AddLocation';


type Params = {
  clubId: string;
};

const AddLocationPage = async ({ params }: { params: Params }) => {
  const {   clubId } = await params;
  return (
    <div className="pt-0 p-4 bg-gray-100 ">  
        <AddLocation clubIdParams={clubId}  />
    </div>
  );
}

export default AddLocationPage;