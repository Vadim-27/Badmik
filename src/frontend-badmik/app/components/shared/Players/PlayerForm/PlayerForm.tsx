'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import styles from './PlayerForm.module.scss';
import ScrollArea from '@/app/components/ui/Scroll/ScrollArea';
import { useTranslations } from 'next-intl';

import ClubSelectFieldAdd from '@/app/components/ui/InputSelectClubs/ClubSelectAdd/ClubSelectFieldAdd';
import ClubReadonlyField from '@/app/components/ui/InputSelectClubs/ClubReadonlyField/ClubReadonlyField';

import type {
  Gender,
  Player,
  PlayerSportProfile,
  CreatePlayerDto,
  UpdatePlayerDto,
} from '@/services/types/players.dto';

import PlayersSportsSelector from './PlayersSportsSelector/PlayersSportsSelector';
import GenderSelector from './GenderSelector/GenderSelector';
import AvatarUploader from '@/app/components/ui/AvatarUploader/AvatarUploader';
import { useUploadPlayerPhoto, useDeletePlayerPhoto } from '@/services/players/queries.client';

const nameOnlyLetters = /^[\p{L}'’-]+$/u;
const noWhitespace = /^\S+$/;
const hasDigit = /\d/;
const hasUpper = /[A-Z]/;
const hasLower = /[a-z]/;
const hasSpecial = /[!@#$%^&*()_+\-=[\]{}|;':",.<>?/`~]/;

function isAtLeast8Years(oldDateStr: string) {
  if (!oldDateStr) return false;
  const d = new Date(oldDateStr);
  const now = new Date();
  const eightYearsAgo = new Date(now.getFullYear() - 8, now.getMonth(), now.getDate());
  return d <= eightYearsAgo;
}

/** yyyy-mm-dd -> ISO string */
const toDateTimeISO = (d: string) => new Date(`${d}T00:00:00.000Z`).toISOString();

export type SportType = 'Badminton' | 'Squash' | 'Padel' | 'Pickleball' | 'Tennis' | 'TableTennis';
export type PlayerLevel = 'D' | 'C' | 'B' | 'A' | 'Master';

export type FormValues = {
  email: string;
  password: string; // тільки create
  firstName: string;
  lastName: string;
  phoneNumber: string;
  clubId: string;
  doB: string; // yyyy-mm-dd
  gender: Gender;
  sportProfiles: { sport: SportType; level: PlayerLevel }[];

  // sports: SportType[];
  // level: PlayerLevel;
};

type Props = {
  mode: 'create' | 'edit';
  playerId?: string;

  defaultValues?: Partial<FormValues>;
  initialPlayer?: Player;

  onSubmitCreate?: (values: FormValues) => Promise<void>;
  onSubmitUpdate?: (playerId: string, values: FormValues) => Promise<void>;

  busy?: boolean;
  setIsChanged?: (v: boolean) => void;

  scopedClubId?: string;
  isClubScoped?: boolean;
};

export type PlayerFormHandle = {
  submit: () => void;
  isValid: () => boolean;
  getValues?: () => FormValues;
  setFieldError?: (name: keyof FormValues, message: string) => void;
};

function mapPlayerToForm(p?: Player | null): Partial<FormValues> {
  if (!p) return {};
  const u = p.user ?? null;

  const doB = u?.doB ? String(u.doB).slice(0, 10) : '';

  const sportProfiles: { sport: SportType; level: PlayerLevel }[] = (p.sportProfiles ?? [])
    .filter((sp): sp is PlayerSportProfile => Boolean(sp?.sport))
    .map((sp) => ({
      sport: sp.sport as SportType,
      level: (sp.level ?? 'D') as PlayerLevel,
    }));

  return {
    email: u?.email ?? '',
    firstName: u?.firstName ?? '',
    lastName: u?.lastName ?? '',
    phoneNumber: u?.phoneNumber ?? '',
    clubId: p.clubId ?? '',
    doB,
    gender: (u?.gender ?? 'NotSet') as Gender,
    sportProfiles, 
  };
}

const PlayerFormNew = forwardRef<PlayerFormHandle, Props>(function PlayerFormNew(
  {
    mode,
    playerId,
    defaultValues,
    initialPlayer,
    onSubmitCreate,
    onSubmitUpdate,
    busy,
    setIsChanged,
    scopedClubId,
    isClubScoped,
  },
  ref
) {
  const t = useTranslations('PlayerForm');
  const tErr = useTranslations('PlayerErrors');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
    getValues,
    setError,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      clubId: scopedClubId ?? '',
      doB: '',
      gender: 'NotSet',
      sportProfiles: [], 
      ...mapPlayerToForm(initialPlayer),
      ...defaultValues,
    },
  });

  useEffect(() => {
    setIsChanged?.(isDirty && isValid);
  }, [isDirty, isValid, setIsChanged]);
  useEffect(() => {
    // ✅ щоб не затирати те, що юзер вже встиг змінити
    if (isDirty) return;

    const nextDefaults: FormValues = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      clubId: scopedClubId ?? '',
      doB: '',
      gender: 'NotSet',
      sportProfiles: [], 
      ...mapPlayerToForm(initialPlayer),
      ...defaultValues,
    };

    reset(nextDefaults, { keepDirty: false, keepErrors: true });
  }, [initialPlayer, defaultValues, scopedClubId, reset, isDirty]);

  const errText = (msg?: unknown) => {
    if (!msg) return '';
    const key = String(msg);
    try {
      return tErr(key);
    } catch {
      return key;
    }
  };

  //======================================
  const uploadPhoto = useUploadPlayerPhoto();
  const deletePhoto = useDeletePlayerPhoto();

  const playerPhotoUrlRaw = (initialPlayer as any)?.photoUrl ?? '';
  const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? 'https://staging.api.badmik.com.ua';

  const playerPhotoUrl =
    playerPhotoUrlRaw && playerPhotoUrlRaw.startsWith('http')
      ? playerPhotoUrlRaw
      : playerPhotoUrlRaw
        ? `${API_ORIGIN}${playerPhotoUrlRaw}`
        : '';

  //========================================

  const submitHandler = useCallback(
    async (raw: FormValues) => {
      // if (mode === 'create') {
      //   await onSubmitCreate?.(raw);
      //   reset();
      // } else {
      //   if (playerId) await onSubmitUpdate?.(playerId, raw);
      //   reset({ ...raw, password: '' });
      // }

      if (mode === 'create') {
  await onSubmitCreate?.(raw);
  reset();
} else {
  if (playerId) await onSubmitUpdate?.(playerId, raw);
  // ✅ НЕ reset(raw) — хай прийдуть дані з usePlayerById після refetch
  reset({ ...getValues(), password: '' }, { keepDirty: false });
}

      setIsChanged?.(false);
    },
    [mode, playerId, onSubmitCreate, onSubmitUpdate, reset, setIsChanged]
  );

  useImperativeHandle(
    ref,
    () => ({
      submit: () =>
        handleSubmit(submitHandler, (errs) => {
          console.error('❌ RHF validation errors:', errs);
          console.error('🧪 RHF current values:', getValues());
        })(),
      isValid: () => Boolean(isValid),
      getValues: () => getValues(),
      setFieldError: (name, message) => setError(name, { type: 'server', message }),
    }),
    [handleSubmit, submitHandler, isValid, getValues, setError]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <ScrollArea className={styles.formScroll}>
          <form onSubmit={handleSubmit(submitHandler)} className={styles.form} noValidate>
            {mode === 'edit' && playerId && (
              <AvatarUploader
                value={playerPhotoUrl}
                onUpload={async (file) => {
                  const res = await uploadPhoto.mutateAsync({ id: playerId, file });
                  const raw = res.url ?? '';
                  return raw.startsWith('http') ? raw : `${API_ORIGIN}${raw}`;
                }}
                onRemove={async () => {
                  await deletePhoto.mutateAsync({ id: playerId });
                }}
              />
            )}
            <div className={styles.formGrid}>
              {/* First name */}
              <div>
                <label className={styles.label}>
                  {t('fields.firstName')} <span style={{ color: '#e63946' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.firstName ? styles.errorInput : ''}`}
                  {...register('firstName', {
                    required: mode === 'create' ? 'firstName.required' : false,
                    minLength: { value: 2, message: 'firstName.min' },
                    maxLength: { value: 60, message: 'firstName.max' },
                    pattern: { value: nameOnlyLetters, message: 'firstName.pattern' },
                  })}
                />
                {errors.firstName && (
                  <p className={styles.errorText}>{errText(errors.firstName.message)}</p>
                )}
              </div>

              {/* Last name */}
              <div>
                <label className={styles.label}>
                  {t('fields.lastName')} <span style={{ color: '#e63946' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.lastName ? styles.errorInput : ''}`}
                  {...register('lastName', {
                    required: mode === 'create' ? 'lastName.required' : false,
                    minLength: { value: 2, message: 'lastName.min' },
                    maxLength: { value: 60, message: 'lastName.max' },
                    pattern: { value: nameOnlyLetters, message: 'lastName.pattern' },
                  })}
                />
                {errors.lastName && (
                  <p className={styles.errorText}>{errText(errors.lastName.message)}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={styles.label}>
                  {t('fields.email')} <span style={{ color: '#e63946' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                  type="email"
                  {...register('email', {
                    required: mode === 'create' ? 'email.required' : false,
                    minLength: { value: 5, message: 'email.min' },
                    maxLength: { value: 254, message: 'email.max' },
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'email.pattern' },
                  })}
                />
                {errors.email && (
                  <p className={styles.errorText}>{errText(errors.email.message)}</p>
                )}
              </div>

              {/* Password only create */}
              {mode === 'create' && (
                <div>
                  <label className={styles.label}>
                    {t('fields.password')} <span style={{ color: '#e63946' }}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
                    type="password"
                    autoComplete="new-password"
                    {...register('password', {
                      required: 'password.required',
                      minLength: { value: 8, message: 'password.min' },
                      maxLength: { value: 64, message: 'password.max' },
                      validate: {
                        noSpace: (v) => noWhitespace.test(v) || 'password.noSpace',
                        hasDigit: (v) => hasDigit.test(v) || 'password.hasDigit',
                        hasUpper: (v) => hasUpper.test(v) || 'password.hasUpper',
                        hasLower: (v) => hasLower.test(v) || 'password.hasLower',
                        hasSpecial: (v) => hasSpecial.test(v) || 'password.hasSpecial',
                      },
                    })}
                  />
                  {errors.password && (
                    <p className={styles.errorText}>{errText(errors.password.message)}</p>
                  )}
                </div>
              )}

              {/* Phone */}
              <div>
                <label className={styles.label}>
                  {t('fields.phoneNumber')} <span style={{ color: '#e63946' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.phoneNumber ? styles.errorInput : ''}`}
                  type="tel"
                  placeholder="+380XXXXXXXXX"
                  {...register('phoneNumber', {
                    required: mode === 'create' ? 'phone.required' : false,
                    pattern: { value: /^\+?380\d{9}$/, message: 'phone.pattern' },
                  })}
                />
                {errors.phoneNumber && (
                  <p className={styles.errorText}>{errText(errors.phoneNumber.message)}</p>
                )}
              </div>

              {/* Club */}
              <div>
                <label className={styles.label}>
                  {t('fields.club')} <span style={{ color: '#e63946' }}>*</span>
                </label>

                {isClubScoped ? (
                  <ClubReadonlyField
                    control={control}
                    name="clubId"
                    rootClassName={styles.comboRoot}
                    inputClassName={`${styles.input} ${styles.inputChevron} ${errors.clubId ? styles.errorInput : ''}`}
                    forcedClubId={scopedClubId}
                  />
                ) : (
                  <ClubSelectFieldAdd
                    control={control}
                    name="clubId"
                    rootClassName={styles.comboRoot}
                    inputClassName={`${styles.input} ${styles.inputChevron} ${errors.clubId ? styles.errorInput : ''}`}
                    optionsClassName={styles.options}
                    optionClassName={styles.option}
                    optionActiveClassName={styles.optionActive}
                    chevronClassName={styles.comboChevron}
                  />
                )}
              </div>

              {/* DOB */}
              <div>
                <label className={styles.label}>
                  {t('fields.dob')} <span style={{ color: '#e63946' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.doB ? styles.errorInput : ''}`}
                  type="date"
                  {...register('doB', {
                    required: mode === 'create' ? 'dob.required' : false,
                    validate: (v) => isAtLeast8Years(v) || 'dob.validate',
                  })}
                />
                {errors.doB && <p className={styles.errorText}>{errText(errors.doB.message)}</p>}
              </div>

              {/* Gender (custom buttons) */}
              <div>
                <GenderSelector
                  control={control}
                  label={t('fields.gender')}
                  maleLabel={t('gender.Male')}
                  femaleLabel={t('gender.Female')}
                />
              </div>
            </div>

            {/* Sports + Level (custom like Locations) */}
            <PlayersSportsSelector
              control={control}
              labelClassName={styles.label}
              helpClassName={styles.help}
            />
          </form>
        </ScrollArea>
      </div>

      {Boolean(busy) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255,255,255,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div className="spinner" />
        </div>
      )}
    </div>
  );
});
export type PlayerFormValues = FormValues;
export default PlayerFormNew;

