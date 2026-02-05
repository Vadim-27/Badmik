// app/components/shared/Players/EditPlayer/EditPlayer.tsx
'use client';

import React, { useMemo, useRef, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

import PlayerForm, { type PlayerFormHandle, type FormValues } from '../PlayerForm/PlayerForm';

import { usePlayerById, useUpdatePlayer } from '@/services/players/queries.client';
import type { Player, UpdatePlayerDto, PlayerSportProfile } from '@/services/types/players.dto';

import { getApiErrorMessage } from '@/lib/http/utils';
import { useTranslations } from 'next-intl';
import css from './EditPlayer.module.scss';
import { buildHrefServer } from '@/lib/club-scope.server';

type Props = {
  clubIdParams?: string;
  playerId: string;
//   initialData: Player;
};

const toDateTimeISO = (d?: string | null) => (d ? new Date(d + 'T00:00:00Z').toISOString() : null);

function mapFromDtoToForm(p?: Player | null): FormValues {
  const u = p?.user ?? null;

  const sportProfiles =
    (p?.sportProfiles ?? [])
      .filter((sp): sp is PlayerSportProfile => Boolean(sp?.sport))
      .map((sp) => ({
        sport: sp.sport as any,
        level: (sp.level ?? 'D') as any,
      })) ?? [];

  return {
    email: u?.email ?? '',
    password: '',
    firstName: u?.firstName ?? '',
    lastName: u?.lastName ?? '',
    phoneNumber: u?.phoneNumber ?? '',
    clubId: p?.clubId ?? '',
    doB: u?.doB ? String(u.doB).slice(0, 10) : '',
    gender: (u?.gender ?? 'NotSet') as any,
    sportProfiles, // ✅ може бути []
  };
}

export default function EditPlayer({ clubIdParams, playerId, }: Props) {
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

  const q = usePlayerById(playerId, {
    // initialData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const player = q.data;

  const defaultValues = useMemo(
    () => mapFromDtoToForm(player),
    [player]
  );

  const updatePlayer = useUpdatePlayer();

  const buildUpdateDto = (v: FormValues): UpdatePlayerDto => ({
    id: playerId,
    email: v.email.trim(),
    firstName: v.firstName.trim(),
    lastName: v.lastName.trim(),
    phoneNumber: v.phoneNumber.trim(),
    clubId: v.clubId,
    gender: v.gender,
    doB: toDateTimeISO(v.doB),
    sportProfiles: (v.sportProfiles ?? []).map(
      (sp): PlayerSportProfile => ({
        sport: sp.sport,
        level: sp.level,
      })
    ),
  });

const addHref = buildHrefServer(clubIdParams, `players`);

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.editPlayerHeader')}</h2>
        <SaveButton
          onClick={() => formRef.current?.submit()}
          disabled={!isChanged}
          label="buttons.save"
        />
      </ActionHeader>

      <div className={css.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: tBC('Admin'), href: '/admin/dashboard' },
            { label: tBC('Players'), href: addHref },
            { label: tBC('EditPlayer') },
          ]}
        />
      </div>

      <PlayerForm
        ref={formRef}
        mode="edit"
        playerId={playerId}
        initialPlayer={(player ) as Player}
        defaultValues={defaultValues}
        scopedClubId={clubIdParams}
        isClubScoped={Boolean(clubIdParams)}
        setIsChanged={setIsChanged}
        onSubmitUpdate={async (_id, values) => {
          try {
            const dto = buildUpdateDto(values);
            console.log('🟡 EDIT PLAYER payload', dto);

            await updatePlayer.mutateAsync({ id: playerId, dto });

           
            await q.refetch();

            setSnack({ open: true, severity: 'success', message: 'Зміни збережено' });
          } catch (e) {
            setSnack({ open: true, severity: 'error', message: getApiErrorMessage(e) });
            throw e;
          }
        }}
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
