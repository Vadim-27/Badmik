

// src/app/components/shared/Players/PlayerMemberships/PlayerMembershipsPageClient.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import styles from './PlayerMembershipsPageClient.module.scss';

import PlayerMembershipsScreen from './PlayerMembershipsScreen';
import PlayerMembershipModal from './PlayerMembershipModal/PlayerMembershipModal';

import ConfirmDialog from '@/app/components/ui/DeleteModal/ConfirmDialog';

import type {
  PlayerMembership,
  CreatePlayerMembershipDto,
} from '@/services/types/playerMemberships.dto';
import {
  useCreatePlayerMembership,
  useDeletePlayerMembership,
} from '@/services/playerMemberships/queries.client';

import { qk } from '@/services/_shared/queryKeys';
import { clubMembershipPlansApiClient } from '@/services/clubMembershipPlans/api.client';
import type { ClubMembershipPlan } from '@/services/types/clubMembershipPlans.dto';

import { usePlayerTabsHeaderAction } from '@/app/components/shared/Players/PlayerTabsLayout/PlayerTabsHeaderActionContext';

function toIsoStartOfDaySafe(input: string): string {
  if (!input) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!m) return new Date(input).toISOString();
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return new Date(Date.UTC(y, mo - 1, d, 0, 0, 0)).toISOString();
}

// YYYY-MM-DD from ISO/date
function toDateOnly(value?: string | Date | null) {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  // локально формувати не треба, нам треба yyyy-mm-dd
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(dateOnly: string, days: number) {
  if (!dateOnly) return '';
  const [y, m, d] = dateOnly.split('-').map(Number);
  if (!y || !m || !d) return '';
  const dt = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  dt.setUTCDate(dt.getUTCDate() + Number(days || 0));
  return toDateOnly(dt);
}

function formatUA(dateOnly: string) {
  if (!dateOnly) return '';
  const [y, m, d] = dateOnly.split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(Date.UTC(y, m - 1, d, 0, 0, 0)));
}

type Props = {
  clubId: string;
  playerId: string;
};

