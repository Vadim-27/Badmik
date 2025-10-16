// // app/(admin)/admins/[adminId]/page.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import EmployeeForm from '../EmployeeForm/EmployeeForm';
// import { updateAdmin } from '../actions';
// import type { Admin } from '../types';
// import { createAdmin } from '../actions';


// import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
// import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
// import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
// import { useTranslations } from 'next-intl';


// // async function getAdmin(id: string): Promise<Admin | null> {
// //   // витяг з БД/джерела
// //   return {
// //     id,
// //     email: 'club2admin@example.com',
// //     role: 'club_admin',
// //     clubId: 'club-2',
// //     permissions: ['club_dashboard', 'manage_bookings'],
// //   };
// // }

// // async function getClubs() {
// //   return [
// //     { id: 'FC Kyiv', name: 'FC Kyiv' },
// //     { id: 'club-2', name: 'Club 2' },
// //     { id: 'club-3', name: 'Club 3' },
// //   ];
// // }

// type Props = { params: { adminId: string } };

// export default  function EditAdminPage( { params }: Props) {
//     const [isChanged, setIsChanged] = useState(false);
//       useEffect(() => {
//     console.log('parent: isChanged =', isChanged);
//   }, [isChanged]);

//     const tAH = useTranslations('ActionHeader');
// //   const [admin, clubs] = await Promise.all([getAdmin(params.adminId), getClubs()]);
// //   if (!admin) return <div>Адміністратора не знайдено</div>;

//   return (
//     <>
//       <ActionHeader>
//               <BackButton label="buttons.back" />
//               <h2 className="text-lg font-semibold">{tAH('title.editUserHeader')}</h2>
//               <SaveButton 
//             //   onClick={handleSubmitFromChild} 
//             //   form="employee-form" 
//               disabled={!isChanged}  
//               label="buttons.save" />
//             </ActionHeader>
//         <EmployeeForm
//         setIsChanged={setIsChanged}
//         isChanged={isChanged}
//               mode="create"
//               onSubmitUpdate={updateAdmin}
//             //   onSubmitCreate={async (values) => {
//             //     await createAdmin({
//             //       email: values.email,
//             //       password: values.password!,     // у create обовʼязковий
//             //       role: values.role,
//             //       clubId: values.role === 'club_admin' ? values.clubId : undefined,
//             //       permissions: values.permissions,
//             //     });
//             //   }}
//             //   onSubmitUpdate={async () => {}}
//             />
//     </>
//   );
// }

//================================================================================



'use client';

import React, { useRef, useState, useEffect } from 'react';
import StaffForm, { StaffFormHandle, FormValues } from '../StaffForm/StaffForm';
import { updateAdmin } from '../actions';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import { useTranslations } from 'next-intl';

// type Props = { params: { adminId: string } };

export default function EditStaff() {
  const tAH = useTranslations('ActionHeader');
  const formRef = useRef<StaffFormHandle | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    console.log('parent: isChanged =', isChanged);
  }, [isChanged]);



  const handleUpdate = async (id: string, data: FormValues) => {
  console.log('Form submitted (parent):', data);
 
  return;
};

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.editUserHeader')}</h2>
        <SaveButton
          onClick={() => formRef.current?.submit()}
          disabled={!isChanged}
          label="buttons.save"
        />
      </ActionHeader>

      <StaffForm
        ref={formRef}
        mode="edit"
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitUpdate={handleUpdate}
      />
    </>
  );
}

