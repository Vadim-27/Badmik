// 'use client';

// import { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
// import { useForm } from 'react-hook-form';
// import styles from './LocationsForm.module.scss';
// import ScrollArea from '@/app/components/ui/Scroll/ScrollArea';
// import ClubSelectFieldAdd from '@/app/components/shared/Staff/StaffForm/ClubSelectAdd/ClubSelectFieldAdd';
// import WorkingHoursField from '@/app/components/ui/WorkingHoursField/WorkingHoursField';
// import type { WorkingHourDto } from '@/app/components/ui/WorkingHoursField/WorkingHoursField';

// import AmenitiesSelector from './AmenitiesSelector/AmenitiesSelector';
// import SportsSelector from './SportsSelector/SportsSelector';

// export type LocationLabel = 'None' | 'Main' | 'Secondary' | 'Promo';

// export type LocationFormValues = {
//   clubId: string;
//   label: LocationLabel | '';
//   name: string;
//   city: string;
//   address: string;

//   priceText?: string; // "від 500 ₴"
//   order: number;
//   isActive: boolean;

//   sports: {
//     badmintonEnabled: boolean;
//     badmintonCourts: number;
//     squashEnabled: boolean;
//     squashCourts: number;
//     padelEnabled: boolean;
//     padelCourts: number;
//     pickleballEnabled: boolean;
//     pickleballCourts: number;
//     tableTennisEnabled: boolean;
//     tableTennisTables: number;
//     tennisEnabled: boolean;
//     tennisCourts: number;
//   };

//   amenities: {
//     parking: boolean;
//     water: boolean;
//     conditioner: boolean;
//     shower: boolean;
//     wifi: boolean;
//   };

//   shortDescription?: string;
//   workingHours: WorkingHourDto;
// };

// type Props = {
//   mode: 'create' | 'edit';
//   locationId?: string;
//   defaultValues?: Partial<LocationFormValues>;
//   onSubmitCreate?: (data: LocationFormValues) => Promise<void>;
//   onSubmitUpdate?: (locationId: string, data: LocationFormValues) => Promise<void>;
//   isChanged?: boolean;
//   setIsChanged?: (v: boolean) => void;
//   busy?: boolean;
// };

// export type LocationFormHandle = {
//   submit: () => void;
//   isValid: () => boolean;
//   getValues?: () => LocationFormValues;
// };

// const LABEL_OPTIONS: { value: LocationLabel | ''; label: string }[] = [
//   { value: '', label: 'None' },
//   { value: 'Main', label: 'Main' },
//   { value: 'Secondary', label: 'Secondary' },
//   { value: 'Promo', label: 'Promo' },
// ];

// const LocationForm = forwardRef<LocationFormHandle, Props>(function LocationForm(
//   { mode, locationId, defaultValues, onSubmitCreate, onSubmitUpdate, setIsChanged, busy },
//   ref
// ) {
//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors, isDirty, isValid },
//     getValues,
//     setValue,
//     watch,
//   } = useForm<LocationFormValues>({
//     mode: 'all',
//     defaultValues: {
//       clubId: '',
//       label: '',
//       name: '',
//       city: '',
//       address: '',
//       priceText: '',
//       order: 1,
//       isActive: true,
//       sports: {
//         badmintonEnabled: true,
//         badmintonCourts: 1,
//         squashEnabled: false,
//         squashCourts: 0,
//         padelEnabled: false,
//         padelCourts: 0,
//         pickleballEnabled: false,
//         pickleballCourts: 0,
//         tableTennisEnabled: false,
//         tableTennisTables: 0,
//         tennisEnabled: false,
//         tennisCourts: 0,
//       },
//       amenities: {
//         parking: false,
//         water: false,
//         conditioner: false,
//         shower: false,
//         wifi: false,
//       },
//       shortDescription: '',
//       ...defaultValues,
//     },
//   });

//   useEffect(() => {
//     setIsChanged?.(isDirty && isValid);
//   }, [isDirty, isValid, setIsChanged]);

