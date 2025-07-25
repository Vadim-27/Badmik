// import { getToken, isFullAdmin } from '../../lib/auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
//   const token = getToken();
//   if (!isFullAdmin(token)) {
//     redirect('/');
//   }

  return <h1>Admin Settings (Full Access)</h1>;
}
