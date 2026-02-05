

// app/components/shared/Players/AddPlayer/AddPlayer.tsx
'use client';

import React, { useRef, useState } from 'react';
import PlayerForm, { type PlayerFormHandle, type FormValues } from '../PlayerForm/PlayerForm';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';

import type { CreatePlayerDto, PlayerSportProfile } from '@/services/types/players.dto';
import { useCreatePlayer } from '@/services/players/queries.client';
import { getApiErrorMessage } from '@/lib/http/utils';

import css from './AddPlayer.module.scss';
import { buildHrefServer } from '@/lib/club-scope.server';

type Props = {
  clubIdParams?: string;
};

function toIsoStartOfDaySafe(input: string): string {
  if (!input) return '';

  if (input.includes('T') && !Number.isNaN(Date.parse(input))) {
    return new Date(input).toISOString();
  }

  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    return new Date(Date.UTC(y, mo - 1, d, 0, 0, 0)).toISOString();
  }

  const parsed = Date.parse(input);
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();

  return '';
}

export default function AddPlayer({ clubIdParams }: Props) {
  const tAH = useTranslations('ActionHeader');
  const tBC = useTranslations('playersBreadcrumbs');

  const formRef = useRef<PlayerFormHandle | null>(null);
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

  const qc = useQueryClient();

  const createPlayer = useCreatePlayer({
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['players'] });
      setSnack({ open: true, severity: 'success', message: 'Гравця створено' });
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err);
      setSnack({ open: true, severity: 'error', message: msg });

      const lower = msg.toLowerCase();
      const emailTaken =
        lower.includes('email') &&
        (lower.includes('already') || lower.includes('in use') || lower.includes('використовується'));

      if (emailTaken) formRef.current?.setFieldError?.('email', 'Email вже використовується');
    },
  });

  const handleCreate = async (v: FormValues) => {
    const sportProfiles: PlayerSportProfile[] = (v.sportProfiles ?? []).map((sp) => ({
      sport: sp.sport,
      level: sp.level,
    }));

    const payload: CreatePlayerDto = {
      email: v.email.trim(),
      password: v.password,
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      phoneNumber: v.phoneNumber.trim(),
      clubId: v.clubId,
      gender: v.gender,
      doB: toIsoStartOfDaySafe(v.doB),
      sportProfiles, // ✅ може бути []
    };

    console.log('🟢 ADD PLAYER payload', payload);
    await createPlayer.mutateAsync(payload);
  };

  const playersHref = buildHrefServer(clubIdParams, `players`);
  const isClubScoped = Boolean(clubIdParams);

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.addPlayerHeader')}</h2>
        <SaveButton
          onClick={() => formRef.current?.submit()}
          disabled={!isChanged || createPlayer.isPending}
          label={createPlayer.isPending ? 'buttons.saving' : 'buttons.save'}
        />
      </ActionHeader>

      <div className={css.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: tBC('Admin'), href: '/admin/dashboard' },
            { label: tBC('Players'), href: playersHref },
            { label: tBC('AddPlayer') },
          ]}
        />
      </div>

      <PlayerForm
        ref={formRef}
        mode="create"
        setIsChanged={setIsChanged}
        onSubmitCreate={handleCreate}
        busy={createPlayer.isPending}
        scopedClubId={clubIdParams}
        isClubScoped={isClubScoped}
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
    </>
  );
}

