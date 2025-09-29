
'use client';

import React, { useRef, useState } from 'react';
import EmployeeForm, { EmployeeFormHandle, FormValues } from '../EmployeeForm/EmployeeForm';
import { createAdmin } from '../actions';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import { useTranslations } from 'next-intl';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';

export default function NewAdminPage() {
  const tAH = useTranslations('ActionHeader');


  const formRef = useRef<EmployeeFormHandle | null>(null);
  const [isChanged, setIsChanged] = useState(false);

 

  
  const handleCreate = async (data: FormValues): Promise<void> => {
    console.log('Form submitted (parent):', data);
   
    return;
  };

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.addUserHeader')}</h2>
        <SaveButton
          onClick={() => formRef.current?.submit()}
          disabled={!isChanged}
          label="buttons.save"
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


