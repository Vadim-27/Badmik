// app/(admin)/admins/AddClub.tsx
'use client';
import { useState } from 'react';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';
import AddClubForm from './AddClubForm/AddClubForm';

const AddClub = () => {
  const [isChanged, setIsChanged] = useState(false);

  const tHeader = useTranslations('ActionHeader');
  const t = useTranslations('AddClubForm');

 
  const handleCreate = async (data: any): Promise<void> => {
    console.log('AddClubForm submitted:', data);
    
    setIsChanged(false);
  };

  
  const handleSaveClick = () => {
    
    document.getElementById('add-club-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    
  };

  return (
    <div className=" font-geist-sans">
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h1 className="text-lg font-semibold">{tHeader('title.addClubHeader')}</h1>
        <div className="flex flex-wrap gap-2">
          <SaveButton
            onClick={() => handleSaveClick()}
            disabled={!isChanged}
            label="buttons.save"
          />
        </div>
      </ActionHeader>

      <AddClubForm
        mode="create"
        onSubmit={handleCreate}   
      />
    </div>
  );
};

export default AddClub;
