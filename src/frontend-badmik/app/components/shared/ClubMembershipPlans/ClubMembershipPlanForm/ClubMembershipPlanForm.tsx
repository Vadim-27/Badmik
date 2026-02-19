'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import styles from './ClubMembershipPlanForm.module.scss';

import type { SportType, TrainingType } from '@/services/types/playerMemberships.dto';
import EnumSelectField from '@/app/components/shared/Players/PlayerMemberships/PlayerMembershipForm/_fields/EnumSelectField';

export type ClubMembershipPlanFormValues = {
  clubId: string;

  name: string;
  durationDays: number;
  trainingsGranted: number;

  sportType: SportType | '';
  trainingType: TrainingType | '';

  isActive: boolean;
};

type Props = {
  mode: 'create' | 'edit';
  planId?: string;
  clubId: string;

  defaultValues?: Partial<ClubMembershipPlanFormValues>;

  onSubmitCreate?: (values: ClubMembershipPlanFormValues) => Promise<void>;
  onSubmitUpdate?: (planId: string, values: ClubMembershipPlanFormValues) => Promise<void>;

  busy?: boolean;
  loadingEdit?: boolean;
};

export type ClubMembershipPlanFormHandle = {
  submit: () => void;
  getValues: () => ClubMembershipPlanFormValues;
  isValid: () => boolean;
};

const SPORT_TYPES: SportType[] = ['Badminton', 'Squash', 'Padel', 'Pickleball', 'Tennis', 'TableTennis'];
const TRAINING_TYPES: TrainingType[] = ['Kids', 'Individual', 'Educational', 'Group', 'CourtRental'];

