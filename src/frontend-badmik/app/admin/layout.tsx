

import Sidebar from '@/app/components/shared/Sidebar/Sidebar';


import ClientOnly from '@/app/lib/client-only';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout flex h-screen">
      <ClientOnly>
        <Sidebar />
      </ClientOnly>
      <main>{children}</main>
    </div>
  );
}