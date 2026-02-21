

import Header from '@/app/components/shared/Header/Header';
import Sidebar from '@/app/components/shared/Sidebar/Sidebar';


import ClientOnly from '@/lib/client-only';

import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';
import { clubsServerQueries } from '@/services/clubs/queries.server';

export default async function  AdminLayout({ children }: { children: React.ReactNode }) {

  const state = await prefetch([ clubsServerQueries.list() ]);
  return (
    <div className="containerPage bg-f3f4f6">
 
    <div className=" flex ">
       
      {/* <ClientOnly> */}
        <Sidebar />
      {/* </ClientOnly> */}
      <RQHydrate state={state}>
      <main className="w-full font-geist-sans">{children}</main>
      </RQHydrate>
      </div>
    </div>
  );
}