'use client';
import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Button } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import DeleteButton from '@/app/components/ui/Buttons/DeleteButton/DeleteButton';
import { ConfirmDialog } from '@/app/components/ui/DeleteModal/ConfirmDialog';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';

type User = {
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

type UserDetailProps = {
  user: User;
};

const UserDetail: React.FC<UserDetailProps> = ({ user }) => {
  const [isEditingAll, setIsEditingAll] = useState(false);

  const [editedUser, setEditedUser] = useState<User>(user);

  const [editingField, setEditingField] = useState<string | null>(null);
  const readonlyFields: (keyof User)[] = ['createdAt', 'doB'];
  // ===========================================
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [form, setForm] = useState(user);
  const [isChanged, setIsChanged] = useState(false);

  const tAH = useTranslations('ActionHeader');
  const t = useTranslations('UserCard');

  const handleChange = (key: keyof User, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setIsChanged(true);
  };

  const handleSave = () => {
    console.log('Збережено:', form);

    setIsChanged(false);
  };

  const handleDeleteClick = () => {
    setSelectedUser(user.id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      // API delete logic
      console.log('User видалено:', selectedUser);
      setOpenConfirm(false);
    }
  };

  const handleEditAllToggle = () => {
    setIsEditingAll(!isEditingAll);
    setEditingField(null);
    setEditedUser(user);
  };

  const handleFieldChange = (field: keyof User, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveField = (field: keyof User) => {
    setEditingField(null);
  };

  const handleSaveAll = () => {
    setIsEditingAll(false);
  };

  const fields: (keyof User)[] = [
    'firstName',
    'lastName',
    'email',
    'level',
    'role',
    'club',
    'createdAt',
    'doB',
  ];

  return (
    <div>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.editUserHeader')}</h2>
        <div className="flex flex-wrap gap-2">
          <SaveButton onClick={handleSave} disabled={!isChanged} label="buttons.save" />
          {/* <EditButton href={`/admin/${user.id}/edit`} label="Редагувати" /> */}
          <DeleteButton onClick={handleDeleteClick} label="buttons.delete" />
        </div>
      </ActionHeader>

      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl space-y-4">
        <ul className="space-y-4">
          {fields.map((field) => (
            <li key={field} className="flex justify-between items-center">
              <span className="font-medium w-1/3">
                {t(field)}
              </span>

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

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={t('ConfirmDialog.title')}
        description={t('ConfirmDialog.description')}
      />
    </div>
  );
};

export default UserDetail;
