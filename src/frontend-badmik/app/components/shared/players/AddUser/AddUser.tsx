
// AddUser.tsx (з react-query)
'use client';

import React, { useRef, useState } from 'react';
import UserForm, { UserFormHandle, FormValues } from '../UserForm/UserForm';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';

import { dateToIsoStartOfDay } from '@/services/users.service';
import type { CreateUserDto } from '@/services/types/users.dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';

import { getApiErrorMessage } from "@/lib/http/utils";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function AddUser() {
  const tAH = useTranslations('ActionHeader');
  const formRef = useRef<UserFormHandle | null>(null);
  const [isChanged, setIsChanged] = useState(false);
   const [snack, setSnack] = useState<{ open: boolean; severity: 'success'|'error'; message: string }>({ open: false, severity: 'success', message: '' });
  const qc = useQueryClient();

  const createUser = useMutation({
    mutationKey: ['users', 'create'],
    mutationFn: (dto: CreateUserDto) => usersService.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setSnack({ open: true, severity: 'success', message: 'Користувача створено' });
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err);
      setSnack({ open: true, severity: 'error', message: msg });

     
      const emailTaken =
        msg.toLowerCase().includes('email') &&
        (msg.toLowerCase().includes('already in use') || msg.toLowerCase().includes('використовується'));

      if (emailTaken) {
        formRef.current?.setFieldError?.('email', 'Email вже використовується');
      }
    },
  });

 
  const handleCreate = async (v: FormValues): Promise<void> => {
  console.log("👉 СИРІ ДАНІ з форми:", v);

  const payload: CreateUserDto = {
    email: v.email,
    password: v.password,
    firstName: v.firstName,
    lastName: v.lastName,
    clubId: v.clubId || undefined,
    doB: dateToIsoStartOfDay(v.doB),
  };

 

try {
  await createUser.mutateAsync(payload);
} catch (err) {
  const msg = getApiErrorMessage(err);
  setSnack({ open: true, severity: 'error', message: msg });
  
  throw err; 
}
};

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.addPlayerHeader')}</h2>
        <SaveButton
          onClick={() => formRef.current?.submit()}
          disabled={!isChanged || createUser.isPending}
          label={createUser.isPending ? 'buttons.saving' : 'buttons.save'}
        />
      </ActionHeader>

      <UserForm
        ref={formRef}
        mode="create"
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitCreate={handleCreate}
        busy={createUser.isPending}
      />
       <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}