//   const submitHandler = useCallback(
//     async (raw: LocationFormValues) => {
//       const normalized: LocationFormValues = {
//         ...raw,
//         priceText: raw.priceText?.trim() || '',
//         order: Number.isFinite(raw.order) ? raw.order : 1,
//         sports: {
//           ...raw.sports,
//           badmintonCourts: Number(raw.sports.badmintonCourts) || 0,
//           squashCourts: Number(raw.sports.squashCourts) || 0,
//           padelCourts: Number(raw.sports.padelCourts) || 0,
//           pickleballCourts: Number(raw.sports.pickleballCourts) || 0,
//           tableTennisTables: Number(raw.sports.tableTennisTables) || 0,
//           tennisCourts: Number(raw.sports.tennisCourts) || 0,
//         },
//       };

//       if (locationId && onSubmitUpdate) {
//         await onSubmitUpdate(locationId, normalized);
//       } else if (onSubmitCreate) {
//         await onSubmitCreate(normalized);
//       }

//       if (mode === 'create') {
//         reset(normalized);
//       }

//       setIsChanged?.(false);
//     },
//     [locationId, mode, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
//   );

//   useImperativeHandle(
//     ref,
//     () => ({
//       submit: () =>
//         handleSubmit(submitHandler, (errs) => {
//           console.error('❌ LocationForm validation errors:', errs);
//           console.error('🧪 LocationForm current values:', getValues());
//         })(),
//       isValid: () => Boolean(isValid),
//       getValues: () => getValues() as LocationFormValues,
//     }),
//     [handleSubmit, submitHandler, isValid, getValues]
//   );

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.formBox}>
//         <ScrollArea className={styles.formScroll}>
//           <form onSubmit={handleSubmit(submitHandler)} className={styles.form} noValidate>
//             {/* 1 ряд: Клуб + Мітка */}
//             <div className={styles.formGrid}>
//               <div>
//                 <label className={styles.label}>
//                   Клуб <span style={{ color: '#e63946' }}>*</span>
//                 </label>
//                 <ClubSelectFieldAdd
//                   control={control}
//                   name="clubId"
//                   rootClassName={styles.comboRoot}
//                   inputClassName={`${styles.input} ${styles.inputChevron} ${
//                     errors.clubId ? styles.errorInput : ''
//                   }`}
//                   optionsClassName={styles.options}
//                   optionClassName={styles.option}
//                   optionActiveClassName={styles.optionActive}
//                   chevronClassName={styles.comboChevron}
//                 />
//                 {errors.clubId && <p className={styles.errorText}>{errors.clubId.message}</p>}
//               </div>

