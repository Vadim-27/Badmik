'use client';

import { useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';

import ModalShell from '../_ui/ModalShell/ModalShell';
import ClubMembershipPlanForm, {
  type ClubMembershipPlanFormHandle,
  type ClubMembershipPlanFormValues,
} from '../ClubMembershipPlanForm/ClubMembershipPlanForm';

import {
  useClubMembershipPlanById,
  useCreateClubMembershipPlan,
  useUpdateClubMembershipPlan,
} from '@/services/clubMembershipPlans/queries.client';

import type {
  CreateClubMembershipPlanDto,
  UpdateClubMembershipPlanDto,
} from '@/services/types/clubMembershipPlans.dto';

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;

  clubId: string;
  planId?: string;
};

function mapPlanToForm(plan: any): Partial<ClubMembershipPlanFormValues> {
  if (!plan) return {};
  return {
    clubId: plan.clubId ?? '',
    name: plan.name ?? '',
    durationDays: Number(plan.durationDays ?? 0) || 0,
    trainingsGranted: Number(plan.trainingsGranted ?? 0) || 0,
    sportType: plan.sportType ?? '',
    trainingType: plan.trainingType ?? '',
    isActive: Boolean(plan.isActive),
  };
}

export default function ClubMembershipPlanModal({ open, mode, onClose, clubId, planId }: Props) {
  const t = useTranslations('ClubMembershipPlans');

  const formRef = useRef<ClubMembershipPlanFormHandle | null>(null);

  const qEdit = useClubMembershipPlanById(clubId, planId ?? '', {
    enabled: open && mode === 'edit' && Boolean(clubId) && Boolean(planId),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const initialPlan = mode === 'edit' ? (qEdit.data ?? null) : null;

  const defaultValues = useMemo<Partial<ClubMembershipPlanFormValues>>(() => {
    if (mode === 'create') {
      return { clubId, isActive: true };
    }
    return { clubId, ...mapPlanToForm(initialPlan) };
  }, [mode, clubId, initialPlan]);

  const createM = useCreateClubMembershipPlan();
  const updateM = useUpdateClubMembershipPlan();

  const busy =
    createM.isPending ||
    updateM.isPending ||
    (mode === 'edit' && qEdit.isFetching);

  const title =
    mode === 'create' ? t('modal.titleCreate') : t('modal.titleEdit');

  const submit = () => formRef.current?.submit();

  return (
    <ModalShell
      open={open}
      title={title}
      busy={busy}
      onClose={onClose}
      onSubmit={submit}
      cancelLabel={t('modal.cancel')}
      submitLabel={t('modal.save')}
      savingLabel={t('modal.saving')}
    >
      <ClubMembershipPlanForm
        key={`${mode}:${planId ?? 'new'}`}
        ref={formRef}
        mode={mode}
        planId={planId}
        clubId={clubId}
        defaultValues={defaultValues}
        loadingEdit={mode === 'edit' ? qEdit.isFetching : false}
        busy={busy}
        onSubmitCreate={async (v) => {
          const dto: CreateClubMembershipPlanDto = {
            clubId,
            name: v.name,
            durationDays: Number(v.durationDays),
            trainingsGranted: Number(v.trainingsGranted),
            sportType: v.sportType,
            trainingType: v.trainingType,
            isActive: Boolean(v.isActive),
          };

          await createM.mutateAsync({ clubId, dto });
          onClose();
        }}
        onSubmitUpdate={async (id, v) => {
          const dto: UpdateClubMembershipPlanDto = {
            name: v.name,
            durationDays: Number(v.durationDays),
            trainingsGranted: Number(v.trainingsGranted),
            sportType: v.sportType,
            trainingType: v.trainingType,
            isActive: Boolean(v.isActive),
          };

          await updateM.mutateAsync({ clubId, planId: id, dto });
          onClose();
        }}
      />
    </ModalShell>
  );
}
