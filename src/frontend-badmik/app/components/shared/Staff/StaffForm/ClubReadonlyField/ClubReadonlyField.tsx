// // src/app/components/shared/Staff/StaffForm/ClubSelectAdd/ClubReadonlyField.tsx
// 'use client';

// import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
// import { useMemo } from 'react';

// import { useClubsList } from '@/services/clubs/queries.client';
// import type { Club } from '@/services/types/clubs.dto';

// type Props<TFieldValues extends FieldValues> = {
//   control: Control<TFieldValues>;
//   name: FieldPath<TFieldValues>;

//   rootClassName?: string;
//   inputClassName?: string;
//   /**
//    * Якщо хочеш – можна явно передати clubId ззовні.
//    * Якщо не передавати, воно візьме значення з RHF (field.value),
//    * яке при create/edit має прийти з defaultValues (з бекенду).
//    */
//   forcedClubId?: string;
// };

// const uuidRegex =
//   /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

// export default function ClubReadonlyField<TFieldValues extends FieldValues>({
//   control,
//   name,
//   rootClassName,
//   inputClassName,
//   forcedClubId,
// }: Props<TFieldValues>) {
//   const { data: clubsData = [] } = useClubsList();

//   const clubs: Club[] = useMemo(() => {
//     if (Array.isArray(clubsData)) return clubsData as Club[];
//     if (clubsData && Array.isArray((clubsData as any).result)) {
//       return (clubsData as any).result as Club[];
//     }
//     return [];
//   }, [clubsData]);

//   return (
//     <Controller
//       control={control}
//       name={name}
//       rules={{
//         required: 'Потрібно обрати клуб.',
//         pattern: { value: uuidRegex, message: 'Некоректний UUID' },
//       }}
//       render={({ field, fieldState }) => {
//         // Значення клубу беремо або з форсованого ID, або з RHF
//         const value: string | '' =
//           (forcedClubId ?? (field.value as string) ?? '') || '';

//         // Знайти клуб по id
//         const club = clubs.find((c) => c.id === value) ?? null;

//         const label = club
//           ? `${club.name ?? 'Клуб без назви'}${club.address ? ` — ${club.address}` : ''}`
//           : '';

//         // ВАЖЛИВО: якщо forcedClubId переданий і відрізняється від field.value,
//         // синхронізуємо стан форми (але без циклу — тільки якщо реально різні)
//         if (forcedClubId && field.value !== forcedClubId) {
//           field.onChange(forcedClubId);
//         }

//         return (
//           <div className={rootClassName}>
//             {/* Інпут лише для відображення, без можливості редагувати */}
//             <input
//               className={`${inputClassName ?? ''} ${
//                 fieldState.error ? 'border-red-500' : ''
//               }`}
//               type="text"
//               value={label || 'Клуб не знайдено'}
//               readOnly
//             />

//             {fieldState.error && (
//               <p className="mt-1 text-sm text-red-500">
//                 {fieldState.error.message}
//               </p>
//             )}
//           </div>
//         );
//       }}
//     />
//   );
// }
