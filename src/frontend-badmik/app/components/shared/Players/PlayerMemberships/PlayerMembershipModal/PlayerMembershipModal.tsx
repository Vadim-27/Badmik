

// // src/app/components/shared/Players/PlayerMemberships/PlayerMembershipModal/PlayerMembershipModal.tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';

import styles from './PlayerMembershipModal.module.scss';

import PlayerMembershipForm, {
  type PlayerMembershipFormHandle,
  type MembershipFormValues,
} from '../PlayerMembershipForm/PlayerMembershipForm';

import {
  useCreatePlayerMembership,
  useUpdatePlayerMembership,
  usePlayerMembershipById,
} from '@/services/playerMemberships/queries.client';

import { useClubMembershipPlansList } from '@/services/clubMembershipPlans/queries.client';

import type {
  CreatePlayerMembershipDto,
  UpdatePlayerMembershipDto,
  PlayerMembership,
} from '@/services/types/playerMemberships.dto';

type Props = {
  open: boolean;
  mode: 'create' | 'edit' | 'extend';
  onClose: () => void;
  playerId: string;
  clubId: string;
  membershipId?: string;
};

function toIsoStartOfDaySafe(input: string): string {
  if (!input) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!m) return new Date(input).toISOString();
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return new Date(Date.UTC(y, mo - 1, d, 0, 0, 0)).toISOString();
}

function mapMembershipToForm(m?: PlayerMembership | null): Partial<MembershipFormValues> {
  if (!m) return {};
  return {
    clubId: m.clubId ?? '',
    planId: String((m as any).planId ?? ''),
    validFrom: m.validFrom ? String(m.validFrom).slice(0, 10) : '',
    validUntil: m.validUntil ? String(m.validUntil).slice(0, 10) : '',
    sportType: (m as any).sportType ?? '',
    trainingType: (m as any).trainingType ?? '',
    trainingsTotalGranted: Number((m as any).trainingsTotalGranted ?? 0) || 0,

    status: String((m as any).status ?? ''),
    trainingsLeft: typeof (m as any).trainingsLeft === 'number' ? Number((m as any).trainingsLeft) : undefined,
  };
}

export default function PlayerMembershipModal({ open, mode, onClose, playerId, clubId, membershipId }: Props) {
  const t = useTranslations('PlayerMemberships');
  const formRef = useRef<PlayerMembershipFormHandle | null>(null);

  // ✅ plans потрібні тільки для create
  const qPlans = useClubMembershipPlansList(clubId, {
    enabled: open && mode === 'create' && Boolean(clubId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // ✅ edit/extend byId
  const qEdit = usePlayerMembershipById(playerId, membershipId ?? '', {
    enabled: open && (mode === 'edit' || mode === 'extend') && Boolean(playerId) && Boolean(membershipId),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const initialMembership = mode === 'edit' || mode === 'extend' ? qEdit.data ?? null : null;

  const defaultValues = useMemo<Partial<MembershipFormValues>>(() => {
    if (mode === 'create') return { clubId, planId: '' };
    return { clubId, ...mapMembershipToForm(initialMembership) };
  }, [mode, clubId, initialMembership]);

  const createM = useCreatePlayerMembership({ onSuccess: () => onClose() });
  const updateM = useUpdatePlayerMembership({ onSuccess: () => onClose() });

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const busy =
    createM.isPending ||
    updateM.isPending ||
    ((mode === 'edit' || mode === 'extend') && qEdit.isFetching) ||
    (mode === 'create' && qPlans.isFetching);

  const canSubmit = mode === 'create' ? !busy : !busy && !(mode === 'edit' && qEdit.isFetching);

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            {mode === 'create'
              ? t('PlayerMembershipModal.titleCreate')
              : mode === 'edit'
                ? t('PlayerMembershipModal.titleEdit')
                : t('PlayerMembershipModal.titleExtend')}
          </div>

          <div className={styles.headerActions}>
            <button className={styles.btnGhost} type="button" onClick={onClose} disabled={busy}>
              {t('PlayerMembershipModal.cancel')}
            </button>

            <button className={styles.btnPrimary} type="button" onClick={() => formRef.current?.submit()} disabled={!canSubmit}>
              {busy ? t('PlayerMembershipModal.saving') : t('PlayerMembershipModal.save')}
            </button>
          </div>
        </div>

        <PlayerMembershipForm
          key={`${mode}:${membershipId ?? 'new'}`}
          ref={formRef}
          mode={mode}
          membershipId={membershipId}
          defaultValues={defaultValues}
          scopedClubId={clubId}
          isClubScoped
          busy={busy}
          loadingEdit={(mode === 'edit' || mode === 'extend') ? qEdit.isFetching : false}
          plans={Array.isArray(qPlans.data) ? qPlans.data : []}
          plansLoading={qPlans.isFetching}
          onSubmitCreate={async (v) => {
            const dto: CreatePlayerMembershipDto = {
              clubId: v.clubId,

              validFrom: toIsoStartOfDaySafe(v.validFrom),
              validUntil: toIsoStartOfDaySafe(v.validUntil),

              sportType: v.sportType as any,
              trainingType: v.trainingType as any,

              trainingsTotalGranted: v.trainingsTotalGranted,

              // ✅ НОВЕ
              planId: String(v.planId),
            };

            await createM.mutateAsync({ playerId, clubId, dto });
          }}
          onSubmitUpdate={async (mId, v) => {
            const status = v.status ?? (initialMembership as any)?.status ?? 'Active';
            const validFrom = v.validFrom || String((initialMembership as any)?.validFrom ?? '').slice(0, 10);
            const trainingsTotalGranted =
              Number(v.trainingsTotalGranted ?? (initialMembership as any)?.trainingsTotalGranted ?? 0) || 0;

            const dto: UpdatePlayerMembershipDto = {
              status,
              trainingsLeft: typeof v.trainingsLeft === 'number' ? v.trainingsLeft : Number(v.trainingsLeft ?? 0),
              trainingsTotalGranted,
              validFrom: toIsoStartOfDaySafe(validFrom),
              validUntil: toIsoStartOfDaySafe(v.validUntil),
            };

            await updateM.mutateAsync({ playerId, membershipId: mId, dto });
          }}
        />
      </div>
    </div>
  );
}
