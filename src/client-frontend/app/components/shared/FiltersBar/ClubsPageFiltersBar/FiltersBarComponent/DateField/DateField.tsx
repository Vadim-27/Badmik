"use client";

import {  useState, useRef, useEffect } from "react";

import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { uk } from "date-fns/locale";


import CalendarIcon from "@/app/assets/icons/calendar.svg";

import styles from "./DateField.module.scss";
import 'react-day-picker/dist/style.css';

export default function DateField({
  value,
  onChangeDateAction,
  placeholder,
  className,
}: {
  value?: Date;
  onChangeDateAction: (d?: Date) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={className} ref={boxRef}>
     
      <button
        type="button"
        className={styles.dateTrigger}
        onClick={() => setOpen((v) => !v)}
      >
        {value ? format(value, "d MMMM yyyy", { locale: uk }) : (placeholder ?? "")}
      </button>

    
      <CalendarIcon className={styles.calendarIconRight} aria-hidden />

    
      {open && (
        <div className={styles.popContent}>
            <DayPicker
    mode="single"
    locale={uk}
    selected={value}
    onSelect={(d) => {
      onChangeDateAction(d);
      setOpen(false);
    }}
    weekStartsOn={1}
  />
        </div>
      )}
    </div>
  );
}