// app/components/shared/Locations/AddLocation/AddLocation.tsx
'use client';

import { useRef, useState } from 'react';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import LocationForm, {
  type LocationFormHandle,
  type LocationFormValues,
} from '@/app/components/shared/Locations/LocationsForm/LocationsForm';

import { useCreateLocation } from '@/services/locations/queries.client';
import type {
  CreateLocationDto,
  AmenityType,
  LocationSportDto,
} from '@/services/types/locations.dto';
import { getApiErrorMessage } from '@/lib/http/utils';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

import css from './AddLocation.module.scss';

const AddLocation = ({ clubIdParams }: { clubIdParams?: string }) => {
  const tHeader = useTranslations('ActionHeader');

  const formRef = useRef<LocationFormHandle | null>(null);
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

  const createLocation = useCreateLocation();

  const buildSports = (v: LocationFormValues): LocationSportDto[] => {
    const sports: LocationSportDto[] = [];

    const pushIf = (
      enabled: boolean,
      courts: number,
      sportType: LocationSportDto['sportType'],
    ) => {
      if (enabled && courts > 0) {
        sports.push({ sportType, courtCount: courts });
      }
    };

    pushIf(v.sports.badmintonEnabled, v.sports.badmintonCourts, 'Badminton');
    pushIf(v.sports.squashEnabled, v.sports.squashCourts, 'Squash');
    pushIf(v.sports.padelEnabled, v.sports.padelCourts, 'Padel');
    pushIf(v.sports.pickleballEnabled, v.sports.pickleballCourts, 'Pickleball');
    pushIf(v.sports.tableTennisEnabled, v.sports.tableTennisTables, 'TableTennis');
    pushIf(v.sports.tennisEnabled, v.sports.tennisCourts, 'Tennis');

    return sports;
  };

  const buildAmenities = (v: LocationFormValues): AmenityType[] => {
    const a: AmenityType[] = [];
    if (v.amenities.parking) a.push('Parking');
    if (v.amenities.water) a.push('Water');
    if (v.amenities.conditioner) a.push('AirConditioning');
    if (v.amenities.shower) a.push('Shower');
    if (v.amenities.wifi) a.push('WiFi');
    return a;
  };

  const handleCreate = async (v: LocationFormValues): Promise<void> => {
    const sports = buildSports(v);
    const amenities = buildAmenities(v);

    const payload: CreateLocationDto = {
      clubId: v.clubId,
      name: v.name?.trim() || null,
      city: v.city?.trim() || null,
      address: v.address?.trim() || null,
      label: (v.label as any) || 'None',
      isActive: v.isActive,
      order: v.order ?? 1,
      priceText: v.priceText?.trim() || null,
      description: v.shortDescription?.trim() || null,
      logo: null, // поки що немає поля в формі
      amenities: amenities.length ? amenities : null,
      sports: sports.length ? sports : null,
      workingHours: v.workingHours,
    };

    console.groupCollapsed('➡️ /locations (create) payload');
    console.log('raw form:', v);
    console.log('payload:', payload);
    console.groupEnd();

    try {
      const created = await createLocation.mutateAsync(payload);
      setSnack({
        open: true,
        severity: 'success',
        message: 'Локацію створено',
      });
      console.log('✅ Location created:', created);
      setIsChanged(false);
      // за бажанням — redirect
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setSnack({
        open: true,
        severity: 'error',
        message: msg,
      });
      console.error('❌ Create location failed:', msg, err);
    }
  };

  const handleSaveClick = () => {
    formRef.current?.submit();
  };
  const isClubScoped = Boolean(clubIdParams);

  return (
    <div className="font-geist-sans">
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h1 className="text-lg font-semibold">
          {tHeader('title.addLocationHeader')}
        </h1>
        <div className="flex flex-wrap gap-2">
          <SaveButton
            onClick={handleSaveClick}
            disabled={!isChanged || createLocation.isPending}
            label={createLocation.isPending ? 'buttons.saving' : 'buttons.save'}
          />
        </div>
      </ActionHeader>

      <div className={css.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: 'Admin', href: '/admin/dashboard' },
            { label: 'Locations', href: '/admin/locations' },
            { label: 'Add Location' },
          ]}
        />
      </div>

      <LocationForm
        ref={formRef}
        mode="create"
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitCreate={handleCreate}
        busy={createLocation.isPending}
        scopedClubId={clubIdParams}
        isClubScoped={isClubScoped}
        defaultValues={{
          clubId: clubIdParams ?? '', // для адміна клубу заповнюєтся з бекенду
        }}
      />

      {createLocation.isPending && <SpinnerOverlay fullscreen={false} />}

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

