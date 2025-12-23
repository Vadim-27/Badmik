'use client';

import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import DeleteButton from '@/app/components/ui/Buttons/DeleteButton/DeleteButton';
// import { ConfirmDialog } from '@/app/components/ui/DeleteModal/ConfirmDialog';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';

import { usePlayerById } from '@/services/players/queries.client';
import { getApiErrorMessage } from '@/lib/http/utils'; // якщо є утиліта

type Player = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  level: string;
  role: string;
  club: string;
  createdAt: string;
  doB: string;
};

type PlayerDetailProps = { playerId: string };

const PlayerDetail: React.FC<PlayerDetailProps> = ({ playerId }) => {
  const { data: player, isLoading, isError, error } = usePlayerById(playerId, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const [isEditingAll, setIsEditingAll] = useState(false);
  const [editedUser, setEditedUser] = useState<Player | null>(null);

  const [editingField, setEditingField] = useState<string | null>(null);
  const readonlyFields: (keyof Player)[] = ['createdAt', 'doB'];

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [form, setForm] = useState<Player | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  const tAH = useTranslations('ActionHeader');
  const t = useTranslations('UserCard');

  // ініціалізуємо локальний стан коли прийшли дані
  useEffect(() => {
    if (player) {
      const p = player as unknown as Player;
      setForm(p);
      setEditedUser(p);
    }
  }, [player]);

  const handleChange = (key: keyof Player, value: string | number) => {
    if (!form) return;
    setForm((prev) => (prev ? { ...prev, [key]: value } as Player : prev));
    setIsChanged(true);
  };

  const handleSave = () => {
    if (!form) return;
    console.log('Збережено:', form);
    setIsChanged(false);
  };

  const handleDeleteClick = () => {
    if (!player) return;
    setSelectedUser((player as unknown as Player).id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      console.log('User видалено:', selectedUser);
      setOpenConfirm(false);
    }
  };

  const handleEditAllToggle = () => {
    setIsEditingAll(!isEditingAll);
    setEditingField(null);
    if (player) setEditedUser(player as unknown as Player);
  };

  const handleFieldChange = (field: keyof Player, value: string) => {
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveField = (_field: keyof Player) => setEditingField(null);
  const handleSaveAll = () => setIsEditingAll(false);

  const fields: (keyof Player)[] = [
    'firstName',
    'lastName',
    'email',
    'level',
    'role',
    'club',
    'createdAt',
    'doB',
  ];

  // ---- states -------------------------------------------------------------
  if (isLoading && !isError) return <div>Loading...</div>;

  if (isError) {
    const msg =
      typeof getApiErrorMessage === 'function'
        ? getApiErrorMessage(error)
        : (error as any)?.message ?? 'Failed to load player';
    return (
      <div className="p-6">
        <ActionHeader>
          <BackButton label="buttons.back" />
          <h2 className="text-lg font-semibold">{tAH('title.editUserHeader')}</h2>
        </ActionHeader>
        <div className="text-red-600">{msg}</div>
      </div>
    );
  }

  if (!form) return <div>User not found</div>;
  // ------------------------------------------------------------------------

  return (
    <div>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.editUserHeader')}</h2>
        <div className="flex flex-wrap gap-2">
          <SaveButton onClick={handleSave} disabled={!isChanged} label="buttons.save" />
          <DeleteButton onClick={handleDeleteClick} label="buttons.delete" />
        </div>
      </ActionHeader>

      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl space-y-4">
        <ul className="space-y-4">
          {fields.map((field) => (
            <li key={field} className="flex justify-between items-center">
              <span className="font-medium w-1/3">{t(field)}</span>

              {field === 'level' ? (
                <Select
                  value={form.level}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-2/3 bg-white"
                  size="small"
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              ) : field === 'createdAt' || field === 'doB' ? (
                <span className="w-2/3 p-2">{form[field]}</span>
              ) : (
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-2/3 p-2 border rounded"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={t('ConfirmDialog.title')}
        description={t('ConfirmDialog.description')}
      /> */}
    </div>
  );
};

export default PlayerDetail;
