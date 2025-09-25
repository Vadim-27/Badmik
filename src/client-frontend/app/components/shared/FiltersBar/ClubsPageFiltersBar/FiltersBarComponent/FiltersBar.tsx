"use client";

import { useMemo, useState,  } from "react";
import { Combobox } from "@headlessui/react";

// import { format } from "date-fns";


import clubsJson from "@/data/clubList.json"; // ← перевір, що файл справді тут
import PinIcon from "@/app/assets/icons/Map.svg";

import SearchIcon from "@/app/assets/icons/Search.svg";
import ArrowChevron from '@/app/assets/icons/ArrowChevron.svg';
import styles from "./FiltersBar.module.scss";
// import DateField from "./DateField/DateField";
import { Club } from "@/types/club";




// const levels = ["D", "C", "B", "A", "Masters"] as const;
// type Level = (typeof levels)[number];

export default function FiltersBar() {
  const clubs: Club[] = useMemo(() => clubsJson, []);

  const [query, setQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const filteredClubs =
    query === ""
      ? clubs
      : clubs.filter((c) =>
          c.title.toLowerCase().includes(query.toLowerCase().trim())
        );

  // const [date, setDate] = useState<Date | undefined>(undefined);
  // const [level, setLevel] = useState<Level>("A");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      clubId: selectedClub?.id ?? null,
      clubTitle: selectedClub?.title ?? null,
      // date: date ? format(date, "yyyy-MM-dd") : null,
      // level,
    });
  };

  return (
    <form className={styles.bar} onSubmit={submit}>
      {/* Клуб */}
      <div className={styles.field}>
        {/* <label className={styles.label}>Оберіть клуб</label> */}
        <div className={styles.inputBox}>
          <PinIcon className={styles.leftIcon} aria-hidden />
          <Combobox value={selectedClub} onChange={setSelectedClub} nullable>
            <Combobox.Input
              className={styles.input}
              placeholder="Знайти клуб"
              displayValue={(club: Club | null) => club?.title ?? ""}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Combobox.Button className={styles.rightBtn}>
            
              <ArrowChevron className={styles.rightIcon} aria-hidden />
            </Combobox.Button>

            {filteredClubs.length > 0 && (
              <Combobox.Options className={styles.options}>
                {filteredClubs.map((club) => (
                  <Combobox.Option
                    key={club.id}
                    value={club}
                    className={({ active }) =>
                      active ? styles.optionActive : styles.option
                    }
                  >
                    {club.title}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </Combobox>
        </div>
      </div>

      {/* Дата */}
      {/* <div className={styles.field}>
        <label className={styles.label}>Оберіть дату тренування</label>
        <DateField
  value={date}
  onChangeDateAction={setDate}
  placeholder="Дата"
  className={styles.dateBox}
/>
     
      </div> */}

      {/* Рівень */}
      {/* <div className={styles.field}>
        <label className={styles.label}>Рівень гравців</label>
        <div className={styles.levels}>
          {levels.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`${styles.levelBtn} ${
                level === l ? styles.levelActive : ""
              }`}
              aria-pressed={level === l}
            >
              {l}
            </button>
          ))}
        </div>
      </div> */}

      {/* Submit */}
      <button type="submit" className={styles.submit}>
        <SearchIcon className={styles.submitIcon} aria-hidden /> Знайти
      </button>
    </form>
  );
}



