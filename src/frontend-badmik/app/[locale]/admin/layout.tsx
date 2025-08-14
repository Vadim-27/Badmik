

import Sidebar from '@/app/components/shared/Sidebar/Sidebar';


import ClientOnly from '@/app/lib/client-only';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex ">
      <ClientOnly>
        <Sidebar />
      </ClientOnly>
      <main className="w-full font-geist-sans">{children}</main>
    </div>
  );
}