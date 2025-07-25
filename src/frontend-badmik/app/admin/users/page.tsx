// import { getToken } from '../../lib/auth';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
//   const token = getToken();

//   if (!token || token.role !== 'admin2') {
//     redirect('/');
//   }

  return <h1>Manage Users</h1>;
}