//               <div>
//                 <label className={styles.label}>Мітка (label)</label>
//                 <select
//                   className={`${styles.select} ${errors.label ? styles.errorInput : ''}`}
//                   {...register('label')}
//                 >
//                   {LABEL_OPTIONS.map((opt) => (
//                     <option key={opt.value || 'none'} value={opt.value}>
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.label && (
//                   <p className={styles.errorText}>{errors.label.message as string}</p>
//                 )}
//               </div>
//             </div>

//             {/* 2 ряд: Назва локації + Місто */}
//             <div className={styles.formGrid}>
//               <div>
//                 <label className={styles.label}>
//                   Назва локації <span style={{ color: '#e63946' }}>*</span>
//                 </label>
//                 <input
//                   className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
//                   {...register('name', {
//                     required: 'Обовʼязково',
//                     minLength: { value: 2, message: 'Занадто коротка назва' },
//                     maxLength: { value: 120, message: 'Занадто довга назва' },
//                   })}
//                   placeholder="Badmik Оболонь"
//                 />
//                 {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
//               </div>

//               <div>
//                 <label className={styles.label}>
//                   Місто <span style={{ color: '#e63946' }}>*</span>
//                 </label>
//                 <input
//                   className={`${styles.input} ${errors.city ? styles.errorInput : ''}`}
//                   {...register('city', {
//                     required: 'Обовʼязково',
//                     maxLength: { value: 80, message: 'Занадто довга назва міста' },
//                   })}
//                   placeholder="Київ"
//                 />
//                 {errors.city && <p className={styles.errorText}>{errors.city.message}</p>}
//               </div>
//             </div>

//             {/* Адреса — повна ширина */}
//             <div>
//               <label className={styles.label}>
//                 Адреса <span style={{ color: '#e63946' }}>*</span>
//               </label>
//               <input
//                 className={`${styles.input} ${errors.address ? styles.errorInput : ''}`}
//                 {...register('address', {
//                   required: 'Обовʼязково',
//                   minLength: { value: 5, message: 'Занадто коротка адреса' },
//                   maxLength: { value: 200, message: 'Занадто довга адреса' },
//                 })}
//                 placeholder="просп. Оболонський, 16-Б"
//               />
//               {errors.address && <p className={styles.errorText}>{errors.address.message}</p>}
//             </div>

//             {/* Ціна + Порядок + чекбокс активності */}
//             <div className={styles.row3}>
//               <div>
//                 <label className={styles.label}>Ціна (текстова)</label>
//                 <input
//                   className={`${styles.input} ${errors.priceText ? styles.errorInput : ''}`}
//                   {...register('priceText', {
//                     maxLength: { value: 60, message: 'Занадто довгий текст' },
//                   })}
//                   placeholder="від 500 ₴"
//                 />
//                 {errors.priceText && <p className={styles.errorText}>{errors.priceText.message}</p>}
//               </div>

//               <div>
//                 <label className={styles.label}>Порядок</label>
//                 <input
//                   type="number"
//                   min={1}
//                   className={`${styles.input} ${errors.order ? styles.errorInput : ''}`}
//                   {...register('order', {
//                     valueAsNumber: true,
//                     min: { value: 1, message: 'Мінімум 1' },
//                   })}
//                   onWheel={(e) => e.currentTarget.blur()}
//                 />
//                 {errors.order && <p className={styles.errorText}>{errors.order.message}</p>}
//               </div>

//               <div className={styles.activeRow}>
//                 <label className={styles.label}>Локація</label>

//                 <div className={styles.radioGroup}>
//                   <label
//                     className={`${styles.radioBtn} ${
//                       getValues('isActive') ? styles.radioBtnActive : ''
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       value="true"
//                       {...register('isActive')}
//                       onChange={() => setValue('isActive', true, { shouldDirty: true })}
//                     />
//                     Активна
//                   </label>

//                   <label
//                     className={`${styles.radioBtn} ${
//                       !getValues('isActive') ? styles.radioBtnActive : ''
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       value="false"
//                       {...register('isActive')}
//                       onChange={() => setValue('isActive', false, { shouldDirty: true })}
//                     />
//                     Неактивна
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Види спорту та кількість кортів */}
//             {/* <div> */}
//               {/* <label className={styles.label}>Види спорту та кількість кортів</label>

//               <div className={styles.sportGrid}> */}
//                 {/* Badminton */}
//                 {/* <div className={styles.sportItem}>
//                   <label className={styles.checkboxLabel}>
//                     <input type="checkbox" {...register('sports.badmintonEnabled')} />
//                     <span>Badminton</span>
//                   </label>
//                   <div className={styles.sportInputRow}>
//                     <span className={styles.sportUnits}>Корти:</span>
//                     <input
//                       type="number"
//                       min={0}
//                       className={styles.sportInput}
//                       {...register('sports.badmintonCourts', {
//                         valueAsNumber: true,
//                         min: { value: 0, message: '≥ 0' },
//                       })}
//                       onWheel={(e) => e.currentTarget.blur()}
//                     />
//                   </div>
//                 </div> */}

