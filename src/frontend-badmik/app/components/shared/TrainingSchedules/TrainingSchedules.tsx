import TrainingSchedulesComponent from "./TrainingSchedulesComponent/TrainingSchedulesComponent";

type Props = {
  clubId: string;
  locationId: string;
};

export default function TrainingSchedules({ clubId, locationId }: Props) {
  return (
    <div>
      <TrainingSchedulesComponent clubId={clubId} locationId={locationId} />
      
    </div>
  );
}