'use client';
import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import DeleteButton from '@/app/components/ui/Buttons/DeleteButton/DeleteButton';
import { ConfirmDialog } from '@/app/components/ui/DeleteModal/ConfirmDialog';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';

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
                    <BackButton />
                    <h2 className="text-lg font-semibold">{user.firstName}</h2>
                    <div className="flex flex-wrap gap-2">
                         <SaveButton
                                    onClick={handleSave}
                                    disabled={!isChanged}
                                    label="Зберегти зміни"
                                  />
                      {/* <EditButton href={`/admin/${user.id}/edit`} label="Редагувати" /> */}
                      <DeleteButton onClick={handleDeleteClick} label="Видалити" />
                    </div>
                  </ActionHeader>
        <Box
            sx={{
                position: 'relative',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '40px auto 0',
                maxWidth: 700,
                border: '1px solid #ccc',
                borderRadius: 2,
                p: 3,
            }}
        >
            <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
                {isEditingAll ? (
                    <>
                        <Button size="small" onClick={handleSaveAll} variant="contained" sx={{ mr: 1 }}>
                            Зберегти
                        </Button>
                        <Button size="small" onClick={handleEditAllToggle} variant="outlined">
                            Відмінити
                        </Button>
                    </>
                ) : (
                    <Button size="small" onClick={handleEditAllToggle} startIcon={<EditIcon />}>
                        Редагувати
                    </Button>
                )}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    minHeight: 400,
                    p: 3,
                }}
            >
               

                <Box sx={{ flex: 1 }}>
                    {fields.map((field) => {
                        const isFieldEditing = isEditingAll || editingField === field;
                        const isReadonly = readonlyFields.includes(field);

                        return (
                            <Box
                            key={field} 
                            
                            sx={{
                                display: 'flex', border:
                                    !isEditingAll && editingField === field
                                        ? '2px solid var(--color-primary-border)'
                                        : 'none',
                                borderRadius: 1,
                                transition: 'border 0.2s',
                                px: 3
                            }}
                            
                            >

                                <Box
                                    // key={field}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '40%',
                                        height: 56,
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </Typography>
                                </Box>



                                <Box
                                    // key={field}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: 56,
                                        py: 1,
                                        px: 1,

                                    }}
                                >
                                    {isFieldEditing && !isReadonly ? (
                                        <>
                                            <TextField
                                                size="small"
                                                value={editedUser[field]}
                                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                                sx={{ flex: 1 }}
                                            />
                                            {!isEditingAll && (
                                                <Box sx={{ display: 'flex', ml: 'auto' }}>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleSaveField(field)}
                                                        aria-label="save"
                                                    >
                                                        <SaveIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() => setEditingField(null)}
                                                        aria-label="cancel"
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Typography sx={{ flex: 1 }}>{editedUser[field]}</Typography>
                                            {!isEditingAll && !isReadonly && (
                                                <Box sx={{ display: 'flex', ml: 'auto' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setEditingField(field)}
                                                        aria-label="edit-field"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
         <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Видалити Юзера"
                description="Ви дійсно хочете видалити цього Юзера? Цю дію неможливо скасувати."
              />
        </div>
    );
};

export default UserDetail;

