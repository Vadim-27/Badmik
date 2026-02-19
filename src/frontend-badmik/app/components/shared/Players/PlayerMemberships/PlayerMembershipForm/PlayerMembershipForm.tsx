'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import styles from './PlayerMembershipForm.module.scss';
import ScrollArea from '@/app/components/ui/Scroll/ScrollArea';
import ClubReadonlyField from '@/app/components/ui/InputSelectClubs/ClubReadonlyField/ClubReadonlyField';

import type { PlayerMembership, MembershipStatus, SportType, TrainingType } from '@/services/types/playerMemberships.dto';
import type { ClubMembershipPlan } from '@/services/types/clubMembershipPlans.dto';

import PlanSelectField from './_fields/PlanSelectField';

export type MembershipFormValues = {
  clubId: string;

  // ✅ НОВЕ: вибір плану
  planId: string;

  validFrom: string;
  validUntil: string;

  // ці поля з плану (readonly)
  sportType: SportType | '';
  trainingType: TrainingType | '';

  trainingsTotalGranted: number;

  // edit/extend
  status?: MembershipStatus;
  trainingsLeft?: number;
};

type Props = {
  mode: 'create' | 'edit' | 'extend';
  membershipId?: string;

  defaultValues?: Partial<MembershipFormValues>;
  initialMembership?: PlayerMembership | null;

  onSubmitCreate?: (values: MembershipFormValues) => Promise<void>;
  onSubmitUpdate?: (membershipId: string, values: MembershipFormValues) => Promise<void>;

  busy?: boolean;
  loadingEdit?: boolean;

  scopedClubId?: string;
  isClubScoped?: boolean;

  // ✅ список планів клубу (для create)
  plans?: ClubMembershipPlan[];
  plansLoading?: boolean;
};

export type PlayerMembershipFormHandle = {
  submit: () => void;
  isValid: () => boolean;
  getValues: () => MembershipFormValues;
  setFieldError?: (name: keyof MembershipFormValues, message: string) => void;
};

const STATUS_TYPES: MembershipStatus[] = ['Active', 'Pending', 'Suspended', 'Left'];

function mapMembershipToForm(m?: PlayerMembership | null): Partial<MembershipFormValues> {
  if (!m) return {};
  const anyM = m as any;
  return {
    clubId: anyM.clubId ?? '',
    planId: String(anyM.planId ?? ''),
    validFrom: anyM.validFrom ? String(anyM.validFrom).slice(0, 10) : '',
    validUntil: anyM.validUntil ? String(anyM.validUntil).slice(0, 10) : '',
    sportType: anyM.sportType ?? '',
    trainingType: anyM.trainingType ?? '',
    trainingsTotalGranted: Number(anyM.trainingsTotalGranted ?? 0) || 0,
    status: anyM.status ?? undefined,
    trainingsLeft: typeof anyM.trainingsLeft === 'number' ? Number(anyM.trainingsLeft) : undefined,
  };
}

function isoDateLocal(d: Date) {
  // YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + (Number.isFinite(days) ? days : 0));
  return d;
}

