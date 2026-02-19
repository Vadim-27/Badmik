import AddUser from '@/app/components/shared/Players/AddPlayer/AddPlayer';
type Params = {
  playerId: string;
  clubId: string;
};

const AddPlayerPage = async ({ params }: { params: Params }) => {

    const { playerId, clubId } = await params;
    return (
    <div>
        <AddUser clubIdParams={clubId} />
    </div>
);
};
export default AddPlayerPage;