//                 {/* Squash */}
//                 {/* <div className={styles.sportItem}>
//                   <label className={styles.checkboxLabel}>
//                     <input type="checkbox" {...register('sports.squashEnabled')} />
//                     <span>Squash</span>
//                   </label>
//                   <div className={styles.sportInputRow}>
//                     <span className={styles.sportUnits}>Корти:</span>
//                     <input
//                       type="number"
//                       min={0}
//                       className={styles.sportInput}
//                       {...register('sports.squashCourts', {
//                         valueAsNumber: true,
//                         min: { value: 0, message: '≥ 0' },
//                       })}
//                       onWheel={(e) => e.currentTarget.blur()}
//                     />
//                   </div>
//                 </div> */}

//                 {/* TableTennis */}
//                 {/* <div className={styles.sportItem}>
//                   <label className={styles.checkboxLabel}>
//                     <input type="checkbox" {...register('sports.tableTennisEnabled')} />
//                     <span>TableTennis</span>
//                   </label>
//                   <div className={styles.sportInputRow}>
//                     <span className={styles.sportUnits}>Столи:</span>
//                     <input
//                       type="number"
//                       min={0}
//                       className={styles.sportInput}
//                       {...register('sports.tableTennisTables', {
//                         valueAsNumber: true,
//                         min: { value: 0, message: '≥ 0' },
//                       })}
//                       onWheel={(e) => e.currentTarget.blur()}
//                     />
//                   </div>
//                 </div> */}

//                 {/* Padel */}
//                 {/* <div className={styles.sportItem}>
//                   <label className={styles.checkboxLabel}>
//                     <input type="checkbox" {...register('sports.padelEnabled')} />
//                     <span>Padel</span>
//                   </label>
//                   <div className={styles.sportInputRow}>
//                     <span className={styles.sportUnits}>Корти:</span>
//                     <input
//                       type="number"
//                       min={0}
//                       className={styles.sportInput}
//                       {...register('sports.padelCourts', {
//                         valueAsNumber: true,
//                         min: { value: 0, message: '≥ 0' },
//                       })}
//                       onWheel={(e) => e.currentTarget.blur()}
//                     />
//                   </div>
//                 </div> */}

//                 {/* Pickleball */}
//                 {/* <div className={styles.sportItem}>
//                   <label className={styles.checkboxLabel}>
//                     <input type="checkbox" {...register('sports.pickleballEnabled')} />
//                     <span>Pickleball</span>
//                   </label>
//                   <div className={styles.sportInputRow}>
//                     <span className={styles.sportUnits}>Корти:</span>
//                     <input
//                       type="number"
//                       min={0}
//                       className={styles.sportInput}
//                       {...register('sports.pickleballCourts', {
//                         valueAsNumber: true,
//                         min: { value: 0, message: '≥ 0' },
//                       })}
//                       onWheel={(e) => e.currentTarget.blur()}
//                     />
//                   </div>
//                 </div> */}

//                 {/* Tennis */}
//                 {/* <div className={styles.sportItem}>
//                   <label className={styles.checkboxLabel}>
//                     <input type="checkbox" {...register('sports.tennisEnabled')} />
//                     <span>Tennis</span>
//                   </label>
//                   <div className={styles.sportInputRow}>
//                     <span className={styles.sportUnits}>Корти:</span>
//                     <input
//                       type="number"
//                       min={0}
//                       className={styles.sportInput}
//                       {...register('sports.tennisCourts', {
//                         valueAsNumber: true,
//                         min: { value: 0, message: '≥ 0' },
//                       })}
//                       onWheel={(e) => e.currentTarget.blur()}
//                     />
//                   </div>
//                 </div> */}
//               {/* </div> */}

//               {/* <p className={styles.help}>
//                 Після збереження система автоматично синхронізує список кортів (створить/деактивує
//                 Court).
//               </p> */}
//             {/* </div> */}


//             {/*===========  New Section ===========*/}
//             {/* Види спорту та кількість кортів */}
// <SportsSelector
//   labelClassName={styles.label}
//   helpClassName={styles.help}
//   register={register}
//   watch={watch}
//   setValue={setValue}
// />
//             {/* <div>
//   <label className={styles.label}>Види спорту та кількість кортів</label>

//   <div className={styles.sportGrid}>
    
