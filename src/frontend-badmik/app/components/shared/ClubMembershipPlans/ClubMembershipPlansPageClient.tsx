// src/app/components/shared/ClubMembershipPlans/ClubMembershipPlansPageClient.tsx
'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

import styles from './ClubMembershipPlansPageClient.module.scss';

import ClubMembershipPlansScreen from './ClubMembershipPlansScreen/ClubMembershipPlansScreen';
import ClubMembershipPlanModal from './ClubMembershipPlanModal/ClubMembershipPlanModal';

type BreadcrumbItem = { label: string; href?: string };

type Props = {
  title: string;
  clubId: string;
  breadcrumbs: BreadcrumbItem[];
};

export default function ClubMembershipPlansPageClient({ title, clubId, breadcrumbs }: Props) {
  const tUI = useTranslations('UI');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const openCreate = useCallback(() => {
    setModalMode('create');
    setEditingId(undefined);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((id: string) => {
    setModalMode('edit');
    setEditingId(id);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(undefined);
    setModalMode('create');
  }, []);

  const headerBtnLabel = useMemo(() => tUI('buttons.addPlan'), [tUI]);

  return (
    <div className="pt-0 p-4 w-full">
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{title}</h2>

        <button type="button" onClick={openCreate} className={styles.btnPrimary}>
          {headerBtnLabel}
        </button>
      </ActionHeader>

      <AppBreadcrumbs items={breadcrumbs} />

      <ClubMembershipPlansScreen clubId={clubId} onEdit={openEdit} />

      <ClubMembershipPlanModal
        open={modalOpen}
        mode={modalMode}
        onClose={closeModal}
        clubId={clubId}
        planId={editingId}
      />
    </div>
  );
}
