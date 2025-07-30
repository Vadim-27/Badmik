'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {mockBookings} from '@/data/mockBookings'; 

const Booking = () => {
     const [selectedHall, setSelectedHall] = useState('');
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);

  const { clubId } = useParams();
  const bookings = mockBookings[clubId as keyof typeof mockBookings] || [];

  const handleCourtsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedCourts(options);
  };
  return (
     <main className="p-6 max-w-6xl mx-auto">
    
      <section className="font-geist-sans mb-10">
        <h2 className="font-geist-sans text-2xl font-semibold mb-4">2. Додати тренування</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Назва тренування"
            className="font-geist-sans border p-3 rounded-md"
          />
          <input type="date" className="border p-3 rounded-md" />

          <select
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
            className="font-geist-sans border p-3 rounded-md"
          >
            <option value="" disabled>
              Оберіть зал
            </option>
            <option value="hall1">Зал 1 (10 кортів)</option>
            <option value="hall2">Зал 2 (5 кортів)</option>
          </select>

          <input type="time" className="border p-3 rounded-md" />
          <input type="number" placeholder="Макс. учасників" className="border p-3 rounded-md" />

          <select
            multiple
            value={selectedCourts}
            onChange={handleCourtsChange}
            className="border p-3 rounded-md md:col-span-2"
          >
            <option value="court1">Корт 1</option>
            <option value="court2">Корт 2</option>
            <option value="court3">Корт 3</option>
            <option value="court4">Корт 4</option>
          </select>

          <button
            type="submit"
            className="bg-primary-button
            font-geist-sans 
            text-white 
            py-2 
            rounded-md 
            md:col-span-2 
            hover:bg-primary-button-hover 
            focus:bg-primary-button-focus 
            hover:shadow-[var(--button-shadow-hover)] 
            focus:shadow-[var(--button-shadow-focus)]
            transition-all duration-150"
          >
            Створити тренування
          </button>
        </form>
      </section>

     
      <section>
      <h2 className="text-2xl font-semibold mb-4">Існуючі тренування ({clubId})</h2>
      <table className="w-full table-auto border bg-white rounded-md overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Дата</th>
            <th className="p-3 text-left">Назва</th>
            <th className="p-3 text-left">Зал</th>
            <th className="p-3 text-left">Корт(и)</th>
            <th className="p-3 text-left">Учасники</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{b.date}</td>
              <td className="p-3">{b.title}</td>
              <td className="p-3">{b.hall}</td>
              <td className="p-3">{b.courts.join(', ')}</td>
              <td className="p-3">{b.participants}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
    </main>
  );
}
export default Booking;