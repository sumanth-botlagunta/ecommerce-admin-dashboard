import prismadb from '@/lib/prismaDB';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { SettingsForm } from '@/components/settings-form';

const Settings = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  if (!userId) redirect('sign-in');

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) redirect('/');

  return (
    <div className="flex-col">
      <div className="flex-1 gap-2 p-8 pt-5">
        <SettingsForm intialData={store} />
      </div>
    </div>
  );
};

export default Settings;