//     {[
//       { key: "badminton", label: "Badminton", unit: "Корти" },
//       { key: "squash", label: "Squash", unit: "Корти" },
//       { key: "tableTennis", label: "TableTennis", unit: "Столи" },
//       { key: "padel", label: "Padel", unit: "Корти" },
//       { key: "pickleball", label: "Pickleball", unit: "Корти" },
//       { key: "tennis", label: "Tennis", unit: "Корти" },
//     ].map((sport) => {
//       const enabledName = `sports.${sport.key}Enabled` as const;
//       const courtsName =
//         sport.unit === "Столи"
//           ? (`sports.${sport.key}Tables` as const)
//           : (`sports.${sport.key}Courts` as const);

//       const isEnabled = watch(enabledName);

//       return (
//         <div key={sport.key} className={styles.sportItem}>
          
//           <label
//             className={`${styles.sportBtn} ${
//               isEnabled ? styles.sportBtnActive : ""
//             }`}
//           >
//             <input
//               type="checkbox"
//               {...register(enabledName)}
//               onChange={(e) =>
//                 setValue(enabledName, e.target.checked, { shouldDirty: true })
//               }
//             />
//             {sport.label}
//           </label>

//           <div className={styles.sportInputRow}>
//             <span className={styles.sportUnits}>{sport.unit}:</span>
//             <input
//               type="number"
//               min={0}
//               disabled={!isEnabled}
//               className={styles.sportInput}
//               {...register(courtsName, {
//                 valueAsNumber: true,
//                 min: { value: 0, message: "≥ 0" },
//               })}
//               onWheel={(e) => e.currentTarget.blur()}
//             />
//           </div>
//         </div>
//       );
//     })}
//   </div>

//   <p className={styles.help}>
//     Після збереження система автоматично синхронізує список кортів (створить/деактивує Court).
//   </p>
// </div> */}

//             {/* Зручності (amenities) */}
//             {/* <div>
//               <label className={styles.label}>Зручності (amenities)</label>
//               <div className={styles.checkboxRow}>
//                 <label className={styles.chip}>
//                   <input type="checkbox" {...register('amenities.parking')} />
//                   <span>Парковка</span>
//                 </label>
//                 <label className={styles.chip}>
//                   <input type="checkbox" {...register('amenities.water')} />
//                   <span>Вода</span>
//                 </label>
//                 <label className={styles.chip}>
//                   <input type="checkbox" {...register('amenities.conditioner')} />
//                   <span>Кондиціонер</span>
//                 </label>
//                 <label className={styles.chip}>
//                   <input type="checkbox" {...register('amenities.shower')} />
//                   <span>Душ</span>
//                 </label>
//                 <label className={styles.chip}>
//                   <input type="checkbox" {...register('amenities.wifi')} />
//                   <span>WiFi</span>
//                 </label>
//               </div>
//             </div> */}

//             {/* Зручності (amenities) */}
            
// <AmenitiesSelector
//   labelClassName={styles.label}
//   register={register}
//   watch={watch}
//   setValue={setValue}
// />
// {/* <div>
//   <label className={styles.label}>Зручності (amenities)</label>

//   <div className={styles.amenitiesRow}>
//     {[
//       { key: "parking", label: "Парковка" },
//       { key: "water", label: "Вода" },
//       { key: "conditioner", label: "Кондиціонер" },
//       { key: "shower", label: "Душ" },
//       { key: "wifi", label: "WiFi" },
//     ].map((item) => {
//       const fieldName = `amenities.${item.key}` as const;
//       const checked = watch(fieldName);

//       return (
//         <label
//           key={item.key}
//           className={`${styles.chip} ${checked ? styles.chipActive : ""}`}
//         >
//           <input
//             type="checkbox"
//             {...register(fieldName)}
//             onChange={(e) =>
//               setValue(fieldName, e.target.checked, { shouldDirty: true })
//             }
//           />
//           <span>{item.label}</span>
//         </label>
//       );
//     })}
//   </div>
// </div> */}