const PlayerMembershipForm = forwardRef<PlayerMembershipFormHandle, Props>(function PlayerMembershipForm(
  {
    mode,
    membershipId,
    initialMembership,
    defaultValues,
    onSubmitCreate,
    onSubmitUpdate,
    busy,
    loadingEdit,
    scopedClubId,
    isClubScoped,
    plans = [],
    plansLoading,
  },
  ref,
) {
  const t = useTranslations('PlayerMemberships');

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    getValues,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<MembershipFormValues>({
    mode: 'all',
    defaultValues: {
      clubId: scopedClubId ?? '',
      planId: '',
      validFrom: '',
      validUntil: '',
      sportType: '',
      trainingType: '',
      trainingsTotalGranted: 0,
      status: undefined,
      trainingsLeft: undefined,
      ...mapMembershipToForm(initialMembership),
      ...defaultValues,
    },
  });

  // max date для validUntil (коли вибраний план)
  const [maxUntil, setMaxUntil] = useState<string>('');

  useEffect(() => {
    reset(
      {
        clubId: scopedClubId ?? '',
        planId: '',
        validFrom: '',
        validUntil: '',
        sportType: '',
        trainingType: '',
        trainingsTotalGranted: 0,
        status: undefined,
        trainingsLeft: undefined,
        ...mapMembershipToForm(initialMembership),
        ...defaultValues,
      },
      { keepDirty: false, keepErrors: true },
    );
    setMaxUntil('');
  }, [reset, defaultValues, initialMembership, scopedClubId]);

  const errText = (code?: unknown) => {
    if (!code) return '';
    const raw = String(code);
    const parts = raw.split('.');
    if (parts.length < 2) return raw;
    const field = parts[0];
    const rule = parts.slice(1).join('.');
    try {
      return t(`PlayerMembershipErrors.${field}.${rule}`);
    } catch {
      return raw;
    }
  };

  const validFrom = watch('validFrom');
  const planId = watch('planId');

  const selectedPlan = useMemo(() => plans.find((p) => String(p.id) === String(planId)) ?? null, [plans, planId]);

  // ✅ при виборі плану — автозаповнення полів
  useEffect(() => {
    if (mode !== 'create') return;
    if (!selectedPlan) return;

    const today = new Date();
    const from = isoDateLocal(today);

    const until = isoDateLocal(addDays(today, Number(selectedPlan.durationDays ?? 0)));
    setMaxUntil(until);

    setValue('validFrom', from, { shouldDirty: true, shouldValidate: true });
    setValue('validUntil', until, { shouldDirty: true, shouldValidate: true });

    setValue('sportType', selectedPlan.sportType as any, { shouldDirty: true, shouldValidate: true });
    setValue('trainingType', selectedPlan.trainingType as any, { shouldDirty: true, shouldValidate: true });

    // trainingsGranted -> trainingsTotalGranted
    setValue('trainingsTotalGranted', Number(selectedPlan.trainingsGranted ?? 0) || 0, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [mode, selectedPlan, setValue]);

  const submitHandler = useCallback(
    async (raw: MembershipFormValues) => {
      const payload: MembershipFormValues = {
        ...raw,
        clubId: raw.clubId || scopedClubId || '',
        trainingsTotalGranted: Number(raw.trainingsTotalGranted),
        trainingsLeft: typeof raw.trainingsLeft === 'number' ? Number(raw.trainingsLeft) : raw.trainingsLeft,
        planId: String(raw.planId ?? ''),
      };

      if (mode === 'create') {
        await onSubmitCreate?.(payload);
        reset({
          clubId: scopedClubId ?? payload.clubId,
          planId: '',
          validFrom: '',
          validUntil: '',
          sportType: '',
          trainingType: '',
          trainingsTotalGranted: 0,
          status: undefined,
          trainingsLeft: undefined,
        });
        setMaxUntil('');
        return;
      }

      if (membershipId) await onSubmitUpdate?.(membershipId, payload);
    },
    [mode, membershipId, onSubmitCreate, onSubmitUpdate, reset, scopedClubId],
  );

  useImperativeHandle(
    ref,
    () => ({
      submit: () => handleSubmit(submitHandler)(),
      isValid: () => Boolean(isValid),
      getValues: () => getValues(),
      setFieldError: (name, message) => setError(name, { type: 'server', message }),
    }),
    [handleSubmit, submitHandler, isValid, getValues, setError],
  );

  const disabledAll = Boolean(busy) || Boolean(loadingEdit);

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <ScrollArea className={styles.formScroll}>
          <form onSubmit={handleSubmit(submitHandler)} className={styles.form} noValidate>
            <div className={styles.formGrid}>
              {/* Club */}
              {mode !== 'extend' ? (
                <div className={styles.comboRoot}>
                  <label className={styles.label}>
                    {t('PlayerMembershipForm.fields.club')} <span className={styles.req}>*</span>
                  </label>

                  {isClubScoped ? (
                    <ClubReadonlyField
                      control={control}
                      name="clubId"
                      rootClassName={styles.comboRoot}
                      inputClassName={`${styles.input} ${errors.clubId ? styles.errorInput : ''}`}
                      forcedClubId={scopedClubId}
                    />
                  ) : (
                    <input
                      className={`${styles.input} ${errors.clubId ? styles.errorInput : ''}`}
                      disabled={disabledAll}
                      {...register('clubId', { required: 'clubId.required' })}
                    />
                  )}

                  {errors.clubId && <p className={styles.errorText}>{errText(errors.clubId.message)}</p>}
                </div>
              ) : null}

              {/* ✅ CREATE: Plan select */}
              {mode === 'create' ? (
                <div className={styles.comboRoot}>
                  <label className={styles.label}>
                    {t('PlayerMembershipForm.fields.planClub')} <span className={styles.req}>*</span>
                  </label>

                  <PlanSelectField
                    control={control}
                    name="planId"
                    plans={plans}
                    disabled={disabledAll || Boolean(plansLoading)}
                    placeholder={t('PlayerMembershipForm.placeholders.planClub')}
                    emptyText={t('PlayerMembershipForm.placeholders.empty')}
                    rootClassName={styles.comboRoot}
                    inputClassName={clsx(styles.input, styles.inputChevron, errors.planId && styles.errorInput)}
                    optionsClassName={styles.options}
                    optionClassName={styles.option}
                    optionActiveClassName={styles.optionActive}
                    chevronClassName={styles.comboChevron}
                    labelForPlan={(p) => String(p.name ?? '—')}
                    requiredMessage="planId.required"
                  />

                  {errors.planId && <p className={styles.errorText}>{errText(errors.planId.message)}</p>}
                </div>
              ) : null}

              {/* ✅ CREATE: sportType readonly */}
              {mode === 'create' ? (
                <div className={styles.comboRoot}>
                  <label className={styles.label}>
                    {t('PlayerMembershipForm.fields.sportType')} <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    value={selectedPlan ? t(`sportType.${selectedPlan.sportType}`) : ''}
                    readOnly
                    disabled
                  />
                </div>
              ) : null}

              {/* ✅ CREATE: trainingType readonly */}
              {mode === 'create' ? (
                <div className={styles.comboRoot}>
                  <label className={styles.label}>
                    {t('PlayerMembershipForm.fields.trainingType')} <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    value={selectedPlan ? t(`trainingType.${selectedPlan.trainingType}`) : ''}
                    readOnly
                    disabled
                  />
                </div>
              ) : null}

              {/* trainingsTotalGranted: create/edit (НЕ extend) */}
              {mode !== 'extend' ? (
                <div className={styles.comboRoot}>
                  <label className={styles.label}>
                    {t('PlayerMembershipForm.fields.trainingsTotalGranted')} <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.trainingsTotalGranted ? styles.errorInput : ''}`}
                    type="number"
                    min={1}
                    disabled={disabledAll}
                    {...register('trainingsTotalGranted', {
                      required: 'trainingsTotalGranted.required',
                      valueAsNumber: true,
                      min: { value: 1, message: 'trainingsTotalGranted.min' },
                    })}
                  />
                  {errors.trainingsTotalGranted && (
                    <p className={styles.errorText}>{errText(errors.trainingsTotalGranted.message)}</p>
                  )}
                </div>
              ) : null}

              {/* EDIT-ONLY: status */}
              {mode === 'edit' ? (
                <div className={styles.comboRoot}>
                  <label className={styles.label}>
                    {t('PlayerMembershipForm.fields.status')} <span className={styles.req}>*</span>
                  </label>
                  <select
                    className={`${styles.input} ${errors.status ? styles.errorInput : ''}`}
                    disabled={disabledAll}
                    {...register('status', { required: 'status.required' })}
                  >
                    <option value="">{t('PlayerMembershipForm.placeholders.status')}</option>
                    {STATUS_TYPES.map((v) => (
                      <option key={String(v)} value={String(v)}>
                        {String(v)}
                      </option>
                    ))}
                  </select>
                  {errors.status && <p className={styles.errorText}>{errText(errors.status.message)}</p>}
                </div>
              ) : null}

              {/* trainingsLeft: edit + extend */}
              {mode !== 'create' ? (
                <div className={styles.comboRoot}>
                  <label className={styles.label}>
                    {t('PlayerMembershipForm.fields.trainingsLeft')} <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.trainingsLeft ? styles.errorInput : ''}`}
                    type="number"
                    min={0}
                    disabled={disabledAll}
                    {...register('trainingsLeft', {
                      required: 'trainingsLeft.required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'trainingsLeft.min' },
                    })}
                  />
                  {errors.trainingsLeft && <p className={styles.errorText}>{errText(errors.trainingsLeft.message)}</p>}
                </div>
              ) : null}

              {/* validFrom: create/edit (НЕ extend) */}
              {mode !== 'extend' ? (
                <div className={styles.comboRoot}>
                  <label className={styles.label}>
                    {t('PlayerMembershipForm.fields.validFrom')} <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.validFrom ? styles.errorInput : ''}`}
                    type="date"
                    disabled={disabledAll || mode === 'create'} // ✅ у create — завжди сьогодні
                    {...register('validFrom', { required: 'validFrom.required' })}
                  />
                  {errors.validFrom && <p className={styles.errorText}>{errText(errors.validFrom.message)}</p>}
                </div>
              ) : null}

              {/* validUntil: завжди (і в extend) */}
              <div className={styles.comboRoot}>
                <label className={styles.label}>
                  {t('PlayerMembershipForm.fields.validUntil')} <span className={styles.req}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.validUntil ? styles.errorInput : ''}`}
                  type="date"
                  disabled={disabledAll}
                  max={mode === 'create' ? (maxUntil || undefined) : undefined}
                  {...register('validUntil', {
                    required: 'validUntil.required',
                    validate:
                      mode === 'extend'
                        ? undefined
                        : (v) => (!validFrom || !v || v >= validFrom ? true : 'validUntil.afterFrom'),
                  })}
                />
                {errors.validUntil && <p className={styles.errorText}>{errText(errors.validUntil.message)}</p>}
              </div>
            </div>

            <button type="submit" style={{ display: 'none' }} />
          </form>
        </ScrollArea>
      </div>

      {disabledAll && <div className={styles.overlay} />}
    </div>
  );
});

export default PlayerMembershipForm;


