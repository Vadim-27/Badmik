// app/components/shared/Clubs/AddClub/AddClub.tsx
'use client';

import { useRef, useState } from 'react';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import ClubForm, {
  type ClubFormHandle,
  type ClubFormValues,
} from '@/app/components/shared/Clubs/ClubForm/ClubForm';

import { useCreateClub } from '@/services/clubs/queries.client';
import type { CreateClubDto } from '@/services/types/clubs.dto';
import { getApiErrorMessage } from '@/lib/http/utils';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

import css from './AddClub.module.scss';

const AddClub = () => {
  const tHeader = useTranslations('ActionHeader');

  const formRef = useRef<ClubFormHandle | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  const [snack, setSnack] = useState<{
    open: boolean;
    severity: 'success' | 'error';
    message: string;
  }>({
    open: false,
    severity: 'success',
    message: '',
  });

  const createClub = useCreateClub();

  const handleCreate = async (v: ClubFormValues): Promise<void> => {
    const payload: CreateClubDto = {
      name: v.name?.trim() || null,
      alias: v.alias?.trim() || null,
      city: v.city?.trim() || null,
      address: v.address?.trim() || null,
      email: v.email?.trim() || null,
      phone: v.phone?.trim() || null,
      website: v.website?.trim() || null,
      description: v.description?.trim() || null,
      isActive: v.isActive,
      order: v.sortOrder ?? 1,
    };

    console.groupCollapsed('➡️ /clubs (create) payload');
    console.log('raw form:', v);
    console.log('payload:', payload);
    console.groupEnd();

    try {
      const created = await createClub.mutateAsync(payload);
      setSnack({
        open: true,
        severity: 'success',
        message: 'Клуб створено',
      });
      console.log('✅ Club created:', created);
      // при бажанні можна сюди додати redirect
      setIsChanged(false);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setSnack({
        open: true,
        severity: 'error',
        message: msg,
      });
      console.error('❌ Create club failed:', msg, err);
    }
  };

  const handleSaveClick = () => {
    formRef.current?.submit();
  };

  return (
    <div className="font-geist-sans">
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h1 className="text-lg font-semibold">
          {tHeader('title.addClubHeader')}
        </h1>
        <div className="flex flex-wrap gap-2">
          <SaveButton
            onClick={handleSaveClick}
            disabled={!isChanged || createClub.isPending}
            label={createClub.isPending ? 'buttons.saving' : 'buttons.save'}
          />
        </div>
      </ActionHeader>

      <div className={css.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: 'Admin', href: '/admin/dashboard' },
            { label: 'Clubs', href: '/admin/clubs' },
            { label: 'Add Club' },
          ]}
        />
      </div>

      <ClubForm
        ref={formRef}
        mode="create"
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitCreate={handleCreate}
        busy={createClub.isPending}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
      
    </div>
  );
};

export default AddClub;
