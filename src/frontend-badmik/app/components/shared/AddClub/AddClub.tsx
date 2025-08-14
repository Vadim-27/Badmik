'use client';
import {useState} from 'react';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';

const AddClub = () => {
  const [isChanged, setIsChanged] = useState(false);
  
    const markChanged = () => setIsChanged(true);
  
  
  
    const handleSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
  
      // TODO: логіка відправки даних на бекенд
      console.log({
        
      });
  
      setIsChanged(false); 
    };

  const tHeader = useTranslations('ActionHeader');
  const t = useTranslations('AddClubForm');
  return (
    <div className=" font-geist-sans">
      <ActionHeader>
        <BackButton label="buttons.back"/>
        <h1 className="text-lg font-semibold">{tHeader('title.addClubHeader')}</h1>
        <div className="flex flex-wrap gap-2">
          <SaveButton
            onClick={() => handleSubmit()}
            disabled={!isChanged}
            label="buttons.save"
          />
        </div>
      </ActionHeader>

    

    <section className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl space-y-4">
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input
        type="text"
        placeholder={t('name')}
        className="border p-3 rounded-md"
      />
      <input
        type="number"
        placeholder={t('courts')}
        className="border p-3 rounded-md"
      />
      <input
        type="text"
        placeholder={t('city')}
        className="border p-3 rounded-md md:col-span-2"
      />
      <input
        type="text"
        placeholder={t('address')}
        className="border p-3 rounded-md md:col-span-2"
      />
            {/* <button
              type="submit"
              className="bg-secondary-button text-white py-2 rounded-md md:col-span-2 hover:bg-secondary-button-hover focus:bg-secondary-button-focus"
            >
              Створити зал
            </button> */}
          </form>
        </section>
      </div>
    );
}

export default AddClub;