const ClubMembershipPlanForm = forwardRef<ClubMembershipPlanFormHandle, Props>(function ClubMembershipPlanForm(
  { mode, planId, clubId, defaultValues, onSubmitCreate, onSubmitUpdate, busy, loadingEdit },
  ref,
) {
  const t = useTranslations('ClubMembershipPlans');

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<ClubMembershipPlanFormValues>({
    mode: 'all',
    defaultValues: {
      clubId,
      name: '',
      durationDays: 30,
      trainingsGranted: 1,
      sportType: '',
      trainingType: '',
      isActive: true,
      ...(defaultValues ?? {}),
    },
  });

  useEffect(() => {
    reset(
      {
        clubId,
        name: '',
        durationDays: 30,
        trainingsGranted: 1,
        sportType: '',
        trainingType: '',
        isActive: true,
        ...(defaultValues ?? {}),
      },
      { keepDirty: false, keepErrors: true },
    );
  }, [reset, clubId, defaultValues]);

  const disabledAll = Boolean(busy) || Boolean(loadingEdit);

  const submitHandler = useCallback(
    async (raw: ClubMembershipPlanFormValues) => {
      const payload: ClubMembershipPlanFormValues = {
        ...raw,
        clubId,
        durationDays: Number(raw.durationDays),
        trainingsGranted: Number(raw.trainingsGranted),
        isActive: Boolean(raw.isActive),
      };

      if (mode === 'create') {
        await onSubmitCreate?.(payload);
        return;
      }

      if (planId) {
        await onSubmitUpdate?.(planId, payload);
      }
    },
    [mode, planId, clubId, onSubmitCreate, onSubmitUpdate],
  );

  useImperativeHandle(
    ref,
    () => ({
      submit: () => handleSubmit(submitHandler)(),
      getValues: () => getValues(),
      isValid: () => Boolean(isValid),
    }),
    [handleSubmit, submitHandler, getValues, isValid],
  );

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit(submitHandler)} noValidate>
        <div className={styles.grid}>
          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label}>
              {t('form.fields.name')} <span className={styles.req}>*</span>
            </label>
            <input
              className={clsx(styles.input, errors.name && styles.errorInput)}
              disabled={disabledAll}
              {...register('name', { required: 'name.required' })}
              placeholder={t('form.placeholders.name')}
            />
            {errors.name ? <p className={styles.errorText}>{t('form.errors.nameRequired')}</p> : null}
          </div>

          {/* Duration */}
          <div className={styles.field}>
            <label className={styles.label}>
              {t('form.fields.durationDays')} <span className={styles.req}>*</span>
            </label>
            <input
              className={clsx(styles.input, errors.durationDays && styles.errorInput)}
              type="number"
              min={1}
              disabled={disabledAll}
              {...register('durationDays', { required: true, valueAsNumber: true, min: 1 })}
            />
            {errors.durationDays ? <p className={styles.errorText}>{t('form.errors.durationDays')}</p> : null}
          </div>

          {/* Trainings granted */}
          <div className={styles.field}>
            <label className={styles.label}>
              {t('form.fields.trainingsGranted')} <span className={styles.req}>*</span>
            </label>
            <input
              className={clsx(styles.input, errors.trainingsGranted && styles.errorInput)}
              type="number"
              min={1}
              disabled={disabledAll}
              {...register('trainingsGranted', { required: true, valueAsNumber: true, min: 1 })}
            />
            {errors.trainingsGranted ? <p className={styles.errorText}>{t('form.errors.trainingsGranted')}</p> : null}
          </div>

          {/* Sport type */}
          <div className={styles.field}>
            <label className={styles.label}>
              {t('form.fields.sportType')} <span className={styles.req}>*</span>
            </label>

            <EnumSelectField
              control={control}
              name="sportType"
              options={SPORT_TYPES}
              rootClassName={styles.comboRoot}
              inputClassName={clsx(styles.input, styles.inputChevron, errors.sportType && styles.errorInput)}
              optionsClassName={styles.options}
              optionClassName={styles.option}
              optionActiveClassName={styles.optionActive}
              chevronClassName={styles.comboChevron}
              disabled={disabledAll}
              placeholder={t('form.placeholders.sportType')}
              requiredMessage="sportType.required"
              labelForValue={(v) => t(`sportType.${String(v)}`)}
              emptyText={t('form.placeholders.empty')}
            />

            {errors.sportType ? <p className={styles.errorText}>{t('form.errors.sportType')}</p> : null}
          </div>

          {/* Training type */}
          <div className={styles.field}>
            <label className={styles.label}>
              {t('form.fields.trainingType')} <span className={styles.req}>*</span>
            </label>

            <EnumSelectField
              control={control}
              name="trainingType"
              options={TRAINING_TYPES}
              rootClassName={styles.comboRoot}
              inputClassName={clsx(styles.input, styles.inputChevron, errors.trainingType && styles.errorInput)}
              optionsClassName={styles.options}
              optionClassName={styles.option}
              optionActiveClassName={styles.optionActive}
              chevronClassName={styles.comboChevron}
              disabled={disabledAll}
              placeholder={t('form.placeholders.trainingType')}
              requiredMessage="trainingType.required"
              labelForValue={(v) => t(`trainingType.${String(v)}`)}
              emptyText={t('form.placeholders.empty')}
            />

            {errors.trainingType ? <p className={styles.errorText}>{t('form.errors.trainingType')}</p> : null}
          </div>

          {/* isActive */}
          <div className={styles.fieldWide}>
            <label className={styles.label}>{t('form.fields.isActive')}</label>

            <label className={styles.switchRow}>
              <input
                type="checkbox"
                className={styles.switchInput}
                disabled={disabledAll}
                {...register('isActive')}
              />
              <span className={styles.switchTrack} aria-hidden="true">
                <span className={styles.switchThumb} />
              </span>
              <span className={styles.switchText}>
                {getValues().isActive ? t('status.active') : t('status.inactive')}
              </span>
            </label>
          </div>
        </div>

        <button type="submit" style={{ display: 'none' }} />
        {disabledAll ? <div className={styles.overlay} /> : null}
      </form>
    </div>
  );
});

export default ClubMembershipPlanForm;
