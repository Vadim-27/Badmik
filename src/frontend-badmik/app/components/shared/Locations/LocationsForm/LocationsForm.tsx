
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
import ClubSelectFieldAdd from '@/app/components/ui/InputSelectClubs/ClubSelectAdd/ClubSelectFieldAdd';
import WorkingHoursField from '@/app/components/ui/WorkingHoursField/WorkingHoursField';
// import type { WorkingHoursDto } from '@/services/types/working-hours.dto';
import type { WorkingHoursDto, TimeRangeDto } from '@/services/types/working-hours.dto';

import SportsSelector from './SportsSelector/SportsSelector';
import AmenitiesSelector from './AmenitiesSelector/AmenitiesSelector';
import ClubReadonlyField from '@/app/components/ui/InputSelectClubs/ClubReadonlyField/ClubReadonlyField';

export type LocationLabel =
  | 'None'
  | 'New'
  | 'Popular'
  | 'Recommended'
  | 'Promotion'
  | 'Verified';

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
  workingHours: WorkingHoursDto;
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
  scopedClubId?: string;
  isClubScoped?: boolean;
};

export type LocationFormHandle = {
  submit: () => void;
  isValid: () => boolean;
  getValues?: () => LocationFormValues;
};

const LABEL_OPTIONS: { value: LocationLabel | ''; label: string }[] = [
  { value: '',           label: 'None' },
  { value: 'New',        label: 'New' },
  { value: 'Popular',    label: 'Popular' },
  { value: 'Recommended', label: 'Recommended' },
  { value: 'Promotion',  label: 'Promotion' },
  { value: 'Verified',   label: 'Verified' },
];

const EMPTY_WORKING_HOURS: WorkingHoursDto = {
  monday:    { from: null, to: null },
  tuesday:   { from: null, to: null },
  wednesday: { from: null, to: null },
  thursday:  { from: null, to: null },
  friday:    { from: null, to: null },
  saturday:  { from: null, to: null },
  sunday:    { from: null, to: null },
};

const normalizeTime = (v: string | null) => {
  const t = v?.trim();
  return t ? t : null;
};

const normalizeDay = (d: TimeRangeDto | null): TimeRangeDto | null => {
  if (!d) return null;

  const from = normalizeTime(d.from);
  const to = normalizeTime(d.to);

  // якщо день НЕ заповнений повністю — для API це вихідний => null
  if (!from || !to) return null;

  return { from, to };
};

const normalizeWorkingHours = (wh: WorkingHoursDto): WorkingHoursDto => ({
  monday: normalizeDay(wh.monday),
  tuesday: normalizeDay(wh.tuesday),
  wednesday: normalizeDay(wh.wednesday),
  thursday: normalizeDay(wh.thursday),
  friday: normalizeDay(wh.friday),
  saturday: normalizeDay(wh.saturday),
  sunday: normalizeDay(wh.sunday),
});

const LocationForm = forwardRef<LocationFormHandle, Props>(function LocationForm(
  { mode, locationId, defaultValues, onSubmitCreate, onSubmitUpdate, setIsChanged, busy, scopedClubId,
    isClubScoped, },
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
        workingHours: normalizeWorkingHours(raw.workingHours),
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

      // if (mode === 'create') {
      //   reset(normalized);
      // }
      if(mode === 'create'){
        reset({
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
        });
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
                  {isClubScoped ? (
                  // 🔹 Адмін КОНКРЕТНОГО клубу: клуб зафіксований, без вибору
                  <ClubReadonlyField
                    control={control}
                    name="clubId"
                    rootClassName={styles.comboRoot}
                    inputClassName={`${styles.input} ${styles.inputChevron} ${
                      errors.clubId ? styles.errorInput : ''
                    }`}
                    forcedClubId={scopedClubId}
                  />
                ) : (
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
                />)}
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