//             {/* Короткий опис */}
//             <div>
//               <label className={styles.label}>Короткий опис</label>
//               <textarea
//                 rows={4}
//                 className={`${styles.textarea} ${errors.shortDescription ? styles.errorInput : ''}`}
//                 placeholder="Короткий текст, який буде показано на картці локації…"
//                 {...register('shortDescription', {
//                   maxLength: { value: 600, message: 'До 600 символів' },
//                 })}
//               />
//               {errors.shortDescription && (
//                 <p className={styles.errorText}>{errors.shortDescription.message as string}</p>
//               )}
//             </div>
//             {/* Робочі години */}
//             <div>
//               {/* <label className={styles.label}>Робочі години</label> */}
//               <WorkingHoursField
//                 control={control}
//                 name="workingHours"
//               />
//             </div>



//           </form>
//         </ScrollArea>
//       </div>

//       {Boolean(busy) && (
//         <div className={styles.busyOverlay}>
//           <div className="spinner" />
//         </div>
//       )}
//     </div>
//   );
// });

// export default LocationForm;



//========================================================



'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import { useForm } from 'react-hook-form';
import styles from './LocationsForm.module.scss';

import ScrollArea from '@/app/components/ui/Scroll/ScrollArea';
import ClubSelectFieldAdd from '@/app/components/shared/Staff/StaffForm/ClubSelectAdd/ClubSelectFieldAdd';
import WorkingHoursField, {
  type WorkingHourDto,
} from '@/app/components/ui/WorkingHoursField/WorkingHoursField';

import SportsSelector from './SportsSelector/SportsSelector';
import AmenitiesSelector from './AmenitiesSelector/AmenitiesSelector';

export type LocationLabel = 'None' | 'Main' | 'Secondary' | 'Promo';

export type LocationFormValues = {
  clubId: string;
  label: LocationLabel | '';
  name: string;
  city: string;
  address: string;

  priceText?: string;
  order: number;
  isActive: boolean;

  sports: {
    badmintonEnabled: boolean;
    badmintonCourts: number;
    squashEnabled: boolean;
    squashCourts: number;
    padelEnabled: boolean;
    padelCourts: number;
    pickleballEnabled: boolean;
    pickleballCourts: number;
    tableTennisEnabled: boolean;
    tableTennisTables: number;
    tennisEnabled: boolean;
    tennisCourts: number;
  };

  amenities: {
    parking: boolean;
    water: boolean;
    conditioner: boolean;
    shower: boolean;
    wifi: boolean;
  };

  shortDescription?: string;
  workingHours: WorkingHourDto;
};

type Props = {
  mode: 'create' | 'edit';
  locationId?: string;
  defaultValues?: Partial<LocationFormValues>;
  onSubmitCreate?: (data: LocationFormValues) => Promise<void>;
  onSubmitUpdate?: (locationId: string, data: LocationFormValues) => Promise<void>;
  isChanged?: boolean;
  setIsChanged?: (v: boolean) => void;
  busy?: boolean;
};

export type LocationFormHandle = {
  submit: () => void;
  isValid: () => boolean;
  getValues?: () => LocationFormValues;
};

const LABEL_OPTIONS: { value: LocationLabel | ''; label: string }[] = [
  { value: '',        label: 'None' },
  { value: 'Main',    label: 'Main' },
  { value: 'Secondary', label: 'Secondary' },
  { value: 'Promo',   label: 'Promo' },
];

const EMPTY_WORKING_HOURS: WorkingHourDto = {
  monday:    { from: null, to: null },
  tuesday:   { from: null, to: null },
  wednesday: { from: null, to: null },
  thursday:  { from: null, to: null },
  friday:    { from: null, to: null },
  saturday:  { from: null, to: null },
  sunday:    { from: null, to: null },
};

