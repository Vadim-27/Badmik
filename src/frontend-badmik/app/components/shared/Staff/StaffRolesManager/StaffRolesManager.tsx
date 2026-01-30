

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './StaffRolesManager.module.scss';

import { useRolesByStaff, useAssignRoleForStaff } from '@/services/role/queries.client';
import { getApiErrorMessage } from '@/lib/http/utils';

import RoleSelect from './RoleSelect/RoleSelect';

function getStatus(err: any): number | null {
  return err?.response?.status ?? err?.status ?? null;
}
function getBackendMessage(err: any): string | null {
  return err?.response?.data?.message ?? err?.data?.message ?? err?.message ?? null;
}

type Props = {
  staffId: string;
  clubId?: string | null;
  onClose?: () => void;     // щоб модалка могла закритися після save/cancel
  onSaved?: () => void;     // якщо треба invalidate/refresh зовні
};

export default function StaffRolesManager({ staffId, clubId, onClose, onSaved }: Props) {
  console.log('StaffRolesManager clubId', clubId);
  console.log('StaffRolesManager staffId', staffId);
  const rolesByStaff = useRolesByStaff(staffId);
  const assignRole = useAssignRoleForStaff();

  const staffRolesForbidden = getStatus(rolesByStaff.error) === 403;

  const assignedRoleId = useMemo(() => {
    if (staffRolesForbidden) return null;
    return rolesByStaff.data?.[0]?.id ?? null;
  }, [rolesByStaff.data, staffRolesForbidden]);

  const [roleId, setRoleId] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setRoleId(assignedRoleId);
    setTouched(false);
    setNote(null);
  }, [assignedRoleId, staffId]);

  const canEdit = Boolean(clubId) && !staffRolesForbidden;
  const busy = assignRole.isPending;

  const errorText = useMemo(() => {
    if (!touched) return null;
    if (!canEdit) return null;
    if (!roleId) return 'Оберіть роль';
    return null;
  }, [touched, roleId, canEdit]);

  const handleSave = async () => {
    setTouched(true);
    setNote(null);

    if (!canEdit) return;
    if (!roleId) return;

    const payload = {
    clubId: clubId!,
    staffId,
    roleId,
  };

  console.log('[AssignRole] payload →', payload);

    try {
      await assignRole.mutateAsync(payload);
      console.log('[AssignRole] success');
      onSaved?.();
      onClose?.();
    } catch (e: any) {
      const msg =
        getBackendMessage(e) ||
        getApiErrorMessage(e) ||
        'Не вдалось асайнити роль';
      setNote(msg);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        <label className={styles.label}>Role</label>

        {staffRolesForbidden ? (
          <div className={styles.forbidden}>
            У вас нема прав доступу для зміни ролі
          </div>
        ) : (
          <div className={`${styles.inputWrap} ${touched && errorText ? styles.error : ''}`}>
            <RoleSelect
              value={roleId}
              onChange={(v) => {
                setRoleId(v);
                setTouched(true);
              }}
              clubId={clubId}
              disabled={busy}
              rootClassName={styles.selectRoot}
              inputClassName={styles.input}
              optionsClassName={styles.options}
              optionClassName={styles.option}
              optionActiveClassName={styles.optionActive}
              chevronClassName={styles.chevron}
            />
          </div>
        )}

        {!staffRolesForbidden && touched && errorText && (
          <p className={styles.errorText}>{errorText}</p>
        )}

        {note && <p className={styles.errorText}>{note}</p>}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={onClose}
          disabled={busy}
        >
          Cancel
        </button>

        <button
          type="button"
          className={styles.btnPrimary}
          onClick={handleSave}
          disabled={!canEdit || busy}
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

