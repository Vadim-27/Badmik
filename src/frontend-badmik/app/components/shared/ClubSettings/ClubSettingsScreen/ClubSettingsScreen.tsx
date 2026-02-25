'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import styles from './ClubSettingsScreen.module.scss';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

import { buildHrefServer } from '@/lib/club-scope.server';
import SettingNumberField from '../SettingNumberField/SettingNumberField';

import { useClubSettingsByClubId, useUpdateClubSettings } from '@/services/clubSettings/queries.client';
import type { UpdateClubSettingsDto } from '@/services/types/clubSettings.dto';

type Props = {
  clubId: string;
  clubName?: string;
};

type FormState = {
  bookingOpenBeforeDays: number;
  bookingOpenHour: number;
  unsubscribeAllowBeforeHours: number;
};

function toInt(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function normalizeForm(input?: any): FormState {
  return {
    bookingOpenBeforeDays: Math.max(0, toInt(input?.bookingOpenBeforeDays ?? 0)),
    bookingOpenHour: clamp(toInt(input?.bookingOpenHour ?? 0), 0, 23),
    unsubscribeAllowBeforeHours: Math.max(0, toInt(input?.unsubscribeAllowBeforeHours ?? 0)),
  };
}

function isEqual(a: FormState, b: FormState) {
  return (
    a.bookingOpenBeforeDays === b.bookingOpenBeforeDays &&
    a.bookingOpenHour === b.bookingOpenHour &&
    a.unsubscribeAllowBeforeHours === b.unsubscribeAllowBeforeHours
  );
}

const EMPTY_FORM: FormState = {
  bookingOpenBeforeDays: 0,
  bookingOpenHour: 0,
  unsubscribeAllowBeforeHours: 0,
};

export default function ClubSettingsScreen({ clubId, clubName }: Props) {
  const t = useTranslations('clubSettings');
  const tBC = useTranslations('clubSettingsBreadcrumbs');

  const { data, isLoading, error, isFetching } = useClubSettingsByClubId(clubId);
  const updateMutation = useUpdateClubSettings(clubId);

  // baselineRef — “еталон”, з яким порівнюємо зміни.
  // Зберігаємо тут, щоб не залежати від коливань data під час refetch.
  const baselineRef = useRef<FormState>(EMPTY_FORM);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [dirty, setDirty] = useState(false);
  const [hasInit, setHasInit] = useState(false);

  // ✅ ініціалізація форми один раз, коли вперше прийшли дані
  useEffect(() => {
    if (hasInit) return;
    if (!data) return;

    const normalized = normalizeForm(data);
    baselineRef.current = normalized;
    setForm(normalized);
    setHasInit(true);
  }, [data, hasInit]);

  // ✅ якщо юзер не редагує (dirty=false) — дозволяємо “мʼяко” підсинхронити baseline,
  // але НЕ чіпаємо form під час save (щоб не було “скачків”)
  useEffect(() => {
    if (!hasInit) return;
    if (!data) return;
    if (dirty) return;
    if (updateMutation.isPending) return;

    const normalized = normalizeForm(data);
    baselineRef.current = normalized;
    setForm(normalized);
  }, [data, dirty, hasInit, updateMutation.isPending]);

  const baseline = baselineRef.current;
  const isChanged = dirty && !isEqual(form, baseline);

  const playersHref = buildHrefServer(clubId, 'players');
  const dashboardHref = buildHrefServer(clubId, 'dashboard');
  const settingsHref = buildHrefServer(clubId, 'club-settings');

  const onChange = useCallback((patch: Partial<FormState>) => {
    setForm((s) => ({ ...s, ...patch }));
    setDirty(true);
  }, []);

  const onSave = useCallback(async () => {
    const dto: UpdateClubSettingsDto = normalizeForm(form);

    const saved = await updateMutation.mutateAsync(dto);

    // ✅ фіксуємо baseline локально одразу (це прибирає “скачки” навіть якщо буде refetch)
    const normalizedSaved = normalizeForm(saved);
    baselineRef.current = normalizedSaved;
    setForm(normalizedSaved);
    setDirty(false);
    setHasInit(true);
  }, [form, updateMutation]);

  const isInitialLoading = (!hasInit && (isLoading || isFetching)) || (!hasInit && !data && !error);
  const isSaving = updateMutation.isPending;

  return (
    <section className={styles.wrapper}>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <div className={styles.headerTitleWrap}>
          <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
        </div>

        <SaveButton
          label="buttons.save"
          onClick={onSave}
          disabled={!isChanged || isSaving || isInitialLoading || !!error}
        />
      </ActionHeader>

      <div className={styles.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: tBC('Admin'), href: dashboardHref },
            { label: tBC('ClubSettings'), href: settingsHref },
          ]}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.maxWidth}>
          <p className={styles.description}>{t('description')}</p>

          <div className={styles.cardWrap}>
            {(isInitialLoading || isSaving) && (
              <SpinnerOverlay fullscreen={false} className={styles.spinner} />
            )}

            <div className={styles.card} aria-busy={isInitialLoading || isSaving}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderTitle}>{t('card.rulesTitle')}</div>
                <div className={styles.cardHeaderDesc}>{t('card.rulesDesc')}</div>
              </div>

              {!!error && (
                <div className={styles.errorBox}>
                  {t('error')}
                </div>
              )}

              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.fields}>
                  <SettingNumberField
                    id="bookingOpenBeforeDays"
                    title={t('fields.bookingOpenBeforeDays.title')}
                    hint={t('fields.bookingOpenBeforeDays.hint')}
                    rightLabel={t('fields.bookingOpenBeforeDays.unit')}
                    value={form.bookingOpenBeforeDays}
                    min={0}
                    step={1}
                    example={t('fields.bookingOpenBeforeDays.example')}
                    onChange={(v) => onChange({ bookingOpenBeforeDays: v })}
                  />

                  <div className={styles.divider} />

                  <SettingNumberField
                    id="bookingOpenHour"
                    title={t('fields.bookingOpenHour.title')}
                    hint={t('fields.bookingOpenHour.hint')}
                    rightLabel={t('fields.bookingOpenHour.unit')}
                    value={form.bookingOpenHour}
                    min={0}
                    max={23}
                    step={1}
                    example={t('fields.bookingOpenHour.example')}
                    onChange={(v) => onChange({ bookingOpenHour: v })}
                  />

                  <div className={styles.divider} />

                  <SettingNumberField
                    id="unsubscribeAllowBeforeHours"
                    title={t('fields.unsubscribeAllowBeforeHours.title')}
                    hint={t('fields.unsubscribeAllowBeforeHours.hint')}
                    rightLabel={t('fields.unsubscribeAllowBeforeHours.unit')}
                    value={form.unsubscribeAllowBeforeHours}
                    min={0}
                    step={1}
                    example={t('fields.unsubscribeAllowBeforeHours.example')}
                    onChange={(v) => onChange({ unsubscribeAllowBeforeHours: v })}
                  />
                </div>
              </form>
            </div>
          </div>

          {!!clubName && <div className={styles.clubHint}>{clubName}</div>}
        </div>
      </div>
    </section>
  );
}