const LocationForm = forwardRef<LocationFormHandle, Props>(function LocationForm(
  { mode, locationId, defaultValues, onSubmitCreate, onSubmitUpdate, setIsChanged, busy },
  ref
) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
    getValues,
    setValue,
  } = useForm<LocationFormValues>({
    mode: 'all',
    defaultValues: {
      clubId: '',
      label: '',
      name: '',
      city: '',
      address: '',
      priceText: '',
      order: 1,
      isActive: true,
      sports: {
        badmintonEnabled: true,
        badmintonCourts: 1,
        squashEnabled: false,
        squashCourts: 0,
        padelEnabled: false,
        padelCourts: 0,
        pickleballEnabled: false,
        pickleballCourts: 0,
        tableTennisEnabled: false,
        tableTennisTables: 0,
        tennisEnabled: false,
        tennisCourts: 0,
      },
      amenities: {
        parking: false,
        water: false,
        conditioner: false,
        shower: false,
        wifi: false,
      },
      shortDescription: '',
      workingHours: EMPTY_WORKING_HOURS,
      ...defaultValues,
    },
  });

  useEffect(() => {
    setIsChanged?.(isDirty && isValid);
  }, [isDirty, isValid, setIsChanged]);

  const submitHandler = useCallback(
    async (raw: LocationFormValues) => {
      const normalized: LocationFormValues = {
        ...raw,
        priceText: raw.priceText?.trim() || '',
        order: Number.isFinite(raw.order) ? raw.order : 1,
        sports: {
          ...raw.sports,
          badmintonCourts: Number(raw.sports.badmintonCourts) || 0,
          squashCourts: Number(raw.sports.squashCourts) || 0,
          padelCourts: Number(raw.sports.padelCourts) || 0,
          pickleballCourts: Number(raw.sports.pickleballCourts) || 0,
          tableTennisTables: Number(raw.sports.tableTennisTables) || 0,
          tennisCourts: Number(raw.sports.tennisCourts) || 0,
        },
      };

      if (locationId && onSubmitUpdate) {
        await onSubmitUpdate(locationId, normalized);
      } else if (onSubmitCreate) {
        await onSubmitCreate(normalized);
      }

      if (mode === 'create') {
        reset(normalized);
      }

      setIsChanged?.(false);
    },
    [locationId, mode, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
  );

  useImperativeHandle(
    ref,
    () => ({
      submit: () =>
        handleSubmit(submitHandler, (errs) => {
          console.error('❌ LocationForm validation errors:', errs);
          console.error('🧪 LocationForm current values:', getValues());
        })(),
      isValid: () => Boolean(isValid),
      getValues: () => getValues() as LocationFormValues,
    }),
    [handleSubmit, submitHandler, isValid, getValues]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <ScrollArea className={styles.formScroll}>
          <form onSubmit={handleSubmit(submitHandler)} className={styles.form} noValidate>
            {/* 1 ряд: Клуб + мітка */}
            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>
                  Клуб <span style={{ color: '#e63946' }}>*</span>
                </label>
                <ClubSelectFieldAdd
                  control={control}
                  name="clubId"
                  rootClassName={styles.comboRoot}
                  inputClassName={`${styles.input} ${styles.inputChevron} ${
                    errors.clubId ? styles.errorInput : ''
                  }`}
                  optionsClassName={styles.options}
                  optionClassName={styles.option}
                  optionActiveClassName={styles.optionActive}
                  chevronClassName={styles.comboChevron}
                />
                {errors.clubId && <p className={styles.errorText}>{errors.clubId.message}</p>}
              </div>

              <div>
                <label className={styles.label}>Мітка (label)</label>
                <select
                  className={`${styles.select} ${errors.label ? styles.errorInput : ''}`}
                  {...register('label')}
                >
                  {LABEL_OPTIONS.map((opt) => (
                    <option key={opt.value || 'none'} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.label && (
                  <p className={styles.errorText}>{errors.label.message as string}</p>
                )}
              </div>
            </div>

            {/* 2 ряд: Назва локації + Місто */}
            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>
                  Назва локації <span style={{ color: '#e63946' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
                  {...register('name', {
                    required: 'Обовʼязково',
                    minLength: { value: 2, message: 'Занадто коротка назва' },
                    maxLength: { value: 120, message: 'Занадто довга назва' },
                  })}
                  placeholder="Badmik Оболонь"
                />
                {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
              </div>

              <div>
                <label className={styles.label}>
                  Місто <span style={{ color: '#e63946' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.city ? styles.errorInput : ''}`}
                  {...register('city', {
                    required: 'Обовʼязково',
                    maxLength: { value: 80, message: 'Занадто довга назва міста' },
                  })}
                  placeholder="Київ"
                />
                {errors.city && <p className={styles.errorText}>{errors.city.message}</p>}
              </div>
            </div>

            {/* Адреса — повна ширина */}
            <div>
              <label className={styles.label}>
                Адреса <span style={{ color: '#e63946' }}>*</span>
              </label>
              <input
                className={`${styles.input} ${errors.address ? styles.errorInput : ''}`}
                {...register('address', {
                  required: 'Обовʼязково',
                  minLength: { value: 5, message: 'Занадто коротка адреса' },
                  maxLength: { value: 200, message: 'Занадто довга адреса' },
                })}
                placeholder="просп. Оболонський, 16-Б"
              />
              {errors.address && <p className={styles.errorText}>{errors.address.message}</p>}
            </div>

            {/* Ціна + Порядок + Активність */}
            <div className={styles.row3}>
              <div>
                <label className={styles.label}>Ціна (текстова)</label>
                <input
                  className={`${styles.input} ${errors.priceText ? styles.errorInput : ''}`}
                  {...register('priceText', {
                    maxLength: { value: 60, message: 'Занадто довгий текст' },
                  })}
                  placeholder="від 500 ₴"
                />
                {errors.priceText && <p className={styles.errorText}>{errors.priceText.message}</p>}
              </div>

              <div>
                <label className={styles.label}>Порядок</label>
                <input
                  type="number"
                  min={1}
                  className={`${styles.input} ${errors.order ? styles.errorInput : ''}`}
                  {...register('order', {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Мінімум 1' },
                  })}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                {errors.order && <p className={styles.errorText}>{errors.order.message}</p>}
              </div>

              <div className={styles.activeRow}>
                <label className={styles.label}>Локація</label>

                <div className={styles.radioGroup}>
                  <label
                    className={`${styles.radioBtn} ${
                      getValues('isActive') ? styles.radioBtnActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      value="true"
                      checked={getValues('isActive') === true}
                      onChange={() => setValue('isActive', true, { shouldDirty: true })}
                    />
                    Активна
                  </label>

                  <label
                    className={`${styles.radioBtn} ${
                      !getValues('isActive') ? styles.radioBtnActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      value="false"
                      checked={getValues('isActive') === false}
                      onChange={() => setValue('isActive', false, { shouldDirty: true })}
                    />
                    Неактивна
                  </label>
                </div>
              </div>
            </div>

            {/* Види спорту + к-сть кортів (винесено в компонент) */}
            <SportsSelector
              control={control}
              labelClassName={styles.label}
              helpClassName={styles.help}
            />

            {/* Зручності (amenities) — окремий компонент */}
            <AmenitiesSelector
              control={control}
              labelClassName={styles.label}
            />

            {/* Короткий опис */}
            <div>
              <label className={styles.label}>Короткий опис</label>
              <textarea
                rows={4}
                className={`${styles.textarea} ${
                  errors.shortDescription ? styles.errorInput : ''
                }`}
                placeholder="Короткий текст, який буде показано на картці локації…"
                {...register('shortDescription', {
                  maxLength: { value: 600, message: 'До 600 символів' },
                })}
              />
              {errors.shortDescription && (
                <p className={styles.errorText}>{errors.shortDescription.message as string}</p>
              )}
            </div>

            {/* Робочі години */}
            <WorkingHoursField control={control} name="workingHours" />
          </form>
        </ScrollArea>
      </div>

      {Boolean(busy) && (
        <div className={styles.busyOverlay}>
          <div className="spinner" />
        </div>
      )}
    </div>
  );
});

export default LocationForm;