export default AddLocation;



//============================================


// 'use client';

// import { useRef, useState } from 'react';
// import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
// import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
// import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
// import { useTranslations } from 'next-intl';
// import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';

// import AddLocationForm, {
//   type LocationFormHandle,
//   type LocationFormValues,
// } from '@/app/components/shared/Locations/LocationsForm/LocationsForm';

// // import { useCreateLocation } from '@/services/locations/queries.client'; // <- назву/шлях піджени під свій проект
// // import type { CreateLocationDto } from '@/services/types/locations.dto'; // <- теж підкоригуй при потребі
// import { getApiErrorMessage } from '@/lib/http/utils';
// import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

// import css from './AddLocation.module.scss';

// const AddLocation = () => {
//   const tHeader = useTranslations('ActionHeader');

//   const formRef = useRef<LocationFormHandle | null>(null);
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

// //   const createLocation = useCreateLocation();

//   const handleCreate = async (v: LocationFormValues): Promise<void> => {
//     // const payload: CreateLocationDto = {
//     //   clubId: v.clubId,
//     //   label: v.label || null,
//     //   name: v.name.trim(),
//     //   city: v.city.trim(),
//     //   address: v.address.trim(),

//     //   priceText: v.priceText?.trim() || null,
//     //   order: v.order ?? 1,
//     //   isActive: v.isActive,

//     //   sports: {
//     //     badmintonEnabled: v.sports.badmintonEnabled,
//     //     badmintonCourts: v.sports.badmintonCourts,
//     //     squashEnabled: v.sports.squashEnabled,
//     //     squashCourts: v.sports.squashCourts,
//     //     padelEnabled: v.sports.padelEnabled,
//     //     padelCourts: v.sports.padelCourts,
//     //     pickleballEnabled: v.sports.pickleballEnabled,
//     //     pickleballCourts: v.sports.pickleballCourts,
//     //     tableTennisEnabled: v.sports.tableTennisEnabled,
//     //     tableTennisTables: v.sports.tableTennisTables,
//     //     tennisEnabled: v.sports.tennisEnabled,
//     //     tennisCourts: v.sports.tennisCourts,
//     //   },

//     //   amenities: {
//     //     parking: v.amenities.parking,
//     //     water: v.amenities.water,
//     //     conditioner: v.amenities.conditioner,
//     //     shower: v.amenities.shower,
//     //     wifi: v.amenities.wifi,
//     //   },

//     //   shortDescription: v.shortDescription?.trim() || null,
//     //   workingHours: v.workingHours,
//     // };

//     console.groupCollapsed('➡️ /locations (create) payload');
//     console.log('raw form:', v);
//     // console.log('payload:', payload);
//     console.groupEnd();

//     try {
//     //   const created = await createLocation.mutateAsync(payload);
//       setSnack({
//         open: true,
//         severity: 'success',
//         message: 'Локацію створено',
//       });
//     //   console.log('✅ Location created:', created);
//       setIsChanged(false);
//       // при бажанні тут можна зробити redirect
//     } catch (err) {
//       const msg = getApiErrorMessage(err);
//       setSnack({
//         open: true,
//         severity: 'error',
//         message: msg,
//       });
//       console.error('❌ Create location failed:', msg, err);
//     }
//   };

//   const handleSaveClick = () => {
//     formRef.current?.submit();
//   };

// //   const busy = createLocation.isPending;

//   return (
//     <div className="font-geist-sans">
//       <ActionHeader>
//         <BackButton label="buttons.back" />
//         <h1 className="text-lg font-semibold">
//           {tHeader('title.addLocationHeader')}
//         </h1>
//         <div className="flex flex-wrap gap-2">
//           <SaveButton
//             onClick={handleSaveClick}
//             // disabled={!isChanged || busy}
//             // label={busy ? 'buttons.saving' : 'buttons.save'}
//           />
//         </div>
//       </ActionHeader>

//       <div className={css.wrapperBreadcrumbs}>
//         <AppBreadcrumbs
//           items={[
//             { label: 'Admin', href: '/admin/dashboard' },
//             { label: 'Locations', href: '/admin/locations' },
//             { label: 'Add Location' },
//           ]}
//         />
//       </div>

//       <AddLocationForm
//         ref={formRef}
//         mode="create"
//         isChanged={isChanged}
//         setIsChanged={setIsChanged}
//         onSubmitCreate={handleCreate}
//         // busy={busy}
//       />
// {/* 
//       {busy && <SpinnerOverlay fullscreen={false} />} */}

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
//     </div>
//   );
// };

// export default AddLocation;
