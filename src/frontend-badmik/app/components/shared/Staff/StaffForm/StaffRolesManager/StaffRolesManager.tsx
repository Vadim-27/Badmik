// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import styles from './StaffRolesManager.module.scss';

// import { useRolesByStaff, useAssignRoleForStaff } from '@/services/role/queries.client';
// import { getApiErrorMessage } from '@/lib/http/utils';

// import RoleSelect from './RoleSelect/RoleSelect';

// function getStatus(err: any): number | null {
//   return err?.response?.status ?? err?.status ?? null;
// }
// function getBackendMessage(err: any): string | null {
//   return err?.response?.data?.message ?? err?.data?.message ?? err?.message ?? null;
// }

// type Props = {
//   staffId: string;
//   clubId?: string | null;
//   onSaved?: () => void;
// };

// export default function StaffRolesManager({ staffId, clubId, onSaved }: Props) {
//   const rolesByStaff = useRolesByStaff(staffId);
//   const assignRole = useAssignRoleForStaff();

//   const staffRolesForbidden = getStatus(rolesByStaff.error) === 403;

//   const assignedRoleId = useMemo(() => {
//     if (staffRolesForbidden) return null;
//     return rolesByStaff.data?.[0]?.id ?? null;
//   }, [rolesByStaff.data, staffRolesForbidden]);

//   const [roleId, setRoleId] = useState<string | null>(null);
//   const [note, setNote] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   useEffect(() => {
//     // при відкритті модалки / при зміні staffId — підставляємо поточну роль
//     setRoleId(assignedRoleId);
//     setNote(null);
//   }, [assignedRoleId, staffId]);

//   const canEdit = Boolean(clubId) && !staffRolesForbidden;

//   const save = async () => {
//     setNote(null);

//     if (!canEdit) return;

//     if (!roleId) {
//       setNote({ type: 'error', text: 'Оберіть роль' });
//       return;
//     }

//     try {
//       await assignRole.mutateAsync({
//         staffId,
//         roleId,
//         clubId: clubId!,
//       });

//       setNote({ type: 'success', text: 'Роль збережено' });
//       onSaved?.();
//     } catch (e: any) {
//       const msg =
//         getBackendMessage(e) ||
//         getApiErrorMessage(e) ||
//         'Не вдалось асайнити роль';
//       setNote({ type: 'error', text: msg });
//     }
//   };

//   return (
//     <div className={styles.root}>
//       <div className={styles.row}>
//         <div className={styles.label}>Role</div>

//         {staffRolesForbidden ? (
//           <div className={styles.forbidden}>У вас нема прав доступу для зміни ролі</div>
//         ) : (
//           <RoleSelect
//             value={roleId}
//             onChange={setRoleId}
//             clubId={clubId}
//             disabled={assignRole.isPending}
//             rootClassName={styles.selectRoot}
//             inputClassName={styles.input}
//             optionsClassName={styles.options}
//             optionClassName={styles.option}
//             optionActiveClassName={styles.optionActive}
//             chevronClassName={styles.chevron}
//           />
//         )}
//       </div>

//       <div className={styles.actions}>
//         <button
//           type="button"
//           className={styles.saveBtn}
//           onClick={save}
//           disabled={!canEdit || assignRole.isPending}
//         >
//           {assignRole.isPending ? 'Saving…' : 'Save role'}
//         </button>
//       </div>

//       {note && (
//         <div className={note.type === 'success' ? styles.ok : styles.err}>
//           {note.text}
//         </div>
//       )}
//     </div>
//   );
// }
