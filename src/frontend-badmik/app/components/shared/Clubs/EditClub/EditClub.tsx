// // app/components/shared/Clubs/EditClub/EditClub.tsx
// 'use client';

// import React, { useRef, useState } from 'react';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import { useTranslations } from 'next-intl';

// import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
// import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
// import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
// import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

// import ClubForm, {
//   type ClubFormHandle,
//   type ClubFormValues,
// } from '@/app/components/shared/Clubs/ClubForm/ClubForm';

// import type { Club, UpdateClubDto } from '@/services/types/clubs.dto';
// import { useClubById, useUpdateClub } from '@/services/clubs/queries.client';
// import { getApiErrorMessage } from '@/lib/http/utils';

// import css from './EditClub.module.scss';

// type Props = {
//   clubId: string;
//   initialData: Club;
// };

// function mapFromDtoToForm(dto: Club): ClubFormValues {
//   return {
//     name: dto.name ?? '',
//     alias: dto.alias ?? '',
//     city: dto.city ?? '',
//     address: dto.address ?? '',
//     email: dto.email ?? '',
//     phone: dto.phone ?? '',
//     website: dto.website ?? '',
//     description: dto.description ?? '',
//     isActive: dto.isActive,
//     sortOrder: dto.order ?? 1,
//   };
// }

// export default function EditClub({ clubId, initialData }: Props) {
//   const tAH = useTranslations('ActionHeader');

//   const formRef = useRef<ClubFormHandle | null>(null);
//   const [isChanged, setIsChanged] = useState(false);
//   const [snack, setSnack] = useState<{
//     open: boolean;
//     severity: 'success' | 'error';
//     message: string;
//   }>({
//     open: false,
//     severity: 'success',
//     message: '',
//   });

//   // підтягуємо актуальний клуб, але з initialData від сервера
//   const q = useClubById(clubId, {
//     initialData,
//     staleTime: 30_000,
//     refetchOnWindowFocus: false,
//   });

//   const club = (q.data ?? initialData) as Club;

//   const defaultValues: ClubFormValues = mapFromDtoToForm(club);

//   const updateClub = useUpdateClub();
  

//   const handleUpdate = async (_id: string, v: ClubFormValues) => {
//     const payload: UpdateClubDto = {
//       id: clubId,
//       name: v.name?.trim() || null,
//       alias: v.alias?.trim() || null,
//       city: v.city?.trim() || null,
//       address: v.address?.trim() || null,
//       email: v.email?.trim() || null,
//       phone: v.phone?.trim() || null,
//       website: v.website?.trim() || null,
//       description: v.description?.trim() || null,
//       isActive: v.isActive,
//       order: v.sortOrder ?? 1,
//     };

//     console.groupCollapsed('➡️ /clubs/{id} (update) payload');
//     console.log('raw form:', v);
//     console.log('payload:', payload);
//     console.groupEnd();

//     try {
//       await updateClub.mutateAsync({ id: clubId, dto: payload });
//       setSnack({
//         open: true,
//         severity: 'success',
//         message: 'Зміни збережено',
//       });
//       setIsChanged(false);
//     } catch (err) {
//       const msg = getApiErrorMessage(err);
//       console.error('❌ Update club failed:', msg, err);
//       setSnack({
//         open: true,
//         severity: 'error',
//         message: msg,
//       });
//     }
//   };

//   return (
//     <>
//       <ActionHeader>
//         <BackButton label="buttons.back" />
//         <h2 className="text-lg font-semibold">
//           {tAH('title.editClubHeader')}
//         </h2>
//         <SaveButton
//           onClick={() => formRef.current?.submit()}
//           disabled={!isChanged || updateClub.isPending}
//           label={updateClub.isPending ? 'buttons.saving' : 'buttons.save'}
//         />
//       </ActionHeader>

//       <div className={css.wrapperBreadcrumbs}>
//         <AppBreadcrumbs
//           items={[
//             { label: 'Admin', href: '/admin/dashboard' },
//             { label: 'Clubs', href: '/admin/clubs' },
//             { label: 'Edit Club' },
//           ]}
//         />
//       </div>

//       <ClubForm
//         ref={formRef}
//         mode="edit"
//         clubId={clubId}
//         defaultValues={defaultValues}
//         isChanged={isChanged}
//         setIsChanged={setIsChanged}
//         onSubmitUpdate={handleUpdate}
//         busy={updateClub.isPending} // ⬅️ спінер тільки на формі
//       />

