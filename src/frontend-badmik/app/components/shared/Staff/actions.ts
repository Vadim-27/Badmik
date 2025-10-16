
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Admin } from './types';


export async function createAdmin(data: Omit<Admin, 'id'>) {
  
  const created = { id: 'new-id-123' };
  revalidatePath('/admin/admins');
  redirect(`/admin/admins/${created.id}`);
}

export async function updateAdmin(id: string, data: Partial<Admin>) {
  
  revalidatePath(`/admin/admins/${id}`);
  revalidatePath('/admin/admins');
}