export default function PlayerMembershipsPageClient({ clubId, playerId }: Props) {
  const tUI = useTranslations('UI');
  const tPM = useTranslations('PlayerMemberships');
  const qc = useQueryClient();

  const { setHeaderAction } = usePlayerTabsHeaderAction();

  // create/edit modal (ручне створення/редагування)
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [membershipId, setMembershipId] = useState<string | undefined>(undefined);

  const openCreate = useCallback(() => {
    setMode('create');
    setMembershipId(undefined);
    setOpen(true);
  }, []);

  const openEdit = useCallback((id: string) => {
    setMode('edit');
    setMembershipId(id);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  // finish/delete confirm
  const [finishConfirmOpen, setFinishConfirmOpen] = useState(false);
  const [finishingId, setFinishingId] = useState<string | undefined>(undefined);

  const delM = useDeletePlayerMembership({
    onSuccess: () => {
      setFinishConfirmOpen(false);
      setFinishingId(undefined);
    },
  });

  const openFinishConfirm = useCallback((id: string) => {
    setFinishingId(id);
    setFinishConfirmOpen(true);
  }, []);

  const closeFinishConfirm = useCallback(() => {
    if (delM.isPending) return;
    setFinishConfirmOpen(false);
    setFinishingId(undefined);
  }, [delM.isPending]);

  const confirmFinish = useCallback(async () => {
    if (!finishingId) return;
    await delM.mutateAsync({ playerId, clubId, membershipId: finishingId });
  }, [delM, finishingId, clubId, playerId]);

  // ✅ extend confirm (новий сценарій)
  const [extendConfirmOpen, setExtendConfirmOpen] = useState(false);
  const [extendDraft, setExtendDraft] = useState<{
    sourceMembership: PlayerMembership;
    plan: ClubMembershipPlan;
    validFromDateOnly: string;
    validUntilDateOnly: string;
  } | null>(null);

  const createM = useCreatePlayerMembership({
    onSuccess: () => {
      setExtendConfirmOpen(false);
      setExtendDraft(null);
    },
  });

  const closeExtendConfirm = useCallback(() => {
    if (createM.isPending) return;
    setExtendConfirmOpen(false);
    setExtendDraft(null);
  }, [createM.isPending]);

  const confirmExtend = useCallback(async () => {
    if (!extendDraft) return;

    const anyM = extendDraft.sourceMembership as any;
    const plan = extendDraft.plan;

    const dto: CreatePlayerMembershipDto = {
      clubId,
      planId: String((plan as any).id),
      sportType: plan.sportType,
      trainingType: plan.trainingType,
      trainingsTotalGranted: Number(plan.trainingsGranted ?? 0) || 0,

      // ✅ старт = дата завершення поточного, фініш = + durationDays
      validFrom: toIsoStartOfDaySafe(extendDraft.validFromDateOnly),
      validUntil: toIsoStartOfDaySafe(extendDraft.validUntilDateOnly),
    };

    await createM.mutateAsync({ playerId, dto });

    // 👇 підстраховка, якщо бек довго консистентний: примусово рефетчимо список
    await qc.invalidateQueries({ queryKey: qk.playerMemberships.list({ playerId, clubId }) });
  }, [extendDraft, clubId, createM, playerId, qc]);

  const onExtend = useCallback(
    async (membership: PlayerMembership) => {
      const anyM = membership as any;

      const planId = String(anyM?.planId ?? '');
      const currentValidUntil = anyM?.validUntil;

      if (!planId) {
        // не кидаємо ексепшн через t(), якщо ключа нема
        toast.error(() => {
          try {
            return tPM('extend.planIdMissing');
          } catch {
            return 'Не знайдено planId для цього абонемента.';
          }
        });
        return;
      }

      // старт нової підписки = validUntil старої (dateOnly)
      const startDateOnly = toDateOnly(currentValidUntil);
      if (!startDateOnly) {
        toast.error(() => {
          try {
            return tPM('extend.noValidUntil');
          } catch {
            return 'Неможливо продовжити: у поточного абонемента немає validUntil.';
          }
        });
        return;
      }

      try {
        // ✅ ВАЖЛИВО: НЕ через state, а напряму по planId
        const plan = await qc.fetchQuery({
          queryKey: qk.clubMembershipPlans.byId(clubId, planId),
          queryFn: ({ signal }) => clubMembershipPlansApiClient.byId(clubId, planId, signal),
          staleTime: 0,
        });

        const isActive = Boolean((plan as any)?.isActive);
        if (plan.isActive === false) {
          // toast.warning(() => {
          //   try {
          //     return tPM('extend.planInactive');
          //   } catch {
          //     return 'Вибачте, даний план вже неактивний — продовжити неможливо.';
          //   }
          // });
          toast.warning(tPM('extend.planInactive'));
          return;
        }

        const days = Number((plan as any)?.durationDays ?? 0) || 0;
        const endDateOnly = addDays(startDateOnly, days);

        setExtendDraft({
          sourceMembership: membership,
          plan,
          validFromDateOnly: startDateOnly,
          validUntilDateOnly: endDateOnly,
        });

        setExtendConfirmOpen(true);
      } catch (e) {
        toast.error(() => {
          try {
            return tPM('extend.planLoadFailed');
          } catch {
            return 'Не вдалося завантажити план абонемента.';
          }
        });
      }
    },
    [clubId, qc, tPM]
  );

  // ✅ кнопка в ActionHeader (в табі subscriptions повинна бути завжди)
  const headerBtnLabel = useMemo(() => {
    try {
      return tUI('buttons.addMembership');
    } catch {
      return 'Додати підписку';
    }
  }, [tUI]);

  useEffect(() => {
    setHeaderAction(
      <button type="button" onClick={openCreate} className={styles.headerBtnPrimary}>
        {headerBtnLabel}
      </button>
    );

    return () => setHeaderAction(null);
  }, [setHeaderAction, openCreate, headerBtnLabel]);

  const extendMsg = useMemo(() => {
    if (!extendDraft) return '';
    const from = formatUA(extendDraft.validFromDateOnly);
    const until = formatUA(extendDraft.validUntilDateOnly);

    try {
      // якщо є ключ — формуємо красиво
      return tPM('extend.confirm.message', { from, until });
    } catch {
      return `Продовжити абонемент? Новий період: ${from} — ${until}. Цю дію не можна скасувати.`;
    }
  }, [extendDraft, tPM]);

  return (
    <div className={styles.wrapper}>
      <PlayerMembershipsScreen
        clubId={clubId}
        playerId={playerId}
        onEdit={openEdit}
        onExtend={onExtend}
        onFinish={openFinishConfirm}
        disabledIds={[...(delM.isPending && finishingId ? [finishingId] : [])]}
      />

      <PlayerMembershipModal
        open={open}
        mode={mode as any}
        onClose={closeModal}
        playerId={playerId}
        clubId={clubId}
        membershipId={membershipId}
      />

      {/* ✅ Finish/delete confirm лишається */}
      <ConfirmDialog
        open={finishConfirmOpen}
        title={(() => {
          try {
            return tPM('confirmFinish.title');
          } catch {
            return 'Підтвердження';
          }
        })()}
        message={(() => {
          try {
            return tPM('confirmFinish.message');
          } catch {
            return 'Завершити (видалити) абонемент? Цю дію не можна скасувати.';
          }
        })()}
        confirmLabel={(() => {
          try {
            return tPM('confirmFinish.confirm');
          } catch {
            return 'Так';
          }
        })()}
        cancelLabel={(() => {
          try {
            return tPM('confirmFinish.cancel');
          } catch {
            return 'Ні';
          }
        })()}
        onCancel={closeFinishConfirm}
        onConfirm={confirmFinish}
        isLoading={delM.isPending}
      />

      {/* ✅ Extend confirm (новий) */}
      <ConfirmDialog
        open={extendConfirmOpen}
        title={(() => {
          try {
            return tPM('extend.confirm.title');
          } catch {
            return 'Підтвердження';
          }
        })()}
        message={extendMsg}
        confirmLabel={(() => {
          try {
            return tPM('extend.confirm.confirm');
          } catch {
            return 'Так, продовжити';
          }
        })()}
        cancelLabel={(() => {
          try {
            return tPM('extend.confirm.cancel');
          } catch {
            return 'Ні';
          }
        })()}
        onCancel={closeExtendConfirm}
        onConfirm={confirmExtend}
        isLoading={createM.isPending}
      />
    </div>
  );
}
