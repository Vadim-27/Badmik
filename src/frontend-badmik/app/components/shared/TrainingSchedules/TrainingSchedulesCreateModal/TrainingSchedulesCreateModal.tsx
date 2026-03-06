

//======================================================



'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import styles from './TrainingSchedulesCreateModal.module.scss';

type SelectionLabel = {
  courts: string;
  courtsCount: string;
  time: string;
};

const TYPES = ['Kids', 'Individual', 'Educational', 'Group', 'CourtRental'] as const;
const LEVELS = ['All', 'A', 'B', 'C', 'D', 'Master'] as const;

type ModalPayload = {
  name: string;
  maxPlayers: number | null;
  trainingType: (typeof TYPES)[number];
  levels: string[];
};

type Props = {
  open: boolean;
  mode?: 'create' | 'edit';
  loading?: boolean;
  submitting?: boolean;

  selectionLabel: SelectionLabel | null;
  onClose: () => void;
  onCreate?: (payload: ModalPayload) => void;
  onUpdate?: (payload: ModalPayload) => void;

  initialValues?: {
    name?: string;
    maxPlayers?: number | null;
    trainingType?: (typeof TYPES)[number];
    levels?: string[];
  };
};

export default function TrainingSchedulesCreateModal({
  open,
  mode = 'create',
  loading = false,
  submitting = false,
  selectionLabel,
  onClose,
  onCreate,
  onUpdate,
  initialValues,
}: Props) {
  if (!open) return null;

  const tR = useTranslations('TrainingSchedules');
  const tT = useTranslations('trainingType');

  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState<string>('');
  const [trainingType, setTrainingType] = useState<(typeof TYPES)[number]>('Group');
  const [levels, setLevels] = useState<string[]>(['All']);

  useEffect(() => {
    setName(initialValues?.name ?? '');
    setMaxPlayers(
      initialValues?.maxPlayers === null || initialValues?.maxPlayers === undefined
        ? ''
        : String(initialValues.maxPlayers),
    );
    setTrainingType(initialValues?.trainingType ?? 'Group');
    setLevels(initialValues?.levels?.length ? initialValues.levels : ['All']);
  }, [initialValues, open]);

  const selection = selectionLabel ?? { courts: '—', courtsCount: '—', time: '—' };

  function toggleLevel(l: string) {
    setLevels((prev) => {
      if (l === 'All') return ['All'];

      const base = prev.includes('All') ? [] : [...prev];

      if (base.includes(l)) {
        const next = base.filter((x) => x !== l);
        return next.length === 0 ? ['All'] : next;
      }

      return [...base, l];
    });
  }

  const levelsUi = useMemo(() => {
    if (levels.length === 0) return ['All'];
    return levels;
  }, [levels]);

  function handleSubmit() {
    const payload: ModalPayload = {
      name: name.trim(),
      maxPlayers: maxPlayers ? Number(maxPlayers) : null,
      trainingType,
      levels: levelsUi,
    };

    if (mode === 'edit') {
      onUpdate?.(payload);
      return;
    }

    onCreate?.(payload);
  }

  return (
    <>
      <button
        type="button"
        className={styles.modalBackdrop}
        aria-label={tR('modalCreate.close')}
        onClick={onClose}
      />

      <div className={styles.modalWrap} role="dialog" aria-modal="true">
        <div className={styles.modal}>
          <div className={styles.modalHead}>
            <div>
              <div className={styles.modalTitle}>
                {mode === 'edit' ? tR('modalEdit.title') : tR('modalCreate.title')}
              </div>
              <div className={styles.modalSubtitle}>
                {mode === 'edit' ? tR('modalEdit.subtitle') : tR('modalCreate.subtitle')}
              </div>
            </div>

            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              {tR('modalCreate.close')}
            </button>
          </div>

          <div className={styles.modalBody}>
            {loading ? (
              <div className={styles.selectionCard}>Loading...</div>
            ) : (
              <>
                <div className={styles.selectionCard}>
                  <div className={styles.selectionTitle}>
                    {tR('modalCreate.selection.selection')}
                  </div>

                  <div className={styles.selectionGrid}>
                    <div className={styles.selectionRow}>
                      <span className={styles.selectionKey}>
                        {tR('modalCreate.selection.courts')}
                      </span>
                      <span className={styles.selectionVal}>{selection.courts}</span>
                    </div>

                    <div className={styles.selectionRow}>
                      <span className={styles.selectionKey}>
                        {tR('modalCreate.selection.courtsCount')}
                      </span>
                      <span className={styles.selectionVal}>{selection.courtsCount}</span>
                    </div>

                    <div className={styles.selectionRow}>
                      <span className={styles.selectionKey}>
                        {tR('modalCreate.selection.time')}
                      </span>
                      <span className={styles.selectionVal}>{selection.time}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <div className={styles.fieldLabel}>{tR('modalCreate.label.name')}</div>
                    <input
                      className={styles.input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={tR('modalCreate.placeholders.name')}
                    />
                  </label>

                  <label className={styles.field}>
                    <div className={styles.fieldLabel}>
                      {tR('modalCreate.label.maxPlayers')}
                    </div>
                    <input
                      className={styles.input}
                      type="number"
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(e.target.value)}
                      placeholder={tR('modalCreate.placeholders.maxPlayers')}
                      min={1}
                    />
                  </label>
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>
                      {tR('modalCreate.label.trainingType')}
                    </div>

                    <div className={styles.inlineSelectBox}>
                      <span className={styles.inlineSelectLabel}>
                        {tR('modalCreate.placeholders.trainingType')}
                      </span>

                      <div className={styles.selectWrap}>
                        <select
                          className={styles.select}
                          value={trainingType}
                          onChange={(e) => setTrainingType(e.target.value as (typeof TYPES)[number])}
                        >
                          {TYPES.map((x) => (
                            <option key={x} value={x}>
                              {tT(x)}
                            </option>
                          ))}
                        </select>

                        <span className={styles.selectChevron} aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>{tR('modalCreate.label.level')}</div>

                    <div className={styles.levelsRow}>
                      {LEVELS.map((l) => {
                        const isActive = levelsUi.includes(l);
                        return (
                          <button
                            key={l}
                            type="button"
                            className={isActive ? styles.levelPillActive : styles.levelPill}
                            onClick={() => toggleLevel(l)}
                          >
                            {l}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnSecondary} onClick={onClose}>
                    {tR('modalCreate.buttons.cancel')}
                  </button>

                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {mode === 'edit'
                      ? tR('modalEdit.buttons.save')
                      : tR('modalCreate.buttons.create')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}