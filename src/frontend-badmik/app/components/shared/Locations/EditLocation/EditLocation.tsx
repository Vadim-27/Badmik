'use client';

import React, { useRef, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTranslations } from 'next-intl';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

import LocationForm, {
  type LocationFormHandle,
  type LocationFormValues,
  type LocationLabel,
} from '@/app/components/shared/Locations/LocationsForm/LocationsForm';

import type { Location, UpdateLocationDto } from '@/services/types/locations.dto';
import { useLocationById, useUpdateLocation } from '@/services/locations/queries.client';
import { getApiErrorMessage } from '@/lib/http/utils';
import { buildHrefServer } from '@/lib/club-scope.server';

import css from './EditLocation.module.scss';

type Props = {
  locationId: string;
  initialData: Location;
  clubId?: string;
};

/** helper: з DTO → у форму */
function mapFromDtoToForm(dto: Location): LocationFormValues {
  // sports → окремі прапорці + кількість кортів
  const sports = dto.sports ?? [];
  const findSport = (type: string) => sports.find((s) => s.sportType === type);

  const badminton = findSport('Badminton');
  const squash = findSport('Squash');
  const padel = findSport('Padel');
  const pickleball = findSport('Pickleball');
  const tableTennis = findSport('TableTennis');
  const tennis = findSport('Tennis');

  // amenities → boolean-поля
  const amenitiesSet = new Set(dto.amenities ?? []);

  const label: LocationLabel | '' =
    (dto.label as LocationLabel) && dto.label !== 'None'
      ? (dto.label as LocationLabel)
      : '';

  return {
    clubId: dto.clubId,
    label,
    name: dto.name ?? '',
    city: dto.city ?? '',
    address: dto.address ?? '',
    priceText: dto.priceText ?? '',
    order: dto.order ?? 1,
    isActive: dto.isActive,

    sports: {
      badmintonEnabled: Boolean(badminton),
      badmintonCourts: badminton?.courtCount ?? 0,
      squashEnabled: Boolean(squash),
      squashCourts: squash?.courtCount ?? 0,
      padelEnabled: Boolean(padel),
      padelCourts: padel?.courtCount ?? 0,
      pickleballEnabled: Boolean(pickleball),
      pickleballCourts: pickleball?.courtCount ?? 0,
      tableTennisEnabled: Boolean(tableTennis),
      tableTennisTables: tableTennis?.courtCount ?? 0,
      tennisEnabled: Boolean(tennis),
      tennisCourts: tennis?.courtCount ?? 0,
    },

    amenities: {
      parking: amenitiesSet.has('Parking'),
      water: amenitiesSet.has('Water'),
      conditioner: amenitiesSet.has('AirConditioning'),
      shower: amenitiesSet.has('Shower'),
      wifi: amenitiesSet.has('WiFi'),
    },

    shortDescription: dto.description ?? '',
    workingHours: dto.workingHours,
  };
}

export default function EditLocation({ locationId, initialData, clubId }: Props) {
  const tAH = useTranslations('ActionHeader');

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

  // підтягнути локацію ще раз на клієнті (з initialData)
  const q = useLocationById(locationId, {
    initialData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const location = (q.data ?? initialData) as Location;
  const defaultValues: LocationFormValues = mapFromDtoToForm(location);

  const updateLocation = useUpdateLocation();

  const handleUpdate = async (_id: string, v: LocationFormValues) => {
    // мапимо форму → UpdateLocationDto
    const sports: UpdateLocationDto['sports'] = [];

    if (v.sports.badmintonEnabled) {
      sports.push({
        sportType: 'Badminton',
        courtCount: Number(v.sports.badmintonCourts) || 0,
      });
    }
    if (v.sports.squashEnabled) {
      sports.push({
        sportType: 'Squash',
        courtCount: Number(v.sports.squashCourts) || 0,
      });
    }
    if (v.sports.padelEnabled) {
      sports.push({
        sportType: 'Padel',
        courtCount: Number(v.sports.padelCourts) || 0,
      });
    }
    if (v.sports.pickleballEnabled) {
      sports.push({
        sportType: 'Pickleball',
        courtCount: Number(v.sports.pickleballCourts) || 0,
      });
    }
    if (v.sports.tableTennisEnabled) {
      sports.push({
        sportType: 'TableTennis',
        courtCount: Number(v.sports.tableTennisTables) || 0,
      });
    }
    if (v.sports.tennisEnabled) {
      sports.push({
        sportType: 'Tennis',
        courtCount: Number(v.sports.tennisCourts) || 0,
      });
    }

    const amenities: UpdateLocationDto['amenities'] = [];
    if (v.amenities.parking) amenities.push('Parking');
    if (v.amenities.water) amenities.push('Water');
    if (v.amenities.conditioner) amenities.push('AirConditioning');
    if (v.amenities.shower) amenities.push('Shower');
    if (v.amenities.wifi) amenities.push('WiFi');

    const payload: UpdateLocationDto = {
      clubId: v.clubId,
      name: v.name?.trim() || null,
      city: v.city?.trim() || null,
      address: v.address?.trim() || null,
      label: v.label || 'None',
      isActive: v.isActive,
      order: v.order ?? 1,
      priceText: v.priceText?.trim() || null,
      description: v.shortDescription?.trim() || null,
      logo: null, // поки що без логотипа
      amenities,
      sports,
      workingHours: v.workingHours,
    };

    console.groupCollapsed('➡️ /locations/{id} (update)');
    console.log('raw form:', v);
    console.log('payload:', payload);
    console.groupEnd();

    try {
      await updateLocation.mutateAsync({ id: locationId, dto: payload });

      setSnack({
        open: true,
        severity: 'success',
        message: 'Зміни локації збережено',
      });
      setIsChanged(false);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      console.error('❌ Update location failed:', msg, err);
      setSnack({
        open: true,
        severity: 'error',
        message: msg,
      });
    }
  };

  const anyPending = updateLocation.isPending;
  const Locations = buildHrefServer(clubId, '/locations');

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">
          {tAH('title.editLocationHeader') ?? 'Edit Location'}
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
            { label: 'Locations', href: Locations },
            { label: 'Edit Location' },
          ]}
        />
      </div>

      <LocationForm
        ref={formRef}
        mode="edit"
        locationId={locationId}
        defaultValues={defaultValues}
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitUpdate={handleUpdate}
        busy={anyPending}
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
