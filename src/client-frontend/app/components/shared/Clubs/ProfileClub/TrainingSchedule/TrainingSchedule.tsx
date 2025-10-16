"use client";



import FrameDot from "@/app/assets/icons/FrameDot.svg";
import TimeSlider from "./TimeSlider/TimeSlider";
import ScheduleDay from "./ScheduleDay/ScheduleDay";
import styles from "./TrainingSchedule.module.scss";

// type Coaches = {
//   id: number;
//   name: string;
//   specialization: string;
//   image: string;
// };

const TrainingSchedule = () => {
//   const data = coaches as Coaches[];
//   console.log(" data:", data);

  return (
    <section className="containerPage">
      <h2 className={styles.heading}>Тренери клубу</h2>
        <TimeSlider />
        <ScheduleDay />


    </section>
  );
};

export default TrainingSchedule;