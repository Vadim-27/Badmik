

// NewAdminPage.tsx (з react-query)
'use client';

import React, { useRef, useState } from 'react';
import EmployeeForm, { EmployeeFormHandle, FormValues } from '../EmployeeForm/EmployeeForm';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';

import { dateToIsoStartOfDay } from '@/services/users.service';
import type { CreateUserDto } from '@/services/types/users.dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';

import { getApiErrorMessage } from "@/lib/http/utils";

export default function NewAdminPage() {
  const tAH = useTranslations('ActionHeader');
  const formRef = useRef<EmployeeFormHandle | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const qc = useQueryClient();




  const createUser = useMutation({
  mutationKey: ["users", "create"],
  mutationFn: (dto: CreateUserDto) => usersService.create(dto),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["users"] });
   
  },
  onError: (err) => {
    const msg = getApiErrorMessage(err);
    
    alert(msg);
    console.error("Create user failed:", msg, err);
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

  console.log("👉 PAYLOAD на бек:", payload);

  try {
    const res = await createUser.mutateAsync(payload);
    console.log("✅ Відповідь бека:", res);
  } catch (err: any) {
    console.error("❌ Помилка створення користувача:", err.response?.data || err);
  }
};

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.addUserHeader')}</h2>
        <SaveButton
          onClick={() => formRef.current?.submit()}
          disabled={!isChanged || createUser.isPending}
          label={createUser.isPending ? 'buttons.saving' : 'buttons.save'}
        />
      </ActionHeader>

      <EmployeeForm
        ref={formRef}
        mode="create"
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitCreate={handleCreate}
      />
    </>
  );
}