//       <Snackbar
//         open={snack.open}
//         autoHideDuration={4000}
//         onClose={() => setSnack((s) => ({ ...s, open: false }))}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert
//           severity={snack.severity}
//           variant="filled"
//           onClose={() => setSnack((s) => ({ ...s, open: false }))}
//           sx={{ width: '100%' }}
//         >
//           {snack.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }



//====================================================  


// app/components/shared/Clubs/EditClub/EditClub.tsx
'use client';

import React, { useRef, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTranslations } from 'next-intl';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

import ClubForm, {
  type ClubFormHandle,
  type ClubFormValues,
} from '@/app/components/shared/Clubs/ClubForm/ClubForm';

import type { Club, UpdateClubDto } from '@/services/types/clubs.dto';
import {
  useClubById,
  useUpdateClub,
  useActivateClub,
  useDeactivateClub,
} from '@/services/clubs/queries.client';
import { getApiErrorMessage } from '@/lib/http/utils';

import css from './EditClub.module.scss';

type Props = {
  clubId: string;
  initialData: Club;
};

function mapFromDtoToForm(dto: Club): ClubFormValues {
  return {
    name: dto.name ?? '',
    alias: dto.alias ?? '',
    city: dto.city ?? '',
    address: dto.address ?? '',
    email: dto.email ?? '',
    phone: dto.phone ?? '',
    website: dto.website ?? '',
    description: dto.description ?? '',
    isActive: dto.isActive,
    sortOrder: dto.order ?? 1,
  };
}

export default function EditClub({ clubId, initialData }: Props) {
  const tAH = useTranslations('ActionHeader');

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

  const q = useClubById(clubId, {
    initialData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const club = (q.data ?? initialData) as Club;
  const defaultValues: ClubFormValues = mapFromDtoToForm(club);

  const updateClub = useUpdateClub();
  const activateClub = useActivateClub();
  const deactivateClub = useDeactivateClub();

  const handleUpdate = async (_id: string, v: ClubFormValues) => {
    const wasActive = club.isActive;
    const nextActive = v.isActive;

    const payload: UpdateClubDto = {
      name: v.name?.trim() || null,
      alias: v.alias?.trim() || null,
      city: v.city?.trim() || null,
      address: v.address?.trim() || null,
      email: v.email?.trim() || null,
      phone: v.phone?.trim() || null,
      website: v.website?.trim() || null,
      description: v.description?.trim() || null,
      // статус більше не чіпаємо через PUT — окремі ендпоінти
      order: v.sortOrder ?? 1,
    };

    console.groupCollapsed('➡️ /clubs/{id} (update) + activate/deactivate');
    console.log('raw form:', v);
    console.log('payload (without isActive):', payload);
    console.log('wasActive:', wasActive, 'nextActive:', nextActive);
    console.groupEnd();

    try {
      // 1) звичайний апдейт
      await updateClub.mutateAsync({ id: clubId, dto: payload });

      // 2) якщо статус змінився — окремий запит
      if (wasActive !== nextActive) {
        if (nextActive) {
          await activateClub.mutateAsync(clubId);
        } else {
          await deactivateClub.mutateAsync(clubId);
        }
      }

      setSnack({
        open: true,
        severity: 'success',
        message: 'Зміни збережено',
      });
      setIsChanged(false);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      console.error('❌ Update/activate/deactivate club failed:', msg, err);
      setSnack({
        open: true,
        severity: 'error',
        message: msg,
      });
    }
  };

  const anyPending =
    updateClub.isPending || activateClub.isPending || deactivateClub.isPending;

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">
          {tAH('title.editClubHeader')}
        </h2>
        <SaveButton
          onClick={() => formRef.current?.submit()}
          disabled={!isChanged || anyPending}
          label={anyPending ? 'buttons.saving' : 'buttons.save'}
        />
      </ActionHeader>

      <div className={css.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: 'Admin', href: '/admin/dashboard' },
            { label: 'Clubs', href: '/admin/clubs' },
            { label: 'Edit Club' },
          ]}
        />
      </div>

      <ClubForm
        ref={formRef}
        mode="edit"
        clubId={clubId}
        defaultValues={defaultValues}
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitUpdate={handleUpdate}
        busy={anyPending} // спінер тільки на формі
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
